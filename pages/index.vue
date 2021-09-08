<template>
  <div class="container">
    <div class="img-wrap">
      <img src="./../bibi.JPG">
    </div>
    <p>IG: bibibadaboobeepbeep</p>
    <a-input v-model="data.email" placeholder="email" />
    <a-input v-model="data.password" placeholder="password" />
    <a-button :loading="loading" @click="onSubmit">
      Login
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
      this.loading = true
      const fpPromise = FingerprintJS.load()
      const fp = await fpPromise
      const result = await fp.get()
      // const visitorId = result.visitorId
      this.data.fingerPrintId = result.visitorId
      try {
        await axios.post('https://dtm-api.avalue.co.th/api/newLogin', this.data)
        // const url = data.data.url.split('?ssoToken=')
        // localStorage.setItem('ssoGlobal', url[1])
        const redirect = window.location.href.split('?url=')
        window.location.href = unescape(redirect[1])
      } catch (error) {
        console.log('err', error)
        this.$message.error(
          'This is a prompt message for success, and it will disappear in 10 seconds',
          10
        )
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
