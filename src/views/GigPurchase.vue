<template>
  <section class="purchase-navBar full main-layout">
    <div class="logo" @click="HandleLogoClick">Nicerr</div>
  </section>
  <section class="app-container" v-if="gig">
    <section class="gig-payment">
      <section class="payment-container">
        <section class="payment-details-container">
          <h2 class="title-purchase">Payment Options</h2>
          <section class="credit-selection flex">
            <div class="credits">Credit & Debit Cards</div>
            <div class="visa">
              <div className="icon" v-html="getSvg('visa')"></div>
            </div>
          </section>
          <section class="payment-option">
            <div class="card-info flex">
              <div class="card-container">
                <p>Card Number</p>
                <input
                  class="card-num"
                  type="text"
                  value="4580 5926 7852 9996" />
              </div>
              <div class="short-input flex">
                <div>
                  <p>Expiration Date</p>
                  <input class="short" type="text" value="11 / 22" />
                </div>
                <div>
                  <p>Security Code</p>
                  <input class="short" type="text" value="776" />
                </div>
              </div>
            </div>
            <div class="name-inputs flex">
              <div>
                <p>First Name</p>
                <input class="name-input" type="text" />
              </div>
              <div>
                <p>Last Name</p>
                <input class="name-input" type="text" />
              </div>
            </div>
          </section>
          <div class="icon flex paypal" v-html="getSvg('Paypal')"></div>
        </section>
        <section class="package-container">
          <section class="gig-package-payment">
            <div class="main-header">
              <section class="header flex space-between">
                <div class="img-container">
                  <img :src="gig.images[0]" alt="" />
                </div>
                <p class="title">{{ gig.title }}</p>
              </section>
              <div class="seller-h3 flex align-center space-between">
                <h3>basic Order</h3>
                <h3 class="price">US{{ gig.price }}$</h3>
              </div>
              <ul class="features">
                <li class="regular">
                  <div
                    className=" regular fill svg-container"
                    v-html="getSvg('checkSign')"></div>
                  1 concept included
                </li>
                <li class="regular">
                  <div
                    className="svg-container icon regular fill"
                    v-html="getSvg('checkSign')"></div>
                  Logo transparency
                </li>
                <li class="regular">
                  <div
                    className="svg-container icon regular fill"
                    v-html="getSvg('checkSign')"></div>
                  Include 3D mockup
                </li>
                <li class="regular">
                  <div
                    className="svg-container icon regular fill"
                    v-html="getSvg('checkSign')"></div>
                  1 concept included
                </li>
                <li class="regular">
                  <div
                    className="svg-container icon regular fill"
                    v-html="getSvg('checkSign')"></div>
                  Include source file
                </li>
              </ul>
            </div>
            <div class="footer-purchase">
              <div class="pricing">
                <p>Service Fee</p>
                <p>US$17.55</p>
              </div>
              <div class="pricing">
                <p>VAT</p>
                <p>US$17</p>
              </div>
              <div class="pricing total">
                <p>You'll pay</p>
                <p>US${{ handlePrice }}</p>
              </div>
              <div class="pricing">
                <p class="bold">Total Delivery Time</p>
                <p>7 Days</p>
              </div>
              <button @click="handlePurchase" class="continue-btn">
                Confirm & Pay
              </button>
            </div>
          </section>
        </section>
      </section>
    </section>
  </section>
  <div v-if="openSignUp">
    <Join />
  </div>
</template>

<script>
import { svgService } from '../services/svg.service'
import { gigService } from '../services/gig.service'
import { pushScopeId } from 'vue'
import { ordersService } from '../services/order.service'
import Join from '../cmps/Join.vue'
import {
  socketService,
  SOCKET_EMIT_USER_GIG_APPROVED,
} from '../services/socket.service'

export default {
  props: ['isBackDrop'],
  name: '',
  data() {
    return {
      gig: null,
      openSignUp: false,
    }
  },
  methods: {
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },
    async handlePurchase() {
      this.$emit('wow')
      if (this.loggedinUser) {
        const order = {
          buyer: this.loggedinUser,
          seller: this.gig.owner,
          gig: {
            _id: this.gig._id,
            name: this.gig.title,
            price: this.gig.price,
            img: this.gig.images[0],
          },
          status: 'Pending',
          date: new Date().toLocaleDateString(),
        }
        this.$store.dispatch({ type: 'saveOrder', order: { ...order } })
        setTimeout(() => {
          this.$router.push('/')
        }, 500)
        socketService.emit(SOCKET_EMIT_USER_GIG_APPROVED, order)
      } else {
        this.openSignUp = true
      }
    },
    HandleLogoClick() {
      this.$router.push(`/`)
    },
  },
  computed: {
    handlePrice() {
      return this.gig.price + 34.55
    },
    loggedinUser() {
      return this.$store.getters.loggedinUser
    },
  },
  async created() {
    const { id } = this.$route.params
    gigService.getById(id).then((gig) => {
      this.gig = gig
    })
    const loggedinUser = this.$store.getters.loggedinUser
    console.log(loggedinUser)
  },
  components: {
    Join,
  },
}
</script>

<style></style>
