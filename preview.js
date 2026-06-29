/**
 * Preview Module
 * Shows live preview of puzzle configuration on home page
 */

const Preview = (() => {
    let currentStyle = 'Number';
    let currentSize = 4;
    let currentMode = 'Classic';
    let currentPhotoIndex = 1;

    const presetPhotos = [
        'photo1',
        'photo2',
        'photo3',
        'photo4',
        'photo5'
    ];

    const render = () => {
        const previewBoard = document.getElementById('previewBoard');
        if (!previewBoard) return;

        previewBoard.innerHTML = '';
        previewBoard.style.gridTemplateColumns = `repeat(${currentSize}, 1fr)`;
        previewBoard.style.gridTemplateRows = `repeat(${currentSize}, 1fr)`;

        if (currentStyle === 'Number') {
            renderNumberPreview(previewBoard);
        } else {
            renderPhotoPreview(previewBoard);
        }
    };

    const renderNumberPreview = (container) => {
        const tileCount = currentSize * currentSize;
        
        for (let i = 0; i < tileCount - 1; i++) {
            const tile = document.createElement('div');
            tile.className = 'preview-tile';
            
            let number;
            if (currentMode === 'Classic') {
                number = i + 1;
            } else if (currentMode === 'Snake') {
                number = getSnakeNumber(i);
            } else if (currentMode === 'Spiral') {
                number = getSpiralNumber(i);
            } else if (currentMode === 'Upside Down') {
                number = (currentSize * currentSize - 1) - i;
            }
            
            const numDisplay = document.createElement('span');
            numDisplay.className = 'preview-tile-number';
            numDisplay.textContent = number;
            tile.appendChild(numDisplay);
            container.appendChild(tile);
        }

        // Add empty slot
        const emptySlot = document.createElement('div');
        emptySlot.className = 'preview-tile preview-empty';
        container.appendChild(emptySlot);
    };

    const getSnakeNumber = (index) => {
        const row = Math.floor(index / currentSize);
        const col = index % currentSize;
        
        if (row % 2 === 0) {
            return row * currentSize + col + 1;
        } else {
            return row * currentSize + (currentSize - col);
        }
    };

    const getSpiralNumber = (index) => {
        const size = currentSize;
        const positions = [];
        
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
        
        return positions[index] || 0;
    };

    const renderPhotoPreview = (container) => {
        const tileCount = currentSize * currentSize;
        
        // Get the photo reference
        const photoRef = presetPhotos[currentPhotoIndex - 1] || 'photo1';
        const photoUrl = `assets/images/photos/${photoRef}.jpg`;
        
        for (let i = 0; i < tileCount - 1; i++) {
            const tile = document.createElement('div');
            tile.className = 'preview-tile';
            
            const img = document.createElement('img');
            img.className = 'preview-tile-image';
            img.src = photoUrl;
            img.alt = 'Photo tile';
            img.draggable = false;
            img.style.pointerEvents = 'none';
            
            tile.appendChild(img);
            container.appendChild(tile);
        }

        // Add empty slot
        const emptySlot = document.createElement('div');
        emptySlot.className = 'preview-tile preview-empty';
        container.appendChild(emptySlot);
    };

    const setStyle = (style) => {
        currentStyle = style;
        document.querySelector('.style-display').textContent = style;
        
        const modeGroup = document.getElementById('modeGroup');
        const uploadGroup = document.getElementById('uploadGroup');
        
        if (style === 'Number') {
            if (modeGroup) modeGroup.style.display = 'block';
            if (uploadGroup) uploadGroup.style.display = 'none';
        } else {
            if (modeGroup) modeGroup.style.display = 'none';
            if (uploadGroup) uploadGroup.style.display = 'block';
            currentMode = 'Classic';
        }
        
        render();
    };

    const setSize = (size) => {
        if (size >= 3 && size <= 7) {
            currentSize = size;
            document.querySelector('.size-display').textContent = `${size}×${size}`;
            render();
        }
    };

    const setMode = (mode) => {
        currentMode = mode;
        document.querySelector('.mode-display').textContent = mode;
        render();
    };

    const setPhotoIndex = (index) => {
        if (index >= 1 && index <= presetPhotos.length) {
            currentPhotoIndex = index;
            render();
        }
    };

    const getState = () => ({
        style: currentStyle,
        size: currentSize,
        mode: currentMode,
        photoIndex: currentPhotoIndex
    });

    return {
        init: () => {
            render();
            setupEventListeners();
        },
        render,
        setStyle,
        setSize,
        setMode,
        setPhotoIndex,
        getState,
        getPhotoRef: () => presetPhotos[currentPhotoIndex - 1],
        getPresetPhotos: () => presetPhotos
    };
})();

function setupEventListeners() {
    // Style buttons
    const prevStyleBtn = document.querySelector('.prev-style');
    const nextStyleBtn = document.querySelector('.next-style');
    
    if (prevStyleBtn) {
        prevStyleBtn.addEventListener('click', () => {
            const newStyle = currentStyle === 'Number' ? 'Photo' : 'Number';
            Preview.setStyle(newStyle);
        });
    }
    
    if (nextStyleBtn) {
        nextStyleBtn.addEventListener('click', () => {
            const newStyle = currentStyle === 'Number' ? 'Photo' : 'Number';
            Preview.setStyle(newStyle);
        });
    }

    // Size buttons
    const prevSizeBtn = document.querySelector('.prev-size');
    const nextSizeBtn = document.querySelector('.next-size');
    
    if (prevSizeBtn) {
        prevSizeBtn.addEventListener('click', () => {
            Preview.setSize(currentSize - 1);
        });
    }
    
    if (nextSizeBtn) {
        nextSizeBtn.addEventListener('click', () => {
            Preview.setSize(currentSize + 1);
        });
    }

    // Mode buttons
    const modes = ['Classic', 'Snake', 'Spiral', 'Upside Down'];
    const prevModeBtn = document.querySelector('.prev-mode');
    const nextModeBtn = document.querySelector('.next-mode');
    
    if (prevModeBtn) {
        prevModeBtn.addEventListener('click', () => {
            const currentIndex = modes.indexOf(currentMode);
            const newMode = modes[(currentIndex - 1 + modes.length) % modes.length];
            Preview.setMode(newMode);
        });
    }
    
    if (nextModeBtn) {
        nextModeBtn.addEventListener('click', () => {
            const currentIndex = modes.indexOf(currentMode);
            const newMode = modes[(currentIndex + 1) % modes.length];
            Preview.setMode(newMode);
        });
    }
}

// Make currentStyle and currentSize accessible globally for home.js
Object.defineProperty(Preview, 'currentStyle', {
    get: () => currentStyle,
    set: (val) => { currentStyle = val; }
});

Object.defineProperty(Preview, 'currentSize', {
    get: () => currentSize,
    set: (val) => { currentSize = val; }
});

Object.defineProperty(Preview, 'currentMode', {
    get: () => currentMode,
    set: (val) => { currentMode = val; }
});

Object.defineProperty(Preview, 'currentPhotoIndex', {
    get: () => currentPhotoIndex,
    set: (val) => { currentPhotoIndex = val; }
});
