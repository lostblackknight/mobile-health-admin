<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form ref="queryForm" :model="queryParams" :inline="true" @submit.native.prevent>
      <el-form-item label="省市" prop="cityCode">
        <el-cascader
          v-model="queryParams.cityCode"
          :options="AreaOptions"
          clearable
          style="width: 240px"
          size="small"
          placeholder="请选择省市"
          filterable
          @focus="handleFocus"
        />
      </el-form-item>
      <el-form-item label="医院名称" prop="hospitalName">
        <el-input v-model="queryParams.hospitalName" placeholder="请输入医院名称" style="width: 240px" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--数据表格-->
    <el-table v-loading="loading" row-key="id" :data="hospitalList" lazy tooltip-effect="dark">
      <el-table-column key="hospitalCode" label="医院编码" align="center" prop="hospitalCode" />
      <el-table-column key="logo" label="医院logo" align="center" prop="logo">
        <template slot-scope="scope">
          <el-avatar shape="square" :size="80" fit="fill" :src="scope.row.logo" />
        </template>
      </el-table-column>
      <el-table-column key="hospitalName" label="医院名称" align="center" prop="hospitalName" />
      <el-table-column key="levelName" label="医院等级" align="center" prop="levelName" />
      <el-table-column key="className" label="医院类型" align="center" prop="className" />
      <el-table-column key="status" label="医院状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-text="已上线"
            inactive-text="已下线"
            :active-value="0"
            :inactive-value="1"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="`/hospital/hospitalDetails/${scope.row.hospitalCode}`">
            <el-button class="el-btn-custom" size="mini" type="text" icon="el-icon-s-promotion">详情</el-button>
          </router-link>
          <router-link :to="`/hospital/schedule/${scope.row.hospitalCode}`">
            <el-button class="el-btn-custom" size="mini" type="text" icon="el-icon-s-promotion">排班</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="block" style="text-align: right">
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getHospitals, modifyHospitalStatusById } from '@/api/hospital'
import { getAreas } from '@/api/dict'

export default {
  name: 'HospitalListView',
  data() {
    return {
      loading: false,
      queryParams: {
        hospitalName: undefined,
        cityCode: undefined
      },
      hospitalList: [],
      pageNum: 1,
      pageSize: 10,
      totalCount: 0,
      AreaOptions: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getAreaList() {
      getAreas()
        .then(({ data }) => {
          this.AreaOptions = data
        })
    },
    handleFocus() {
      this.getAreaList()
    },
    getList() {
      this.loading = true
      getHospitals(this.pageNum, this.pageSize, this.queryParams)
        .then(({ data }) => {
          this.hospitalList = data.records
          this.pageNum = data.pageNum
          this.pageSize = data.pageSize
          this.totalCount = data.total
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleQuery() {
      this.$refs.queryForm.validate(valid => {
        if (valid) {
          this.getList()
        } else {
          return false
        }
      })
    },
    resetQuery() {
      this.$refs.queryForm.resetFields()
      this.getList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getList()
    },
    handleStatusChange(row) {
      const text = row.status === 0 ? '上线' : '下线'
      this.$confirm('确认要' + text + ' [' + row.hospitalName + '] 吗?', '修改状态').then(() => {
        modifyHospitalStatusById(row.hospitalCode, row.status)
          .then(({ message }) => {
            this.getList()
            this.$message.success(message)
          })
          .catch(error => {
            this.$message.error(error.message)
          })
      }).catch(() => {
        this.$message.info('取消成功')
        this.getList()
      })
    }
  }
}
</script>

<style scoped>

</style>
