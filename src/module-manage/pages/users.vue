<template>
  <div>
    <el-card class="box-card">
      <div class="topBox">
        <span>
          <el-input
            v-model="search"
            class="inputBox"
            placeholder="根据用户名搜索"
          ></el-input>
          <el-button size="small" @click="clearInput">清空</el-button>
          <el-button type="primary" size="small" @click="searchBtn"
            >搜索</el-button
          >
        </span>
        <span>
          <el-button
            type="success"
            size="small"
            icon="el-icon-edit"
            class="addBtn"
            @click="addUser"
            >新增用户</el-button
          >
        </span>
      </div>
      <!-- 共多少条记录 -->
      <el-row>
        <el-col>
          <div class="pageBox">
            <i class="el-icon-warning"></i>
            <span>共 {{ total }} 条记录</span>
          </div>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column label="序号" prop="id"> </el-table-column>
        <el-table-column label="邮箱" prop="email"> </el-table-column>
        <el-table-column label="联系电话" prop="phone"> </el-table-column>
        <el-table-column label="用户名" prop="username"> </el-table-column>
        <el-table-column label="权限组名称" prop="permission_group_title">
        </el-table-column>
        <el-table-column label="角色" prop="role"> </el-table-column>
        <el-table-column align="right" label="操作">
          <template slot-scope="scope">
            <el-button
              class="editBtn"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              class="delBtn"
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              icon="el-icon-delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <!-- <el-pagination
        class="pageLayout"
        background
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="10"
        :current-page="currentPage"
        layout="sizes, prev, pager,next, jumper"
        :total="80"
      >
      </el-pagination> -->
      <PageTool
        @pageChange="list"
        @pageSizeChange="list"
        :total="total"
        :paginationPage="page.page"
        :paginationPagesize="page.pagesize"
      ></PageTool>

      <!-- 新增/编辑按钮 -->
      <UserAdd
        ref="refUserAdd"
        :PermissionGroupsList="PermissionGroupsList"
        :dialogFormVisible.sync="dialogFormVisible"
        :userId="userId"
        @refleshList="list"
      ></UserAdd>
    </el-card>
  </div>
</template>

<script>
import PageTool from '../components/page-tool.vue'
import UserAdd from '../components/user-add.vue'
import { list, remove } from '../../api/base/users'
import { simple } from '../../api/base/permissions'

export default {
  name: 'Users',
  components: { PageTool, UserAdd },
  data () {
    return {
      search: '',
      tableData: [{
        id: 1,
        email: 'root@admin.com',
        phone: '',
        username: '',
        permission_group_title: '',
        role: ''
      }],
      total: 0,
      page: {
        page: 1,
        pagesize: 5
      },
      disabled: 0,
      keyword: '',
      PermissionGroupsList: [],
      dialogFormVisible: false,
      userId: 0,
      loading: false
    }
  },

  created () {
    this.list()
  },

  methods: {
    async list () {
      try {
        this.loading = true
        const { data } = await list({
          page: this.page.page,
          pagesize: this.page.pagesize,
          keyword: this.keyword,
          disabled: this.disabled
        })
        console.log(data)
        this.tableData = data.list
        this.total = data.counts
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    clearInput () {
      this.search = ''
      this.list()
    },
    searchBtn () {
      if (this.search.trim) {
        this.tableData = this.tableData.filter(item => item.username === this.search.trim)
      } else {
        this.list()
      }
    },
    async addUser () { // 点击新增用户,先获取到权限简单列表
      this.dialogFormVisible = true
      const { data } = await simple(this.keyword) // 权限简单列表
      this.PermissionGroupsList = data
    },
    handleEdit (index, row) {
      console.log(index, row)
      this.userId = row.id
      this.row = row
      this.$refs.refUserAdd.formBase = { ...row }
      this.dialogFormVisible = true
      // this.formBase.password = undefined
    },
    async handleDelete (index, row) {
      try {
        // console.log(index, row)
        await this.$confirm('确认删除该员工吗', '提示', { type: 'warning' })
        await remove(row)
        this.list()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped lang='less'>
.box-card {
  min-height: 700px;
  margin: 25px;
  .topBox {
    display: flex;
    justify-content: space-between;
    .inputBox {
      width: 200px;
      margin-right: 10px;
    }
  }
  .pageBox {
    background-color: #f4f4f5;
    color: #909399;
    font-size: 14px;
    padding: 10px;
    margin-top: 20px;
    .el-icon-warning {
      margin-right: 10px;
    }
  }

  // 编辑/删除按钮
  .editBtn {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-color: #ecf5ff;
    color: #50a0ff;
    font-size: 16px;
    &:hover {
      background-color: #409eff;
      color: #fff;
    }
  }
  .delBtn {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-color: #fef0f0;
    color: #f56c6c;
    font-size: 16px;
    &:hover {
      background-color: #f56c6c;
      color: #fff;
    }
  }
}
</style>
