import { config as dotenvConfig } from 'dotenv';
import { Config } from './types.js';
import {
  parseArray,
  parseInteger,
  parseFloat,
} from '../common/utils/config.utils.js';

// Load environment variables
dotenvConfig();

/**
 * Load and validate configuration from environment variables
 */
export function loadConfig(): Config {
  const config: Config = {
    grape: {
      dht_port: parseInteger(process.env.GRAPE_DHT_PORT, 20001),
      api_port: parseInteger(process.env.GRAPE_API_PORT, 30001),
      bootstrap: parseArray(process.env.GRAPE_BOOTSTRAP, []),
      concurrency: parseInteger(process.env.GRAPE_CONCURRENCY, 32),
    },
    worker: {
      service_name: process.env.WORKER_SERVICE_NAME || 'job_service',
      port: parseInteger(process.env.WORKER_PORT, 1337),
      announce_interval: parseInteger(
        process.env.WORKER_ANNOUNCE_INTERVAL,
        5000
      ),
    },
    client: {
      request_timeout: parseInteger(process.env.CLIENT_REQUEST_TIMEOUT, 5000),
      error_weight: parseFloat(process.env.CLIENT_ERROR_WEIGHT, 0.3),
      timeout_weight: parseFloat(process.env.CLIENT_TIMEOUT_WEIGHT, 0.2),
      freshness_weight: parseFloat(process.env.CLIENT_FRESHNESS_WEIGHT, 0.1),
    },
    metrics: {
      latency_weight: parseFloat(process.env.METRICS_LATENCY_WEIGHT, 0.4),
      error_weight: parseFloat(process.env.METRICS_ERROR_WEIGHT, 0.3),
      timeout_weight: parseFloat(process.env.METRICS_TIMEOUT_WEIGHT, 0.2),
      freshness_weight: parseFloat(process.env.METRICS_FRESHNESS_WEIGHT, 0.1),
    },
    circuit_breaker: {
      failure_threshold: parseInteger(
        process.env.CIRCUIT_BREAKER_FAILURE_THRESHOLD,
        5
      ),
      cooldown_ms: parseInteger(process.env.CIRCUIT_BREAKER_COOLDOWN_MS, 10000),
      half_open_max_requests: parseInteger(
        process.env.CIRCUIT_BREAKER_HALF_OPEN_MAX_REQUESTS,
        1
      ),
    },
    gossip: {
      hint_ttl: parseInteger(process.env.GOSSIP_HINT_TTL, 60000),
      publish_interval: parseInteger(process.env.GOSSIP_PUBLISH_INTERVAL, 5000),
      decay_factor: parseFloat(process.env.GOSSIP_DECAY_FACTOR, 0.5),
    },
    env: process.env.NODE_ENV || 'development',
    node_env: process.env.NODE_ENV || 'development',
  };

  return config;
}

/**
 * Validate configuration values
 */
export function validateConfig(config?: Config): void {
  const cfg = config || loadConfig();

  // Validate weights sum to approximately 1.0
  const metricsSum =
    cfg.metrics.latency_weight +
    cfg.metrics.error_weight +
    cfg.metrics.timeout_weight +
    cfg.metrics.freshness_weight;

  if (Math.abs(metricsSum - 1.0) > 0.01) {
    throw new Error(`Metrics weights must sum to 1.0, got ${metricsSum}`);
  }

  // Validate ports are positive
  if (cfg.grape.dht_port <= 0 || cfg.grape.api_port <= 0) {
    throw new Error('Grape ports must be positive integers');
  }

  if (cfg.worker.port <= 0) {
    throw new Error('Worker port must be a positive integer');
  }

  // Validate timeouts are positive
  if (cfg.client.request_timeout <= 0) {
    throw new Error('Client request timeout must be positive');
  }

  // Validate circuit breaker settings
  if (cfg.circuit_breaker.failure_threshold <= 0) {
    throw new Error('Circuit breaker failure threshold must be positive');
  }

  if (cfg.circuit_breaker.cooldown_ms <= 0) {
    throw new Error('Circuit breaker cooldown must be positive');
  }
}

// Export singleton config instance
export const config = loadConfig();

// Export individual config sections for convenience
export const grape = config.grape;
export const worker = config.worker;
export const client = config.client;
export const metrics = config.metrics;
export const circuitBreaker = config.circuit_breaker;
export const gossip = config.gossip;

// Validate on import
validateConfig(config);
