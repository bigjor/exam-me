export default {
  client: null,
  withApi: function(client) {
    this.client = client
    return this
  },
  get: function(id) {
    return this.client.get(`/room/${id}`)
  }
}