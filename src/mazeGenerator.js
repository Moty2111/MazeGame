function generateMaze(rows, cols) {
  const grid = [];
  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      grid[r][c] = {
        top: true,
        right: true,
        bottom: true,
        left: true,
        visited: false,
      };
    }
  }

  const stack = [];
  const start = { row: 0, col: 0 };
  grid[0][0].visited = true;
  stack.push(start);

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = getUnvisitedNeighbors(grid, current, rows, cols);

    if (neighbors.length === 0) {
      stack.pop();
    } else {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      removeWall(grid, current, next);
      grid[next.row][next.col].visited = true;
      stack.push(next);
    }
  }

  addWallJitter(grid, rows, cols);
  return grid;
}

function getUnvisitedNeighbors(grid, cell, rows, cols) {
  const { row, col } = cell;
  const neighbors = [];
  if (row > 0 && !grid[row - 1][col].visited) neighbors.push({ row: row - 1, col });
  if (row < rows - 1 && !grid[row + 1][col].visited) neighbors.push({ row: row + 1, col });
  if (col > 0 && !grid[row][col - 1].visited) neighbors.push({ row, col: col - 1 });
  if (col < cols - 1 && !grid[row][col + 1].visited) neighbors.push({ row, col: col + 1 });
  return neighbors;
}

function removeWall(grid, a, b) {
  const dr = a.row - b.row;
  const dc = a.col - b.col;

  if (dr === 1) {
    grid[a.row][a.col].top = false;
    grid[b.row][b.col].bottom = false;
  } else if (dr === -1) {
    grid[a.row][a.col].bottom = false;
    grid[b.row][b.col].top = false;
  }

  if (dc === 1) {
    grid[a.row][a.col].left = false;
    grid[b.row][b.col].right = false;
  } else if (dc === -1) {
    grid[a.row][a.col].right = false;
    grid[b.row][b.col].left = false;
  }
}

function addWallJitter(grid, rows, cols) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = grid[r][c];
      cell.jitter = {
        top: r > 0 ? null : {
          x1: (Math.random() - 0.5) * 2,
          y1: (Math.random() - 0.5) * 1.5,
          x2: (Math.random() - 0.5) * 2,
          y2: (Math.random() - 0.5) * 1.5,
        },
        bottom: {
          x1: (Math.random() - 0.5) * 2,
          y1: (Math.random() - 0.5) * 1.5,
          x2: (Math.random() - 0.5) * 2,
          y2: (Math.random() - 0.5) * 1.5,
        },
        left: c > 0 ? null : {
          x1: (Math.random() - 0.5) * 1.5,
          y1: (Math.random() - 0.5) * 2,
          x2: (Math.random() - 0.5) * 1.5,
          y2: (Math.random() - 0.5) * 2,
        },
        right: {
          x1: (Math.random() - 0.5) * 1.5,
          y1: (Math.random() - 0.5) * 2,
          x2: (Math.random() - 0.5) * 1.5,
          y2: (Math.random() - 0.5) * 2,
        },
      };
    }
  }
}

export { generateMaze };
