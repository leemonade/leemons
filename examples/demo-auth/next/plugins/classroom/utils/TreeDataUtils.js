function setParents(node) {
  if (node.children) {
    node.children.forEach((child) => {
      child.parent = node; // so now each node will have a parent except root node.
    });

    node.children.forEach(setParents);
  } else if (Array.isArray(node)) {
    node.forEach(setParents);
  }
}

function expandNodes(node, expand) {
  node.expanded = expand;
  if (node.children) {
    node.children.forEach((child) => {
      expandNodes(child, expand);
    });
  }
  if (Array.isArray(node)) {
    node.forEach((child) => {
      expandNodes(child, expand);
    });
  }
}

function expandBranch(node, targetNode) {
  expandNodes(node, false); // set all the nodes collapsed
  let level = targetNode;
  // iterate over all its parent and make it expanded
  while (level) {
    level.expanded = true;
    level = level.parent;
  }
}

function getNodeById(node, id) {
  let foundNode = null;

  if (node.id === id) {
    return node;
  }

  if (node.children) {
    for (let i = 0, l = node.children.length; i < l; i++) {
      foundNode = getNodeById(node.children[i], id);
      if (foundNode) {
        break;
      }
    }
  }

  if (Array.isArray(node)) {
    for (let i = 0, l = node.length; i < l; i++) {
      foundNode = getNodeById(node[i], id);
      if (foundNode) {
        break;
      }
    }
  }
  return foundNode;
}

function getExpandedNode(node, skipNode) {
  let expandedNode = null;
  if (node) {
    if (node.expanded && node.id !== skipNode?.id) {
      expandedNode = node;
    } else if (node.children) {
      for (let i = 0, l = node.children.length; i < l; i++) {
        const expandedChild = getExpandedNode(node.children[i], skipNode);
        if (expandedChild) {
          expandedNode = expandedChild;
          break;
        }
      }
    } else if (Array.isArray(node)) {
      for (let i = 0, l = node.length; i < l; i++) {
        const expandedChild = getExpandedNode(node[i], skipNode);
        if (expandedChild) {
          expandedNode = expandedChild;
          break;
        }
      }
    }
  }
  return expandedNode;
}

export { setParents, expandNodes, expandBranch, getNodeById, getExpandedNode };
