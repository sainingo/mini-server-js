/**
 * Greeter plugin - demonstrates plugin dependencies and context usage
 * This plugin depends on the logger plugin and uses its service.
 */

import { createPlugin } from '../core/plugin.js';

interface GreeterContext {
  logger?: {
    info: (message: string) => void;
  };
}

export const greeterPlugin = createPlugin<GreeterContext>('greeter', (server) => {
  // Get the logger from context - this creates a dependency on the logger plugin
  const logger = server.get('logger');
  
  if (!logger) {
    throw new Error('Greeter plugin requires logger plugin to be registered first!');
  }

  // Add a greeting service to the context
  server.set('greet', (name: string) => {
    const message = `Hello, ${name}!`;
    logger.info(message);
    return message;
  });

  // Demonstrate that plugins can also perform setup actions
  logger.info('Greeter plugin initialized! Ready to greet users.');
});

/**
 * Key concepts demonstrated:
 * - Plugin dependencies: This plugin requires the logger plugin
 * - Context consumption: Uses services from other plugins
 * - Context provision: Adds its own service to the context
 * - Error handling: Validates dependencies during setup
 */