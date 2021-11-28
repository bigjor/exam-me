import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    // MENU
    {
      name: 'Home',
      path: '/',
      component: () => import('@/views/Home/Home')
    },
    // DASHBOARD
    {
      name: 'Dashboard',
      path: '/dashboard',
      component: () => import('@/views/Dashboard/Dashboard')
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
