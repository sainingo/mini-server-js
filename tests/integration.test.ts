import { describe, it, expect } from 'vitest';
import { Server } from '../src/core/server.js';
import { loggerPlugin } from '../src/plugins/logger.js';
import { greeterPlugin } from '../src/plugins/greeter.js';
import { diagnosticsPlugin } from '../src/plugins/diagnostics.js';

describe('Integration Tests', () => {
  it('should initialize all plugins together', async () => {
    const server = new Server();
    
    server
      .use(loggerPlugin)
      .use(greeterPlugin)
      .use(diagnosticsPlugin);
    
    await server.initialize();
    
    expect(server.getIsInitialized()).toBe(true);
    expect(server.getPluginNames()).toEqual(['logger', 'greeter', 'diagnostics']);
    
    // Test that services are available
    expect(server.get('logger')).toBeDefined();
    expect(server.get('greet')).toBeDefined();
    expect(server.get('diagnostics')).toBeDefined();
  });

  it('should handle plugin dependencies correctly', async () => {
    const server = new Server();
    
    // Note: greeter depends on logger, so logger must be registered first
    server.use(loggerPlugin).use(greeterPlugin);
    
    await server.initialize();
    
    const greet = server.get('greet');
    expect(greet).toBeDefined();
    
    // The greet function should work without errors
    expect(() => greet('Test User')).not.toThrow();
  });
});