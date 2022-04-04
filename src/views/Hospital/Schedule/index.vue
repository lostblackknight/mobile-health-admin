<template>
  <div class="app-container">
    <el-row :gutter="50">
      <el-col :span="6">
        <div class="left-container">
          <el-card shadow="never">
            <div slot="header" class="clearfix">
              <span style="font-weight: bold">科室列表</span>
            </div>
            <el-tree
              :data="depts"
              node-key="id"
              :default-checked-keys="treeExpandData"
              :default-expanded-keys="treeExpandData"
              @node-click="handleNodeClick"
            />
          </el-card>
        </div>
      </el-col>
      <el-col :span="16">
        <div v-if="currentDeptCode !== undefined" class="right-container">
          <div class="title" style="margin: 12px 0 20px 0; font-size: 24px; font-weight: bold; line-height: 24px">{{ currentDeptName }}</div>
          <div class="schedule-date-container" style="display: flex">
            <div v-for="item in scheduleDates" :key="item.date" class="schedule-date-item" :data-id="item.date" @click="handleScheduleItemClick(item.date)">
              <div style="margin-top: 8px;">{{ showWeek(item) }}</div>
              <div style="margin: 4px 0;">{{ item.date }}</div>
              <div v-if="item.status === 1"><span style="background-color: white; padding: 2px; border-radius: 4px; color: #2ac06d">有号</span></div>
            </div>
          </div>
          <div v-if="scheduleDates.length === 0" style="color: rgb(128,128,128); font-size: 18px;">当前科室暂无放号</div>
          <el-pagination
            v-if="scheduleDates.length !== 0"
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :current-page="pageNum"
            style="margin-top: 10px;"
            @current-change="handleCurrentChange"
          />
          <div v-if="scheduleDates.length !== 0" class="schedule-doctor-container">
            <el-table v-loading="loading" :data="doctorList" tooltip-effect="dark">
              <el-table-column key="logo" label="头像" align="center" prop="logo">
                <template slot-scope="scope">
                  <el-avatar shape="square" :size="50" fit="fill" :src="scope.row.icon" />
                </template>
              </el-table-column>
              <el-table-column key="doctorName" label="医生姓名" align="center" prop="doctorName" />
              <el-table-column key="levelName" label="职称" align="center" prop="levelName" width="100px" />
              <el-table-column key="expert" label="专长" align="center" prop="expert" :show-overflow-tooltip="true" />
              <el-table-column key="illNameList" label="专治病情" align="center" prop="illNameList" :show-overflow-tooltip="true" />
              <el-table-column key="yuYueState" label="预约状态" align="center" prop="yuYueState">
                <template slot-scope="scope">
                  <span>{{ scope.row.yuYueState === 0 ? '不可预约' : '可预约' }}</span>
                </template>
              </el-table-column>
              <el-table-column key="amount" label="挂号费" align="center" prop="amount" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <span>{{ scope.row.amount === null ? '未知' : scope.row.amount }}</span>
                </template>
              </el-table-column>
              <el-table-column key="yuYueMax" label="可预约量" align="center" prop="yuYueMax">
                <template slot-scope="scope">
                  <span>{{ scope.row.yuYueMax === null ? '未知' : scope.row.yuYueMax }}</span>
                </template>
              </el-table-column>
              <el-table-column key="yuYueNum" label="已预约量" align="center" prop="yuYueNum">
                <template slot-scope="scope">
                  <span>{{ scope.row.yuYueNum === null ? '未知' : scope.row.yuYueNum }}</span>
                </template>
              </el-table-column>
              <el-table-column key="timeType" label="预约时间" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.timeType === null ? '未知' : scope.row.timeType === 'am' ? '上午' : '下午' }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getDeptsByHospitalCode } from '@/api/dept'
import { getDoctorListByScheduleDate, getScheduleDatesByHospitalCodeAndDeptCode } from '@/api/schedule'

export default {
  name: 'Schedule',
  data() {
    return {
      loading: false,
      depts: [],
      scheduleDates: [],
      pageSize: 5,
      total: 0,
      // 需要重置
      pageNum: 1,
      currentDeptCode: undefined,
      currentDeptName: undefined,
      doctorList: [],
      // 需要重置
      currentHospitalCode: undefined,
      treeExpandData: []
    }
  },
  created() {
    this.currentHospitalCode = this.$route.params.hospitalCode
    this.init()
  },
  methods: {
    init() {
      getDeptsByHospitalCode(this.currentHospitalCode)
        .then(({ data }) => {
          this.depts = data
        })
        .then(() => {
          this.currentDeptCode = this.depts[0].children[0].id
          this.currentDeptName = this.depts[0].children[0].label
          this.treeExpandData = [this.depts[0].children[0].id]
        })
        .then(() => {
          // 查询排班
          getScheduleDatesByHospitalCodeAndDeptCode(this.currentHospitalCode, this.currentDeptCode, this.pageNum, this.pageSize)
            .then(({ data }) => {
              this.scheduleDates = data.records
              this.pageSize = data.pageSize
              this.pageNum = data.pageNum
              this.total = data.total
            })
            .then(() => {
              // 选中今天
              const format = this.dateFormat(new Date(2022, 4, 4)) // 今天

              const scheduleDateItems = document.querySelectorAll('.app-container .right-container .schedule-date-container .schedule-date-item')
              scheduleDateItems.forEach(item => {
                item.classList.remove('schedule-date-item-active')
                if (item.getAttribute('data-id') === format) {
                  item.classList.add('schedule-date-item-active')
                }
              })
              // 查询医生信息
              this.loading = true
              getDoctorListByScheduleDate(this.currentHospitalCode, this.currentDeptCode, format)
                .then(({ data }) => {
                  this.doctorList = data
                })
                .finally(() => {
                  this.loading = false
                })
            })
        })
    },
    dateFormat(day) {
      return `${day.getFullYear()}-${day.getMonth() < 10 ? '0' + day.getMonth() : day.getMonth()}-${day.getDate() < 10 ? '0' + day.getDate() : day.getDate()}`
    },
    showWeek(scheduleDate) {
      const format = this.dateFormat(new Date(2022, 4, 4))
      if (String(scheduleDate.date) === format) {
        return '今天'
      } else {
        return scheduleDate.week
      }
    },
    handleNodeClick(data) {
      if (data.children == null) {
        window.scrollTo({
          left: 0,
          top: 0,
          behavior: 'smooth'
        })
        this.currentDeptCode = data.id
        this.currentDeptName = data.label
        this.pageNum = 1
        this.doctorList = []
        // 查询排班
        getScheduleDatesByHospitalCodeAndDeptCode(this.currentHospitalCode, this.currentDeptCode, this.pageNum, this.pageSize)
          .then(({ data }) => {
            this.scheduleDates = data.records
            this.pageSize = data.pageSize
            this.pageNum = data.pageNum
            this.total = data.total
          })
          .then(() => {
            // 选中今天
            // const format = this.dateFormat(new Date(2022, 4, 4)) // 今天
            let date = ''

            const scheduleDateItems = document.querySelectorAll('.app-container .right-container .schedule-date-container .schedule-date-item')
            scheduleDateItems.forEach((item, index) => {
              item.classList.remove('schedule-date-item-active')
              if (index === 0) {
                date = item.getAttribute('data-id')
                item.classList.add('schedule-date-item-active')
              }
            })
            // 查询医生信息
            this.loading = true
            getDoctorListByScheduleDate(this.currentHospitalCode, this.currentDeptCode, date)
              .then(({ data }) => {
                this.doctorList = data
              })
              .finally(() => {
                this.loading = false
              })
          })
      }
    },
    handleScheduleItemClick(date) {
      const scheduleDateItems = document.querySelectorAll('.app-container .right-container .schedule-date-container .schedule-date-item')
      scheduleDateItems.forEach(item => {
        item.classList.remove('schedule-date-item-active')
        if (item.getAttribute('data-id') === date) {
          item.classList.add('schedule-date-item-active')
        }
      })
      // 查询医生信息
      this.loading = true
      getDoctorListByScheduleDate(this.currentHospitalCode, this.currentDeptCode, date)
        .then(({ data }) => {
          this.doctorList = data
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleCurrentChange(current) {
      this.pageNum = current
      getScheduleDatesByHospitalCodeAndDeptCode(this.currentHospitalCode, this.currentDeptCode, this.pageNum, this.pageSize)
        .then(({ data }) => {
          this.scheduleDates = data.records
          this.pageSize = data.pageSize
          this.pageNum = data.pageNum
          this.total = data.total
        })
    }
  }
}
</script>

<style lang="sass" scoped>
.app-container
  ::v-deep .el-pager li.active
    color: #42b983

  ::v-deep .el-pager li:hover
    color: #42b983

  .right-container
    .schedule-date-container
      .schedule-date-item
        width: 120px
        height: 76px
        background-color: #f4f4f5
        //background-color: #ecf5ff
        border-radius: 10px
        margin-right: 14px
        text-align: center
        font-size: 14px
        border: 1px solid rgba(0, 0, 0, 0.05)

        &:hover
          cursor: pointer

  .schedule-date-item-active
    background-color: #42b983 !important
    color: #ffffff

  .schedule-doctor-container
    margin-top: 20px

</style>
