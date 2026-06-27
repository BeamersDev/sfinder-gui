// Types matching tetris-fumen library API
// tetris-fumen exports: Field, Mino, Page (from decoder), EncodePage (from encoder), decoder, encoder
// PieceType: 'I' | 'L' | 'O' | 'Z' | 'T' | 'J' | 'S' | 'X' | '_'
// RotationType: 'spawn' | 'right' | 'reverse' | 'left'

export type CellType = 'T' | 'I' | 'O' | 'L' | 'J' | 'S' | 'Z' | 'X' | '_';

export type RotationType = 'spawn' | 'right' | 'reverse' | 'left';

export type ToolType = 'paint' | 'erase';

export interface PaintTool {
  type: 'paint';
  pieceType: CellType;
  rotation: RotationType;
}

export interface EraseTool {
  type: 'erase';
}

export type SelectedTool = PaintTool | EraseTool;

export interface PageFlags {
  colorize: boolean;
  lock: boolean;
  mirror: boolean;
  quiz: boolean;
  rise: boolean;
}

// PageMeta wraps tetris-fumen Page for our editor
// We store the Field directly and sync with decode/encode
export interface PageMeta {
  // Field is stored as a tetris-fumen Field instance
  // We manage this through fumenStore, not serialized
  fieldString: string;  // String representation: Field.str()
  comment: string;
  flags: PageFlags;
  operationString: string; // Encoded operation for encode/decode
  operationType?: string;   // PieceType character
  operationRotation?: string; // RotationType
  operationX?: number;
  operationY?: number;
}

export interface FumenSnapshot {
  fumenString: string;
  currentPageIndex: number;
}
