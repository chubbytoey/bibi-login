import axios from 'axios'

import configFile from '~/config'

const instance = {
  api: axios.create()
}

export const createInstance = ({ store, redirect }) => {
  const backendEndpoint = configFile.endpoint.backend
  const axiosInstance = axios.create({
    baseURL: backendEndpoint
  })

  axiosInstance.interceptors.request.use((config) => {
    if (store.state.auth.accessToken) {
      config.headers.Authorization = `Bearer ${store.state.auth.accessToken}`
      delete config.headers.loading
    }
    return config
  })

  axiosInstance.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (error.response) {
        if (error.response.message === 'Unauthenticated') {
          const data = {
            refresh_token: store.state.auth.refreshToken
          }
          return axios.post(backendEndpoint + '/refreshToken', data)
            .then((response) => {
              store.commit('auth/setToken', response.data)
            })
            .then(() => {
              return axiosInstance(error.config)
            })
            .catch(() => {
              store.commit('auth/resetToken')
              store.commit('profile/resetProfile')
              redirect('/login')
            })
        } else {
          throw error
        }
      }
    //    else {
    //     Modal.warning({
    //       class: 'dialog-modal',
    //       title: 'Network Connection Failed',
    //       content: '',
    //       onOk () {
    //         return redirect('/login')
    //       }
    //     })
    //   }
    }
  )

  instance.api = axiosInstance
}

export default instance
