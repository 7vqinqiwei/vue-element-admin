import request from '@/utils/request'

export function menuList(query) {
  return request({
    url: '/admin/menu/list',
    method: 'post',
    params: query
  })
}
