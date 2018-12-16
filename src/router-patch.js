import bus from './bus';
import { last } from './history';
import { extend } from './utils';
import { getRouterKey, rootPaths } from './router-map';

let isReplaceAct = false;
let routerIgnorePaths;

function isIgnorePath(from, to) {
  if (routerIgnorePaths && routerIgnorePaths.length) {
    return routerIgnorePaths.some(pattern => {
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
    const nextRouterKey = getRouterKey(nextPath);
    const fromRouterKey = getRouterKey(fromPath);
    const params = {
      fromPath,
      nextPath,
      nextRouterKey,
      fromRouterKey
    };

    bus.emit('before-nav', params);

    // 算出home path
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
    } else if (!isIgnorePath(from, to)) {
      bus.emit('forward', params);
    }

    bus.emit('before-nav', params);
    next();
  });

  router.afterEach(() => {
    isReplaceAct = false;
  });
};

export const initPatch = (router, ignorePaths = []) => {
  routerIgnorePaths = ignorePaths;
  if (!Array.isArray(ignorePaths)) {
    routerIgnorePaths = [ignorePaths];
  }
  const nextPath = router.history.current.path;

  bus.emit('init', { nextPath });
  extend(router.__proto__, 'replace', function() {
    isReplaceAct = true;
  });
  hook(router);
};
