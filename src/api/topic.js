import request from '@/utils/request'

export function getCategoryList(pageNum, pageSize, queryParams) {
  return request({
    url: `/topic/category/page/${pageNum}/${pageSize}`,
    method: 'get',
    params: queryParams
  })
}

export function getArticleList(pageNum, pageSize, queryParams) {
  return request({
    url: `/topic/article/page/${pageNum}/${pageSize}`,
    method: 'get',
    params: queryParams
  })
}

export function getCategoryOptions() {
  return request({
    url: `/topic/category/list`,
    method: 'get'
  })
}

export function createCategory(form) {
  return request({
    url: `/topic/category`,
    method: 'post',
    data: form
  })
}

export function createArticle(form) {
  return request({
    url: `/topic/article`,
    method: 'post',
    data: form
  })
}

export function modifyCategory(form) {
  return request({
    url: `/topic/category`,
    method: 'put',
    data: form
  })
}

export function modifyArticle(form) {
  return request({
    url: `/topic/article`,
    method: 'put',
    data: form
  })
}

export function getCategoryById(id) {
  return request({
    url: `/topic/category/${id}`,
    method: 'get'
  })
}

export function getArticleById(id) {
  return request({
    url: `/topic/article/${id}`,
    method: 'get'
  })
}

export function removeCategoryById(id) {
  return request({
    url: `/topic/category/${id}`,
    method: 'delete'
  })
}

export function removeCategoryByIds(ids) {
  return request({
    url: '/topic/category/batch',
    method: 'delete',
    data: ids
  })
}

export function removeArticleById(id) {
  return request({
    url: `/topic/article/${id}`,
    method: 'delete'
  })
}

export function removeArticleByIds(ids) {
  return request({
    url: '/topic/article/batch',
    method: 'delete',
    data: ids
  })
}

export function getDoctorArticleReadCount() {
  return request({
    url: '/topic/article/total/doctor/read/count',
    method: 'get'
  })
}

export function getDoctorArticleStarCount() {
  return request({
    url: '/topic/article/total/doctor/star/count',
    method: 'get'
  })
}

export function getDoctorArticleLikeCount() {
  return request({
    url: '/topic/article/total/doctor/like/count',
    method: 'get'
  })
}

export function getDoctorArticleReadChart() {
  return request({
    url: '/topic/article/total/doctor/read/chart',
    method: 'get'
  })
}

export function getDoctorArticleLikeChart() {
  return request({
    url: '/topic/article/total/doctor/like/chart',
    method: 'get'
  })
}

export function getDoctorArticleStarChart() {
  return request({
    url: '/topic/article/total/doctor/star/chart',
    method: 'get'
  })
}

