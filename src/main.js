import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import 'element-ui/lib/theme-chalk/index.css';

// import FormRenderer from '../dist/vue-form-renderer.umd.min'

// console.log(FormRenderer);

Vue.use(ElementUI);
// Vue.use(FormRenderer);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
