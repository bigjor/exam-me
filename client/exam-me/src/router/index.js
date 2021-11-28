import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import {
  checkHomeMiddleware,
  checkAdminMiddleware,
  checkDashboardMiddleware,
} from './middleware/middleware'

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    // MENU
    {
      name: 'Home',
      path: '/',
      component: () => import('@/views/Home/Home'),
      beforeEnter: checkHomeMiddleware
    },
    // DASHBOARD
    {
      name: 'Dashboard',
      path: '/dashboard',
      component: () => import('@/views/Dashboard/Dashboard'),
      beforeEnter: checkDashboardMiddleware
    },
    // EXAM
    {
      name: 'Admin',
      path: '/admin',
      redirect: '/admin/rooms',
      component: () => import('@/views/Admin/Admin'),
      props: (value) => ({
        ...value,
      }),
      beforeEnter: checkAdminMiddleware,
      children: [
        {
          name: 'Rooms',
          path: 'rooms',
          component: () => import('@/views/Admin/Rooms/Rooms')
        },
        {
          name: 'Room',
          path: 'room/:id',
          component: () => import('@/views/Admin/Room/Room'),
          props: (value) => ({
            roomId: value.params.id,
            ...value,
          }),
        }
      ]
    },
    // EXAM
    {
      name: 'Exam',
      path: '/exam/:id',
      component: () => import('@/views/Exam/Exam'),
      props: (value) => ({
        ...value,
      }),
    },

  ]
})
