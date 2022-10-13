<template>
  <div class="container">
    <el-dialog
      title="新增目录"
      :visible="isShowAddDialog"
      :before-close="closeAddDialog"
      width="400px"
      v-if="isShowAddDialog"
    >
      <el-form
        label-width="80px"
        ref="form"
        :model="formData"
        :rules="formRules"
      >
        <el-form-item label="所属学科">
          <el-select
            placeholder="请选择"
            style="width: 100%"
            v-model="formData.subjectID"
          >
            <el-option
              v-for="item in subjects"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目录名称" prop="directoryName">
          <el-input
            v-model.trim="formData.directoryName"
            placeholder="请输入目录名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAddDialog">取 消</el-button>
        <el-button type="primary" @click="determine">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { simple, add, update } from '@/api/hmmm/directorys.js'
export default {
  props: {
    isShowAddDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      subjects: [],
      formData: {
        directoryName: '',
        subjectID: null
      },
      formRules: {
        directoryName: [{ required: true, message: '请输入目录名称', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getSubjectsList()
  },
  methods: {
    closeAddDialog () {
      this.$refs.form.resetFields()
      this.formData = {
        directoryName: '',
        subjectID: null
      }
      this.$emit('isShowAddDialog')
    },
    async getSubjectsList () {
      const { data } = await simple()
      this.subjects = data
    },
    async determine () {
      try {
        await this.$refs.form.validate()
        if (this.formData.id) {
          await update(this.formData)
          this.$message.success('修改成功')
        } else {
          await add(this.formData)
          this.$message.success('添加成功')
        }
        this.$parent.getTableList()
        this.closeAddDialog()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style scoped lang='less'></style>
