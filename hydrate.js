import { render } from 'fre'

function createWalker(node) {
  return document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, {
    acceptNode: () => NodeFilter.FILTER_ACCEPT,
  })
}

function morph(sourceElement, targetElement) {
  const sourceWalker = createWalker(sourceElement)
  const targetWalker = createWalker(targetElement)
  const walk = fn =>
    sourceWalker.nextNode() && targetWalker.nextNode() && fn() && walk(fn)

  walk(() => {
    const { currentNode } = sourceWalker
    const targetNode = targetWalker.currentNode
    // TODO more things
    if (currentNode.tagName === targetNode.tagName) {
      if (currentNode === document.activeElement) {
        requestAnimationFrame(() => {
          targetNode.focus()
        })
      }
    }
    return true
  })
}

export default function hydrate(vnode, node, config) {
  config.hydrate = true
  const clone = node.cloneNode(false)
  render(vnode, clone, config)
  morph(clone, node)
  node.parentNode.replaceChild(clone, node)
}
