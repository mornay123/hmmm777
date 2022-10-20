<template>
  <div>
    <!-- 单选 -->
    <div v-if="type === '1'">
      <el-radio-group v-model="check" @change="determin">
        <el-row
          v-for="(item, index) in options"
          :key="index"
          type="flex"
          align="middle"
          style="margin-bottom: 5px"
        >
          <el-col :span="13">
            <el-radio :label="item.code"
              >{{ item.code }}：
              <el-input
                type="text"
                v-model="item.title"
                class="newQuestionsCheck"
                @blur="determin"
              />
            </el-radio>
          </el-col>
          <el-col :span="11">
            <upload-img @on-success="imgUrl(item.code, $event)"></upload-img>
          </el-col>
        </el-row>
      </el-radio-group>
    </div>
    <!-- 多选 -->
    <div v-if="type === '2'">
      <el-checkbox-group v-model="checkList" @change="determin">
        <el-row
          v-for="(item, index) in options"
          :key="index"
          type="flex"
          align="middle"
          style="margin-bottom: 5px"
        >
          <el-col :span="8">
            <el-checkbox :label="item.code"
              >{{ item.code }}：
              <el-input
                type="text"
                v-model="item.title"
                class="newQuestionsCheck"
                @blur="determin"
              />
            </el-checkbox>
          </el-col>
          <el-col :span="16">
            <upload-img @on-success="imgUrl(item.code, $event)"></upload-img>
          </el-col>
        </el-row>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
import uploadImg from './uploadImg.vue'
export default {
  components: { uploadImg },
  props: {
    type: {
      type: String,
      default: '1'
    },
    optionsList: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      options: this.optionsList,
      check: '',
      checkList: []
    }
  },
  watch: {
    optionsList: {
      handler () {
        if (this.type === '1') {
          this.options = this.optionsList.map(item => {
            if (item.isRight) {
              this.check = item.code
            }
            return item
          })
        } else {
          this.options = this.optionsList.map(item => {
            if (item.isRight) {
              this.checkList.push(item.code)
            }
            return item
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    imgUrl (code, url) {
      this.options = this.options.map(item => {
        if (item.code === code) {
          item.img = url.imgUrl
        }
        return item
      })
      this.determin()
    },
    determin () {
      if (this.type === '1') {
        this.options = this.options.map(item => {
          if (item.code === this.check) {
            item.isRight = true
          }
          return item
        })
        this.$emit('optionData', this.options)
      } else {
        this.options = this.options.map(item => {
          if (this.checkList.includes(item.code)) {
            item.isRight = true
          }
          return item
        })
        this.$emit('optionData', this.options)
      }
    }
  }
}
</script>

<style>
</style>
