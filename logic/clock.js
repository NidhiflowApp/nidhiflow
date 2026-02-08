function updateClock() {
  const now = new Date();

  const time = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const date = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  document.getElementById("digitalTime").innerText = time;
  document.getElementById("digitalDate").innerText = date;
}

setInterval(updateClock, 1000);
updateClock();
