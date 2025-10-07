/**
 * Logger plugin - demonstrates a simple service plugin
 * This plugin adds logging capabilities that other plugins can use.
 */

import { createServicePlugin } from '../core/plugin.js';

// Define the shape of our logger in the context
interface Logger {
  info: (message: string) => void;
  error: (message: string) => void;
  warn: (message: string) => void;
  debug: (message: string) => void;
}

// Create the logger plugin using our service plugin factory
export const loggerPlugin = createServicePlugin(
  'logger',
  'logger',
  (): Logger => ({
    info: (message: string) => console.log(`[INFO] ${new Date().toISOString()}: ${message}`),
    error: (message: string) => console.error(`[ERROR] ${new Date().toISOString()}: ${message}`),
    warn: (message: string) => console.warn(`[WARN] ${new Date().toISOString()}: ${message}`),
    debug: (message: string) => console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`),
  })
);

/**
 * Key concepts demonstrated:
 * - Service registration: Plugins can provide services to other plugins
 * - Dependency injection: The logger becomes available to all other plugins via context
 * - Separation of concerns: Logging is isolated in its own plugin
 */