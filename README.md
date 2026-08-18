# GMS 进度监控站

用于追踪 Global MapleStory 多角色装备、六转、副专业、日常/周常任务、Boss Mule 与经验进度。

## 下载

### 从 GitHub 下载源码

1. 打开仓库页面。
2. 点击 **Code → Download ZIP**。
3. 完整解压 ZIP 文件。

### 使用 Git 克隆

```bash
git clone git@github.com:ixLeTh3E/GMS-Progress-Tracker.git
```

## 在哪里输入命令

以下代码需要粘贴到命令行终端中执行，而不是在浏览器地址栏输入：

- macOS：打开“启动台 → 终端（Terminal）”，默认使用 `bash` 或 `zsh`。
- Linux：打开系统自带的终端。
- Windows：
  - 推荐使用 Git Bash。
  - 也可以使用 PowerShell 或 CMD。
  - 如果只是双击 `点我启动GMS_MONITOR.cmd`，则不需要手动输入命令。

进入终端后，先切换到项目所在目录，例如：

```bash
cd /path/to/GMS-Progress-Tracker
```

然后再执行 `git clone`、`npm install`、`npm start` 或 `node server.mjs --lan` 等命令。

## Windows 运行

### 完整模式

完整模式支持按 ID 导入角色和自动刷新经验。

1. 如果尚未安装 Node.js，请先安装 LTS 版本。
2. 双击：

```text
点我启动GMS_MONITOR.cmd
```

3. 启动脚本会自动安装缺失的 npm 依赖。
4. 默认浏览器会自动打开：

```text
http://127.0.0.1:4173
```

### 离线模式

离线模式不需要 Node.js。

双击：

```text
点我启动GMS_MONITOR离线版.cmd
```

该模式直接打开本地 `index.html`。角色管理、任务、Boss Mule、CSV 导入导出和本地保存均可使用；不支持按 ID 导入 MapleRanks 数据和自动刷新经验。

## macOS / Linux 运行

```bash
npm install
npm start
```

打开：

```text
http://127.0.0.1:4173
```

如需允许局域网内其他设备访问：

```bash
node server.mjs --lan
```

## 安装 Node.js

如果 Windows 启动脚本提示缺少 Node.js：

1. 打开：[https://nodejs.org/en/download](https://nodejs.org/en/download)
2. 下载并安装 LTS 版本。
3. 重新启动终端或再次双击启动脚本。
4. 检查安装：

```bash
node -v
npm -v
```

## 安装项目依赖

Windows 完整模式启动脚本会自动安装依赖。手动安装：

```bash
npm install
```

## 浏览器要求

- 完整模式：按 ID 导入和经验刷新需要使用 Chrome 或 Edge。
- 离线模式：任意现代浏览器均可使用。
- Windows 默认包含 Edge，通常无需额外安装浏览器。

## 首次使用

- 新浏览器环境默认只显示 `Feliuca`。
- 如需载入当前示例配置，进入 `数据管理 → 恢复示例`。

## 仓库内容说明

GitHub 仓库包含源码、资源与文档，不包含：

- `node_modules`
- Windows 便携 Node.js 运行时
- 本地头像缓存
- 已生成的发布压缩包

自包含 Windows 包 `GMS-PROGRESS-TRACKER.zip` 由发布流程单独生成。

## 相关文档

- [UPDATE_STATUS.md](UPDATE_STATUS.md)
- [CLASS_MAPPING_AUDIT.md](CLASS_MAPPING_AUDIT.md)

## 仓库

[https://github.com/ixLeTh3E/GMS-Progress-Tracker](https://github.com/ixLeTh3E/GMS-Progress-Tracker)

---

# GMS Progress Tracker

Global MapleStory multi-character progress tracker for equipment, HEXA, professions, daily/weekly tasks, Boss Mules, and EXP tracking.

## Download

### Download from GitHub

1. Open the repository page.
2. Click **Code → Download ZIP**.
3. Extract the ZIP file completely.

### Clone with Git

```bash
git clone git@github.com:ixLeTh3E/GMS-Progress-Tracker.git
```

## Where to Enter Commands

Paste the commands into a command-line terminal, not into the browser address bar:

- macOS: open **Launchpad → Terminal**. The default shell is `bash` or `zsh`.
- Linux: open the system terminal.
- Windows:
  - Git Bash is recommended.
  - PowerShell or CMD can also be used.
  - If you double-click `点我启动GMS_MONITOR.cmd`, you do not need to enter commands manually.

After opening the terminal, change to the project directory first:

```bash
cd /path/to/GMS-Progress-Tracker
```

Then run commands such as `git clone`, `npm install`, `npm start`, or `node server.mjs --lan`.

## Run on Windows

### Full Mode

Full mode supports MapleRanks ID import and EXP refresh.

1. Install Node.js LTS if it is not installed.
2. Double-click:

```text
点我启动GMS_MONITOR.cmd
```

3. The launcher installs missing npm dependencies automatically.
4. The default browser opens automatically at:

```text
http://127.0.0.1:4173
```

### Offline Mode

Offline mode does not require Node.js.

Double-click:

```text
点我启动GMS_MONITOR离线版.cmd
```

This opens the local `index.html` directly. Character management, tasks, Boss Mules, CSV import/export, and local saving are available. MapleRanks ID import and automatic EXP refresh are not available in this mode.

## Run on macOS / Linux

```bash
npm install
npm start
```

Open:

```text
http://127.0.0.1:4173
```

To allow access from another device on the local network:

```bash
node server.mjs --lan
```

## Install Node.js

If the Windows launcher reports that Node.js is missing:

1. Open: [https://nodejs.org/en/download](https://nodejs.org/en/download)
2. Download and install the LTS version.
3. Restart the terminal or double-click the launcher again.
4. Verify the installation:

```bash
node -v
npm -v
```

## Install Project Dependencies

The Windows full-mode launcher installs dependencies automatically. To install them manually:

```bash
npm install
```

## Browser Requirement

- Full mode: Chrome or Edge is required for MapleRanks ID import and EXP refresh.
- Offline mode: any modern browser can be used.
- Windows includes Edge by default, so no additional browser installation is usually required.

## First Use

- A new browser profile starts with only `Feliuca`.
- To load the current saved example configuration, open `Data → Restore Sample`.

## Repository Contents

The GitHub repository contains source code, assets, and documents. It does not include:

- `node_modules`
- Portable Windows Node.js runtime
- Local avatar cache
- Generated release ZIP

The self-contained Windows package `GMS-PROGRESS-TRACKER.zip` is generated separately from the release build process.

## Documentation

- [UPDATE_STATUS.md](UPDATE_STATUS.md)
- [CLASS_MAPPING_AUDIT.md](CLASS_MAPPING_AUDIT.md)

## Repository

[https://github.com/ixLeTh3E/GMS-Progress-Tracker](https://github.com/ixLeTh3E/GMS-Progress-Tracker)
