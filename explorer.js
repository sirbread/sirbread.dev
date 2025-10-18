let recycledItems = [];

document.addEventListener('DOMContentLoaded', function() {
    const localDisk = document.querySelector('.sidebar-item[data-path="C:"]');
    if (localDisk) {
        localDisk.classList.add('selected');
    }

    document.querySelectorAll('.explorer-item').forEach(item => {
        item.setAttribute('draggable', 'true');
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });

    const recycleBin = document.querySelector('.recycle-bin');
    if (recycleBin) {
        recycleBin.addEventListener('dblclick', showRecycleBinMessage);
        recycleBin.addEventListener('dragover', handleDragOver);
        recycleBin.addEventListener('dragleave', handleDragLeave);
        recycleBin.addEventListener('drop', handleDrop);
    }

    // Desktop drop support
    const desktopArea = document.getElementById('desktopArea');
    if (desktopArea) {
        desktopArea.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        desktopArea.addEventListener('drop', function(e) {
            e.preventDefault();
            const projectName = e.dataTransfer.getData('text/plain');
            if (projectName) {
                const explorerItem = findExplorerItemByName(projectName);
                if (explorerItem) {
                    explorerItem.style.display = 'none';
                    createDesktopIcon(projectName, e.clientX, e.clientY);
                    updateExplorerStatus();
                }
            }
        });
    }
});

function handleDragStart(e) {
    let explorerItem = e.target;
    while (explorerItem && !explorerItem.classList.contains('explorer-item')) {
        explorerItem = explorerItem.parentElement;
    }

    if (explorerItem) {
        const projectName = explorerItem.querySelector('.item-name')?.textContent;
        if (projectName) {
            e.dataTransfer.setData('text/plain', projectName);
            e.dataTransfer.effectAllowed = 'move';
            explorerItem.style.opacity = '0.4';
            explorerItem.setAttribute('data-dragging', 'true');
        }
    }
}

function handleDragEnd(e) {
    let explorerItem = e.target;
    while (explorerItem && !explorerItem.classList.contains('explorer-item')) {
        explorerItem = explorerItem.parentElement;
    }

    if (explorerItem) {
        explorerItem.style.opacity = '1';
        explorerItem.removeAttribute('data-dragging');
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const recycleBin = document.querySelector('.recycle-bin');
    if (recycleBin) {
        recycleBin.style.backgroundColor = '#000080';
        recycleBin.style.border = '2px solid #ffffff';
    }
}

function handleDragLeave(e) {
    const recycleBin = document.querySelector('.recycle-bin');
    if (recycleBin) {
        recycleBin.style.backgroundColor = '';
        recycleBin.style.border = '';
    }
}

function handleDrop(e) {
    e.preventDefault();
    const projectName = e.dataTransfer.getData('text/plain');
    if (projectName) {
        const explorerItem = findExplorerItemByName(projectName);
        if (explorerItem) {
            explorerItem.style.display = 'none';
            recycledItems.push(projectName);
            updateExplorerStatus();
        }
    }
}

function findExplorerItemByName(name) {
    return Array.from(document.querySelectorAll('.explorer-item')).find(
        item => item.querySelector('.item-name').textContent === name
    );
}

function updateExplorerStatus() {
    const totalItems = document.querySelectorAll('.explorer-item').length;
    const hiddenItems = document.querySelectorAll('.explorer-item[style*="display: none"]').length;
    const visibleItems = totalItems - hiddenItems;
    
    const statusElement = document.querySelector('.explorer-status span:first-child');
    if (statusElement) {
        statusElement.textContent = `${visibleItems} object(s)`;
    }
}

function showRecycleBinMessage() {
    if (recycledItems.length > 0) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        
        modal.innerHTML = `
            <div class="modal-content" style="width: 300px; height: auto;">
                <div class="modal-header">
                    <div class="modal-header-text">Recycle Bin</div>
                    <div class="close-container"><div class="close" title="Close">x</div></div>
                </div>
                <div class="modal-body">
                    <div class="modal-body-text">
                        <p>you ain't restoring that bud</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const modalContent = modal.querySelector('.modal-content');
        if (typeof dragElement === 'function') {
            dragElement(modalContent);
        }
        
        modal.querySelector('.close').addEventListener('click', () => {
            modal.remove();
        });
    }
}

function createDesktopIcon(projectName, x, y) {
    const desktopArea = document.getElementById('desktopArea');
    if (!desktopArea) return;
    const icon = document.createElement('div');
    icon.className = 'itemIcon project-desktop-icon';
    icon.style.position = 'absolute';
    // Snap to grid on creation
    const snapped = snapToGrid(x, y);
    icon.style.left = snapped.x + 'px';
    icon.style.top = snapped.y + 'px';
    icon.style.zIndex = 9;
    icon.style.height = '88px';
    icon.style.width = '60px';
    icon.style.display = 'flex';
    icon.style.flexDirection = 'column';
    icon.style.alignItems = 'center';
    // Do NOT set draggable attribute; only use custom drag logic
    icon.removeAttribute('draggable');
    // Remove any native drag event listeners
    icon.ondragstart = function(e) { e.preventDefault(); };
    let label = projectName.replace(/^Project\s+/i, '');
    icon.innerHTML = `
        <img src="desktopimg/projectsicon.png" title="${projectName}" style="max-width: 100%; max-height: 60px;">
        <div style="font-size: 13px; text-align: center;">${label}</div>
    `;
    icon.ondblclick = function() {
        openProjectModalByName(projectName);
    };
    desktopArea.appendChild(icon);
    // Use global makeDraggable from desktopscript.js
    if (typeof makeDraggable === 'function') {
        // Clean up any previous drag listeners
        if (icon._draggableCleanup) icon._draggableCleanup();
        makeDraggable(icon);
    }
}