<template>
  <div class="app-container">
    <div style="margin-bottom: 20px; width: 94%;">
      <el-carousel>
        <el-carousel-item v-for="item in imageList" :key="item">
          <img :src="item" alt="" width="100%">
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="header">
      <img :src="hospital.logo" alt="" width="76px" height="76px">
      <h1 style="padding-left: 20px;">{{ hospital.hospitalName }}</h1>
    </div>
    <section>
      <div class="title">
        <h3><i class="el-icon-phone" /> 联系电话</h3>
      </div>
      <div class="content">{{ hospital.telephone }}</div>
    </section>
    <section>
      <div class="title">
        <h3><i class="el-icon-star-on" /> 医院等级及类型</h3>
      </div>
      <div class="content">
        <div class="title-1">
          等级：<span>{{ hospital.levelName }}</span>
        </div>
        <div class="title-1">
          类型：<span>{{ hospital.className }}</span>
        </div>
      </div>
    </section>
    <section>
      <div class="title">
        <h3><i class="el-icon-location" /> 地址及交通</h3>
      </div>
      <div class="content">
        <div class="title-1">
          地址：<span>{{ hospital.address }}</span>
        </div>
        <div class="title-1">
          交通：<span>{{ hospital.route }}</span>
        </div>
      </div>
    </section>
    <section>
      <div class="title">
        <h3><i class="el-icon-s-claim" /> 医院简介</h3>
      </div>
      <div class="content">{{ hospital.intro }}</div>
    </section>
    <section>
      <div class="title">
        <h3><i class="el-icon-s-opportunity" /> 预约规则</h3>
      </div>
      <div class="content">{{ hospital.rules === null ? '暂无规则' : hospital.rules }}</div>
    </section>
    <div class="footer" />
  </div>
</template>

<script>
import { getHospitalById } from '@/api/hospital'

export default {
  name: 'HospitalDetails',
  data() {
    return {
      hospital: {},
      imageList: []
    }
  },
  created() {
    this.getHospital()
  },
  methods: {
    getHospital() {
      getHospitalById(this.$route.params.hospitalCode)
        .then(({ data }) => {
          this.imageList = data.images.split(',')
          this.hospital = data
        })
    }
  }
}
</script>

<style lang="sass" scoped>
.app-container
  padding-left: 80px
  .header
    display: flex

  section
    margin-top: 20px

    .title
      margin-bottom: 10px

    .content
      color: #666666
      margin-left: 24px
      width: 90%

      .title-1
        color: black
        font-weight: bold
        margin-bottom: 10px

        span
          color: #666666
          font-weight: normal
  .footer
    margin-bottom: 80px
</style>
