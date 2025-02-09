function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const amPm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert to 12-hour format.
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes} ${amPm}`;
  document.getElementById('clock').innerText = timeString;
}

document.getElementById('start-button').addEventListener('click', () => {
  // Perform your start button action here.
});

updateClock();
setInterval(updateClock, 1000);