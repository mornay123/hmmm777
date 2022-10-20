<template>
  <!-- 标题 -->
  <div class="container">
    <el-dialog title="新增文章" :visible.sync="dialogVisibleadd"  :before-close="closedialogadd" width="50%">
      <el-form ref="form" :model="form" label-width="100px" >
        <el-form-item label="文章标题：" prop="region">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <!-- 文章内容 -->
        <el-form-item label="文章内容："  prop="region">
         <mavon-editor
          ref="md"
          @change="changeQuestion"
          class="mavonEditor"
          :toolbars="markdownOption"
          :ishljs="true"
          :subfield="false"
          defaultOpen="edit"
          v-model="form.articleBody"
                   />
        </el-form-item>
        <!-- 视频地址 -->
        <el-form-item label="视频地址："  prop="region">
          <el-input v-model="form.videoURL"></el-input>
        </el-form-item>
      </el-form>
       <span slot="footer" class="dialog-footer">
        <el-button @click="closedialogadd">取 消</el-button>
        <el-button type="primary"
         @click="determine" >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { add, update } from '@/api/hmmm/articles.js'
export default {
  props: {
    dialogVisibleadd: {
      type: Boolean,
      default: false
    }
  },
  components: {
    mavonEditor
  },
  data () {
    return {
      form: {
        id: null,
        title: '',
        articleBody: '',
        videoURL: ''

      },
      markdownOption: {
        bold: true, // 粗体
        italic: true, // 斜体
        underline: true, // 下划线
        strikethrough: true, // 中划线
        ol: true, // 有序列表
        ul: true, // 无序列表
        quote: true, // 引用
        imagelink: true, // 图片链接
        link: true, // 链接
        code: true, // code
        htmlcode: true
      }
    }
  },
  methods: {
    closedialogadd () {
      this.$emit('closedialogadd')
      this.form = {
        title: '',
        articleBody: '',
        videoURL: ''
      }
    },
    // 所有操作都会被解析重新渲染
    changeQuestion (value, render) {
      // console.log(render)
      // console.log(value)
      // render 为 markdown 解析后的结果[html]
      this.form.articleBody = render
      // console.log(this.form.articleBody)
    },
    async determine () {
      if (this.form.id) {
        // 修改
        await update(this.form)
        this.$parent.getlist()
      } else {
        // 新增
        console.log('新增')
        await add(this.form)
        this.$parent.getlist()
      }
      this.closedialogadd()
    }
  }
}
</script>

<style scoped lang='less'>
.mavonEditor {
z-index: 0;
 max-height: 200px !important;
box-shadow: #ccc 0px 0px 0px 1px !important;
 .v-note-op {
border-bottom: 1px solid #ccc;
 }
}
</style>
