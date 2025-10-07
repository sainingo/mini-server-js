import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Server } from '../src/core/server.js';
import { createPlugin } from '../src/core/plugin.js';

describe('Server Core', () => {
  let server: Server;

  beforeEach(() => {
    server = new Server();
  });

  it('should register plugins', () => {
    const plugin = createPlugin('test', () => {});
    server.use(plugin);
    expect(server.getPluginNames()).toEqual(['test']);
  });

  it('should call plugin setup during initialization', async () => {
    const setupFn = vi.fn();
    const plugin = createPlugin('test', setupFn);
    
    server.use(plugin);
    await server.initialize();
    
    expect(setupFn).toHaveBeenCalledOnce();
    expect(setupFn).toHaveBeenCalledWith(server);
  });

  it('should set and get context values', () => {
    server.set('testKey', 'testValue');
    expect(server.get('testKey')).toBe('testValue');
  });

  it('should run beforeInit and afterInit hooks', async () => {
    const beforeHook = vi.fn();
    const afterHook = vi.fn();
    
    server.onBeforeInit(beforeHook).onAfterInit(afterHook);
    await server.initialize();
    
    expect(beforeHook).toHaveBeenCalledOnce();
    expect(afterHook).toHaveBeenCalledOnce();
  });

  it('should handle async plugin setup', async () => {
    let initialized = false;
    
    const asyncPlugin = createPlugin('async-plugin', async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
      initialized = true;
    });
    
    server.use(asyncPlugin);
    await server.initialize();
    
    expect(initialized).toBe(true);
  });

  it('should throw if plugin setup fails', async () => {
    const failingPlugin = createPlugin('failing-plugin', () => {
      throw new Error('Setup failed');
    });
    
    server.use(failingPlugin);
    
    await expect(server.initialize()).rejects.toThrow(
      'Plugin "failing-plugin" failed during setup: Setup failed'
    );
  });

  it('should prevent adding plugins after initialization', async () => {
    await server.initialize();
    
    const plugin = createPlugin('late-plugin', () => {});
    
    expect(() => server.use(plugin)).toThrow('Cannot add plugins after initialization');
  });
});