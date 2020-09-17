import FormRenderer from "./FormRenderer";

FormRenderer.install = function(Vue) {
  Vue.component("vue-form-renderer", FormRenderer);
};

export default FormRenderer;
/*import TextHa from "./text";

TextHa.install = function(Vue) {
  Vue.component("text-ha", TextHa);
};

export default TextHa;*/
