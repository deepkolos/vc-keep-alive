import { popupRegister } from 'vc-popup-base';
import template from '../components/popup-imgs-viewer';

var popupConfig = {};
var defaultConfig = {
  position: 'domRelative',
  autoSetOrthocenter: true,
  animationConfigurable: false,
  maskOpacity: 1
};

export default popupRegister(
  'imgsViewer',
  template,
  popupConfig,
  defaultConfig
);
