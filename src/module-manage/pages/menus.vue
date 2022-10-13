<template>
  <el-container>

  <el-main class="main">
    <div class="body">
    <div class="hander">
      <el-button type="success" size="small" class="addBtn" icon="el-icon-edit">添加按钮</el-button>
    </div>

<el-tree :data="menus.data" :props="defaultProps" @node-click="handleNodeClick" default-expand-all>

</el-tree>
    </div>
  </el-main>
</el-container>
</template>

<script>
import { getmenusAPI } from '@/api/hmmm/pages.js'
export default {
  name: 'PagesMenus',
  data () {
    return {
      menus: [],
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'childs',
        label: 'title'
      }

    }
  },

  created () {
    this.getmenus()
  },

  methods: {
    async getmenus () {
      const res = await getmenusAPI() // 获取菜单列表
      // console.log(res)
      this.menus = res
    },
    handleNodeClick (data) {
      console.log(data)
    }
  }
}
</script>

<style scoped lang='less'>
.main{
  padding: 20px;
  .body{
     padding: 20px;
     .hander{
      display: flex;
      justify-content: flex-end;
       margin-bottom: 20px;

     }
  }
}
</style>
