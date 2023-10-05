let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent the default browser install prompt
  event.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = event;

  // Show the custom "Install PWA" button
  const installButton = document.getElementById('install-button');
  installButton.style.display = 'block';
});

const installButton = document.getElementById('install-button');
installButton.addEventListener('click', () => {
  // Trigger the browser install prompt
  if (deferredPrompt) {
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }

      // Reset the deferredPrompt variable
      deferredPrompt = null;
    });
  }
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
}
