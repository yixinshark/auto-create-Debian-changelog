# 🚀 Smart Debian Changelog

[![Build Status](https://github.com/yixinshark/auto-create-Debian-Chanagelog/workflows/Build%20and%20Test/badge.svg)](https://github.com/yixinshark/auto-create-Debian-Chanagelog/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![VSCode Marketplace](https://img.shields.io/badge/vscode-marketplace-blue.svg)](https://marketplace.visualstudio.com/items?itemName=yixinshark.smart-debian-changelog)

*[English](#english) | [中文](#中文)*

---

## English

A powerful VSCode extension designed for Debian package developers to intelligently generate high-quality changelog entries. Say goodbye to manual changelog writing!

![Smart Debian Changelog Demo](https://via.placeholder.com/800x400/0066cc/ffffff?text=Smart+Debian+Changelog+Demo)

### ✨ Key Features

#### 🚀 Intelligent Content Generation
- **Git Integration**: Automatically extract changes from Git commit history
- **Issue Tracking**: Support for GitHub/GitLab Issue system integration
- **Smart Analysis**: Automatically determine urgency levels based on commit content
- **File Awareness**: Identify important file changes and add them to changelog

#### 📝 Complete Debian Format Support
- **Standard Format**: Strictly follows Debian changelog format specifications
- **Version Management**: Smart version number incrementing
- **Date Formatting**: Automatically generates RFC 2822 formatted dates
- **Author Information**: Automatic configuration and use of author details

#### 🛠️ User-Friendly Interface
- **Keyboard Shortcuts**: Support for custom keyboard shortcuts
- **Command Palette**: Integrated into VSCode command palette
- **Rich Configuration**: Extensive configuration options for different needs

### 📦 Installation

#### From VSCode Marketplace
1. Open VSCode
2. Press `Ctrl+P` to open Quick Open
3. Type `ext install yixinshark.smart-debian-changelog`
4. Restart VSCode

#### Manual Installation
1. Download the latest `.vsix` file from [Releases](https://github.com/yixinshark/auto-create-Debian-Chanagelog/releases)
2. Open VSCode
3. Press `Ctrl+Shift+P` and run `Extensions: Install from VSIX...`
4. Select the downloaded file

### 🚀 Quick Start

#### 1. Configure User Information
First time users should configure their name and email:
```
Ctrl+Shift+P -> "Debian: Configure User Information"
```

#### 2. Generate Basic Changelog Entry
In your `debian/changelog` file, use the shortcut:
```
Ctrl+Alt+D
```

#### 3. Generate Smart Changelog from Git
```
Ctrl+Alt+G
```

### ⚙️ Configuration Options

| Setting | Description | Default |
|---------|-------------|---------|
| `debianChangelog.author.name` | Author name | "" |
| `debianChangelog.author.email` | Author email | "" |
| `debianChangelog.defaultDistribution` | Default distribution | "unstable" |
| `debianChangelog.defaultUrgency` | Default urgency level | "medium" |
| `debianChangelog.gitCommitRange` | Git commit range | "HEAD~10..HEAD" |
| `debianChangelog.includeIssueDetails` | Include Issue details | true |
| `debianChangelog.github.token` | GitHub access token | "" |
| `debianChangelog.gitlab.token` | GitLab access token | "" |

### 🔗 Issue Tracking System Integration

Configure API tokens to enable automatic Issue details retrieval:

#### GitHub Configuration
1. Visit [GitHub Token Settings](https://github.com/settings/tokens)
2. Generate a new personal access token
3. For public repos: no special permissions needed
4. For private repos: `repo` permission required
5. Configure in VSCode settings: `debianChangelog.github.token`

#### GitLab Configuration
1. Visit [GitLab Token Settings](https://gitlab.com/-/profile/personal_access_tokens)
2. Create a new personal access token
3. Required permission: `read_api`
4. Configure in VSCode settings: `debianChangelog.gitlab.token`

### 📋 Commands

| Command | Shortcut | Description |
|---------|----------|-------------|
| `debian-changelog.generate` | `Ctrl+Alt+D` | Generate basic changelog entry |
| `debian-changelog.generateFromGit` | `Ctrl+Alt+G` | Generate changelog from Git commits |
| `debian-changelog.configure` | - | Configure user information |

### 🎯 Comparison with Existing Solutions

| Feature | Existing Plugins | **Smart Debian Changelog** | Advantage |
|---------|------------------|---------------------------|-----------|
| Basic template | ✅ | ✅ | Same |
| Git integration | ❌ | ✅ | **Full automation** |
| Issue tracking | ❌ | ✅ | **Smart context** |
| Smart analysis | ❌ | ✅ | **Auto detection** |
| Version management | ❌ | ✅ | **Auto increment** |
| File change awareness | ❌ | ✅ | **Detailed tracking** |
| Multi-platform support | ❌ | ✅ | **GitHub/GitLab** |

---

## 中文

一个强大的VSCode插件，专为Debian包开发者设计，能够智能生成高质量的changelog条目。告别手动编写changelog的时代！

### ✨ 主要功能

#### 🚀 智能内容生成
- **Git集成**: 自动从Git提交历史提取变更信息
- **Issue跟踪**: 支持GitHub/GitLab Issue系统集成
- **智能分析**: 根据提交内容自动判断紧急程度
- **文件感知**: 识别重要文件变更并添加到changelog

#### 📝 完整的Debian格式支持
- **标准格式**: 严格遵循Debian changelog格式规范
- **版本管理**: 智能版本号递增
- **日期格式**: 自动生成RFC 2822格式的日期
- **作者信息**: 自动配置和使用作者信息

#### 🛠️ 用户友好的界面
- **快捷键**: 支持自定义快捷键操作
- **命令面板**: 集成到VSCode命令面板
- **丰富配置**: 多样的配置选项满足不同需求

### 📦 安装方法

#### 从VSCode市场安装
1. 打开VSCode
2. 按 `Ctrl+P` 打开Quick Open
3. 输入 `ext install yixinshark.smart-debian-changelog`
4. 重启VSCode

#### 手动安装
1. 从[发布页面](https://github.com/yixinshark/auto-create-Debian-Chanagelog/releases)下载最新的`.vsix`文件
2. 打开VSCode
3. 按 `Ctrl+Shift+P` 运行 `Extensions: Install from VSIX...`
4. 选择下载的文件

### 🚀 快速开始

#### 1. 配置用户信息
第一次使用时，请配置您的姓名和邮箱：
```
Ctrl+Shift+P -> "Debian: 配置用户信息"
```

#### 2. 生成基本changelog条目
在debian/changelog文件中，按快捷键：
```
Ctrl+Alt+D
```

#### 3. 从Git提交生成智能changelog
```
Ctrl+Alt+G
```

### ⚙️ 配置选项

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `debianChangelog.author.name` | 作者姓名 | "" |
| `debianChangelog.author.email` | 作者邮箱 | "" |
| `debianChangelog.defaultDistribution` | 默认发行版 | "unstable" |
| `debianChangelog.defaultUrgency` | 默认紧急程度 | "medium" |
| `debianChangelog.gitCommitRange` | Git提交范围 | "HEAD~10..HEAD" |
| `debianChangelog.includeIssueDetails` | 包含Issue详情 | true |
| `debianChangelog.github.token` | GitHub访问令牌 | "" |
| `debianChangelog.gitlab.token` | GitLab访问令牌 | "" |

### 🔗 Issue跟踪系统集成

配置API访问令牌以启用Issue详情自动获取功能：

#### GitHub配置
1. 访问 [GitHub Token Settings](https://github.com/settings/tokens)
2. 生成新的个人访问令牌
3. 公开仓库：无需特殊权限
4. 私有仓库：需要 `repo` 权限
5. 在VSCode设置中配置：`debianChangelog.github.token`

#### GitLab配置
1. 访问 [GitLab Token Settings](https://gitlab.com/-/profile/personal_access_tokens)
2. 创建新的个人访问令牌
3. 所需权限：`read_api`
4. 在VSCode设置中配置：`debianChangelog.gitlab.token`

### 📋 命令列表

| 命令 | 快捷键 | 说明 |
|------|--------|------|
| `debian-changelog.generate` | `Ctrl+Alt+D` | 生成基本changelog条目 |
| `debian-changelog.generateFromGit` | `Ctrl+Alt+G` | 从Git提交生成changelog |
| `debian-changelog.configure` | - | 配置用户信息 |

---

## 🤝 Contributing | 贡献

We welcome all forms of contributions! | 我们欢迎所有形式的贡献！

### How to Contribute | 如何贡献
1. Fork this repository | Fork 这个仓库
2. Create your feature branch | 创建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. Commit your changes | 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch | 推送到分支 (`git push origin feature/AmazingFeature`)
5. Open a Pull Request | 打开一个 Pull Request

### Development Setup | 开发环境设置
```bash
# Clone the repository | 克隆仓库
git clone https://github.com/yixinshark/auto-create-Debian-Chanagelog.git
cd auto-create-Debian-Chanagelog

# Install dependencies | 安装依赖
npm install

# Compile the project | 编译项目
npm run compile

# Debug in VSCode | 在VSCode中调试
# Press F5 to start debugging mode | 按F5启动调试模式
```

### Report Issues | 报告问题
If you find a bug or have a feature request, please [create an issue](https://github.com/yixinshark/auto-create-Debian-Chanagelog/issues).

如果您发现了bug或有功能建议，请[创建一个issue](https://github.com/yixinshark/auto-create-Debian-Chanagelog/issues)。

## 📄 License | 许可证

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 Acknowledgments | 致谢

- Thanks to all developers contributing to the Debian ecosystem | 感谢所有为Debian生态系统做出贡献的开发者
- Thanks to the VSCode extension development community | 感谢VSCode扩展开发社区的支持
- Thanks to all testers for their feedback | 感谢所有测试用户的反馈

## 📊 Statistics | 统计

![GitHub stars](https://img.shields.io/github/stars/yixinshark/auto-create-Debian-Chanagelog?style=social)
![GitHub forks](https://img.shields.io/github/forks/yixinshark/auto-create-Debian-Chanagelog?style=social)
![GitHub issues](https://img.shields.io/github/issues/yixinshark/auto-create-Debian-Chanagelog)

---

🎉 **Make Debian changelog management simple and efficient!** | **让Debian包的changelog管理变得简单高效！** 🎉

**⭐ If this project helps you, please give us a Star!** | **⭐ 如果这个项目对您有帮助，请给我们一个Star！**