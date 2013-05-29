var Cache;

Cache = function() {
  this.cache = {};
};

Cache.prototype = {
  push: function(key, value) {
    this.cache[key] = value;
  },

  fetch: function(key) {
    return this.cache[key];
  },

  flush: function(key) {
    delete this.cache[key];
  }
};

module.exports = new Cache();
