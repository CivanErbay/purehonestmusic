export default () => {
    if (process.client) { // Sicherstellen, dass der Code nur im Browser ausgeführt wird
      // Erkennen, ob die App im Standalone-Modus läuft
      if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
        document.body.classList.add('standalone');
        console.log("Standalone-Modus aktiviert");
      }
  
      // Event-Handler für Links, um das Öffnen in Safari zu verhindern
      document.addEventListener('click', function (event) {
        const target = event.target.closest('a');
        if (target && target.href && window.navigator.standalone) {
          event.preventDefault();
          window.location.href = target.href;
        }
      });
    }
  };