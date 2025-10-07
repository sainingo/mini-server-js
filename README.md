# MiniServerJS

A mini plugin-based server for learning advanced TypeScript concepts and architectural patterns.

## 🎯 Purpose

This project demonstrates the patterns behind real-world plugin-based systems like:
- Language servers (TypeScript, ESLint)
- Build tools (Webpack, Rollup)
- CLI frameworks
- Extension systems

## 🏗️ Architecture

- **Server Core**: Orchestrates plugins and lifecycle
- **Plugin System**: Extensible architecture with type safety
- **Context**: Shared typed state between plugins
- **Lifecycle Hooks**: Before/after initialization hooks

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Build the project
npm run build

# Run compiled version
npm start