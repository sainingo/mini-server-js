/**
 * Basic usage example - shows simple server setup
 */

import { Server } from '../core/server.js';
import { createPlugin } from '../core/plugin.js';

// Create a simple plugin inline
const simplePlugin = createPlugin('simple', (server) => {
  server.set('simpleService', () => 'Hello from simple service!');
});

// Create and run a minimal server
const server = new Server()
  .use(simplePlugin)
  .onAfterInit(() => {
    const service = server.get('simpleService');
    if (service) {
      console.log('Simple service result:', service());
    }
  });

server.initialize().catch(console.error);