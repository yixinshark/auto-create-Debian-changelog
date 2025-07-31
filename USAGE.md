# 使用指南

## 🚀 快速开始

### 1. 开发环境准备

确保您的系统已安装：
- Node.js (>= 16.x)
- npm 或 yarn
- VSCode
- Git

### 2. 安装依赖

```bash
cd aichangelog
npm install
```

### 3. 编译插件

```bash
npm run compile
```

### 4. 在VSCode中测试

按 `F5` 启动调试模式，这会打开一个新的VSCode窗口运行插件。

## 📝 功能演示

### 1. 基本changelog生成

1. 在调试窗口中打开 `example/debian/changelog` 文件
2. 将光标定位到文件开头
3. 按快捷键 `Ctrl+Alt+D`
4. 按照提示输入包信息和版本号

### 2. 从Git提交生成changelog

如果您的项目是Git仓库：

1. 在调试窗口中打开 `example/debian/changelog` 文件
2. 按快捷键 `Ctrl+Alt+G`
3. 插件会自动分析最近的Git提交并生成changelog条目

### 3. 配置用户信息

第一次使用需要配置用户信息：

1. 打开命令面板 (`Ctrl+Shift+P`)
2. 输入 "Debian: 配置用户信息"
3. 按照提示输入姓名和邮箱

## ⚙️ 配置示例

在VSCode设置中添加以下配置：

```json
{
  "debianChangelog.author.name": "Your Name",
  "debianChangelog.author.email": "your@email.com",
  "debianChangelog.defaultDistribution": "unstable",
  "debianChangelog.defaultUrgency": "medium",
  "debianChangelog.gitCommitRange": "HEAD~5..HEAD",
  "debianChangelog.includeIssueDetails": true
}
```

## 🔗 Issue跟踪系统测试

### 模拟Git提交

创建一些包含Issue引用的提交：

```bash
git commit -m "Fix audio driver crash (fixes #123)"
git commit -m "Add dark theme support (closes #456)"
git commit -m "Update documentation (refs #789)"
```

### 配置API令牌

如果您有GitHub或GitLab账户，可以配置API令牌来测试Issue详情获取：

```json
{
  "debianChangelog.github.token": "your_github_token_here",
  "debianChangelog.gitlab.token": "your_gitlab_token_here"
}
```

## 🧪 测试场景

### 场景1：新版本发布
1. 完成一些代码修改
2. 提交变更到Git
3. 使用插件从Git提交生成changelog
4. 验证生成的条目格式正确

### 场景2：紧急修复
1. 创建包含"security"或"fix"关键词的提交
2. 使用插件生成changelog
3. 验证urgency自动设置为high或medium

### 场景3：Issue集成
1. 确保Git提交消息包含Issue引用（如#123）
2. 配置GitHub/GitLab API令牌
3. 生成changelog并验证Issue详情被正确获取

## 📋 命令列表

| 命令 | 快捷键 | 说明 |
|------|--------|------|
| `debian-changelog.generate` | `Ctrl+Alt+D` | 生成基本changelog条目 |
| `debian-changelog.generateFromGit` | `Ctrl+Alt+G` | 从Git提交生成changelog |
| `debian-changelog.configure` | - | 配置用户信息 |

## 🐛 故障排除

### 问题：插件无法识别changelog文件
**解决方案：** 确保文件名为 `changelog` 且位于 `debian/` 目录下

### 问题：Git提交信息获取失败
**解决方案：** 
1. 确保当前目录是Git仓库
2. 检查Git提交范围配置
3. 验证有足够的提交历史

### 问题：Issue详情获取失败
**解决方案：**
1. 检查网络连接
2. 验证API令牌配置正确
3. 确保仓库支持相应的Issue系统

### 问题：版本号格式错误
**解决方案：** 使用标准的语义化版本号格式（如1.0.0）

## 📚 进阶使用

### 自定义提交范围

配置特定的Git提交范围：
```json
{
  "debianChangelog.gitCommitRange": "v1.0.0..HEAD"
}
```

### 批量处理

对于大型项目，可以分批处理提交：
```json
{
  "debianChangelog.gitCommitRange": "HEAD~20..HEAD"
}
```

### 多仓库支持

插件支持在不同的Git仓库中使用，会自动检测当前仓库的配置。

## 🤝 贡献代码

如果您想改进插件：

1. Fork这个仓库
2. 创建功能分支
3. 提交您的修改
4. 创建Pull Request

---

🎉 **祝您使用愉快！如有问题请及时反馈。**