var flex = require('./flex'),
    inlineFlex = require('./inline-flex'),
    flexItem = require('./flex-item');

require('./index.css');

module.exports= {
    flex: flex,
    inlineFlex: inlineFlex,
    flexItem: flexItem,
    install: function (Vue) {
        Vue.component('flex', flex);
        Vue.component('inline-flex', inlineFlex);
        Vue.component('flex-item', flexItem);
    }
};
