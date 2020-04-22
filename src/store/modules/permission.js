import { constantRoutes } from '@/router'
import { menuList } from '@/api/menu'

import Layout from '@/layout'
/**
 * import fa from 'element-ui/src/locale/lang/fa'
 */

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
// eslint-disable-next-line no-unused-vars
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles, isLayout, path) {
  for (let i = 0; i < routes.length; i++) {
    const tmp = routes[i]
    tmp.component = tmp.isLayout ? Layout : loadView(path + tmp.path)
    if (tmp.children) {
      const aPath = path + tmp.module + '/'
      tmp.children = filterAsyncRoutes(tmp.children, roles, false, aPath)
    }
  }
  return routes
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, id) {
    return new Promise(resolve => {
      let accessedRoutes = []
      /**
       * 根据用户获取菜单
       */
      if (id) {
        menuList({ id: id }).then(response => {
          response.data.forEach(item => {
            accessedRoutes.push(item)
          })
          accessedRoutes = filterAsyncRoutes(accessedRoutes, ['admin'], true, '')

          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        })
      }
    })
  }
}

function loadView(path) {
  // 路由懒加载
  if (path && path.startsWith('/')) {
    path = path.substring(1)
  }
  if (path && path.indexOf('/:') > -1) {
    path = path.substring(0, path.indexOf('/:'))
  }
  return (resolve) => require([`@/views/${path}`], resolve)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
