import drag from './drag'

const install = function(Vue) {
  Vue.directive('dialogDrag', drag)
}

if (window.Vue) {
  window['dialogDrag'] = drag
  Vue.use(install); // eslint-disable-line
}

drag.install = install
export default drag
