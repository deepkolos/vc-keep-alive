(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/install.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = $getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  var args = [];
  for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    ReflectApply(this.listener, this.target, args);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function') {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}


/***/ }),

/***/ "./src/install.js":
/*!************************************!*\
  !*** ./src/install.js + 5 modules ***!
  \************************************/
/*! exports provided: default, VcKeepAlive */
/*! ModuleConcatenation bailout: Cannot concat with ./node_modules/events/events.js (<- Module is not an ECMAScript module) */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/events/events.js
var events = __webpack_require__("./node_modules/events/events.js");
var events_default = /*#__PURE__*/__webpack_require__.n(events);

// CONCATENATED MODULE: ./src/bus.js

var bus = new events_default.a();
/* harmony default export */ var src_bus = (bus);
// CONCATENATED MODULE: ./src/history.js

var historyStack = [];
src_bus.on('init', function (_ref) {
  var nextPath = _ref.nextPath;

  // 初始化
  try {
    historyStack = JSON.parse(window.sessionStorage.__VCKEEPALIVE__ || '[]');
  } catch (e) {
    historyStack = [nextPath];
  } finally {
    // TODO: 如果打开非首页可以通过初始化预先路由, 但是需要配置back的支持
    if (!historyStack.length) {
      historyStack = [nextPath];
    }
  }
});
src_bus.on('reset', function (_ref2) {
  var nextPath = _ref2.nextPath,
      fromPath = _ref2.fromPath;
  historyStack = [nextPath, fromPath];
  store();
});
src_bus.on('backward', function () {
  historyStack.pop();
  store();
});
src_bus.on('replace', function (_ref3) {
  var nextPath = _ref3.nextPath;
  historyStack.pop();
  historyStack.push(nextPath);
  store();
});
src_bus.on('forward', function (_ref4) {
  var nextPath = _ref4.nextPath;
  historyStack.push(nextPath);
  store();
});
var last = function last() {
  var i = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return historyStack[historyStack.length - 1 - i];
};
var store = function store() {
  setTimeout(function () {
    window.sessionStorage.__VCKEEPALIVE__ = JSON.stringify(historyStack);
  });
};
// CONCATENATED MODULE: ./src/utils.js
var cleanPath = function cleanPath(path) {
  return path.replace(/\/\//g, '/');
};
var createFullPath = function createFullPath(curr, parent) {
  return cleanPath(curr.charAt(0) === '/' ? curr : parent + '/' + curr);
};
function extend(obj, fn, newFn) {
  var oldFn = obj[fn];

  obj[fn] = function () {
    newFn.apply(this, arguments);
    oldFn.apply(this, arguments);
  };
}
function walkTree(node, cb, parent, i) {
  if (node instanceof Array) {
    for (var _i in node) {
      if (!walkTree(node[_i], cb, {
        children: node
      }, _i)) break;
    }
  } else {
    node = cb(node, parent, i);

    if (node && node.children instanceof Array) {
      for (var _i2 in node.children) {
        if (!walkTree(node.children[_i2], cb, node, _i2)) break;
      }

      return true;
    } else {
      return false;
    }
  }
}
function getFirstComponentChild(children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];

      if (c && (c.componentOptions || c.isComment && c.asyncFactory)) {
        return c;
      }
    }
  }
}
// CONCATENATED MODULE: ./src/router-patch.js



var rootPaths = [];
var routerKeyCache = {};
var isReplaceAct = false;

function getAncestorRoute(curr) {
  while (curr.parent) {
    curr = curr.parent;
  }

  return curr;
}

function isIgnorePath(vmKeepAlive, from, to) {
  var ignorePaths = vmKeepAlive.ignorePaths;

  if (!Array.isArray(ignorePaths)) {
    ignorePaths = [ignorePaths];
  }

  if (ignorePaths && ignorePaths.length) {
    return ignorePaths.some(function (pattern) {
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

var router_patch_hook = function hook(router) {
  router.beforeEach(function (to, from, next) {
    var nextPath = to.path;
    var fromPath = from.path;
    var nextRouterKey = router.getRouterKey(to);
    var fromRouterKey = router.getRouterKey(from);
    var params = {
      fromPath: fromPath,
      nextPath: nextPath,
      nextRouterKey: nextRouterKey,
      fromRouterKey: fromRouterKey
    };
    src_bus.emit('before-nav', params); // 如果是home path 的话则触发 rest

    if (rootPaths.includes(nextRouterKey) && !rootPaths.includes(fromRouterKey)) {
      src_bus.emit('reset', params);
    }

    if (last(1) === nextPath && last(0) === fromPath) {
      src_bus.emit('backward', params);
    } else if (isReplaceAct) {
      src_bus.emit('replace', params);
    } else if (!router.isIgnorePath(from, to)) {
      src_bus.emit('forward', params);
    }

    src_bus.emit('before-nav', params);
    next();
  });
  router.afterEach(function () {
    isReplaceAct = false;
  });
};

function getRouterKey(vmKeepAlive) {
  var current = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.history.current;
  var urlParams = [];
  var tabIndexes = [];
  var matched = current.matched,
      path = current.path;

  if (!routerKeyCache[path]) {
    var target = matched[matched.length - 1];
    var ancestorRoute = getAncestorRoute(target);
    var matchedRoute = matched.map(function (route) {
      return {
        route: route,
        params: route.regex.exec(path + '/')
      };
    }).filter(function (i) {
      return i.params !== null;
    })[0];

    if (matchedRoute) {
      urlParams = matchedRoute.params.slice(1);
      matchedRoute.route.regex.keys.forEach(function (v, k) {
        if (vmKeepAlive.ignoreParams.includes(v.name)) {
          tabIndexes.unshift(k);
        }
      });
      tabIndexes.forEach(function (k) {
        urlParams.splice(k, 1);
      });
      routerKeyCache[path] = ancestorRoute.path + urlParams.toString();
    }
  }

  return routerKeyCache[path];
}

function initRootRoutes(router) {
  walkTree(router.options.routes.slice(), function (curr, parent) {
    var node = Object.assign({}, curr);
    var paths = [node.path];
    node.alias !== undefined && (Array.isArray(node.alias) ? node.alias : [node.alias]).map(function (i) {
      return paths.push(i);
    });
    var fullPaths = [];
    paths.forEach(function (path) {
      if (parent.paths) {
        parent.paths.forEach(function (subPath) {
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

var router_patch_initPatch = function initPatch(router, vmKeepAlive) {
  var nextPath = router.history.current.path;
  initRootRoutes(router);
  src_bus.emit('init', {
    nextPath: nextPath
  });
  extend(router.__proto__, 'replace', function () {
    return isReplaceAct = true;
  });
  router.__proto__.getRouterKey = getRouterKey.bind(router, vmKeepAlive);
  router.__proto__.isIgnorePath = isIgnorePath.bind(router, vmKeepAlive);
  router_patch_hook(router);
};
// CONCATENATED MODULE: ./src/vc-keep-alive.js



var initialed = false;
/* harmony default export */ var vc_keep_alive = ({
  name: 'vc-keep-alive',
  abstract: true,
  props: {
    ignorePaths: [Array, String, RegExp],
    ignoreParams: [Array, String]
  },
  created: function created() {
    var _this = this;

    this.router = this._routerRoot._router;
    this.cache = Object.create(null);
    this.isBackward = false;
    this.backwardParams;
    src_bus.on('backward', function (params) {
      _this.isBackward = true;
      _this.backwardParams = params;
    });
    ['forward', 'backward', 'replace', 'init'].forEach(function (state) {
      src_bus.on(state, function (params) {
        _this.$emit(state, params);
      });
    });
    if (initialed) return;
    router_patch_initPatch(this.router, this);
    initialed = true;
  },
  destroyed: function destroyed() {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.cache[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var cached = _step.value;
        if (cached && cached.componentInstance) cached.componentInstance.$destroy();
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  },
  render: function render() {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;

    var _ref = this.backwardParams || {},
        fromRouterKey = _ref.fromRouterKey,
        nextRouterKey = _ref.nextRouterKey;

    if (componentOptions) {
      var cache = this.cache;
      var key = vnode.key = this.router.getRouterKey();

      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;

        if (this.isBackward && fromRouterKey !== nextRouterKey && cache[fromRouterKey]) {
          cache[fromRouterKey].componentInstance.$destroy();
          this.isBackward = false;
          this.backwardParams = null;
          cache[fromRouterKey] = null;
        }
      } else {
        cache[key] = vnode;
      }

      vnode.data.keepAlive = true;
    }

    return vnode || slot && slot[0];
  }
});
// CONCATENATED MODULE: ./src/install.js
/* concated harmony reexport VcKeepAlive */__webpack_require__.d(__webpack_exports__, "VcKeepAlive", function() { return vc_keep_alive; });

var version = "1.0.2";

var install_install = function install(Vue) {
  if (install.installed) return;
  Vue.component(vc_keep_alive.name, vc_keep_alive);
};

if (typeof window !== 'undefined' && window.Vue) {
  install_install(window.Vue);
}

/* harmony default export */ var src_install = __webpack_exports__["default"] = ({
  install: install_install,
  version: version
});


/***/ })

/******/ })["default"];
});
//# sourceMappingURL=vc-keep-alive.js.map