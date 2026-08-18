# GMS Progress Tracker Update Status

# GMS 监控站更新状态

**Updated:** 2026-08-18  
**Version:** 1.0.0

---

## 1. Windows Self-Contained Launch

### 1. Windows 自包含启动

- The Windows package now bundles Node.js `v22.23.2 win-x64`, `npm`, and a preinstalled Playwright dependency.
- No separate Node.js or npm installation is required.
- Two launchers are included:
  - `点我启动GMS_MONITOR.cmd` — full mode with online import and EXP refresh.
  - `点我启动GMS_MONITOR离线版.cmd` — offline local mode.
- The full-mode launcher automatically opens `http://127.0.0.1:4173` after the server is ready.
- The server automatically detects Chrome or Edge on Windows.

- Windows 发布包已内置 Node.js `v22.23.2 win-x64`、npm 和预装好的 Playwright 依赖。
- 无需另外安装 Node.js 或 npm。
- 包含两个启动脚本：
  - `点我启动GMS_MONITOR.cmd`：完整模式，支持按 ID 导入和经验刷新。
  - `点我启动GMS_MONITOR离线版.cmd`：离线本地模式。
- 完整模式会在服务就绪后自动打开 `http://127.0.0.1:4173`。
- 服务会自动检测 Windows 上的 Chrome 或 Edge。

## 2. Initial Sample and Restore Sample

### 2. 初始示例与恢复示例

- A new user starts with only `Feliuca`.
- `Yat1ma` is no longer shown in the initial seed.
- `Data → Restore Sample` restores the current saved snapshot:
  - `Feliuca`
  - `GemiCi`
  - `NeNeMika`
- The snapshot includes character details, task assignments, Boss Mule plans, completion states, WAP usage, notes, and UI settings.

- 新用户首次打开时只显示 `Feliuca`。
- 初始示例中不再显示 `Yat1ma`。
- `数据管理 → 恢复示例` 会恢复当前快照：
  - `Feliuca`
  - `GemiCi`
  - `NeNeMika`
- 快照包含角色信息、任务分配、Boss Mule 计划、完成状态、WAP 用量、备注和界面设置。

## 3. Automatic Daily and Weekly Reset

### 3. 日常与周常自动重置

- Daily reset: Beijing time `08:00` every day.
- Weekly and Boss reset: Beijing time `08:00` every Thursday.
- Event reset: Beijing time `08:00` every Wednesday.
- The page checks reset boundaries every 30 seconds while open.
- Reset clears:
  - Daily tasks, daily Boss completions, and WAP usage.
  - Weekly tasks, weekly Boss completions, and Boss Mule completion toggles.

- 日常重置：北京时间每天 `08:00`。
- 周常和 Boss 重置：北京时间每周四 `08:00`。
- 活动重置：北京时间每周三 `08:00`。
- 页面打开期间每 30 秒检查一次重置边界。
- 重置会清理：
  - 日常任务、每日 Boss 完成状态和 WAP 用量。
  - 周常任务、Boss 完成状态和 Boss Mule 勾选状态。

## 4. Epic Dungeon and Boss Level Requirements

### 4. 史诗副本与 Boss 等级限制

- Epic Dungeon level requirements:
  - High Mountain: `Lv.260+`
  - Angler Company: `Lv.270+`
  - Nightmare Paradise: `Lv.280+`
- Boss Mule entries now use Wiki-based entry-level requirements.
- Bosses above a character's level are hidden from the add list.
- Invalid existing Boss plans are cleaned automatically.
- `Full Weekly Boss Clear` is available only when the character has at least one Boss plan.

- 史诗副本等级要求：
  - 高山：`Lv.260+`
  - 钓鱼公司：`Lv.270+`
  - 噩梦乐园：`Lv.280+`
- Boss Mule 条目已按 Wiki 入场等级设置限制。
- 高于角色等级的 Boss 不会出现在添加列表中。
- 已存在的无效 Boss 计划会自动清理。
- `每周 Boss 全清` 只在角色已有 Boss 计划时显示。

## 5. Class Import Mapping

### 5. 职业导入映射

- The server now generates aliases from the complete class definition table.
- Alias generation includes class keys, display names, and abbreviations.
- Manual special aliases are preserved for Arch Mages, Zero, Ren, and Erel Light.
- Recently verified imports:

| Test ID | Raw class | Mapped class |
| --- | --- | --- |
| `nebenfluss` | `Arch Mage (I/L)` | `IceLightning` |
| `Anthouria` | `Zero` | `Zero` |
| `NeNemoLe` | `Ren` | `Ren` |
| `Drampa` | `Erel Light` | `ErelLight` |
| `nemomap` | `Mo Xuan` | `MoXuan` |
| `raubahm` | `Aran` | `Aran` |

- `Ren` and `Erel Light` now have complete local resources:
  - Ren: Sword, Imugi Gem, Gold Sword Emblem, `assets/classes/ren.png`
  - Erel Light: Gram, Keir, Gold Guardian Emblem, `assets/classes/erel-light.png`
- `Mo Xuan` now has complete local resources:
  - Mo Xuan: Martial Brace, Brace Band, Gold Xuanshan School Emblem, `assets/classes/mo-xuan.png`

- 服务端现在会从完整职业定义表自动生成别名。
- 别名生成覆盖职业 Key、显示名和缩写。
- Arch Mage、Zero、Ren、Erel Light 等特殊别名单独保留。
- 最近已验证的导入结果：

| 测试 ID | 原始职业 | 映射职业 |
| --- | --- | --- |
| `nebenfluss` | `Arch Mage (I/L)` | `IceLightning` |
| `Anthouria` | `Zero` | `Zero` |
| `NeNemoLe` | `Ren` | `Ren` |
| `Drampa` | `Erel Light` | `ErelLight` |
| `nemomap` | `Mo Xuan` | `MoXuan` |
| `raubahm` | `Aran` | `Aran` |

- `Ren` 和 `Erel Light` 已补齐本地资源：
  - Ren：Sword、Imugi Gem、Gold Sword Emblem、`assets/classes/ren.png`
  - Erel Light：Gram、Keir、Gold Guardian Emblem、`assets/classes/erel-light.png`
- `Mo Xuan` 已补齐本地资源：
  - Mo Xuan：Martial Brace、Brace Band、Gold Xuanshan School Emblem、`assets/classes/mo-xuan.png`

## 6. Local Resources

### 6. 本地资源

- Class thumbnails, weapons, Boss icons, task icons, and Hexa resource icons are loaded locally.
- Hexa Sol Erda and Fragment thumbnails use:
  - `assets/hexa/resource/erda.png`
  - `assets/hexa/resource/frag.png`

- 职业缩略图、武器、Boss 图标、任务图标和六转资源图标均使用本地文件。
- 六转大核和小核缩略图使用：
  - `assets/hexa/resource/erda.png`
  - `assets/hexa/resource/frag.png`

## 7. Known Limitations

### 7. 已知限制

- The offline launcher does not support MapleRanks ID import or automatic EXP refresh.
- `IceLightning` and `FirePoison` Hexa skill thumbnails are currently fallback placeholders.

- 离线启动模式不支持 MapleRanks 按 ID 导入和自动经验刷新。
- `IceLightning` 与 `FirePoison` 的六转技能缩略图目前仍使用占位图标。

## 8. Release Package

### 8. 发布包

- Package: `GMS-PROGRESS-TRACKER.zip`
- The archive includes the portable Windows Node.js runtime and preinstalled dependencies.
- Local avatar cache, hidden files, and temporary files are excluded.

- 发布包：`GMS-PROGRESS-TRACKER.zip`
- 压缩包包含 Windows 便携 Node.js 运行时和预装依赖。
- 已排除本地头像缓存、隐藏文件和临时文件。

## 9. MapleRanks Leaderboard Class Audit

### 9. MapleRanks 排行榜职业校验

- MapleRanks Leaderboards jobs tested: **57**
- Playable classes passed: **53**
- Special/non-playable jobs marked unsupported: **4**
- Failing playable classes: **0**
- Corrected display-name aliases:
  - `Bow Master` → `Bowmaster`
  - `Cannon Master` → `Cannoneer`
  - `Blade Master` → `DualBlade`

Detailed bilingual results are recorded in [CLASS_MAPPING_AUDIT.md](CLASS_MAPPING_AUDIT.md).

- MapleRanks 排行榜已测试职业：**57**
- 可玩职业全部通过：**53**
- 特殊/非战斗职业标记为不支持：**4**
- 可玩职业失败数：**0**
- 已修正的显示名别名：
  - `Bow Master` → `Bowmaster`
  - `Cannon Master` → `Cannoneer`
  - `Blade Master` → `DualBlade`

详细中英文结果记录于 [CLASS_MAPPING_AUDIT.md](CLASS_MAPPING_AUDIT.md)。
