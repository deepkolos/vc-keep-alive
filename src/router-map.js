import { walkTree } from './utils';
import pathToRegexp from 'path-to-regexp';

let routerPos = [];
let rootPaths = [];
let routerMap = {};
let routerKeyCache = {};
let routerIgnoreParams = [];

const cleanPath = path => path.replace(/\/\//g, '/');

const createFullPath = (curr, parent) => {
  return cleanPath(curr.charAt(0) === '/' ? curr : parent + '/' + curr);
};

const createMap = (curr, parent, pos) => {
  let node = Object.assign({}, curr);
  let paths = [node.path];

  parent.children[pos] = node;

  if (!parent.pos) {
    node.pos = [pos];
  } else {
    node.pos = [...parent.pos, pos];
  }

  let alias = node.alias !== undefined ? node.alias : [];
  if (alias !== undefined) {
    alias = alias instanceof Array ? alias : [alias];
    alias = alias.map(i => paths.push(i));
  }

  let fullPaths = [];
  for (let i = 0; i < paths.length; i++) {
    if (parent.paths) {
      for (let j = 0; j < parent.paths.length; j++) {
        fullPaths.push(createFullPath(paths[i], parent.paths[j]));
      }
    } else {
      fullPaths.push(createFullPath(paths[i], ''));
    }
  }

  node.paths = paths;
  node.fullPaths = fullPaths;

  fullPaths.forEach(path => {
    let keys = [];
    let regex = pathToRegexp(path, keys);
    regex.keys = keys;

    routerMap[path] = { node, regex };
  });

  return node;
};

const getMatchedRoutes = url => {
  let matchedPaths = [];

  Object.keys(routerMap).forEach(k => {
    let urlParams = routerMap[k].regex.exec(url);
    if (urlParams) {
      matchedPaths.push({
        urlParams,
        node: routerMap[k].node,
        regex: routerMap[k].regex
      });
    }
  });

  return matchedPaths;
};

const getRouterKey = (path, level = 0) => {
  let keyPath;
  let urlParams;
  let tabIndexes = [];
  let routers = getMatchedRoutes(cleanPath(path + '/'));

  if (routers.length) {
    if (!routerKeyCache[path]) {
      urlParams = routers[0].urlParams.slice(1);
      keyPath = routerPos[routers[0].node.pos[level]].path;

      routers[0].regex.keys.forEach((v, k) => {
        if (routerIgnoreParams.includes(v.name)) {
          tabIndexes.unshift(k);
        }
      });
      tabIndexes.forEach(k => {
        urlParams.splice(k, 1);
      });

      routerKeyCache[path] = keyPath + urlParams.toString();
      return keyPath + urlParams;
    }
    return routerKeyCache[path];
  }
  return '/';
};

const initMap = (router, ignoreParams = []) => {
  routerIgnoreParams = ignoreParams;
  routerPos = router.options.routes.slice();
  walkTree(routerPos, createMap);
  routerPos.every(node => {
    if (node.fullPaths.includes('/')) {
      rootPaths = node.fullPaths;
      return false;
    }
    return true;
  });
};

export {
  initMap,
  routerMap,
  routerPos,
  rootPaths,
  getRouterKey,
  getMatchedRoutes
};
