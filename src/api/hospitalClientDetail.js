import request from '@/utils/request'

export function getHospitalClientDetails(pageNum, pageSize, queryParams) {
  return request({
    url: `/hospital/hospitalClientDetails/page/${pageNum}/${pageSize}`,
    method: 'get',
    params: queryParams
  })
}

export function createHospitalClientDetail(form) {
  return request({
    url: `/hospital/hospitalClientDetails`,
    method: 'post',
    data: form
  })
}

export function modifyHospitalClientDetail(form) {
  return request({
    url: `/hospital/hospitalClientDetails`,
    method: 'put',
    data: form
  })
}

export function getHospitalClientDetailById(id) {
  return request({
    url: `/hospital/hospitalClientDetails/${id}`,
    method: 'get'
  })
}

export function removeHospitalClientDetailById(id) {
  return request({
    url: `/hospital/hospitalClientDetails/${id}`,
    method: 'delete'
  })
}

export function removeHospitalClientDetailByIds(ids) {
  return request({
    url: '/hospital/hospitalClientDetails/batch',
    method: 'delete',
    data: ids
  })
}

export function modifyHospitalClientDetailStatusById(id, status) {
  return request({
    url: `/hospital/hospitalClientDetails/${id}/status/${status}`,
    method: 'put'
  })
}
