<template>
  <div class="container">
    <el-card>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form :inline="true" label-position="right" label-width="80px">
            <el-form-item label="学科名称">
              <el-input v-model="subjectName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="subjectName = ''">清除</el-button>
              <el-button type="primary" @click="getList">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4">
          <el-button type="success" icon="el-icon-edit" @click="addSubject"
            >新增学科</el-button
          >
        </el-col>
      </el-row>
      <el-row
        style="
          background-color: #f4f4f5;
          color: #909399;
          padding: 8px 16px;
          border-radius: 4px;
        "
      >
        <i class="el-icon-info"></i>
        <span style="margin-left: 10px; font-size: 13px">数据一共17条</span>
      </el-row>
      <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="subjectName" label="学科名称"> </el-table-column>
        <el-table-column prop="creatorID" label="创建者"> </el-table-column>
        <el-table-column prop="addDate" label="创建日期" width="150px">
          <template slot-scope="{ row }">
            {{ dayjsChange(row.addDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="isFrontDisplay" label="前台是否显示">
          <template slot-scope="{ row }">
            {{ row.isFrontDisplay ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column prop="twoLevelDirectory" label="二级目录">
        </el-table-column>
        <el-table-column prop="tags" label="标签"> </el-table-column>
        <el-table-column prop="totals" label="题目数量"> </el-table-column>
        <el-table-column label="操作" width="250px">
          <template slot-scope="{ row }">
            <el-button type="text" @click="jumpDirectory(row)"
              >学科分类</el-button
            >
            <el-button type="text" @click="jumoTags(row)">学科标签</el-button>
            <el-button type="text" @click="editSubject(row)">修改</el-button>
            <el-button type="text" @click="delSubject(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end" style="margin: 10px">
        <el-pagination
          @size-change="getList"
          @current-change="getList"
          :current-page.sync="page"
          :page-sizes="[5, 10, 20, 50]"
          :page-size.sync="pagesize"
          layout=" prev, pager, next, sizes,jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-card>
    <!-- 新增、修改學科 -->
    <el-dialog :title="title" :visible.sync="dialogVisibleAdd" width="35%">
      <el-form
        ref="form"
        :model="dialogForm"
        label-width="100px"
        @close="onClose"
        :rules="rules"
      >
        <el-form-item label="学科名称" prop="subjectName">
          <el-input
            v-model="dialogForm.subjectName"
            placeholder="请输入学科名称"
          />
        </el-form-item>
        <el-form-item label="是否显示">
          <el-switch
            v-model="dialogForm.isFrontDisplay"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { list, add, remove } from '@/api/hmmm/subjects'
export default {
  name: 'Subjects',
  data () {
    return {
      subjectName: '',
      tableData: [],
      page: 1,
      pagesize: 10,
      pages: 1,
      total: 0,
      title: '新增学科',
      dialogVisibleAdd: false,
      dialogForm: {
        id: null,
        isFrontDisplay: 1,
        subjectName: ''
      },
      rules: {
        subjectName: [{ required: true, message: '请输入学科名称', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    async getList () {
      const { data } = await list({ subjectName: this.subjectName, page: this.page, pagesize: this.pagesize })
      this.page = +data.page
      this.pagesize = +data.pagesize
      this.pages = +data.pages
      this.total = +data.counts
      this.tableData = data.items
    },
    dayjsChange (data) {
      return dayjs(data).format('YYYY-MM-DD HH:mm:ss')
    },
    // 学科分类
    jumpDirectory (row) {
      this.$router.push({
        path: '/subjects/directorys/',
        query: {
          id: row.id,
          name: row.subjectName
        }
      })
    },
    // 学科标签
    jumoTags (row) {
      this.$router.push({
        path: '/subjects/tags/',
        query: {
          id: row.id,
          name: row.subjectName
        }
      })
    },
    addSubject () {
      this.dialogVisibleAdd = true
      this.title = '新增学科'
    },
    onSubmit () {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        await add(this.dialogForm)
        this.getList()
        this.onClose()
      })
    },
    onClose () {
      this.dialogVisibleAdd = false
      this.$refs.form.resetFields()
      this.dialogForm = {
        id: null,
        isFrontDisplay: 1,
        subjectName: ''
      }
    },
    editSubject (row) {
      this.title = '修改学科'
      this.dialogForm = {
        id: row.id,
        isFrontDisplay: row.isFrontDisplay,
        subjectName: row.subjectName
      }
      this.dialogVisibleAdd = true
    },
    // 删除
    delSubject (row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(row)
        this.getList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    }

  }
}
</script>

<style scoped lang='less'>
::v-deep .container {
  margin-top: 20px;
  .el-message-box__header {
    background-color: #fff;
    color: black;
  }
}
</style>
