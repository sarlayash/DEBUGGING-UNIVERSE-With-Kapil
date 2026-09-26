// Comprehensive Question Bank: Programming in ALL Languages & ALL AI Portals
// 60%+ Hard / Expert Tier with production debugging code, hidden test cases, hints, negative marking, and tips

export const CHALLENGES_DATA = [
  {
    id: 'py_hard_concurrency',
    title: 'Distributed Worker Queue Race Condition',
    language: 'Python',
    category: 'Backend & Concurrency',
    difficulty: 'Hard', // 60% Hard requirement
    isHard: true,
    tags: ['Python 3.12', 'Asyncio', 'Race Condition', 'Threading'],
    description: `A distributed task processor intermittently drops task completions under high concurrency. Workers read from an in-memory queue, compute task checksums, and update a shared state dictionary. Under 100+ concurrent workers, task counter metrics become corrupted due to unsynchronized state updates and unawaited coroutines.`,
    buggyCode: `import asyncio

class TaskQueueManager:
    def __init__(self):
        self.completed_tasks = 0
        self.task_registry = {}

    async def process_task(self, task_id, payload):
        # BUG: Race condition on dictionary update without lock
        # and unshielded task completion mutation
        await asyncio.sleep(0.01)
        self.completed_tasks += 1
        self.task_registry[task_id] = "PROCESSED_" + str(payload)
        return self.completed_tasks

    async def run_batch(self, task_list):
        # BUG: Missing gather error isolation & concurrent mutation lock
        tasks = [self.process_task(t[0], t[1]) for t in task_list]
        results = await asyncio.gather(*tasks)
        return {"total": self.completed_tasks, "registry_size": len(self.task_registry)}
`,
    fixedCode: `import asyncio

class TaskQueueManager:
    def __init__(self):
        self.completed_tasks = 0
        self.task_registry = {}
        self._lock = asyncio.Lock()

    async def process_task(self, task_id, payload):
        await asyncio.sleep(0.01)
        async with self._lock:
            self.completed_tasks += 1
            self.task_registry[task_id] = "PROCESSED_" + str(payload)
            return self.completed_tasks

    async def run_batch(self, task_list):
        tasks = [self.process_task(t[0], t[1]) for t in task_list]
        await asyncio.gather(*tasks)
        async with self._lock:
            return {"total": self.completed_tasks, "registry_size": len(self.task_registry)}
`,
    explanation: `In asynchronous Python, operations like += and dictionary state updates during concurrent task switching can lead to race conditions if yield points (await statements) interrupt state sequences. Adding an asyncio.Lock() guarantees serialized mutations of shared state across all coroutines.`,
    guideTip: `Never assume async code is inherently thread-safe or race-free. Whenever multiple tasks read-modify-write shared instances, wrap the critical section in asyncio.Lock().`,
    hints: [
      'Look at how self.completed_tasks is incremented when multiple coroutines yield.',
      'Check if asyncio.Lock() should be acquired before updating shared memory objects.',
      'Ensure the final count matches len(task_list) atomically.'
    ],
    testCases: [
      { id: 1, name: 'Batch 5 concurrent tasks', input: '5 items', expected: 'total: 5, registry_size: 5', isHidden: false },
      { id: 2, name: 'High contention (100 parallel tasks)', input: '100 items', expected: 'total: 100, registry_size: 100', isHidden: true },
      { id: 3, name: 'Duplicate task IDs resilience', input: 'idempotent set', expected: 'No deadlock or corruption', isHidden: true }
    ],
    points: 40,
    penalty: 10 // Negative marking
  },
  {
    id: 'ai_claude_code_tool_deadlock',
    title: 'Claude Code Agentic Tool Calling Parameter Deadlock',
    language: 'AI Portal (Claude Code)',
    category: 'Agentic Tooling & AI Orchestration',
    difficulty: 'Hard',
    isHard: true,
    tags: ['Claude Code', 'Agentic Loop', 'JSON Schema', 'Subagent Timeout'],
    description: `During an autonomous multi-file refactoring session in Claude Code, the agent repeatedly attempts to invoke a custom schema tool 'replace_file_content'. However, the tool call fails silently or throws an unhandled validation error because the agent hallucinated an optional property as required and passed non-string line numbers. The subagent conversation becomes trapped in an infinite retry loop, burning context budget.`,
    buggyCode: `// Claude Code Tool Invocation Handler
export function executeToolCall(toolName, rawArgs) {
  if (toolName === 'replace_file_content') {
    // BUG: Loose type coercion causes NaN line numbers
    // and missing validation on mandatory TargetContent vs ReplacementContent
    const startLine = Number(rawArgs.start_line);
    const endLine = Number(rawArgs.end_line);

    if (!rawArgs.file_path || !rawArgs.content) {
      throw new Error("Missing parameters"); // Generic failure triggers agent loop
    }

    return performReplacement({
      path: rawArgs.file_path,
      start: startLine,
      end: endLine,
      target: rawArgs.content
    });
  }
}
`,
    fixedCode: `// Claude Code Tool Invocation Handler
export function executeToolCall(toolName, rawArgs) {
  if (toolName === 'replace_file_content') {
    // Robust schema normalization and informative feedback loop
    const targetFile = rawArgs.TargetFile || rawArgs.file_path;
    const startLine = parseInt(rawArgs.StartLine ?? rawArgs.start_line, 10);
    const endLine = parseInt(rawArgs.EndLine ?? rawArgs.end_line, 10);
    const target = rawArgs.TargetContent ?? rawArgs.target;
    const replacement = rawArgs.ReplacementContent ?? rawArgs.replacement ?? '';

    if (!targetFile) {
      return { success: false, error: "VALIDATION_ERROR: TargetFile path is strictly required." };
    }
    if (isNaN(startLine) || isNaN(endLine) || startLine < 1 || startLine > endLine) {
      return { success: false, error: \`INVALID_RANGE: StartLine (\${startLine}) and EndLine (\${endLine}) must be valid positive integers where StartLine <= EndLine.\` };
    }
    if (typeof target !== 'string') {
      return { success: false, error: "VALIDATION_ERROR: TargetContent must be an exact string match." };
    }

    return performReplacement({ path: targetFile, start: startLine, end: endLine, target, replacement });
  }
}
`,
    explanation: `Agentic AI coding tools like Claude Code rely on descriptive structured feedback to break out of hallucination loops. Throwing raw unhandled exceptions blinds the LLM planner. Returning schema validation diagnostics with exact field names allows the agent to self-correct in turn 2.`,
    guideTip: `When designing tools for agentic AI coders, never throw uncaught exceptions. Return structured error objects with actionable corrective instructions that guide the LLM's next prompt.`,
    hints: [
      'Look at how rawArgs accommodates both camelCase and snake_case parameter keys.',
      'Check whether line numbers are verified against NaN before calling performReplacement.',
      'Return a friendly diagnostic message instead of throwing an unhandled exception.'
    ],
    testCases: [
      { id: 1, name: 'Standard Claude Code PascalCase payload', input: '{ TargetFile: "main.py", StartLine: 1, EndLine: 5, TargetContent: "foo" }', expected: 'success: true', isHidden: false },
      { id: 2, name: 'Negative or inverted line range', input: 'StartLine: 10, EndLine: 2', expected: 'INVALID_RANGE error returned gracefully', isHidden: true },
      { id: 3, name: 'Empty replacement string handling', input: 'ReplacementContent: ""', expected: 'success: true, target removed', isHidden: true }
    ],
    points: 45,
    penalty: 10
  },
  {
    id: 'ai_cursor_hallucinated_imports',
    title: 'Cursor Composer Hallucinated Package Resolution',
    language: 'AI Portal (Cursor)',
    category: 'AI IDE & Build Engineering',
    difficulty: 'Hard',
    isHard: true,
    tags: ['Cursor AI', 'TypeScript', 'Package Resolution', 'Composer Drift'],
    description: `A TypeScript microservice generated with Cursor Composer fails build compilation with TS2307: "Cannot find module '@anthropic-ai/sdk/v2' or its corresponding type declarations." The AI agent hallucinated a non-existent subpath and outdated auth signature. Fix the import resolution and client initialization.`,
    buggyCode: `// Generated via Cursor Composer prompt
import { AnthropicV2Client } from '@anthropic-ai/sdk/v2'; // BUG: Hallucinated subpath
import { TokenBucketRateLimiter } from 'async-ratelimiter-ai'; // BUG: Non-existent ghost dependency

export class ClaudeBridge {
  private client: AnthropicV2Client;

  constructor(apiKey: string) {
    // BUG: Outdated constructor options
    this.client = new AnthropicV2Client({
      token: apiKey,
      apiVersion: '2026-experimental'
    });
  }

  async sendPrompt(system: string, user: string) {
    return this.client.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1024,
      system,
      messages: [{ role: 'user', content: user }]
    });
  }
}
`,
    fixedCode: `import Anthropic from '@anthropic-ai/sdk';

export class ClaudeBridge {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({
      apiKey: apiKey,
    });
  }

  async sendPrompt(system: string, user: string) {
    return this.client.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1024,
      system: system,
      messages: [{ role: 'user', content: user }]
    });
  }
}
`,
    explanation: `AI coding assistants often hallucinate versioned sub-paths ('/v2') or speculative helper packages ('async-ratelimiter-ai'). Auditing dependencies against official package declarations and canonical constructor options resolves compilation failure immediately.`,
    guideTip: `Always configure .cursorrules with strict package constraints (e.g. 'Always use official @anthropic-ai/sdk root import with apiKey param') to prevent Cursor from inventing speculative libraries.`,
    hints: [
      'Examine the import statement from @anthropic-ai/sdk.',
      'Check the official Anthropic client constructor signature: it uses apiKey, not token.',
      'Remove phantom external packages that are not listed in package.json.'
    ],
    testCases: [
      { id: 1, name: 'SDK Import Resolution', input: 'Anthropic client init', expected: 'Clean compilation without TS2307', isHidden: false },
      { id: 2, name: 'Valid apiKey initialization', input: 'ClaudeBridge("sk-ant-test")', expected: 'Valid client instance created', isHidden: true }
    ],
    points: 35,
    penalty: 8
  },
  {
    id: 'go_hard_goroutine_leak',
    title: 'Go Channel Deadlock & Goroutine Leak',
    language: 'Go',
    category: 'Systems & Concurrency',
    difficulty: 'Hard',
    isHard: true,
    tags: ['Go 1.23', 'Goroutines', 'Unbuffered Channel', 'Memory Leak'],
    description: `A high-throughput API gateway written in Go spawns goroutines to query three downstream authentication microservices in parallel. It uses an unbuffered channel and returns on the first successful response. Under load, thousands of orphaned goroutines remain blocked indefinitely attempting to write to the channel, resulting in complete memory exhaustion and container crash (OOMKilled).`,
    buggyCode: `package main

import (
	"context"
	"errors"
	"time"
)

type AuthResult struct {
	UserID string
	Err    error
}

func QueryFastestAuth(ctx context.Context, servers []string) (*AuthResult, error) {
	// BUG: Unbuffered channel blocks all subsequent writers once the first reader exits!
	ch := make(chan AuthResult)

	for _, s := range servers {
		go func(endpoint string) {
			res, err := callRemoteAuth(ctx, endpoint)
			ch <- AuthResult{UserID: res, Err: err} // BLOCKS FOREVER after first result!
		}(s)
	}

	select {
	case res := <-ch:
		if res.Err != nil {
			return nil, res.Err
		}
		return &res, nil
	case <-ctx.Done():
		return nil, ctx.Err()
	}
}
`,
    fixedCode: `package main

import (
	"context"
	"time"
)

type AuthResult struct {
	UserID string
	Err    error
}

func QueryFastestAuth(ctx context.Context, servers []string) (*AuthResult, error) {
	// FIX: Buffered channel with capacity equal to the number of spawned goroutines
	// ensures no worker goroutine blocks indefinitely.
	ch := make(chan AuthResult, len(servers))

	for _, s := range servers {
		go func(endpoint string) {
			res, err := callRemoteAuth(ctx, endpoint)
			select {
			case ch <- AuthResult{UserID: res, Err: err}:
			case <-ctx.Done():
				// Context cancelled, discard cleanly
			}
		}(s)
	}

	select {
	case res := <-ch:
		if res.Err != nil {
			return nil, res.Err
		}
		return &res, nil
	case <-ctx.Done():
		return nil, ctx.Err()
	}
}
`,
    explanation: `In Go, writing to an unbuffered channel blocks until another goroutine reads from it. When QueryFastestAuth returns after consuming the first message, no goroutine is left to read the remaining n-1 responses. Those goroutines remain stuck in memory forever. Making the channel buffered with capacity len(servers) prevents goroutine leaks.`,
    guideTip: `Whenever spawning multiple goroutines that report back through a channel, either size the buffer to match the worker count or use a cancellation context so remaining workers can safely discard their payload.`,
    hints: [
      'Check the capacity of the channel created via make(chan AuthResult).',
      'What happens to the 2nd and 3rd goroutines when QueryFastestAuth returns after reading the 1st result?',
      'Use make(chan AuthResult, len(servers)) to provide non-blocking buffers.'
    ],
    testCases: [
      { id: 1, name: '3 endpoints fast resolution', input: '3 mock servers', expected: 'Returns fastest result immediately', isHidden: false },
      { id: 2, name: 'Goroutine leak inspection', input: 'runtime.NumGoroutine() before and after', expected: 'Delta == 0 (no leaked goroutines)', isHidden: true },
      { id: 3, name: 'Timeout cancellation', input: 'ctx cancelled after 5ms', expected: 'Returns context.DeadlineExceeded safely', isHidden: true }
    ],
    points: 50,
    penalty: 12
  },
  {
    id: 'rust_hard_borrow_mut_alias',
    title: 'Rust Safe Concurrency & Double Mutable Aliasing',
    language: 'Rust',
    category: 'Memory Safety & Systems',
    difficulty: 'Hard',
    isHard: true,
    tags: ['Rust 1.80', 'Borrow Checker', 'Arc<Mutex>', 'Deadlock'],
    description: `A telemetry aggregator fails to compile with E0502: "cannot borrow \`*stats\` as mutable because it is also borrowed as immutable". In an effort to bypass it, the engineer used an unsafe pointer cast which caused random memory corruption and segmentation faults in production. Fix the code using idiomatic Rust RefCell or Arc<Mutex>.`,
    buggyCode: `// Telemetry Metrics Buffer
use std::collections::HashMap;

pub struct MetricsStore {
    counters: HashMap<String, u64>,
}

impl MetricsStore {
    pub fn new() -> Self {
        Self { counters: HashMap::new() }
    }

    pub fn increment_and_audit(&mut self, key: &str) -> u64 {
        // BUG: Borrowing &self.counters while holding mutable reference
        let existing = self.counters.get(key);
        if let Some(&val) = existing {
            self.counters.insert(key.to_string(), val + 1); // ERROR: already borrowed!
            return val + 1;
        } else {
            self.counters.insert(key.to_string(), 1);
            return 1;
        }
    }
}
`,
    fixedCode: `use std::collections::HashMap;

pub struct MetricsStore {
    counters: HashMap<String, u64>,
}

impl MetricsStore {
    pub fn new() -> Self {
        Self { counters: HashMap::new() }
    }

    pub fn increment_and_audit(&mut self, key: &str) -> u64 {
        let entry = self.counters.entry(key.to_string()).or_insert(0);
        *entry += 1;
        *entry
    }
}
`,
    explanation: `Rust's borrow checker strictly prevents holding an immutable reference (\`self.counters.get\`) while executing a mutable method (\`self.counters.insert\`). Using the Entry API (\`self.counters.entry(...).or_insert(0)\`) solves this cleanly in a single lookup with zero unsafe hacks.`,
    guideTip: `Prefer the standard HashMap Entry API in Rust over separate .get() followed by .insert(). It eliminates double lookups and satisfies the borrow checker natively.`,
    hints: [
      'Notice that existing holds a reference to self.counters while self.counters.insert is called.',
      'Check the Rust standard library HashMap::entry API.',
      'Using entry.or_insert(0) allows atomic in-place mutation without borrow conflicts.'
    ],
    testCases: [
      { id: 1, name: 'Increment existing metric', input: '"api_requests" key', expected: 'Returns incremented value (e.g. 1 -> 2)', isHidden: false },
      { id: 2, name: 'Brand new metric key initialization', input: '"cache_misses" key', expected: 'Returns 1', isHidden: true },
      { id: 3, name: 'Borrow checker verification', input: 'cargo check', expected: 'Zero compiler warnings or errors', isHidden: true }
    ],
    points: 40,
    penalty: 10
  },
  {
    id: 'ai_gemini_antigravity_schema_overflow',
    title: 'Google Antigravity / Gemini CLI Context Truncation Mismatch',
    language: 'AI Portal (Gemini / Antigravity)',
    category: 'Agentic Tooling & AI Orchestration',
    difficulty: 'Hard',
    isHard: true,
    tags: ['Google Antigravity', 'Gemini API', 'Tool Calling', 'Token Budget'],
    description: `A custom agentic workflow running inside Google Antigravity passes 100,000 lines of raw AST dumps directly into a tool parameter. The Gemini API rejects the request with HTTP 400: "Tool response exceeds maximum payload size of 46080 bytes". The agent fails to fall back to offset-based chunking, causing session termination.`,
    buggyCode: `export async function readEntireWorkspaceAst(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  // BUG: Sends unbounded multi-megabyte payload directly to agent tool response
  return {
    toolName: "view_file",
    output: content // Payload > 46KB crashes tool transport
  };
}
`,
    fixedCode: `export async function readWorkspaceAstChunked(filePath, offset = 0, limitBytes = 45000) {
  const stats = await fs.stat(filePath);
  const buffer = Buffer.alloc(limitBytes);
  const fd = await fs.open(filePath, 'r');
  
  const { bytesRead } = await fd.read(buffer, 0, limitBytes, offset);
  await fd.close();

  const chunk = buffer.toString('utf-8', 0, bytesRead);
  const hasMore = (offset + bytesRead) < stats.size;

  return {
    toolName: "view_file",
    output: chunk,
    isTruncated: hasMore,
    nextOffset: hasMore ? offset + bytesRead : null,
    totalBytes: stats.size
  };
}
`,
    explanation: `Gemini API and Google Antigravity impose strict payload limits (46,080 bytes) on individual tool execution steps to preserve context fidelity. Providing structured byte offset pagination ensures large files can be streamed iteratively without HTTP 400 errors.`,
    guideTip: `Always use ContentOffset and bounded chunks when reading tool outputs in Antigravity or Gemini agentic loops.`,
    hints: [
      'Check the 46,080 bytes per view constraint in the Antigravity view_file tool schema.',
      'Add ContentOffset and byte-range slicing to prevent crashing the agent transport.',
      'Signal truncation in the response object so the planner knows how to paginate.'
    ],
    testCases: [
      { id: 1, name: 'File under 40KB', input: '30KB source file', expected: 'isTruncated: false, full content returned', isHidden: false },
      { id: 2, name: 'Large 500KB dump', input: '500KB file', expected: 'isTruncated: true, nextOffset: 45000', isHidden: true }
    ],
    points: 40,
    penalty: 10
  },
  {
    id: 'cpp_hard_off_by_one_buffer',
    title: 'C++ Off-by-One Buffer Overrun in Network Packet Parser',
    language: 'C++',
    category: 'Systems & Security',
    difficulty: 'Hard',
    isHard: true,
    tags: ['C++20', 'Buffer Overflow', 'Memory Safety', 'Off-by-One'],
    description: `A financial exchange packet parsing routine in C++20 exhibits intermittent stack-smashing and remote code execution vulnerabilities under malformed FIX protocol payloads. The index arithmetic includes the trailing null byte inside a fixed stack buffer, writing past the reserved memory boundary.`,
    buggyCode: `#include <vector>
#include <string>
#include <cstring>
#include <stdexcept>

class PacketDecoder {
public:
    static std::string decodePacket(const char* rawBytes, size_t length) {
        constexpr size_t MAX_PAYLOAD = 256;
        char buffer[MAX_PAYLOAD];

        // BUG: <= allows writing at buffer[MAX_PAYLOAD] when length == MAX_PAYLOAD!
        // Also missing bounds check before writing null terminator
        if (length > MAX_PAYLOAD) {
            throw std::runtime_error("Packet too large");
        }

        for (size_t i = 0; i <= length; ++i) {
            buffer[i] = rawBytes[i]; // Memory corruption when i == MAX_PAYLOAD!
        }

        buffer[length] = '\\0'; // Off-by-one out-of-bounds write!
        return std::string(buffer);
    }
};
`,
    fixedCode: `#include <vector>
#include <string>
#include <stdexcept>
#include <span>

class PacketDecoder {
public:
    static std::string decodePacket(const char* rawBytes, size_t length) {
        constexpr size_t MAX_PAYLOAD = 256;

        // Leave 1 byte strictly reserved for the null-terminator
        if (length >= MAX_PAYLOAD) {
            throw std::runtime_error("Packet too large: exceeds buffer boundary");
        }

        char buffer[MAX_PAYLOAD];
        for (size_t i = 0; i < length; ++i) {
            buffer[i] = rawBytes[i];
        }
        buffer[length] = '\\0';

        return std::string(buffer, length);
    }
};
`,
    explanation: `Writing to index buffer[MAX_PAYLOAD] in a stack array of size MAX_PAYLOAD writes into the stack frame canary or return address. The condition 'length >= MAX_PAYLOAD' ensures sufficient headroom for the required '\\0' terminator.`,
    guideTip: `In modern C++, avoid manual char arrays. Use std::string_view or std::span to enforce zero-copy bounds safety.`,
    hints: [
      'Look closely at the loop termination condition: i <= length vs i < length.',
      'Consider what happens when length == 256. Where does buffer[length] write?',
      'Check if length >= MAX_PAYLOAD check leaves space for the null terminator.'
    ],
    testCases: [
      { id: 1, name: 'Normal 64-byte packet', input: '64 bytes string', expected: 'Exact string returned without corruption', isHidden: false },
      { id: 2, name: 'Exact 256-byte packet boundary', input: '256 bytes payload', expected: 'Throws runtime_error safely', isHidden: true },
      { id: 3, name: 'Zero length packet', input: '0 bytes', expected: 'Returns empty string', isHidden: true }
    ],
    points: 45,
    penalty: 10
  },
  {
    id: 'ts_hard_event_loop_starvation',
    title: 'Node.js Event Loop Starvation & Memory Leak',
    language: 'TypeScript',
    category: 'Frontend & Node.js',
    difficulty: 'Hard',
    isHard: true,
    tags: ['Node.js', 'Event Loop', 'Memory Leak', 'EventEmitter'],
    description: `A high-throughput WebSocket proxy in Node.js / TypeScript stops responding to health checks every few hours. Profiling reveals that each incoming client connection registers an anonymous listener on a global event bus that is never unregistered upon client disconnection, leading to MaxListenersExceeded and huge heap retention.`,
    buggyCode: `import { EventEmitter } from 'events';

const globalBus = new EventEmitter();

export class ClientSession {
  private id: string;
  private socket: any;

  constructor(id: string, socket: any) {
    this.id = id;
    this.socket = socket;

    // BUG: Anonymous arrow function cannot be cleanly removed,
    // and socket close event does not detach this listener!
    globalBus.on('broadcast_alert', (msg) => {
      this.socket.send(JSON.stringify({ alert: msg, clientId: this.id }));
    });
  }

  public destroy() {
    this.socket.close();
    // BUG: Missing globalBus.removeListener! Session remains retained in heap forever.
  }
}
`,
    fixedCode: `import { EventEmitter } from 'events';

const globalBus = new EventEmitter();

export class ClientSession {
  private id: string;
  private socket: any;
  private onBroadcastHandler: (msg: any) => void;

  constructor(id: string, socket: any) {
    this.id = id;
    this.socket = socket;

    // FIX: Maintain named reference to listener
    this.onBroadcastHandler = (msg: any) => {
      if (this.socket && !this.socket.destroyed) {
        this.socket.send(JSON.stringify({ alert: msg, clientId: this.id }));
      }
    };

    globalBus.on('broadcast_alert', this.onBroadcastHandler);

    // Auto-clean on socket close
    this.socket.on('close', () => {
      this.destroy();
    });
  }

  public destroy() {
    globalBus.removeListener('broadcast_alert', this.onBroadcastHandler);
    if (this.socket && !this.socket.destroyed) {
      this.socket.close();
    }
  }
}
`,
    explanation: `In Node.js, event listeners hold a strong reference to their enclosing closure. If a long-lived object (like globalBus) attaches an anonymous listener from a short-lived session, the session and all its buffers will never be garbage collected.`,
    guideTip: `Always store listener functions in private instance properties and remove them during cleanup or dispose lifecycles.`,
    hints: [
      'Notice that globalBus.on uses an anonymous function, so it can never be unbound with removeListener.',
      'Check the destroy method: it never detaches the listener from globalBus.',
      'Tie session teardown to socket close events to guarantee cleanup.'
    ],
    testCases: [
      { id: 1, name: 'Session broadcast dispatch', input: 'Single client connection', expected: 'Message delivered successfully', isHidden: false },
      { id: 2, name: 'Heap retention check after 1000 disconnects', input: '1000 connect/disconnect cycles', expected: 'globalBus.listenerCount("broadcast_alert") === 0', isHidden: true }
    ],
    points: 40,
    penalty: 10
  },
  {
    id: 'sql_hard_n_plus_one_deadlock',
    title: 'SQL Transaction Isolation & Deadlock on Inventory Allocation',
    language: 'SQL',
    category: 'Databases & Performance',
    difficulty: 'Hard',
    isHard: true,
    tags: ['PostgreSQL', 'Transactions', 'Row Locks', 'FOR UPDATE'],
    description: `An e-commerce flash-sale platform experiences frequent SQL deadlocks (PostgreSQL ERROR: 40P01: deadlock detected) when thousands of users purchase items simultaneously. Different transactions update items in arbitrary order without consistent locking hierarchies.`,
    buggyCode: `-- Concurrent Inventory Checkout
BEGIN TRANSACTION;

-- BUG: Unordered SELECT allows Transaction A to lock Item 1 then Item 2,
-- while Transaction B locks Item 2 then Item 1 -> DEADLOCK!
SELECT inventory_id, available_stock 
FROM product_inventory 
WHERE inventory_id IN (101, 102, 103);

-- Stock decrement with unconstrained update
UPDATE product_inventory 
SET available_stock = available_stock - 1 
WHERE inventory_id IN (101, 102, 103);

COMMIT;
`,
    fixedCode: `-- High Concurrency Deterministic Row-Locking Pattern
BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- FIX: Strict row sorting with 'FOR UPDATE' guarantees all transactions 
-- acquire locks in identical global order (101 -> 102 -> 103), eliminating circular deadlocks.
SELECT inventory_id, available_stock 
FROM product_inventory 
WHERE inventory_id IN (101, 102, 103)
ORDER BY inventory_id ASC
FOR UPDATE;

-- Safe atomic decrement
UPDATE product_inventory 
SET available_stock = available_stock - 1 
WHERE inventory_id IN (101, 102, 103);

COMMIT;
`,
    explanation: `Deadlocks occur when two concurrent transactions attempt to lock the same resources in differing order. Enforcing an explicit ORDER BY inventory_id ASC with FOR UPDATE forces every transaction to queue deterministically on the earliest resource.`,
    guideTip: `Whenever locking multiple rows in SQL, always enforce an unambiguous ascending primary key order in your SELECT ... FOR UPDATE statement.`,
    hints: [
      'Deadlocks are caused by circular lock waits between concurrent transactions.',
      'Check whether the rows are locked in a deterministic order across all queries.',
      'Add ORDER BY inventory_id ASC and FOR UPDATE to serialize row acquisitions.'
    ],
    testCases: [
      { id: 1, name: 'Single item lock test', input: 'inventory_id = 101', expected: 'Row locked and stock decremented', isHidden: false },
      { id: 2, name: 'Reversed concurrent purchase simulation', input: '[103, 101] vs [101, 103]', expected: 'Zero deadlocks, deterministic lock acquisition', isHidden: true }
    ],
    points: 40,
    penalty: 10
  },
  {
    id: 'ai_github_copilot_regex_redos',
    title: 'GitHub Copilot Hallucinated ReDoS Catastrophic Backtracking',
    language: 'AI Portal (GitHub Copilot)',
    category: 'Security & AI Code Generation',
    difficulty: 'Hard',
    isHard: true,
    tags: ['GitHub Copilot', 'ReDoS', 'Regex', 'Catastrophic Backtracking'],
    description: `An authentication email validator suggested by GitHub Copilot features a nested quantifier regex. When an attacker sends a string like 'user@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.com', the Node.js server freezes at 100% CPU for over 45 minutes due to exponential backtracking (ReDoS). Fix the regex to execute in linear O(N) time.`,
    buggyCode: `// Generated via GitHub Copilot inline completion
export function validateEnterpriseEmail(input: string): boolean {
  // BUG: Nested quantifiers ([a-zA-Z0-9]+)+ cause 2^N backtracking explosion
  const EMAIL_REGEX = /^([a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*)+@([a-zA-Z0-9]+([.-]?[a-zA-Z0-9]+)*)+(\\.[a-zA-Z]{2,})+$/;
  return EMAIL_REGEX.test(input);
}
`,
    fixedCode: `export function validateEnterpriseEmail(input: string): boolean {
  // FIX: Linear-time O(N) atomic regex with bounded length check
  if (!input || input.length > 254) return false;

  const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$/;
  if (!EMAIL_REGEX.test(input)) return false;

  // Additional sanity checks without catastrophic backtracking
  const parts = input.split('@');
  if (parts.length !== 2) return false;
  return parts[0].length <= 64 && !parts[1].startsWith('.') && !parts[1].endsWith('.');
}
`,
    explanation: `Nested quantifiers like (a+)+ or (a|b*)+ result in catastrophic backtracking when matching failing strings. AI assistants frequently synthesize syntactically impressive regexes that possess fatal computational complexity vulnerabilities.`,
    guideTip: `Never blindly accept complex regexes generated by AI assistants. Benchmark with failing input strings and prefer input length clamping and string splitting.`,
    hints: [
      'Look at the nested repetition: ([a-zA-Z0-9]+)+ inside the regex.',
      'Check the worst-case time complexity on inputs with trailing non-matching characters.',
      'Flatten the regex to single quantifiers and clamp input.length <= 254.'
    ],
    testCases: [
      { id: 1, name: 'Valid corporate email', input: 'sarla.yash@enterprise.com', expected: 'true', isHidden: false },
      { id: 2, name: 'ReDoS attack payload (100 repetitions)', input: 'a'.repeat(50) + '@' + 'b'.repeat(50) + '!', expected: 'Executes in < 2ms, returns false', isHidden: true }
    ],
    points: 45,
    penalty: 10
  },
  {
    id: 'java_hard_thread_visibility',
    title: 'Java Memory Model volatile & Stale Cache Visibility',
    language: 'Java',
    category: 'Enterprise Java',
    difficulty: 'Hard',
    isHard: true,
    tags: ['Java 21', 'JMM', 'volatile', 'AtomicBoolean'],
    description: `A background telemetry publisher thread in a Java Spring Boot application fails to terminate even after calling \`shutdown()\`. On multi-core servers, the thread stays in an infinite loop because CPU cache coherence does not flush the \`keepRunning\` boolean variable without memory barriers.`,
    buggyCode: `package com.sarlayash.engine;

public class TelemetryWorker implements Runnable {
    // BUG: Non-volatile flag causes CPU L1/L2 cache to never see updates from main thread!
    private boolean keepRunning = true;
    private long metricsCount = 0;

    @Override
    public void run() {
        while (keepRunning) {
            // Hot loop checking cached register/L1 memory
            metricsCount++;
        }
        System.out.println("Worker stopped cleanly. Count: " + metricsCount);
    }

    public void shutdown() {
        this.keepRunning = false; // Main thread writes to local CPU cache only
    }
}
`,
    fixedCode: `package com.sarlayash.engine;

import java.util.concurrent.atomic.AtomicBoolean;

public class TelemetryWorker implements Runnable {
    // FIX: AtomicBoolean or volatile ensures happens-before memory visibility across CPU cores
    private final AtomicBoolean keepRunning = new AtomicBoolean(true);
    private volatile long metricsCount = 0;

    @Override
    public void run() {
        while (keepRunning.get()) {
            metricsCount++;
        }
        System.out.println("Worker stopped cleanly. Count: " + metricsCount);
    }

    public void shutdown() {
        this.keepRunning.set(false);
    }
    
    public long getMetricsCount() {
        return metricsCount;
    }
}
`,
    explanation: `Under the Java Memory Model (JMM), threads are permitted to cache variables in CPU registers or private caches unless decorated with 'volatile' or encapsulated inside Atomic classes that establish happens-before relationships.`,
    guideTip: `In Java multi-threading, any shared flag modified by one thread and read by another MUST be either volatile, AtomicBoolean, or guarded by synchronized locks.`,
    hints: [
      'Why does the loop continue running even though shutdown() was called by another thread?',
      'Check the Java Memory Model rules regarding thread cache visibility.',
      'Use AtomicBoolean or declare private volatile boolean keepRunning.'
    ],
    testCases: [
      { id: 1, name: 'Normal start and stop', input: 'Start worker, sleep 10ms, shutdown', expected: 'Worker stops within 50ms', isHidden: false },
      { id: 2, name: 'Multi-core visibility verification', input: 'Thread pin check', expected: 'Terminates cleanly across separate hardware threads', isHidden: true }
    ],
    points: 40,
    penalty: 10
  },
  {
    id: 'csharp_hard_task_deadlock',
    title: 'C# Async .Result SynchronizationContext Deadlock',
    language: 'C#',
    category: 'Enterprise .NET',
    difficulty: 'Hard',
    isHard: true,
    tags: ['C# 12', '.NET 8', 'Async/Await', 'Deadlock'],
    description: `A legacy ASP.NET controller deadlocks indefinitely when invoking an asynchronous payment verification method. The developer used .Result on an asynchronous task, blocking the synchronization context thread while the async continuation awaits that same thread.`,
    buggyCode: `using System.Threading.Tasks;

public class PaymentController {
    public string VerifyPayment(string transactionId) {
        // BUG: Blocking on .Result while on SynchronizationContext causes instant DEADLOCK!
        var task = FetchTransactionStatusAsync(transactionId);
        return task.Result; 
    }

    private async Task<string> FetchTransactionStatusAsync(string txId) {
        await Task.Delay(100); // Continuation requires SynchronizationContext, which is blocked above!
        return "CONFIRMED_" + txId;
    }
}
`,
    fixedCode: `using System.Threading.Tasks;

public class PaymentController {
    // FIX: Async all the way up with ConfigureAwait(false)
    public async Task<string> VerifyPaymentAsync(string transactionId) {
        return await FetchTransactionStatusAsync(transactionId).ConfigureAwait(false);
    }

    private async Task<string> FetchTransactionStatusAsync(string txId) {
        await Task.Delay(100).ConfigureAwait(false);
        return "CONFIRMED_" + txId;
    }
}
`,
    explanation: `In C#, synchronously blocking on asynchronous tasks via .Result or .Wait() captures and locks the synchronization context thread. When the awaited task completes, it attempts to marshal back onto the blocked thread, creating a classic unrecoverable deadlock.`,
    guideTip: `Never call .Result or .Wait() on Task in .NET. Follow the rule: "Async all the way down" and configure awaits with ConfigureAwait(false) for library/backend code.`,
    hints: [
      'Never block synchronous code with task.Result or task.Wait().',
      'Make VerifyPaymentAsync return Task<string> and use the await keyword.',
      'Append .ConfigureAwait(false) to prevent capturing the caller synchronization context.'
    ],
    testCases: [
      { id: 1, name: 'Single transaction verification', input: '"TX_90210"', expected: '"CONFIRMED_TX_90210"', isHidden: false },
      { id: 2, name: 'SynchronizationContext deadlock test', input: 'Concurrent requests', expected: 'Resolves without thread blocking', isHidden: true }
    ],
    points: 40,
    penalty: 10
  },
  {
    id: 'ai_windsurf_cascade_state_drift',
    title: 'Windsurf Cascade Context Invalidation & Stale Diff',
    language: 'AI Portal (Windsurf)',
    category: 'AI Orchestration & Cascade',
    difficulty: 'Hard',
    isHard: true,
    tags: ['Windsurf', 'Cascade Agent', 'Diff State', 'Race Condition'],
    description: `In Windsurf, a Cascade flow modifying three files simultaneously applies a file patch against a stale file snapshot because another tool execution modified the file in between steps. The patch engine crashes with 'Hunk #1 failed at line 42'. Implement an atomic optimistic concurrency hash check to safely detect and resolve stale diffs.`,
    buggyCode: `export function applyCascadePatch(fileState, patchHunk) {
  // BUG: Blind patch application without checksum or line offset verification
  // If the file changed on disk, this corrupts source code!
  const lines = fileState.content.split('\\n');
  lines.splice(patchHunk.startLine, patchHunk.deletedCount, ...patchHunk.newLines);
  return lines.join('\\n');
}
`,
    fixedCode: `import crypto from 'crypto';

export function applyCascadePatchSafe(fileState, patchHunk) {
  const currentContent = fileState.content;
  const currentHash = crypto.createHash('sha256').update(currentContent).digest('hex');

  // Guard: Verify base hash matches what Cascade generated the diff against
  if (patchHunk.baseHash && patchHunk.baseHash !== currentHash) {
    return {
      success: false,
      conflict: true,
      error: "STALE_CONTEXT: File was modified externally. Regenerating diff against latest state.",
      currentContent
    };
  }

  const lines = currentContent.split('\\n');
  if (patchHunk.startLine < 0 || patchHunk.startLine > lines.length) {
    return { success: false, conflict: true, error: "OUT_OF_BOUNDS_HUNK" };
  }

  lines.splice(patchHunk.startLine, patchHunk.deletedCount, ...patchHunk.newLines);
  const updatedContent = lines.join('\\n');

  return {
    success: true,
    content: updatedContent,
    newHash: crypto.createHash('sha256').update(updatedContent).digest('hex')
  };
}
`,
    explanation: `When autonomous AI coding agents like Windsurf Cascade manipulate multiple files, external git hooks, formatters, or parallel edits can shift line numbers. Storing and verifying SHA-256 base hashes prevents applying hunks to drifted source files.`,
    guideTip: `Always use optimistic concurrency validation (content hash comparison) prior to applying multi-file automated diffs.`,
    hints: [
      'Check how the patch verifies if the file content changed since the diff was calculated.',
      'Add a hash comparison against patchHunk.baseHash.',
      'Return a structured error object indicating a stale diff rather than blindly corrupting lines.'
    ],
    testCases: [
      { id: 1, name: 'Clean patch with matching hash', input: 'Matching SHA-256', expected: 'success: true, content updated', isHidden: false },
      { id: 2, name: 'Stale diff detection', input: 'Outdated baseHash', expected: 'conflict: true, STALE_CONTEXT returned', isHidden: true }
    ],
    points: 40,
    penalty: 10
  },
  {
    id: 'swift_hard_actor_data_race',
    title: 'Swift 6 Actor Isolation & Sendable Closure Data Race',
    language: 'Swift',
    category: 'Mobile & Apple Systems',
    difficulty: 'Hard',
    isHard: true,
    tags: ['Swift 6', 'Actors', 'Data Race', 'Sendable'],
    description: `A banking iOS app compiled with Swift 6 strict concurrency checks errors with: "Capture of non-Sendable type \`AccountModel\` across actor boundaries". Bypassing it with \`@unchecked Sendable\` caused random memory crashes when concurrent background threads updated the account balance during UI rendering.`,
    buggyCode: `// Banking Account State in Swift 6
import Foundation

class AccountModel { // BUG: Class is reference type without Sendable conformance
    var balance: Double = 0.0
}

actor BankVault {
    private var accounts: [String: AccountModel] = [:]

    func updateAccount(id: String, delta: Double) async {
        let account = accounts[id] ?? AccountModel()
        // BUG: Mutating reference type outside actor protection leads to data race!
        DispatchQueue.global().async {
            account.balance += delta // CRASH in Swift 6!
        }
        accounts[id] = account
    }
}
`,
    fixedCode: `import Foundation

// FIX: Immutable value-type struct or isolated actor guarantees thread safety
struct AccountRecord: Sendable {
    let id: String
    var balance: Double
}

actor BankVault {
    private var accounts: [String: AccountRecord] = [:]

    func updateAccount(id: String, delta: Double) {
        var account = accounts[id] ?? AccountRecord(id: id, balance: 0.0)
        account.balance += delta
        accounts[id] = account
    }

    func getBalance(id: String) -> Double {
        return accounts[id]?.balance ?? 0.0
    }
}
`,
    explanation: `Swift 6 strictly enforces complete concurrency checking. Mutating a reference class across actor boundaries causes undefined behavior and data races. Converting the model to a Sendable struct and keeping mutations strictly inside the actor domain resolves the race completely.`,
    guideTip: `In Swift 6, default to immutable structs conforming to Sendable for state models managed across actor boundaries.`,
    hints: [
      'Look at AccountModel: it is a class, meaning reference semantics.',
      'DispatchQueue.global().async escapes the actor lock.',
      'Replace the mutable class with a Sendable struct and perform updates synchronously inside the actor.'
    ],
    testCases: [
      { id: 1, name: 'Single deposit transaction', input: 'Deposit $100', expected: 'balance == 100.0', isHidden: false },
      { id: 2, name: 'Strict concurrency check compliance', input: 'swiftc -strict-concurrency=complete', expected: 'Zero data race warnings', isHidden: true }
    ],
    points: 45,
    penalty: 10
  },
  {
    id: 'kotlin_hard_coroutine_scope_leak',
    title: 'Kotlin Android Coroutine Scope & Job Cancellation Leak',
    language: 'Kotlin',
    category: 'Mobile & Enterprise JVM',
    difficulty: 'Hard',
    isHard: true,
    tags: ['Kotlin 2.0', 'Coroutines', 'ViewModel', 'SupervisorJob'],
    description: `An Android commerce app crashes when a user rapidly toggles between screens. The ViewModel launches network calls using \`GlobalScope.launch\` instead of \`viewModelScope\`. When the Activity is destroyed, background coroutines continue writing results to destroyed UI state, causing fatal NullPointerExceptions and memory leaks.`,
    buggyCode: `package com.sarlayash.store

import kotlinx.coroutines.*

class CatalogViewModel {
    private var activeData: String? = null

    fun loadCatalogItems(itemId: String) {
        // BUG: GlobalScope survives ViewModel lifecycle and never gets cancelled!
        GlobalScope.launch(Dispatchers.IO) {
            val response = fetchFromApi(itemId)
            withContext(Dispatchers.Main) {
                // Throws NullPointerException if UI is destroyed
                activeData = response.trim()
                updateUi(activeData!!)
            }
        }
    }

    fun onCleared() {
        // GlobalScope cannot be cancelled here!
    }
}
`,
    fixedCode: `package com.sarlayash.store

import kotlinx.coroutines.*

class CatalogViewModel(private val scope: CoroutineScope = CoroutineScope(SupervisorJob() + Dispatchers.Main)) {
    private var activeData: String? = null

    fun loadCatalogItems(itemId: String) {
        // FIX: Launch inside lifecycle-bounded scope with SupervisorJob
        scope.launch {
            try {
                val response = withContext(Dispatchers.IO) {
                    fetchFromApi(itemId)
                }
                activeData = response.trim()
                updateUi(activeData)
            } catch (e: CancellationException) {
                // Clean cancellation without crashing
            }
        }
    }

    fun onCleared() {
        // FIX: Cancel all child jobs cleanly upon ViewModel destruction
        scope.cancel()
    }
}
`,
    explanation: `GlobalScope is an anti-pattern in Android and Kotlin services because its lifetime is tied to the entire process. Using a bounded CoroutineScope with a SupervisorJob ensures all ongoing network requests are cancelled immediately when onCleared() is triggered.`,
    guideTip: `Never use GlobalScope in Kotlin applications. Always use structured concurrency with a dedicated CoroutineScope tied to the component lifecycle.`,
    hints: [
      'GlobalScope.launch creates unmanaged top-level coroutines.',
      'Check what happens when onCleared() is invoked while the network request is still pending.',
      'Tie the coroutines to a CoroutineScope that is cancelled in onCleared().'
    ],
    testCases: [
      { id: 1, name: 'Normal load workflow', input: '"item_123"', expected: 'UI updated successfully', isHidden: false },
      { id: 2, name: 'Screen rotation and cancellation', input: 'onCleared() triggered during request', expected: 'Job cleanly cancelled, 0 memory leaks', isHidden: true }
    ],
    points: 40,
    penalty: 10
  },
  {
    id: 'ai_devin_git_merge_conflict_loop',
    title: 'Devin / Aider Automated Git Rebase Conflict Loop',
    language: 'AI Portal (Devin / Aider)',
    category: 'Agentic DevOps & Git Workflows',
    difficulty: 'Hard',
    isHard: true,
    tags: ['Devin', 'Aider', 'Git Rebase', 'Conflict Markers'],
    description: `An autonomous AI developer agent attempting to resolve merge conflicts leaves git conflict markers (<<<<<<< HEAD, =======, >>>>>>> branch) inside an active production configuration JSON file. The deployment CI/CD pipeline crashes with JSON parse errors. Build a conflict resolver that detects markers and synthesizes semantic merges.`,
    buggyCode: `export function resolveJsonConflict(rawFileText) {
  // BUG: Naive regex simply strips markers without reconciling conflicting keys,
  // producing invalid JSON syntax with duplicated keys or trailing commas!
  return rawFileText
    .replace(/<<<<<<< HEAD[\\s\\S]*?=======/g, '')
    .replace(/>>>>>>> [a-zA-Z0-9_-]+/g, '');
}
`,
    fixedCode: `export function resolveJsonConflict(rawFileText) {
  // FIX: Detect conflict markers and parse valid branches before generating output
  const conflictRegex = /<<<<<<< HEAD\\r?\\n([\\s\\S]*?)=======\\r?\\n([\\s\\S]*?)>>>>>>> [a-zA-Z0-9_-]+/g;
  
  if (!conflictRegex.test(rawFileText)) {
    return JSON.parse(rawFileText); // No conflicts, return parsed JSON
  }

  // Extract both versions, parse them into objects, and merge deeply
  const resolved = rawFileText.replace(conflictRegex, (match, headBranch, incomingBranch) => {
    try {
      // Pick incoming validated changes or merge semantic object properties
      return incomingBranch.trim();
    } catch {
      return headBranch.trim();
    }
  });

  try {
    return JSON.parse(resolved);
  } catch (err) {
    throw new Error("SEMANTIC_MERGE_FAILED: Cannot synthesize valid JSON from conflict markers.");
  }
}
`,
    explanation: `When AI agents like Devin or Aider resolve git rebase conflicts, simply stripping git conflict markers often generates invalid JSON (unclosed brackets, duplicate keys). The parser must semantically validate the resulting document.`,
    guideTip: `Always run automated syntax validators immediately after an AI agent performs git merge or rebase operations.`,
    hints: [
      'Regex stripping of conflict markers usually results in duplicate JSON keys or syntax errors.',
      'Check if the output parses cleanly via JSON.parse().',
      'Throw a clear SEMANTIC_MERGE_FAILED error if the combined text is not valid JSON.'
    ],
    testCases: [
      { id: 1, name: 'Clean non-conflicted JSON', input: '{"status": "ok"}', expected: 'Parses cleanly', isHidden: false },
      { id: 2, name: 'Branch conflict resolution', input: 'JSON containing <<<<<<< HEAD ... >>>>>>>', expected: 'Valid parsed JSON without syntax error', isHidden: true }
    ],
    points: 40,
    penalty: 10
  },
  {
    id: 'php_hard_type_juggling_auth',
    title: 'PHP 8.3 Strict Type Juggling & Password Hash Timing Attack',
    language: 'PHP',
    category: 'Web Security & Enterprise PHP',
    difficulty: 'Hard',
    isHard: true,
    tags: ['PHP 8.3', 'Type Juggling', 'Timing Attack', 'Auth Bypass'],
    description: `A legacy enterprise single sign-on portal written in PHP compares authentication tokens using loose equality (\`==\`). When a token starts with '0e' followed by digits, PHP evaluates both sides as scientific notation numbers (\`0e123 == 0e456\` evaluates to \`true\`), granting full administrative bypass without the password!`,
    buggyCode: `<?php

class EnterpriseAuthManager {
    public function verifySessionToken(string $providedToken, string $storedSecret): bool {
        // BUG: Loose equality == allows scientific notation type juggling bypass!
        // Also vulnerable to string comparison timing attacks.
        if ($providedToken == $storedSecret) {
            return true;
        }
        return false;
    }
}
`,
    fixedCode: `<?php
declare(strict_types=1);

class EnterpriseAuthManager {
    public function verifySessionToken(string $providedToken, string $storedSecret): bool {
        // FIX: hash_equals() performs constant-time comparison immune to timing attacks
        // and strictly avoids loose type juggling!
        if (empty($providedToken) || empty($storedSecret)) {
            return false;
        }
        return hash_equals($storedSecret, $providedToken);
    }
}
`,
    explanation: `In PHP, the '==' operator attempts implicit type conversions. If two strings match the pattern '0e[0-9]+', both evaluate to floating point zero (0.0). Using hash_equals() eliminates both type-juggling flaws and timing leak attacks.`,
    guideTip: `Always declare(strict_types=1); and use hash_equals() for comparing secret tokens, hashes, and session identifiers in PHP.`,
    hints: [
      'Why does "0e123456" == "0e987654" evaluate to TRUE in PHP?',
      'Check the vulnerability known as PHP Type Juggling.',
      'Replace == with hash_equals($storedSecret, $providedToken).'
    ],
    testCases: [
      { id: 1, name: 'Normal token comparison', input: '"secret_abc", "secret_abc"', expected: 'true', isHidden: false },
      { id: 2, name: 'Type juggling exploit attempt', input: '"0e123456789", "0e987654321"', expected: 'false (exploit blocked)', isHidden: true }
    ],
    points: 40,
    penalty: 10
  },
  {
    id: 'bash_hard_variable_expansion_injection',
    title: 'Bash Shell Unquoted Parameter Expansion & Remote Injection',
    language: 'Shell / Bash',
    category: 'DevOps & Shell Security',
    difficulty: 'Medium',
    isHard: false,
    tags: ['Bash', 'Shellcheck', 'Command Injection', 'Quoting'],
    description: `A server backup script takes an artifact filename as an argument. Because variables are left unquoted in \`rm -rf $TARGET_DIR/$FILENAME\`, passing \`* \` or input containing spaces inadvertently wipes parent directories.`,
    buggyCode: `#!/usr/bin/env bash
set -e

BACKUP_DIR="/var/backups"
TARGET_FILE=$1

# BUG: Unquoted variables undergo word splitting and globbing!
# If TARGET_FILE is "*", this deletes all backups!
if [ -f $BACKUP_DIR/$TARGET_FILE ]; then
    echo "Deleting old backup: $TARGET_FILE"
    rm -rf $BACKUP_DIR/$TARGET_FILE
fi
`,
    fixedCode: `#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/var/backups"
TARGET_FILE="\${1:-}"

# FIX: Strict quoting prevents word splitting and glob expansion
if [[ -z "$TARGET_FILE" ]]; then
    echo "Error: No target file specified." >&2
    exit 1
fi

# Prevent directory traversal attacks
CLEAN_NAME=$(basename "$TARGET_FILE")
FULL_PATH="$BACKUP_DIR/$CLEAN_NAME"

if [[ -f "$FULL_PATH" ]]; then
    echo "Safely removing backup: $CLEAN_NAME"
    rm -f -- "$FULL_PATH"
fi
`,
    explanation: `Unquoted bash variables are subject to word splitting and pathname expansion (globbing). Double quoting all variables and sanitizing input via \`basename\` protects against shell expansion exploits and path traversal.`,
    guideTip: `Always use 'set -euo pipefail', double quote all variables, and use [[ ]] rather than single [ ].`,
    hints: [
      'Unquoted variables undergo globbing and word splitting.',
      'Check what happens if TARGET_FILE contains spaces or asterisk.',
      'Quote all variables and use basename to prevent directory traversal.'
    ],
    testCases: [
      { id: 1, name: 'Normal backup file deletion', input: '"backup_2026.tar.gz"', expected: 'File safely removed', isHidden: false },
      { id: 2, name: 'Space containing filename', input: '"my backup file.tar"', expected: 'Processed as single argument without word splitting', isHidden: true }
    ],
    points: 30,
    penalty: 5
  },
  {
    id: 'js_float_precision_ledger',
    title: 'JavaScript Floating-Point Precision Financial Corruption',
    language: 'JavaScript',
    category: 'FinTech & Math',
    difficulty: 'Medium',
    isHard: false,
    tags: ['IEEE 754', 'Float Precision', 'FinTech', 'BigInt'],
    description: `A payment processing ledger calculates transaction totals using IEEE 754 floating point arithmetic. When computing 0.1 + 0.2, the system generates 0.30000000000000004, causing financial reconciliation discrepancies and rounding off audits.`,
    buggyCode: `export function calculateInvoiceTotal(items) {
  // BUG: Floating point accumulation introduces fractional inaccuracies
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price; // e.g. 0.1 + 0.2 = 0.30000000000000004
  }
  return total;
}
`,
    fixedCode: `export function calculateInvoiceTotal(items) {
  // FIX: Calculate in integer cents/micro-units to prevent IEEE 754 precision drift
  const totalCents = items.reduce((sum, item) => {
    const cents = Math.round(item.price * 100);
    return sum + cents;
  }, 0);

  return totalCents / 100;
}
`,
    explanation: `Binary floating point cannot precisely represent fractions like 0.1 or 0.2. In financial software, always represent monetary values as integer base units (cents) or use arbitrary precision libraries (like Decimal.js).`,
    guideTip: `Rule of thumb in FinTech: Never store or add currency as raw floats. Always convert to integer cents before mathematical operations.`,
    hints: [
      'Remember that 0.1 + 0.2 !== 0.3 in JavaScript.',
      'Convert prices to integer cents (price * 100) before summing.',
      'Divide by 100 at the end to return the correct decimal figure.'
    ],
    testCases: [
      { id: 1, name: 'Sum 0.10 and 0.20', input: '[{price: 0.1}, {price: 0.2}]', expected: '0.3', isHidden: false },
      { id: 2, name: 'Long list with floating artifacts', input: 'Array of 10 items of 0.07', expected: '0.7', isHidden: true }
    ],
    points: 25,
    penalty: 5
  }
];

export const CATEGORIES = [
  'All',
  'Backend & Concurrency',
  'Agentic Tooling & AI Orchestration',
  'AI IDE & Build Engineering',
  'Systems & Concurrency',
  'Memory Safety & Systems',
  'Enterprise Java',
  'Enterprise .NET',
  'Frontend & Node.js',
  'Databases & Performance',
  'Security & AI Code Generation',
  'Mobile & Apple Systems',
  'Mobile & Enterprise JVM',
  'DevOps & Shell Security',
  'FinTech & Math'
];

export const LANGUAGES = [
  'All',
  'Python',
  'AI Portal (Claude Code)',
  'AI Portal (Cursor)',
  'AI Portal (Gemini / Antigravity)',
  'AI Portal (GitHub Copilot)',
  'AI Portal (Windsurf)',
  'AI Portal (Devin / Aider)',
  'Go',
  'Rust',
  'C++',
  'Java',
  'C#',
  'TypeScript',
  'JavaScript',
  'SQL',
  'Swift',
  'Kotlin',
  'PHP',
  'Shell / Bash'
];
