import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "./styles.scss";

Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
