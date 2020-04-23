const menuList = []

export default [
  // 根据用户返回用户的 menu list
  {
    url: '/admin/menu/list',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: menuList
      }
    }
  }
]
