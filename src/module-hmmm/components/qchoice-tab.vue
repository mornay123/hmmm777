<template>
  <div>
    <el-row
      style="
        background-color: #f4f4f5;
        color: #909399;
        margin-bottom: 15px;
        padding: 8px 16px;
        border-radius: 4px;
      "
    >
      <i class="el-icon-info"></i>
      <span style="font-size: 13px"> 数据一共{{ counts }}条</span>
    </el-row>
    <!-- tab栏表格 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      highlight-current-row
      header-row-class-name="theadStyle"
    >
      <el-table-column prop="number" label="试题编号" width="150">
      </el-table-column>
      <el-table-column prop="subject" label="学科" width="120">
      </el-table-column>
      <el-table-column prop="catalog" label="目录" width="120">
      </el-table-column>
      <el-table-column prop="questionType" label="题型" width="120">
        <template slot-scope="{ row }">
          {{
            row.questionType == 1
              ? '单选'
              : row.questionType == 2
              ? '多选'
              : '简答'
          }}
        </template>
      </el-table-column>
      <el-table-column prop="question" label="题干" width="300">
        <template slot-scope="{ row }">
          {{ row.question?.substring(4, row.question.length - 4) }}
        </template>
      </el-table-column>
      <el-table-column prop="addDate" label="录入时间" width="200">
        <template slot-scope="{ row }">
          {{ row.addDate?.substring(0, 19).split('T').join(' ') }}
        </template>
      </el-table-column>
      <el-table-column prop="difficulty" label="难度" width="120">
        <template slot-scope="{ row }">
          {{
            row.difficulty == 1 ? '简单' : row.difficulty == 2 ? '一般' : '困难'
          }}
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="录入人" width="120">
      </el-table-column>
      <el-table-column prop="chkState" label="审核状态" width="120">
        <template slot-scope="{ row }">
          {{
            row.chkState === 0
              ? '待审核'
              : row.chkState === 1
              ? '已审核'
              : '已拒绝'
          }}
        </template>
      </el-table-column>
      <el-table-column prop="chkRemarks" label="审核意见" width="120">
      </el-table-column>
      <el-table-column prop="chkUser" label="审核人" width="120">
      </el-table-column>
      <el-table-column prop="publishState" label="发布状态" width="120">
        <template slot-scope="{ row }">
          {{ row.publishState === 0 ? '已发布' : '待发布' }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="{ row }">
          <el-button @click="preview(row)" type="text" size="small"
            >预览</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="check(row)"
            :disabled="row.chkRemarks?.length !== 0"
            >审核</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="edit(row)"
            :disabled="row.publishState === 1"
            >修改</el-button
          >
          <el-button type="text" size="small" @click="upDown(row)">
            {{ row.publishState ? '下架' : '上架' }}
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="del(row)"
            :disabled="row.publishState === 1"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end" align="middle" style="margin-top: 20px">
      <el-pagination
        background
        @size-change="getList"
        @current-change="getList"
        :total="counts"
        :current-page.sync="page.page"
        :page-size.sync="page.pagesize"
        :page-sizes="[5, 10, 20, 50]"
        layout=" prev, pager, next,sizes, jumper"
      >
      </el-pagination>
    </el-row>
    <!-- 预览 -->
    <preview-dialog
      :dialogVisiblePreview.sync="dialogVisiblePreview"
      :currData="currData"
    />
    <!-- 审核 -->
    <check-dialog
      :dialogVisibleCheck.sync="dialogVisibleCheck"
      :currId="currId"
    />
    <!-- 上下架 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisibleUpDown"
      width="50%"
      :before-close="upDownClose"
      class="upDownDialog"
    >
      <i class="el-icon-warning" style="color: #e6a23c,font-size:16px"></i>
      <span>你确定{{ currData.publishState ? '下架' : '上架' }}这道题吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="upDownClose">取 消</el-button>
        <el-button type="primary" @click="upDownSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisibleDel"
      width="50%"
      :before-close="delClose"
      class="upDownDialog"
    >
      <i class="el-icon-warning" style="color: #e6a23c,font-size:16px"></i>
      <span>此操作将永久删除该题目, 是否继续?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delClose">取 消</el-button>
        <el-button type="primary" @click="delSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { choice, detail, choicePublish, remove } from '@/api/hmmm/questions'
import PreviewDialog from './questionsChoice/previewDialog.vue'
import CheckDialog from './questionsChoice/checkDialog.vue'

export default {
  name: 'QchoiceTab',
  components: {
    PreviewDialog,
    CheckDialog
  },
  props: {
    activeName: {
      type: [String, Number],
      default: 'first'
    },
    checkFormdata: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      tableData: [{
        number: 'number',
        subject: 'subject',
        catalog: 'catalog',
        questionType: 'questionType',
        question: 'question',
        addDate: 'addDate',
        difficulty: 'difficulty',
        creator: 'creator',
        chkState: 'chkState',
        chkRemarks: 'chkRemarks',
        chkUser: 'chkUser',
        publishState: 'publishState'
      }],
      counts: 0,
      page: {
        page: 1,
        pagesize: 5
      },
      pages: 0,
      dialogVisiblePreview: false,
      currData: {},
      dialogVisibleCheck: false,
      currId: '',
      dialogVisibleUpDown: false,
      dialogVisibleDel: false
    }
  },
  created () {
    this.getList()
  },
  computed: {
  },
  methods: {
    async getList () {
      let params = { ...this.page, ...this.checkFormdata }
      if (this.activeName !== 'first') params = { ...this.page, ...this.checkFormdata, chkState: this.activeName }
      const { data } = await choice(params)
      this.tableData = data.items
      this.counts = data.counts * 1
      this.page.page = data.page * 1
      this.pages = data.pages * 1
      this.page.pagesize = data.pagesize * 1
    },
    async preview (row) {
      const { data } = await detail({ id: row.id })
      this.currData = data
      this.dialogVisiblePreview = true
    },
    check (row) {
      this.dialogVisibleCheck = true
      this.currId = row.id
      this.getList()
    },
    edit (row) {
      this.$router.push({
        path: '/questions/new',
        query: { id: row.id }
      })
      this.getList()
    },
    upDown (row) {
      this.dialogVisibleUpDown = true
      this.currData = row
    },
    async upDownSubmit () {
      let publishState = this.currData.publishState
      if (publishState === 1) {
        publishState = 0
      } else {
        publishState = 1
      }
      await choicePublish({ id: this.currData.id, publishState })
      this.getList()
    },
    upDownClose () {
      this.dialogVisibleUpDown = false
    },
    del (row) {
      this.dialogVisibleDel = true
      this.currData = row
      this.getList()
    },
    async delSubmit () {
      await remove({ id: this.currData.id })
      this.getList()
    },
    delClose () {
      this.dialogVisibleDel = false
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .upDownDialog {
  .el-dialog__header {
    background-color: #fff;
    .el-dialog__title {
      color: black;
    }
  }
}
</style>
