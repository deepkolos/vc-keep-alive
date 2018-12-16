function isAsyncPlaceholder(node) {
  return node.isComment && node.asyncFactory;
}
export function getFirstComponentChild(children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (c && (c.componentOptions || isAsyncPlaceholder(c))) {
        return c;
      }
    }
  }
}

export function extend(obj, fn, newFn) {
  const oldFn = obj[fn];
  obj[fn] = function() {
    newFn.apply(this, arguments);
    oldFn.apply(this, arguments);
  };
}

export function walkTree(node, cb, parent, i) {
  if (node instanceof Array) {
    for (let i in node) {
      walkTree(node[i], cb, { children: node }, i);
    }
  } else {
    node = cb(node, parent, i);
    if (node.children instanceof Array) {
      for (let i in node.children) {
        walkTree(node.children[i], cb, node, i);
      }
    }
  }
}
