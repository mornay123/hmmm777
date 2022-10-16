<template>
  <div class="container">
    <el-card>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item width="60px">
              <el-input
                placeholder="根据用户名搜索"
                v-model.trim="user"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="user = ''">清除</el-button>
              <el-button type="primary" @click="search">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8" style="display: flex; justify-content: flex-end">
          <el-button icon="el-icon-edit" type="success" @click="addPermission"
            >新增权限组</el-button
          >
        </el-col>
      </el-row>
      <el-row
        style="
          background-color: #f4f4f5;
          color: #909399;
          padding: 8px 16px;
          border-radius: 4px;
          margin-bottom: 20px;
        "
      >
        <span style="font-size: 13px">
          <i class="el-icon-warning" />
          共 2 条记录
        </span>
      </el-row>
      <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        header-cell-class-name="head-row"
        cell-class-name="other-row"
      >
        <el-table-column type="selection"> </el-table-column>

        <el-table-column prop="title" label="用户" align="center">
        </el-table-column>
        <el-table-column label="日期" sortable>
          <template slot-scope="scope">{{
            scope.row.create_date?.substring(0, 10)
          }}</template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              class="editBtn"
              @click="updatePermission(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              class="delBtn"
              @click="delPermission(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-row type="flex" justify="end" align="middle" style="height: 60px">
        <el-pagination
          background
          :current-page.sync="page.page"
          :page-size.sync="page.pagesize"
          layout="prev, pager, next ,sizes,jumper"
          :total="counts"
          :page-sizes="[10, 20, 30, 50]"
          @current-change="getList"
          @size-change="getList"
        >
        </el-pagination>
      </el-row>
    </el-card>
    <!-- 新增权限组 -->
    <permissions-add
      ref="dialog"
      :text="text"
      :pageTitle="pageTitle"
      :ruleInline="ruleInline"
      @handleCloseModal="handleCloseModal"
      @newDataes="newDataes"
    />
  </div>
</template>

<script>
import { list, remove } from '@/api/base/permissions'
import PermissionsAdd from '../components/permissions-add'
export default {
  data () {
    return {
      user: '',
      tableData: [], // 表格list
      multipleSelection: [], // 弹窗树状图的数据
      page: {
        page: 1,
        pagesize: 10
      },
      counts: 20,
      dialogFormVisible: false,
      ruleInline: {
        title: [
          { required: true, message: '用户名不能为空', trigger: ' blur' }
        ]
      },
      loading: false,
      text: '创建',
      pageTitle: '权限组'
    }
  },
  components: {
    PermissionsAdd
  },

  created () {
    this.getList()
  },

  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 渲染表格
    async getList () {
      try {
        this.loading = true
        const { data } = await list(this.page)
        this.tableData = data.list
        this.counts = data.counts
      } finally {
        this.loading = false
      }
    },
    // 搜索
    async search () {
      if (this.user) {
        const { data } = await list({
          page: this.page.page,
          pagesize: this.page.pagesize,
          title: this.user
        })
        this.tableData = data.list
        this.counts = data.counts
      } else {
        this.getList()
      }
    },
    async addPermission () {
      this.$refs.dialog.handleResetForm() // 重置表单
      this.$refs.dialog.dialogFormV() // 打开弹框
      this.text = '创建'
    },
    async updatePermission (row) {
      // console.log(row)
      this.$refs.dialog.handleResetForm() // 重置表单
      this.$refs.dialog.dialogFormV() // 打开弹框
      this.text = '编辑'
      this.$refs.dialog.hanldeEditForm(row.id) // 编辑详情数据加载
    },
    async delPermission (row) {
      await remove({ id: row.id })
      this.getList()
    },
    // 取消关闭
    handleCloseModal () {
      this.$refs.dialog.dialogFormH() // 关闭弹窗
    },
    // 修改或者添加完
    newDataes (formBase) {
      this.getList() // 表格重绘
      this.$message.success(formBase.id ? '权限编辑成功' : '权限新增成功') // 提示信息
    }
  }
}
</script>

<style lang='less'>
.container {
  margin: 10px;
  .el-table .head-row {
    background: #fafafa;
    padding: 20px 0;
  }
  .el-table .other-row {
    padding: 20px 0;
  }
  .editBtn {
    color: #409eff;
    background: #ecf5ff;
    border-color: #b3d8ff;
  }
  .editBtn:focus,
  .editBtn:hover {
    background: #409eff;
    border-color: #409eff;
    color: #fff;
  }
  .delBtn {
    color: #f56c6c;
    background: #fef0f0;
    border-color: #fbc4c4;
  }
  .delBtn:focus,
  .delBtn:hover {
    background: #f78989;
    border-color: #f78989;
    color: #fff;
  }
}
</style>
