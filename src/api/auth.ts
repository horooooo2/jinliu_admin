import { request } from '@/utils/request'

// 登录入参
export interface LoginParams {
  username: string
  password: string
  role: 'ADMIN'
  captcha: string
  googleCode?: number
}

// 绑定google入参
export interface BindGoogleParams {
  code: number
}

// 获取QRCode图片入参
export interface GetQRCodeImageParams {
  username: string
}

// 获取验证码入参
export interface GetCaptchaParams {
  username: string
}


// 登录接口
export const login = (data: LoginParams) => {
  return request.post('/auth/login', data)
}

// 绑定google
export const bindGoogle = (data: BindGoogleParams) => {
  return request.post('/auth/google-bind', data)
}

// 生成Google密钥
export const generateSecretKey = () => {
  return request.post('/auth/generate-secret-key')
}

// 获取QRCode图片
export const getQRCodeImage = (params: GetQRCodeImageParams) => {
  return request.get('/auth/qrcode-image', { params })
}

// 查询用户信息
export const getUserInfo = () => {
  return request.get('/auth/get')
}

// 获取验证码
export const getCaptcha = (params: GetCaptchaParams) => {
  return request.get('/auth/captcha', {
    params,
    responseType: 'blob' // 设置响应类型为二进制流
  })
}
