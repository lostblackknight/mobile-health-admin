import request from '@/utils/request'

export function getScheduleDatesByHospitalCodeAndDeptCode(hospitalCode, deptCode, pageNum, pageSize, date) {
  return request({
    url: `/hospital/schedules/date/${hospitalCode}/${deptCode}/${pageNum}/${pageSize}`,
    method: 'get',
    params: {
      'date': date
    }
  })
}

export function getDoctorListByScheduleDate(hospitalCode, deptCode, date) {
  return request({
    url: `/hospital/schedules/doctors/${hospitalCode}/${deptCode}`,
    method: 'get',
    params: {
      'date': date
    }
  })
}
