<template>
  <div style="display: flex; align-items: baseline">
    <el-select
      class="filter-item"
      style="width: 196px"
      v-model="provAndCity.province"
      @change="handleProvince"
      clearable
    >
      <el-option
        v-for="item in provinceList"
        :key="item"
        :label="item"
        :value="item"
      ></el-option> </el-select
    ><label style="margin-left: 8px; font-weight: normal"></label>
    <el-select
      class="filter-item"
      style="width: 196px"
      v-model="provAndCity.city"
      @change="handleCity"
      clearable
    >
      <el-option
        v-for="item in cityList"
        :key="item"
        :label="item"
        :value="item"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { provinces as getProvinces, citys as getCitys } from '@/api/hmmm/citys.js'
export default {
  name: 'citys',
  props: ['value'],
  data () {
    return {
      provAndCity: {
        province: this.value.province,
        city: this.value.city
      },
      provinceList: [],
      cityList: []
    }
  },
  created () {
    this.getCityData()
  },
  methods: {
    // 获取省
    getCityData: function () {
      this.provinceList = getProvinces()
      if (this.provAndCity.province) {
        this.cityList = getCitys(this.provAndCity.province)
      }
    },
    // 选省获取到市
    handleCity: function (e) {
      this.cityList = getCitys(e)
      // this.value.city = this.cityList[0]
      this.$emit('input', {
        province: this.provAndCity.province,
        city: e
      })
    },
    // 选省获取到市
    handleProvince: function (e) {
      this.cityList = getCitys(e)
      this.$emit('input', {
        province: this.provAndCity.province
      })
    }
  },
  watch: {
    value: {
      handler (newVal, oldVal) {
        // 更新省份
        this.provAndCity.province = newVal.province
        // 获取对应市级的数据
        this.cityList = getCitys(newVal.province)
        // 更新市
        this.provAndCity.city = newVal.city
      },
      deep: true
    }
  }
}
</script>

<style>
</style>
