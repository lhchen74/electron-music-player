> Build cross platform desktop apps with JavaScript, HTML, and CSS  - Electron

### 基本概念

Electron 中分主进程和渲染进程，主进程相当于浏览器整个窗口，渲染进程相当于每个 **Tab** 页。

**主进程 Main Process**

- 可以使用和系统对接的 Electron API - 创建菜单，上传文件等
- 创建渲染进程 - Renderer Process
- 全面支持 Node.js
- 只有一个作为程序的入口点

**渲染进程 Renderer Process**

- 可以有多个，每个对应一个窗口
- 每个都是一个单独的进程
- 全面支持 Node.js 和 DOM API
- 可以使用一部分 Electron 提供的 API