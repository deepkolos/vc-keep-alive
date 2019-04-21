export const cleanPath = path => path.replace(/\/\//g, '/');

export const createFullPath = (curr, parent) => {
  return cleanPath(curr.charAt(0) === '/' ? curr : parent + '/' + curr);
};

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
      if (!walkTree(node[i], cb, { children: node }, i)) break;
    }
  } else {
    node = cb(node, parent, i);
    if (node && node.children instanceof Array) {
      for (let i in node.children) {
        if (!walkTree(node.children[i], cb, node, i)) break;
      }
      return true;
    } else {
      return false;
    }
  }
}

export function getFirstComponentChild(children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (c && (c.componentOptions || (c.isComment && c.asyncFactory))) {
        return c;
      }
    }
  }
}
