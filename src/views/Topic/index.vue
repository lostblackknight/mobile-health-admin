<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入文章标题" style="width: 240px" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="分类" prop="categoryId" :inline="true">
        <el-select v-model="queryParams.categoryId" style="width: 240px" clearable size="small" placeholder="请选择分类" @keyup.enter.native="handleQuery">
          <el-option
            v-for="item in categoryOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
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
    <el-table v-loading="loading" :data="articleList" tooltip-effect="dark" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column key="id" label="编号" align="center" prop="id" width="80" />
      <el-table-column key="title" label="标题" align="center" prop="title" width="120" :show-overflow-tooltip="true" />
      <el-table-column key="author" label="作者" align="center" prop="author" width="120" />
      <el-table-column key="category" label="分类" align="center" prop="category.name" width="120" />
      <el-table-column key="readCount" label="阅读数" align="center" prop="readCount" />
      <el-table-column key="likeCount" label="点赞数" align="center" prop="likeCount" />
      <el-table-column key="collectionCount" label="收藏数" align="center" prop="collectionCount" />
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
  </div>
</template>

<script>
import { getArticleList, getCategoryOptions, removeArticleById, removeArticleByIds } from '@/api/topic'

export default {
  name: 'Topic',
  data() {
    return {
      loading: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 查询表单
      queryParams: {
        title: undefined,
        categoryId: undefined
      },
      // 分页
      pageNum: 1,
      pageSize: 10,
      totalCount: 0,
      // 数据列表
      articleList: [],
      categoryOptions: [],
      multipleSelection: [],
      ids: []
    }
  },
  created() {
    this.getList()
    this.getCategoryOptions()
  },
  methods: {
    getCategoryOptions() {
      getCategoryOptions()
        .then(({ data }) => {
          this.categoryOptions = data
        })
    },
    // 查询列表
    getList() {
      this.loading = true
      getArticleList(this.pageNum, this.pageSize, this.queryParams)
        .then(({ data }) => {
          this.articleList = data.records
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
      this.$router.push('/topic/article/add')
    },
    // 修改
    handleUpdate(row) {
      const id = row.id || this.ids
      this.$router.push(`/topic/article/edit/${id}`)
    },
    // 删除
    handleDelete(row) {
      this.$confirm(`确定要删除编号为 [${row.id}] 文章吗?`, '删除文章').then(() => {
        removeArticleById(row.id)
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
      this.$confirm(`确定要删除编号为 [${this.ids}] 文章吗?`, '删除文章').then(() => {
        removeArticleByIds(this.ids)
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
    }
  }
}
</script>

<style scoped>

</style>
