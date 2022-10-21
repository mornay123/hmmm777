<template>
  <el-dialog
    title="题目预览"
    :visible="dialogVisiblePreview"
    width="800px"
    @close="onClose"
  >
    <el-row :gutter="20" style="padding: 10px 0">
      <el-col :span="6">
        <div>
          【题型】：
          {{
            currData.questionType == 1
              ? '单选'
              : currData.questionType == 2
              ? '多选'
              : '简答'
          }}题
        </div>
      </el-col>
      <el-col :span="6"
        ><div>【编号】：{{ currData.id }}</div></el-col
      >
      <el-col :span="6"
        ><div>
          【难度】：{{
            currData.difficulty == 1
              ? '简单'
              : currData.difficulty == 2
              ? '一般'
              : '困难'
          }}
        </div></el-col
      >
      <el-col :span="6"
        ><div>【标签】：{{ currData.tags }}</div></el-col
      >
    </el-row>
    <el-row :gutter="20" style="padding: 10px 0">
      <el-col :span="6"
        ><div>【学科】：{{ currData.subjectName }}</div></el-col
      >
      <el-col :span="6"
        ><div>【目录】：{{ currData.directoryName }}</div></el-col
      >
      <el-col :span="6"
        ><div>【方向】：{{ currData.direction }}</div></el-col
      >
    </el-row>
    <hr />
    <el-row :gutter="20"><el-col :span="24">【题干】：</el-col></el-row>
    <el-row :gutter="20"
      ><el-col :span="24">{{
        currData.question?.substring(4, currData.question.length - 4)
      }}</el-col></el-row
    >
    <hr />
    <el-row :gutter="20">
      <el-col :span="24">
        【参考答案】：
        <el-button type="danger" @click="videoShow = true"
          >视频答案预览</el-button
        ><br />
        <video controls v-show="videoShow" :src="currData.videoURL" />
      </el-col>
    </el-row>
    <hr />
    <el-row :gutter="20">
      <el-col :span="24">
        【答案解析】：{{
          currData.answer?.substring(4, currData.answer.length - 4)
        }}
      </el-col>
    </el-row>
    <hr />
    <el-row :gutter="20">
      <el-col :span="24">【题目备注】：{{ currData.remarks }}</el-col>
    </el-row>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onClose">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogVisiblePreview: {
      type: Boolean,
      default: false
    },
    currData: {
      type: Object,
      default: () => ([])
    }
  },
  data () {
    return {
      videoShow: false
    }
  },
  methods: {
    onClose () {
      this.$emit('update:dialogVisiblePreview', false)
    }
  }
}
</script>

<style>
</style>
