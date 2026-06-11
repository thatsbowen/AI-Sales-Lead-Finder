<h1 align="center">AI帮找产品销售线索</h1>
<h3 align="center">AI-Powered Sales Lead Discovery for Foreign Trade SMEs</h3>

<p align="center">
  <img src="https://img.shields.io/badge/platform-Windows-blue?style=flat-square" alt="Platform">
  <img src="https://img.shields.io/badge/framework-Electron-47848F?style=flat-square&logo=electron" alt="Electron">
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/version-1.0.0-brightgreen?style=flat-square" alt="Version">
</p>

<p align="center">
  <a href="#-项目简介--project-overview">项目简介</a> ·
  <a href="#-核心功能--features">核心功能</a> ·
  <a href="#-快速开始--quick-start">快速开始</a> ·
  <a href="#-使用流程--workflow">使用流程</a> ·
  <a href="#-技术栈--tech-stack">技术栈</a> ·
  <a href="#-常见问题--faq">FAQ</a>
</p>

---

## 📖 项目简介 / Project Overview

| EN | 中文 |
|---|---|
| **AI-Sales-Lead-Finder** is a desktop application designed specifically for foreign trade SMEs. It leverages large language models (LLMs) to search the web and discover potential buyer leads. Users configure any compatible LLM API (DeepSeek, MiniMax, Kimi, or Qwen), input product keywords, and the app generates a structured report of procurement contacts—complete with names, phone numbers, emails, demand descriptions, and countries. | **AI帮找产品销售线索** 是一款专为外贸中小企业设计的桌面应用。它利用大语言模型的联网搜索能力，帮助用户发现潜在采购商线索。用户只需配置任意兼容的大模型 API（DeepSeek、MiniMax、Kimi、Qwen），输入产品关键字，应用即可自动生成一份包含联系人名称、电话、邮箱、采购诉求及所属国家的结构化线索报告。 |

---

## ✨ 核心功能 / Features

| Feature | 功能 |
|---|---|
| 🧠 Multi-model support — DeepSeek / MiniMax / Kimi / Qwen | 多模型支持 — DeepSeek / MiniMax / Kimi / Qwen |
| 🔒 Mandatory API configuration (cannot skip) | 强制大模型配置（不可跳过） |
| 🌐 AI-powered web search for procurement leads | AI 联网搜索采购商线索 |
| 📋 Structured results: name / phone / email / demand / country | 结构化结果：名称 / 电话 / 邮箱 / 诉求 / 国家 |
| 📥 Export reports to Excel (CSV) or PDF | 导出为 Excel (CSV) 或 PDF |
| 💾 Local persistence — auto-restore last session | 本地持久化 — 自动恢复上次配置 |
| 🎁 Optional donation page after configuration | 配置后可跳过打赏页面 |
| 🎨 Modern, clean UI — gray-white palette with blue accents | 现代简洁界面 — 灰白基调 + 蓝色点缀 |

---

## ⚡ 快速开始 / Quick Start

### 下载预编译包 / Download Pre-built

前往 [Releases](https://github.com/your-repo/releases) 页面或 `app/` 目录下载最新版本：

```
app/AI帮找产品销售线索-Windows-x64.zip
```

解压后双击 `AI帮找产品销售线索.exe` 即可运行。

> Extract and double-click `AI帮找产品销售线索.exe` to launch.

### 源码构建 / Build from Source

| Prerequisite | Version |
|---|---|
| Node.js | ≥ 18 |
| npm | ≥ 9 |

```bash
# Clone repository
git clone https://github.com/your-repo/ai-sales-lead-finder.git
cd ai-sales-lead-finder

# Install dependencies
npm install

# Run in development
npm start

# Build for Windows
npm run build
```

---

## 🔄 使用流程 / Workflow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  1. Model       │ ──▶ │  2. Donation     │ ──▶ │  3. Product     │ ──▶ │  4. Report      │
│  Configuration  │     │  (Optional)      │     │  Info Input     │     │  & Export       │
│  大模型配置      │     │  打赏（可跳过）   │     │  产品信息输入    │     │  报告与导出     │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

| Step | EN | 中文 |
|---|---|---|
| 1 | Select a model provider (DeepSeek / MiniMax / Kimi / Qwen), enter API Key, and click "Test Connection". Once verified, proceed. | 选择大模型供应商（DeepSeek / MiniMax / Kimi / Qwen），输入 API Key 并点击"测试连接"。验证通过后继续。 |
| 2 | A donation page appears (optional, can be skipped). Scan the QR code if you'd like to support development. | 弹出打赏页面（非必要，可跳过）。欢迎扫码支持开发者。 |
| 3 | Enter product name, technical features, application scenarios, and target market. A live preview shows the search keywords. | 输入产品名称、技术特点、应用场景和目标市场。右侧实时预览搜索关键词。 |
| 4 | Click "Find Leads". The app uses the LLM to search the web, then displays results in a table. Export to Excel or PDF. | 点击"寻找销售线索"，应用通过大模型联网搜索，结果以表格展示。支持导出 Excel / PDF。 |

### API Key 获取 / Get Your API Key

| Provider | Registration | Recharge | Suggested Amount |
|---|---|---|---|
| DeepSeek | [platform.deepseek.com](https://platform.deepseek.com) | [platform.deepseek.com](https://platform.deepseek.com) | ¥5–10 |
| MiniMax | [platform.minimax.chat](https://platform.minimax.chat) | [platform.minimax.chat](https://platform.minimax.chat) | ¥5–10 |
| Kimi | [platform.moonshot.cn](https://platform.moonshot.cn) | [platform.moonshot.cn](https://platform.moonshot.cn) | ¥5–10 |
| Qwen | [dashscope.console.aliyun.com](https://dashscope.console.aliyun.com) | [dashscope.console.aliyun.com](https://dashscope.console.aliyun.com) | ¥5–10 |

> 💡 **Tip**: Recharge ¥5–10 for initial testing. Most providers offer affordable pay-as-you-go pricing.

---

## 🛠 技术栈 / Tech Stack

| Layer | Technology |
|---|---|
| Desktop Shell | Electron 28 |
| Frontend | HTML5 + CSS3 + Vanilla JS (zero framework) |
| AI Integration | OpenAI-compatible Chat Completions API |
| Search Method | LLM native web-search capability |
| Packaging | `@electron/packager` |
| Build Target | Windows x64 (portable) |

---

## 📂 项目结构 / Directory Structure

```
AI-Sales-Lead-Finder/
├── main.js              # Electron main process
├── preload.js           # Context bridge / IPC
├── package.json         # Dependencies & build config
├── renderer/
│   ├── index.html       # SPA — 4 pages
│   ├── styles.css       # Modern clean styling
│   ├── renderer.js      # App logic & state management
│   ├── qcoder.jpg       # Donation QR code
│   └── icon.png         # App icon (placeholder)
├── app/
│   └── AI帮找产品销售线索-Windows-x64.zip   # Pre-built binary
└── README.md
```

---

## ❓ 常见问题 / FAQ

<details>
<summary><strong>Q: 搜索线索的结果准确吗？ / Are the search results accurate?</strong></summary>

The quality depends on the LLM you choose and the specificity of your product keywords. More detailed inputs (technical features, application scenarios, target markets) yield better results. We recommend treating results as discovery hints rather than verified leads—always cross-check before contacting.

搜索结果质量取决于所选大模型和产品关键字的精准度。输入越详细（技术特点、应用场景、目标市场），结果越好。建议将结果视为发现线索的起点，联系前务必交叉验证。
</details>

<details>
<summary><strong>Q: 我的 API Key 安全吗？ / Is my API Key secure?</strong></summary>

Yes. Your API Key is stored only in the browser's `localStorage` on your local machine. It never leaves your computer except when making direct API calls to the LLM provider you configured.

安全。API Key 仅存储在本机浏览器的 `localStorage` 中，除直接调用大模型 API 外，不会传输到任何第三方服务器。
</details>

<details>
<summary><strong>Q: 为什么是便携版（zip）而非安装包（exe installer）？ / Why portable instead of installer?</strong></summary>

Cross-compiling NSIS installers from macOS has compatibility issues with the `app-builder` binary on Apple Silicon. The portable zip version is fully functional — just extract and run. An installer version will be provided once built on a Windows environment.

在 macOS Apple Silicon 上交叉编译 NSIS 安装包存在 `app-builder` 二进制兼容性问题。便携版功能完整，解压即用。后续在 Windows 环境构建后将提供安装包版本。
</details>

<details>
<summary><strong>Q: 支持 macOS / Linux 吗？ / Does it support macOS / Linux?</strong></summary>

Currently the pre-built package targets Windows x64 only. However, the source code is fully cross-platform — you can run `npm start` on macOS or Linux directly, or modify the build config in `package.json` to add `mac` / `linux` targets.

目前预编译包仅支持 Windows x64。但源码完全跨平台，可在 macOS / Linux 上直接运行 `npm start`，或修改 `package.json` 中的 build 配置添加 `mac` / `linux` 目标。
</details>

---

## ⚠️ 注意事项 / Important Notes

| EN | 中文 |
|---|---|
| This is an MVP version. Search quality varies by LLM provider and prompt specificity. | 本版本为 MVP 测试版。搜索质量因大模型供应商和提示词精准度而异。 |
| The app requires an active internet connection for both API calls and web searching. | 应用需要持续的网络连接以调用 API 和联网搜索。 |
| API usage incurs costs from your LLM provider. Monitor your balance. | 使用大模型 API 会产生费用，请关注账户余额。 |
| Results are AI-generated and should be verified before outreach. | 搜索结果由 AI 生成，联系前请务必核实。 |
| The bundled `qcoder.jpg` is the developer's personal donation QR code. Replace with your own if redistributing. | 内置的 `qcoder.jpg` 为开发者个人收款码。如二次分发请替换为自己的二维码。 |
| Built and tested on Electron 28. Node.js version must be ≥ 18. | 基于 Electron 28 构建和测试。Node.js 需 ≥ 18。 |

---

## 📄 License

MIT © 2026 — Free for personal and commercial use.

---

<p align="center">
  <sub>Built with ❤️ for foreign trade professionals. If this tool helps you find one client, it has already paid for itself.</sub>
  <br>
  <sub>为外贸人而建。如果这个工具帮你找到了一个客户，它已经值回票价。</sub>
</p>