        setTimeout(function () {
              // Only open if the element exists on this page
              if (document.getElementById('firstModal')) {
                openModal('firstModal');
              }
            }, 3000);

        function openModal(modalId) {
          var modal = document.getElementById(modalId);
          if (modal) {
            modal.style.display = "block";
            // Ensure contact modal is always above the start menu
            if (modalId === 'contactModal') {
              modal.style.zIndex = 9999;
            } else {
              modal.style.zIndex = getMaxZ() + 1;
            }
            updateTaskbar();
          }
        }

        // Function to close a modal
        function closeModal(modalId) {
          var modal = document.getElementById(modalId);
          if (modal) {
            modal.style.display = "none";
            updateTaskbar();
          }
        }
// Helper to get max z-index for stacking windows
function getMaxZ() {
  let maxZ = 10;
  document.querySelectorAll('.modal').forEach(function(m) {
    const z = parseInt(window.getComputedStyle(m).zIndex) || 10;
    if (m.style.display === 'block' && z > maxZ) maxZ = z;
  });
  return maxZ;
}

// Taskbar logic
function updateTaskbar() {
  const taskbar = document.getElementById('taskbar');
  if (!taskbar) return;
  // List all open modals
  const openModals = Array.from(document.querySelectorAll('.modal')).filter(m => m.style.display === 'block');
  taskbar.innerHTML = '';
  openModals.forEach(modal => {
    // Get window title
    let title = '';
    const headerText = modal.querySelector('.modal-header-text');
    if (headerText) title = headerText.textContent.trim();
    else title = modal.id;
    // Create button
    const btn = document.createElement('button');
    btn.textContent = title;
    btn.className = 'taskbar-btn';
    btn.onclick = function() {
      // Bring window to front
      modal.style.zIndex = getMaxZ() + 1;
      modal.focus();
    };
    taskbar.appendChild(btn);
  });
}

// Update taskbar on load and when modals change
document.addEventListener('DOMContentLoaded', updateTaskbar);

        document.addEventListener('DOMContentLoaded', function() {
      document.querySelectorAll('.close').forEach(function(closeBtn) {
        closeBtn.addEventListener('click', function() {
          // Always hide the parent .modal container
          var modal = this.closest('.modal');
          if (!modal) {
            // If not found, try to find the closest .modal-content and then its parent .modal
            var modalContent = this.closest('.modal-content');
            if (modalContent && modalContent.parentElement.classList.contains('modal')) {
              modal = modalContent.parentElement;
            }
          }
          if (modal) {
            modal.style.display = 'none';
            updateTaskbar();
          }
        });
      });
        });



        // Safely initialize known modal draggables if present on the page
        ['firstModaldrag','secondModaldrag','thirdModaldrag','fourthModaldrag']
          .forEach(function(id){
            var el = document.getElementById(id);
            if (el) dragElement(el);
          });



        function dragElement(elmnt) {
          if (!elmnt) return; // Guard against null elements
          var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
          if (document.getElementById(elmnt.id + "header")) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
          } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
          }

          function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
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
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
          }
        }