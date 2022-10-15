<template>
  <div>
    <!-- 单选 -->
    <div v-if="type === '1'">
      <el-row
        type="flex"
        align="middle"
        style="margin-bottom: 20px"
        v-for="(item, index) in optionsList"
        :key="index"
      >
        <el-col :span="1.5">
          <el-radio v-model="option[index]" :label="item"
            >{{ item }}：
          </el-radio>
        </el-col>
        <el-col :span="6">
          <el-input
            type="text"
            v-model="option[index]"
            class="newQuestionsCheck"
          />
        </el-col>
        <el-col :span="2">
          <el-upload class="avatar-uploader" action="#" :show-file-list="false">
            <img v-if="option.img" :src="option.img" class="avatar" />
            <span v-else class="avatar-uploader-icon"
              >上传图片
              <i class="el-icon-circle-close iconclose"></i>
            </span>
          </el-upload>
        </el-col>
      </el-row>
    </div>
    <!-- 多选 -->
    <div v-if="type === '2'">
      <el-row
        type="flex"
        align="middle"
        style="margin-bottom: 20px"
        v-for="(item, index) in optionsList"
        :key="index"
      >
        <el-col :span="1.5">
          <el-checkbox-group v-model="checkboxIsRight">
            <el-checkbox name="type" :label="item">{{ item }}： </el-checkbox>
          </el-checkbox-group>
        </el-col>
        <el-col :span="6">
          <el-input
            type="text"
            v-model="option.title"
            class="newQuestionsCheck"
          />
        </el-col>
        <el-col :span="2">
          <el-upload class="avatar-uploader" action="#" :show-file-list="false">
            <img v-if="option.img" :src="option.img" class="avatar" />
            <span v-else class="avatar-uploader-icon"
              >上传图片
              <i class="el-icon-circle-close iconclose"></i>
            </span>
          </el-upload>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: '1'
    },
    optionsList: {
      type: Array,
      default: () => (['A', 'B', 'C', 'D'])
    }
  },
  data () {
    return {
      option: [
        // {
        //   code: '',
        //   img: '',
        //   isRight: false,
        //   title: ''
        // }
      ],
      checkboxIsRight: []
    }
  }
}
</script>

<style>
</style>
