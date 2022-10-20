<template>
  <div>
    <!-- 上传图片 -->
    <el-upload
      v-loading="loading"
      class="uploadImg"
      action="#"
      list-type="picture-card"
      :on-preview="onPreview"
      :on-remove="onRemove"
      :file-list="fileList"
      :on-change="onChange"
      :http-request="onHttpRequest"
      :limit="1"
      :before-upload="beforeUnload"
    >
      <i style="font-size: 12px; color: #333; font-style: normal">上传图片</i>
      <i class="el-icon-circle-close" />
    </el-upload>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewDialog" width="50%">
      <img :src="previewImgUrl" width="100%" />
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDADB5slXAyY1KVTEmEakidP0VqGWZRJoD',
  SecretKey: 'GVmx0nQuMhu58zgNF0cDl9MRPDB0dEpp'
})

export default {
  name: 'UploadImg',
  props: {
    defaultUrl: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      previewDialog: false,
      previewImgUrl: '',
      fileList: [],
      loading: false
    }
  },
  watch: {
    defaultUrl () {
      this.fileList.push({ name: 'default', url: this.defaultUrl })
    }
  },
  methods: {
    // 图片预览
    onPreview (file) {
      this.previewImgUrl = file.url
      this.previewDialog = true
    },
    // 删除图片
    onRemove (file, fileList) {
      this.fileList = fileList
    },
    onChange (file, fileList) {
      this.fileList = fileList
    },
    onHttpRequest ({ file }) {
      this.loading = true
      cos.putObject({
        Bucket: 'mo-1314348570', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-nanjing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        Body: file, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
        onProgress: function (progressData) {
          console.log(JSON.stringify(progressData))
        }
      }, (err, data) => {
        if (err) return this.$message.error('上传图片失败')
        this.loading = false
        this.$emit('on-success', {
          imgUrl: 'https://' + data.Location
        })
      })
    },
    beforeUnload (file) {
      const allowType = ['image/jpeg', 'image/gif']
      const ishas = allowType.includes(file.type)
      if (!ishas) {
        this.$message.error('只能上传' + allowType.join('、') + '类型的图片')
        return false
      }
      const maxSize = 1 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('上传的图片不能超过1MB')
        return false
      }
    }
  }
}
</script>

<style scoped lang="less">
.uploadImg {
  position: relative;
  width: 100px;
  height: 60px;
  // overflow: hidden;
  /deep/.el-upload--picture-card {
    width: 100px !important;
    height: 60px !important;
    background-color: #fff;
    line-height: 60px;
  }
  .el-icon-circle-close {
    position: absolute;
    top: -8px;
    right: -8px;
    font-size: 18px;
    color: #8c939d;
    z-index: 2;
    background-color: #fff;
  }
  /deep/.el-upload-list--picture-card .el-upload-list__item {
    width: 100px !important;
    height: 60px !important;
  }
}
</style>
