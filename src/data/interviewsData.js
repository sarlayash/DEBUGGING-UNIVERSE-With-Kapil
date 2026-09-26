// Fortune 500 Interview & Placement Debugging Arena
// Grounded in real engineering interview scenarios with strict rubrics

export const INTERVIEWS_DATA = [
  {
    id: 'google_latency',
    company: 'Google',
    role: 'Staff Site Reliability Engineer / Senior SWE',
    level: 'L5 / L6',
    title: 'Distributed RPC Tail Latency & Thread Starvation',
    timeLimit: '45 Minutes',
    scenario: `A globally replicated Google Cloud Spanner microservice exhibits 99.9th percentile latency jumps from 15ms to 4,200ms during peak APAC traffic. Tracing shows gRPC calls backing up on internal thread pools.`,
    investigationSteps: [
      'Analyze Dapper distributed traces for RPC blocking times',
      'Inspect thread dump for lock contention on shared connection pool',
      'Diagnose TCP window exhaustion and head-of-line blocking',
      'Mitigate with deadline propagation and hedge requests'
    ],
    interviewerCriteria: [
      'Ability to isolate tail latency from average latency (p99 vs p50)',
      'Understanding of gRPC flow control and channel multiplexing',
      'Knowledge of hedged requests to combat transient network spikes',
      'Systematic binary search debugging methodology'
    ],
    sampleBugSnippet: `// gRPC Channel with single connection bottleneck
ManagedChannel channel = ManagedChannelBuilder.forTarget("spanner.googleapis.com")
    .usePlaintext() // Missing pooling & keepalive triggers frequent reconnects!
    .build();`,
    solutionRecommendation: `Deploy a subchannel pool with round-robin load balancing, set aggressive keepalive pings (30s), and enforce Context deadline propagation with 250ms cutoff.`
  },
  {
    id: 'meta_react_render',
    company: 'Meta',
    role: 'Front End Engineer (E5)',
    level: 'E5 (Senior)',
    title: 'React 19 Concurrent Mode Cascading Re-render Loop',
    timeLimit: '45 Minutes',
    scenario: `The Meta Ads Manager campaign creation flow crashes with "Maximum update depth exceeded" when users add custom audience tags under high frequency network polling.`,
    investigationSteps: [
      'Record React DevTools Profiler flamegraph to identify re-rendering components',
      'Inspect useEffect dependency arrays for object reference identity instability',
      'Verify startTransition usage for non-urgent state updates',
      'Implement stable callback memoization with useMemo and useCallback'
    ],
    interviewerCriteria: [
      'Deep understanding of JavaScript reference equality (===)',
      'Familiarity with React 19 Action and useTransition hooks',
      'Ability to profile memory snapshots in Chrome DevTools'
    ],
    sampleBugSnippet: `// Inline object created on every render triggers infinite effect loop
useEffect(() => {
  fetchAudienceMetrics({ filter: 'ACTIVE', timestamp: Date.now() });
}, [{ filter: 'ACTIVE' }]); // New reference on every single render!`,
    solutionRecommendation: `Extract static filter objects outside the component or wrap parameters in useMemo with primitive dependencies.`
  },
  {
    id: 'stripe_idempotency',
    company: 'Stripe',
    role: 'Backend Infrastructure Engineer (L4/L5)',
    level: 'L4 / L5',
    title: 'Idempotency Key Collision in Distributed Payment Pipeline',
    timeLimit: '45 Minutes',
    scenario: `Under duplicate webhook retries during network partitions, a merchant account experiences double charges because the idempotency key validation has a 20ms check-then-set race condition window.`,
    investigationSteps: [
      'Trace distributed locks across Redis Cluster nodes',
      'Identify time-of-check to time-of-use (TOCTOU) gap in transaction logic',
      'Implement atomic Redis SET NX EX with Lua scripts',
      'Verify two-phase commit or transactional outbox pattern'
    ],
    interviewerCriteria: [
      'Mastery of idempotency and financial guarantees (ACID)',
      'Knowledge of Redis atomic operations and distributed locking traps',
      'Understanding of at-least-once vs exactly-once delivery'
    ],
    sampleBugSnippet: `// Non-atomic check then set
if (!await redis.exists(idempotencyKey)) {
  await sleep(10); // Simulated delay causes concurrent request to also pass!
  await redis.set(idempotencyKey, "PROCESSING");
  await chargeCreditCard();
}`,
    solutionRecommendation: `Use atomic SET key value NX PX 10000. If key exists, immediately return the in-flight promise or cached response.`
  },
  {
    id: 'amazon_connection_pool',
    company: 'Amazon',
    role: 'Software Development Engineer II (SDE II)',
    level: 'SDE II',
    title: 'AWS Lambda Cold Start & Aurora Connection Pool Starvation',
    timeLimit: '45 Minutes',
    scenario: `During Prime Day sales spikes, thousands of Lambda execution environments spin up concurrently. Each creates a direct PostgreSQL pool of 20 connections, immediately exhausting Aurora's max_connections (5,000) and cascading into 500 errors across checkout.`,
    investigationSteps: [
      'Examine CloudWatch RDS metrics for active database connections',
      'Check Lambda execution lifecycle and database client instantiation',
      'Architect AWS RDS Proxy or PgBouncer connection multiplexing',
      'Implement exponential backoff with jitter on database reconnects'
    ],
    interviewerCriteria: [
      'Understanding of serverless scalability vs traditional database connection limits',
      'Knowledge of AWS RDS Proxy transaction-level multiplexing',
      'Graceful error handling and retry jitter'
    ],
    sampleBugSnippet: `// Initializing DB pool inside handler on every single invocation
export const handler = async (event) => {
  const pool = new Pool({ max: 20 }); // Exhausts DB instantly at 300 instances!
  return await pool.query('SELECT * FROM orders');
};`,
    solutionRecommendation: `Initialize DB client outside handler for container reuse, restrict max connections to 1 per container, and deploy AWS RDS Proxy to pool up to 10,000 clients over 200 physical database connections.`
  }
];
