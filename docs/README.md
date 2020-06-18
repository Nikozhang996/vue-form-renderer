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
