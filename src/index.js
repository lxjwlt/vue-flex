var flex = require('./flex'),
    flexItem = require('./flex-item');

require('./index.css');

module.exports= {
    flex: flex,
    flexItem: flexItem,
    install: function (Vue) {
        Vue.component('vue-flex', flex);
        Vue.component('vue-item', flexItem);
    }
};
