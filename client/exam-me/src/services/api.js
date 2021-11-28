import axios from 'axios'

const getURL = () => {
  const pj = require('../../package.json')
  return pj.backend.url || 'http://localhost:8090/api'
}

// CLIENTE
const client = axios.create({
  baseURL: getURL(),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
})

// INTERCEPTOR
client.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.log('unauthorized, logging out ...')
    }
    return Promise.reject(error)
  }
)

// FUNCIONES
export const Rooms = require('./rooms/rooms').default.withApi(client)
export const Access = require('./access/access').default.withApi(client)
