// Make modals draggable (including contact modal)
function dragElement(elmnt, dragHandle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    dragHandle = dragHandle || elmnt;
    dragHandle.onmousedown = dragMouseDown;
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
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
    // Remove any previous listeners to prevent sticky drag
    if (icon._draggableCleanup) icon._draggableCleanup();
    let offsetX = 0, offsetY = 0, startX = 0, startY = 0, dragging = false;
    function mouseMove(e) {
        if (!dragging) return;
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;
        x = Math.max(0, Math.min(window.innerWidth - icon.offsetWidth, x));
        y = Math.max(0, Math.min(window.innerHeight - icon.offsetHeight, y));
        icon.style.left = x + 'px';
        icon.style.top = y + 'px';
    }
    function mouseUp(e) {
        if (!dragging) return;
        dragging = false;
        let x = parseInt(icon.style.left, 10) || 0;
        let y = parseInt(icon.style.top, 10) || 0;
        const snapped = snapToGrid(x, y);
        icon.style.left = snapped.x + 'px';
        icon.style.top = snapped.y + 'px';
        icon.style.zIndex = 9;
        document.body.style.userSelect = '';
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('mouseup', mouseUp);
        // Ensure dragging is stopped even if mouseup is missed
        setTimeout(() => { dragging = false; }, 0);
    }
    function mouseDown(e) {
        if (e.button !== 0) return;
        if (dragging) return; // Prevent sticky drag if already dragging
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = icon.getBoundingClientRect();
        offsetX = startX - rect.left;
        offsetY = startY - rect.top;
        icon.style.zIndex = 1000;
        document.body.style.userSelect = 'none';
        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('mouseup', mouseUp);
    }
    icon.addEventListener('mousedown', mouseDown);
    // Store cleanup so we can remove listeners if re-initialized
    icon._draggableCleanup = function() {
        icon.removeEventListener('mousedown', mouseDown);
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('mouseup', mouseUp);
    };
}

window.addEventListener('DOMContentLoaded', function() {
    // Make contact modal draggable
    const contactModal = document.getElementById('contactModaldrag');
    const contactHeader = document.getElementById('contactModaldragheader');
    if (contactModal && contactHeader) {
        dragElement(contactModal, contactHeader);
    }
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