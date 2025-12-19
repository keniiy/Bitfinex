import { Grape } from 'grenache-grape';
import { config, grape, validateConfig } from '../config/index.js';

// Validate configuration
validateConfig();

// Allow command line override for ports (for multiple grapes)
const dhtPort = parseInt(process.argv[2]) || grape.dht_port;
const apiPort = parseInt(process.argv[3]) || grape.api_port;
const bootstrap = process.argv[4]
  ? process.argv[4].split(',').map((s) => s.trim())
  : grape.bootstrap;

console.log('🍇 Starting Grape...');
console.log(`   Environment: ${config.env}`);
console.log(`   DHT Port: ${dhtPort}`);
console.log(`   API Port: ${apiPort}`);
console.log(
  `   Bootstrap: ${
    bootstrap.length > 0 ? bootstrap.join(', ') : 'none (first node)'
  }`
);
console.log(`   Concurrency: ${grape.concurrency}`);

const grapeInstance = new Grape({
  dht_port: dhtPort,
  dht_bootstrap: bootstrap,
  api_port: apiPort,
  dht_concurrency: grape.concurrency,
});

grapeInstance.start();

grapeInstance.on('ready', () => {
  console.log('✅ Grape is ready!');
  console.log(`   DHT listening on port ${dhtPort}`);
  console.log(`   API listening on port ${apiPort}`);
  console.log('\n   Press Ctrl+C to stop');
});

grapeInstance.on('node', (node: string) => {
  console.log(`🔗 Connected to node: ${node}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Grape...');
  grapeInstance.stop(() => {
    console.log('✅ Grape stopped');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down Grape...');
  grapeInstance.stop(() => {
    process.exit(0);
  });
});
