var flex = require('./flex.vue'),
    flexItem = require('./flex-item.vue');

module.exports= {
    flex: flex,
    flexItem: flexItem,
    install: function (Vue) {
        Vue.component('vue-flex', flex);
        Vue.component('vue-item', flexItem);
    }
};
