<script type="text/jsx">
    const defaultRowProps = {gutter: 20};
    const defaultColProps = {span: 8};
export default {
  name: "FormRenderer",
  render() {
    return <el-form rules={this.formRules} props={{ ...this.formProps,model: this.fieldValueMap }} ref="form">
      {Array.isArray(this.fieldScheme) && this.fieldScheme.map(item => {
        if (item instanceof Object || item instanceof Array) {
          return this.renderFormGroup(item);
        }
      })}
    </el-form>;
  },
  props: {
      // 表单属性
      formProps: {
          type: Object,
          require: false,
          default() {
              return {
                  labelPosition: 'top'
              }
          }
      },
    //  表单校验逻辑
    fieldRules: {
      type: Object,
      require: false
    },
    //  表单控件配置
    fieldScheme: {
      type: Array,
      require: true
    }
  },
  data() {
    return {
      // 表单规则
      formRules: {},
      // field所绑定的value
      fieldValueMap: {},
      // field所绑定的props
      fieldPropsMap: {},
      // field所绑定的option
      fieldOptionMap: {},
      // field类型集合
      fieldTypeMap: {
        INPUT: {tag:"el-input"},
        INPUT_NUMBER: {tag:"el-input-number"},
        SELECT: {
          tag: "el-select",
          slot(props) {
            return this.fieldOptionMap[props.key].map((item, index) => {
              return <el-option key={index} label={item.value} value={item.key}/>;
            });
          }
        },
        CASCADER: {tag:"el-cascader"},
        RADIO: {
          tag: "el-radio-group",
          slot(props) {
            return this.fieldOptionMap[props.key].map((item, index) => {
              return <el-radio key={index} label={item.key}>{item.value}</el-radio>;
            });
          }
        },
        SWITCH: {tag:"el-switch"},
        CHECKBOX: {tag:"el-checkbox"},
        RATE: {tag:"el-rate"},
        TIME_PICKER: {tag:"el-time-picker"},
        DATE_PICKER: {tag:"el-date-picker"},
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // 赋值rules
      this.formRules = this.fieldRules;

      // 初始化Field默认状态，
      let tempFieldValue = {};
      let tempFieldProps = {};
      let tempFieldOptions = {};
      this.fieldSchemeIterator(
        this.fieldScheme,
        function({ key, fieldProps = {}, fieldOption = [] }) {
          // 初始化fieldValueMap默认值
          tempFieldValue[key] = fieldProps.value || "";
          // 初始化fieldProps默认值
          tempFieldProps[key] = fieldProps || {};
          // 初始化fieldOption默认值
          tempFieldOptions[key] = fieldOption || [];
        },
        () => {
          this.fieldValueMap = tempFieldValue;
          this.fieldPropsMap = tempFieldProps;
          this.fieldOptionMap = tempFieldOptions;
        });
    },
    /**
     * 渲染单个form-item
     * */
    renderFormItem(props) {
      const { type, label, key, fieldEvent = {} } = props;
      const fieldControl = this.fieldTypeMap[type.toUpperCase()];
      const { style = { width: "100%" }, ...attrs } = this.fieldPropsMap[key];
      if (typeof fieldControl === "undefined") {
        return console.error(`当前${type}节点不存在，请检查`);
      }
      //  slot类型
      if (type === "slot" && this.$slots[key]) {
        return <el-form-item key={key} prop={key} label={label}>
          {this.$slots[key]}
        </el-form-item>;
      }
      // 特殊状态带slot渲染
      if (fieldControl instanceof Object && fieldControl.tag) {
        let tag = fieldControl.tag;
        return <el-form-item key={key} prop={key} label={label}>
          <tag
            {...{ attrs: attrs, style }}
            {...{ on: this.proxyFieldEvent(fieldEvent) }}
            value={this.fieldValueMap[key]}
            on-input={this.inputEventDecorator(props)}
            on-blur={this.blurEventDecorator(props)}
          >
            {fieldControl.slot && fieldControl.slot.call(this, props)}
          </tag>
        </el-form-item>;
      }
      // 如果fieldControl为组件时直接渲染
      if (fieldControl instanceof Object && fieldControl.name) {
        return <el-form-item key={key} prop={key} label={label}>
          <fieldControl {...{ attrs: attrs, style }}
                        {...{ on: fieldEvent }}
                        value={this.fieldValueMap[key]}
                        on-input={this.inputEventDecorator(props)}
                        on-blur={this.blurEventDecorator(props)}
          />
        </el-form-item>;
      }
    },
    /**
     * 渲染一行表单组
     * @param scheme <Object|Array>
     * @return VNODE <el-row>
     * */
    renderFormGroup(scheme) {
      if (Array.isArray(scheme)) {
        const defaultSpanValue = 24 / scheme.length;
        return <el-row {...{ attrs: defaultRowProps }}>
          {scheme.map(col => {
            return <el-col {...{ attrs: { ...defaultColProps, span: defaultSpanValue } }}>
              {this.renderFormItem(col)}
            </el-col>;
          })}
        </el-row>;
      }
      if (Array.isArray(scheme.cols) && scheme.cols.length > 0) {
        const defaultSpanValue = 24 / scheme.cols.length;
        return <el-row {...{ attrs: scheme["layoutRowProps"] || { ...defaultRowProps, span: defaultSpanValue } }}>
          {scheme.cols.map(col => {
            return <el-col {...{ attrs: col["layoutColProps"] || { ...defaultRowProps, span: defaultSpanValue } }}>
              {this.renderFormItem(col)}
            </el-col>;
          })}
        </el-row>;
      } else {
        return this.renderFormItem(scheme);
      }
    },
    /**
     * fieldSchemeIterator
     * 初始化默认状态，遍历fieldScheme，通过queue做不同处理，queue可以是数组队列，也可以是函数
     * @param fieldScheme <Object>
     * @param queue <Array|Function>
     * @param callback <Function>
     * */
    fieldSchemeIterator(fieldScheme = {}, queue = [], callback) {
      function handleQueue(item) {
        if (Array.isArray(queue)) {
          queue.forEach(function(func) {
            func(item);
          });
        }
        if (typeof queue === "function") {
          queue(item);
        }
      }

      for (let i = 0; i < fieldScheme.length; i++) {
        const item = fieldScheme[i];
        if (!(item instanceof Object) && !(item instanceof Array)) {
          throw Error("fieldScheme中属性必须为Array或Object，请检查");
        }
        if (item.key) {
          handleQueue(item);
        }
        if (item instanceof Array) {
          for (let j = 0; j < item.length; j++) {
            handleQueue(item[j]);
          }
        }
        if (item.cols instanceof Array) {
          for (let k = 0; k < item.cols.length; k++) {
            handleQueue(item.cols[k]);
          }
        }
      }
      typeof callback === "function" && callback();
    },
    /**
     * blurEventDecorator
     * blur事件装饰函数，追加handleFormFieldChange函数调用与修改fieldValueMap指定key
     * @param props <Object> 接收组件所接收和attrs属性
     * @param func <Function> on-input逻辑本身
     * */
    blurEventDecorator({key, immediateTrigger = false, fieldEvent = {} }, func) {
      const _this = this;
      return function() {
        fieldEvent.blur && fieldEvent.blur.call(_this, _this, ...arguments);
        if (immediateTrigger === false) {
          _this.handleFormFieldChange(_this,
            {
              [key]: _this.fieldValueMap[key]
            });
          _this.handleFormChange(_this, _this.fieldValueMap);
        }
        return func && func.apply(_this, arguments);
      };
    },
    /**
     * inputEventDecorator
     * input事件装饰函数，追加handleFormFieldChange函数调用与修改fieldValueMap指定key
     * @param props <Object> 接收组件所接收和attrs属性
     * @param func <Function> on-input逻辑本身
     * */
    inputEventDecorator({ key, immediateTrigger = false, fieldEvent = {} }, func) {
      const _this = this;
      return function(value) {
        // const [value] = arguments;
        _this.fieldValueMap[key] = value;
        fieldEvent.input && fieldEvent.input.call(_this, _this, value);
        if (immediateTrigger === true) {
          _this.handleFormFieldChange(_this,
            {
              [key]: value
            });
          _this.handleFormChange(_this, _this.fieldValueMap);
        }
        return func && func.apply(_this, value);
      };
    },
    /**************************************************
     * events，发布事件
     * ************************************************/
    /**
     * proxyFieldEvent
     * 装饰所有field接收的事件，追加context参数
     * @param eventMap<Object>
     * @return  <Object> 追加函数
     * */
    proxyFieldEvent(eventMap = {}) {
      let proxyEvents = {};
      const context = this;
      for (const eventMapKey in eventMap) {
        const func = eventMap[eventMapKey];
        proxyEvents[eventMapKey] = func.bind(func, context, arguments);
      }
      return proxyEvents;
    },
    /**
     * handleFormFieldChange
     * 派发field-change事件，指定field修改时触发当时field派发的新status
     * @param context <Object>
     * @param status <Object>
     * @fire
     * */
    handleFormFieldChange(context, status) {
      this.$emit("field-change", context, status);
    },
    /**
     * handleFormChange
     * 派发form-change事件，当form中的任意field值修改时触发
     * @param context <Object>
     * @param fieldValueMap <Object>
     * @fire
     * */
    handleFormChange(context, fieldValueMap) {
      this.$emit("form-change", context, fieldValueMap);
    },
    /**************************************************
     * methods，对外所暴露API
     * ************************************************/
    resetFieldValueStatus() {
      this.$refs.form.resetFields();
    },
    setFieldValueStatus(status) {
      this.fieldValueMap = {
        ...this.fieldValueMap,
        ...status
      };
    },
    setFieldPropsStatus(key, status) {
      this.fieldPropsMap = {
        ...this.fieldPropsMap,
        [key]: { ...this.fieldPropsMap[key], ...status }
      };
    },
    setFieldOptionStatus(status) {
      this.fieldOptionMap = {
        ...this.fieldOptionMap,
        ...status
      };
    },
    getFormValueStatus() {
      return this.$refs.form.validate().then(() => {
        return this.fieldValueMap;
      });
    }
  }
};
</script>
