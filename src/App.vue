<template>
  <div id="app">
    <form-renderer
      class="form-renderer"
      ref="formRenderer"
      :field-scheme="formConfig"
      :field-rules="formRules"
    />
  </div>
</template>

<script>
import FormRenderer from "./components/FormRenderer";
export default {
  name: "App",
  components: {
    FormRenderer
  },
  data() {
    return {
      formRules: {
        categoryPid: [
          { required: true, message: "请选择课类/阶段", trigger: "blur" }
        ],
        chapterNumberId: [
          { required: true, message: "请选择课件", trigger: "blur" }
        ],
        date: [{ required: true, message: "请选择上课日期", trigger: "blur" }],
        time: [{ required: true, message: "请选择上课时间", trigger: "blur" }],
        duration: [
          { required: true, message: "请选择上课时长", trigger: "blur" }
        ],
        teacherId: [
          { required: true, message: "请选择活动区域", trigger: "blur" }
        ]
      },
      formConfig: [
        [
          {
            type: "SELECT",
            key: "chapterNumberId",
            label: "课件",
            fieldProps: {
              placeholder: "请选择课件"
            }
          }
        ],
        [
          {
            type: "DATE_PICKER",
            key: "date",
            label: "上课日期",
            fieldProps: {
              "value-format": "yyyy-MM-dd",
              placeholder: "请选择上课日期"
            }
          },
          {
            type: "TIME_PICKER",
            key: "time",
            label: "上课时间",
            fieldProps: {
              format: "HH:mm",
              "value-format": "HH:mm",
              placeholder: "请选择上课时间"
            }
          }
        ],
        [
          {
            type: "INPUT_NUMBER",
            key: "duration",
            label: "上课时长（分钟）",
            fieldProps: {
              value: 60,
              min: 1,
              controlsPosition: "right"
            }
          },
          {
            type: "SELECT",
            key: "teacherId",
            label: "主讲人",
            fieldProps: {
              defaultInit: true,
              filterable: true,
              remote: true,
              "remote-method": async value => {
                // http://docs.auth.wdsw.cn/v1/admindept/33b4658a819c77e185c0c5e03f94ef0f.html
                const { code, data } = await this.$http.auth.get("/v1/admins", {
                  params: {
                    search: value,
                    __fields: "nickname,id"
                  }
                });
                code === 0 &&
                  this.$refs.formRenderer.setFieldOptionStatus({
                    teacherId: data.map(item => ({
                      key: item.id,
                      value: item.nickname
                    }))
                  });
              }
            }
          }
        ]
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.form-renderer {
  width: 600px;
  border: 1px solid red;
  margin: 0 auto;
  padding: 10px;
  border-radius: 10px;
}
</style>
