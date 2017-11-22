'use strict';

var assert = require('chai').assert;
var Vue = require('vue/dist/vue');
var vueFlex = require('../src/index');

Vue.config.silent = true;
Vue.config.productionTip = false;
Vue.config.devtools = false;

function comp (name, data) {
    Vue.use(vueFlex);
    return (new (Vue.extend(Vue.component(name)))({
        propsData: data
    })).$mount();
}

function newApp (config) {
    Vue.use(vueFlex);

    let app = new Vue(config);

    app.$mount();

    return app;
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
            let app = newApp({
                template: '<flex ref="flex"><flex-item ref="flexItem"></flex-item></flex>'
            });

            let flexComp = app.$refs.flexItem;
            let flexboxComp = app.$refs.flex;

            flexComp.$props.flex = 'auto';
            assert.deepStrictEqual(flexComp.cFlex, {
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: 'auto'
            });

            flexComp.$props.flex = 'initial';
            assert.deepStrictEqual(flexComp.cFlex, {
                flexGrow: '0',
                flexShrink: '1',
                flexBasis: 'auto'
            });

            flexComp.$props.flex = 'none';
            assert.deepStrictEqual(flexComp.cFlex, {
                flexGrow: '0',
                flexShrink: '0',
                flexBasis: 'auto'
            });

            flexComp.$props.flex = '2';
            assert.deepStrictEqual(flexComp.cFlex, {
                flexGrow: '2',
                flexShrink: '1',
                flexBasis: 'auto',
                width: '0%'
            });

            flexComp.$props.flex = '2.5';
            assert.deepStrictEqual(flexComp.cFlex, {
                flexGrow: '2.5',
                flexShrink: '1',
                flexBasis: 'auto',
                width: '0%'
            });

            flexComp.$props.flex = '10px';
            assert.deepStrictEqual(flexComp.cFlex, {
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: 'auto',
                width: '10px'
            });

            flexComp.$props.flex = '10.05%';
            assert.deepStrictEqual(flexComp.cFlex, {
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: 'auto',
                width: '10.05%'
            });

            flexComp.$props.flex = '1 30%';
            assert.deepStrictEqual(flexComp.cFlex, {
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: 'auto',
                width: '30%'
            });

            flexComp.$props.flex = '1 auto';
            assert.deepStrictEqual(flexComp.cFlex, {
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: 'auto'
            });

            flexComp.$props.flex = '1 30px';
            assert.deepStrictEqual(flexComp.cFlex, {
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: 'auto',
                width: '30px'
            });

            flexComp.$props.flex = 'auto 1';
            assert.deepStrictEqual(flexComp.cFlex, {
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: 'auto'
            });

            flexComp.$props.flex = 'auto 10px';
            assert.deepStrictEqual(flexComp.cFlex, {
                flexGrow: '10px',
                flexShrink: '1',
                flexBasis: 'auto'
            });

            flexComp.$props.flex = '1 1 0';
            assert.deepStrictEqual(flexComp.cFlex, {
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: 'auto',
                width: '0px'
            });

            flexComp.$props.flex = '10px 1 0';
            assert.deepStrictEqual(flexComp.cFlex, {
                flexGrow: '1',
                flexShrink: '0',
                flexBasis: 'auto',
                width: '10px'
            });

            flexComp.$props.flex = 0;
            assert.deepStrictEqual(flexComp.cFlex, {
                flexGrow: '0',
                flexShrink: '1',
                flexBasis: 'auto',
                width: '0%'
            });

            flexComp.$props.flex = 'inherit';
            assert.deepStrictEqual(flexComp.cFlex, {
                flexGrow: 'inherit',
                flexShrink: 'inherit',
                flexBasis: 'inherit'
            });

            flexComp.$props.flex = 'unset';
            assert.deepStrictEqual(flexComp.cFlex, {
                flexGrow: 'unset',
                flexShrink: 'unset',
                flexBasis: 'unset'
            });

            flexComp.$props.flex = 'max-content';
            assert.deepStrictEqual(flexComp.cFlex, {
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: 'max-content'
            });

            flexboxComp.$props.flexDirection = 'column';
            flexComp.$props.flex = '10px';
            assert.deepStrictEqual(flexComp.cFlex, {
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: 'auto',
                height: '10px'
            });
            flexboxComp.$props.flexDirection = 'row';

            /**
             * error flex
             */
            flexComp.$props.flex = '';
            assert.deepStrictEqual(flexComp.cFlex, {
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: 'auto',
                width: '0%'
            });

            flexComp.$props.flex = '1 1 10px 1';
            assert.deepStrictEqual(flexComp.cFlex, {
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: 'auto',
                width: '0%'
            });

            flexComp.$props.flex = true;
            assert.deepStrictEqual(flexComp.cFlex, {
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: 'true'
            });

            flexComp.$props.flex = undefined;
            assert.deepStrictEqual(flexComp.cFlex, {
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: 'auto',
                width: '0%'
            });
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
    });
});
