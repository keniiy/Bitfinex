export interface GrapeConfig {
  dht_port: number;
  api_port: number;
  bootstrap: string[];
  concurrency: number;
}

export interface WorkerConfig {
  service_name: string;
  port: number;
  announce_interval: number;
}

export interface ClientConfig {
  request_timeout: number;
  error_weight: number;
  timeout_weight: number;
  freshness_weight: number;
}

export interface MetricsConfig {
  latency_weight: number;
  error_weight: number;
  timeout_weight: number;
  freshness_weight: number;
}

export interface CircuitBreakerConfig {
  failure_threshold: number;
  cooldown_ms: number;
  half_open_max_requests: number;
}

export interface GossipConfig {
  hint_ttl: number;
  publish_interval: number;
  decay_factor: number;
}

export interface Config {
  grape: GrapeConfig;
  worker: WorkerConfig;
  client: ClientConfig;
  metrics: MetricsConfig;
  circuit_breaker: CircuitBreakerConfig;
  gossip: GossipConfig;
  env: string;
  node_env: string;
}
