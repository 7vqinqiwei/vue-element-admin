import { constantRoutes } from '@/router'
import { menuList } from '@/api/menu'

import loadingRoutes from '@/utils/loadingRoutes'

import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
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
export function filterAsyncRoutes(routes, roles, parent, isLayout) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (parent) {
      tmp.module = parent.module
    }
    console.log(isLayout)
    tmp.component = isLayout ? Layout : loadingRoutes(tmp.path)
    if (tmp.children) {
      tmp.children = filterAsyncRoutes(tmp.children, roles, tmp, false)
    }
    res.push(tmp)
  })

  return res
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
      //根据用户获取菜单
      if (id) {
        menuList({ id: id }).then(response => {
          response.data.forEach(item => {
            accessedRoutes.push(item)
          })
          accessedRoutes = filterAsyncRoutes(accessedRoutes, ['admin'], null, true)

          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        })
      }
    })
  }
}

function loadView(item) {
  // 路由懒加载
  console.log(item.module + '/' + item.path)
  // return () => import(`@/views/${item.module}/${item.path}`)
  // return () => import(`@/views/permission/${item.path}`)
  return resolve  => import(`@/views/permission/${item.path}`)
  // return () => import('@/views/permission/page')
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
