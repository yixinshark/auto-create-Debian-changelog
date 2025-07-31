import * as vscode from 'vscode';
import axios, { AxiosResponse } from 'axios';
import { CommitInfo, IssueInfo } from './changelogGenerator';
import { GitService } from './gitService';

interface GitHubIssue {
    number: number;
    title: string;
    labels: Array<{ name: string; color: string }>;
    html_url: string;
    state: string;
}

interface GitLabIssue {
    iid: number;
    title: string;
    labels: string[];
    web_url: string;
    state: string;
}

export class IssueService {
    private gitService: GitService;
    private config: vscode.WorkspaceConfiguration;

    constructor() {
        this.gitService = new GitService();
        this.config = vscode.workspace.getConfiguration('debianChangelog');
    }

    /**
     * 为提交信息添加Issue详情
     */
    async enrichCommitsWithIssues(commits: CommitInfo[]): Promise<CommitInfo[]> {
        // 检查是否启用Issue详情功能
        const includeIssueDetails = this.config.get('includeIssueDetails', true);
        if (!includeIssueDetails) {
            return commits;
        }

        try {
            // 获取仓库信息
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders || workspaceFolders.length === 0) {
                return commits;
            }

            const repoPath = workspaceFolders[0].uri.fsPath;
            const remoteUrl = await this.gitService.getRemoteUrl(repoPath);
            
            if (!remoteUrl) {
                console.log('无法获取远程仓库URL，跳过Issue详情获取');
                return commits;
            }

            const repoType = this.gitService.detectRepoType(remoteUrl);
            const repoInfo = this.gitService.parseRepoInfo(remoteUrl);

            if (!repoInfo) {
                console.log('无法解析仓库信息，跳过Issue详情获取');
                return commits;
            }

            // 收集所有需要查询的Issue编号
            const allIssueRefs = new Set<string>();
            for (const commit of commits) {
                if (commit.issueRefs) {
                    commit.issueRefs.forEach(ref => allIssueRefs.add(ref));
                }
            }

            if (allIssueRefs.size === 0) {
                return commits;
            }

            // 批量获取Issue详情
            const issueDetails = await this.fetchIssueDetails(
                Array.from(allIssueRefs),
                repoType,
                repoInfo
            );

            // 将Issue详情添加到对应的提交中
            for (const commit of commits) {
                if (commit.issueRefs && commit.issueRefs.length > 0) {
                    commit.issueDetails = commit.issueRefs
                        .map(ref => issueDetails.get(ref))
                        .filter(issue => issue !== undefined) as IssueInfo[];
                }
            }

            return commits;
        } catch (error) {
            console.error('获取Issue详情失败:', error);
            vscode.window.showWarningMessage(`获取Issue详情失败: ${error}`);
            return commits;
        }
    }

    /**
     * 批量获取Issue详情
     */
    private async fetchIssueDetails(
        issueRefs: string[],
        repoType: 'github' | 'gitlab' | 'other',
        repoInfo: { owner: string; repo: string }
    ): Promise<Map<string, IssueInfo>> {
        const results = new Map<string, IssueInfo>();

        if (repoType === 'github') {
            await this.fetchGitHubIssues(issueRefs, repoInfo, results);
        } else if (repoType === 'gitlab') {
            await this.fetchGitLabIssues(issueRefs, repoInfo, results);
        }

        return results;
    }

    /**
     * 获取GitHub Issue详情
     */
    private async fetchGitHubIssues(
        issueRefs: string[],
        repoInfo: { owner: string; repo: string },
        results: Map<string, IssueInfo>
    ): Promise<void> {
        const token = this.config.get('github.token', '');
        const headers: any = {
            'User-Agent': 'VSCode-Debian-Changelog',
            'Accept': 'application/vnd.github.v3+json'
        };

        if (token) {
            headers['Authorization'] = `token ${token}`;
        }

        for (const issueRef of issueRefs) {
            try {
                const issueNumber = issueRef.replace('#', '');
                const url = `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/issues/${issueNumber}`;
                
                const response: AxiosResponse<GitHubIssue> = await axios.get(url, {
                    headers,
                    timeout: 10000
                });

                if (response.status === 200) {
                    const issue = response.data;
                    const issueInfo: IssueInfo = {
                        number: issueRef,
                        title: issue.title,
                        type: this.determineIssueType(issue.labels.map((l: any) => l.name)),
                        url: issue.html_url
                    };
                    results.set(issueRef, issueInfo);
                }
            } catch (error) {
                console.error(`获取GitHub Issue ${issueRef} 失败:`, error);
                // 继续处理其他Issue
            }
        }
    }

    /**
     * 获取GitLab Issue详情
     */
    private async fetchGitLabIssues(
        issueRefs: string[],
        repoInfo: { owner: string; repo: string },
        results: Map<string, IssueInfo>
    ): Promise<void> {
        const token = this.config.get('gitlab.token', '');
        const headers: any = {
            'User-Agent': 'VSCode-Debian-Changelog'
        };

        if (token) {
            headers['PRIVATE-TOKEN'] = token;
        }

        // GitLab需要项目ID，通常是owner/repo的URL编码
        const projectId = encodeURIComponent(`${repoInfo.owner}/${repoInfo.repo}`);

        for (const issueRef of issueRefs) {
            try {
                const issueNumber = issueRef.replace('#', '');
                const url = `https://gitlab.com/api/v4/projects/${projectId}/issues/${issueNumber}`;
                
                const response: AxiosResponse<GitLabIssue> = await axios.get(url, {
                    headers,
                    timeout: 10000
                });

                if (response.status === 200) {
                    const issue = response.data;
                    const issueInfo: IssueInfo = {
                        number: issueRef,
                        title: issue.title,
                        type: this.determineIssueType(issue.labels),
                        url: issue.web_url
                    };
                    results.set(issueRef, issueInfo);
                }
            } catch (error) {
                console.error(`获取GitLab Issue ${issueRef} 失败:`, error);
                // 继续处理其他Issue
            }
        }
    }

    /**
     * 根据标签确定Issue类型
     */
    private determineIssueType(labels: string[]): 'bug' | 'feature' | 'enhancement' | 'documentation' | 'other' {
        const labelStr = labels.join(' ').toLowerCase();

        if (labelStr.includes('bug') || labelStr.includes('fix') || labelStr.includes('error')) {
            return 'bug';
        } else if (labelStr.includes('feature') || labelStr.includes('new')) {
            return 'feature';
        } else if (labelStr.includes('enhancement') || labelStr.includes('improvement') || labelStr.includes('optimize')) {
            return 'enhancement';
        } else if (labelStr.includes('doc') || labelStr.includes('documentation')) {
            return 'documentation';
        } else {
            return 'other';
        }
    }

    /**
     * 检查API访问权限
     */
    async testApiAccess(): Promise<{ github: boolean; gitlab: boolean }> {
        const result = { github: false, gitlab: false };

        // 测试GitHub访问
        const githubToken = this.config.get('github.token', '');
        if (githubToken) {
            try {
                const response = await axios.get('https://api.github.com/user', {
                    headers: {
                        'Authorization': `token ${githubToken}`,
                        'User-Agent': 'VSCode-Debian-Changelog'
                    },
                    timeout: 5000
                });
                result.github = response.status === 200;
            } catch (error) {
                console.log('GitHub API访问测试失败:', error);
            }
        }

        // 测试GitLab访问
        const gitlabToken = this.config.get('gitlab.token', '');
        if (gitlabToken) {
            try {
                const response = await axios.get('https://gitlab.com/api/v4/user', {
                    headers: {
                        'PRIVATE-TOKEN': gitlabToken,
                        'User-Agent': 'VSCode-Debian-Changelog'
                    },
                    timeout: 5000
                });
                result.gitlab = response.status === 200;
            } catch (error) {
                console.log('GitLab API访问测试失败:', error);
            }
        }

        return result;
    }

    /**
     * 显示API配置帮助
     */
    async showApiConfigurationHelp(): Promise<void> {
        const message = `
要启用Issue详情获取功能，您需要配置API访问令牌：

**GitHub:**
1. 访问 https://github.com/settings/tokens
2. 生成新的个人访问令牌
3. 至少需要 'repo' 权限（对于私有仓库）
4. 在设置中配置 'debianChangelog.github.token'

**GitLab:**
1. 访问 https://gitlab.com/-/profile/personal_access_tokens
2. 生成新的个人访问令牌
3. 至少需要 'read_api' 权限
4. 在设置中配置 'debianChangelog.gitlab.token'

配置完成后，插件将能够自动获取Issue的详细信息并生成更有意义的changelog条目。
        `;

        const action = await vscode.window.showInformationMessage(
            'Issue详情获取功能需要API令牌配置',
            '查看帮助',
            '立即配置'
        );

        if (action === '查看帮助') {
            const panel = vscode.window.createWebviewPanel(
                'api-help',
                'API配置帮助',
                vscode.ViewColumn.One,
                {}
            );
            panel.webview.html = `
                <html>
                <body style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>API配置帮助</h2>
                    <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px;">${message}</pre>
                </body>
                </html>
            `;
        } else if (action === '立即配置') {
            await vscode.commands.executeCommand('workbench.action.openSettings', 'debianChangelog');
        }
    }
}