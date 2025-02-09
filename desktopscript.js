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