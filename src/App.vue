<template>
  <section>
    <div
      @click="closeModal"
      :class="isBackdrop ? 'showBackdrop' : 'hideBackDrop'"
      class="backdrop full"></div>
    <div class="modal-sign" v-if="isBackdrop">
      <Login v-if="whatModal === 'signIn'" />
      <Join v-clickOutsideDirective="hey" v-if="whatModal === 'join'" />
    </div>
  </section>
  <div class="main-layout">
    <AppHeader
      :isBackdrop="isBackdrop"
      @backdrop="backdrop"
      :isActiveNotification="isActiveNotification"
      :isActiveProfile="isActiveProfile"
      @closeActiveOrders="closeActiveOrders"
      @closeActiveProfile="closeActiveProfile" />
    <RouterView />
    <UserMsg :msg="adminMsg" />
    <Footer />
    <UserMsg />
  </div>
</template>

<script>
import AppHeader from './cmps/AppHeader.vue'
import Loader from './cmps/Loader.vue'

import UserMsg from './cmps/UserMsg.vue'
import Footer from './cmps/Footer.vue'
import Login from './views/Login.vue'
import Join from './cmps/Join.vue'
import { store } from './store/store'
import { socketService } from './services/socket.service'
import { showSuccessMsg, showUserMsg } from './services/event-bus.service'

export default {
  data() {
    return {
      isBackdrop: false,
      whatModal: null,
      adminMsg: '',
      isActiveNotification: false,
      isActiveProfile: false,
    }
  },
  created() {
    this.$store.dispatch({ type: 'loadGigs' })
    const user = userService.getLoggedinUser()
    if (user) store.commit({ type: 'setLoggedInUser', user })

    socketService.on('user-ordered-gig', (msg) => {
      this.setAdminMsg(msg)
      this.isActiveProfile = true
    })
    socketService.on('order-status-changed', (msg) => {
      this.setAdminMsg(msg)
      this.isActiveNotification = true
      this.$store.dispatch({ type: 'loadOrders' })
    })

    socketService.on('gig-viewed', (msg) => {
      this.setAdminMsg(msg)
    })

    socketService.on('gig-ordered', (msg) => {
      this.setAdminMsg(msg)
    })
  },
  mounted() {
    socketService.on('admin-update', this.setAdminMsg)
  },

  watch: {
    user: {
      handler() {
        if (this.user) {
          this.isBackdrop = false
        }
      },
      immediate: true,
    },
  },

  components: {
    Join,
    Login,
    AppHeader,
    UserMsg,
    Footer,
    showUserMsg,
    showSuccessMsg,
    Loader,
  },
  methods: {
    backdrop(isOpen, whichModal) {
      console.log(this.isBackdrop)
      this.whatModal = whichModal
      this.isBackdrop = isOpen
    },
    closeModal() {
      this.isBackdrop = false
    },
    setAdminMsg(msg) {
      this.adminMsg = msg
      setTimeout(() => {
        this.adminMsg = ''
      }, 5000)
    },
    closeActiveOrders() {
      this.isActiveNotification = false
    },
    closeActiveProfile() {
      this.isActiveProfile = false
    },
  },

  computed: {
    user() {
      return this.$store.getters.loggedinUser
    },
  },
}
</script>
