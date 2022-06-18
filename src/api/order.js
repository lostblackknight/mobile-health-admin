import request from '@/utils/request'

export function getOrderChart() {
  return request({
    url: '/order/orders/total/chart',
    method: 'get'
  })
}
