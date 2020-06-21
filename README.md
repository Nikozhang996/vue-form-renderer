# vue-form-renderer——表单生成器
> form-renderer 是基于 el-form 上二次封装，集成表单常用控件（select,radio,cascder,input,input-number,switch,checkbox,rate,time-picker,date-picker）并与现有的 select-renderer 和 cascder-renderer 兼容。
>
> 通过`form-scheme`配置快速生成模板，提高开发效率与减少业务层的代码冗余。

### Feature

- 通过简单的 JSON 配置即可自动生成表单状态
- 集成常用的控件并与现有的 renderer 系列组件集成
- 属性和方法都继承自 element 原生
- 通过 context 提供的方法可以实现表单控件联动

### Quick Start
```
yarn install vue-form-renderer
or
npm install vue-form-renderer -S

import VueFormRenderer from 'vue-form-renderer';
Vue.use(VueFormRenderer);
```

```html
<template>
  <form-renderer
    ref="formRenderer"
    :field-scheme="formConfig"
    :field-rules="formRules"
  />
</template>
```
```javascript
<script type="text/jsx">
  export default {
    data() {
      return {
        formRules: {
          chapterNumberId: [
            {required: true, message: '请选择课件', trigger: 'blur'}
          ],
          date: [
            {required: true, message: '请选择上课日期', trigger: 'blur'}
          ],
          time: [
            {required: true, message: '请选择上课时间', trigger: 'blur'}
          ],
          duration: [
            {required: true, message: '请选择上课时长', trigger: 'blur'}
          ],
          teacherId: [
            {required: true, message: '请选择活动区域', trigger: 'blur'}
          ],
        },
        formConfig: [
          [
            {
              type: 'DATE_PICKER', key: "date", label: "上课日期",
              fieldProps: {
                "value-format": 'yyyy-MM-dd',
                placeholder: "请选择上课日期",
              }
            },
            {
              type: 'TIME_PICKER', key: "time", label: "上课时间",
              fieldProps: {
                format: "HH:mm",
                "value-format": 'HH:mm',
                placeholder: "请选择上课时间",
              }
            }
          ],
          [
            {
              type: 'INPUT_NUMBER', key: "duration", label: "上课时长（分钟）",
              fieldProps: {
                value: 60,
                min: 1,
                controlsPosition: "right"
              }
            },
            {
              type: 'SELECT',
              key: "teacherId",
              label: "主讲人",
              fieldProps: {
                defaultInit: true,
                filterable: true,
                remote:true,
                'remote-method': async value => {
                  
                }
              }
            }
          ],
        ]
      }
    },
    methods: {
      /**
       * 编辑时设置表单状态
       * */
      setFormData(data) {
        this.$refs.formRenderer.setFieldValueStatus(data);
      },
      /**
       * 获取表单value值
       * */
      getFormData() {
        return this.$refs.formRenderer.getFormValueStatus();
      }
    }
  }
</script>
```


### License
MIT
