import request from '@/utils/request'

export function loginMember(data) {
  return request({
    url: '/member/token',
    method: 'post',
    data
  })
}

export function getMemberInfo() {
  return request({
    url: '/member/members/info',
    method: 'get'
  })
}

export function getMemberChart() {
  return request({
    url: '/member/members/total/chart',
    method: 'get'
  })
}

export function getMemberList(pageNum, pageSize, queryParams) {
  return request({
    url: `/member/members/page/${pageNum}/${pageSize}`,
    method: 'get',
    params: queryParams
  })
}

export function getAuthList(pageNum, pageSize, queryParams) {
  return request({
    url: `/member/doctor/auth/page/${pageNum}/${pageSize}`,
    method: 'get',
    params: queryParams
  })
}

export function access(id) {
  return request({
    url: `/member/doctor/auth/access/${id}`,
    method: 'put'
  })
}

export function unAccess(id) {
  return request({
    url: `/member/doctor/auth/unAccess/${id}`,
    method: 'put'
  })
}

