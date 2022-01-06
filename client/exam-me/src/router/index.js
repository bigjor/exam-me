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
          path: 'room/:roomId',
          redirect: 'room/:roomId/exams',
          component: () => import('@/views/Admin/Room/Room'),
          props: (value) => ({
            roomId: value.params.roomId,
            ...value,
          }),
          children: [
            {
              name: 'Exams',
              path: 'exams',
              component: () => import('@/views/Admin/Room/Exams/Exams'),
              props: (value) => ({
                ...value,
              }),
            },
            {
              name: 'Review',
              path: 'review',
              component: () => import('@/views/Admin/Room/Review/Review'),
              props: (value) => ({
                ...value,
              }),
            },
            {
              name: 'Results',
              path: 'results',
              component: () => import('@/views/Admin/Room/Results/Results'),
              props: (value) => ({
                ...value,
              }),
            },
            {
              name: 'AdminExamCreate',
              path: 'exam',
              component: () => import('@/views/Admin/Room/Exam/AdminExam'),
              props: (value) => ({
                roomId: value.params.roomId,
                ...value,
              }),
            },
            {
              name: 'AdminExamEdit',
              path: 'exam/:examId',
              component: () => import('@/views/Admin/Room/Exam/AdminExam'),
              props: (value) => ({
                roomId: value.params.roomId,
                examId: value.params.examId,
                ...value,
              }),
            },
          ]
          
        },
        
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
