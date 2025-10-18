// setTimeout(showwelcomeDiv, 3000);
// document.getElementById("image-button").addEventListener("click", showpfpDiv);                

// function showpfpDiv() {
//     const delayedDiv = document.getElementById('pfpDiv');
//     delayedDiv.style.display = 'block'; // Show the div
// }

// function showwelcomeDiv() {
//     const blackDiv = document.querySelector('#overlay-black');
//     const delayedDiv = document.getElementById('welcomeDiv');
//     delayedDiv.style.display = 'block'; // Show the div
//     setTimeout(() =>  {
//         blackDiv.remove();
//     }, 100);
// }



const blackDiv = document.querySelector('#overlay-black');
setTimeout(removeOverlay, 1500);

function removeOverlay() {
    blackDiv.remove();
}

// --- Draggable Desktop Icons ---
const gridSize = 100; // px (increased spacing)

function snapToGrid(x, y) {
    return {
        x: Math.round(x / gridSize) * gridSize,
        y: Math.round(y / gridSize) * gridSize
    };
}

function makeDraggable(icon) {
    let offsetX = 0, offsetY = 0, startX = 0, startY = 0, dragging = false;

    icon.style.position = 'absolute';
    icon.addEventListener('mousedown', function(e) {
        if (e.button !== 0) return;
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = icon.getBoundingClientRect();
        offsetX = startX - rect.left;
        offsetY = startY - rect.top;
        icon.style.zIndex = 1000;
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', function(e) {
        if (!dragging) return;
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;
        // Prevent dragging outside window
        x = Math.max(0, Math.min(window.innerWidth - icon.offsetWidth, x));
        y = Math.max(0, Math.min(window.innerHeight - icon.offsetHeight, y));
        icon.style.left = x + 'px';
        icon.style.top = y + 'px';
    });

    document.addEventListener('mouseup', function(e) {
        if (!dragging) return;
        dragging = false;
        let x = parseInt(icon.style.left, 10) || 0;
        let y = parseInt(icon.style.top, 10) || 0;
        const snapped = snapToGrid(x, y);
        icon.style.left = snapped.x + 'px';
        icon.style.top = snapped.y + 'px';
        icon.style.zIndex = 9;
        document.body.style.userSelect = '';
    });
}

window.addEventListener('DOMContentLoaded', function() {
    // Set initial grid positions for icons, aligned to grid
    const icons = Array.from(document.querySelectorAll('.itemIcon'));
    icons.forEach((icon, i) => {
        icon.style.position = 'absolute';
        const x = Math.round(20 / gridSize) * gridSize;
        const y = Math.round((20 + i * gridSize) / gridSize) * gridSize;
        icon.style.left = x + 'px';
        icon.style.top = y + 'px';
        makeDraggable(icon);
    });

    // Make recycle bin draggable and set initial position aligned to grid
    const recycleBin = document.querySelector('.recycle-bin');
    if (recycleBin) {
        recycleBin.style.position = 'absolute';
        recycleBin.style.right = '';
        const x = Math.round((window.innerWidth - gridSize - 20) / gridSize) * gridSize;
        const y = Math.round(20 / gridSize) * gridSize;
        recycleBin.style.left = x + 'px';
        recycleBin.style.top = y + 'px';
        makeDraggable(recycleBin);
    }
});