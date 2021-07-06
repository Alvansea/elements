module.exports = {
  methods: {
    $save: function(item, index, cb) {
      if (this.save) {
        this.save(item, index, cb);
      } else if (this.api) {
        Vue.resource(this.api + '{/id}')
          .save({ id: item._id || item.id }, item)
          .then(function(res) {
            cb && cb(res.body.errMsg, res.body);
          })
          .catch(function(res) {
            console.log('* ResourceMixin.$save', res)
            cb && cb(res.body || res)
          })
      } else {
        cb && cb(new Error('No api or save method defined!'))
      }
    }
  }
}