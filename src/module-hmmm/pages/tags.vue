<template>
  <div class="container">

  <el-row type="flex">
    <el-col :span="22">
      <el-form
      :inline="true"
      :model="listparameter"
      class="demo-form-inline"
      ref="form"
    >
        <el-form-item label="标签名称">
        <el-input v-model="listparameter.tagName"></el-input>
      </el-form-item>
       <el-form-item label="状态">
        <el-select v-model="listparameter.state">
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
        </el-select>
      </el-form-item>
        <el-form-item>
        <el-button @click="del">清除</el-button>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
     </el-form>
    </el-col>
    <el-col :span="2">
        <el-button type="success" icon="el-icon-edit" class="right" @click="add">新增标签</el-button
        >
    </el-col>
 </el-row>
    <!-- 表单 -->
    <!-- 提示条 -->
    <el-alert class="Copywriting" type="info" show-icon>
      <template #title>
        <p> 数据一共{{countsnum}}条</p>
      </template>
    </el-alert>
    <!-- 表格 -->
    <el-table
      :header-cell-style="{ background: '#e8e8e8' }"
      :data="tableData"
      :row-style="{ height: '57px' }"
      style="width: 100%"
    >
      <el-table-column label="序号" type="index" width="70"> </el-table-column>
      <el-table-column prop="subjectName" label="所属学科" width="180">
      </el-table-column>
      <el-table-column prop="tagName" label="标签名称"> </el-table-column>
      <el-table-column prop="username" label="创建者"> </el-table-column>
      <el-table-column prop="addDate" label="创建日期"> </el-table-column>
      <el-table-column prop="state" label="状态"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
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
    <tags-add ref="tagsadd" :dialogVisible="dialogVisible" :subject="subject" @closedialog='dialogVisible=false' />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import TagsAdd from '../components/tags-add.vue'
import { list, simple, changeState, remove } from '@/api/hmmm/tags.js'
export default {
  components: {
    TagsAdd
  },
  data () {
    return {
      tableData: [],
      listparameter: {
        page: 1,
        pagesize: 10,
        tagName: null,
        state: null
      },
      dialogVisible: false,
      subject: [],
      getchangeid: '',
      countsnum: null
    }
  },
  created () {
    this.getlist()
    this.getsimple()
  },
  methods: {
    //  标签列表
    async getlist () {
      const { data } = await list(this.listparameter)
      this.countsnum = data.counts
      this.tableData = data.items.map((item) => {
        item.addDate = dayjs(item.addDate).format('YYYY-MM-DD HH:mm:ss')
        item.state = item.state ? '已启用' : '已禁用'
        return item
      })
    },
    // 标签列表搜索
    async onSubmit () {
      this.getlist()
    },
    // 清空
    del () {
      this.listparameter = {
        page: 1,
        pagesize: 10,
        tagName: null,
        state: null
      }
    },
    // 标签简单列表
    async getsimple () {
      const { data } = await simple()
      this.subject = data
    },
    // 新增标签
    add () {
      console.log('添加')
      this.dialogVisible = true
    },
    // 修改
    getchange (row) {
      console.log('修改')
      this.$refs.tagsadd.form = { ...row }
      this.dialogVisible = true
    },
    // 标签状态
    async handleEdit (row) {
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
    }
  }
}

</script>

<style lang='less' scoped>
// scoped
.container {
  margin-top: 10px;
  padding: 20px;
  background-color: #fff;
  .Copywriting {
    margin-bottom: 16px;
  }
  .block {
    text-align: right;
    margin-top: 20px;
  }
  .right{
    margin-left: 0px;
  }
}
</style>
