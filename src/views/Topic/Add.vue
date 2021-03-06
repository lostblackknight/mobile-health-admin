<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="60px" :rules="rules">
      <el-row>
        <el-col :span="8">
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入标题" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="作者" prop="author">
            <el-input v-model="form.author" placeholder="请输入作者" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分类" prop="categoryId">
            <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 100%;">
              <el-option
                v-for="item in categoryOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="封面" prop="cover">
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
        <el-col :span="24">
          <tinymce v-model="form.content" style="margin: 0 0 16px 20px" />
        </el-col>
      </el-row>
    </el-form>
    <div style="display: flex; justify-content: end; float: right; margin-bottom: 60px;">
      <div>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
      <div style="margin-left: 10px;">
        <el-button @click="cancelForm">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { createArticle, getCategoryOptions } from '@/api/topic'
import { getToken } from '@/utils/auth'

export default {
  name: 'Add',
  components: {
    Tinymce
  },
  data() {
    return {
      fileList: [],
      headers: {},
      action: undefined,
      form: {
        id: undefined,
        title: undefined,
        author: undefined,
        cover: undefined,
        categoryId: undefined,
        content: undefined
      },
      categoryOptions: [],
      // 校验规则
      rules: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '作者不能为空', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '分类不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    getCategoryOptions()
      .then(({ data }) => {
        this.categoryOptions = data
      })
    this.headers['Authorization'] = 'Bearer ' + getToken()
    this.action = process.env.VUE_APP_BASE_API + '/thirdparty/oss/upload/image'
  },
  methods: {
    /* 移除图片列表的事件 */
    handleRemove(file, fileList) {
      this.form.cover = undefined
    },
    /* 上传图片成功的事件 */
    handleSuccess(response, file, fileList) {
      this.form.cover = response.data.url
      if (response.code === 0) {
        this.$message.error(response.message)
      } else {
        this.$message.success(response.message)
      }
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.id === undefined) {
            if (this.form.content === undefined || this.form.content === '') {
              this.$message.error('请输入文章内容')
              return false
            }
            createArticle(this.form)
              .then(() => {
                this.$store.dispatch('tagsView/delView', this.$route)
                this.$router.go(-1)
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
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>

</style>
