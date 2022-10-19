<template>
  <div class="container">
    <el-card>
      <el-row type="flex" justify="end" style="margin-bottom: 20px">
        <el-button
          type="success"
          icon="el-icon-edit"
          @click="$router.push('/questions/new')"
          >新增试题</el-button
        >
      </el-row>
      <el-form
        :inline="true"
        :model="formInline"
        label-position="right"
        label-width="80px"
        class="demo-form-inline"
        size="small"
      >
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="学科">
              <el-select
                v-model="formInline.subjectID"
                placeholder="请选择"
                @change="subjectChange"
              >
                <el-option
                  v-for="item in subjectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="二级目录">
              <el-select v-model="formInline.creatorID" placeholder="请选择">
                <el-option
                  v-for="item in directoryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="标签">
              <el-select v-model="formInline.tags" placeholder="请选择">
                <el-option
                  v-for="item in tagOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="关键字">
              <el-input
                v-model="formInline.keyword"
                placeholder="根据题干搜索"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="试题类型">
              <el-select v-model="formInline.questionType" placeholder="请选择">
                <el-option label="单选" value="1"></el-option>
                <el-option label="多选" value="2"></el-option>
                <el-option label="简答" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="难度">
              <el-select v-model="formInline.difficulty" placeholder="请选择">
                <el-option label="简单" value="1"></el-option>
                <el-option label="一般" value="2"></el-option>
                <el-option label="困难" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="方向">
              <el-select v-model="formInline.direction" placeholder="请选择">
                <el-option label="o2o" value="o2o"></el-option>
                <el-option label="外包服务" value="外包服务"></el-option>
                <el-option label="企业服务" value="企业服务"></el-option>
                <el-option label="互联网金融" value="互联网金融"></el-option>
                <el-option label="企业咨询" value="企业咨询"></el-option>
                <el-option label="互联网" value="互联网"></el-option>
                <el-option label="电子商务" value="电子商务"></el-option>
                <el-option label="其他" value="其他"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="录入人">
              <el-select v-model="formInline.creatorID" placeholder="请选择">
                <el-option
                  v-for="item in creatorOptions"
                  :key="item.id"
                  :label="item.username"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="题目备注">
              <el-input v-model="formInline.remarks"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="企业简称">
              <el-input v-model="formInline.shortName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="城市">
              <el-select v-model="formInline.province" placeholder="请选择">
                <el-option
                  v-for="item in provinces"
                  :label="item"
                  :value="item"
                  :key="item"
                ></el-option>
              </el-select>
              <el-select v-model="formInline.city" placeholder="请选择">
                <el-option
                  v-for="item in citys"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button @click="clearForm">清除</el-button>
              <el-button type="primary" @click="search">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="first">
          <QchoiceTab
            ref="taball"
            :formInline="formInline"
            :checkFormdata="checkFormdata"
          />
        </el-tab-pane>
        <el-tab-pane label="待审核" name="0">
          <QchoiceTab
            ref="tab0"
            activeName="0"
            :checkFormdata="checkFormdata"
          />
        </el-tab-pane>
        <el-tab-pane label="已审核" name="1">
          <QchoiceTab
            ref="tab1"
            activeName="1"
            :checkFormdata="checkFormdata"
          />
        </el-tab-pane>
        <el-tab-pane label="已拒绝" name="2">
          <QchoiceTab
            ref="tab2"
            activeName="2"
            :checkFormdata="checkFormdata"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import QchoiceTab from '../components/qchoice-tab'
import { simple } from '@/api/hmmm/subjects'
import { provinces, citys } from '@/api/hmmm/citys'
import { simple as userSimple } from '@/api/base/users'
import { simple as tagSimple } from '@/api/hmmm/tags'
import { simple as directorySimple } from '@/api/hmmm/directorys'
export default {
  name: 'QuestionsChoice',
  components: {
    QchoiceTab
  },
  data () {
    return {
      formInline: {
        subjectID: '',
        creatorID: '',
        tags: '',
        keyword: '',
        difficulty: '',
        direction: '',
        remarks: '',
        shortName: '',
        province: '',
        city: ''
      },
      activeName: 'first',
      // 搜索选项卡
      subjectOptions: [],
      creatorOptions: [],
      provinces: provinces(),
      tagOptions: [],
      directoryOptions: [],
      // 搜索后form有值的数据
      checkFormdata: {}
    }
  },

  created () {
    this.getFormOptions()
  },
  computed: {
    citys () {
      return citys(this.formInline.province)
    }
  },
  watch: {
  },
  methods: {
    handleClick (tab, event) {
      // console.log(tab, event)
      const active = this.activeName
      if (active === 'first') this.$refs.taball.getList()
      if (active === '0') this.$refs.tab0.getList()
      if (active === '1') this.$refs.tab1.getList()
      if (active === '2') this.$refs.tab2.getList()
    },
    async getFormOptions () {
      const { data } = await simple()
      this.subjectOptions = data
      const { data: res } = await userSimple()
      this.creatorOptions = res
    },
    async subjectChange () {
      if (this.formInline.subjectID) {
        const params = { subjectID: this.formInline.subjectID }
        const { data: res1 } = await tagSimple(params)
        const { data: res2 } = await directorySimple(params)
        this.tagOptions = res1
        this.directoryOptions = res2
      }
    },
    clearForm () {
      this.formInline = {
        subjectID: '',
        creatorID: '',
        tags: '',
        keyword: '',
        difficulty: '',
        direction: '',
        remarks: '',
        shortName: '',
        province: '',
        city: ''
      }
      this.checkFormdata = {}
      this.$nextTick(() => {
        this.handleClick()
      })
    },
    search () {
      const obj = {}
      for (const key in this.formInline) {
        if (this.formInline[key] !== '') {
          obj[key] = this.formInline[key]
        }
      }
      this.checkFormdata = obj
      this.$nextTick(() => {
        this.handleClick()
      })
    }
  }
}
</script>

<style lang='less' scoped>
::v-deep .container {
  margin: 10px;
  .el-table-column {
    display: flex;
    flex-wrap: nowrap;
  }
  .el-table .theadStyle {
    background-color: #fafafa;
  }
}
</style>
