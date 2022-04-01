import request from '@/utils/request'

export function getHospitalClientDetails(pageNum, pageSize, queryParams) {
  return request({
    url: `/admin/hospitalClientDetails/page/${pageNum}/${pageSize}`,
    method: 'get',
    params: queryParams
  })
}

export function createHospitalClientDetail(form) {
  return request({
    url: `/admin/hospitalClientDetails`,
    method: 'post',
    data: form
  })
}

export function modifyHospitalClientDetail(form) {
  return request({
    url: `/admin/hospitalClientDetails`,
    method: 'put',
    data: form
  })
}

export function getHospitalClientDetailById(id) {
  return request({
    url: `/admin/hospitalClientDetails/${id}`,
    method: 'get'
  })
}

export function removeHospitalClientDetailById(id) {
  return request({
    url: `/admin/hospitalClientDetails/${id}`,
    method: 'delete'
  })
}

export function removeHospitalClientDetailByIds(ids) {
  return request({
    url: '/admin/hospitalClientDetails/batch',
    method: 'delete',
    data: ids
  })
}

export function modifyHospitalClientDetailStatusById(id, status) {
  return request({
    url: `/admin/hospitalClientDetails/${id}/status/${status}`,
    method: 'put'
  })
}
