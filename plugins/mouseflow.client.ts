// plugins/mouseflow.client.ts
export default defineNuxtPlugin(() => {
  if (!import.meta.client) return;

  // 1) _mfq IMMER zuerst initialisieren (egal ob Script schon da ist)
  (window as any)._mfq = (window as any)._mfq || [];

  // 2) Script nur anhängen, wenn es noch nicht existiert
  if (!document.getElementById('mouseflow-snippet')) {
    const s = document.createElement('script');
    s.id = 'mouseflow-snippet';
    s.type = 'text/javascript';
    s.defer = true;
    s.src = 'https://cdn.mouseflow.com/projects/5bf2a108-c106-46ee-b600-f6c8a082aa05.js';
    document.head.appendChild(s);
  }
});
