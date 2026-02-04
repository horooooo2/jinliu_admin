import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo } from '@/api/auth'

// 定义用户信息接口
export interface UserInfo {
  id?: number
  username?: string
  email?: string
  role?: string
  // 根据实际后端返回的数据添加更多字段
  [key: string]: any
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref<UserInfo | null>(null)
  const token = ref<string>(localStorage.getItem('token') || '')

  // 设置 token
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const res = await getUserInfo()
      if (res.code === 0 && res.data) {
        userInfo.value = res.data
        return res.data
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }

  // 清除用户信息
  const clearUserInfo = () => {
    userInfo.value = null
    token.value = ''
    localStorage.removeItem('token')
  }

  // 登出
  const logout = () => {
    clearUserInfo()
    // 可以在这里调用登出接口
    window.location.href = '/login'
  }

  return {
    userInfo,
    token,
    setToken,
    fetchUserInfo,
    clearUserInfo,
    logout,
  }
})
