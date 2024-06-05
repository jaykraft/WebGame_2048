document.addEventListener('DOMContentLoaded', () => {
    const size = 4;
    const cells = Array.from(document.querySelectorAll('.grid-cell'));
    const restartButton = document.getElementById('restart-button');
    const gameOverElement = document.getElementById('game-over');

    function createBoard() {
        cells.forEach(cell => {
            cell.innerHTML = '';
            cell.className = 'grid-cell';
        })
        generateNewTile();
        generateNewTile();
        updateBoard();
        gameOverElement.classList.add('hidden');
    }

    function generateNewTile() {
        let emptyCells = cells.filter(cell => cell.innerHTML === '');
        if (emptyCells.length > 0) {
            let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            randomCell.innerHTML = Math.random() < 0.9 ? 2 : 4;
            randomCell.classList.add(`tile-${randomCell.innerHTML}`);
        }
    }

    function updateBoard() {
        cells.forEach(cell => {
            cell.className = 'grid-cell';
            if (cell.innerHTML !== '') {
                cell.classList.add(`tile-${cell.innerHTML}`);
            }
        });
    }

    function move(direction) {
        let moved = false;
        for (let i = 0; i < size; i++) {
            let rowOrCol;
            switch (direction) {
                case 'left':
                    rowOrCol = cells.slice(i * size, i * size + size);
                    break;
                case 'right':
                    rowOrCol = cells.slice(i * size, i * size + size).reverse();
                    break;
                case 'up':
                    rowOrCol = cells.filter((_, index) => index % size === i);
                    break;
                case 'down':
                    rowOrCol = cells.filter((_, index) => index % size === i).reverse();
                    break;
            }
            moved = slideAndCombine(rowOrCol) || moved;
        }
        if (moved) {
            generateNewTile();
            updateBoard();
            if (checkGameOver()){
                gameOverElement.classList.remove('hidden');
            }
        }
    }

    function slideAndCombine(rowOrCol) {
        let moved = false;
        let arr = rowOrCol.map(cell => parseInt(cell.innerHTML) || 0);
        let filtered = arr.filter(val => val);
        let empty = Array(size - filtered.length).fill(0);
        arr = filtered.concat(empty);
        for (let i = 0; i < size - 1; i++) {
            if (arr[i] === arr[i + 1] && arr[i] !== 0) {
                arr[i] *= 2;
                arr[i + 1] = 0;
                moved = true;
            }
        }
        filtered = arr.filter(val => val);
        empty = Array(size - filtered.length).fill(0);
        arr = filtered.concat(empty);
        arr.forEach((val, index) => {
            if (rowOrCol[index].innerHTML != (val || '')) {
                rowOrCol[index].innerHTML = val || '';
                moved = true;
            }
        });
        return moved;
    }

    function handleKeydown(event) {
        if (!gameOverElement.classList.contains('hidden')) return;
        switch (event.key) {
            case 'ArrowLeft':
                move('left');
                break;
            case 'ArrowRight':
                move('right');
                break;
            case 'ArrowUp':
                move('up');
                break;
            case 'ArrowDown':
                move('down');
                break;
        }
    }

    function checkGameOver(){
        if (cells.some(cell => cell.innerHTML === '')) return false;
        for (let i = 0; i < size; i++){
            for (let j = 0; j < size - 1; j++){
                if (cells[i * size + j].innerHTML === cells[i * size + j + 1].innerHTML) return false;
                if (cells[j * size + i].innerHTML === cells[(j + 1) * size + i].innerHTML) return false;
            }
        }
        return true;
    }

    restartButton.addEventListener('click', createBoard);
    document.addEventListener('keydown', handleKeydown);
    createBoard();
});