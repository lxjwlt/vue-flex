'use strict';

var assert = require('chai').assert;
var Vue = require('vue/dist/vue');
var vueFlex = require('../src/index');

Vue.config.productionTip = false;
Vue.config.devtools = false;

function comp (name, data) {
    return (new (Vue.extend(Vue.component(name)))({
        propsData: data
    })).$mount();
}

function elem () {
    let box = document.createElement('div');

    document.body.appendChild(box);

    return box;
}

describe('vue-flex', () => {
    it('exports is no omission', function () {
        assert.ok(vueFlex.flex);
        assert.ok(vueFlex.inlineFlex);
        assert.ok(vueFlex.flexItem);
        assert.ok(vueFlex.install);
        assert.strictEqual(Object.keys(vueFlex).length, 4);
    });

    it('install and register component successfully', function () {
        Vue.use(vueFlex);
        assert.ok(Vue.component('flex'));
        assert.ok(Vue.component('inline-flex'));
        assert.ok(Vue.component('flex-item'));
    });

    describe('flex component', () => {
        it('flex class name', function () {
            let flexComp = comp('flex', {
                flexDirection: 'column',
                flexWrap: 'wrap',
                justifyContent: 'stretch',
                alignContent: 'flex-end',
                alignItems: 'center'
            });

            assert.include(flexComp.cls, 'vue-flex--flex-direction-column');
            assert.include(flexComp.cls, 'vue-flex--flex-wrap-wrap');
            assert.include(flexComp.cls, 'vue-flex--justify-content-stretch');
            assert.include(flexComp.cls, 'vue-flex--align-content-flex-end');
            assert.include(flexComp.cls, 'vue-flex--align-items-center');
        });

        it('gutter', function () {
            let flexComp = comp('flex', {
                gutter: 10
            });

            assert.include(flexComp.css, {
                marginLeft: '-5px',
                marginRight: '-5px',
                marginTop: '-5px',
                marginBottom: '-5px',
            });
        });
    });

    describe('flex-item component', () => {
        it('order', function () {
            let flexComp = comp('flex-item', {
                order: 3
            });

            assert.include(flexComp.css, {
                msFlexOrder: 3,
                order: 3
            });
        });
        it('class name', function () {
            let flexComp = comp('flex-item', {
                alignSelf: 'flex-end'
            });

            assert.strictEqual(flexComp.cls, 'vue-flex-item--align-self-flex-end');
        });
        it('automate longhand of flex props', function () {
            let flexComp = comp('flex-item', {
                flex: 'auto'
            });

            assert.strictEqual(flexComp.cFlex.split(/\s+/g).length, 3);
            assert.strictEqual(flexComp.cFlex, '1 1 auto');

            flexComp.$props.flex = 'initial';

            assert.strictEqual(flexComp.cFlex.split(/\s+/g).length, 3);
            assert.strictEqual(flexComp.cFlex, '0 1 auto');

            flexComp.$props.flex = 'none';

            assert.strictEqual(flexComp.cFlex.split(/\s+/g).length, 3);
            assert.strictEqual(flexComp.cFlex, '0 0 auto');

            flexComp.$props.flex = '2';

            assert.strictEqual(flexComp.cFlex.split(/\s+/g).length, 3);
            assert.strictEqual(flexComp.cFlex, '2 1 0%');

            flexComp.$props.flex = '2.5';

            assert.strictEqual(flexComp.cFlex.split(/\s+/g).length, 3);
            assert.strictEqual(flexComp.cFlex, '2.5 1 0%');

            flexComp.$props.flex = '10px';

            assert.strictEqual(flexComp.cFlex.split(/\s+/g).length, 3);
            assert.strictEqual(flexComp.cFlex, '1 1 10px');

            flexComp.$props.flex = '10.05%';

            assert.strictEqual(flexComp.cFlex.split(/\s+/g).length, 3);
            assert.strictEqual(flexComp.cFlex, '1 1 10.05%');

            flexComp.$props.flex = '1 30%';

            assert.strictEqual(flexComp.cFlex.split(/\s+/g).length, 3);
            assert.strictEqual(flexComp.cFlex, '1 1 30%');

            flexComp.$props.flex = '1 auto';

            assert.strictEqual(flexComp.cFlex.split(/\s+/g).length, 3);
            assert.strictEqual(flexComp.cFlex, '1 1 auto');

            flexComp.$props.flex = '1 30px';

            assert.strictEqual(flexComp.cFlex.split(/\s+/g).length, 3);
            assert.strictEqual(flexComp.cFlex, '1 1 30px');

            flexComp.$props.flex = 'auto 1';

            assert.strictEqual(flexComp.cFlex.split(/\s+/g).length, 3);
            assert.strictEqual(flexComp.cFlex, 'auto 1 1');

            flexComp.$props.flex = 'auto 10px';

            assert.strictEqual(flexComp.cFlex.split(/\s+/g).length, 3);
            assert.strictEqual(flexComp.cFlex, 'auto 1 10px');

            flexComp.$props.flex = '1 1 0';

            assert.strictEqual(flexComp.cFlex.split(/\s+/g).length, 3);
            assert.strictEqual(flexComp.cFlex, '1 1 0px');

            flexComp.$props.flex = 0;

            assert.strictEqual(flexComp.cFlex.split(/\s+/g).length, 3);
            assert.strictEqual(flexComp.cFlex, '0 1 0%');

            flexComp.$props.flex = true;

            assert.strictEqual(flexComp.cFlex.split(/\s+/g).length, 1);
            assert.strictEqual(flexComp.cFlex, 'true');

            flexComp.$props.flex = undefined;

            assert.strictEqual(flexComp.cFlex.split(/\s+/g).length, 1);
            assert.strictEqual(flexComp.cFlex, 'undefined');
        });
        it('margin from gutter', function () {
            Vue.use(vueFlex);
            let app = new Vue({
                template: '<flex gutter="30"><flex-item ref="item"></flex-item></flex>'
            });

            app.$mount();

            assert.include(app.$refs.item.css, {
                marginTop: '15px',
                marginBottom: '15px',
                marginLeft: '15px',
                marginRight: '15px'
            });
        });
        it('padding error', function (done) {
            Vue.use(vueFlex);
            let app = new Vue({
                template: '<flex-item style="padding:10px;box-sizing:border-box;" flex="30%"></flex-item>',
                errorCaptured () {
                    done();
                    return false;
                }
            });

            app.$mount(elem());
        });

        it('no error while box-sizing was content-box', function (done) {
            let isError = false;

            Vue.use(vueFlex);

            let app = new Vue({
                template: '<flex-item style="padding:10px;" flex="30%"></flex-item>',
                errorCaptured () {
                    isError = true;
                    return false;
                }
            });

            app.$mount(elem());

            setTimeout(() => {
                if (isError) {
                    assert.ifError(new Error('should not be error'));
                }
                done();
            }, 1000);
        });

        it('error while flex is being set to explicit value', function (done) {
            Vue.use(vueFlex);

            let app = new Vue({
                template: '<flex-item style="border: 1px solid;box-sizing:border-box;" :flex="flex"></flex-item>',
                data: {
                    flex: 'initial'
                },
                errorCaptured () {
                    done();
                    return false;
                }
            });

            app.$mount(elem());

            setTimeout(() => {
                app.flex = '10px';
            }, 1000);
        });
    });
});
