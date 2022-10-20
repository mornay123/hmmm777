<template>
  <div class="container">
    <el-card class="box-card">
      <div style="display: flex; justify-content: space-between">
        <div class="leftLayout">
          <div class="keyword">关键字</div>
          <el-input v-model="keyword" placeholder="根据编号搜索"> </el-input>
        </div>

        <div class="grid-content bg-purple-light">
          <el-button size="small" @click="clearBtn">清除</el-button>
          <el-button size="small" type="primary" @click="searchBtn"
            >搜索</el-button
          >
        </div>
      </div>

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
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="编号" prop="id"> </el-table-column>
        <el-table-column
          label="题型"
          prop="questionType"
          :formatter="questionTypeFormatter"
        >
        </el-table-column>
        <el-table-column
          label="题目编号"
          prop="questionIDs"
          :formatter="questionIDsFormatter"
        >
        </el-table-column>
        <el-table-column label="录入时间" prop="addTime"> </el-table-column>
        <el-table-column label="答题时间(s)" prop="totalSeconds">
        </el-table-column>
        <el-table-column label="正确率(%)" prop="accuracyRate">
        </el-table-column>
        <el-table-column label="录入人" prop="userName"> </el-table-column>
        <el-table-column align="left" label="操作">
          <template slot-scope="{ row }">
            <el-button
              class="delBtn"
              size="mini"
              @click="handleDel(row)"
              icon="el-icon-delete"
              title="删除"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <PageTool
        @pageChange="pageChange"
        @pageSizeChange="pageSizeChange"
        :total="total"
        :paginationPage="page.page"
        :paginationPagesize="page.pagesize"
      ></PageTool>
    </el-card>
  </div>
</template>

<script>
import PageTool from '../../module-manage/components/page-tool.vue'
import { randoms, removeRandoms } from '../../api/hmmm/questions'
// import { difficulty } from '../../api/hmmm/constants'
export default {
  name: 'QuestionsRandoms',
  components: { PageTool },
  data () {
    return {
      tableData: [{
        id: '', // 编号
        questionType: '', // 题型
        questionIDs: [], // 题目编号(后端返回的是数组,formater格式化)
        addTime: '', // 录入事件
        totalSeconds: '', // 答题时间
        accuracyRate: '', // 正确率
        userName: '' // 录入人
      }],
      total: 0,
      page: {
        page: 1,
        pagesize: 5
      },
      keyword: ''
    }
  },
  created () {
    this.randoms()
  },
  methods: {
    async randoms () {
      const { data } = await randoms({ ...this.page, keyword: this.keyword })
      console.log('组题列表', data)
      this.tableData = data.items
      this.total = data.counts
      this.page.page = data.page
      this.page.pagesize = data.pagesize
    },
    clearBtn () {
      this.keyword = ''
    },
    searchBtn () {
      this.tableData.filter(item => item.id === this.keyword)
      this.randoms()
    },
    questionTypeFormatter (row, column, cellValue) {
      if (cellValue === '1') {
        return '简单'
      }
      if (cellValue === '2') {
        return '一般'
      }
      if (cellValue === '3') {
        return '困难'
      }
    },
    questionIDsFormatter (row, column, cellValue) {
      // console.log('cellValue', cellValue)
      let str = ''
      cellValue.forEach(item => { // 拼接字符串
        str += item.number
      })
      return str
    },
    async handleDel (row) { // 删除功能
      try {
        await this.$confirm('此操作将永久删除该题目,是否继续?', '删除提示', {
          cancelButtonText: '取消', // 组件封装
          confirmButtonText: '确定',
          type: 'warning'
        })
        await removeRandoms(row)
        this.$message.success('删除成功')
        this.randoms()
      } catch (error) {
        console.log(error)
      }
    },
    pageChange (e) {
      console.log(e)
      this.page.page = e
      this.randoms()
    },
    pageSizeChange (e) {
      this.page.pagesize = e
      this.randoms()
    }
  }
}
</script>

<style scoped lang='less'>
.leftLayout {
  width: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  .keyword {
    width: 70px;
    font-weight: 700;
  }
}

// 共多少条记录
.pageBox {
  background-color: #f4f4f5;
  color: #909399;
  font-size: 14px;
  padding: 10px;
  margin-top: 20px;
  margin-bottom: 10px;
  .el-icon-warning {
    margin-right: 10px;
  }
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
</style>
