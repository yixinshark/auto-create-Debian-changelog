import * as vscode from 'vscode';
import moment from 'moment';

export interface ChangelogEntry {
    package: string;
    version: string;
    distribution: string;
    urgency: string;
    changes: string[];
    author: string;
    email: string;
    date: Date;
}

export interface CommitInfo {
    hash: string;
    message: string;
    author: string;
    date: Date;
    files: string[];
    issueRefs?: string[];
    issueDetails?: IssueInfo[];
}

export interface IssueInfo {
    number: string;
    title: string;
    type: 'bug' | 'feature' | 'enhancement' | 'documentation' | 'other';
    url: string;
}

export class ChangelogGenerator {
    private config: vscode.WorkspaceConfiguration;

    constructor() {
        this.config = vscode.workspace.getConfiguration('debianChangelog');
    }

    /**
     * 生成基本的changelog条目
     */
    async generateBasicEntry(): Promise<string> {
        const packageName = await this.getPackageName();
        const version = await this.getNextVersion();
        const distribution = this.config.get('defaultDistribution', 'unstable');
        const urgency = this.config.get('defaultUrgency', 'medium');
        const author = this.config.get('author.name', '');
        const email = this.config.get('author.email', '');

        if (!author || !email) {
            const configure = await vscode.window.showWarningMessage(
                '请先配置作者信息',
                '立即配置'
            );
            if (configure) {
                await vscode.commands.executeCommand('debian-changelog.configure');
            }
            throw new Error('作者信息未配置');
        }

        const entry: ChangelogEntry = {
            package: packageName,
            version: version,
            distribution: distribution,
            urgency: urgency,
            changes: ['* Release ' + version],
            author: author,
            email: email,
            date: new Date()
        };

        return this.formatEntry(entry);
    }

    /**
     * 从Git提交生成changelog条目
     */
    async generateFromCommits(commits: CommitInfo[]): Promise<string> {
        const packageName = await this.getPackageName();
        const version = await this.getNextVersion();
        const distribution = this.config.get('defaultDistribution', 'unstable');
        const urgency = this.determineUrgency(commits);
        const author = this.config.get('author.name', '');
        const email = this.config.get('author.email', '');

        if (!author || !email) {
            throw new Error('作者信息未配置');
        }

        const changes = this.generateChangesFromCommits(commits);

        const entry: ChangelogEntry = {
            package: packageName,
            version: version,
            distribution: distribution,
            urgency: urgency,
            changes: changes,
            author: author,
            email: email,
            date: new Date()
        };

        return this.formatEntry(entry);
    }

    /**
     * 格式化changelog条目
     */
    private formatEntry(entry: ChangelogEntry): string {
        const dateStr = moment(entry.date).format('ddd, DD MMM YYYY HH:mm:ss ZZ');
        
        let formatted = `${entry.package} (${entry.version}) ${entry.distribution}; urgency=${entry.urgency}\n\n`;
        
        // 添加变更条目
        for (const change of entry.changes) {
            if (change.startsWith('  ')) {
                formatted += change + '\n';
            } else {
                formatted += `  ${change}\n`;
            }
        }
        
        formatted += `\n -- ${entry.author} <${entry.email}>  ${dateStr}\n\n`;
        
        return formatted;
    }

    /**
     * 从提交信息生成变更列表
     */
    private generateChangesFromCommits(commits: CommitInfo[]): string[] {
        const changes: string[] = [];
        const includeIssueDetails = this.config.get('includeIssueDetails', true);

        for (const commit of commits) {
            let message = this.cleanCommitMessage(commit.message);
            
            // 如果有Issue信息，添加到变更描述中
            if (includeIssueDetails && commit.issueDetails && commit.issueDetails.length > 0) {
                for (const issue of commit.issueDetails) {
                    message = this.enhanceMessageWithIssue(message, issue);
                }
            }
            
            // 如果消息中没有Issue引用，添加原始引用
            if (commit.issueRefs && commit.issueRefs.length > 0) {
                const refs = commit.issueRefs.join(', ');
                if (!message.includes('#') && !message.includes('closes') && !message.includes('fixes')) {
                    message += ` (${refs})`;
                }
            }

            changes.push(`* ${message}`);
            
            // 如果提交涉及重要文件，添加额外描述
            const importantFiles = this.getImportantFiles(commit.files);
            if (importantFiles.length > 0) {
                for (const file of importantFiles) {
                    changes.push(`  - Updated ${file}`);
                }
            }
        }

        return changes.length > 0 ? changes : ['* Release ' + 'version'];
    }

    /**
     * 清理提交消息
     */
    private cleanCommitMessage(message: string): string {
        // 去掉多余的空白字符
        message = message.trim().replace(/\s+/g, ' ');
        
        // 确保首字母大写
        if (message.length > 0) {
            message = message.charAt(0).toUpperCase() + message.slice(1);
        }
        
        // 如果消息太长，截断
        if (message.length > 72) {
            message = message.substring(0, 69) + '...';
        }
        
        return message;
    }

    /**
     * 用Issue信息增强提交消息
     */
    private enhanceMessageWithIssue(message: string, issue: IssueInfo): string {
        // 如果消息过于简单，用Issue标题替换
        if (message.length < 20 && issue.title.length > message.length) {
            return `${issue.title} (${issue.number})`;
        }
        
        // 如果消息中没有Issue引用，添加
        if (!message.includes(issue.number)) {
            return `${message} (${issue.number})`;
        }
        
        return message;
    }

    /**
     * 确定紧急程度
     */
    private determineUrgency(commits: CommitInfo[]): string {
        let hasSecurityFix = false;
        let hasBugFix = false;
        
        for (const commit of commits) {
            const message = commit.message.toLowerCase();
            if (message.includes('security') || message.includes('cve') || message.includes('vulnerability')) {
                hasSecurityFix = true;
                break;
            }
            if (message.includes('fix') || message.includes('bug') || 
                (commit.issueDetails && commit.issueDetails.some(issue => issue.type === 'bug'))) {
                hasBugFix = true;
            }
        }
        
        if (hasSecurityFix) {
            return 'high';
        } else if (hasBugFix) {
            return 'medium';
        } else {
            return this.config.get('defaultUrgency', 'medium');
        }
    }

    /**
     * 获取重要文件列表
     */
    private getImportantFiles(files: string[]): string[] {
        const important = [];
        const importantPatterns = [
            /\.so$/,      // 动态库
            /\.conf$/,    // 配置文件
            /\.service$/, // systemd服务文件
            /\.desktop$/, // 桌面文件
            /\.xml$/,     // XML配置
            /\.json$/,    // JSON配置
        ];
        
        for (const file of files) {
            if (importantPatterns.some(pattern => pattern.test(file))) {
                important.push(file);
            }
        }
        
        return important.slice(0, 3); // 最多显示3个
    }

    /**
     * 获取包名
     */
    private async getPackageName(): Promise<string> {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        let suggestedName = 'my-package';
        
        if (workspaceFolders && workspaceFolders.length > 0) {
            const workspaceRoot = workspaceFolders[0].uri;
            
            // 1. 首先尝试从 debian/changelog 读取已有包名 (最优先)
            const changelogPackageName = await this.getPackageNameFromChangelog(workspaceRoot);
            if (changelogPackageName) {
                const useChangelogName = await vscode.window.showQuickPick(
                    [
                        { label: changelogPackageName, description: '(从 debian/changelog 读取)', picked: true },
                        { label: '选择其他包名', description: '从其他来源选择' }
                    ],
                    {
                        placeHolder: '发现已有changelog包名',
                        title: `检测到包名: ${changelogPackageName}`
                    }
                );
                
                if (useChangelogName?.label === changelogPackageName) {
                    return changelogPackageName;
                }
            }
            
            // 2. 从 debian/control 读取所有包名
            const controlPackageNames = await this.getPackageNamesFromControl(workspaceRoot);
            
            // 3. 获取文件夹名作为建议
            const folderName = vscode.workspace.name || workspaceFolders[0].name;
            if (folderName) {
                suggestedName = folderName;
            }
            
            // 如果找到了control文件中的包名，提供选择
            if (controlPackageNames.length > 0) {
                const options = [
                    ...controlPackageNames.map(name => ({
                        label: name,
                        description: '(从 debian/control 读取)'
                    })),
                    {
                        label: suggestedName,
                        description: '(文件夹名建议)'
                    },
                    {
                        label: '手动输入',
                        description: '输入自定义包名'
                    }
                ];
                
                const selectedOption = await vscode.window.showQuickPick(options, {
                    placeHolder: '选择包名',
                    title: controlPackageNames.length > 1 
                        ? `发现 ${controlPackageNames.length} 个包` 
                        : '选择包名来源'
                });
                
                if (selectedOption && selectedOption.label !== '手动输入') {
                    return selectedOption.label;
                }
                
                // 如果选择了手动输入，使用建议名称作为默认值
                if (selectedOption?.label === '手动输入') {
                    suggestedName = controlPackageNames[0] || suggestedName;
                }
            }
        }
        
        // 从用户输入获取
        const packageName = await vscode.window.showInputBox({
            prompt: '请输入包名',
            value: suggestedName,
            placeHolder: suggestedName
        });
        
        return packageName || 'unknown-package';
    }

    /**
     * 从 debian/changelog 读取包名
     */
    private async getPackageNameFromChangelog(workspaceRoot: vscode.Uri): Promise<string | null> {
        const changelogPath = vscode.Uri.joinPath(workspaceRoot, 'debian', 'changelog');
        try {
            const changelogContent = await vscode.workspace.fs.readFile(changelogPath);
            const content = Buffer.from(changelogContent).toString('utf8');
            
            // 解析changelog格式: package-name (version) distribution; urgency=level
            const match = content.match(/^([^\s\(]+)\s+\([^)]+\)/m);
            if (match) {
                return match[1].trim();
            }
        } catch (error) {
            // 文件不存在或读取失败
        }
        return null;
    }

    /**
     * 从 debian/control 读取所有包名
     */
    private async getPackageNamesFromControl(workspaceRoot: vscode.Uri): Promise<string[]> {
        const controlPath = vscode.Uri.joinPath(workspaceRoot, 'debian', 'control');
        try {
            const controlContent = await vscode.workspace.fs.readFile(controlPath);
            const content = Buffer.from(controlContent).toString('utf8');
            
            // 查找所有 Package: 行
            const packageMatches = content.match(/^Package:\s*(.+)$/gm);
            if (packageMatches) {
                return packageMatches
                    .map(match => match.replace(/^Package:\s*/, '').trim())
                    .filter(name => name.length > 0);
            }
        } catch (error) {
            // 文件不存在或读取失败
        }
        return [];
    }

    /**
     * 获取下一个版本号
     */
    private async getNextVersion(): Promise<string> {
        // 尝试从现有changelog读取当前版本
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const content = editor.document.getText();
            const versionMatch = content.match(/^\S+\s+\(([^)]+)\)/m);
            if (versionMatch) {
                const currentVersion = versionMatch[1];
                const nextVersion = this.bumpVersion(currentVersion);
                
                // 询问用户是否使用建议的版本
                const useVersion = await vscode.window.showInputBox({
                    prompt: '请输入版本号',
                    value: nextVersion,
                    placeHolder: '1.0.0'
                });
                
                return useVersion || nextVersion;
            }
        }
        
        // 用户手动输入版本
        const version = await vscode.window.showInputBox({
            prompt: '请输入版本号',
            placeHolder: '1.0.0'
        });
        
        return version || '1.0.0';
    }

    /**
     * 版本号递增
     */
    private bumpVersion(version: string): string {
        const parts = version.split('.');
        if (parts.length >= 3) {
            // 递增patch版本
            const patch = parseInt(parts[2]) + 1;
            return `${parts[0]}.${parts[1]}.${patch}`;
        } else if (parts.length === 2) {
            // 递增minor版本
            const minor = parseInt(parts[1]) + 1;
            return `${parts[0]}.${minor}.0`;
        } else {
            // 简单递增
            const major = parseInt(parts[0]) + 1;
            return `${major}.0.0`;
        }
    }
}