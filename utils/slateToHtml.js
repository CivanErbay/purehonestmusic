export function slateToHtml(nodes) {
  if (!nodes || !Array.isArray(nodes)) return '';

  return nodes
    .map((node) => {
      if (node.type === 'paragraph') {
        return `<p>${node.children}</p>`;
      }
      if (node.type === 'h1') {
        return `<h1>${slateToHtml(node.children)}</h1>`;
      }
      if (node.type === 'h2') {
        return `<h2>${slateToHtml(node.children)}</h2>`;
      }
      if (node.type === 'ul') {
        return `<ul>${slateToHtml(node.children)}</ul>`;
      }
      if (node.type === 'li') {
        return `<li>${slateToHtml(node.children)}</li>`;
      }
      if (node.type === 'code') {
        return `<code>${slateToHtml(node.children)}</code>`;
      }
      if (node.type === 'link') {
        return `<a href="${node.url}">${slateToHtml(node.children)}</a>`;
      }
      if (node.text) {
        let text = node.text;
        if (node.bold) {
          text = `<strong>${text}</strong>`;
        }
        if (node.italic) {
          text = `<em>${text}</em>`;
        }
        if (node.underline) {
          text = `<u>${text}</u>`;
        }
        if (text === '') {
          return '<br>';
        }
        text = text.replace(/\n/g, '<br>');
        return text;
      }
      return slateToHtml(node.children);
    })
    .join('');
}
