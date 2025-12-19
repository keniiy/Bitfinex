declare module 'grenache-grape' {
  export interface GrapeOptions {
    dht_port: number;
    dht_bootstrap?: string[];
    api_port: number;
    dht_concurrency?: number;
    dht_maxTables?: number;
    dht_maxValues?: number;
    dht_peer_maxAge?: number;
    cache_maxAge?: number;
    dht_nodeLiveness?: number;
    check_maxPayloadSize?: number;
  }

  export interface AnnounceData {
    service?: string;
    port?: number;
    [key: string]: unknown;
  }

  export class Grape {
    constructor(options: GrapeOptions);
    start(): void;
    stop(callback?: () => void): void;
    on(event: 'ready', callback: () => void): void;
    on(event: 'node', callback: (node: string) => void): void;
    on(event: 'announce', callback: (announce: AnnounceData) => void): void;
    on(event: string, callback: (...args: unknown[]) => void): void;
  }
}
