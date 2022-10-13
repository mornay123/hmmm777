<template>
  <div class="container catalogue">
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="20">
          <el-form :inline="true" class="demo-form-inline" label-width="80px">
            <el-form-item label="目录名称">
              <el-input v-model.trim="tableparams.directoryName"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-select placeholder="请输入" v-model="tableparams.state">
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button @click="clearSearch">清除</el-button>
              <el-button type="primary" @click="getTableList">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4" style="text-align: right">
          <el-button type="success" @click="isShowAddDialog = true"
            >新增目录</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-alert
        title="数据一共10条"
        type="info"
        show-icon
        :closable="false"
        style="margin-bottom: 15px"
      >
      </el-alert>
      <el-table
        hide-on-single-page
        v-loading="loading"
        :data="tableList"
        style="width: 100%"
        header-row-class-name="tableHeader"
      >
        <el-table-column min-width="80px" label="序号" type="index">
        </el-table-column>
        <el-table-column
          min-width="83px"
          v-for="(item, index) in tableHeader"
          :key="index"
          :label="item.label"
          :prop="item.prop"
        ></el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="{ row }">
            <el-link type="primary" @click="toggleState(row)">
              {{ row.state === '已启用' ? '禁用' : '启用' }} </el-link
            >&nbsp;&nbsp;
            <el-link
              :type="row.state === '已启用' ? 'info' : 'primary'"
              :disabled="row.state === '已启用' ? true : false"
              @click="edit(row)"
              >修改 </el-link
            >&nbsp;&nbsp;
            <el-link
              :type="row.state === '已启用' ? 'info' : 'primary'"
              :disabled="row.state === '已启用' ? true : false"
              @click="del(row)"
              >删除</el-link
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        class="fenye"
        background
        @size-change="getTableList"
        @current-change="getTableList"
        :page-size.sync="tableparams.pagesize"
        :current-page.sync="tableparams.page"
        :page-sizes="[5, 10, 20, 50]"
        layout="prev, pager, next,sizes,jumper"
        :total="counts"
      >
      </el-pagination>
    </el-card>
    <directorys-add
      :isShowAddDialog="isShowAddDialog"
      @isShowAddDialog="isShowAddDialog = false"
      ref="add"
    ></directorys-add>
  </div>
</template>

<script>
import { list, changeState, remove } from '@/api/hmmm/directorys.js'
import dayjs from 'dayjs'
import directorysAdd from '../components/directorys-add.vue'
export default {
  components: { directorysAdd },
  data () {
    return {
      tableparams: {
        page: 1,
        pagesize: 10,
        directoryName: null,
        state: null
      },
      tableList: [],
      tableHeader: [
        { label: '所属学科', prop: 'subjectName' },
        { label: '目录名称', prop: 'directoryName' },
        { label: '创建者', prop: 'username' },
        { label: '创建日期', prop: 'addDate' },
        { label: '面试题数量', prop: 'totals' },
        { label: '状态', prop: 'state' }
      ],
      loading: false,
      counts: null,
      pages: '',
      currPage: '',
      pagesize: '',
      isShowAddDialog: false
    }
  },
  created () {
    this.getTableList()
  },
  methods: {
    async getTableList () {
      try {
        this.loading = true
        const { data } = await list(this.tableparams)
        this.tableList = data.items.map((item) => {
          item.addDate = dayjs(item.addDate).format('YYYY-MM-DD HH:mm:ss')
          item.state = item.state ? '已启用' : '已禁用'
          return item
        })
        this.counts = data.counts
        this.currPage = data.page
        this.pages = data.pages
        this.pagesize = data.pagesize
        this.loading = false
      } catch (e) {
        console.log(e)
      }
    },
    clearSearch () {
      this.tableparams = {
        page: 1,
        pagesize: 10,
        directoryName: null,
        state: null
      }
      this.getTableList()
    },
    async toggleState (row) {
      try {
        const data = {
          id: row.id,
          state: row.state === '已禁用' ? 1 : 0
        }
        await changeState(data)
        this.getTableList()
        this.$message.success('操作成功')
      } catch (e) {
        this.$message.error('操作失败')
        console.log(e)
      }
    },
    async del (row) {
      try {
        await this.$confirm('此操作将永久删除该目录, 是否继续?', '提示', { type: 'warning' })
        await remove(row)
        this.getTableList()
        this.$message.success('删除成功')
      } catch (e) {
        console.log(e)
      }
    },
    edit (row) {
      this.$refs.add.formData = { ...row }
      this.isShowAddDialog = true
    }
  }
}
</script>

<style lang='less'>
.catalogue {
  padding: 10px;
  .tableHeader {
    th.el-table__cell.is-leaf {
      background-color: #fafafa !important;
      border-bottom: 2px solid #e8e8e8;
    }
  }
  .fenye {
    text-align: right;
    margin-top: 30px;
  }
}
</style>
