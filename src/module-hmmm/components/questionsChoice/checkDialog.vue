<template>
  <el-dialog title="题目审核" :visible="dialogVisibleCheck" width="500px">
    <el-radio v-model="chkState" :label="1">通过</el-radio>
    <el-radio v-model="chkState" :label="0">拒绝</el-radio>
    <el-input type="textarea" v-model="chkRemarks"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onClose">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { choiceCheck } from '@/api/hmmm/questions'
export default {
  props: {
    dialogVisibleCheck: {
      type: Boolean,
      default: false
    },
    currId: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      chkState: 1,
      chkRemarks: ''
    }
  },
  methods: {
    onClose () {
      this.chkState = 1
      this.chkRemarks = ''
      this.$emit('update:dialogVisibleCheck', false)
    },
    async submit () {
      if (!this.chkRemarks) {
        this.$message.error('请输入审核意见')
        return
      }
      await choiceCheck({ id: this.currId, chkState: this.chkState, chkRemarks: this.chkRemarks })
    }
  }
}
</script>

<style>
</style>
