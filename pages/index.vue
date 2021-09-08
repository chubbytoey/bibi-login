<template>
  <div class="container">
    <div class="img-wrap">
      <img src="./../bibi.JPG">
    </div>
    <p>IG: {{ profile ? profile.email:'bibibi' }}</p>
    <a-input v-model="data.email" placeholder="email" :disabled="disable" />
    <a-input v-model="data.password" placeholder="password" :disabled="disable" />
    <a-button :loading="loading" @click="onSubmit">
      {{ key }}
    </a-button>
  </div>
</template>

<script>
// import userAPI from '~/api/user'
import axios from 'axios'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

export default {
  data () {
    return {
      loading: false,
      data: {
        email: 'kunjanaphorn.b@gmail.com',
        password: 'avalue',
        fingerPrintId: ''
      },
      key: 'Login',
      verify: {},
      profile: {},
      disable: false
    }
  },
  watch: {
    'key' (val) {
      if (this.key === 'Logout') {
        this.disable = true
      } else {
        this.disable = false
      }
    }
  },
  async mounted () {
    try {
      console.log('access', localStorage.getItem('accessToken'))
      if (!localStorage.getItem('accessToken') || !localStorage.getItem('refreshToken')) {
        const fpPromise = FingerprintJS.load()
        const fp = await fpPromise
        const result = await fp.get()
        const visitorId = result.visitorId

        const verify = await axios.post('https://dtm-api.avalue.co.th/api/verifySSOToken', {}, {
          headers: {
            Authorization: 'Bearer ' + visitorId
          }
        })
        this.verify = verify.data
        console.log('verify token', this.verify, verify)

        localStorage.setItem('accessToken', this.verify.accessToken)
        localStorage.setItem('refreshToken', this.verify.refreshToken)

        this.getProfile()
      } else {
        console.log('hey')
        if (!this.$route.query.url) {
          this.getProfile()
        } else {
          const redirect = this.$route.query.url
          console.log('redirect', redirect, unescape(redirect))
          window.location.href = redirect
        }
      }
    } catch (error) {
      console.log(error)
    }

    // if (localStorage.getItem('accessToken') && localStorage.getItem('refreshToken')) {
    //   if (!this.$route.query.url) {
    //     this.getProfile()
    //   } else {
    //     const redirect = this.$route.query.url
    //     console.log('redirect', redirect, unescape(redirect))
    //     window.location.href = redirect
    //   }
    // }
  },
  methods: {
    async getProfile () {
      const profile = await axios.get('https://dtm-api.avalue.co.th/api/newProfile', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      })

      this.profile = profile.data

      this.key = 'Logout'
    },
    async onSubmit () {
      if (this.key === 'Login') {
        console.log('login')
        this.loading = true
        const fpPromise = FingerprintJS.load()
        const fp = await fpPromise
        const result = await fp.get()
        this.data.fingerPrintId = result.visitorId
        try {
          await axios.post('https://dtm-api.avalue.co.th/api/newLogin', this.data)
          if (this.$route.query.url) {
            const redirect = this.$route.query.url
            console.log('redirect', redirect, unescape(redirect))

            window.location.href = redirect
          } else {
            const verify = await axios.post('https://dtm-api.avalue.co.th/api/verifySSOToken', {}, {
              headers: {
                Authorization: 'Bearer ' + this.data.fingerPrintId
              }
            })
            this.verify = verify.data
            localStorage.setItem('accessToken', this.verify.accessToken)
            localStorage.setItem('refreshToken', this.verify.refreshToken)

            this.getProfile()
            this.loading = false
          }
        } catch (error) {
          this.loading = false
          this.$message.error(
            'Error message, and it will disappear in 10 seconds',
            10
          )
        }
      } else {
        console.log('logout')
        await axios.post('https://dtm-api.avalue.co.th/api/newLogout', {}, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('accessToken')
          }
        })
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.reload()
      }
    }
  }
}
</script>
<style scoped lang="scss">
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #008080;
  & input {
    width: 30%;
    margin-bottom: 6px;
  }
  & > .img-wrap {
    width: 300px;
    height: 300px;
    & > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      border:10px solid #fff;
    }
  }
  & button {
    margin-top: 32px;
    background-color: #fff;
    border: none;
    width: 180px;
    height: 42px;
    font-weight: bold;
    text-transform: uppercase;
    color:#008080;
    &:hover {
      box-shadow: 0px 4px 28px rgba(0, 0, 0, 0.25);
    }
  }
  & > p {
    margin-top: 12px;
    margin-bottom: 24px;
    font-weight: bold;
    color:#fff;
  }
}
</style>
