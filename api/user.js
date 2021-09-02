import instanceAPI from '~/api/instance'

export default {
  login: (data) => {
    return instanceAPI.api.post('/newLogin?url=https%3A%2F%2Fwww.google.com', data)
      .then((response) => {
        console.log('hihi', response)
        // response.data
      })
  }
}
