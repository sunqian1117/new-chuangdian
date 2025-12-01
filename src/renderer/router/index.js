import Router from 'vue-router'
import Layout from '@/layout'
// 引入路由表
import asyncRouterMap from './constantRouterMap'

export const constantRouterMap = [{
  path: '/',
  component: Layout,
  redirect: '/home',
  name: '主页',
  hidden: true,
  children: [{
    path: 'home',
    name: '总览',
    // component: () => import('@/views/components/HotMap'),
    component: () => import('@/views/homeV1'),
    // component: () => import('@/views/home'),
  }]
},
 {
  path: '/login',
  component: () => import('@/views/login'),
  hidden: true
}, {
  path: '/check',
  component: () => import('@/views/check'),
  hidden: true
}, {
  path: '/checkV1',
  component: () => import('@/views/checkV1'),
  hidden: true
}, {
  path: '*',
  component: () => import('@/views/404'),
  hidden: true
}]
export const asyncRoutes = asyncRouterMap

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}
const router = createRouter()

export default router
