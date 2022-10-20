<template>
  <div class="add-form">
    <el-dialog
      :title="title"
      :before-close="handleClose"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :rules="rules"
        ref="dataForm"
        :model="formBase"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left: 120px"
      >
        <el-form-item :label="$t('table.username')" prop="username">
          <el-input v-model="formBase.username"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.email')" prop="email">
          <el-input v-model="formBase.email"></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('table.paddword')"
          prop="password"
          v-if="formBase.password != undefined"
        >
          <el-input v-model="formBase.password"></el-input>
        </el-form-item>

        <!-- 角色 -->
        <el-form-item :label="$t('table.role')" prop="role">
          <el-input v-model="formBase.role"></el-input>
        </el-form-item>
        <!-- 权限组 -->
        <el-form-item
          :label="$t('table.permissionUser')"
          prop="permission_group_id"
        >
          <el-select class="filter-item" v-model="formBase.permission_group_id">
            <el-option
              v-for="item in PermissionGroupsList"
              :value="item.id"
              :key="item.key"
              :label="item.title"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('table.phone')" prop="phone">
          <el-input v-model="formBase.phone"></el-input>
        </el-form-item>

        <!-- 头像上传下一个版本再做 -->
        <!-- <el-form-item :label="$t('table.avatar')" prop="avatar">
            <el-upload
              class="upload-demo"
              :action="importFileUrl"
              :on-change="handleChange"
              :file-list="fileList" accept="image/jpeg,image/gif,image/png,image/bmp"
              :before-upload="beforeAvatarUpload">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
        </el-form-item>-->
        <el-form-item :label="$t('table.introduction')">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="Please input"
            v-model="formBase.introduction"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="createData">{{
          $t('table.confirm')
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// detail,
// account: '',
//       fullName: '',
//       mobile: '',
//       permission_group_id: '',
//       avatar: '',
//       email: '',
//       disabled: ''
import { update, add } from '@/api/base/users'
// import { status } from '../../api/hmmm/constants'
export default {
  name: 'usersAdd',
  props: [
    'dialogFormVisible',
    'PermissionGroupsList',
    'userId'
  ],
  data () {
    return {
      formBase: { // 表单
        avatar: '',
        email: '',
        introduction: '',
        password: '',
        permission_group_id: '',
        phone: '',
        role: '',
        sex: '',
        username: ''
      },
      rules: {
        username: { required: true, message: '请输入用户名', trigger: 'blur' },
        email: { required: true, message: '请输入邮箱', trigger: 'blur' },
        password: { required: true, message: '请输入密码', trigger: 'blur' }
      },
      id: ''
    }
  },
  computed: {
    title () { // 优化:点新增标题显示新增,点编辑显示编辑
      return this.formBase.id ? '编辑用户' : '新增用户'
    }
  },
  methods: {
    // 弹层显示
    // dialogFormV () {
    // this.dialogFormVisible = true
    // },
    // 弹层隐藏
    // dialogFormH () {
    // this.dialogFormVisible = false
    // },
    // 退出
    handleClose () {
      this.$refs.dataForm.resetFields()
      this.formBase = {
        avatar: '',
        email: '',
        introduction: '',
        password: '',
        permission_group_id: '',
        phone: '',
        role: '',
        sex: '',
        username: ''
      }
      this.$emit('update:dialogFormVisible', false)
    },

    // 表单提交 确定
    async createData () {
      try {
        await this.$refs.dataForm.validate() // 校验整个表单,Form组件自带的方法
        // this.loading = true
        if (this.userId) {
          delete this.formBase.password
        }
        const data = this.userId ? await update(this.formBase) : await add(this.formBase)
        console.log(data)
        this.$message.success(this.userId ? '编辑用户成功' : '新增用户成功') // Message组件自带$message
        this.$emit('refleshList') // 新增完之后重新刷新,即再调用获取角色的接口,让父亲改
        this.handleClose() // 新增完关闭弹出层Dialog并重置表单
      } catch (error) {
        console.log(error)
      }

      // this.$refs.dataForm.validate(async valid => {
      //   if (valid) {
      //     // this.$emit('handleCloseModal')
      //     // const data = {
      //     //   ...this.formBase
      //     // }
      //     if (this.userId) { // 如果有id, 编辑
      //       const res = await update(this.formBase)
      //       console.log(res)
      //       this.$emit('refleshList')
      //       this.handleClose()
      //     } else { // 否则, 新增
      //       const res = await add(this.addData)
      //       console.log(res)
      //       this.$emit('refleshList') // 让父亲users调用接口刷新列表
      //       this.handleClose()
      //     }
      //   } else {
      //     this.$Message.error('*号为必填项!')
      //   }
      // })
    }
  },
  // 挂载结束

  mounted: function () { },
  // 创建完毕状态
  created () { },
  // 组件更新
  updated: function () { }
}
</script>
<style>
.el-form--label-left .el-form-item__label {
  text-align: right;
}
.el-form-item--medium {
  margin-bottom: 22px;
}
.el-dialog__footer {
  text-align: center;
}
</style>
