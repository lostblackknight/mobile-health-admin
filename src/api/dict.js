import request from '@/utils/request'

export function getDict(queryParams) {
  return request({
    url: '/admin/dict',
    method: 'get',
    params: queryParams
  })
}

export function createDict(form) {
  return request({
    url: `/admin/dict`,
    method: 'post',
    data: form
  })
}

export function modifyDict(form) {
  return request({
    url: `/admin/dict`,
    method: 'put',
    data: form
  })
}

export function getDictById(id) {
  return request({
    url: `/admin/dict/${id}`,
    method: 'get'
  })
}

export function removeDictById(id) {
  return request({
    url: `/admin/dict/${id}`,
    method: 'delete'
  })
}

export function removeDictByIds(ids) {
  return request({
    url: '/admin/dict/batch',
    method: 'delete',
    data: ids
  })
}

export function getDictOptions() {
  return request({
    url: '/admin/dict/options',
    method: 'get'
  })
}
