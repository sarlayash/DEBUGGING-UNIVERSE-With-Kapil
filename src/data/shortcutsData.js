// Shortcuts Cheatsheets for Fortune 500 Debugging & Development

export const SHORTCUTS_DATA = [
  {
    tool: 'Cursor & VS Code',
    category: 'IDE Debugging & Navigation',
    icon: 'code',
    shortcuts: [
      { key: 'F5', action: 'Start / Continue Debugging' },
      { key: 'F9', action: 'Toggle Line Breakpoint' },
      { key: 'F10', action: 'Step Over' },
      { key: 'F11', action: 'Step Into' },
      { key: 'Shift + F11', action: 'Step Out' },
      { key: 'Ctrl + Shift + F5', action: 'Restart Debugging Session' },
      { key: 'Ctrl + K', action: 'Cursor Inline AI Edit Prompt' },
      { key: 'Ctrl + I / Ctrl + L', action: 'Open Cursor Composer / Chat' },
      { key: 'Ctrl + Shift + P', action: 'Show All Commands / Quick Palette' },
      { key: 'Ctrl + P', action: 'Quick Open File by Name' },
      { key: 'Alt + Click', action: 'Insert Multi-Cursor' },
      { key: 'Ctrl + `', action: 'Toggle Integrated Terminal' }
    ]
  },
  {
    tool: 'Chrome DevTools',
    category: 'Web & Frontend Debugging',
    icon: 'globe',
    shortcuts: [
      { key: 'F12 or Ctrl + Shift + I', action: 'Open Developer Tools' },
      { key: 'Ctrl + P (in DevTools)', action: 'Open Source File' },
      { key: 'Ctrl + Shift + F', action: 'Search across all loaded sources' },
      { key: 'F8', action: 'Pause / Resume script execution' },
      { key: 'F10', action: 'Step over next function call' },
      { key: 'F11', action: 'Step into next function call' },
      { key: 'Shift + F11', action: 'Step out of current function' },
      { key: 'Esc', action: 'Toggle Console Drawer in any tab' },
      { key: 'Ctrl + L', action: 'Clear Console output' },
      { key: 'Ctrl + Shift + P', action: 'Run DevTools Command (e.g. Screenshot, Disable JS)' }
    ]
  },
  {
    tool: 'JetBrains (IntelliJ, PyCharm, CLion)',
    category: 'Enterprise JVM & Systems IDE',
    icon: 'cpu',
    shortcuts: [
      { key: 'Shift + F9', action: 'Debug Current Configuration' },
      { key: 'Ctrl + F8', action: 'Toggle Breakpoint' },
      { key: 'Ctrl + Shift + F8', action: 'View / Edit Breakpoint Properties (Condition, Hit Count)' },
      { key: 'F8', action: 'Step Over' },
      { key: 'F7', action: 'Step Into' },
      { key: 'Shift + F8', action: 'Step Out' },
      { key: 'Alt + F9', action: 'Run to Cursor' },
      { key: 'Alt + F8', action: 'Evaluate Expression on active frame' },
      { key: 'Double Shift', action: 'Search Everywhere (Classes, Files, Actions)' },
      { key: 'Ctrl + Alt + L', action: 'Reformat Code according to styleguide' }
    ]
  },
  {
    tool: 'GDB & LLDB (Terminal)',
    category: 'Low-Level Systems Debugging',
    icon: 'terminal',
    shortcuts: [
      { key: 'b <func> / b <file>:<line>', action: 'Set Breakpoint' },
      { key: 'r / run <args>', action: 'Start Program with Arguments' },
      { key: 'c / continue', action: 'Resume Execution until next breakpoint' },
      { key: 'n / next', action: 'Step Over (Line-by-line)' },
      { key: 's / step', action: 'Step Into Function' },
      { key: 'fin / finish', action: 'Step Out of current function' },
      { key: 'bt / backtrace', action: 'Print complete Call Stack' },
      { key: 'f <n> / frame <n>', action: 'Switch to Stack Frame N' },
      { key: 'p <var> / print', action: 'Print Variable or Memory address value' },
      { key: 'watch <var>', action: 'Set Hardware Watchpoint on Variable modification' },
      { key: 'x/10xw <addr>', action: 'Examine 10 hex words in memory' }
    ]
  },
  {
    tool: 'Git Diagnostic Toolkit',
    category: 'Version Control Regression Analysis',
    icon: 'git-branch',
    shortcuts: [
      { key: 'git bisect start', action: 'Initiate Binary Search for bug-inducing commit' },
      { key: 'git bisect bad / good', action: 'Tag commit state to narrow regression' },
      { key: 'git reflog', action: 'Inspect complete HEAD movement history (recover lost commits)' },
      { key: 'git blame -L 10,25 <file>', action: 'Inspect author & commit for specific line range' },
      { key: 'git diff --stat', action: 'Summary of modified files & lines' },
      { key: 'git stash push -m "wip"', action: 'Temporarily shelve dirty working state' }
    ]
  }
];
