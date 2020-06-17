## FormRenderer——表单生成器

> form-renderer 是基于 el-form 上二次封装，集成表单常用控件（select,radio,cascder,input,input-number,switch,checkbox,rate,time-picker,date-picker）并与现有的 select-renderer 和 cascder-renderer 兼容。
>
> 通过`form-scheme`配置快速生成模板，提高开发效率与减少业务层的代码冗余。

### Feature

- 通过简单的 JSON 配置即可自动生成表单状态
- 集成常用的控件并与现有的 renderer 系列组件集成
- 属性和方法都继承自 element 原生
- 通过 context 提供的方法可以实现表单控件联动

### Attributes

|    参数     |           说明            |  类型  |                      可选值                      |         默认值         |
| :---------: | :-----------------------: | :----: | :----------------------------------------------: | :--------------------: |
| form-props  | 表单 el-form 所接收的属性 | Object | 接收规则与 el-form 原生 Form Attributes 属性相同 | {labelPosition: 'top'} |
| form-rules  |       表单校验规则        | Array  |      接收规则与 el-form 原生 rules 属性相同      |           -            |
| form-scheme |         表单配置          | Array  |                        -                         |           -            |

#### form-scheme 配置

|    属性    |                   说明                    |  类型  |        可选值        | 默认值 |
| :--------: | :---------------------------------------: | :----: | :------------------: | :----: |
|    type    |            指定表单 field 类型            | String | 请看 type 可选值内容 | input  |
|    key     | 设置 el-form-item 的 props 值（必须唯一） | String |                      |   -    |
|   label    |       设置 el-form-item 的 label 值       | String |          -           |   -    |
| fieldProps |        表单 field 所绑定的属性集合        | Object |          -           |   -    |
| fieldEvent |        表单 field 所绑定的事件集合        | Object |          -           |   -    |

fieldProps 和 fieldEvent 都会通过`{...{attrs: fieldProps}} {...{on: fieldEvent}}`继承到 field 组件中，所以 ElementUI 原生组件所接收的事件和方法都支持。下面写法是等价的

所有 fieldEvent 中的方法内部都会被装饰器模式包装在原有回调参数上添加`context`，context 其实就是 FormRenderer 组件实例的`this`，所以可以通过 context 得到内部的所有 data 和 methods，这个思想是借鉴了 koa.js 中的中间件思路。

```javascript
<el-select value="10" filterable multiple placeholder="""请选择"/>

const config = {
type:'SELECT',
 key: "teacherId",
label: "选择器",
 fieldProps: {
 value:10,
 multiple:true,
 filterable: true,
 placeholder: "请选择",
 }
 };
```

#### form-scheme[type] 值映射表

|       key        |                         说明                         |
| :--------------: | :--------------------------------------------------: |
|      select      |                 原生 el-select 下拉                  |
|      radio       |                 原生 el-radio-group                  |
|     cascder      |              原生 el-cascder 级联选择器              |
|      input       |                原生 el-input 输入控件                |
|   input-number   |                 原生 el-input-number                 |
|      switch      |                    原生 el-switch                    |
|     checkbox     |                 原生 el-select 下拉                  |
|       rate       |                     原生 el-rate                     |
|   time-picker    |              原生 el-time-picker 选择器              |
|   date-picker    |              原生 el-date-picker 选择器              |
| select-renderer  |  集成 select-renderer，具体请看 SelectRenderer 文档  |
| cascder-renderer | 集成 cascder-renderer，具体请看 CascderRenderer 文档 |

### Events

|   事件名称   |                              说明                               |            回调参数            |
| :----------: | :-------------------------------------------------------------: | :----------------------------: |
| form-change  | form 内容发生变更时触发（field-change 触发必定触发 form-change) | context, fieldValueMap<Object> |
| field-change |                   form-item 值发生变更时触发                    |  context, fieldStats<Object>   |

### methods

|       方法名称       |                        说明                        |                        参数                        |
| :------------------: | :------------------------------------------------: | :------------------------------------------------: |
| setFieldValueStatus  |             设置 field 绑定的 value 值             |  {key:field 中指定的 key 值,value:<Any>:赋值新值}  |
| setFieldPropsStatus  |             设置 field 绑定的 props 值             | {key:field 中指定的 key 值,value<Object>:赋值新值} |
| setFieldOptionStatus |            设置 field 绑定的 option 值             | {key:field 中指定的 key 值,value<Array>:赋值新值}  |
|  getFormValueStatus  | 获取表单内容，返回一个 Promise，内部会触发表单校验 |                         -                          |

### 调用示例

```html
<template>
  <form-renderer
    ref="formRenderer"
    :field-scheme="formConfig"
    :field-rules="formRules"
  />
</template>
<script type="text/jsx">
  export default {
    name: 'RoomFormPanel',
    props: {
      roomId: {
        type: [Number, String],
        require: false
      }
    },
    data() {
      return {
        currentUserData: {},
        formRules: {
          categoryPid: [
            {required: true, message: '请选择课类/阶段', trigger: 'blur'}
          ],
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
              type: 'CASCADER_RENDERER',
              key: 'categoryPid',
              label: '课类/阶段',
              fieldProps: {
                type: "COURSE_CATEGORY",
                placeholder: "请选择课类/阶段",
                props:{
                  emitPath: true
                }
              },
              fieldEvent: {
                input: async (context, value) => {
                  context.setFieldValueStatus({
                    chapterNumberId: ""
                  });
                  const {code, data} = await this.$http.crm.post(
                          "api/chapter/categoryChapter",
                          {
                            cateId: value[1]
                          }
                  );
                  if (code === 200) {
                    context.setFieldOptionStatus({
                      chapterNumberId: data.map(({chapterName, id}) => {
                        return {value: chapterName, key: id};
                      })
                    });
                  }
                }
              }
            },
            {
              type: 'SELECT',
              key: "chapterNumberId",
              label: '课件',
              fieldProps: {
                placeholder: "请选择课件",
              },
            }
          ],
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
                  // http://docs.auth.wdsw.cn/v1/admindept/33b4658a819c77e185c0c5e03f94ef0f.html
                  const {code, data} = await this.$http.auth.get('/v1/admins', {
                    params: {
                      search: value,
                      __fields: 'nickname,id'
                    }
                  });
                  code === 0 && this.$refs.formRenderer.setFieldOptionStatus({
                    teacherId: data.map(item => ({key: item.id, value: item.nickname}))
                  });
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
        // return this.$refs.form.validate().then(() => this.formData)
        return this.$refs.formRenderer.getFormValueStatus();
      }
    }
  };
</script>
```

## 踩坑笔记

- [使用 Vue Styleguidist 编写组件文档](https://www.jianshu.com/p/e6745ed87563)
- [Component with model props throws error](https://github.com/vuejs/jsx/issues/49)
- [Arguments 对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments)
- [JS 严格模式（use strict）下不能使用 arguments.callee 的替代方案](https://www.cnblogs.com/moqiutao/p/7509991.html)
