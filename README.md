# 项目名称

## 简介

此项目是一个包含多个包的单体仓库（monorepo），使用 [pnpm](https://pnpm.io/) 进行包管理。项目包含以下主要模块：

- **CLI**：命令行工具相关代码。
- **Release Scripts**：发布脚本和相关工具。
- **UI**：用户界面相关代码。
- **Utils**：通用工具函数。

## 目录结构

```
.
├── .github/             # GitHub 配置文件
│   └── workflows/       # CI/CD 工作流
├── .vscode/             # VS Code 配置
├── packages/            # 项目核心模块
│   ├── cli/             # CLI 工具
│   ├── release-scripts/ # 发布脚本
│   ├── ui/              # 用户界面
│   └── utils/           # 工具函数
├── scripts/             # 脚本文件
├── ui/                  # UI 相关代码
└── ...                  # 其他配置文件
```

## 安装

确保已安装 [Node.js](https://nodejs.org/) 和 [pnpm](https://pnpm.io/)。

```bash
# 安装依赖
pnpm install
```

## 使用

### 构建项目

运行以下命令以构建项目：

```bash
pnpm build
```

### 启动开发服务器

对于 UI 模块，可以运行以下命令启动开发服务器：

```bash
pnpm --filter ui dev
```

### 发布

使用 `scripts/publishCI.ts` 和 `scripts/release.ts` 脚本进行发布：

```bash
# 发布到 CI 环境
pnpm ts-node scripts/publishCI.ts

# 发布新版本
pnpm ts-node scripts/release.ts
```

## 贡献

欢迎贡献代码！请确保在提交代码之前运行以下命令以检查代码格式和质量：

```bash
pnpm lint
pnpm test
```

## 许可证

此项目基于 [LICENSE](LICENSE) 文件中的内容授权。
