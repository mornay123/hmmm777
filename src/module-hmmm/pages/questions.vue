<template>
  <div class="container">
    <el-card class="box-card">
      <div class="topLayout">
        <span style="font-size: 12px; color: #ffc0ce"
          >说明：目前支持学科和关键字条件筛选</span
        >
        <span>
          <el-button
            type="success"
            size="small"
            icon="el-icon-edit"
            @click="handleEdit"
            >新增试题</el-button
          >
        </span>
      </div>

      <el-form label-width="80px" :model="formData">
        <el-row>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="学科">
                <el-select v-model="formData.subject" placeholder="请选择">
                  <el-option
                    v-for="item in simpleSubjects"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                    @click.native="loadCatalog"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <el-form-item label="二级目录">
                <el-select v-model="formData.catalog" placeholder="请选择">
                  <el-option
                    v-for="item in simpleCatalog"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="标签">
                <el-select v-model="formData.tags" placeholder="请选择">
                  <el-option
                    v-for="item in simpleTags"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <el-form-item label="关键词">
                <el-input v-model="formData.keyword"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="试题类型">
                <el-select v-model="formData.questionType" placeholder="请选择">
                  <el-option
                    v-for="item in questionType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <el-form-item label="难度" :formatter="difficultyFormatter">
                <el-select v-model="formData.difficulty" placeholder="请选择">
                  <el-option
                    v-for="item in difficulty"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="方向">
                <!-- :formatter="directionFormatter" -->
                <el-select v-model="formData.direction" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in direction"
                    :key="index"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <el-form-item label="录入人">
                <el-select v-model="formData.creatorID" placeholder="请选择">
                  <el-option
                    v-for="item in creator"
                    :key="item.id"
                    :label="item.username"
                    :value="item.username"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="题目备注">
                <el-input v-model="formData.remarks"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <el-form-item label="企业简称">
                <el-input v-model="formData.shortName"></el-input>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="城市">
                <el-select
                  v-model="formData.province"
                  placeholder="请选择"
                  class="provinceInput"
                  @keyup.enter="handleFilter"
                  @change="handleProvince"
                  filterable
                >
                  <el-option
                    v-for="item in citySelect.province"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
                <el-select
                  v-model="formData.city"
                  placeholder="请选择"
                  class="cityInput"
                  @keyup.enter="handleFilter"
                  filterable
                >
                  <el-option
                    v-for="item in citySelect.cityDate"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="grid-content btnLayout">
              <el-button size="small" class="clearBtn">清除</el-button>
              <el-button type="primary" size="small" click="searchBtn"
                >搜索</el-button
              >
            </div>
          </el-col>
        </el-row>
      </el-form>

      <!-- 共多少条记录 -->
      <el-row>
        <el-col>
          <div class="pageBox">
            <i class="el-icon-warning"></i>
            <span>数据一共 {{ total }} 条记录</span>
          </div>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column label="编号" prop="number"> </el-table-column>
        <el-table-column label="学科" prop="subjectID"> </el-table-column>
        <el-table-column label="目录" prop="catalogID"> </el-table-column>
        <el-table-column
          label="题型"
          prop="questionType"
          :formatter="questionTypeFormatter"
        >
        </el-table-column>
        <el-table-column label="题干" prop="question">
          <!-- 作用域插槽 -->
          <template slot-scope="{ row }">
            <p v-html="row.question"></p>
          </template>
        </el-table-column>
        <el-table-column
          label="录入时间"
          prop="addDate"
          :formatter="addDateFormatter"
        >
        </el-table-column>
        <el-table-column
          label="难度"
          prop="difficulty"
          :formatter="difficultyFormatter"
        >
        </el-table-column>
        <el-table-column label="录入人" prop="creator"> </el-table-column>
        <el-table-column align="left" label="操作">
          <template slot-scope="{ row }">
            <el-button
              class="viewBtn"
              size="mini"
              @click="handleView(row)"
              icon="el-icon-view"
              title="预览"
            ></el-button>
            <el-button
              class="editBtn"
              size="mini"
              @click="handleEdit(row)"
              icon="el-icon-edit"
              title="修改"
            ></el-button>
            <el-button
              class="delBtn"
              size="mini"
              @click="handleDel(row)"
              icon="el-icon-delete"
              title="删除"
            ></el-button>
            <el-button
              class="checkBtn"
              size="mini"
              type="danger"
              @click="handleCheck(row)"
              icon="el-icon-check"
              title="加入精选"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <PageTool
        @pageChange="list"
        @pageSizeChange="list"
        :total="total"
        :paginationPage="page.page"
        :paginationPagesize="page.pagesize"
      ></PageTool>

      <!-- 试题预览 -->
    </el-card>
    <QuestionsPreview ref="refQuestion" :row="row"></QuestionsPreview>
  </div>
</template>

<script>
import PageTool from '../../module-manage/components/page-tool.vue'
import { list, remove } from '../../api/hmmm/questions'
import { difficulty, questionType, direction } from '../../api/hmmm/constants'
import dayjs from 'dayjs'
import QuestionsPreview from '../components/questions-preview.vue'
import { simple } from '../../api/hmmm/subjects'
import { simple as simpleDirectorys, list as directorysList } from '../../api/hmmm/directorys'
import { simple as simpleTags } from '../../api/hmmm/tags'
import { simple as simpleUsers } from '../../api/base/users'
import { provinces, citys } from '../../api/hmmm/citys'

export default {
  name: 'BasicQuestions',
  components: { PageTool, QuestionsPreview },
  data () {
    return {
      labelPosition: 'right',
      formData: { // 上面form表单
        subject: '',
        catalog: '', // 二级目录
        tags: '', // 标签
        keyword: '', // 关键词
        questionType: '', // 试题类型
        difficulty: '', //  难度
        direction: '', // 方向
        creatorID: '', // 录入人
        remarks: '', // 题目备注
        shortName: '', // 企业简称
        province: '', // 企业所在地省份
        city: '' // 企业所在城市
      },
      tableData: [{ // 表格题目列表
        number: '', // 编号
        subjectID: 0, // 学科
        catalogID: 0, // 目录
        questionType: 0, // 题型
        question: '', // 题干
        addDate: '', // 录入时间
        difficulty: 0, // 难度
        creator: '' // 录入人
      }],
      difficulty: difficulty,
      questionType: questionType,
      direction: direction,
      total: 0,
      page: {
        page: 1,
        pagesize: 5
      },
      disabled: 0,
      value: '',
      loading: false,
      row: {}, // 测试用
      simpleSubjects: [], // 搜索框-学科-简单列表
      simpleSubjectsId: 0, // 搜索框-学科-id
      simpleCatalog: [], // 搜索框-二级目录
      simpleTags: [], // 搜索框-标签
      creator: [], // 录入人
      citySelect: {
        province: [],
        cityDate: []
      },
      catalog2: []
    }
  },
  created () {
    this.list()
    this.formList()
    this.getCityData()
  },
  methods: {
    async list () {
      const { data } = await list({ ...this.tableData, ...this.page })
      console.log('基础题库列表', data)
      this.tableData = data.items
      this.total = data.counts
      this.page.page = data.page
      this.page.pagesize = data.pagesize
      const data2 = await directorysList()
      console.log('目录总列表', data2)
      this.catalog2 = data2.data.items

      this.catalog2.forEach(ele => { // 处理目录-转换常量
        this.tableData.forEach(item => {
          item.catalogID = ele.directoryName
        })
      })
    },

    async formList () { // 获取搜索框-学科-简单列表
      const res = await simple({ subjectName: this.formData.subject })
      console.log('简单学科列表', res)
      this.simpleSubjects = res.data
      this.simpleSubjects.forEach(ele => {
        this.tableData.forEach(item => {
          if (item.subjectID === ele.value) {
            item.subjectID = ele.label
          }
        })
      })
      this.simpleCatalog.forEach(ele => { // 学科-转换数字常量
        this.tableData.forEach(item => {
          if (item.catalogID === ele.value) {
            item.catalogID = ele.label
          }
        })
      })
      // 获取搜索框-录入人-简单列表
      const res4 = await simpleUsers({ keyword: this.formData.keyword, disabled: this.disabled })
      console.log('录入人', res4)
      this.creator = res4.data
    },

    async loadCatalog () { // 点击搜索框-学科时触发此函数
      this.simpleSubjects.forEach(item => {
        if (this.formData.subject === item.label) {
          this.simpleSubjectsId = item.value
        }
      })
      if (this.simpleSubjectsId) { // 触发了学科函数,再加载二级目录
        const res2 = await simpleDirectorys({ subjectID: this.simpleSubjectsId })
        this.simpleCatalog = res2.data
        console.log('二级目录', this.simpleCatalog)
      }

      const res3 = await simpleTags({ subjectID: this.simpleSubjectsId }) // 获取搜索框标签下拉框
      console.log('标签', res3)
      this.simpleTags = res3.data
    },

    // 获取省
    getCityData: function () {
      this.citySelect.province = provinces()
    },
    // 选省获取到市
    // handleProvince () {
    //   return citys(this.formData.city)
    // },
    handleProvince: function (e) {
      console.log('9', e)
      this.citySelect.cityDate = citys(e)
      this.formData.city = this.citySelect.cityDate[0]
    },

    searchBtn () { // 搜索

    },
    clearBtn () { // 清除表单
      this.formData = {}
    },

    difficultyFormatter (row, column, cellValue) { // 难度简单困难-数字转化
      const obj = this.difficulty.find(ele => +ele.value === +cellValue)
      return obj ? obj.label : '未知'
    },
    questionTypeFormatter (row, column, cellValue) { // 题型单选多选-数字转化
      const obj = this.questionType.find(ele => +ele.value === +cellValue)
      // this.afterQuestionType = obj.label || ''
      // console.log('88', this.afterQuestionType)
      return obj ? obj.label : '未知'
    },
    addDateFormatter (row, column, cellValue) { // 时间-格式化
      return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss')
    },
    handleView (row) { // 点击预览
      this.row = row // 测试用
      this.$refs.refQuestion.dialogVisible = true
    },
    async handleEdit (row) {
      // console.log('编辑的row', row)
      this.$router.push('/questions/new')
      //  this.tableData.items.id ? await update(this.tableData.items.id) : await add(this.tableData.items)
      // const res = await update(this.tableData.items.id)
      // console.log('编辑', res)
      // const res2 = await add(this.tableData.items)
      // console.log('新增', res2)
    },
    async handleDel (row) {
      try {
        console.log(row.id)
        await this.$confirm('此操作将永久删除该题目,是否继续?', '删除提示', {
          cancelButtonText: '取消', // 组件封装
          confirmButtonText: '确定',
          type: 'warning'
        })
        await remove(row)
        this.list()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    async handleCheck (row) {
      try {
        console.log(row.id)
        await this.$confirm('此操作将该题目加入精选,是否继续?', '删除提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        })
        this.$message.success('加入精选成功')
        this.$router.push('/questions/choice')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped lang='less'>
.topLayout {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 15px;
  margin-top: -10px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.el-select {
  width: 310px;
}
.provinceInput {
  width: 150px;
  margin-right: 10px;
}
.cityInput {
  width: 150px;
}
.btnLayout {
  padding-left: 270px;
}

// 共多少条记录
.pageBox {
  background-color: #f4f4f5;
  color: #909399;
  font-size: 14px;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  .el-icon-warning {
    margin-right: 10px;
  }
}

//  四个小按钮
.el-table_1_column_9 {
  padding-right: -10px;
}
.viewBtn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #ecf5ff;
  color: #4ba9ff;
  padding: 0 0;
  font-size: 14px;
}
.editBtn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f0f9eb;
  color: #8fc33f;
  padding: 0 0;
  font-size: 14px;
  margin-right: 5px;
}
.delBtn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #fef0f0;
  color: #f88182;
  padding: 0 0;
  font-size: 14px;
  margin-left: 0;
}
.checkBtn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #fdf6ec;
  color: #eaa75d;
  padding: 0px 0px;
  font-size: 14px;
}
</style>
