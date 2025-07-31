# 插件测试指南

## 🎉 插件已成功编译和打包！

### 📦 编译状态
- ✅ TypeScript编译成功
- ✅ 依赖包安装完成
- ✅ .vsix文件生成成功 (1.6MB)
- ✅ VSCode插件安装成功

### 🔧 生成的文件
- `debian-smart-changelog-1.0.0.vsix` - 可安装的插件包
- `out/` - 编译后的JavaScript文件
- `LICENSE` - MIT许可证文件

## 🧪 测试步骤

### 1. 基本功能测试

1. **打开测试文件**
   ```bash
   code example/debian/changelog
   ```

2. **测试基本生成功能**
   - 在changelog文件中，将光标置于文件开头
   - 按快捷键 `Ctrl+Alt+D`
   - 应该会弹出输入框要求输入包名和版本号

3. **测试Git集成功能**
   - 确保当前项目是Git仓库
   - 按快捷键 `Ctrl+Alt+G`
   - 应该会自动分析Git提交并生成changelog条目

### 2. 配置测试

1. **配置用户信息**
   - 按 `Ctrl+Shift+P` 打开命令面板
   - 输入 "Debian" 查看可用命令
   - 选择 "Debian: 配置用户信息"
   - 输入姓名和邮箱

2. **检查生成的格式**
   ```
   package-name (version) unstable; urgency=medium

     * 生成的变更条目
     * 另一个变更条目

    -- Your Name <your@email.com>  Wed, 31 Jul 2025 21:22:30 +0800
   ```

### 3. Git集成测试

如果要测试Git集成功能：

1. **创建测试提交**
   ```bash
   git add .
   git commit -m "Fix memory leak in audio module (fixes #123)"
   git commit -m "Add dark theme support (closes #456)"
   ```

2. **测试智能生成**
   - 打开changelog文件
   - 按 `Ctrl+Alt+G`
   - 查看是否正确提取了提交信息

### 4. Issue集成测试

要测试Issue跟踪功能（需要配置API令牌）：

1. **配置GitHub令牌**
   - 在VSCode设置中添加：
   ```json
   {
     "debianChangelog.github.token": "your_github_token"
   }
   ```

2. **测试Issue详情获取**
   - 确保Git提交消息包含Issue引用（如 #123）
   - 使用Git生成功能，检查是否获取了Issue详情

## 📊 测试结果验证

### ✅ 成功指标
- [ ] 插件加载无错误
- [ ] 快捷键正常响应
- [ ] 生成的changelog格式正确
- [ ] Git提交信息正确提取
- [ ] 版本号自动递增
- [ ] 日期格式符合Debian标准

### 🐛 常见问题
1. **命令未找到**: 重启VSCode后再试
2. **Git信息获取失败**: 确保在Git仓库根目录
3. **API访问失败**: 检查网络连接和令牌配置

## 🎯 功能对比

| 功能 | 原有插件 | 我们的插件 | 状态 |
|------|----------|------------|------|
| 基本模板生成 | ✅ | ✅ | ✅ 完成 |
| Git提交集成 | ❌ | ✅ | ✅ 完成 |
| Issue跟踪集成 | ❌ | ✅ | ✅ 完成 |
| 智能紧急程度 | ❌ | ✅ | ✅ 完成 |
| 自动版本递增 | ❌ | ✅ | ✅ 完成 |
| 文件变更感知 | ❌ | ✅ | ✅ 完成 |

## 🚀 下一步

1. **立即测试**: 按照上述步骤验证功能
2. **配置调优**: 根据个人需求调整设置
3. **实际使用**: 在真实项目中使用插件
4. **反馈改进**: 发现问题及时反馈

---

🎉 **插件已准备就绪，开始享受智能Debian changelog生成体验吧！**