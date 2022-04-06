import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getRoles(pageNum, pageSize, queryParams) {
  return request({
    url: `/admin/roles/page/${pageNum}/${pageSize}`,
    method: 'get',
    params: queryParams
  })
}

export function getRoleById(id) {
  return request({
    url: `/admin/roles/${id}`,
    method: 'get'
  })
}

export function getRolesByList() {
  return request({
    url: '/admin/roles/list',
    method: 'get'
  })
}

export function createRole(form) {
  return request({
    url: `/admin/roles`,
    method: 'post',
    data: form
  })
}

export function modifyRole(form) {
  return request({
    url: `/admin/roles`,
    method: 'put',
    data: form
  })
}

export function removeRoleById(id) {
  return request({
    url: `/admin/roles/${id}`,
    method: 'delete'
  })
}

export function removeRoleByIds(ids) {
  return request({
    url: '/admin/roles/batch',
    method: 'delete',
    data: ids
  })
}
