import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: '/api', // 代理前缀
  timeout: 15000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么
    // 可以在这里添加 token
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // 处理请求错误
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 如果是 blob 类型，直接返回
    if (response.config.responseType === 'blob') {
      return response.data
    }

    // 对响应数据做点什么
    const res = response.data

    // 根据后端返回的状态码进行判断
    if (res.code !== undefined && res.code !== 0) {
      ElMessage.error(res.msg || '请求失败')

      // 特殊状态码处理
      // if (res.code === 401) {
      //   // token 过期或未授权，跳转到登录页
      //   localStorage.removeItem('token')
      //   window.location.href = '/login'
      // }

      return Promise.reject(new Error(res.msg || '请求失败'))
    }

    return res
  },
  (error) => {
    // 处理响应错误
    console.error('Response Error:', error)

    let message = '请求失败'

    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = '请求参数错误'
          break
        case 401:
          message = '未授权，请重新登录'
          // localStorage.removeItem('token')
          // setTimeout(() => {
          //   window.location.href = '/login'
          // }, 1500)
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求地址不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        case 502:
          message = '网关错误'
          break
        case 503:
          message = '服务不可用'
          break
        case 504:
          message = '网关超时'
          break
        default:
          message = error.response.data?.message || '请求失败'
      }
    } else if (error.request) {
      message = '网络连接失败，请检查网络'
    }

    ElMessage.error(message)
    return Promise.reject(error)
  }
)

// 导出封装的请求方法
export default service

// 通用的请求方法
export const request = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config)
  },

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    // 如果 data 只包含 params 属性，则将其作为 URL 查询参数
    if (data && typeof data === 'object' && 'params' in data && Object.keys(data).length === 1) {
      return service.post(url, null, { ...config, params: data.params })
    }
    return service.post(url, data, config)
  },

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    // 如果 data 只包含 params 属性，则将其作为 URL 查询参数
    if (data && typeof data === 'object' && 'params' in data && Object.keys(data).length === 1) {
      return service.put(url, null, { ...config, params: data.params })
    }
    return service.put(url, data, config)
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config)
  },

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    // 如果 data 只包含 params 属性，则将其作为 URL 查询参数
    if (data && typeof data === 'object' && 'params' in data && Object.keys(data).length === 1) {
      return service.patch(url, null, { ...config, params: data.params })
    }
    return service.patch(url, data, config)
  },

  /**
   * 文件导出/下载方法
   * @param url 导出接口地址
   * @param params 查询参数
   * @param fileName 文件名（不含扩展名，默认自动生成）
   * @param fileExtension 文件扩展名（默认.xlsx）
   * @returns Promise
   */
  async downloadFile(
    url: string,
    params?: any,
    fileName?: string,
    fileExtension: string = '.xlsx'
  ): Promise<void> {
    try {
      const response = await service.get(url, {
        params,
        responseType: 'blob',
      })

      // 检查是否成功获取到文件数据
      if (!response || !(response instanceof Blob) || response.size === 0) {
        ElMessage.error('导出失败：无法获取文件数据')
        return Promise.reject(new Error('无法获取文件数据'))
      }

      // 生成文件名
      const finalFileName = fileName || `export_${new Date().getTime()}`
      const fullFileName = finalFileName.endsWith(fileExtension)
        ? finalFileName
        : `${finalFileName}${fileExtension}`

      // 创建下载链接
      const blob = response
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = fullFileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)

      ElMessage.success('导出成功')
      return Promise.resolve()
    } catch (error) {
      console.error('文件导出失败:', error)
      ElMessage.error('导出失败，请重试')
      return Promise.reject(error)
    }
  },
}
