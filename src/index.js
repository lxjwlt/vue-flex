var flex = require('./flex'),
    flexItem = require('./flex-item');

require('./index.css');

module.exports= {
    flex: flex,
    flexItem: flexItem,
    install: function (Vue) {
        Vue.component('flex', flex);
        Vue.component('flex-item', flexItem);
    }
};
