# NX - Chess Next Move Generator

A high-performance chess move generator and analysis engine built with TypeScript. NX provides fast, accurate move generation for chess applications with support for multiple analysis engines.

## Features

- **Fast Move Generation**: Optimized algorithms for legal move generation
- **Multi-Engine Support**: Integrations with Stockfish and Leela Chess Zero
- **Game Analysis**: Review games, analyze positions, and generate insights
- **Position Builder**: Create and analyze custom chess positions
- **FEN/PGN Support**: Import and export positions in standard formats
- **Type-Safe**: Built with TypeScript for reliability and developer experience

## Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Chess engine binaries (Stockfish or Leela Chess recommended)

### Setup

```bash
# Clone the repository
git clone https://github.com/Legimite-Lang/NX.git
cd NX

# Install dependencies
npm install

# Set up chess engines (optional but recommended)
npm run setup:engines
```

## Usage

### Basic Move Generation

```typescript
import { MoveGenerator } from './src/libs/chess-engine/MoveGenerator';

// Initialize engine
const generator = new MoveGenerator();

// Generate moves from standard position
const startingFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const moves = generator.generateMoves(startingFEN);

console.log(`Generated ${moves.length} legal moves`);
moves.forEach(move => console.log(`${move.from} -> ${move.to}`));
```

## Project Structure

```
NX/
├── src/
│   ├── libs/
│   │   ├── chess-engine/
│   │   │   ├── MoveGenerator.ts      # Core move generation engine
│   │   │   ├── EngineInterface.ts    # Abstract engine interface
│   │   │   ├── Stockfish.ts
│   │   │   └── LeelaChess.ts
│   │   └── utils/
│   └── tests/
│       ├── unit/
│       │   └── MoveGenerator.test.ts
│       └── integration/
├── .github/workflows/
│   ├── test.yml
│   └── codeql.yml
└── CONTRIBUTING.md
```

## Development

### Run Tests

```bash
npm test
npm test -- --coverage
```

### Build

```bash
npm run build
```

### Linting

```bash
npm run lint
npm run lint -- --fix
```

## Performance Benchmarks

- **Move Generation**: ~500,000 positions/second
- **Legal Move Filtering**: ~100,000 positions/second

## Contribution Guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## License

MIT License - see LICENSE file for details.

---

**Made with ♟️ by Legimite-Lang**
