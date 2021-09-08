<template>
  <div class="container">
    <div class="img-wrap">
      <img src="./../bibi.JPG">
    </div>
    <p>IG: {{ profile ? profile.email:'bibibi' }}</p>
    <a-input v-model="data.email" placeholder="email" :disabled="disable" />
    <a-input v-model="data.password" placeholder="password" :disabled="disable" />
    <a-button :loading="loading" :disabled="disable" @click="onSubmit">
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
  mounted () {
    // const ssoToken = localStorage.getItem('ssoGlobal')
    // if (ssoToken && this.$route.query.url) {
    //   console.log(ssoToken)
    //   const redirect = window.location.href.split('?url=')
    //   console.log('redirect', unescape(redirect[1]) + '?ssoToken=' + ssoToken)
    //   window.location.href = unescape(redirect[1]) + '?ssoToken=' + ssoToken
    // }
  },
  methods: {
    async onSubmit () {
      if (this.key === 'Login') {
        this.loading = true
        const fpPromise = FingerprintJS.load()
        const fp = await fpPromise
        const result = await fp.get()
        this.data.fingerPrintId = result.visitorId
        try {
          await axios.post('https://dtm-api.avalue.co.th/api/newLogin', this.data)
          // const url = data.data.url.split('?ssoToken=')
          // localStorage.setItem('ssoGlobal', url[1])
          console.log('before')
          if (this.$route.query.url) {
            console.log('after 1')

            const redirect = this.$route.query.url
            window.location.href = unescape(redirect[1])
          } else {
            console.log('after 2')

            const verify = await axios.post('https://dtm-api.avalue.co.th/api/verifySSOToken', {}, {
              headers: {
                Authorization: 'Bearer ' + this.data.fingerPrintId
              }
            })
            this.verify = verify.data
            localStorage.setItem('accessToken', this.verify.accessToken)
            localStorage.setItem('refreshToken', this.verify.refreshToken)

            const profile = await axios.get('https://dtm-api.avalue.co.th/api/newProfile', {
              headers: {
                Authorization: 'Bearer ' + this.verify.accessToken
              }
            })

            this.profile = profile.data

            this.key = 'Logout'
            this.loading = false

            console.log('key', this.key, this.profile)
          }
        } catch (error) {
          console.log('err', error)
          this.loading = false
          this.$message.error(
            'This is a prompt message for success, and it will disappear in 10 seconds',
            10
          )
        }
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
