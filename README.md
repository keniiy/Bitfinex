# Bitfinex-Style Infrastructure Learning Project

A comprehensive learning project focused on building production-ready distributed systems infrastructure, inspired by Bitfinex's architecture patterns.

## 🎯 Project Overview

This repository contains a complete learning journey through distributed systems concepts, with a focus on:

- **Decentralized Service Discovery** (DHT/Kademlia)
- **Peer-to-Peer RPC** (Grenache)
- **Adaptive Client-Side Load Balancing**
- **Gossip Protocols**
- **Circuit Breaker Patterns**
- **Production Infrastructure Patterns**

## 📁 Repository Structure

```
Bitfinex/
├── adaptive-grenache/          # Main project: Adaptive Grenache Client
│   ├── client/                 # Smart client with routing intelligence
│   ├── worker/                 # Worker services
│   ├── grape/                  # DHT node scripts
│   ├── config/                 # Centralized configuration
│   └── README.md              # Project-specific documentation
│
├── LEARNING_GUIDE.md          # Complete step-by-step learning guide
└── README.md                   # This file
```

## 🚀 Getting Started

### 1. Read the Learning Guide

Start with **[LEARNING_GUIDE.md](./LEARNING_GUIDE.md)** for a complete step-by-step breakdown of:
- What you're learning
- Why each concept matters
- How to implement each step
- Key concepts explained

### 2. Build the Adaptive Grenache Client

Navigate to the main project:

```bash
cd adaptive-grenache
```

See **[adaptive-grenache/README.md](./adaptive-grenache/README.md)** for:
- Quick start instructions
- Configuration guide
- Architecture overview
- Development workflow

## 📚 Learning Path

### Phase 1: Foundation (Steps 0-3)
- Project setup and structure
- Grape cluster (DHT basics)
- Worker services (RPC fundamentals)
- Basic client (baseline)

### Phase 2: Intelligence (Steps 4-6)
- Local metrics engine
- Peer scoring engine
- Circuit breaker implementation

### Phase 3: Decentralized Learning (Steps 7-8)
- Gossip pub/sub system
- Decay and recovery mechanisms

### Phase 4: Production (Steps 9-10)
- Failure injection and testing
- Documentation and architecture

## 🎓 What You'll Learn

### Core Concepts

1. **Distributed Hash Tables (DHT)**
   - Kademlia-based routing
   - Service discovery without central coordination
   - Bootstrap and peer discovery

2. **Client-Side Load Balancing**
   - Real-time peer health assessment
   - Adaptive traffic distribution
   - Routing decision algorithms

3. **Gossip Protocols**
   - Decentralized information sharing
   - Eventual consistency
   - Weak hints vs strong guarantees

4. **Circuit Breaker Pattern**
   - Failure isolation
   - State machines (CLOSED → OPEN → HALF_OPEN)
   - Recovery mechanisms

5. **Production Infrastructure**
   - Environment-based configuration
   - Type-safe systems
   - Observability and monitoring

## 🛠️ Technology Stack

- **Node.js** + **TypeScript**: Runtime and type safety
- **Grenache**: Decentralized service discovery and RPC
- **pnpm**: Fast package management
- **ES Modules**: Modern JavaScript module system

## 📖 Documentation

- **[LEARNING_GUIDE.md](./LEARNING_GUIDE.md)**: Complete step-by-step guide
- **[adaptive-grenache/README.md](./adaptive-grenache/README.md)**: Project documentation
- **[adaptive-grenache/docs/](./adaptive-grenache/docs/)**: Architecture and trade-offs

## 🎯 Project Goals

By the end of this project, you will:

- ✅ Understand DHT and decentralized systems
- ✅ Build intelligent client-side load balancing
- ✅ Implement gossip protocols
- ✅ Apply circuit breaker patterns
- ✅ Design production-ready infrastructure
- ✅ Make informed trade-off decisions

## 🚦 Quick Start

```bash
# 1. Navigate to project
cd adaptive-grenache

# 2. Install dependencies
pnpm install

# 3. Set up environment
cp .env.example .env

# 4. Start Grape cluster
pnpm grape:1  # Terminal 1
pnpm grape:2  # Terminal 2

# 5. Start worker
pnpm worker:start  # Terminal 3

# 6. Start client
pnpm client:start  # Terminal 4
```

## 📝 Notes

- This is a **learning project**, not production code
- Focus on understanding concepts, not just implementation
- Each step builds on the previous one
- Take time to understand the "why" behind each decision

## 🔗 Resources

- [Grenache Documentation](https://github.com/bitfinexcom/grenache)
- [DHT/Kademlia Protocol](https://en.wikipedia.org/wiki/Kademlia)
- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)
- [Gossip Protocols](https://en.wikipedia.org/wiki/Gossip_protocol)

## 📄 License

ISC

---

**Happy Learning! 🚀**

Start with the [LEARNING_GUIDE.md](./LEARNING_GUIDE.md) to begin your journey.

