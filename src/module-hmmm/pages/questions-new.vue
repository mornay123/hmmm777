<template>
  <div class="container catalogue">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ questionForm.number ? '试题修改' : '试题录入' }}</span>
      </div>
      <div class="item newQuestions">
        <el-form
          label-width="120px"
          :model="questionForm"
          :rules="questionFormRules"
        >
          <el-form-item label="学科：" prop="subjectID">
            <el-select
              placeholder="请选择"
              v-model="questionForm.subjectID"
              @change="changeSubject"
            >
              <el-option
                v-for="item in subjectIDList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目录：" prop="catalogID">
            <el-select placeholder="请选择" v-model="questionForm.catalogID">
              <el-option
                v-for="item in catalogIDList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业：" prop="enterpriseID">
            <el-select placeholder="请选择" v-model="questionForm.enterpriseID">
              <el-option
                v-for="item in enterpriseIDList"
                :key="item.id"
                :label="item.company"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="城市：" class="city" prop="city">
            <my-city v-model="questionForm"></my-city>
          </el-form-item>
          <el-form-item label="方向：" prop="direction">
            <el-select placeholder="请选择" v-model="questionForm.direction">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="题型：" prop="questionType">
            <el-radio-group
              v-model="questionForm.questionType"
              @change="changeQuestionType"
            >
              <el-radio label="1">单选</el-radio>
              <el-radio label="2">多选</el-radio>
              <el-radio label="3">简答</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="难度：" prop="difficulty">
            <el-radio v-model="questionForm.difficulty" label="1"
              >简单</el-radio
            >
            <el-radio v-model="questionForm.difficulty" label="2"
              >一般</el-radio
            >
            <el-radio v-model="questionForm.difficulty" label="3"
              >困难</el-radio
            >
          </el-form-item>
          <el-form-item label="题干：" prop="question">
          </el-form-item>
          <el-form-item label="选项：" v-if="questionForm.questionType !== '3'">
            <question-option
              :type="questionForm.questionType"
              :optionsList="optionsList"
            ></question-option>
            <el-button
              type="danger"
              class="el-icon-plus"
              :disabled="questionForm.questionType === '1' ? true : false"
              @click="addOption"
              >增加选项与答案</el-button
            >
          </el-form-item>
          <el-form-item label="解析视频：">
            <el-input type="text" v-model="questionForm.videoURL" />
          </el-form-item>
          <el-form-item label="答案解析：" prop="answer"></el-form-item>
          <el-form-item label="题目备注：">
            <el-input
              type="textarea"
              :rows="3"
              v-model="questionForm.remarks"
            ></el-input>
          </el-form-item>
          <el-form-item label="试题标签：">
            <el-select
              placeholder="请选择"
              multiple
              v-model="questionForm.tags"
            >
              <el-option
                v-for="item in tagsList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button :type="questionForm.number ? 'success' : 'primary'">{{
              questionForm.number ? '确认修改' : '确认提交'
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import questionOption from '../components/question-option.vue'
// import RichText from '../components/rich-text.vue'
import { simple as dirSimple } from '@/api/hmmm/directorys.js'
import { simple as tagSimple } from '@/api/hmmm/tags.js'
import { simple as subSimple } from '@/api/hmmm/subjects.js'
import { list } from '@/api/hmmm/companys.js'
import MyCity from '../components/MyCity.vue'

export default {
  components: { questionOption, MyCity },
  data () {
    return {
      questionForm: {
        subjectID: '', // 学科
        catalogID: '', // 目录
        enterpriseID: '', // 企业
        province: '', // 城市
        city: '', // 地区
        direction: '', // 方向
        questionType: '1', // 题型
        difficulty: '1', // 难度
        question: '', // 题干
        options: {}, // 选项
        videoURL: '', // 解析视频
        answer: '', // 答案解析
        remarks: '', // 题目备注
        tags: ''// 试题标签
      },
      questionFormRules: {
        subjectID: [{ required: true, message: '请选择学科', trigger: 'blur' }], // 学科
        catalogID: [{ required: true, message: '请选择目录', trigger: 'blur' }], // 目录
        enterpriseID: [{ required: true, message: '请选择企业', trigger: 'blur' }], // 企业
        // province: [{ required: true, message: '请选择城市', trigger: 'blur' }], // 城市
        city: [{ required: true, message: '请选择地区', trigger: 'blur' }], // 地区
        direction: [{ required: true, message: '请选择方向', trigger: 'blur' }], // 方向
        questionType: [{ required: true, message: '请选择题型', trigger: 'blur' }], // 题型
        difficulty: [{ required: true, message: '请选择难度', trigger: 'blur' }], // 难度
        question: [{ required: true, message: '请输入题干', trigger: 'blur' }], // 题干
        answer: [{ required: true, message: '请输入答案解析', trigger: 'blur' }] // 答案解析
      },
      subjectIDList: [], // 学科列表
      catalogIDList: [], // 目录列表
      enterpriseIDList: [], // 企业列表
      tagsList: [], // 企业列表
      optionsList: ['A', 'B', 'C', 'D']
    }
  },
  created () {
    this.getSubjectsList()
    this.getEnterpriseList()
  },
  methods: {
    // 获取学科列表
    async getSubjectsList () {
      const { data } = await subSimple()
      this.subjectIDList = data
    },
    // 当学科值发生变化的时候
    changeSubject () {
      this.getCatalogList()
    },
    // 获取目录列表和标签列表
    async getCatalogList () {
      const { data: data1 } = await dirSimple({ subjectID: this.questionForm.subjectID })
      this.catalogIDList = data1
      const { data: data2 } = await tagSimple({ subjectID: this.questionForm.subjectID })
      this.tagsList = data2
    },
    // 获取企业列表
    async getEnterpriseList () {
      const { data } = await list({ pagesize: 10000 })
      this.enterpriseIDList = data.items
    },
    // 增加选项
    addOption () {
      const op = this.optionsList[this.optionsList.length - 1]
      const m = String.fromCharCode(op.charCodeAt() + 1)
      this.$set(this.optionsList, this.optionsList.length, m)
    },
    changeQuestionType () {
      if (this.questionForm.questionType === '1') {
        this.optionsList = ['A', 'B', 'C', 'D']
      }
    }
  }
}
</script>

<style lang='less'>
.newQuestions {
  .city {
    .el-input {
      width: 200px !important;
    }
  }
  .el-input {
    width: 400px !important;
  }
  .el-textarea {
    width: 400px !important;
  }
  .newQuestionsCheck {
    .el-input__inner {
      width: 240px;
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    // overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    position: relative;
    display: inline-block;
    // font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    .iconclose {
      position: absolute;
      top: -9px;
      right: -9px;
      font-size: 18px;
      z-index: 33;
      background-color: #fff;
    }
  }
  .avatar {
    width: 100px;
    height: 60px;
    display: block;
  }
}
</style>
