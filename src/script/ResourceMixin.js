module.exports = {
  methods: {
    $save: function(item, index, cb) {
      var self = this
      var api = this.api || this.view.api
      console.log('save to', api)
      return new Promise(function(resolve, reject) {
        if (self.save) {
          return self.save(item, index, function(err, result) {
            if (err) {
              reject(err)
            } else {
              resolve(result)
            }
          });
        } else if (api) {
          return Vue.resource(api + '{/id}')
            .save({ id: item._id || item.id }, item)
            .then(resolve)
            .catch(reject)
        } else {
          reject('No api or save method defined!')
        }
      })
    }
  }
}