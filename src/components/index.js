import FormRenderer from "./FormRenderer";

FormRenderer.install = function(Vue) {
  Vue.component("vue-form-renderer", FormRenderer);
};

export default FormRenderer;
