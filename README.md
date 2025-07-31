# 🚀 Debian Smart Changelog

[![Build Status](https://github.com/yixinshark/auto-create-Debian-Chanagelog/workflows/Build%20and%20Test/badge.svg)](https://github.com/yixinshark/auto-create-Debian-Chanagelog/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![VSCode Marketplace](https://img.shields.io/badge/vscode-marketplace-blue.svg)](https://marketplace.visualstudio.com/items?itemName=debian-smart-changelog)

一个智能的VSCode插件，专为Debian包开发者设计，能够自动生成高质量的changelog条目。告别手动编写changelog的时代！

![功能演示](https://via.placeholder.com/800x400/0066cc/ffffff?text=Debian+Smart+Changelog+Demo)

## ✨ 主要功能

### 🚀 智能内容生成
- **Git集成**: 自动从Git提交历史提取变更信息
- **Issue跟踪**: 支持GitHub/GitLab Issue系统集成
- **智能分析**: 根据提交内容自动判断紧急程度
- **文件感知**: 识别重要文件变更并添加到changelog

### 📝 完整的Debian格式支持
- **标准格式**: 严格遵循Debian changelog格式规范
- **版本管理**: 智能版本号递增
- **日期格式**: 自动生成RFC 2822格式的日期
- **作者信息**: 自动配置和使用作者信息

### 🛠️ 用户友好的界面
- **快捷键**: 支持自定义快捷键操作
- **命令面板**: 集成到VSCode命令面板
- **配置选项**: 丰富的配置选项满足不同需求

## 📦 安装

1. 打开VSCode
2. 按 `Ctrl+P` 打开Quick Open
3. 输入 `ext install debian-smart-changelog`
4. 重启VSCode

## 🚀 快速开始

### 1. 配置用户信息
第一次使用时，请配置您的姓名和邮箱：

```
Ctrl+Shift+P -> "Debian: 配置用户信息"
```

### 2. 生成基本changelog条目
在debian/changelog文件中，按快捷键：
```
Ctrl+Alt+D
```

### 3. 从Git提交生成智能changelog
```
Ctrl+Alt+G
```

## ⚙️ 配置选项

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

## 🔗 Issue跟踪系统集成

### 什么是Issue跟踪系统集成？

Issue跟踪系统是管理项目任务、bug报告、功能需求的平台（如GitHub Issues、GitLab Issues）。

插件会：
1. **自动识别**提交消息中的Issue引用（如 #123, fixes #456）
2. **获取详情**通过API获取Issue的标题、类型、状态等信息
3. **智能生成**更有意义的changelog条目

### 配置API访问

#### GitHub配置
1. 访问 [GitHub Token Settings](https://github.com/settings/tokens)
2. 点击 "Generate new token"
3. 选择权限：
   - 公开仓库：无需特殊权限
   - 私有仓库：需要 `repo` 权限
4. 在VSCode设置中配置：`debianChangelog.github.token`

#### GitLab配置
1. 访问 [GitLab Token Settings](https://gitlab.com/-/profile/personal_access_tokens)
2. 创建新的个人访问令牌
3. 选择权限：`read_api`
4. 在VSCode设置中配置：`debianChangelog.gitlab.token`

### 示例效果

**提交消息：**
```bash
git commit -m "Fix memory leak in audio module (fixes #123)"
git commit -m "Add dark theme support (closes #456)"
```

**生成的changelog：**
```
dde-shell (2.0.4) unstable; urgency=medium

  * Fix memory leak in audio module when switching profiles (#123)
  * Add dark theme support for better user experience (#456)
  * Update dependencies to latest stable versions

 -- Your Name <your@email.com>  Thu, 31 Jul 2025 21:04:39 +0800
```

## 📋 使用场景

### 1. 日常开发
每次发布新版本时，快速生成标准格式的changelog：
```
Ctrl+Alt+D  # 生成基本条目
```

### 2. 版本发布
基于Git提交历史自动生成完整的变更记录：
```
Ctrl+Alt+G  # 从Git生成智能changelog
```

### 3. 团队协作
结合Issue跟踪系统，生成包含完整上下文的changelog：
- 自动获取Issue标题和类型
- 智能判断变更的重要性
- 生成规范化的描述

## 🔧 高级功能

### 版本号智能递增
插件会自动：
1. 读取当前changelog中的最新版本
2. 根据变更类型建议新版本号
3. 支持手动调整版本号

### 紧急程度自动判断
根据提交内容自动设置urgency：
- `high`: 包含安全修复或CVE相关
- `medium`: 包含bug修复
- `low`: 功能增强或文档更新

### 文件变更感知
自动识别重要文件变更：
- 动态库 (.so)
- 配置文件 (.conf, .json, .xml)
- 系统服务 (.service)
- 桌面文件 (.desktop)

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献
1. Fork 这个仓库
2. 创建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

### 开发环境设置
```bash
# 克隆仓库
git clone https://github.com/yixinshark/auto-create-Debian-Chanagelog.git
cd auto-create-Debian-Chanagelog

# 安装依赖
npm install

# 编译项目
npm run compile

# 在VSCode中调试
# 按F5启动调试模式
```

### 报告问题
如果您发现了bug或有功能建议，请[创建一个issue](https://github.com/yixinshark/auto-create-Debian-Chanagelog/issues)。

## 🙋‍♂️ 支持

如果您遇到问题或有建议，请：
1. 查看文档和配置选项
2. 在GitHub提交Issue
3. 参与讨论和改进

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 感谢所有为Debian生态系统做出贡献的开发者
- 感谢VSCode扩展开发社区的支持
- 感谢所有测试用户的反馈

## 📊 统计

![GitHub stars](https://img.shields.io/github/stars/yixinshark/auto-create-Debian-Chanagelog?style=social)
![GitHub forks](https://img.shields.io/github/forks/yixinshark/auto-create-Debian-Chanagelog?style=social)
![GitHub issues](https://img.shields.io/github/issues/yixinshark/auto-create-Debian-Chanagelog)

---

🎉 **让Debian包的changelog管理变得简单高效！** 🎉

**⭐ 如果这个项目对您有帮助，请给我们一个Star！**