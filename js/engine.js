/**
 * Premium Sliding Puzzle Engine
 * Multi-tile sliding with smooth 60FPS animation
 * Supports multiple game modes (Classic, Snake, Spiral, Upside Down)
 */

class SlidingEngine {
    constructor(boardElement) {
        this.board = boardElement;
        this.size = 4;
        this.mode = 'Classic';
        this.tiles = [];
        this.emptyPos = { x: 3, y: 3 };
        this.tileSize = 0;
        this.isDragging = false;
        this.gameActive = true;
        
        // Move history for undo/redo
        this.moveHistory = [];
        this.currentMoveIndex = -1;
        this.moveCount = 0;
        
        // Drag state
        this.dragData = {
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            axis: null,
            affectedTiles: [],
            direction: 0,
            maxDelta: 0,
            startTime: 0
        };

        this.setupEvents();
        this.animationFrameId = null;
    }

    init(size, mode = 'Classic') {
        this.size = size;
        this.mode = mode;
        this.board.innerHTML = '';
        this.board.style.setProperty('--grid-size', size);
        this.tiles = [];
        this.moveHistory = [];
        this.currentMoveIndex = -1;
        this.moveCount = 0;
        this.gameActive = true;
        
        this.emptyPos = { x: size - 1, y: size - 1 };
        
        const rect = this.board.getBoundingClientRect();
        const padding = parseInt(getComputedStyle(this.board).paddingLeft);
        const gap = parseInt(getComputedStyle(this.board).gap);
        this.tileSize = (rect.width - (padding * 2) - (gap * (size - 1))) / size;

        // Create slots and tiles based on mode
        const positions = this.generatePositions();
        
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                this.createSlot(x, y);
                if (x === size - 1 && y === size - 1) continue;
                
                const idx = this.mode === 'Classic' 
                    ? (y * size) + x + 1
                    : positions[y * size + x];
                
                this.createTile(x, y, idx);
            }
        }

        this.startAnimation();
    }

    generatePositions() {
        const size = this.size;
        const total = size * size - 1;
        const positions = [];

        if (this.mode === 'Snake') {
            let num = 1;
            for (let y = 0; y < size; y++) {
                if (y % 2 === 0) {
                    for (let x = 0; x < size; x++) {
                        positions[y * size + x] = num++;
                    }
                } else {
                    for (let x = size - 1; x >= 0; x--) {
                        positions[y * size + x] = num++;
                    }
                }
            }
        } else if (this.mode === 'Spiral') {
            let num = 1;
            let top = 0, bottom = size - 1, left = 0, right = size - 1;
            
            while (top <= bottom && left <= right) {
                for (let x = left; x <= right; x++) {
                    positions[top * size + x] = num++;
                }
                top++;
                
                for (let y = top; y <= bottom; y++) {
                    positions[y * size + right] = num++;
                }
                right--;
                
                if (top <= bottom) {
                    for (let x = right; x >= left; x--) {
                        positions[bottom * size + x] = num++;
                    }
                    bottom--;
                }
                
                if (left <= right) {
                    for (let y = bottom; y >= top; y--) {
                        positions[y * size + left] = num++;
                    }
                    left++;
                }
            }
        } else if (this.mode === 'Upside Down') {
            let num = total;
            for (let i = 0; i < total; i++) {
                positions[i] = num--;
            }
        } else {
            for (let i = 0; i < total; i++) {
                positions[i] = i + 1;
            }
        }

        return positions;
    }

    createSlot(x, y) {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.style.width = `${this.tileSize}px`;
        slot.style.height = `${this.tileSize}px`;
        const pos = this.getTilePosition(x, y);
        slot.style.left = `${pos.left}px`;
        slot.style.top = `${pos.top}px`;
        this.board.appendChild(slot);
    }

    createTile(x, y, number) {
        const el = document.createElement('div');
        el.className = 'tile';
        el.style.width = `${this.tileSize}px`;
        el.style.height = `${this.tileSize}px`;
        el.dataset.number = number;

        const tile = {
            x, y, number,
            el,
            offsetX: 0,
            offsetY: 0,
            currentVisualX: 0,
            currentVisualY: 0
        };

        const basePos = this.getTilePosition(x, y);
        tile.currentVisualX = basePos.left;
        tile.currentVisualY = basePos.top;
        el.style.transform = `translate3d(${tile.currentVisualX}px, ${tile.currentVisualY}px, 0)`;

        this.tiles.push(tile);
        this.board.appendChild(el);
    }

    getTilePosition(x, y) {
        const gap = parseInt(getComputedStyle(this.board).gap);
        const padding = parseInt(getComputedStyle(this.board).paddingLeft);
        return {
            left: padding + x * (this.tileSize + gap),
            top: padding + y * (this.tileSize + gap)
        };
    }

    setupEvents() {
        this.board.addEventListener('pointerdown', this.onPointerDown.bind(this));
        window.addEventListener('pointermove', this.onPointerMove.bind(this));
        window.addEventListener('pointerup', this.onPointerUp.bind(this));
        window.addEventListener('pointercancel', this.onPointerUp.bind(this));
    }

    onPointerDown(e) {
        if (!this.gameActive) return;
        
        const tileEl = e.target.closest('.tile');
        if (!tileEl) return;

        const tile = this.tiles.find(t => t.el === tileEl);
        if (!tile) return;

        const canMoveX = tile.y === this.emptyPos.y;
        const canMoveY = tile.x === this.emptyPos.x;

        if (!canMoveX && !canMoveY) return;

        this.isDragging = true;
        this.dragData = {
            startX: e.clientX,
            startY: e.clientY,
            currentX: e.clientX,
            currentY: e.clientY,
            axis: null,
            startTime: performance.now(),
            affectedTiles: this.getAffectedTiles(tile),
            maxDelta: this.tileSize + parseInt(getComputedStyle(this.board).gap)
        };

        if (canMoveX) {
            this.dragData.axis = 'x';
            this.dragData.direction = tile.x < this.emptyPos.x ? 1 : -1;
        } else {
            this.dragData.axis = 'y';
            this.dragData.direction = tile.y < this.emptyPos.y ? 1 : -1;
        }

        tileEl.setPointerCapture(e.pointerId);
    }

    getAffectedTiles(clickedTile) {
        let affected = [];
        if (clickedTile.y === this.emptyPos.y) {
            const min = Math.min(clickedTile.x, this.emptyPos.x);
            const max = Math.max(clickedTile.x, this.emptyPos.x);
            affected = this.tiles.filter(t => t.y === clickedTile.y && t.x >= min && t.x <= max);
        } else {
            const min = Math.min(clickedTile.y, this.emptyPos.y);
            const max = Math.max(clickedTile.y, this.emptyPos.y);
            affected = this.tiles.filter(t => t.x === clickedTile.x && t.y >= min && t.y <= max);
        }
        return affected;
    }

    onPointerMove(e) {
        if (!this.isDragging) return;

        this.dragData.currentX = e.clientX;
        this.dragData.currentY = e.clientY;

        let delta = 0;
        if (this.dragData.axis === 'x') {
            delta = (this.dragData.currentX - this.dragData.startX);
        } else {
            delta = (this.dragData.currentY - this.dragData.startY);
        }

        if (this.dragData.direction === 1) {
            delta = Math.max(0, Math.min(delta, this.dragData.maxDelta));
        } else {
            delta = Math.min(0, Math.max(delta, -this.dragData.maxDelta));
        }

        this.dragData.affectedTiles.forEach(tile => {
            if (this.dragData.axis === 'x') {
                tile.offsetX = delta;
            } else {
                tile.offsetY = delta;
            }
        });
    }

    onPointerUp(e) {
        if (!this.isDragging) return;
        this.isDragging = false;

        const time = performance.now() - this.dragData.startTime;
        let delta = this.dragData.axis === 'x' 
            ? (this.dragData.currentX - this.dragData.startX) 
            : (this.dragData.currentY - this.dragData.startY);
        
        const velocity = Math.abs(delta) / time;
        const threshold = this.dragData.maxDelta * 0.4;
        const isFlick = velocity > 0.5;
        const isHalfway = Math.abs(delta) > threshold;

        if (isFlick || isHalfway) {
            const correctDirection = (delta * this.dragData.direction) > 0;
            if (correctDirection) {
                this.completeMove();
                return;
            }
        }

        this.cancelMove();
    }

    completeMove() {
        // Save state for undo
        this.saveMovesToHistory();
        
        // Update logical state
        if (this.dragData.axis === 'x') {
            this.emptyPos.x = this.dragData.direction === 1 ? 
                Math.min(...this.dragData.affectedTiles.map(t => t.x)) : 
                Math.max(...this.dragData.affectedTiles.map(t => t.x));
            
            this.dragData.affectedTiles.forEach(t => t.x += this.dragData.direction);
        } else {
            this.emptyPos.y = this.dragData.direction === 1 ? 
                Math.min(...this.dragData.affectedTiles.map(t => t.y)) : 
                Math.max(...this.dragData.affectedTiles.map(t => t.y));
                
            this.dragData.affectedTiles.forEach(t => t.y += this.dragData.direction);
        }

        this.moveCount++;
        this.resetOffsets();
    }

    cancelMove() {
        this.resetOffsets();
    }

    resetOffsets() {
        this.dragData.affectedTiles.forEach(tile => {
            tile.offsetX = 0;
            tile.offsetY = 0;
        });
    }

    saveMovesToHistory() {
        this.currentMoveIndex++;
        this.moveHistory.splice(this.currentMoveIndex);
        
        this.moveHistory.push({
            tiles: this.tiles.map(t => ({ x: t.x, y: t.y })),
            empty: { ...this.emptyPos }
        });
    }

    undo() {
        if (this.currentMoveIndex > 0) {
            this.currentMoveIndex--;
            this.restoreState(this.currentMoveIndex);
            this.moveCount--;
        }
    }

    redo() {
        if (this.currentMoveIndex < this.moveHistory.length - 1) {
            this.currentMoveIndex++;
            this.restoreState(this.currentMoveIndex);
            this.moveCount++;
        }
    }

    restoreState(index) {
        const state = this.moveHistory[index];
        this.tiles.forEach((tile, i) => {
            tile.x = state.tiles[i].x;
            tile.y = state.tiles[i].y;
        });
        this.emptyPos = { ...state.empty };
    }

    shuffle() {
        for (let i = 0; i < 200; i++) {
            const neighbors = this.tiles.filter(t => 
                (Math.abs(t.x - this.emptyPos.x) === 1 && t.y === this.emptyPos.y) ||
                (Math.abs(t.y - this.emptyPos.y) === 1 && t.x === this.emptyPos.x)
            );
            const randomTile = neighbors[Math.floor(Math.random() * neighbors.length)];
            
            const tx = randomTile.x;
            const ty = randomTile.y;
            randomTile.x = this.emptyPos.x;
            randomTile.y = this.emptyPos.y;
            this.emptyPos.x = tx;
            this.emptyPos.y = ty;
        }
        
        this.moveCount = 0;
        this.saveMovesToHistory();
    }

    isSolved() {
        for (let tile of this.tiles) {
            const expectedPos = this.mode === 'Classic' 
                ? (tile.y * this.size) + tile.x + 1
                : tile.number;
            
            if (this.mode === 'Classic') {
                const expectedNum = (tile.y * this.size) + tile.x + 1;
                if (tile.number !== expectedNum) return false;
            } else {
                if ((tile.y * this.size) + tile.x + 1 !== tile.number) return false;
            }
        }
        
        return this.emptyPos.x === this.size - 1 && this.emptyPos.y === this.size - 1;
    }

    startAnimation() {
        const animate = () => {
            this.tiles.forEach(tile => {
                const base = this.getTilePosition(tile.x, tile.y);
                const targetX = base.left + tile.offsetX;
                const targetY = base.top + tile.offsetY;

                tile.currentVisualX += (targetX - tile.currentVisualX) * 0.2;
                tile.currentVisualY += (targetY - tile.currentVisualY) * 0.2;

                if (Math.abs(tile.currentVisualX - targetX) < 0.1) tile.currentVisualX = targetX;
                if (Math.abs(tile.currentVisualY - targetY) < 0.1) tile.currentVisualY = targetY;

                tile.el.style.transform = `translate3d(${tile.currentVisualX}px, ${tile.currentVisualY}px, 0)`;
            });

            this.animationFrameId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    stopAnimation() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    pause() {
        this.gameActive = false;
    }

    resume() {
        this.gameActive = true;
    }

    destroy() {
        this.stopAnimation();
        this.board.removeEventListener('pointerdown', this.onPointerDown.bind(this));
    }
}
