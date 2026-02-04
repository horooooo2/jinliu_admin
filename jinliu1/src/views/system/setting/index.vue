<template>
  <div class="system-setting-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">系统设置</h2>
    </div>

    <!-- 设置表单 -->
    <el-card class="setting-card" shadow="never">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        v-loading="loading"
      >
        <el-form-item label="平台名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入平台名称"
            clearable
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="平台标题" prop="title">
          <el-input
            v-model="formData.title"
            placeholder="请输入平台标题"
            clearable
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="平台关键词" prop="keyword">
          <el-input
            v-model="formData.keyword"
            placeholder="请输入平台关键词"
            clearable
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="平台描述信息" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            placeholder="请输入平台描述信息"
            :rows="6"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSave" :loading="saveLoading">
            <el-icon><Select /></el-icon>
            保存设置
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshLeft /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { Select, RefreshLeft } from '@element-plus/icons-vue'
import { getConfig, saveConfig } from '@/api/system/setting'

// 表单引用
const formRef = ref<FormInstance>()

// 加载状态
const loading = ref(false)
const saveLoading = ref(false)

// 表单数据
const formData = reactive({
  name: '',
  title: '',
  keyword: '',
  description: '',
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入平台名称', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
  ],
  title: [
    { required: true, message: '请输入平台标题', trigger: 'blur' },
    { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' },
  ],
  keyword: [
    { max: 200, message: '长度不能超过 200 个字符', trigger: 'blur' },
  ],
  description: [
    { max: 500, message: '长度不能超过 500 个字符', trigger: 'blur' },
  ],
}

// 获取配置
const fetchConfig = async () => {
  try {
    loading.value = true

    const res: any = await getConfig({})

    if (res.code === 0 && res.data) {
      Object.assign(formData, {
        name: res.data.name || '',
        title: res.data.title || '',
        keyword: res.data.keyword || '',
        description: res.data.description || '',
      })
    } else {
      ElMessage.error(res.msg || '获取配置失败')
    }
  } catch (error) {
    console.error('获取配置失败:', error)
    ElMessage.error('获取配置失败，请重试')
  } finally {
    loading.value = false
  }
}

// 保存设置
const handleSave = async () => {
  if (!formRef.value) return

  try {
    // 验证表单
    await formRef.value.validate()

    saveLoading.value = true

    const params = {
      name: formData.name,
      title: formData.title,
      keyword: formData.keyword,
      description: formData.description,
    }

    const res: any = await saveConfig(params)

    if (res.code === 0) {
      ElMessage.success('保存成功')
      // 重新获取配置
      fetchConfig()
    } else {
      ElMessage.error(res.msg || '保存失败')
    }
  } catch (error: any) {
    // 如果是表单验证错误，不显示错误消息
    if (error !== false) {
      console.error('保存设置失败:', error)
      ElMessage.error('保存设置失败，请重试')
    }
  } finally {
    saveLoading.value = false
  }
}

// 重置
const handleReset = () => {
  fetchConfig()
  ElMessage.success('已重置')
}

// 页面加载时获取数据
onMounted(() => {
  fetchConfig()
})
</script>

<style scoped>
.system-setting-page {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.setting-card {
  max-width: 800px;
}

:deep(.el-card__body) {
  padding: 30px;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-input),
:deep(.el-textarea) {
  max-width: 600px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style>