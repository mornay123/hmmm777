<template>
  <div class="container">
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      @open="onOpen"
    >
      <el-row class="rowLayout">
        <el-col :span="6"
          ><div class="grid-content bg-purple">
            【题型】 : {{ tableData.questionType }}
          </div></el-col
        >
        <el-col :span="6"
          ><div class="grid-content bg-purple-light">
            【编号】 : {{ tableData.id }}
          </div></el-col
        >
        <el-col :span="6"
          ><div class="grid-content bg-purple">
            【难度】 : {{ tableData.difficulty }}
          </div></el-col
        >
        <el-col :span="6"
          ><div class="grid-content bg-purple-light">
            【标签】 : {{ tableData.tags }}
          </div></el-col
        >
      </el-row>

      <el-row>
        <el-col :span="6"
          ><div class="grid-content bg-purple">
            【学科】 : {{ tableData.subjectName }}
          </div></el-col
        >
        <el-col :span="6"
          ><div class="grid-content bg-purple-light">
            【目录】 : {{ tableData.directoryName }}
          </div></el-col
        >
        <el-col :span="6"
          ><div class="grid-content bg-purple">
            【方向】 : {{ tableData.direction }}
          </div></el-col
        >
      </el-row>

      <el-divider></el-divider>
      <!-- 单选题预览 -->
      <div v-if="tableData.questionType === '单选'">
        【题干】:123
        <p v-html="tableData.question" style="color: #5454ff"></p>
        <div>
          {{ tableData.questionType }}题 选项 : (以下选中的选项为正确答案)
        </div>
        <div>
          <p>
            <el-radio
              v-model="radioList"
              v-for="item in tableData.options"
              :key="item.id"
              :label="item.isRight"
              >{{ item.title }}</el-radio
            >
          </p>
        </div>
      </div>
      <!-- 多选题预览 -->
      <div v-else-if="tableData.questionType === '多选'">
        【题干】:
        <p v-html="tableData.question" style="color: #5454ff"></p>
        <div>
          {{ tableData.questionType }}题 选项 : (以下选中的选项为正确答案)
        </div>
        <div>
          <el-checkbox-group
            v-model="checkList"
            style="display: flex; flex-direction: column"
          >
            <el-checkbox
              v-for="item in tableData.options"
              :key="item.id"
              :label="item.isRight"
              >{{ item.title }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
      </div>
      <!-- 简单题预览 -->
      <div v-else>
        【题干】:
        <p v-html="tableData.question" style="color: #5454ff"></p>
      </div>

      <el-divider></el-divider>

      <div>
        【参考答案】:
        <el-button type="danger">视频答案预览</el-button>
        <div>
          <video
            :src="tableData.videoURL"
            controls="controls"
            style="margin-top: 10px"
          ></video>
        </div>
      </div>

      <el-divider></el-divider>

      <div>
        【答案解析】:
        <p v-html="tableData.answer"></p>
      </div>

      <el-divider></el-divider>

      <div>【题目备注】: {{ tableData.remarks }}</div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { detail } from '../../api/hmmm/questions'
import { questionType, difficulty } from '../../api/hmmm/constants'
// import questionsPreview from './questionsPreview.js'
export default {
  name: 'QuestionsPreview',
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      dialogVisible: false,
      tableData: {},
      radioList: 1,
      checkList: [1]
    }
  },
  methods: {
    confirm () {
      this.dialogVisible = false
    },
    async onOpen () {
      this.getDetails()
    },
    async getDetails () {
      const { data } = await detail(this.row)
      console.log('试题详情', data) // 注意:里面的questionType是字符串

      questionType.forEach(item => { // 请求了数据立马处理成'单选多选简答',而不是1,2,3
        if (+data.questionType === item.value) {
          data.questionType = item.label
        }
      })
      difficulty.forEach(item => { // 请求了数据立马处理成'单简单一般困难',而不是1,2,3
        if (+data.difficulty === item.value) {
          data.difficulty = item.label
        }
      })
      this.tableData = data
    }
  }
}
</script>

<style scoped lang='less'>
.rowLayout {
  margin-bottom: 25px;
}
</style>
