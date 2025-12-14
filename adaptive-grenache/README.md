# Adaptive Grenache Client

An intelligent, adaptive client for Grenache that learns peer health and optimizes routing decisions using gossip-based peer health hints.

## 🎯 Overview

This project implements a production-ready adaptive client for Grenache's decentralized service discovery and RPC system. It adds intelligent routing, peer health tracking, circuit breakers, and gossip-based information sharing—all while maintaining Grenache's core philosophy of decentralization.

### Key Features

- ✅ **Adaptive Routing**: Client-side load balancing based on real-time peer metrics
- ✅ **Peer Health Tracking**: Local metrics for latency, success rate, errors, and timeouts
- ✅ **Circuit Breaker**: Automatic failure isolation and recovery
- ✅ **Gossip Protocol**: Decentralized peer health hint sharing
- ✅ **Type-Safe**: Full TypeScript support with comprehensive types
- ✅ **Production-Ready**: Environment-based configuration, validation, and error handling

## 🏗️ Architecture

```
                     ┌──────────────────┐
                     │   Client (Smart)  │
                     │                  │
                     │  Local Metrics   │
                     │  Peer Scoring    │
                     │  Circuit Breaker │
                     │  Gossip Overlay  │
                     └────────┬─────────┘
                              │
                              │ RPC (direct)
                              ▼
        ┌───────────────────────────────────────┐
        │             Worker Pool                │
        │                                       │
        │  ┌──────────┐  ┌──────────┐           │
        │  │ Worker A │  │ Worker B │   ...     │
        │  └──────────┘  └──────────┘           │
        └───────────────────────────────────────┘
                              ▲
                              │ lookup / pubsub
                     ┌────────┴─────────┐
                     │     GRAPE DHT     │
                     │ (lookup + gossip)│
                     └──────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env
```

### Running the System

#### 1. Start Grape Cluster (DHT Network)

**Terminal 1 - First Grape Node:**
```bash
pnpm grape:1
# or
grape --dp 20001 --aph 30001 --bn ''
```

**Terminal 2 - Second Grape Node:**
```bash
pnpm grape:2
# or
grape --dp 20002 --aph 30002 --bn '127.0.0.1:20001'
```

**Terminal 3 - Third Grape Node (optional):**
```bash
pnpm grape:3
# or
grape --dp 20003 --aph 30003 --bn '127.0.0.1:20001'
```

#### 2. Start Worker Services

**Terminal 4:**
```bash
pnpm worker:start
```

#### 3. Start Adaptive Client

**Terminal 5:**
```bash
pnpm client:start
```

## ⚙️ Configuration

All configuration is managed through environment variables. See `.env.example` for all available options.

### Key Configuration Sections

#### Grape/DHT Configuration
```bash
GRAPE_DHT_PORT=20001          # DHT listening port
GRAPE_API_PORT=30001          # HTTP API port
GRAPE_BOOTSTRAP=              # Bootstrap nodes (comma-separated)
GRAPE_CONCURRENCY=32          # DHT concurrency
```

#### Worker Configuration
```bash
WORKER_SERVICE_NAME=job_service
WORKER_PORT=1337
WORKER_ANNOUNCE_INTERVAL=5000
```

#### Client Configuration
```bash
CLIENT_REQUEST_TIMEOUT=5000
CLIENT_MAX_RETRIES=3
CLIENT_RETRY_DELAY=1000
```

#### Metrics Configuration
```bash
METRICS_LATENCY_WEIGHT=0.4
METRICS_ERROR_WEIGHT=0.3
METRICS_TIMEOUT_WEIGHT=0.2
METRICS_FRESHNESS_WEIGHT=0.1
```

#### Circuit Breaker Configuration
```bash
CIRCUIT_BREAKER_FAILURE_THRESHOLD=5
CIRCUIT_BREAKER_COOLDOWN_MS=10000
CIRCUIT_BREAKER_HALF_OPEN_MAX_REQUESTS=1
```

#### Gossip Configuration
```bash
GOSSIP_HINT_TTL=60000
GOSSIP_PUBLISH_INTERVAL=5000
GOSSIP_DECAY_FACTOR=0.5
```

### Using Configuration in Code

```typescript
import { config, grape, worker, client } from './config/index.js'

// Access full config
console.log(config.grape.dht_port)

// Access specific sections
console.log(grape.dht_port)
console.log(worker.service_name)
console.log(client.request_timeout)

// Validate configuration
import { validateConfig } from './config/index.js'
validateConfig()
```

## 📁 Project Structure

```
adaptive-grenache/
├── client/                 # Adaptive client implementation
│   ├── client.ts          # Main client entry point
│   ├── router.ts          # Peer selection and routing
│   ├── metrics.ts         # Peer metrics tracking
│   ├── gossip.ts          # Gossip hint system
│   └── circuit-breaker.ts # Circuit breaker implementation
│
├── worker/                # Worker services
│   ├── worker.ts          # Worker main file
│   └── job-handler.ts     # Job processing logic
│
├── grape/                 # Grape DHT node scripts
│   ├── start-grape.ts     # Grape startup script
│   └── grape-config.ts    # Grape configuration
│
├── config/                # Configuration management
│   ├── index.ts          # Main config loader and validator
│   └── types.ts          # TypeScript interfaces
│
├── common/                # Shared utilities
│   └── utils/
│       └── config.utils.ts # Config parsing utilities
│
├── docs/                  # Documentation
│   ├── architecture.md    # System architecture
│   └── tradeoffs.md       # Design decisions
│
├── test/                  # Tests
│   └── test-scenarios.ts  # Test scenarios
│
├── .env                   # Environment variables (gitignored)
├── .env.example           # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Development

### Available Scripts

```bash
# Start Grape nodes
pnpm grape:1              # Start first Grape on ports 20001/30001
pnpm grape:2              # Start second Grape on ports 20002/30002
pnpm grape:3              # Start third Grape on ports 20003/30003

# Start services
pnpm worker:start         # Start worker service
pnpm client:start         # Start adaptive client

# Testing
pnpm test                 # Run tests
```

### TypeScript

This project uses TypeScript with ES modules. All files use `.ts` extension and ES6 `import/export` syntax.

### Configuration Management

- All configuration is centralized in `config/index.ts`
- Environment variables are loaded from `.env`
- Configuration is validated on startup
- Type-safe access to all config values

## 🧪 Testing

### Manual Testing

1. Start Grape cluster (2-3 nodes)
2. Start multiple workers
3. Start client and observe routing decisions
4. Simulate failures and observe adaptation

### Test Scenarios

See `test/test-scenarios.ts` for failure injection and validation tests.

## 📚 Documentation

- **[Architecture](./docs/architecture.md)**: Detailed system architecture
- **[Trade-offs](./docs/tradeoffs.md)**: Design decisions and alternatives
- **[Learning Guide](../LEARNING_GUIDE.md)**: Step-by-step learning guide

## 🔑 Key Concepts

### Peer Scoring

Each peer receives a score based on:
- **Latency**: Average response time
- **Error Rate**: Percentage of failed requests
- **Timeout Rate**: Percentage of timed-out requests
- **Freshness**: How recently the peer was seen

### Circuit Breaker States

- **CLOSED**: Normal operation, traffic flows
- **OPEN**: Failing, no traffic sent
- **HALF_OPEN**: Testing recovery, limited traffic

### Gossip Hints

Clients share peer health hints via Grenache pub/sub:
- **DEGRADED**: Peer is performing poorly
- **HEALTHY**: Peer is performing well
- Hints decay over time and never override local metrics

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :20001

# Kill process
lsof -ti :20001 | xargs kill -9
```

### Configuration Validation Errors

Check your `.env` file matches `.env.example` and all required values are set.

### Grape Nodes Not Connecting

- Verify bootstrap nodes are correct
- Check firewall settings
- Ensure ports are not blocked

## 🤝 Contributing

This is a learning project. Feel free to:
- Experiment with different routing algorithms
- Add new metrics
- Improve gossip protocol
- Enhance documentation

## 📝 License

ISC

## 🙏 Acknowledgments

- Built on [Grenache](https://github.com/bitfinexcom/grenache) by Bitfinex
- Inspired by production infrastructure patterns

## 📖 Learn More

- [Grenache Documentation](https://github.com/bitfinexcom/grenache)
- [DHT/Kademlia Protocol](https://en.wikipedia.org/wiki/Kademlia)
- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)
- [Gossip Protocols](https://en.wikipedia.org/wiki/Gossip_protocol)

---

**Built with ❤️ for learning distributed systems**

For the complete learning guide, see [../LEARNING_GUIDE.md](../LEARNING_GUIDE.md)

