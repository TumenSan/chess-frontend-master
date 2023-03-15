export const getRowColDiff = (start, end) => {
    const startRow = 8 - Math.floor(start / 8);
    const startCol = (start % 8) + 1;
    const endRow = 8 - Math.floor(end / 8);
    const endCol = (end % 8) + 1;
    
    return { rowDiff: endRow - startRow, colDiff: endCol - startCol }
}

/*
export const getPawnTaking = (start, end, opponentFigure) => {
    const startRow = 8 - Math.floor(start / 8);
    const startCol = (start % 8) + 1;
    const endRow = 8 - Math.floor(end / 8);
    const endCol = (end % 8) + 1;
    
    return { rowDiff: endRow - startRow, colDiff: endCol - startCol }
}

export const getPawnTakingPass = (start, end, opponentFigure, moveStatus) => {
    const startRow = 8 - Math.floor(start / 8);
    const startCol = (start % 8) + 1;
    const endRow = 8 - Math.floor(end / 8);
    const endCol = (end % 8) + 1;
    
    return { rowDiff: endRow - startRow, colDiff: endCol - startCol }
}

export const getPawnLastLine = (start, end) => {
    const startRow = 8 - Math.floor(start / 8);
    const startCol = (start % 8) + 1;
    const endRow = 8 - Math.floor(end / 8);
    const endCol = (end % 8) + 1;
    
    return { rowDiff: endRow - startRow, colDiff: endCol - startCol }
}
*/