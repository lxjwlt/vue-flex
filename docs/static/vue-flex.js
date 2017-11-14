/**
 * vue-flex v0.0.1
 * (c) 2017-present lxjwlt
 * Released under the MIT license
 * https://github.com/lxjwlt/vue-flex.git
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global['vue-flex'] = factory());
}(this, (function () { 'use strict';

function __$styleInject(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  head.appendChild(style);
  
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  return returnValue;
}

/**
 * @file flex component
 */

function fixName (name) {
    return name.replace(/[A-Z]/g, function (value) {
        return '-' + value.toLowerCase();
    });
}

var flex = {

    props: {
        flexDirection: {
            type: String
        },
        flexWrap: {
            type: String
        },
        justifyContent: {
            type: String
        },
        alignItems: {
            type: String
        },
        alignContent: {
            type: String
        }
    },

    computed: {
        cls: function () {
            var vm = this;

            return [
                'flexDirection', 'flexWrap', 'justifyContent',
                'alignItems', 'alignContent'
            ].filter(function (name) {
                return vm[name];
            }).map(function (name) {
                return 'vue-flex--' + fixName(name) + '-' + vm[name];
            });
        }
    },

    render: function (createElem) {

        /**
         * Fix bugs of IE10-11 by nested flex wrapper and extra min-height-holder:
         * 1. In IE 10-11, if min-height declarations on flex containers,
         *    their flex item children calculate size incorrectly.
         * 2. "align-content:center" doesn't work if "min-height" declarations on flex containers
         *    in column direction in IE 10-11
         */
        return createElem('div', {
            'class': 'vue-flex'
        }, [
            createElem('div', {
                'class': ['vue-flex_inner', this.cls]
            }, this.$slots.default),
            createElem('div', {
                'class': 'vue-flex_min-height-holder'
            })
        ]);
    }

};

/**
 * @file flex-item component
 */

function isNumber (str) {
    return str && str.match && str.match(/^\d+$/);
}

function isUnitNumber (str) {
    return str && str.match && str.match(/^\d+[^\d]+$/);
}

function isEmptyCssValue (value) {
    value = value.trim();
    return !value || value === 'none' || parseInt(value, 10) === 0;
}

function hasPadding (style) {
    return [
        style.paddingLeft, style.paddingRight,
        style.paddingTop, style.paddingBottom
    ].some(function (value) {
        return !isEmptyCssValue(value);
    });
}

function hasBorder (style) {
    return [
        style.borderLeftWidth, style.borderRightWidth,
        style.borderTopWidth, style.borderBottomWidth
    ].some(function (value) {
        return !isEmptyCssValue(value);
    });
}

var flexItem = {

    props: {
        order: {
            type: [Number, String]
        },
        flex: {
            type: [Number, String],
            'default': 1
        },
        alignSelf: {
            type: String
        }
    },

    computed: {
        cls: function () {
            if (this.alignSelf) {
                return 'vue-flex-item--align-self-' + this.alignSelf;
            }
        },
        currentFlex: function () {
            var value = String(this.flex).trim(),
                arr = value.split(/\s+/g);

            /**
             * Fix: default value of 'flex-shrink' property is "0" in Internet Explorer 10,
             * so fix that value to "1" when `flex-shrink` is not defined.
             */
            if (value === 'auto') {
                return '1 1 auto';
            }

            if (value === 'initial') {
                return '0 1 auto';
            }

            if (value === 'none') {
                return '0 0 auto';
            }

            if (isNumber(value)) {
                return value + ' 1 0%';
            }

            if (isUnitNumber(value)) {
                return '1 1 ' + value;
            }

            if (arr.length === 2 && isUnitNumber(arr[1])) {
                return arr[0] + ' 1 ' + arr[1];
            }

            /**
             * Fix: unitless `flex-basis` values are ignored in Internet Explorer 10-11
             */
            if (arr.length === 3 && arr[2] === '0') {
                return [arr[0], arr[1], '0px'].join(' ');
            }

            return value;
        },
        style: function () {
            var style = {};

            if (this.order || this.order === 0) {
                style.msFlexOrder = this.order;
                style.order = this.order;
            }

            if (this.currentFlex) {
                style.flex = this.currentFlex;
            }

            return style;
        }
    },

    watch: {
        flex: function () {
            this.__checkBoxSizingBug();
        }
    },

    render: function (createElem) {
        return createElem('div', {
            'class': ['vue-flex-item', this.cls],
            style: this.style
        }, [ this.$slots.default ]);
    },

    mounted: function () {
        this.__checkBoxSizingBug();
    },

    methods: {
        __checkBoxSizingBug: function () {
            var vm = this;
            vm.$nextTick(function () {
                var style = window.getComputedStyle(vm.$el);

                if (style.boxSizing === 'content-box') {
                    return;
                }

                var arr = vm.currentFlex.split(/\s+/g);

                if (arr[2] && arr[2] !== 'auto' && !isEmptyCssValue(arr[2]) &&
                    (hasPadding(style) || hasBorder(style))) {
                    throw(new Error([
                        'It is not allowed to Apply "padding" or "border" to a flex item,',
                        'when using "flex-basis" to determine its size.',
                        'because IE 10-11 always assume a content box model in this case,',
                        'even if that item is set to "box-sizing:border-box".'
                    ].join(' ')));
                }
            });
        }
    }

};

__$styleInject(".vue-flex,\n.vue-flex_inner {\n    display: -webkit-flex;\n    display: -ms-flexbox;\n    display: flex;\n}\n\n.vue-flex_inner {\n    -webkit-flex: 1 1 0%;\n    -ms-flex: 1 1 0%;\n    flex: 1 1 0%;\n}\n\n.vue-flex_min-height-holder {\n    display: inline-block;\n    min-height: inherit;\n    visibility: hidden;\n}\n\n.vue-flex--flex-direction-row {\n    -webkit-flex-direction: row;\n        -ms-flex-direction: row;\n            flex-direction: row;\n}\n\n.vue-flex--flex-direction-row-reverse {\n    -webkit-flex-direction: row-reverse;\n        -ms-flex-direction: row-reverse;\n            flex-direction: row-reverse;\n}\n\n.vue-flex--flex-direction-column {\n    -webkit-flex-direction: column;\n        -ms-flex-direction: column;\n            flex-direction: column;\n}\n\n.vue-flex--flex-direction-column-reverse {\n    -webkit-flex-direction: column-reverse;\n        -ms-flex-direction: column-reverse;\n            flex-direction: column-reverse;\n}\n\n.vue-flex--flex-wrap-nowrap {\n    -webkit-flex-wrap: nowrap;\n        -ms-flex-wrap: nowrap;\n            flex-wrap: nowrap;\n}\n\n.vue-flex--flex-wrap-wrap {\n    -webkit-flex-wrap: wrap;\n        -ms-flex-wrap: wrap;\n            flex-wrap: wrap;\n}\n\n.vue-flex--flex-wrap-wrap-reverse {\n    -webkit-flex-wrap: wrap-reverse;\n        -ms-flex-wrap: wrap-reverse;\n            flex-wrap: wrap-reverse;\n}\n\n.vue-flex--justify-content-flex-start {\n    -webkit-justify-content:flex-start;\n        -ms-flex-pack:start;\n            justify-content:flex-start;\n}\n\n.vue-flex--justify-content-flex-end {\n    -webkit-justify-content: flex-end;\n        -ms-flex-pack: end;\n            justify-content: flex-end;\n}\n\n.vue-flex--justify-content-center {\n    -webkit-justify-content: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n}\n\n.vue-flex--justify-content-space-between {\n    -webkit-justify-content: space-between;\n        -ms-flex-pack: justify;\n            justify-content: space-between;\n}\n\n.vue-flex--justify-content-space-around {\n    -webkit-justify-content: space-around;\n        -ms-flex-pack: distribute;\n            justify-content: space-around;\n}\n\n.vue-flex--align-items-flex-start {\n    -webkit-align-items: flex-start;\n        -ms-flex-align: start;\n            align-items: flex-start;\n}\n\n.vue-flex--align-items-flex-end {\n    -webkit-align-items: flex-end;\n        -ms-flex-align: end;\n            align-items: flex-end;\n}\n\n.vue-flex--align-items-center {\n    -webkit-align-items: center;\n        -ms-flex-align: center;\n            align-items: center;\n}\n\n.vue-flex--align-items-stretch {\n    -webkit-align-items: stretch;\n        -ms-flex-align: stretch;\n            align-items: stretch;\n}\n\n.vue-flex--align-items-baseline {\n    -webkit-align-items: baseline;\n        -ms-flex-align: baseline;\n            align-items: baseline;\n}\n\n.vue-flex--align-content-flex-start {\n    -webkit-align-content: flex-start;\n        -ms-flex-line-pack: start;\n            align-content: flex-start;\n}\n\n.vue-flex--align-content-flex-end {\n    -webkit-align-content: flex-end;\n        -ms-flex-line-pack: end;\n            align-content: flex-end;\n}\n\n.vue-flex--align-content-center {\n    -webkit-align-content: center;\n        -ms-flex-line-pack: center;\n            align-content: center;\n}\n\n.vue-flex--align-content-stretch {\n    -webkit-align-content: stretch;\n        -ms-flex-line-pack: stretch;\n            align-content: stretch;\n}\n\n.vue-flex--align-content-space-between {\n    -webkit-align-content: space-between;\n        -ms-flex-line-pack: justify;\n            align-content: space-between;\n}\n\n.vue-flex--align-content-space-around {\n    -webkit-align-content: space-around;\n        -ms-flex-line-pack: distribute;\n            align-content: space-around;\n}\n\n.vue-flex-item {\n\n    /*\n        Fix: default value of 'flex-shrink' property is '0' in IE10\n    */\n    -webkit-flex: 1 1 0%;\n        -ms-flex: 1 1 0%;\n            flex: 1 1 0%;\n\n    /*\n        Fix: When using \"align-items:center\" on a flex container in the column direction,\n        the contents of flex item, if too big, will overflow their container in IE 10-11.\n    */\n    max-width: 100%;\n}\n\n.vue-flex-item--align-self-auto {\n    -webkit-align-self: auto;\n        -ms-flex-item-align: auto;\n            align-self: auto;\n}\n\n.vue-flex-item--align-self-flex-start {\n    -webkit-align-self: flex-start;\n        -ms-flex-item-align: start;\n            align-self: flex-start;\n}\n\n.vue-flex-item--align-self-flex-end {\n    -webkit-align-self: flex-end;\n        -ms-flex-item-align: end;\n            align-self: flex-end;\n}\n\n.vue-flex-item--align-self-center {\n    -webkit-align-self: center;\n        -ms-flex-item-align: center;\n            align-self: center;\n}\n\n.vue-flex-item--align-self-baseline {\n    -webkit-align-self: baseline;\n        -ms-flex-item-align: baseline;\n            align-self: baseline;\n}\n\n.vue-flex-item--align-self-stretch {\n    -webkit-align-self: stretch;\n        -ms-flex-item-align: stretch;\n            align-self: stretch;\n}\n",undefined);

var src= {
    flex: flex,
    flexItem: flexItem,
    install: function (Vue) {
        Vue.component('flex', flex);
        Vue.component('flex-item', flexItem);
    }
};

return src;

})));
