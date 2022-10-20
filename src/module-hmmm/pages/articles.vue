<template>
  <div class="container">
    <!-- 表单 -->
    <el-row type="flex">
  <el-col :span="22">
    <el-form :inline="true" :model="listparameter" class="demo-form-inline">
      <el-form-item label="标签名称">
        <el-input v-model="listparameter.keyword" placeholder="根据文章标题搜索"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="listparameter.state">
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button  @click="del">清除</el-button>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    </el-col>
     <el-col :span="2">
       <el-button type="success" icon="el-icon-edit" class="right" @click="add">新增标签</el-button>
    </el-col>
     </el-row>
    <!-- 提示条 -->
   <el-alert class="Copywriting" type="info" show-icon>
      <template #title>
        <p> 数据一共{{countsnum}}条</p>
      </template>
    </el-alert>
  <!-- 表格 -->
  <el-table
    :header-cell-style="{background:'#e8e8e8'}"
    :data="tableData"
    :row-style="{height:'57px'}"
    style="width: 100%">
    <el-table-column
      prop="date"
      label="序号"
      type="index"
      width="70">
    </el-table-column>
    <el-table-column
      prop="title"
      label="文章标题"
      >
    </el-table-column>
    <el-table-column
      prop="visits"
      label="阅读数">
    </el-table-column>
     <el-table-column
      prop="username"
      label="录入人">
    </el-table-column>
     <el-table-column
      prop="createTime"
      label="录入时间">
    </el-table-column>
     <el-table-column
      prop="address"
      label="状态"
      width="100"
      >
    </el-table-column>
     <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-link type="primary" :underline="false" @click="getpreview(row)">预览&nbsp;&nbsp;</el-link>
          <el-link type="primary" :underline="false" @click="handleEdit(row)">
            {{ row.state === "已启用" ? "禁用" : "启用" }} &nbsp;
            &nbsp;</el-link
          >
          <el-link
             @click="getchange(row)"
            :underline="false"
            :type="row.state === '已启用' ? 'info' : 'primary'"
            :disabled="row.state==='已启用' ? true:false"
            >修改 &nbsp; &nbsp;</el-link
          >
          <el-link
          @click="getremove(row)"
          :underline="false"
          :type="row.state === '已启用' ? 'info' : 'primary'"
          :disabled="row.state==='已启用' ? true:false"
          >删除</el-link>
        </template>
      </el-table-column>
  </el-table>
  <!-- 分页 -->
  <div class="block">
    <el-pagination
      background
      @size-change="getlist"
      @current-change="getlist"
      :current-page.sync="listparameter.page"
      :page-sizes="[5, 10, 20, 50]"
      :page-size.sync="listparameter.pagesize"
      layout="prev, pager, next,sizes,jumper"
      :total="countsnum"
     >
    </el-pagination>
  </div>
  <!-- 弹框 -->
  <!-- 添加 -->
   <tags-add :dialogVisibleadd="dialogVisibleadd"  @closedialogadd="dialogVisibleadd=false" ref="tagsadd"/>
  <!-- 预览 -->
   <articles-preview :articleBody="articleBody" :dialogVisible="dialogVisible"  @closedialog="dialogVisible=false"/>
 </div>
</template>

<script>
import dayjs from 'dayjs'
import TagsAdd from '../components/articles-add.vue'
import ArticlesPreview from '../components/articles-preview.vue'
import { list, changeState, remove } from '@/api/hmmm/articles.js'
export default {
  components: {
    TagsAdd,
    ArticlesPreview
  },
  data () {
    return {
      tableData: [],
      listparameter: {
        page: 1,
        pagesize: 10,
        keyword: null,
        state: null
      },
      dialogVisible: false,
      dialogVisibleadd: false,
      countsnum: null,
      articleBody: {}
    }
  },
  created () {
    this.getlist()
  },
  methods: {
    // 文章列表
    async  getlist () {
      const { data } = await list(this.listparameter)
      this.countsnum = data.counts
      this.tableData = data.items.map((item) => {
        item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
        item.state = item.state ? '已启用' : '已禁用'
        return item
      })
    },
    // 列表搜索
    onSubmit () {
      this.getlist()
    },
    // 清除
    del () {
      console.log('清除')
      this.listparameter = {
        page: 1,
        pagesize: 10,
        keyword: null,
        state: null
      }
    },
    // 标签的状态
    async  handleEdit (row) {
      const dataa = {
        id: row.id,
        state: row.state === '已禁用' ? '1' : '0'
      }
      await changeState(dataa)
      this.getlist()
      this.$message.success('操作成功')
    },
    // 删除
    async getremove (row) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          type: 'warning'
        })
        await remove(row)
        this.$message.success('删除成功')
        this.getlist()
      } catch (err) {
        console.log(err)
      }
    },
    // 新增技巧按钮
    add () {
      this.dialogVisibleadd = true
      console.log('点击了新增技巧按钮')
    },
    // 修改
    getchange (row) {
      console.log('修改')
      this.$refs.tagsadd.form = { ...row }
      this.dialogVisibleadd = true
    },
    // 预览
    getpreview (row) {
      this.articleBody = row
      this.dialogVisible = true
    }
  }
}
</script>

<style lang='less' scoped>
// scoped
.container{
  margin-top: 10px;
  padding: 20px;
  background-color: #fff;
  .Copywriting{
    margin-bottom: 16px;
  }
  .right{
    margin-left: 0px;
  }
  .block{
    text-align: right;
    margin-top: 20px;
  }
}
</style>
