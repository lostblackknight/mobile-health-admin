<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="字典标签" prop="dictLabel">
        <el-input v-model="queryParams.dictLabel" placeholder="请输入字典标签" style="width: 240px" clearable size="small" @keyup.enter.native="handleQuery" />
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
    <el-table v-loading="loading" row-key="id" :data="dictList" lazy tooltip-effect="dark" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column key="id" label="编号" align="center" prop="id" width="160" />
      <el-table-column key="dictLabel" label="字典标签" align="center" prop="dictLabel" width="160" />
      <el-table-column key="dictValue" label="字典键值" align="center" prop="dictValue" width="160" />
      <el-table-column key="dictSort" label="字典排序" align="center" prop="dictSort" width="160" />
      <el-table-column key="createBy" label="创建者" align="center" prop="createBy" width="160" />
      <el-table-column label="创建时间" align="center" prop="createTime" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button class="el-btn-custom" size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button class="el-btn-custom" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body :close-on-click-modal="false" @close="handleCloseDialog">
      <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-row>
          <el-col :span="24">
            <el-form-item label="父级标签" prop="parentId">
              <tree-select v-model="form.parentId" :normalizer="normalizer" :options="dictOptions" placeholder="不选默认为根标签" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="字典标签" prop="dictLabel">
              <el-input v-model="form.dictLabel" placeholder="请输入字典标签" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="字典键值" prop="dictValue">
              <el-input v-model="form.dictValue" placeholder="请输入字典类型" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="字典排序" prop="dictSort">
              <el-input-number v-model="form.dictSort" controls-position="right" :min="1" />
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
import { createDict, getDict, getDictById, modifyDict, removeDictById, removeDictByIds, getDictOptions } from '@/api/dict'
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'Dict',
  components: {
    TreeSelect
  },
  data() {
    return {
      loading: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      queryParams: {
        dictLabel: undefined
      },
      dictList: [],
      title: undefined,
      open: false,
      form: {
        id: undefined,
        parentId: undefined,
        dictLabel: undefined,
        dictValue: undefined,
        dictSort: 1
      },
      dictOptions: [],
      rules: {
        dictLabel: [
          { required: true, message: '字典标签不能为空', trigger: 'blur' }
        ],
        dictValue: [
          { required: true, message: '字典键值不能为空', trigger: 'blur' }
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
    normalizer(node) {
      // 去掉children=null的属性
      if (node.children == null || node.children === 'null') {
        delete node.children
      }
    },
    getList() {
      this.loading = true
      getDict(this.queryParams)
        .then(({ data }) => {
          this.dictList = data
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
    handleAdd() {
      this.open = true
      this.title = '添加字典'
      getDictOptions().then(({ data }) => {
        this.dictOptions = data
      })
    },
    handleUpdate(row) {
      this.open = true
      this.title = '修改字典'
      const id = row.id || this.ids
      getDictOptions().then(({ data }) => {
        this.dictOptions = data
      })
      getDictById(id)
        .then(({ data }) => {
          this.form.id = data.id
          this.form.parentId = data.parentId === 0 ? undefined : data.parentId
          this.form.dictLabel = data.dictLabel
          this.form.dictValue = data.dictValue
          this.form.dictSort = data.dictSort
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    handleDelete(row) {
      this.$confirm(`确定要删除编号为 [${row.id}] 的字典吗?`, '删除字典').then(() => {
        removeDictById(row.id)
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
    handleBatchDelete() {
      this.$confirm(`确定要删除编号为 [${this.ids}] 的字典吗?`, '删除字典').then(() => {
        removeDictByIds(this.ids)
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
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.id === undefined) {
            if (this.form.parentId === undefined) {
              this.form.parentId = 0
            }
            createDict(this.form)
              .then(({ message }) => {
                this.open = false
                this.title = undefined
                this.form.id = undefined
                this.dictOptions = []
                this.$refs.form.resetFields()
                this.getList()
                this.$message.success(message)
              })
              .catch(error => {
                this.$message.error(error.message)
              })
          } else {
            if (this.form.parentId === undefined) {
              this.form.parentId = 0
            }
            modifyDict(this.form)
              .then(({ message }) => {
                this.open = false
                this.title = undefined
                this.form.id = undefined
                this.dictOptions = []
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
    cancelForm() {
      this.open = false
      this.title = undefined
      this.form.id = undefined
      this.dictOptions = []
      this.$refs.form.resetFields()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.ids = this.multipleSelection.map(item => item.id)
      this.single = this.multipleSelection.length !== 1
      this.multiple = !this.multipleSelection.length
    },
    handleCloseDialog() {
      this.open = false
      this.title = undefined
      this.form.id = undefined
      this.dictOptions = []
      this.$refs.form.resetFields()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getList()
    }
  }
}
</script>

<style scoped>

</style>
