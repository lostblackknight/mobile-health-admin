import { login, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, setRefreshToken, removeRefreshToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { getMemberInfo, loginMember } from '@/api/member'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  loginType: '管理员',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_LOGIN_TYPE: (state, loginType) => {
    state.loginType = loginType
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      if (localStorage.getItem('loginType') === '管理员') {
        login({ username: username.trim(), password: password }).then(response => {
          const { access_token, refresh_token } = response.data
          commit('SET_TOKEN', access_token)
          setToken(access_token)
          setRefreshToken(refresh_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      } else if (localStorage.getItem('loginType') === '医生') {
        loginMember({ username: username.trim(), password: password }).then(response => {
          const { access_token, refresh_token } = response.data
          commit('SET_TOKEN', access_token)
          setToken(access_token)
          setRefreshToken(refresh_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      } else {
        login({ username: username.trim(), password: password }).then(response => {
          const { access_token, refresh_token } = response.data
          commit('SET_TOKEN', access_token)
          setToken(access_token)
          setRefreshToken(refresh_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      }
    })
  },

  setLoginType({ commit }, loginType) {
    commit('SET_LOGIN_TYPE', loginType)
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      if (localStorage.getItem('loginType') === '管理员') {
        getInfo().then(response => {
          const { data } = response

          if (!data) {
            reject('Verification failed, please Login again.')
          }

          const { roles, name, avatar } = data

          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject('getInfo: roles must be a non-null array!')
          }

          commit('SET_ROLES', roles)
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      } else if (localStorage.getItem('loginType') === '医生') {
        getMemberInfo().then(response => {
          const { data } = response
          const { roles, nickName, avatar } = data
          commit('SET_ROLES', roles)
          commit('SET_NAME', nickName)
          commit('SET_AVATAR', avatar)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      } else {
        getInfo().then(response => {
          const { data } = response

          if (!data) {
            reject('Verification failed, please Login again.')
          }

          const { roles, name, avatar } = data

          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject('getInfo: roles must be a non-null array!')
          }

          commit('SET_ROLES', roles)
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      }
    })
  },

  // user logout
  logout({ commit, dispatch }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      localStorage.removeItem('loginType')
      removeToken()
      removeRefreshToken()
      resetRouter()

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      removeRefreshToken()
      localStorage.removeItem('loginType')
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
