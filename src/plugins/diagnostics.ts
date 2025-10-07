/**
 * Diagnostics plugin - demonstrates more complex plugin behavior
 * This plugin collects diagnostics and reports on server health.
 */

import { createPlugin } from '../core/plugin.js';

interface DiagnosticsContext {
  logger?: {
    info: (message: string) => void;
  };
  diagnostics?: {
    report: () => void;
    record: (pluginName: string, status: 'ok' | 'error', message?: string) => void;
  };
}

export const diagnosticsPlugin = createPlugin<DiagnosticsContext>('diagnostics', (server) => {
  const logger = server.get('logger');
  
  // Initialize diagnostics collection
  const diagnostics: Array<{
    pluginName: string;
    status: 'ok' | 'error';
    message?: string;
    timestamp: Date;
  }> = [];

  const diagnosticsService = {
    record: (pluginName: string, status: 'ok' | 'error', message?: string) => {
      diagnostics.push({
        pluginName,
        status,
        message,
        timestamp: new Date(),
      });
    },
    
    report: () => {
      const total = diagnostics.length;
      const errors = diagnostics.filter(d => d.status === 'error').length;
      const health = total === 0 ? 0 : ((total - errors) / total) * 100;
      
      logger?.info(`📊 Diagnostics Report:`);
      logger?.info(`   Total checks: ${total}`);
      logger?.info(`   Errors: ${errors}`);
      logger?.info(`   Health: ${health.toFixed(1)}%`);
      
      diagnostics.forEach(diag => {
        const symbol = diag.status === 'ok' ? '✅' : '❌';
        logger?.info(`   ${symbol} ${diag.pluginName}: ${diag.status}${diag.message ? ` - ${diag.message}` : ''}`);
      });
    }
  };

  // Register the diagnostics service
  server.set('diagnostics', diagnosticsService);
  
  // Record our own initialization
  diagnosticsService.record('diagnostics', 'ok', 'Diagnostics system ready');

  logger?.info('Diagnostics plugin initialized - ready to collect system health data');
});

/**
 * Key concepts demonstrated:
 * - Complex service patterns: Services can have multiple methods
 * - State management: The plugin maintains internal state (diagnostics array)
 * - Self-documenting: Records its own initialization status
 * - Utility services: Provides system-wide utilities
 */