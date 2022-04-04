import request from '@/utils/request'

export function getHospitals(pageNum, pageSize, queryParams) {
  if (queryParams.cityCode !== undefined) queryParams.cityCode = queryParams.cityCode[1]
  return request({
    url: `/hospital/hospitals/page/${pageNum}/${pageSize}`,
    method: 'get',
    params: queryParams
  })
}

export function getHospitalById(id) {
  return request({
    url: `/hospital/hospitals/${id}`,
    method: 'get'
  })
}

export function modifyHospitalStatusById(id, status) {
  return request({
    url: `/hospital/hospitals/${id}/status/${status}`,
    method: 'put'
  })
}
