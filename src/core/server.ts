/**
 * Basic, strongly-typed server core for MiniServerJS.
 * - Supports plugin registration via `use()`
 * - Supports typed `get`/`set` on a shared context
 * - Supports lifecycle hooks (before/after initialization)
 * - `initialize()` runs plugins in registration order and awaits any async setup
 */

export type MaybePromise<T> = T | Promise<T>;

// A setup function receives the server and may return void or a Promise<void>
export type PluginSetup<C extends Record<string, any>> = (server: Server<C>) => MaybePromise<void>;

export interface Plugin<C extends Record<string, any> = Record<string, any>> {
  name: string;
  setup: PluginSetup<C>;
}

// Hooks callbacks
type Hook = () => MaybePromise<void>;

export class Server<C extends Record<string, any> = Record<string, any>> {
  private plugins: Plugin<C>[] = [];
  private ctx: C;
  private beforeInitHooks: Hook[] = [];
  private afterInitHooks: Hook[] = [];
  private isInitialized = false;

  constructor(initialContext?: Partial<C>) {
    // Start with a shallow copy of any initial context provided
    // This allows dependency injection of services like logger, config, etc.
    this.ctx = (initialContext ? { ...initialContext } : {}) as C;
  }

  /**
   * Register a plugin. Returns `this` for chaining.
   * This is the core extension mechanism - plugins can add capabilities to the server.
   */
  use(plugin: Plugin<C>): this {
    if (this.isInitialized) {
      throw new Error('Cannot add plugins after initialization');
    }
    this.plugins.push(plugin);
    return this;
  }

  /**
   * Typed set into shared context. Plugins should namespace keys to avoid collisions.
   * This provides a type-safe way for plugins to share services and state.
   */
  set<K extends string & keyof any>(key: K, value: any): void {
    (this.ctx as any)[key] = value;
  }

  /**
   * Typed get from shared context. Returns `undefined` if the key does not exist.
   * This allows plugins to access services provided by other plugins.
   */
  get<K extends keyof C>(key: K): C[K] | undefined {
    return this.ctx[key];
  }

  /**
   * Register a hook that runs before plugin initialization.
   * Useful for setup that needs to happen before any plugins run.
   */
  onBeforeInit(fn: Hook): this {
    this.beforeInitHooks.push(fn);
    return this;
  }

  /**
   * Register a hook that runs after all plugins are initialized.
   * Useful for starting servers, emitting "ready" events, etc.
   */
  onAfterInit(fn: Hook): this {
    this.afterInitHooks.push(fn);
    return this;
  }

  /**
   * Initialize the server by running hooks and plugin setups in order.
   * This method is `async` because plugins can perform asynchronous initialization.
   * The order is: before hooks → plugin setups → after hooks
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      throw new Error('Server already initialized');
    }

    console.log('🚀 Starting server initialization...');

    // Run before hooks - these run before any plugins
    for (const h of this.beforeInitHooks) {
      await h();
    }

    // Run plugin setups in order of registration
    // This is where plugins register their functionality
    for (const plugin of this.plugins) {
      try {
        console.log(`🔧 Setting up plugin: ${plugin.name}`);
        await plugin.setup(this);
        console.log(`✅ Plugin ${plugin.name} setup complete`);
      } catch (err) {
        // In a real system, you'd gather diagnostics or fail fast depending on strategy.
        // For the learning project we'll just rethrow to make errors visible in tests.
        throw new Error(`Plugin "${plugin.name}" failed during setup: ${(err as Error).message}`);
      }
    }

    // Run after hooks - these run after all plugins are set up
    for (const h of this.afterInitHooks) {
      await h();
    }

    this.isInitialized = true;
    console.log('🎉 Server initialization complete!');
  }

  /**
   * Utility to list registered plugin names (useful for tests/debugging)
   */
  getPluginNames(): string[] {
    return this.plugins.map((p) => p.name);
  }

  /**
   * Check if server is initialized
   */
  getIsInitialized(): boolean {
    return this.isInitialized;
  }
}