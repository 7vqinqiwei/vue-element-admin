const menuList = [
  {
    path: '/permission',
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    module: 'permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        name: 'RolePermission',
        meta: {
          title: 'Role Permission',
          roles: ['admin']
        }
      }
    ]
  }
]

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
