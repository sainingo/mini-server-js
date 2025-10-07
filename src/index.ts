/**
 * Main entry point - demonstrates wiring up the server with plugins
 * This shows the complete lifecycle from creation to initialization.
 */

import { Server } from './core/server.js';
import { loggerPlugin } from './plugins/logger.js';
import { greeterPlugin } from './plugins/greeter.js';
import { diagnosticsPlugin } from './plugins/diagnostics.js';

// Create server instance
const server = new Server();

// Register plugins in order - dependencies first!
server
  .use(loggerPlugin)
  .use(greeterPlugin)
  .use(diagnosticsPlugin);

// Add lifecycle hooks
server
  .onBeforeInit(() => {
    console.log('🔨 Beginning server initialization...');
  })
  .onAfterInit(async () => {
    console.log('✨ All plugins initialized!');
    
    // Demonstrate using services after initialization
    const logger = server.get('logger');
    const greet = server.get('greet');
    const diagnostics = server.get('diagnostics');
    
    if (greet && logger) {
      greet('MiniServer User');
    }
    
    if (diagnostics) {
      // Record some mock diagnostics
      diagnostics.record('system', 'ok', 'Server started successfully');
      diagnostics.record('network', 'ok', 'Port 3000 available');
      diagnostics.report();
    }
    
    logger?.info('Server is ready to handle requests!');
  });

// Initialize the server - this kicks off the whole process
async function main() {
  try {
    await server.initialize();
    
    // Demonstrate the server is working
    const greet = server.get('greet');
    if (greet) {
      console.log('\n--- Testing Services ---');
      greet('World');
    }
    
  } catch (error) {
    console.error('❌ Failed to initialize server:', error);
    process.exit(1);
  }
}

// Only run main if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { server };