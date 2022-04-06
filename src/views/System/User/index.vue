<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="用户名称" prop="username">
        <el-input v-model="queryParams.username" placeholder="请输入用户名称" style="width: 240px" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="queryParams.phone" placeholder="请输入手机号码" style="width: 240px" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="queryParams.email" placeholder="请输入邮箱" style="width: 240px" clearable size="small" @keyup.enter.native="handleQuery" />
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
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleBatchDelete">删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="userList" tooltip-effect="dark" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column key="id" label="用户编号" align="center" prop="id" width="80" />
      <el-table-column key="username" label="用户名称" align="center" prop="username" :show-overflow-tooltip="true" />
      <el-table-column key="gender" label="性别" align="center" prop="gender" width="80" />
      <el-table-column key="avatar" label="头像" align="center" prop="avatar">
        <template slot-scope="scope">
          <el-image style="width: 80px; height: 80px" :src="scope.row.avatar" :fit="'fill'" />
        </template>
      </el-table-column>
      <el-table-column key="phone" label="手机号码" align="center" prop="phone" width="120" />
      <el-table-column key="email" label="邮箱" align="center" prop="email" :show-overflow-tooltip="true" />

      <el-table-column key="status" label="状态" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :active-value="0" :inactive-value="1" @change="handleStatusChange(scope.row)" />
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
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button class="el-btn-custom" size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button class="el-btn-custom" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          <el-button class="el-btn-custom" size="mini" type="text" icon="el-icon-key" @click="handleReset(scope.row)">重置密码</el-button>
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
          <el-col :span="12">
            <el-form-item label="用户名称" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名称" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.id === undefined" label="密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入密码" type="password" maxlength="20" show-password />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户头像" prop="avatar">
              <el-upload
                ref="upload"
                :headers="headers"
                class="upload-demo"
                :limit="1"
                :action="action"
                :on-success="handleSuccess"
                :on-remove="handleRemove"
                :file-list="fileList"
                list-type="picture"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户性别" prop="gender">
              <el-select v-model="form.gender" placeholder="请选择">
                <el-option v-for="option in genderOptions" :key="option.value" :label="option.label" :value="option.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="roleIds">
              <el-select v-model="form.roleIds" multiple placeholder="请选择">
                <el-option v-for="item in roleOptions" :key="item.id" :label="item.roleName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio v-for="option in statusOptions" :key="option.value" :label="option.value">{{ option.label }}</el-radio>
              </el-radio-group>
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
import { createUser, getUserById, getUsers, modifyUser, modifyUserStatusById, removeUserById, removeUserByIds, resetUserPassword } from '@/api/user'
import { getToken } from '@/utils/auth'
import { getRolesByList } from '@/api/role'

export default {
  name: 'User',
  data() {
    return {
      loading: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      userList: [],
      // 查询参数
      queryParams: {
        username: undefined,
        phone: undefined,
        email: undefined
      },
      // status 可选值
      statusOptions: [
        {
          value: 0,
          label: '正常'
        },
        {
          value: 1,
          label: '禁用'
        }
      ],
      roleOptions: [],
      genderOptions: [
        { value: '男', label: '男' },
        { value: '女', label: '女' },
        { value: '未知', label: '未知' }
      ],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      open: false,
      form: {
        id: undefined,
        username: undefined,
        password: undefined,
        gender: '未知',
        avatar: undefined,
        phone: undefined,
        email: undefined,
        status: 0,
        roleIds: []
      },
      title: undefined,
      fileList: [],
      headers: {},
      action: undefined,
      multipleSelection: [],
      ids: [],
      rules: {
        username: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: ['blur', 'change'] }
        ],
        roleIds: [
          { required: true, message: '请选择角色', trigger: ['blur', 'change'] }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true
      getUsers(this.pageNum, this.pageSize, this.queryParams)
        .then(({ data }) => {
          this.userList = data.records
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
    /* 修改用户状态 */
    handleStatusChange(row) {
      const text = row.status === 0 ? '启用' : '停用'
      this.$confirm('确认要' + text + ' [' + row.username + '] 用户吗?', '修改状态')
        .then(() => {
          modifyUserStatusById(row.id, row.status)
            .then(({ message }) => {
              this.getList()
              this.$message.success(message)
            })
            .catch(error => {
              this.$message.error(error.message)
            })
        })
        .catch(() => {
          this.$message.info('取消成功')
          this.getList()
        })
    },
    /* 多选 */
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.ids = this.multipleSelection.map(item => item.id)
      this.single = this.multipleSelection.length !== 1
      this.multiple = !this.multipleSelection.length
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
    /** 新增按钮操作 */
    handleAdd(row) {
      this.fileList = []
      this.open = true
      this.title = '添加用户'
      this.headers['Authorization'] = 'Bearer ' + getToken()
      this.action = process.env.VUE_APP_BASE_API + '/thirdparty/oss/upload/image'
      getRolesByList()
        .then(({ data }) => {
          this.roleOptions = data
        })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.fileList = []
      this.open = true
      this.title = '修改用户'
      this.headers['Authorization'] = 'Bearer ' + getToken()
      this.action = process.env.VUE_APP_BASE_API + '/thirdparty/oss/upload/image'
      getRolesByList()
        .then(response => {
          this.roleOptions = response.data
        })
      const userId = row.id || this.ids
      getUserById(userId).then(response => {
        this.form.id = response.data.id
        this.form.username = response.data.username
        this.form.password = response.data.password
        this.form.gender = response.data.gender
        this.form.avatar = response.data.avatar
        this.form.phone = response.data.phone
        this.form.email = response.data.email
        this.form.status = response.data.status
        this.form.roleIds = response.data.roles.map(role => role.id)
        this.fileList = [{ url: this.form.avatar }]
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id === undefined) {
            createUser(this.form)
              .then(({ message }) => {
                this.fileList = []
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
            modifyUser(this.form)
              .then(({ message }) => {
                this.title = undefined
                this.open = false
                this.fileList = []
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
    },
    /* 重置密码 */
    handleReset(row) {
      this.$prompt('请输入 [' + row.username + '] 的新密码', '重置密码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputPattern: /^[0-9A-Za-z]{4,16}/,
        inputErrorMessage: '用户密码只能包含数字和字母，且长度为4-16'
      })
        .then(({ value }) => {
          resetUserPassword(row.id, value).then(({ message }) => {
            this.$message.success(message)
          })
        })
        .catch((error) => {
          this.$message.error(error.message)
        })
    },
    /* 关闭模态框的事件 */
    handleCloseDialog() {
      this.fileList = []
      this.open = false
      this.title = undefined
      this.form.id = undefined
      this.$refs.form.resetFields()
    },
    /* 点击模态框关闭按钮的事件 */
    cancel() {
      this.fileList = []
      this.open = false
      this.title = undefined
      this.form.id = undefined
      this.$refs.form.resetFields()
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm(`确定要删除编号为 [${row.id}] 用户吗?`, '删除用户')
        .then(() => {
          removeUserById(row.id)
            .then(({ message }) => {
              this.getList()
              this.$message.success(message)
            })
            .catch(error => {
              this.$message.error(error.message)
            })
        })
        .catch(() => {
          this.$message.info('取消成功')
        })
    },
    handleBatchDelete() {
      this.$confirm(`确定要删除编号为 [${this.ids}] 用户吗?`, '删除用户').then(() => {
        removeUserByIds(this.ids)
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
    /* 移除图片列表的事件 */
    handleRemove(file, fileList) {
      this.form.avatar = undefined
    },
    /* 上传图片成功的事件 */
    handleSuccess(response, file, fileList) {
      this.form.avatar = response.data.url
      if (response.code === 0) {
        this.$message.error(response.message)
      } else {
        this.$message.success(response.message)
      }
    }
  }
}
</script>

<style scoped>

</style>
