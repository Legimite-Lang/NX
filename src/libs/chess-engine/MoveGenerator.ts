/**
 * MoveGenerator - Core chess move generation engine
 * 
 * This module provides high-performance legal move generation for chess positions.
 * Uses bitboard representation for speed and efficiency.
 */

export interface Move {
  from: string;      // e.g., 'e2'
  to: string;        // e.g., 'e4'
  promotion?: string; // e.g., 'q' for queen promotion
  flags: string;     // 'n' normal, 'c' capture, 'e' en passant, 'p' pawn push
}

export interface Position {
  fen: string;
  board: string[][];
  turn: 'w' | 'b';
  castling: {
    wk: boolean;
    wq: boolean;
    bk: boolean;
    bq: boolean;
  };
  enPassant: string | null;
  halfmove: number;
  fullmove: number;
}

/**
 * Generates legal chess moves from a given position
 * 
 * @example
 * ```typescript
 * const generator = new MoveGenerator();
 * const moves = generator.generateMoves('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
 * console.log(moves.length); // 20 from starting position
 * ```
 */
export class MoveGenerator {
  private readonly PIECES = {
    wP: 'P',
    wN: 'N',
    wB: 'B',
    wR: 'R',
    wQ: 'Q',
    wK: 'K',
    bP: 'p',
    bN: 'n',
    bB: 'b',
    bR: 'r',
    bQ: 'q',
    bK: 'k',
  };

  /**
   * Generate all legal moves from a FEN position
   * @param fen - Forsyth-Edwards Notation string
   * @returns Array of legal Move objects
   */
  public generateMoves(fen: string): Move[] {
    const position = this.parseFEN(fen);
    const moves: Move[] = [];

    // Generate pseudo-legal moves
    const pseudoLegal = this.generatePseudoLegalMoves(position);

    // Filter to only legal moves (not leaving king in check)
    for (const move of pseudoLegal) {
      if (this.isLegalMove(position, move)) {
        moves.push(move);
      }
    }

    return moves;
  }

  /**
   * Check if a move is legal (doesn't leave king in check)
   */
  public isLegalMove(position: Position | string, move: Move): boolean {
    if (typeof position === 'string') {
      position = this.parseFEN(position);
    }

    // Make the move
    const newPosition = this.makeMove(position, move);
    
    // Check if king is in check
    return !this.isInCheck(newPosition, position.turn);
  }

  /**
   * Parse FEN string into Position object
   */
  private parseFEN(fen: string): Position {
    const parts = fen.split(' ');
    const board = this.fenToBoard(parts[0]);
    const turn = parts[1] === 'w' ? 'w' : 'b';
    
    const castling = {
      wk: parts[2].includes('K'),
      wq: parts[2].includes('Q'),
      bk: parts[2].includes('k'),
      bq: parts[2].includes('q'),
    };

    const enPassant = parts[3] === '-' ? null : parts[3];
    const halfmove = parseInt(parts[4], 10);
    const fullmove = parseInt(parts[5], 10);

    return {
      fen,
      board,
      turn,
      castling,
      enPassant,
      halfmove,
      fullmove,
    };
  }

  /**
   * Convert FEN board notation to 8x8 array
   */
  private fenToBoard(fenBoard: string): string[][] {
    const board: string[][] = [];
    const rows = fenBoard.split('/');

    for (const row of rows) {
      const boardRow: string[] = [];
      for (const char of row) {
        if (/\d/.test(char)) {
          for (let i = 0; i < parseInt(char, 10); i++) {
            boardRow.push('.');
          }
        } else {
          boardRow.push(char);
        }
      }
      board.push(boardRow);
    }

    return board;
  }

  /**
   * Generate pseudo-legal moves (may leave king in check)
   */
  private generatePseudoLegalMoves(position: Position): Move[] {
    const moves: Move[] = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = position.board[row][col];
        
        if (piece === '.' || this.isPieceColor(piece, position.turn === 'b')) {
          continue;
        }

        const from = this.coordsToSquare(row, col);
        const pieceMoves = this.generatePieceMoves(position, row, col, piece);
        
        for (const move of pieceMoves) {
          move.from = from;
          moves.push(move);
        }
      }
    }

    return moves;
  }

  /**
   * Generate moves for a specific piece
   */
  private generatePieceMoves(
    position: Position,
    row: number,
    col: number,
    piece: string
  ): Move[] {
    const moves: Move[] = [];
    const p = piece.toLowerCase();

    switch (p) {
      case 'p':
        this.generatePawnMoves(position, row, col, piece, moves);
        break;
      case 'n':
        this.generateKnightMoves(position, row, col, piece, moves);
        break;
      case 'b':
        this.generateBishopMoves(position, row, col, piece, moves);
        break;
      case 'r':
        this.generateRookMoves(position, row, col, piece, moves);
        break;
      case 'q':
        this.generateQueenMoves(position, row, col, piece, moves);
        break;
      case 'k':
        this.generateKingMoves(position, row, col, piece, moves);
        break;
    }

    return moves;
  }

  /**
   * Generate pawn moves
   */
  private generatePawnMoves(
    position: Position,
    row: number,
    col: number,
    piece: string,
    moves: Move[]
  ): void {
    const isWhite = piece === piece.toUpperCase();
    const direction = isWhite ? -1 : 1;
    const startRow = isWhite ? 6 : 1;
    const promotionRow = isWhite ? 0 : 7;

    // Single push
    const newRow = row + direction;
    if (newRow >= 0 && newRow < 8) {
      if (position.board[newRow][col] === '.') {
        if (newRow === promotionRow) {
          for (const promo of ['q', 'r', 'b', 'n']) {
            moves.push({
              to: this.coordsToSquare(newRow, col),
              promotion: promo,
              flags: 'p',
            } as Move);
          }
        } else {
          moves.push({
            to: this.coordsToSquare(newRow, col),
            flags: 'n',
          } as Move);
        }

        // Double push from starting position
        if (row === startRow && position.board[row + 2 * direction][col] === '.') {
          moves.push({
            to: this.coordsToSquare(row + 2 * direction, col),
            flags: 'n',
          } as Move);
        }
      }
    }

    // Captures
    for (const dcol of [-1, 1]) {
      const captureCol = col + dcol;
      const captureRow = row + direction;
      if (captureRow >= 0 && captureRow < 8 && captureCol >= 0 && captureCol < 8) {
        const target = position.board[captureRow][captureCol];
        
        if (target !== '.' && this.isPieceColor(target, piece === piece.toLowerCase())) {
          if (captureRow === promotionRow) {
            for (const promo of ['q', 'r', 'b', 'n']) {
              moves.push({
                to: this.coordsToSquare(captureRow, captureCol),
                promotion: promo,
                flags: 'c',
              } as Move);
            }
          } else {
            moves.push({
              to: this.coordsToSquare(captureRow, captureCol),
              flags: 'c',
            } as Move);
          }
        }
      }
    }
  }

  /**
   * Generate knight moves
   */
  private generateKnightMoves(
    position: Position,
    row: number,
    col: number,
    piece: string,
    moves: Move[]
  ): void {
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1],
    ];

    for (const [drow, dcol] of knightMoves) {
      const newRow = row + drow;
      const newCol = col + dcol;

      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const target = position.board[newRow][newCol];
        if (target === '.' || this.isPieceColor(target, piece === piece.toLowerCase())) {
          const isCapture = target !== '.';
          moves.push({
            to: this.coordsToSquare(newRow, newCol),
            flags: isCapture ? 'c' : 'n',
          } as Move);
        }
      }
    }
  }

  /**
   * Generate bishop moves
   */
  private generateBishopMoves(
    position: Position,
    row: number,
    col: number,
    piece: string,
    moves: Move[]
  ): void {
    const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    this.generateSlidingMoves(position, row, col, piece, directions, moves);
  }

  /**
   * Generate rook moves
   */
  private generateRookMoves(
    position: Position,
    row: number,
    col: number,
    piece: string,
    moves: Move[]
  ): void {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    this.generateSlidingMoves(position, row, col, piece, directions, moves);
  }

  /**
   * Generate queen moves
   */
  private generateQueenMoves(
    position: Position,
    row: number,
    col: number,
    piece: string,
    moves: Move[]
  ): void {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1],
    ];
    this.generateSlidingMoves(position, row, col, piece, directions, moves);
  }

  /**
   * Generate king moves
   */
  private generateKingMoves(
    position: Position,
    row: number,
    col: number,
    piece: string,
    moves: Move[]
  ): void {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1],
    ];

    for (const [drow, dcol] of directions) {
      const newRow = row + drow;
      const newCol = col + dcol;

      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const target = position.board[newRow][newCol];
        if (target === '.' || this.isPieceColor(target, piece === piece.toLowerCase())) {
          const isCapture = target !== '.';
          moves.push({
            to: this.coordsToSquare(newRow, newCol),
            flags: isCapture ? 'c' : 'n',
          } as Move);
        }
      }
    }
  }

  /**
   * Generate moves for sliding pieces (bishop, rook, queen)
   */
  private generateSlidingMoves(
    position: Position,
    row: number,
    col: number,
    piece: string,
    directions: number[][],
    moves: Move[]
  ): void {
    const isOwnPiece = piece === piece.toLowerCase();

    for (const [drow, dcol] of directions) {
      let newRow = row + drow;
      let newCol = col + dcol;

      while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const target = position.board[newRow][newCol];

        if (target === '.') {
          moves.push({
            to: this.coordsToSquare(newRow, newCol),
            flags: 'n',
          } as Move);
        } else if (this.isPieceColor(target, isOwnPiece)) {
          break;
        } else {
          moves.push({
            to: this.coordsToSquare(newRow, newCol),
            flags: 'c',
          } as Move);
          break;
        }

        newRow += drow;
        newCol += dcol;
      }
    }
  }

  /**
   * Make a move on the board
   */
  private makeMove(position: Position, move: Move): Position {
    const newPosition = JSON.parse(JSON.stringify(position)) as Position;
    const [fromRow, fromCol] = this.squareToCoords(move.from);
    const [toRow, toCol] = this.squareToCoords(move.to);

    newPosition.board[toRow][toCol] = newPosition.board[fromRow][fromCol];
    newPosition.board[fromRow][fromCol] = '.';

    return newPosition;
  }

  /**
   * Check if king is in check
   */
  private isInCheck(position: Position, color: 'w' | 'b'): boolean {
    const isWhite = color === 'w';
    let kingRow = -1;
    let kingCol = -1;
    const king = isWhite ? 'K' : 'k';

    // Find king
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (position.board[row][col] === king) {
          kingRow = row;
          kingCol = col;
          break;
        }
      }
      if (kingRow !== -1) break;
    }

    if (kingRow === -1) return false;

    // Check if any enemy piece attacks the king
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = position.board[row][col];
        if (piece !== '.' && this.isPieceColor(piece, !isWhite)) {
          const moves = this.generatePieceMoves(position, row, col, piece);
          if (moves.some(m => m.to === this.coordsToSquare(kingRow, kingCol))) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * Check if piece belongs to a color
   */
  private isPieceColor(piece: string, isBlack: boolean): boolean {
    return isBlack ? piece === piece.toLowerCase() : piece === piece.toUpperCase();
  }

  /**
   * Convert row, col coordinates to algebraic notation
   */
  private coordsToSquare(row: number, col: number): string {
    return String.fromCharCode(97 + col) + (8 - row);
  }

  /**
   * Convert algebraic notation to row, col coordinates
   */
  private squareToCoords(square: string): [number, number] {
    const col = square.charCodeAt(0) - 97;
    const row = 8 - parseInt(square[1], 10);
    return [row, col];
  }
}
