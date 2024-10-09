export function slateToHtml(nodes) {
  if (!nodes || !Array.isArray(nodes)) return ''

  return nodes
    .map(node => {
      if (node.type === 'paragraph') {
        return `<p>${slateToHtml(node.children)}</p>`
      }
      if (node.type === 'heading-one') {
        return `<h1>${slateToHtml(node.children)}</h1>`
      }
      if (node.type === 'heading-two') {
        return `<h2>${slateToHtml(node.children)}</h2>`
      }
      if (node.type === 'bulleted-list') {
        return `<ul>${slateToHtml(node.children)}</ul>`
      }
      if (node.type === 'list-item') {
        return `<li>${slateToHtml(node.children)}</li>`
      }
      if (node.type === 'link') {
        return `<a href="${node.url}">${slateToHtml(node.children)}</a>`
      }
      if (node.text) {
        let text = node.text
        if (node.bold) {
          text = `<strong>${text}</strong>`
        }
        if (node.italic) {
          text = `<em>${text}</em>`
        }
        if (node.underline) {
          text = `<u>${text}</u>`
        }
        text = text.replace(/\n/g, '<br>')
        return text
      }
      return slateToHtml(node.children)
    })
    .join('')
}
