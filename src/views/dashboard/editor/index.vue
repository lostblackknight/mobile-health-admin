<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :label="label" :chart-data="lineChartData" />
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanelGroup from '../admin/components/PanelGroup'
import LineChart from '../admin/components/LineChart'
import { getDoctorArticleLikeChart, getDoctorArticleReadChart, getDoctorArticleStarChart } from '@/api/topic'

export default {
  name: 'DashboardEditor',
  components: {
    PanelGroup,
    LineChart
  },
  data() {
    return {
      lineChartData: {},
      label: []
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.handleSetLineChartData('newVisitis')
  },
  methods: {
    handleSetLineChartData(type) {
      if (type === 'newVisitis') {
        getDoctorArticleReadChart()
          .then(({ data }) => {
            this.label = data.map(item => item.date)
            this.lineChartData = {
              expectedData: data.map(item => item.count)
            }
          })
      } else if (type === 'messages') {
        // 点赞
        getDoctorArticleLikeChart()
          .then(({ data }) => {
            this.label = data.map(item => item.date)
            this.lineChartData = {
              expectedData: data.map(item => item.count)
            }
          })
      } else if (type === 'purchases') {
        // 收藏
        getDoctorArticleStarChart()
          .then(({ data }) => {
            this.label = data.map(item => item.date)
            this.lineChartData = {
              expectedData: data.map(item => item.count)
            }
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
