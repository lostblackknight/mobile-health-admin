<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入分类名称" style="width: 240px" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--操作按钮-->
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
    <!--数据表格-->
    <el-table v-loading="loading" :data="categoryList" tooltip-effect="dark" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column key="id" label="编号" align="center" prop="id" width="80" />
      <el-table-column key="code" label="编码" align="center" prop="code" width="120" />
      <el-table-column key="name" label="分类的名称" align="center" prop="name" width="120" />
      <el-table-column key="remark" label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" align="center" prop="createTime" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="updateTime" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button class="el-btn-custom" size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button class="el-btn-custom" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
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

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body :close-on-click-modal="false" @close="handleCloseDialog">
      <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-row>
          <el-col :span="24">
            <el-form-item label="分类编码" prop="code">
              <el-input v-model="form.code" placeholder="请输入分类编码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入分类名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancelForm">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createCategory, getCategoryById, getCategoryList, modifyCategory, removeCategoryById, removeCategoryByIds } from '@/api/topic'

export default {
  name: 'Category',
  data() {
    return {
      loading: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 查询表单
      queryParams: {
        name: undefined
      },
      // 分页
      pageNum: 1,
      pageSize: 10,
      totalCount: 0,
      // 数据列表
      categoryList: [],
      // 添加修改表单
      open: false,
      title: undefined,
      form: {
        id: undefined,
        code: undefined,
        name: undefined,
        remark: undefined
      },
      // 校验规则
      rules: {
        code: [
          { required: true, message: '分类编码不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ]
      },
      multipleSelection: [],
      ids: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 查询列表
    getList() {
      this.loading = true
      getCategoryList(this.pageNum, this.pageSize, this.queryParams)
        .then(({ data }) => {
          this.categoryList = data.records
          this.pageNum = data.pageNum
          this.pageSize = data.pageSize
          this.totalCount = data.total
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
    // 搜索按钮操作
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
    // 重置查询
    resetQuery() {
      this.$refs.queryForm.resetFields()
      this.pageNum = 1
      this.pageSize = 10
      this.getList()
    },
    // 添加
    handleAdd() {
      this.open = true
      this.title = '添加分类'
    },
    // 修改
    handleUpdate(row) {
      this.open = true
      this.title = '修改分类'
      const id = row.id || this.ids
      getCategoryById(id)
        .then(({ data }) => {
          this.form.id = data.id
          this.form.code = data.code
          this.form.name = data.name
          this.form.remark = data.remark
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    // 删除
    handleDelete(row) {
      this.$confirm(`确定要删除编号为 [${row.id}] 分类吗?`, '删除分类').then(() => {
        removeCategoryById(row.id)
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
      this.$confirm(`确定要删除编号为 [${this.ids}] 分类吗?`, '删除分类').then(() => {
        removeCategoryByIds(this.ids)
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
    // 监听多选
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.ids = this.multipleSelection.map(item => item.id)
      this.single = this.multipleSelection.length !== 1
      this.multiple = !this.multipleSelection.length
    },
    // 关闭模态框
    handleCloseDialog() {
      this.open = false
      this.title = undefined
      this.form.id = undefined
      this.$refs.form.resetFields()
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.id === undefined) {
            createCategory(this.form)
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
            modifyCategory(this.form)
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
    },
    // 取消表单
    cancelForm() {
      this.open = false
      this.title = undefined
      this.form.id = undefined
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style scoped>

</style>
