
let newWorker;
let refreshCacheBar = document.getElementById('refresh-cache-bar');
function showUpdateBar() {
  refreshCacheBar.className = 'show';
}

document.getElementById('close-cache-bar').addEventListener('click', function(e) {
  e.preventDefault();
  this.parentNode.style.display = 'none';
}, false);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then(reg => {
    reg.addEventListener('updatefound', () => {
      // A wild service worker has appeared in reg.installing!
      newWorker = reg.installing;
      newWorker.addEventListener('statechange', () => {
        // Has network.state changed?
        switch (newWorker.state) {
          case 'installed':
            if (navigator.serviceWorker.controller) {
              // new update available
              showUpdateBar();
            }
            // No update available
            break;
        }
      });
      // The click event on the pop up notification
      document.getElementById('reload').addEventListener('click', function(){
        newWorker.postMessage({ action: 'skipWaiting' });
      });
    });
  });
  let refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
}
