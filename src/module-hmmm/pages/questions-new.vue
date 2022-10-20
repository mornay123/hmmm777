<template>
  <div class="container catalogue">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ id ? '试题修改' : '试题录入' }}</span>
      </div>
      <div class="item newQuestions">
        <el-form
          ref="form"
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
            <my-city v-model="myCity"></my-city>
          </el-form-item>
          <el-form-item label="方向：" prop="direction">
            <el-select placeholder="请选择" v-model="questionForm.direction">
              <el-option
                v-for="(item, index) in directionList"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
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
            <mavon-editor
              ref="md"
              v-model="questionForm.question"
              @change="changeQuestion"
              class="mavonEditor"
              :toolbars="markdownOption"
              :ishljs="true"
              :subfield="false"
              :defaultOpen="id ? 'preview' : 'edit'"
            />
          </el-form-item>
          <el-form-item label="选项：" v-if="questionForm.questionType !== '3'">
            <question-option
              :type="questionForm.questionType"
              :optionsList="questionForm.options"
              @optionData="questionForm.options = $event"
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
          <el-form-item label="答案解析：" prop="answer">
            <mavon-editor
              ref="md"
              @change="changeAnswer"
              v-model="questionForm.answer"
              class="mavonEditor"
              :toolbars="markdownOption"
              :ishljs="true"
              :subfield="false"
              :defaultOpen="id ? 'preview' : 'edit'"
            />
          </el-form-item>
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
                :value="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="submit" :type="id ? 'success' : 'primary'">{{
              questionForm.id ? '确认修改' : '确认提交'
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import questionOption from '../components/question-option.vue'
import { simple as dirSimple } from '@/api/hmmm/directorys.js'
import { simple as tagSimple } from '@/api/hmmm/tags.js'
import { simple as subSimple } from '@/api/hmmm/subjects.js'
import { add as subData, detail, update } from '@/api/hmmm/questions.js'
import { list } from '@/api/hmmm/companys.js'
import MyCity from '../components/MyCity.vue'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
  components: { questionOption, MyCity, mavonEditor },
  data () {
    return {
      markdownOption: {
        bold: true, // 粗体
        italic: true, // 斜体
        underline: true, // 下划线
        strikethrough: true, // 中划线
        ol: true, // 有序列表
        ul: true, // 无序列表
        quote: true, // 引用
        imagelink: true, // 图片链接
        link: true, // 链接
        code: false, // code
        htmlcode: false,
        preview: true
      },
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
        options: [
          {
            code: 'A',
            img: '',
            isRight: false,
            title: ''
          },
          {
            code: 'B',
            img: '',
            isRight: false,
            title: ''
          },
          {
            code: 'C',
            img: '',
            isRight: false,
            title: ''
          },
          {
            code: 'D',
            img: '',
            isRight: false,
            title: ''
          }
        ], // 选项
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
      directionList: ['o2o', '外包服务', '企业服务', '互联网金融', '企业咨询', '互联网', '电子商务', '其他'],
      html: '',
      myCity: {
        province: '', // 城市
        city: '' // 地区
      },
      id: this.$route.query.id
    }
  },
  watch: {
    id: {
      handler () {
        if (this.id) {
          this.editQuestionById()
        }
      },
      immediate: true
    }
  },
  created () {
    this.getSubjectsList()
    this.getEnterpriseList()
  },
  methods: {
    // 所有操作都会被解析重新渲染
    changeQuestion (value, render) {
      // render 为 markdown 解析后的结果[html]
      this.questionForm.question = render
    },
    changeAnswer (value, render) {
      // render 为 markdown 解析后的结果[html]
      this.questionForm.answer = render
      // console.log(value, this.questionForm.answer)
    },
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
      const op = this.questionForm.options[this.questionForm.options.length - 1]
      const m = String.fromCharCode(op.code.charCodeAt() + 1)
      const obj = {
        code: m,
        img: '',
        isRight: false,
        title: ''
      }
      this.$set(this.questionForm.options, this.questionForm.options.length, obj)
      this.$forceUpdate()
    },
    changeQuestionType () {
      if (this.questionForm.questionType === '1') {
        this.questionForm.options = [
          {
            code: 'A',
            img: '',
            isRight: false,
            title: ''
          },
          {
            code: 'B',
            img: '',
            isRight: false,
            title: ''
          },
          {
            code: 'C',
            img: '',
            isRight: false,
            title: ''
          },
          {
            code: 'D',
            img: '',
            isRight: false,
            title: ''
          }
        ]
      }
    },
    async editQuestionById () {
      const { data } = await detail({ id: this.id })
      this.myCity.province = data.province
      this.myCity.city = data.city
      if (data.tags) {
        data.tags = data.tags.split(',')
      }
      data.options = data.options.map(item => {
        if (item.isRight) {
          item.isRight = true
        } else {
          item.isRight = false
        }
        return item
      })
      this.questionForm = data
      this.changeSubject()
    },
    async submit () {
      try {
        this.questionForm.province = this.myCity.province
        this.questionForm.city = this.myCity.city
        await this.$refs.form.validate()
        if (this.id) {
          this.questionForm.tags = this.questionForm.tags.join(',')
          await update(this.questionForm)
          this.$message.success('修改成功')
          this.id = ''
        } else {
          await subData(this.questionForm)
          this.$message.success('添加成功')
        }
        this.$router.push('/questions/list')
      } catch (e) {
        console.log(e)
      } finally {
        this.$refs.form.resetFields()
        this.myCity = {
          province: '', // 城市
          city: '' // 地区
        }
        this.questionForm = {
          subjectID: '', // 学科
          catalogID: '', // 目录
          enterpriseID: '', // 企业
          province: '', // 城市
          city: '', // 地区
          direction: '', // 方向
          questionType: '1', // 题型
          difficulty: '1', // 难度
          question: '', // 题干
          options: [
            {
              code: 'A',
              img: '',
              isRight: false,
              title: ''
            },
            {
              code: 'B',
              img: '',
              isRight: false,
              title: ''
            },
            {
              code: 'C',
              img: '',
              isRight: false,
              title: ''
            },
            {
              code: 'D',
              img: '',
              isRight: false,
              title: ''
            }
          ], // 选项
          videoURL: '', // 解析视频
          answer: '', // 答案解析
          remarks: '', // 题目备注
          tags: ''// 试题标签
        }
      }
    }
  }
}
</script>

<style lang='less' scoped>
/deep/ .newQuestions {
  .mavonEditor {
    z-index: 0;
    max-height: 200px !important;
    box-shadow: #ccc 0px 0px 0px 1px !important;
    .v-note-op {
      border-bottom: 1px solid #ccc;
    }
  }
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
}
</style>
