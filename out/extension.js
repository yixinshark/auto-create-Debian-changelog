"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const changelogGenerator_1 = require("./changelogGenerator");
const gitService_1 = require("./gitService");
const issueService_1 = require("./issueService");
function activate(context) {
    console.log('Debian Smart Changelog extension is now active!');
    const changelogGenerator = new changelogGenerator_1.ChangelogGenerator();
    const gitService = new gitService_1.GitService();
    const issueService = new issueService_1.IssueService();
    // 注册生成changelog命令
    const generateCommand = vscode.commands.registerCommand('debian-changelog.generate', async () => {
        await generateChangelogEntry(changelogGenerator, false);
    });
    // 注册从Git生成changelog命令
    const generateFromGitCommand = vscode.commands.registerCommand('debian-changelog.generateFromGit', async () => {
        await generateChangelogFromGit(changelogGenerator, gitService, issueService);
    });
    // 注册配置命令
    const configureCommand = vscode.commands.registerCommand('debian-changelog.configure', async () => {
        await configureUserInfo();
    });
    context.subscriptions.push(generateCommand, generateFromGitCommand, configureCommand);
}
exports.activate = activate;
async function generateChangelogEntry(generator, fromGit = false) {
    try {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('请先打开一个文件');
            return;
        }
        // 检查是否是changelog文件
        const fileName = editor.document.fileName;
        if (!fileName.endsWith('changelog') && !fileName.includes('debian/changelog')) {
            const result = await vscode.window.showWarningMessage('当前文件似乎不是Debian changelog文件，是否继续？', '继续', '取消');
            if (result !== '继续') {
                return;
            }
        }
        const entry = await generator.generateBasicEntry();
        const position = editor.selection.active;
        editor.edit((editBuilder) => {
            editBuilder.insert(position, entry);
        });
        vscode.window.showInformationMessage('Changelog条目已生成');
    }
    catch (error) {
        vscode.window.showErrorMessage(`生成失败: ${error}`);
    }
}
async function generateChangelogFromGit(generator, gitService, issueService) {
    try {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('请先打开一个文件');
            return;
        }
        // 获取工作区路径
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(editor.document.uri);
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('请在工作区中打开文件');
            return;
        }
        // 显示进度条
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "正在生成Changelog...",
            cancellable: false
        }, async (progress) => {
            progress.report({ increment: 0, message: "读取Git提交记录..." });
            // 获取Git提交信息
            const commits = await gitService.getCommits(workspaceFolder.uri.fsPath);
            progress.report({ increment: 30, message: "解析Issue信息..." });
            // 获取Issue信息
            const commitsWithIssues = await issueService.enrichCommitsWithIssues(commits);
            progress.report({ increment: 60, message: "生成Changelog条目..." });
            // 生成changelog条目
            const entry = await generator.generateFromCommits(commitsWithIssues);
            progress.report({ increment: 90, message: "插入到文档..." });
            // 插入到编辑器
            const position = editor.selection.active;
            await editor.edit((editBuilder) => {
                editBuilder.insert(position, entry);
            });
            progress.report({ increment: 100, message: "完成" });
        });
        vscode.window.showInformationMessage('从Git提交生成的Changelog条目已插入');
    }
    catch (error) {
        vscode.window.showErrorMessage(`生成失败: ${error}`);
    }
}
async function configureUserInfo() {
    const config = vscode.workspace.getConfiguration('debianChangelog');
    const name = await vscode.window.showInputBox({
        prompt: '请输入您的姓名',
        value: config.get('author.name', '')
    });
    if (name) {
        await config.update('author.name', name, vscode.ConfigurationTarget.Global);
    }
    const email = await vscode.window.showInputBox({
        prompt: '请输入您的邮箱',
        value: config.get('author.email', '')
    });
    if (email) {
        await config.update('author.email', email, vscode.ConfigurationTarget.Global);
    }
    vscode.window.showInformationMessage('用户信息已保存');
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map