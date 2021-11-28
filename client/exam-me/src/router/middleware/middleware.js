import { Rooms } from '@/services/api'


export const checkHomeMiddleware = async (to, from, next) => {
  const code = localStorage.getItem('exam-me-code')
  if (code) {
    try {
      let res = await Rooms.get(code)
      if (res.data._id === 'admin') {
        next('/admin')
        return
      } else if (res.data._id != 'admin') {
        next('/dashboard')
        return
      }
    } catch (e) {
        next()
        return
    }
  }
  next()
}

export const checkDashboardMiddleware = async (to, from, next) => {
  const code = localStorage.getItem('exam-me-code')
  if (code) {
    try {
      let res = await Rooms.get(code)
      if (res.data._id === 'admin') {
        next('/admin')
        return
      } else if (res.data._id != 'admin') {
        next()
        return
      }
    } catch (e) {
        next('/')
        return
    }
  }
  next('/')
}

export const checkAdminMiddleware = async (to, from, next) => {
  //const access = localStorage.getItem('exam-me-access')
  const code = localStorage.getItem('exam-me-code')
  if (code) {
    try {
      let res = await Rooms.get(code)
      if (res.data?._id === 'admin') {
        next()
        return
      } else if (res.data?._id != null) {
        next('/dashboard')
        return 
      }
    } catch (error) {
      next('/')   
      return
    }
  }
  next(false)
}