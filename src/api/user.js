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

export function getUsers(pageNum, pageSize, queryParams) {
  return request({
    url: `/admin/users/page/${pageNum}/${pageSize}`,
    method: 'get',
    params: queryParams
  })
}

export function createUser(form) {
  return request({
    url: `/admin/users`,
    method: 'post',
    data: form
  })
}

export function modifyUser(form) {
  return request({
    url: `/admin/users`,
    method: 'put',
    data: form
  })
}

export function getUserById(id) {
  return request({
    url: `/admin/users/${id}`,
    method: 'get'
  })
}

export function removeUserById(id) {
  return request({
    url: `/admin/users/${id}`,
    method: 'delete'
  })
}

export function removeUserByIds(ids) {
  return request({
    url: '/admin/users/batch',
    method: 'delete',
    data: ids
  })
}

export function modifyUserStatusById(id, status) {
  return request({
    url: `/admin/users/${id}/status/${status}`,
    method: 'put'
  })
}

export function resetUserPassword(id, password) {
  return request({
    url: `/admin/users/${id}/password/${password}`,
    method: 'put'
  })
}
