import React, { useState } from 'react';
import { Keyboard, Search, Terminal, Globe, Cpu, GitBranch, Code } from 'lucide-react';
import { SHORTCUTS_DATA } from '../data/shortcutsData';

export default function ShortcutsHub() {
  const [selectedTool, setSelectedTool] = useState('All');
  const [search, setSearch] = useState('');

  const filteredCategories = SHORTCUTS_DATA.filter((group) => {
    if (selectedTool !== 'All' && group.tool !== selectedTool) return false;
    return true;
  }).map(group => {
    if (!search.trim()) return group;
    const matchingShortcuts = group.shortcuts.filter(
      s => s.action.toLowerCase().includes(search.toLowerCase()) || 
           s.key.toLowerCase().includes(search.toLowerCase())
    );
    return { ...group, shortcuts: matchingShortcuts };
  }).filter(group => group.shortcuts.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
          <Keyboard size={13} className="text-slate-800" />
          <span>Productivity & Low-Level Navigation</span>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          IDE & Debugger Shortcuts Cheatsheet
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
          The essential keystrokes used by senior systems engineers across modern AI IDEs (Cursor), Chrome DevTools, JetBrains, GDB, and Git.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedTool('All')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedTool === 'All'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Tools
          </button>
          {SHORTCUTS_DATA.map((g) => (
            <button
              key={g.tool}
              onClick={() => setSelectedTool(g.tool)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedTool === g.tool
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {g.tool}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shortcut (e.g. F5, step, git)..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
          />
        </div>
      </div>

      {/* Shortcuts Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCategories.map((group) => (
          <div key={group.tool} className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
                  {group.tool.includes('Cursor') ? <Code size={15} /> : (
                    group.tool.includes('Chrome') ? <Globe size={15} /> : (
                      group.tool.includes('JetBrains') ? <Cpu size={15} /> : (
                        group.tool.includes('Git') ? <GitBranch size={15} /> : <Terminal size={15} />
                      )
                    )
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900">{group.tool}</h3>
                  <div className="text-[10px] text-slate-500">{group.category}</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 font-semibold">
                {group.shortcuts.length} bindings
              </span>
            </div>

            <div className="p-3 divide-y divide-slate-100">
              {group.shortcuts.map((sc, idx) => (
                <div key={idx} className="py-2 px-1 flex items-center justify-between text-xs">
                  <span className="text-slate-700 text-[11px] leading-tight pr-3">
                    {sc.action}
                  </span>
                  <kbd className="px-2 py-1 rounded bg-slate-100 border border-slate-200/90 font-mono text-[10px] font-bold text-slate-800 shadow-2xs whitespace-nowrap">
                    {sc.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
