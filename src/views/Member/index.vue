<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="会员名称" prop="username">
        <el-input v-model="queryParams.username" placeholder="请输入会员名称" style="width: 240px" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="会员昵称" prop="nickName">
        <el-input v-model="queryParams.nickName" placeholder="请输入会员昵称" style="width: 240px" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="会员姓名" prop="realName">
        <el-input v-model="queryParams.realName" placeholder="请输入会员姓名" style="width: 240px" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="queryParams.phone" placeholder="请输入手机号码" style="width: 240px" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="memberList" tooltip-effect="dark">
      <el-table-column key="id" label="会员编号" align="center" prop="id" width="80" />
      <el-table-column key="username" label="会员名称" align="center" prop="username" />
      <el-table-column key="nickName" label="会员昵称" align="center" prop="nickName" />
      <el-table-column key="realName" label="会员姓名" align="center" prop="realName" />
      <el-table-column key="avatar" label="头像" align="center" prop="avatar">
        <template slot-scope="scope">
          <el-image style="width: 80px; height: 80px" :src="scope.row.avatar" :fit="'fill'" />
        </template>
      </el-table-column>
      <el-table-column key="phone" label="手机号码" align="center" prop="phone" width="120" />
      <el-table-column key="certificatesNumber" label="身份证号" align="center" prop="certificatesNumber" :show-overflow-tooltip="true" />

      <el-table-column key="status" label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ showStatus(scope.row.status) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center" prop="createTime" width="120" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="修改时间" align="center" prop="updateTime" width="120" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="block" style="text-align: right">
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

  </div>
</template>

<script>
import { getMemberList } from '@/api/member'

export default {
  name: 'Member',
  data() {
    return {
      loading: false,
      memberList: [],
      // 查询参数
      queryParams: {
        username: undefined,
        phone: undefined,
        nickName: undefined,
        realName: undefined
      },
      pageNum: 1,
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询会员列表 */
    getList() {
      this.loading = true
      getMemberList(this.pageNum, this.pageSize, this.queryParams)
        .then(({ data }) => {
          this.memberList = data.records
          this.pageNum = data.pageNum
          this.pageSize = data.pageSize
          this.total = data.total
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 处理每页显示数量
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    // 处理获取的页码数
    handleCurrentChange(val) {
      this.pageNum = val
      this.getList()
    },
    showStatus(status) {
      switch (status) {
        case 0:
          return '未认证'
        case 1:
          return '已认证'
        case -1:
          return '认证中'
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.$refs['queryForm'].validate(valid => {
        if (valid) {
          this.pageNum = 1
          this.getList()
        } else {
          return false
        }
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.$refs.queryForm.resetFields()
      this.getList()
    }
  }
}
</script>

<style scoped>

</style>
