import * as vscode from 'vscode';
import { simpleGit, SimpleGit, LogResult } from 'simple-git';
import { CommitInfo } from './changelogGenerator';

export class GitService {
    private git: SimpleGit | null = null;

    /**
     * 获取Git提交信息
     */
    async getCommits(repoPath: string): Promise<CommitInfo[]> {
        try {
            this.git = simpleGit(repoPath);
            
            // 检查是否是Git仓库
            const isRepo = await this.git.checkIsRepo();
            if (!isRepo) {
                throw new Error('当前目录不是Git仓库');
            }

            // 获取配置的提交范围
            const config = vscode.workspace.getConfiguration('debianChangelog');
            const commitRange = config.get('gitCommitRange', 'HEAD~10..HEAD');
            
            // 获取提交日志
            const log: LogResult = await this.git.log({
                from: this.parseCommitRange(commitRange).from,
                to: this.parseCommitRange(commitRange).to,
                maxCount: 50 // 限制最大提交数
            });

            const commits: CommitInfo[] = [];
            
            for (const commit of log.all) {
                // 获取该提交修改的文件列表
                const files = await this.getCommitFiles(commit.hash);
                
                // 提取Issue引用
                const issueRefs = this.extractIssueReferences(commit.message);
                
                commits.push({
                    hash: commit.hash,
                    message: commit.message,
                    author: commit.author_name,
                    date: new Date(commit.date),
                    files: files,
                    issueRefs: issueRefs
                });
            }

            return commits;
        } catch (error) {
            console.error('获取Git提交失败:', error);
            throw new Error(`获取Git提交失败: ${error}`);
        }
    }

    /**
     * 获取指定提交修改的文件列表
     */
    private async getCommitFiles(commitHash: string): Promise<string[]> {
        try {
            if (!this.git) {
                return [];
            }

            const diff = await this.git.diff([
                `${commitHash}^`,
                commitHash,
                '--name-only'
            ]);

            return diff.split('\n').filter((file: string) => file.trim() !== '');
        } catch (error) {
            console.error('获取提交文件列表失败:', error);
            return [];
        }
    }

    /**
     * 从提交消息中提取Issue引用
     */
    private extractIssueReferences(message: string): string[] {
        const issuePatterns = [
            /#(\d+)/g,                    // #123
            /(?:fixes?|closes?|resolves?)\s+#(\d+)/gi,  // fixes #123
            /(?:refs?|references?)\s+#(\d+)/gi,         // refs #123
        ];

        const issues: string[] = [];
        
        for (const pattern of issuePatterns) {
            let match;
            while ((match = pattern.exec(message)) !== null) {
                const issueNumber = `#${match[1]}`;
                if (!issues.includes(issueNumber)) {
                    issues.push(issueNumber);
                }
            }
        }

        return issues;
    }

    /**
     * 解析提交范围
     */
    private parseCommitRange(range: string): { from: string; to: string } {
        if (range.includes('..')) {
            const [from, to] = range.split('..');
            return { from: from || 'HEAD~10', to: to || 'HEAD' };
        } else {
            // 如果没有范围，默认获取最近的提交
            return { from: `${range}~10`, to: range };
        }
    }

    /**
     * 获取远程仓库URL
     */
    async getRemoteUrl(repoPath: string): Promise<string | null> {
        try {
            this.git = simpleGit(repoPath);
            const remotes = await this.git.getRemotes(true);
            
            // 优先获取origin远程仓库
            const origin = remotes.find((remote: any) => remote.name === 'origin');
            if (origin && origin.refs && origin.refs.fetch) {
                return origin.refs.fetch;
            }
            
            // 如果没有origin，返回第一个远程仓库
            if (remotes.length > 0 && remotes[0].refs && remotes[0].refs.fetch) {
                return remotes[0].refs.fetch;
            }
            
            return null;
        } catch (error) {
            console.error('获取远程仓库URL失败:', error);
            return null;
        }
    }

    /**
     * 检测仓库类型（GitHub, GitLab等）
     */
    detectRepoType(remoteUrl: string): 'github' | 'gitlab' | 'other' {
        if (remoteUrl.includes('github.com')) {
            return 'github';
        } else if (remoteUrl.includes('gitlab.com') || remoteUrl.includes('gitlab.')) {
            return 'gitlab';
        } else {
            return 'other';
        }
    }

    /**
     * 从远程URL提取仓库信息
     */
    parseRepoInfo(remoteUrl: string): { owner: string; repo: string } | null {
        try {
            // 处理HTTPS URL: https://github.com/owner/repo.git
            let match = remoteUrl.match(/https?:\/\/[^/]+\/([^/]+)\/([^/]+?)(\.git)?$/);
            if (match) {
                return { owner: match[1], repo: match[2] };
            }

            // 处理SSH URL: git@github.com:owner/repo.git
            match = remoteUrl.match(/git@[^:]+:([^/]+)\/([^/]+?)(\.git)?$/);
            if (match) {
                return { owner: match[1], repo: match[2] };
            }

            return null;
        } catch (error) {
            console.error('解析仓库信息失败:', error);
            return null;
        }
    }

    /**
     * 获取当前分支名
     */
    async getCurrentBranch(repoPath: string): Promise<string> {
        try {
            this.git = simpleGit(repoPath);
            const status = await this.git.status();
            return status.current || 'main';
        } catch (error) {
            console.error('获取当前分支失败:', error);
            return 'main';
        }
    }

    /**
     * 获取最新标签
     */
    async getLatestTag(repoPath: string): Promise<string | null> {
        try {
            this.git = simpleGit(repoPath);
            const tags = await this.git.tags(['--sort=-version:refname']);
            return tags.latest || null;
        } catch (error) {
            console.error('获取最新标签失败:', error);
            return null;
        }
    }

    /**
     * 检查工作区是否干净
     */
    async isWorkingDirectoryClean(repoPath: string): Promise<boolean> {
        try {
            this.git = simpleGit(repoPath);
            const status = await this.git.status();
            return status.files.length === 0;
        } catch (error) {
            console.error('检查工作区状态失败:', error);
            return false;
        }
    }
}