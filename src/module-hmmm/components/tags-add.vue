<template>
  <div class="container">
    <!-- <el-button type="text" @click="dialogVisible = true"
      >点击打开 Dialog</el-button
    > -->
    <el-dialog
      :title="form.id===null?'新增目录':'修改目录'"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="closedialog"
    >
      <!-- 表格 -->
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="所属学科"  width="80">
          <el-select v-model="form.subjectID" placeholder="请选择" style="width:100%">
            <el-option  v-for="item in subject" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="目录名称" prop="tagName">
          <el-input v-model="form.tagName" placeholder="请输入目录名称" ></el-input>
        </el-form-item>
      </el-form>
      <!-- 确认提交与取消 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="closedialog ">取 消</el-button>
        <el-button type="primary"
         @click="determine" >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { add, update } from '@/api/hmmm/tags.js'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    subject: {
      type: Array,
      default: () => ([])
    },
    getchangeid: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      form: {
        id: null,
        subjectID: '',
        tagName: ''
      },
      rules: {
        tagName: [
          { required: true, message: '必选', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    closedialog () {
      this.$emit('closedialog')
      this.form = {
        id: null,
        subjectID: '',
        tagName: ''
      }
    },
    // 确定新增目录
    async determine () {
      if (this.form.id) {
        // 修改
        await update(this.form)
        this.$parent.getlist()
      } else {
        // 新增
        await add(this.form)
        this.$parent.getlist()
      }
      this.closedialog()
    }
  }
}
</script>

<style scoped lang='less'></style>
