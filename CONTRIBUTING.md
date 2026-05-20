# Contributing to NX

Thank you for your interest in contributing to NX! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn
- Git
- Basic understanding of TypeScript and chess concepts

### Setup Development Environment

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/NX.git
cd NX

# Add upstream remote
git remote add upstream https://github.com/Legimite-Lang/NX.git

# Install dependencies
npm install

# Verify setup
npm test
npm run lint
```

## Development Workflow

### Creating a Feature Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/my-feature
```

### Branch Naming Convention

- Features: `feature/descriptive-name`
- Bug fixes: `fix/issue-description`
- Docs: `docs/update-description`
- Performance: `perf/improvement-description`

### Making Changes

1. **Write your code** following the code style guide
2. **Write tests** for your changes (minimum 80% coverage)
3. **Run tests locally**:
   ```bash
   npm test
   npm run lint
   npm run build
   ```
4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: Add descriptive commit message"
   ```

## Code Style Guide

### TypeScript/JavaScript

```typescript
// ✅ Good
export function generateMoves(fen: string): Move[] {
  /**
   * Generate all legal moves from a position
   * @param fen - The position in FEN notation
   * @returns Array of legal moves
   */
  const moves: Move[] = [];
  return moves;
}

// ❌ Bad
function generateMoves(fen){
  let moves = []
  return moves
}
```

### Naming Conventions

- **Classes**: PascalCase (e.g., `MoveGenerator`)
- **Functions**: camelCase (e.g., `generateMoves`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_DEPTH`)
- **Interfaces**: PascalCase (e.g., `Position`)
- **Private members**: Prefix with underscore (e.g., `_privateMethod()`)

## Testing

### Test File Structure

Tests should be placed alongside the code they test:

```
src/
├── libs/
│   ├── chess-engine/
│   │   ├── MoveGenerator.ts
│   │   └── MoveGenerator.test.ts
```

### Writing Tests

```typescript
import { describe, it, expect, beforeEach } from '@jest/globals';
import { MoveGenerator } from './MoveGenerator';

describe('MoveGenerator', () => {
  let generator: MoveGenerator;

  beforeEach(() => {
    generator = new MoveGenerator();
  });

  it('should generate 20 legal moves from starting position', () => {
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const moves = generator.generateMoves(fen);
    expect(moves).toHaveLength(20);
  });
});
```

### Test Coverage Requirements

- **Minimum 80%** code coverage for new code
- **100%** coverage for critical functions
- Check coverage: `npm test -- --coverage`

## Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Dependency updates

### Examples

```bash
git commit -m "feat(engine): add depth analysis parameter"
git commit -m "fix(generator): handle en passant capture"
git commit -m "docs: update installation instructions"
git commit -m "test(generator): increase coverage to 85%"
```

## Submitting Changes

### Creating a Pull Request

1. **Push your branch**:
   ```bash
   git push origin feature/my-feature
   ```

2. **Open a Pull Request** with:
   - Clear title describing your changes
   - Detailed description of what and why
   - Reference to related issues (e.g., "Fixes #123")

3. **PR Checklist**:
   ```markdown
   - [ ] Tests pass locally
   - [ ] Code follows style guidelines
   - [ ] Self-reviewed changes
   - [ ] Documentation updated
   - [ ] Coverage maintained above 80%
   - [ ] No breaking changes
   ```

### Review Process

- At least one maintainer approval required
- CI/CD pipeline must pass
- Address review feedback promptly

## Reporting Issues

### Bug Reports

Include:
- Clear, descriptive title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (OS, Node version)

### Feature Requests

Include:
- Clear description of the feature
- Why it would be useful
- Possible implementation approaches

## Project Standards

### Performance Requirements

- Move generation: >400,000 positions/second
- Legal move filtering: >80,000 positions/second
- No memory leaks in long-running sessions

### Security

- No hardcoded secrets or API keys
- Validate all external inputs
- Report security issues privately to maintainers

## Getting Help

- **Documentation**: Check [README.md](README.md)
- **Issues**: Search [GitHub Issues](https://github.com/Legimite-Lang/NX/issues)
- **Discussions**: Ask in [GitHub Discussions](https://github.com/Legimite-Lang/NX/discussions)

Thank you for contributing to NX! 🎉
