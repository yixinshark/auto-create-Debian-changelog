# 安装和开发指南

## 🚀 快速安装

### 1. 克隆和设置项目

```bash
# 进入项目目录
cd aichangelog

# 安装依赖
npm install
```

### 2. 编译项目

```bash
npm run compile
```

### 3. 在VSCode中调试

1. 在VSCode中打开项目文件夹
2. 按 `F5` 启动调试模式
3. 这会打开一个新的VSCode窗口来测试插件

## 📦 依赖说明

项目使用以下主要依赖：

```json
{
  "dependencies": {
    "simple-git": "^3.19.1",  // Git操作库
    "axios": "^1.4.0",        // HTTP请求库
    "moment": "^2.29.4"       // 日期处理库
  },
  "devDependencies": {
    "@types/vscode": "^1.74.0",  // VSCode API类型定义
    "@types/node": "16.x",       // Node.js类型定义
    "typescript": "^4.9.4"       // TypeScript编译器
  }
}
```

## 🛠️ 开发环境要求

- **Node.js**: >= 16.x
- **npm**: >= 8.x
- **VSCode**: >= 1.74.0
- **TypeScript**: >= 4.9.x

## 🔧 项目结构

```
aichangelog/
├── src/                    # 源代码
│   ├── extension.ts        # 插件入口
│   ├── changelogGenerator.ts  # 核心生成器
│   ├── gitService.ts       # Git服务
│   └── issueService.ts     # Issue跟踪服务
├── example/                # 示例文件
│   └── debian/
│       ├── control         # Debian控制文件
│       └── changelog       # 示例changelog
├── out/                    # 编译输出 (自动生成)
├── package.json            # 项目配置
├── tsconfig.json          # TypeScript配置
└── README.md              # 项目说明
```

## 🧪 测试流程

### 1. 编译检查

```bash
# 编译TypeScript代码
npm run compile

# 监听模式（开发时使用）
npm run watch
```

### 2. 功能测试

在VSCode调试窗口中：

1. **基本功能测试**
   - 打开 `example/debian/changelog`
   - 按 `Ctrl+Alt+D` 生成基本条目
   
2. **Git集成测试**
   - 确保项目是Git仓库
   - 按 `Ctrl+Alt+G` 从Git生成条目
   
3. **配置测试**
   - 按 `Ctrl+Shift+P` 打开命令面板
   - 搜索 "Debian: 配置用户信息"

### 3. Issue集成测试

如果要测试Issue集成功能：

```bash
# 创建测试提交
git commit -m "Fix memory leak (fixes #123)"
git commit -m "Add new feature (closes #456)"

# 然后在VSCode中测试Issue详情获取
```

## 📋 常见问题

### 问题1: 编译错误

**错误**: `Cannot find module 'vscode'`
**解决**: 确保安装了所有依赖: `npm install`

### 问题2: 调试窗口无法启动

**解决**: 
1. 确保项目已编译: `npm run compile`
2. 检查 `.vscode/launch.json` 配置
3. 重启VSCode

### 问题3: Git服务无法工作

**解决**:
1. 确保当前目录是Git仓库
2. 检查Git是否正确安装
3. 验证仓库有提交历史

## 🚀 发布准备

### 1. 打包插件

```bash
# 安装vsce（VSCode扩展CLI）
npm install -g vsce

# 打包为.vsix文件
vsce package
```

### 2. 本地安装测试

```bash
# 在VSCode中安装本地打包的插件
code --install-extension debian-smart-changelog-1.0.0.vsix
```

## 🔧 自定义配置

### 开发配置

创建 `.vscode/settings.json`：

```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.suggest.autoImports": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  }
}
```

### 调试配置

`.vscode/launch.json` 已预配置，支持：
- F5: 启动插件调试
- 自动重编译
- 错误追踪

## 📈 性能优化

### 1. 编译优化

- 使用增量编译: `npm run watch`
- 排除不必要的文件: 检查 `.vscodeignore`

### 2. 运行时优化

- 延迟加载模块
- 缓存API响应
- 限制Git日志条数

## 🤝 贡献指南

1. **代码风格**: 遵循TypeScript最佳实践
2. **提交规范**: 使用语义化提交消息
3. **测试要求**: 确保新功能有相应测试
4. **文档更新**: 更新相关文档

---

🎯 **开发愉快！如有问题请查看完整文档或提交Issue。**