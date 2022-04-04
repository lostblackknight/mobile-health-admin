import request from '@/utils/request'

export function getDeptsByHospitalCode(hospitalCode) {
  return request({
    url: `/hospital/depts/hospitalCode/${hospitalCode}`,
    method: 'get'
  })
}
