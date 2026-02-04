<template>
  <div class="login-page">
    <div class="login-container">
      <el-row class="login-row" :gutter="0">
        <!-- 左侧登录表单区域 -->
        <el-col :xs="24" :xl="10" class="form-section">
          <div class="form-wrapper">
            <div class="form-content">
              <!-- Logo -->
              <div class="logo-container">
                <h2 class="logo-text">后台管理系统</h2>
                <p class="logo-subtitle">管理员登录</p>
              </div>

              <!-- 登录表单 -->
              <el-form
                ref="loginFormRef"
                :model="loginForm"
                :rules="loginRules"
                class="login-form"
              >
                <!-- 用户名 -->
                <el-form-item prop="username">
                  <label class="form-label">用户名</label>
                  <el-input
                    v-model="loginForm.username"
                    placeholder="请输入用户名"
                    size="large"
                    clearable
                  >
                    <template #prefix>
                      <el-icon><User /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>

                <!-- 密码 -->
                <el-form-item prop="password">
                  <label class="form-label">密码</label>
                  <el-input
                    v-model="loginForm.password"
                    type="password"
                    placeholder="请输入密码"
                    size="large"
                    show-password
                    clearable
                  >
                    <template #prefix>
                      <el-icon><Lock /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>

                <!-- 验证码 -->
                <el-form-item prop="captcha">
                  <!-- <label class="form-label">验证码</label> -->
                  <div class="captcha-wrapper">
                    <el-input
                      v-model="loginForm.captcha"
                      placeholder="请输入验证码"
                      size="large"
                      clearable
                      class="captcha-input"
                    >
                      <template #prefix>
                        <el-icon><Key /></el-icon>
                      </template>
                    </el-input>
                    <div
                      v-if="captchaImage"
                      class="captcha-image"
                      @click="refreshCaptcha"
                      title="点击刷新验证码"
                    >
                      <img :src="captchaImage" alt="验证码" />
                    </div>
                    <el-button
                      v-else
                      class="captcha-refresh"
                      size="large"
                      :loading="captchaLoading"
                      :disabled="!loginForm.username"
                      @click="refreshCaptcha"
                    >
                      获取验证码
                    </el-button>
                  </div>
                  <div v-if="!loginForm.username && !captchaImage" class="captcha-hint">
                    请先输入用户名
                  </div>
                </el-form-item>

                <!-- Google 验证码 (可选) -->
                <!-- <el-form-item prop="googleCode">
                  <label class="form-label">
                    Google 验证码
                    <span class="optional-text">(可选)</span>
                  </label>
                  <el-input
                    v-model.number="loginForm.googleCode"
                    placeholder="请输入 Google 验证码"
                    size="large"
                    clearable
                    type="number"
                  >
                    <template #prefix>
                      <el-icon><CircleCheck /></el-icon>
                    </template>
                  </el-input>
                </el-form-item> -->

                <!-- 登录按钮 -->
                <el-form-item>
                  <el-button
                    type="primary"
                    size="large"
                    class="login-button"
                    :loading="loading"
                    @click="handleLogin"
                  >
                    登录
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-col>

        <!-- 右侧展示区域 -->
        <el-col :xs="0" :xl="14" class="banner-section">
          <div class="banner-content">
            <img src="../assets/svgs/authentication.svg" alt="Authentication" class="banner-image" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Key, CircleCheck } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { login, getCaptcha } from '@/api/auth'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const captchaLoading = ref(false)
const captchaImage = ref('')

const loginForm = reactive({
  username: '',
  password: '',
  captcha: '',
  googleCode: undefined as number | undefined,
})

const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
  ],
}

// 获取验证码
const refreshCaptcha = async () => {
  if (!loginForm.username) {
    ElMessage.warning('请先输入用户名')
    return
  }

  try {
    captchaLoading.value = true

    // 如果之前有验证码图片，先释放内存
    if (captchaImage.value && captchaImage.value.startsWith('blob:')) {
      URL.revokeObjectURL(captchaImage.value)
    }

    const blob = await getCaptcha({ username: loginForm.username })
    console.log('验证码 blob:', blob)

    // 将 blob 转换为 Object URL
    if (blob instanceof Blob) {
      captchaImage.value = URL.createObjectURL(blob)
      console.log('验证码 URL:', captchaImage.value)
    } else {
      console.error('返回的数据不是 Blob 类型:', blob)
      ElMessage.error('验证码格式错误')
    }
  } catch (error) {
    console.error('获取验证码失败:', error)
    ElMessage.error('获取验证码失败，请重试')
  } finally {
    captchaLoading.value = false
  }
}

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        console.log('登录表单数据:', { ...loginForm })

        const res = await login({
          username: loginForm.username,
          password: loginForm.password,
          role: 'ADMIN',
          captcha: loginForm.captcha,
          googleCode: loginForm.googleCode,
        })

        console.log('登录响应:', res)

        // 保存 token
        if (res.code === 0 && res.data) {
          // 将 token 保存到 store 和 localStorage
          userStore.setToken(res.data)

          // 获取用户信息
          await userStore.fetchUserInfo()

          ElMessage.success('登录成功！')

          // 跳转到仪表盘
          router.push('/desktop')
        }
      } catch (error: any) {
        console.error('登录失败:', error)
        ElMessage.error(error.message || '登录失败，请重试')
        // 登录失败后刷新验证码
        refreshCaptcha()
      } finally {
        loading.value = false
      }
    } else {
      ElMessage.error('请填写完整的登录信息')
    }
  })
}

// 组件卸载时清理 Object URL，防止内存泄漏
onUnmounted(() => {
  if (captchaImage.value && captchaImage.value.startsWith('blob:')) {
    URL.revokeObjectURL(captchaImage.value)
  }
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
}

.login-container {
  width: 100%;
  min-height: 100vh;
}

.login-row {
  min-height: 100vh;
  margin: 0 !important;
}

/* 左侧表单区域 */
.form-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.form-wrapper {
  width: 100%;
  max-width: 460px;
}

.form-content {
  padding: 40px 20px;
}

.logo-container {
  text-align: center;
  margin-bottom: 40px;
}

.logo-text {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.logo-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.login-form {
  margin: 30px 0;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #374151;
  font-weight: 500;
  margin-bottom: 8px;
}

.optional-text {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 400;
}

/* 验证码样式 */
.captcha-wrapper {
  width: 100%;
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.captcha-input {
  flex: 1;
}

.captcha-hint {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
}

.captcha-image {
  width: 120px;
  height: 44px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  background: #f9fafb;
  transition: all 0.3s;
}

.captcha-image:hover {
  border-color: #d1d5db;
  background: #f3f4f6;
}

.captcha-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.captcha-refresh {
  width: 120px;
  flex-shrink: 0;
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
}

/* 右侧展示区域 */
.banner-section {
  background: #f8f9fb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.banner-image {
  max-width: 500px;
  width: 100%;
  height: auto;
}

/* 响应式设计 */
@media (max-width: 1280px) {
  .form-section {
    padding: 40px 20px;
  }
}

@media (max-width: 768px) {
  .form-content {
    padding: 20px 10px;
  }

  .logo-text {
    font-size: 24px;
  }

  .captcha-wrapper {
    flex-direction: column;
  }

  .captcha-image,
  .captcha-refresh {
    width: 100%;
  }
}

/* Element Plus 样式覆盖 */
:deep(.el-input__wrapper) {
  padding: 12px 15px;
  box-shadow: 0 0 0 1px #e5e7eb inset;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #d1d5db inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-checkbox__label) {
  font-size: 14px;
  color: #374151;
}

/* 隐藏 number 类型输入框的上下箭头 */
:deep(input[type='number']::-webkit-inner-spin-button),
:deep(input[type='number']::-webkit-outer-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

:deep(input[type='number']) {
  -moz-appearance: textfield;
}
</style>
