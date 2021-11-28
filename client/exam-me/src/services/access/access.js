export default {
  client: null,
  withApi: function(client) {
    this.client = client
    return this
  },
  get: function(body) {
    return this.client.post('/createAccessMqtt', body)
  },
  update: function(body) {
    return this.client.post('/updateAccessMqtt', body)
  }
}