import request from '@/utils/request'
import { getRefreshToken, setToken } from '@/utils/auth'

export function login(data) {
  return request({
    url: '/admin/token',
    method: 'post',
    data
  })
}

export function tokenRefresh() {
  setToken(getRefreshToken())
  return request({
    url: '/admin/token/refresh',
    method: 'get'
  })
}

export function getInfo() {
  return request({
    url: '/admin/users/info',
    method: 'get'
  })
}
