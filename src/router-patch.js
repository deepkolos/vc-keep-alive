import bus from './bus';
import { last } from './history';
import { extend, walkTree, createFullPath } from './utils';

let rootPaths = [];
let routerKeyCache = {};
let isReplaceAct = false;

function getAncestorRoute(curr) {
  while (curr.parent) curr = curr.parent;

  return curr;
}

function isIgnorePath(vmKeepAlive, from, to) {
  let { ignorePaths } = vmKeepAlive;
  if (!Array.isArray(ignorePaths)) {
    ignorePaths = [ignorePaths];
  }

  if (ignorePaths && ignorePaths.length) {
    return ignorePaths.some(pattern => {
      if (typeof pattern === 'string') {
        return ~from.fullPath.indexOf(pattern) || ~to.fullPath.indexOf(pattern);
      }

      if (pattern instanceof RegExp) {
        return pattern.exec(from.fullPath) || pattern.exec(to.fullPath);
      }
    });
  }
  return false;
}

const hook = router => {
  router.beforeEach((to, from, next) => {
    const nextPath = to.path;
    const fromPath = from.path;
    const nextRouterKey = router.getRouterKey(to);
    const fromRouterKey = router.getRouterKey(from);
    const params = {
      fromPath,
      nextPath,
      nextRouterKey,
      fromRouterKey
    };

    bus.emit('before-nav', params);

    // 如果是home path 的话则触发 rest
    if (
      rootPaths.includes(nextRouterKey) &&
      !rootPaths.includes(fromRouterKey)
    ) {
      bus.emit('reset', params);
    }

    if (last(1) === nextPath && last(0) === fromPath) {
      bus.emit('backward', params);
    } else if (isReplaceAct) {
      bus.emit('replace', params);
    } else if (!router.isIgnorePath(from, to)) {
      bus.emit('forward', params);
    }

    bus.emit('before-nav', params);
    next();
  });

  router.afterEach(() => {
    isReplaceAct = false;
  });
};

function getRouterKey(vmKeepAlive, current = this.history.current) {
  let urlParams = [];
  let tabIndexes = [];
  const { matched, path } = current;

  if (!routerKeyCache[path]) {
    const target = matched[matched.length - 1];
    const ancestorRoute = getAncestorRoute(target);
    let matchedRoute = matched
      .map(route => {
        return { route, params: route.regex.exec(path + '/') };
      })
      .filter(i => i.params !== null)[0];

    if (matchedRoute) {
      urlParams = matchedRoute.params.slice(1);

      matchedRoute.route.regex.keys.forEach((v, k) => {
        if (vmKeepAlive.ignoreParams.includes(v.name)) {
          tabIndexes.unshift(k);
        }
      });
      tabIndexes.forEach(k => {
        urlParams.splice(k, 1);
      });
      routerKeyCache[path] = ancestorRoute.path + urlParams.toString();
    }
  }

  return routerKeyCache[path];
}

function initRootRoutes(router) {
  walkTree(router.options.routes.slice(), (curr, parent) => {
    let node = Object.assign({}, curr);
    let paths = [node.path];

    node.alias !== undefined &&
      (Array.isArray(node.alias) ? node.alias : [node.alias]).map(i =>
        paths.push(i)
      );

    let fullPaths = [];
    paths.forEach(path => {
      if (parent.paths) {
        parent.paths.forEach(subPath => {
          fullPaths.push(createFullPath(path, subPath));
        });
      } else {
        fullPaths.push(createFullPath(path, ''));
      }
    });

    if (fullPaths.includes('/')) {
      rootPaths = fullPaths;
      return;
    }

    return node;
  });
}

export const initPatch = (router, vmKeepAlive) => {
  const nextPath = router.history.current.path;

  hook(router);
  initRootRoutes(router);
  extend(router.__proto__, 'replace', () => (isReplaceAct = true));
  router.__proto__.getRouterKey = getRouterKey.bind(router, vmKeepAlive);
  router.__proto__.isIgnorePath = isIgnorePath.bind(router, vmKeepAlive);
  bus.emit('init', { nextPath });
};
