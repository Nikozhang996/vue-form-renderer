## TableRenderer——表格生成器

> table-renderer 是基于 el-table 上二次封装，集成原有属性与方法。通过 JSONCOnfig 形式自动生成表格，减少 HTML 标签编写，提高开发效率的同时保证了代码的可读性。

### Feature

- 通过简单的 JSON 配置即可自动生成表格状态
- 属性和方法都继承自 element 原生
- 右侧操作栏也可自动生成

### Attributes

|    参数     |      说明      |     类型     |               可选值               | 默认值 |
| :---------: | :------------: | :----------: | :--------------------------------: | :----: |
| data-source |   显示的数据   |    Array     | 与 el-table 中的原生 data 属性一致 |   -    |
|   columns   |  显示字段配置  |    Array     |            columns 配置            |   -    |
| action-bar  | 右侧操作栏配置 | Array/Object |                 -                  | Array  |

#### columns 配置

实际上 columns 中的 item 是把每项属性都注入到 Table-column Attributes 中，所以这里只列出常用的配置项，具體可看 ElementUI 文档中的 Table-column Attributes

|   属性    |     说明     |                  类型                   | 是否必填 | 默认值 |
| :-------: | :----------: | :-------------------------------------: | :------: | :----: |
|   prop    |   展示字段   |                 String                  |   true   |   -    |
|   label   | 当前字段表头 |                 String                  |  false   |   -    |
| formatter |  格式化函数  | Function(row, column, cellValue, index) |  false   |   -    |

```javascript
```

#### action-bar item 配置

action-bar 默认为 Array 类型,灵活操作可以用 Object 状态。可看调用示例

|  属性  |                  说明                  |     类型      | 是否必填 | 默认值 |
| :----: | :------------------------------------: | :-----------: | :------: | :----: |
| label  |               展示 label               |    String     |   true   |   -    |
|  key   |              必须为唯一值              |    String     |   true   |   -    |
| handle | 过滤函数,可由此控制 visible 或其他属性 | Function(row) |  false   |   -    |

```javascript
<table-renderer :action-bar="tableActionBar"/>

tableActionBar = [
  {
    label: "按钮A",
    key: "a",
    handle: (row) => {
      return {
        visible: handler()
      };
    },
  },
  {
    label: "按钮B",
    key: "b",
  },
  {
    label: "按钮C",
    key: "c",
  }
];

tableActionBar ={
  isDropdown:false,
  width:120,
  buttons:[
  {
    label: "按钮A",
    key: "a",
  },
  {
    label: "按钮B",
    key: "b",
  },
  {
    label: "按钮C",
    key: "c",
  }
]}
```

### Events

table-renderer 内部使用`v-on="$listeners"`继承了所有方法到 el-table 上,所以原生 el-table 支持的事件都可以直接绑定。当然我们也做了拓展,补充了`operation-click`方法。

|     事件名      |           说明           |     参数     |
| :-------------: | :----------------------: | :----------: |
| operation-click | 点击右侧操作栏按钮时触发 | key, { row } |

```javascript
<table-renderer @operation-click="onTableOperationClick"/>

async onTableOperationClick(key, { row }) {
  this.currentRowData = row;
  if (key === "a") {
    // todo
  }
  if (key === "b") {
    // todo
  }
  if (key === "c") {
    // todo
  }
}

```

### 完整调用示例

```html
<table-renderer
  height="100%"
  :data-source="data"
  :columns="tableColumns"
  border
  size="mini"
  :dropdown="false"
  @cell-click="handleCellClick"
  :action-bar="tableActionBar"
  @operation-click="onTableOperationClick"
  v-on="$listeners"
></table-renderer>
```

```javascript
// 处理Cell点击事件
async handleCellClick(row, column) {
  this.currentRowData = row;
  switch (column.property) {
    case "relation": // 拨打外呼
      this.isShow.outBound = true;
      break;
    case "ifTest": // 定级测评
      if (row.ifTest) {
        this.isShow.reportDetail = true;
      }
      break;
    case "tmkConfirm": // 确认排课状态
      this.isShow.scheduleProgress = true;
      break;
  }
},

tableColumns: [
  {
    label: "学员",
    prop: "studentId",
    minWidth: "180px",
    fixed: "left",
    formatter: row => {
      return <UserFieldCell name={row.name} id={row.studentId} />;
    }
  },
  { prop: "studentStatus", label: "状态" },
  {
    prop: "hoardingEndTime",
    label: "囤课结束日期",
    width: "120px",
    sortable: "custom"
  },
  {
    label: "家长",
    prop: "relation",
    width: "200px",
    formatter: row => (
      return row.a===1?true:false;
    )
  },
  { prop: "attendClass", label: "年级", width: "100px" },
]

tableActionBar = [
  {
    label: "按钮A",
    key: "a",
    handle: (row) => {
      return {
        visible: handler()
      };
    },
  },
  {
    label: "按钮B",
    key: "b",
  },
  {
    label: "按钮C",
    key: "c",
  }
];

async onTableOperationClick(key, { row }) {
  this.currentRowData = row;
  if (key === "a") {
    // todo
  }
  if (key === "b") {
    // todo
  }
  if (key === "c") {
    // todo
  }
}

```
