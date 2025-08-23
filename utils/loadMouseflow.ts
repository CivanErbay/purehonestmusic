export function loadMouseflow(projectId: string) {
  if (!import.meta.client) return;

  // _mfq bereitstellen
  (window as any)._mfq = (window as any)._mfq || [];

  // Doppeltes Einfügen verhindern
  if (document.getElementById('mouseflow-snippet')) return;

  const s = document.createElement('script');
  s.id = 'mouseflow-snippet';
  s.defer = true;
  s.src = `https://cdn.mouseflow.com/projects/${projectId}.js`;
  document.head.appendChild(s);
}