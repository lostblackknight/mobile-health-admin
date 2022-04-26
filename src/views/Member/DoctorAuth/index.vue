<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">

      <el-form-item label="会员名称" prop="username">
        <el-input v-model="queryParams.username" placeholder="请输入会员名称" style="width: 200px" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="会员昵称" prop="nickName">
        <el-input v-model="queryParams.nickName" placeholder="请输入会员昵称" style="width: 200px" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="会员姓名" prop="realName">
        <el-input v-model="queryParams.realName" placeholder="请输入会员姓名" style="width: 200px" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="queryParams.phone" placeholder="请输入手机号码" style="width: 200px" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="认证状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 200px" clearable size="small" @keyup.enter.native="handleQuery">
          <el-option label="认证中" value="-1" />
          <el-option label="已认证" value="1" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>

    </el-form>

    <el-table v-loading="loading" :data="memberList" tooltip-effect="dark">
      <el-table-column key="memberId" label="会员编号" align="center" prop="memberId" width="80" />
      <el-table-column key="username" label="会员名称" align="center" prop="member.username" />
      <el-table-column key="nickName" label="会员昵称" align="center" prop="member.nickName" />
      <el-table-column key="realName" label="会员姓名" align="center" prop="member.realName" />
      <el-table-column key="phone" label="手机号码" align="center" prop="member.phone" />
      <el-table-column key="status" label="状态" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ showStatus(scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column key="certificates" label="证件照" align="center" prop="avatar" width="300px">
        <template slot-scope="scope">
          <el-image style="width: 200px; height: 120px" :src="scope.row.certificates" :fit="'fill'" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status !== 1" class="el-btn-custom" size="mini" type="primary" @click="handleAccess(scope.row)">通过</el-button>
          <el-button v-if="scope.row.status !== 1" class="el-btn-custom" size="mini" type="danger" @click="handleUnAccess(scope.row)">不通过</el-button>
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
import { access, getAuthList, unAccess } from '@/api/member'

export default {
  name: 'DoctorAuth',
  data() {
    return {
      loading: false,
      memberList: [],
      // 查询参数
      queryParams: {
        username: undefined,
        phone: undefined,
        nickName: undefined,
        realName: undefined,
        status: undefined
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
      getAuthList(this.pageNum, this.pageSize, this.queryParams)
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
    },
    handleAccess(row) {
      this.$confirm(`确定要通过会员名称为 [${row.member.username}] 的医生认证吗?`, '通过医生认证').then(() => {
        access(row.memberId)
          .then(({ message }) => {
            this.getList()
            this.$message.success('操作成功')
          })
          .catch(() => {
            this.$message.error('操作失败')
          })
      }).catch(() => {
        this.$message.info('取消成功')
      })
    },
    handleUnAccess(row) {
      this.$confirm(`确定要取消通过会员名称为 [${row.member.username}] 的医生认证吗?`, '取消医生认证').then(() => {
        unAccess(row.memberId)
          .then(() => {
            this.getList()
            this.$message.success('操作成功')
          })
          .catch(() => {
            this.$message.error('操作失败')
          })
      }).catch(() => {
        this.$message.info('取消成功')
      })
    }
  }
}
</script>

<style scoped>

</style>
