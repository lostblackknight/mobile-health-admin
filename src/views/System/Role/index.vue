<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="queryParams.roleName" placeholder="请输入角色名称" style="width: 240px" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="角色编码" prop="tag">
        <el-input v-model="queryParams.tag" placeholder="请输入角色编码" style="width: 240px" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="roleList" tooltip-effect="dark" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column key="id" label="角色编号" align="center" prop="id" />
      <el-table-column key="roleName" label="角色名称" align="center" prop="roleName" />
      <el-table-column key="tag" label="角色编码" align="center" prop="tag" />

      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="修改时间" align="center" prop="updateTime">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button class="el-btn-custom" size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button v-if="scope.row.id !== 1" class="el-btn-custom" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
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

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body :close-on-click-modal="false" @close="handleCloseDialog">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="form.roleName" placeholder="请输入角色名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="角色编码" prop="tag">
              <el-input v-model="form.tag" placeholder="请输入角色编码" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createRole, getRoleById, getRoles, modifyRole, removeRoleById, removeRoleByIds } from '@/api/role'

export default {
  name: 'Role',
  data() {
    return {
      loading: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      queryParams: {
        roleName: undefined,
        tag: undefined
      },
      roleList: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      open: false,
      form: {
        id: undefined,
        roleName: undefined,
        tag: undefined
      },
      title: undefined,
      multipleSelection: [],
      ids: [],
      rules: {
        roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        tag: [{ required: true, message: '角色编码不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getRoles(this.pageNum, this.pageSize, this.queryParams)
        .then(({ data }) => {
          this.roleList = data.records
          this.pageNum = data.pageNum
          this.pageSize = data.pageSize
          this.total = data.total
        })
        .finally(() => {
          this.loading = false
        })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.$refs.queryForm.validate(valid => {
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
      this.pageNum = 1
      this.pageSize = 10
      this.getList()
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
    /** 新增按钮操作 */
    handleAdd(row) {
      this.open = true
      this.title = '添加角色'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.open = true
      this.title = '修改角色'
      const roleId = row.id || this.ids
      getRoleById(roleId)
        .then(({ data }) => {
          this.form.id = data.id
          this.form.roleName = data.roleName
          this.form.tag = data.tag
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    /* 关闭模态框的事件 */
    handleCloseDialog() {
      this.open = false
      this.title = undefined
      this.form.id = undefined
      this.$refs.form.resetFields()
    },
    /* 点击模态框关闭按钮的事件 */
    cancel() {
      this.open = false
      this.title = undefined
      this.form.id = undefined
      this.$refs.form.resetFields()
    },
    /* 多选 */
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.ids = this.multipleSelection.map(item => item.id)
      this.single = this.multipleSelection.length !== 1
      this.multiple = !this.multipleSelection.length
    },
    // 删除
    handleDelete(row) {
      this.$confirm(`确定要删除编号为 [${row.id}] 角色吗?`, '删除角色').then(() => {
        removeRoleById(row.id)
          .then(({ message }) => {
            this.getList()
            this.$message.success(message)
          })
          .catch(error => {
            this.$message.error(error.message)
          })
      }).catch(() => {
        this.$message.info('取消成功')
      })
    },
    // 批量删除
    handleBatchDelete() {
      this.$confirm(`确定要删除编号为 [${this.ids}] 角色吗?`, '删除角色').then(() => {
        removeRoleByIds(this.ids)
          .then(({ message }) => {
            this.getList()
            this.$message.success(message)
          })
          .catch(error => {
            this.$message.error(error.message)
          })
      }).catch(() => {
        this.$message.info('取消成功')
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id === undefined) {
            createRole(this.form)
              .then(({ message }) => {
                this.open = false
                this.title = undefined
                this.form.id = undefined
                this.$refs.form.resetFields()
                this.getList()
                this.$message.success(message)
              })
              .catch(error => {
                this.$message.error(error.message)
              })
          } else {
            modifyRole(this.form)
              .then(({ message }) => {
                this.open = false
                this.title = undefined
                this.form.id = undefined
                this.$refs.form.resetFields()
                this.getList()
                this.$message.success(message)
              })
              .catch(error => {
                this.$message.error(error.message)
              })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
