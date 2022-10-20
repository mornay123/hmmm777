<template>
  <!-- 标题 -->
  <div class="container">
    <!-- <el-button type="text" @click="dialogVisible = true"
      >点击打开 Dialog</el-button
    > -->
    <el-dialog title="预览文章" :visible.sync="dialogVisible" :before-close="closedialog" width="50%">
         <!-- 文章预览 -->
        <h2>{{articleBody.title}}</h2>
        <span>{{articleBody.createTime}}</span>&nbsp;&nbsp;<span>{{articleBody.username}}</span>&nbsp;&nbsp;<span class="el-icon-view"></span> <span>{{articleBody.visits}}</span>
        <div class="article-content markdown-body" v-html="articleBody.articleBody"></div>
    </el-dialog>
  </div>
</template>

<script>
import './github-markdown.css'
export default {
  props: {
    articleBody: {
      type: Object,
      default: () => ({})
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  created () {

  },
  methods: {
    closedialog () {
      this.$emit('closedialog')
    }
  }
}
</script>

<style scoped lang='less'>
.article-content{
  margin-top: 20px;
  padding:20px 15px 15px 20px;
  background-color: #f5f5f5;
}
</style>
