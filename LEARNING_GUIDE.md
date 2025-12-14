# Adaptive Grenache Client - Complete Learning Guide

## 📚 Table of Contents

1. [What You're Learning](#what-youre-learning)
2. [Prerequisites](#prerequisites)
3. [Project Setup](#project-setup)
4. [Step-by-Step Implementation Guide](#step-by-step-implementation-guide)
5. [Key Concepts Explained](#key-concepts-explained)
6. [Testing & Validation](#testing--validation)
7. [Next Steps: Mini Bitfinex App](#next-steps-mini-bitfinex-app)

---

## What You're Learning

### Core Concepts

1. **Distributed Hash Tables (DHT)**
   - How services discover each other without a central server
   - Kademlia-based routing
   - Bootstrap and peer discovery

2. **Peer-to-Peer RPC**
   - Direct service-to-service communication
   - No load balancer needed
   - Decentralized architecture

3. **Client-Side Load Balancing**
   - Making routing decisions at the client
   - Real-time peer health assessment
   - Adaptive traffic distribution

4. **Gossip Protocols**
   - Decentralized information sharing
   - Eventual consistency
   - Weak hints vs strong guarantees

5. **Circuit Breakers**
   - Failure isolation patterns
   - State machines (CLOSED → OPEN → HALF_OPEN)
   - Preventing cascading failures

6. **Adaptive Systems**
   - Systems that learn from experience
   - Time-based decay
   - Recovery mechanisms

---

## Prerequisites

### Install Required Tools

```bash
# Install pnpm globally
npm install -g pnpm

# Verify installation
pnpm --version
```

### Knowledge Prerequisites

- Basic Node.js/JavaScript (ES6+)
- Understanding of async/await
- Basic networking concepts
- Familiarity with command line

---

## Project Setup

### 1. Initialize Project Structure

Create this directory structure:

```text
/adaptive-grenache
  /grape
    start-grape.sh
    grape-config.js
  /worker
    worker.js
    job-handler.js
  /client
    client.js
    router.js
    metrics.js
    gossip.js
    circuit-breaker.js
  /docs
    architecture.md
    tradeoffs.md
  /test
    test-scenarios.js
  .gitignore
  package.json
  README.md
  LEARNING_GUIDE.md (this file)
```

### 2. Initialize pnpm Project

```bash
# In your project root
pnpm init

# Install Grenache packages
pnpm add grenache-grape grenache-nodejs-http grenache-nodejs-link

# Install dev dependencies (optional, for TypeScript types)
pnpm add -D @types/node
```

### 3. Create .gitignore

```text
node_modules/
*.log
.DS_Store
.env
dist/
coverage/
```

---

## Step-by-Step Implementation Guide

---

## STEP 0: Project Skeleton (30 mins)

**Goal**: Set up clean project structure

**What You Learn**:

- Separation of concerns
- Modular architecture
- Project organization

**Tasks**:

1. Create all directories listed above
2. Create empty files in each directory
3. Set up `package.json` with scripts:

   ```json
   {
     "scripts": {
       "grape:start": "node grape/start-grape.js",
       "worker:start": "node worker/worker.js",
       "client:start": "node client/client.js"
     }
   }
   ```

**Validation**:

- ✅ All directories exist
- ✅ Can run `pnpm install` successfully
- ✅ Project structure is clean and organized

---

## STEP 1: Grape Cluster (Learn DHT Basics)

**Goal**: Run 2-3 Grape nodes that discover each other

**What You Learn**:

- DHT bootstrapping
- Network formation
- Failure tolerance

**Key Concepts**:

**Grape** = A DHT node that maintains the network

- Stores service announcements
- Routes lookup requests
- Handles peer discovery

**Bootstrap** = How nodes find each other initially

- First node: no bootstrap needed
- Other nodes: connect to at least one existing node

**Implementation Steps**:

1. **Create `grape/start-grape.js`**:
   - Use `grenache-grape` package
   - Configure ports (dht_port, api_port)
   - Set bootstrap nodes
   - Start the Grape instance

2. **Start Multiple Grapes**:

   ```bash
   # Terminal 1 - First grape (no bootstrap)
   pnpm grape:start --dp 20001 --aph 30001

   # Terminal 2 - Second grape (bootstrap to first)
   pnpm grape:start --dp 20002 --aph 30002 --bn '127.0.0.1:20001'

   # Terminal 3 - Third grape (bootstrap to first or second)
   pnpm grape:start --dp 20003 --aph 30003 --bn '127.0.0.1:20001'
   ```

3. **Verify Connection**:
   - Check logs for peer connections
   - All grapes should see each other
   - Kill one grape; others should continue

**Key Code Patterns to Learn**:

```javascript
// Grape initialization pattern
const Grape = require('grenache-grape').Grape

const grape = new Grape({
  dht_port: 20001,
  dht_bootstrap: ['127.0.0.1:20002'], // bootstrap nodes
  api_port: 30001
})

grape.start()
```

**Validation**:

- ✅ All grapes start without errors
- ✅ Logs show peer connections
- ✅ Killing one grape doesn't break others
- ✅ Can query DHT from any grape

**Common Issues**:

- **Port conflicts**: Make sure ports are unique
- **Bootstrap fails**: Check IP addresses and ports
- **No peer discovery**: Verify bootstrap configuration

---

## STEP 2: Worker Service (RPC Fundamentals)

**Goal**: Create a worker that announces itself and handles RPC calls

**What You Learn**:

- Service lifecycle
- Announce/expiry semantics
- RPC request/response handling

**Key Concepts**:

**Announce** = Register service on DHT

- Service name (e.g., "job_service")
- Worker's address
- TTL (time to live)

**Lookup** = Find services by name

- Returns list of peer addresses
- Can return multiple workers

**RPC** = Remote Procedure Call

- Client calls method on worker
- Worker executes and returns result

**Implementation Steps**:

1. **Create `worker/worker.js`**:
   - Import `grenache-nodejs-link` and `grenache-nodejs-http`
   - Create link to Grape
   - Create HTTP transport
   - Announce service name
   - Handle RPC requests

2. **Service Announcement**:

   ```javascript
   // Pattern: Announce service
   link.start()
   link.announce('job_service', port, {})
   ```

3. **RPC Handler**:

   ```javascript
   // Pattern: Handle RPC requests
   transport.listen(port)
   transport.on('request', (rid, key, payload, handler) => {
     // Process request
     handler.reply(null, { result: 'success' })
   })
   ```

4. **Simulate Latency/Failure**:
   - Add random delays
   - Randomly return errors
   - Track request count

**Key Code Patterns**:

```javascript
// Link to Grape
const Link = require('grenache-nodejs-link')
const link = new Link({ grape: 'http://127.0.0.1:30001' })
link.start()

// HTTP Transport
const Peer = require('grenache-nodejs-http').PeerHTTP
const peer = new PeerHTTP(link, {})
peer.init()

// Announce
peer.announce('job_service', 1337, {})

// Handle requests
peer.on('request', (rid, key, payload, handler) => {
  // Your logic here
  handler.reply(null, { result: 'done' })
})
```

**Validation**:

- ✅ Worker announces successfully
- ✅ Worker appears in DHT lookup
- ✅ Can receive and respond to RPC calls
- ✅ Can simulate different response times

**Test Scenarios**:

- Start multiple workers with same service name
- Verify all appear in lookup
- Stop a worker; verify it disappears after TTL

---

## STEP 3: Basic Client RPC (Baseline)

**Goal**: Client discovers workers and calls them randomly

**What You Learn**:

- Service discovery
- RPC client calls
- Basic error handling

**Implementation Steps**:

1. **Create `client/client.js`**:
   - Link to Grape
   - Lookup service
   - Create RPC client
   - Call random peer
   - Handle response

2. **Service Lookup**:

   ```javascript
   // Pattern: Find services
   link.lookup('job_service', {}, (err, peers) => {
     // peers is array of addresses
   })
   ```

3. **RPC Call**:

   ```javascript
   // Pattern: Call worker
   const peer = new PeerHTTP(link, {})
   peer.request('job_service', { action: 'execute' }, { timeout: 5000 }, (err, data) => {
     // Handle response
   })
   ```

4. **Random Peer Selection**:
   - Get all peers from lookup
   - Pick random one
   - Call that peer

**Key Code Patterns**:

```javascript
// Lookup pattern
link.lookup('job_service', {}, (err, peers) => {
  if (err) throw err

  // peers = ['127.0.0.1:1337', '127.0.0.1:1338', ...]
  const randomPeer = peers[Math.floor(Math.random() * peers.length)]

  // Call peer
  peer.request('job_service', payload, options, callback)
})
```

**Validation**:

- ✅ Client finds all workers
- ✅ Can make RPC calls successfully
- ✅ Handles basic errors (timeout, connection refused)
- ✅ Randomly selects different peers

**This is your baseline** - pure Grenache, no intelligence yet.

---

## STEP 4: Local Metrics Engine

**Goal**: Track performance metrics for each peer

**What You Learn**:

- Real-time telemetry
- Feedback loops
- Data structures for metrics

**Key Concepts**:

**Metrics to Track**:

- `avg_latency_ms`: Average response time
- `success_count`: Number of successful calls
- `error_count`: Number of failed calls
- `timeout_count`: Number of timeouts
- `last_seen_ts`: Last interaction timestamp
- `total_calls`: Total number of calls

**Implementation Steps**:

1. **Create `client/metrics.js`**:
   - Data structure to store peer metrics
   - Methods: `update()`, `get()`, `getAll()`
   - Calculate averages

2. **Metrics Data Structure**:

   ```javascript
   {
     'peer_id': {
       avg_latency_ms: 0,
       success_count: 0,
       error_count: 0,
       timeout_count: 0,
       last_seen_ts: Date.now(),
       total_calls: 0,
       latency_history: [] // optional: for moving average
     }
   }
   ```

3. **Update Metrics**:
   - After each RPC call
   - Record latency
   - Increment success/error/timeout
   - Update timestamp

4. **Calculate Averages**:
   - Use exponential moving average (EMA) for latency
   - Or simple average
   - Keep last N samples

**Key Code Patterns**:

```javascript
// Metrics class structure
class PeerMetrics {
  constructor() {
    this.metrics = new Map()
  }

  update(peerId, { latency, success, error, timeout }) {
    const m = this.metrics.get(peerId) || this._initMetrics()

    if (latency !== undefined) {
      // Update average latency (EMA)
      m.avg_latency_ms = m.avg_latency_ms * 0.7 + latency * 0.3
      m.total_calls++
    }

    if (success) m.success_count++
    if (error) m.error_count++
    if (timeout) m.timeout_count++

    m.last_seen_ts = Date.now()
    this.metrics.set(peerId, m)
  }

  get(peerId) {
    return this.metrics.get(peerId)
  }

  getAll() {
    return Array.from(this.metrics.entries())
  }
}
```

**Integration**:

In `client.js`, after each RPC call:

```javascript
const startTime = Date.now()
peer.request(service, payload, options, (err, data) => {
  const latency = Date.now() - startTime

  if (err) {
    metrics.update(peerId, { error: true, latency })
  } else {
    metrics.update(peerId, { success: true, latency })
  }
})
```

**Validation**:

- ✅ Metrics update after each call
- ✅ Can query metrics for any peer
- ✅ Averages calculate correctly
- ✅ Metrics persist across multiple calls

**Test Scenarios**:

- Call same peer multiple times; verify metrics accumulate
- Call different peers; verify separate metrics
- Simulate slow peer; verify latency increases

---

## STEP 5: Peer Scoring Engine

**Goal**: Calculate a score for each peer based on metrics

**What You Learn**:

- Traffic shaping algorithms
- Probabilistic routing
- Weighted scoring functions

**Key Concepts**:

**Score Formula**:

```text
score =
  latency_weight × latency_factor +
  error_weight × error_factor +
  timeout_weight × timeout_factor +
  freshness_weight × freshness_factor
```

**Factors** (normalized 0-1):

- `latency_factor`: Lower latency = higher factor (inverse)
- `error_factor`: Lower error rate = higher factor
- `timeout_factor`: Lower timeout rate = higher factor
- `freshness_factor`: More recent = higher factor

**Implementation Steps**:

1. **Create `client/router.js`**:
   - Scoring function
   - Peer selection logic
   - Weight configuration

2. **Normalize Factors**:
   - Latency: `1 / (1 + latency_ms / 100)` (example)
   - Error rate: `1 - (error_count / total_calls)`
   - Timeout rate: `1 - (timeout_count / total_calls)`
   - Freshness: `1 - (age_seconds / max_age_seconds)`

3. **Calculate Score**:

   ```javascript
   function calculateScore(metrics, weights) {
     const latencyFactor = normalizeLatency(metrics.avg_latency_ms)
     const errorFactor = 1 - (metrics.error_count / metrics.total_calls)
     const timeoutFactor = 1 - (metrics.timeout_count / metrics.total_calls)
     const freshnessFactor = normalizeFreshness(metrics.last_seen_ts)

     return (
       weights.latency * latencyFactor +
       weights.error * errorFactor +
       weights.timeout * timeoutFactor +
       weights.freshness * freshnessFactor
     )
   }
   ```

4. **Select Best Peer**:
   - Get all peers
   - Calculate score for each
   - Select highest score
   - Or use weighted random (higher score = higher probability)

**Key Code Patterns**:

```javascript
// Scoring function
function scorePeer(metrics, config) {
  if (!metrics || metrics.total_calls === 0) {
    return config.defaultScore // New peers get default
  }

  const latencyFactor = 1 / (1 + metrics.avg_latency_ms / 100)
  const errorRate = metrics.error_count / metrics.total_calls
  const timeoutRate = metrics.timeout_count / metrics.total_calls
  const age = Date.now() - metrics.last_seen_ts
  const freshnessFactor = Math.max(0, 1 - age / (60 * 1000)) // 1 minute max age

  return (
    config.weights.latency * latencyFactor +
    config.weights.error * (1 - errorRate) +
    config.weights.timeout * (1 - timeoutRate) +
    config.weights.freshness * freshnessFactor
  )
}

// Selection
function selectPeer(peers, metrics, router) {
  const scored = peers.map(peer => ({
    peer,
    score: scorePeer(metrics.get(peer), router.config)
  }))

  scored.sort((a, b) => b.score - a.score)
  return scored[0].peer // Best peer
}
```

**Configuration**:

```javascript
const routerConfig = {
  weights: {
    latency: 0.4,    // 40% weight on latency
    error: 0.3,      // 30% weight on error rate
    timeout: 0.2,   // 20% weight on timeout rate
    freshness: 0.1   // 10% weight on freshness
  },
  defaultScore: 0.5  // Score for unknown peers
}
```

**Validation**:

- ✅ Scores calculated correctly
- ✅ Higher scores = better peers
- ✅ Scores update as metrics change
- ✅ Can rank peers by score

**Test Scenarios**:

- Fast peer gets higher score than slow peer
- Peer with errors gets lower score
- New peer gets default score
- Scores change as metrics update

---

## STEP 6: Circuit Breaker

**Goal**: Stop sending traffic to failing peers

**What You Learn**:

- Resilience patterns
- State machines
- Tail-latency control

**Key Concepts**:

**Circuit States**:

- **CLOSED**: Normal operation, traffic flows
- **OPEN**: Failing, no traffic sent
- **HALF_OPEN**: Testing recovery, limited traffic

**State Transitions**:

```text
CLOSED → OPEN (when failures exceed threshold)
OPEN → HALF_OPEN (after cooldown period)
HALF_OPEN → CLOSED (on success)
HALF_OPEN → OPEN (on failure)
```

**Implementation Steps**:

1. **Create `client/circuit-breaker.js`**:
   - State machine
   - Failure counting
   - Cooldown timer
   - Probe logic

2. **State Machine**:

   ```javascript
   class CircuitBreaker {
     constructor(peerId, config) {
       this.peerId = peerId
       this.state = 'CLOSED'
       this.failureCount = 0
       this.lastFailureTime = null
       this.config = config
     }

     recordSuccess() {
       if (this.state === 'HALF_OPEN') {
         this.state = 'CLOSED'
         this.failureCount = 0
       }
     }

     recordFailure() {
       this.failureCount++
       this.lastFailureTime = Date.now()

       if (this.failureCount >= this.config.failureThreshold) {
         this.state = 'OPEN'
       }
     }

     canAttempt() {
       if (this.state === 'CLOSED') return true
       if (this.state === 'OPEN') {
         // Check cooldown
         if (Date.now() - this.lastFailureTime > this.config.cooldownMs) {
           this.state = 'HALF_OPEN'
           return true // Allow probe
         }
         return false
       }
       if (this.state === 'HALF_OPEN') {
         return true // Allow probe
       }
     }
   }
   ```

3. **Integration with Router**:
   - Check circuit state before selecting peer
   - Skip OPEN peers
   - Allow HALF_OPEN peers for probing

4. **Configuration**:

   ```javascript
   const circuitConfig = {
     failureThreshold: 5,      // Open after 5 failures
     cooldownMs: 10000,        // 10 second cooldown
     halfOpenMaxRequests: 1    // Only 1 probe at a time
   }
   ```

**Key Code Patterns**:

```javascript
// Circuit breaker integration
function selectPeer(peers, metrics, router, circuits) {
  const available = peers.filter(peer => {
    const circuit = circuits.get(peer)
    return circuit && circuit.canAttempt()
  })

  if (available.length === 0) {
    // All circuits open, reset oldest one
    resetOldestCircuit(circuits)
    return selectPeer(peers, metrics, router, circuits)
  }

  // Select from available peers
  return selectBestPeer(available, metrics, router)
}

// After RPC call
if (success) {
  circuit.recordSuccess()
} else {
  circuit.recordFailure()
}
```

**Validation**:

- ✅ Failing peers transition to OPEN
- ✅ No traffic sent to OPEN peers
- ✅ Peers recover via HALF_OPEN
- ✅ Cooldown period respected

**Test Scenarios**:

- Peer fails 5 times → goes OPEN
- OPEN peer not selected for 10 seconds
- After cooldown, peer goes HALF_OPEN
- Successful probe → CLOSED
- Failed probe → OPEN again

---

## STEP 7: Gossip Pub/Sub (Key Learning)

**Goal**: Clients share peer health hints via Grenache pub/sub

**What You Learn**:

- Decentralized information spread
- Eventual convergence
- Weak consistency design

**Key Concepts**:

**Gossip Hint**:

```javascript
{
  peer_id: '127.0.0.1:1337',
  signal: 'DEGRADED' | 'HEALTHY',
  latency_hint: 500,        // ms
  error_rate_hint: 0.1,    // 10%
  timestamp: Date.now()
}
```

**Important**: Hints are **advisory only**

- Never override local metrics
- Used as penalties, not replacements
- Decay over time

**Implementation Steps**:

1. **Create `client/gossip.js`**:
   - Publish hints
   - Subscribe to hints
   - Store received hints
   - Apply hints as penalties

2. **Publish Hints**:

   ```javascript
   // When peer degrades
   function publishHint(link, peerId, signal, metrics) {
     const hint = {
       peer_id: peerId,
       signal: signal, // 'DEGRADED' or 'HEALTHY'
       latency_hint: metrics.avg_latency_ms,
       error_rate_hint: metrics.error_count / metrics.total_calls,
       timestamp: Date.now()
     }

     link.put('peer.hint', hint, {}, (err) => {
       // Hint published
     })
   }
   ```

3. **Subscribe to Hints**:

   ```javascript
   // Listen for hints from other clients
   link.get('peer.hint', {}, (err, data) => {
     if (err) return

     // Store hint
     gossipHints.set(data.peer_id, data)
   })
   ```

4. **Apply Hints as Penalties**:

   ```javascript
   // In router, adjust score
   function calculateEffectiveScore(peer, metrics, router, gossipHints) {
     const baseScore = calculateScore(metrics, router.config)
     const hint = gossipHints.get(peer)

     if (!hint) return baseScore

     // Apply penalty based on hint
     let penalty = 0
     if (hint.signal === 'DEGRADED') {
       penalty = 0.3 // Reduce score by 30%
     }

     // Decay penalty over time
     const age = Date.now() - hint.timestamp
     const decayFactor = Math.exp(-age / (60 * 1000)) // 1 minute decay
     penalty *= (1 - decayFactor)

     return baseScore - penalty
   }
   ```

**Key Code Patterns**:

```javascript
// Gossip class
class GossipHints {
  constructor(link) {
    this.link = link
    this.hints = new Map()
    this.setupSubscription()
  }

  setupSubscription() {
    // Subscribe to peer hints
    setInterval(() => {
      this.link.get('peer.hint', {}, (err, data) => {
        if (err || !data) return
        this.hints.set(data.peer_id, data)
      })
    }, 1000) // Poll every second
  }

  publish(peerId, signal, metrics) {
    const hint = {
      peer_id: peerId,
      signal,
      latency_hint: metrics.avg_latency_ms,
      error_rate_hint: metrics.error_count / metrics.total_calls,
      timestamp: Date.now()
    }

    this.link.put('peer.hint', hint, {}, () => {})
  }

  get(peerId) {
    return this.hints.get(peerId)
  }

  getAll() {
    return Array.from(this.hints.values())
  }
}

// Integration: Publish when peer degrades
if (metrics.error_count / metrics.total_calls > 0.2) {
  gossip.publish(peerId, 'DEGRADED', metrics)
}
```

**Validation**:

- ✅ Clients publish hints when peers degrade
- ✅ Clients receive hints from others
- ✅ Hints influence routing (as penalties)
- ✅ Local metrics still dominate

**Test Scenarios**:

- Client A sees peer degrade → publishes hint
- Client B receives hint → applies penalty
- Client B's local metrics still primary
- Old hints decay over time

---

## STEP 8: Decay + Recovery

**Goal**: Old hints lose influence; recovered peers can be used

**What You Learn**:

- Time-based decay
- Recovery behavior
- Stability vs responsiveness trade-offs

**Implementation Steps**:

1. **Implement Decay Function**:

   ```javascript
   function decayPenalty(hint, currentTime) {
     const age = currentTime - hint.timestamp
     const ttl = 60000 // 1 minute TTL

     // Exponential decay
     const decayFactor = Math.exp(-age / ttl)

     return decayFactor
   }
   ```

2. **Apply Decay in Scoring**:

   ```javascript
   function applyGossipPenalty(baseScore, hint) {
     if (!hint) return baseScore

     const decayFactor = decayPenalty(hint, Date.now())
     const basePenalty = hint.signal === 'DEGRADED' ? 0.3 : 0

     return baseScore - (basePenalty * decayFactor)
   }
   ```

3. **Recovery Detection**:
   - When peer improves locally, publish HEALTHY hint
   - Override old DEGRADED hints
   - Allow faster recovery

4. **Cleanup Old Hints**:

   ```javascript
   // Periodically clean up expired hints
   setInterval(() => {
     const now = Date.now()
     for (const [peerId, hint] of gossipHints.entries()) {
       if (now - hint.timestamp > maxHintAge) {
         gossipHints.delete(peerId)
       }
     }
   }, 5000)
   ```

**Key Code Patterns**:

```javascript
// Decay implementation
function calculateEffectiveScore(peer, metrics, router, gossipHints) {
  const baseScore = calculateScore(metrics, router.config)
  const hint = gossipHints.get(peer)

  if (!hint) return baseScore

  // Calculate decay
  const age = Date.now() - hint.timestamp
  const ttl = 60000 // 1 minute
  const decayFactor = Math.exp(-age / ttl)

  // Apply penalty with decay
  let penalty = 0
  if (hint.signal === 'DEGRADED') {
    penalty = 0.3 * decayFactor // Decays over time
  } else if (hint.signal === 'HEALTHY') {
    penalty = -0.1 * decayFactor // Small boost
  }

  return Math.max(0, Math.min(1, baseScore + penalty))
}

// Recovery: Publish HEALTHY when peer improves
if (peerWasDegraded && metrics.error_count / metrics.total_calls < 0.05) {
  gossip.publish(peerId, 'HEALTHY', metrics)
}
```

**Validation**:

- ✅ Old hints fade away
- ✅ Recovered peers can be used again
- ✅ System converges to accurate state
- ✅ No permanent blacklisting

**Test Scenarios**:

- Hint published → strong penalty
- Wait 1 minute → penalty decays
- Peer recovers → HEALTHY hint published
- System converges to correct state

---

## STEP 9: Failure Injection

**Goal**: Test system under various failure conditions

**What You Learn**:

- System behavior under stress
- Production debugging
- Observability

**Failure Scenarios to Test**:

1. **Worker Crash**:
   - Kill worker mid-request
   - Verify client retries
   - Verify other peers selected
   - Verify gossip hint emitted

2. **Slow Worker**:
   - Add artificial delay
   - Verify routing adapts
   - Verify slow peer gets lower score

3. **Flaky Network**:
   - Random timeouts
   - Intermittent failures
   - Verify circuit breaker activates

4. **False Gossip**:
   - Manually inject bad hints
   - Verify hints decay
   - Verify local metrics dominate

5. **Grape Crash**:
   - Kill one grape
   - Verify client switches
   - Verify no traffic disruption

**Implementation Steps**:

1. **Create `test/test-scenarios.js`**:
   - Test each scenario
   - Measure adaptation time
   - Log behavior

2. **Add Observability**:
   - Log all routing decisions
   - Log circuit breaker state changes
   - Log gossip hint propagation
   - Metrics dashboard (optional)

3. **Measure**:
   - Time to detect failure
   - Time to route away from bad peer
   - Time for gossip to propagate
   - Recovery time

**Key Metrics to Track**:

```javascript
// Observability
const observability = {
  routingDecisions: [],
  circuitStateChanges: [],
  gossipHintsReceived: [],
  adaptationTime: []
}

// Log routing decision
function logRoutingDecision(peer, score, reason) {
  observability.routingDecisions.push({
    timestamp: Date.now(),
    peer,
    score,
    reason
  })
}

// Log circuit state change
function logCircuitStateChange(peer, oldState, newState) {
  observability.circuitStateChanges.push({
    timestamp: Date.now(),
    peer,
    oldState,
    newState
  })
}
```

**Validation**:

- ✅ System adapts to failures
- ✅ Routing improves over time
- ✅ No complete system failures
- ✅ Recovery mechanisms work

**Test Checklist**:

- [ ] Worker crash → client retries → routes to other peer
- [ ] Slow worker → gets lower score → less traffic
- [ ] Circuit opens → no traffic → recovers after cooldown
- [ ] Gossip propagates → other clients learn faster
- [ ] False gossip → decays → local metrics win

---

## STEP 10: Documentation

**Goal**: Document your system design and decisions

**What You Learn**:

- Technical writing
- Architecture communication
- Trade-off analysis

**Deliverables**:

### 1. `docs/architecture.md`

**Sections**:

- System Overview
- Component Diagram
- Data Flow
- Key Algorithms
- Failure Modes

**Example Structure**:

```markdown
# Architecture

## Overview
[High-level description]

## Components

### Grape Cluster
[Description of DHT nodes]

### Worker Services
[Description of workers]

### Adaptive Client
[Description of client components]

## Data Flow

```text
Client → Lookup → DHT → Workers
Client → RPC → Worker → Response
Client → Metrics → Router → Selection
Client → Gossip → DHT → Other Clients
```

## Algorithms

### Peer Scoring

[Explain scoring formula]

### Circuit Breaker

[Explain state machine]

### Gossip Decay

[Explain decay function]

```text

### 2. `docs/tradeoffs.md`

**Sections**:
- Design Decisions
- Alternatives Considered
- Trade-offs
- Future Improvements

**Example Topics**:

```markdown
# Trade-offs

## Why Client-Side Load Balancing?
- Pros: No SPOF, scales horizontally
- Cons: Each client makes independent decisions

## Why Gossip Instead of Centralized Metrics?
- Pros: Decentralized, no coordinator
- Cons: Eventual consistency, potential false hints

## Why Exponential Decay?
- Pros: Smooth recovery, prevents permanent blacklisting
- Cons: Slower adaptation than fixed TTL

## Weight Configuration
- Why 40% latency, 30% error, etc.?
- How to tune for different workloads?
```

### 3. `README.md`

**Sections**:

- Project Description
- Quick Start
- Architecture Overview
- Configuration
- Testing
- Future Work

**Example**:

```markdown
# Adaptive Grenache Client

[Description]

## Quick Start

\`\`\`bash
# Start grapes
pnpm grape:start --dp 20001 --aph 30001

# Start worker
pnpm worker:start

# Start client
pnpm client:start
\`\`\`

## Architecture

[Link to architecture.md]

## Configuration

[Explain config options]

## Testing

[Explain test scenarios]
```

**Validation**:

- ✅ Architecture clearly explained
- ✅ Trade-offs documented
- ✅ README enables others to run system
- ✅ Diagrams included (ASCII art)

---

## Key Concepts Explained

### DHT (Distributed Hash Table)

**What it is**: A decentralized key-value store

- No central server
- Peers store and retrieve data
- Kademlia algorithm for routing

**How Grenache uses it**:

- Workers announce services (key = service name)
- Clients lookup services (query by name)
- DHT routes queries to peers

**Trade-offs**:

- ✅ No SPOF
- ✅ Scales horizontally
- ❌ Eventual consistency
- ❌ No strong guarantees

### Gossip Protocol

**What it is**: Decentralized information sharing

- Peers share information with neighbors
- Information spreads gradually
- No central coordinator

**In this project**:

- Clients publish peer health hints
- Other clients receive hints
- Hints influence routing decisions

**Trade-offs**:

- ✅ Decentralized
- ✅ Fast propagation
- ❌ Eventual consistency
- ❌ Potential false information

### Circuit Breaker Pattern

**What it is**: Failure isolation mechanism

- Prevents cascading failures
- Stops sending traffic to failing services
- Allows recovery testing

**States**:

- **CLOSED**: Normal operation
- **OPEN**: Failing, blocked
- **HALF_OPEN**: Testing recovery

**Trade-offs**:

- ✅ Prevents cascading failures
- ✅ Fast failure detection
- ❌ May block healthy services temporarily
- ❌ Requires tuning thresholds

---

## Testing & Validation

### Unit Testing

Test each component independently:

- Metrics calculation
- Score calculation
- Circuit breaker state transitions
- Decay functions

### Integration Testing

Test component interactions:

- Client → Worker RPC
- Metrics → Router selection
- Gossip → Router penalties

### System Testing

Test full system:

- Multiple workers
- Multiple clients
- Failure scenarios
- Recovery scenarios

### Performance Testing

Measure:

- Routing decision latency
- Gossip propagation time
- Adaptation time
- Throughput

---

## Next Steps: Mini Bitfinex App

Once your adaptive client works, you can build a mini trading system:

### Components

1. **Order Book Service**
   - Workers maintain order books
   - Handle buy/sell orders
   - Match orders

2. **Trade Execution Service**
   - Workers execute trades
   - Update balances
   - Emit trade events

3. **Market Data Service**
   - Workers stream prices
   - Broadcast updates
   - Handle subscriptions

4. **Your Adaptive Client**
   - Routes to best workers
   - Handles failures
   - Optimizes latency

### Architecture

```text
Trading Client → Adaptive Router → Order Book Workers
                              → Trade Execution Workers
                              → Market Data Workers
```

### What You'll Learn

- Real-world use case
- Multiple service types
- High-throughput scenarios
- Production patterns

---

## Resources

### Grenache Documentation

- GitHub: `bitfinexcom/grenache-nodejs-http`
- Blog posts about Grenache
- DHT/Kademlia papers

### Related Concepts

- Circuit Breaker Pattern (Martin Fowler)
- Gossip Protocols (research papers)
- Client-Side Load Balancing
- Adaptive Systems

### Tools

- pnpm: Fast package manager
- Node.js: Runtime
- Grenache packages: Core libraries

---

## Common Pitfalls & Solutions

### Issue: Grapes don't connect

**Solution**: Check bootstrap configuration, verify ports

### Issue: Workers not found

**Solution**: Verify announce, check TTL, verify Grape connection

### Issue: Metrics not updating

**Solution**: Check metrics.update() calls, verify data structure

### Issue: Scores all same

**Solution**: Check normalization, verify weights, check metrics

### Issue: Circuit never opens

**Solution**: Check failure threshold, verify failure counting

### Issue: Gossip not propagating

**Solution**: Verify pub/sub setup, check DHT connectivity

---

## Success Criteria

You've succeeded when:

- ✅ All 10 steps completed
- ✅ System handles failures gracefully
- ✅ Routing adapts to peer health
- ✅ Gossip hints influence decisions
- ✅ Documentation is clear and complete
- ✅ You can explain every design decision

---

## Final Notes

This is **not a beginner project**. It requires:

- Understanding distributed systems
- Comfort with async programming
- Ability to reason about trade-offs
- Production-level thinking

Take your time. Understand each step before moving on. The learning is in the journey, not just the destination.

Good luck! 🚀
