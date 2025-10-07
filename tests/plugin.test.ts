import { describe, it, expect } from 'vitest';
import { createPlugin, createServicePlugin } from '../src/core/plugin.js';
import { Server } from '../src/core/server.js';

describe('Plugin System', () => {
  it('should create plugins with factory function', () => {
    const plugin = createPlugin('test', () => {});
    
    expect(plugin.name).toBe('test');
    expect(typeof plugin.setup).toBe('function');
  });

  it('should create service plugins', async () => {
    const servicePlugin = createServicePlugin(
      'service-test',
      'testService',
      () => 'service-value'
    );
    
    const server = new Server();
    server.use(servicePlugin);
    await server.initialize();
    
    expect(server.get('testService')).toBe('service-value');
  });

  it('should handle plugin dependencies', async () => {
    const loggerPlugin = createServicePlugin('logger', 'logger', () => ({
      log: (msg: string) => console.log(msg)
    }));
    
    const dependentPlugin = createPlugin('dependent', (server) => {
      const logger = server.get('logger');
      if (!logger) {
        throw new Error('Logger required');
      }
      server.set('dependentService', () => 'dependent-value');
    });
    
    const server = new Server();
    server.use(loggerPlugin).use(dependentPlugin);
    await server.initialize();
    
    expect(server.get('dependentService')).toBeDefined();
  });
});