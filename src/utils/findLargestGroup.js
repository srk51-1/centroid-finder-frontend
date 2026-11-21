export default function findLargestGroup(binary) {
    const height = binary.length;
    const width = binary[0].length;
  
    const visited = Array.from(
      { length: height },
      () => new Uint8Array(width)
    );
  
    let largest = null;
  
    for (let row = 0; row < height; row++) {
      for (let column = 0; column < width; column++) {
        if (binary[row][column] !== 1 || visited[row][column]) {
          continue;
        }
  
        const pending = [[row, column]];
        visited[row][column] = 1;
  
        let count = 0;
        let columnSum = 0;
        let rowSum = 0;
  
        while (pending.length > 0) {
          const [currentRow, currentColumn] = pending.pop();
  
          count++;
          columnSum += currentColumn;
          rowSum += currentRow;
  
          const neighbors = [
            [currentRow - 1, currentColumn],
            [currentRow + 1, currentColumn],
            [currentRow, currentColumn - 1],
            [currentRow, currentColumn + 1],
          ];
  
          for (const [nextRow, nextColumn] of neighbors) {
            if (
              nextRow >= 0 &&
              nextRow < height &&
              nextColumn >= 0 &&
              nextColumn < width &&
              binary[nextRow][nextColumn] === 1 &&
              !visited[nextRow][nextColumn]
            ) {
              visited[nextRow][nextColumn] = 1;
              pending.push([nextRow, nextColumn]);
            }
          }
        }
  
        const group = {
          size: count,
          x: Math.floor(columnSum / count),
          y: Math.floor(rowSum / count),
        };
  
        if (
          largest === null ||
          group.size > largest.size ||
          (group.size === largest.size && group.x > largest.x) ||
          (group.size === largest.size &&
            group.x === largest.x &&
            group.y > largest.y)
        ) {
          largest = group;
        }
      }
    }
  
    return largest;
  }