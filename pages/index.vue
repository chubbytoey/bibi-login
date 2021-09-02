<template>
  <div class="container">
    <div class="img-wrap">
      <img src="./../bibi.JPG">
    </div>
    <p>IG: bibibadaboobeepbeep</p>
    <a-button :loading="loading" @click="onSubmit">
      Login
    </a-button>
  </div>
</template>

<script>
// import userAPI from '~/api/user'
import axios from 'axios'
export default {
  data () {
    return {
      loading: false,
      data: {
        email: 'kunjanphorn.b@gmail.com',
        password: 'avalue'
      }
    }
  },
  methods: {
    async onSubmit () {
      this.loading = true
      try {
        const data = await axios.post('https://dtm-api.avalue.co.th/api/newLogin?url=https%3A%2F%2Fwww.google.com', this.data)
        console.log('boo', data)
      } catch (error) {
        console.log('err', error)
      }
      // userAPI.login(this.data)
      //   .then((result) => {
      //     console.log('boo', result)
      //     this.loading = false
      //   }).catch((err) => {
      //     console.log(err)
      //   })
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
