import bus from './bus';

let historyStack = [];

bus.on('init', ({ nextPath }) => {
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

bus.on('reset', ({ nextPath, fromPath }) => {
  historyStack = [nextPath, fromPath];
  store();
});

bus.on('backward', () => {
  historyStack.pop();
  store();
});

bus.on('replace', ({ nextPath }) => {
  historyStack.pop();
  historyStack.push(nextPath);
  store();
});

bus.on('forward', ({ nextPath }) => {
  historyStack.push(nextPath);
  store();
});

export const last = (i = 0) => historyStack[historyStack.length - 1 - i];
export const store = () => {
  setTimeout(() => {
    window.sessionStorage.__VCKEEPALIVE__ = JSON.stringify(historyStack);
  });
};
