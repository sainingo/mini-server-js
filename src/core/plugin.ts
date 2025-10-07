/**
 * Plugin factory - creates plugins with proper typing
 * This factory function helps create plugins with type safety and reduces boilerplate.
 */

import { Plugin } from './server.js';

/**
 * Creates a plugin with the given name and setup function.
 * This is a factory function - a common pattern in plugin systems that
 * makes plugin creation more ergonomic and type-safe.
 */
export function createPlugin<C extends Record<string, any>>(
  name: string,
  setup: (server: import('./server.js').Server<C>) => void | Promise<void>
): Plugin<C> {
  return {
    name,
    setup,
  };
}

/**
 * Creates a plugin that adds a service to the context.
 * This demonstrates how you can create specialized factory functions
 * for different types of plugins.
 */
export function createServicePlugin<C extends Record<string, any>, K extends string>(
  name: string,
  serviceKey: K,
  serviceFactory: (server: import('./server.js').Server<C>) => any
): Plugin<C> {
  return createPlugin(name, (server) => {
    const service = serviceFactory(server);
    server.set(serviceKey, service);
  });
}