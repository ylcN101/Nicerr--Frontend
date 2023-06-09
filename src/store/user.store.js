import { userService } from '../services/user.service'
// var localLoggedinUser = null
// if (sessionStorage.user)
// localLoggedinUser = JSON.parse(sessionStorage.user || null)

export const userStore = {
  state: {
    loggedinUser: null,
    user: null,
    users: [],
    watchedUser: null,
  },
  getters: {
    users({ users }) {
      return users
    },
    loggedinUser({ loggedinUser }) {
      const user = userService.getLoggedInUser()
      if (user) {
        loggedinUser = user
      }

      return loggedinUser
    },
    watchedUser({ watchedUser }) {
      return watchedUser
    },
    seller({ users }) {
      //if the loggedInuser is a seller
      return users.filter((user) => user.isSeller)
    },
    buyer({ users }) {
      //if the loggedInuser is a buyer
      return users.filter((user) => !user.isSeller)
    },

    user({ user }) {
      return user
    },
  },

  rootGetters: {
    loggedinUser({ loggedinUser }) {
      return loggedinUser
    },
  },

  mutations: {
    setLoggedInUser(state, { user }) {
      state.loggedinUser = user ? { ...user } : null
    },
    setWatchedUser(state, { user }) {
      state.watchedUser = user
    },
    setUsers(state, { users }) {
      state.users = users
    },
    removeUser(state, { userId }) {
      state.users = state.users.filter((user) => user._id !== userId)
    },
    setUserScore(state, { score }) {
      state.loggedinUser.score = score
    },
  },
  actions: {
    async login({ commit }, { userCred }) {
      try {
        const user = await userService.login(userCred)
        commit({ type: 'setLoggedInUser', user })
        return user
      } catch (err) {
        console.log('userStore: Error in login', err)
        throw err
      }
    },
    async signup({ commit }, { user }) {
      try {
        await userService.signup(user)
        const localLoggedInUser = await userService.getLoggedInUser()
        await commit({ type: 'setLoggedInUser', user: localLoggedInUser })
        return localLoggedInUser
      } catch (err) {
        console.log('userStore: Error in signup', err)
        throw err
      }
    },
    async logout({ commit }) {
      try {
        await userService.logout()
        commit({ type: 'setLoggedInUser', user: null })
      } catch (err) {
        console.log('userStore: Error in logout', err)
        throw err
      }
    },
    async loadUsers({ commit }) {
      // TODO: loading
      try {
        const users = await userService.getUsers()
        commit({ type: 'setUsers', users })
      } catch (err) {
        console.log('userStore: Error in loadUsers', err)
        throw err
      }
    },
    async loadAndWatchUser({ commit }, { userId }) {
      try {
        const user = await userService.getById(userId)
        commit({ type: 'setWatchedUser', user })
      } catch (err) {
        console.log('userStore: Error in loadAndWatchUser', err)
        throw err
      }
    },
    async removeUser({ commit }, { userId }) {
      try {
        await userService.remove(userId)
        commit({ type: 'removeUser', userId })
      } catch (err) {
        console.log('userStore: Error in removeUser', err)
        throw err
      }
    },
    async updateUsers({ commit }, { user }) {
      try {
        const savedUser = await userService.update(user)
        commit({ type: 'setLoggedInUser', user: savedUser })
      } catch (err) {
        console.log('userStore: Error in updateUser', err)
        throw err
      }
    },
    async increaseScore({ commit }) {
      try {
        const score = await userService.changeScore(100)
        commit({ type: 'setUserScore', score })
      } catch (err) {
        console.log('userStore: Error in increaseScore', err)
        throw err
      }
    },
    async loadUser({ commit }) {
      try {
        const user = await userService.getLoggedInUser()
        commit({ type: 'setLoggedInUser', user })
        return user
      } catch (err) {
        console.log('userStore: Error in loadUser', err)
        throw err
      }
    },
    async addUser({ commit }, { user }) {
      try {
        const savedUser = await userService.add(user)
        commit({ type: 'setLoggedInUser', user: savedUser })
      } catch (err) {
        console.log('userStore: Error in addUser', err)
        throw err
      }
    },

    // Keep this action for compatability with a common user.service ReactJS/VueJS
    setWatchedUser({ commit }, payload) {
      commit(payload)
    },
  },
}
