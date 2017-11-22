/**
 * vue-flex v0.1.0
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
        flexDirection: String,
        flexWrap: String,
        justifyContent: String,
        alignItems: String,
        alignContent: String,
        gutter: [String, Number]
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
        },
        isColumn: function () {
            return ['column', 'column-reverse'].indexOf(this.flexDirection) >= 0;
        },
        cGutter: function () {
            return Number(this.gutter) || 0;
        },
        css: function () {
            if (this.cGutter) {
                var margin = -(this.cGutter / 2) + 'px';
                return {
                    marginLeft: margin,
                    marginRight: margin,
                    marginTop: margin,
                    marginBottom: margin
                };
            }
        }
    },

    render: function (createElem) {

        /**
         * Fix bugs of IE10-11 by nested flex wrapper and a extra min-height-holder:
         * - Fix flexbugs#3: "min-height" on a flex container won't apply to its flex items
         * - "align-content:center" doesn't work if "min-height" declarations on flex containers
         *    in column direction in IE 10-11
         */
        return createElem('div', {
            class: 'vue-flex'
        }, [
            createElem('div', {
                class: ['vue-flex_inner', this.cls],
                style: this.css
            }, this.$slots.default),
            createElem('div', {
                class: 'vue-flex_min-height-holder'
            })
        ]);
    }

};

/**
 * @file flex-item component
 */

function isNumber (str) {
    var m = str.match(/^[\d.\-+]+$/);
    return m && !isNaN(m);
}

function splitStr (value) {
    return value ? value.split(/\s+/g) : [];
}

var defaultFlex = '1';

var flexItem = {

    props: {
        order: [Number, String],
        flex: {
            type: [Number, String],
            'default': defaultFlex
        },
        alignSelf: String
    },

    computed: {
        cls: function () {
            if (this.alignSelf) {
                return 'vue-flex-item--align-self-' + this.alignSelf;
            }
        },
        cFlex: function () {
            var value = !this.flex && this.flex !== 0 ? defaultFlex : String(this.flex).trim(),
                parent = this.$parent,
                arr = splitStr(value),
                len = arr.length,
                obj = {},
                i;

            if (len > 3) {
                arr = [defaultFlex];
                len = 1;
            }

            for (i = len - 1; i >= 0; i--) {
                if (!isNumber(arr[i])) {
                    arr.push(arr.splice(i, 1)[0]);
                }
            }

            value = arr.join(' ');

            /**
             * Fix flexbugs#6: The default flex value has changed
             */
            if (value === 'auto') {
                value = '1 1 auto';
            } else if (value === 'inherit') {
                value = 'inherit inherit inherit';
            } else if (value === 'unset') {
                value = 'unset unset unset';
            } else if (value === 'initial') {
                value = '0 1 auto';
            } else if (value === 'none') {
                value = '0 0 auto';
            } else if (len === 1) {
                value = isNumber(value) ? value + ' 1 0%' : '1 1 ' + value;
            } else if (len === 2) {
                value = isNumber(arr[0]) && isNumber(arr[1]) ?
                    value + ' 0%' : arr[0] + ' 1 ' + arr[1];
            } else if (len === 3) {

                /**
                 * Fix flexbugs#4: flex shorthand declarations with unitless flex-basis values are ignored
                 */
                value = arr[2] === '0' ? [arr[0], arr[1], '0px'].join(' ') : value;
            }

            arr = splitStr(value);

            /**
             * fix flexbugs#7: flex-basis doesn't account for box-sizing:border-box
             * fix flexbugs#8: flex-basis doesn't support calc()
             */
            if (arr[2].match(/\d/)) {
                obj[parent && parent.isColumn ? 'height' : 'width'] = arr[2];
                arr[2] = 'auto';
            }

            obj.flexGrow = obj.msFlexPositive = arr[0];

            obj.flexShrink = obj.msFlexNegative = arr[1];

            obj.flexBasis = obj.msFlexPreferredSize = arr[2];

            return obj;
        },
        css: function () {
            var style = {},
                parent = this.$parent,
                cFlex = this.cFlex;

            if (this.order || this.order === 0) {
                style.msFlexOrder = this.order;
                style.order = this.order;
            }

            Object.keys(cFlex).forEach(function (key) {
                style[key] = cFlex[key];
            });

            if (parent && parent.cGutter) {
                style.marginTop = style.marginBottom =
                    style.marginLeft = style.marginRight =
                        (parent.cGutter / 2) + 'px';
            }

            return style;
        }
    },

    render: function (createElem) {
        return createElem('div', {
            class: ['vue-flex-item', this.cls],
            style: this.css
        }, [ this.$slots.default ]);
    }

};

__$styleInject(".vue-flex,\n.vue-flex_inner {\n    display: -webkit-flex;\n    display: -ms-flexbox;\n    display: flex;\n}\n\n.vue-flex_inner {\n    -webkit-flex: 1 1 0%;\n    -ms-flex: 1 1 0%;\n    flex: 1 1 0%;\n}\n\n.vue-flex_min-height-holder {\n    display: inline-block;\n    min-height: inherit;\n    visibility: hidden;\n}\n\n.vue-flex--flex-direction-row {\n    -webkit-flex-direction: row;\n        -ms-flex-direction: row;\n            flex-direction: row;\n}\n\n.vue-flex--flex-direction-row-reverse {\n    -webkit-flex-direction: row-reverse;\n        -ms-flex-direction: row-reverse;\n            flex-direction: row-reverse;\n}\n\n.vue-flex--flex-direction-column {\n    -webkit-flex-direction: column;\n        -ms-flex-direction: column;\n            flex-direction: column;\n}\n\n.vue-flex--flex-direction-column-reverse {\n    -webkit-flex-direction: column-reverse;\n        -ms-flex-direction: column-reverse;\n            flex-direction: column-reverse;\n}\n\n.vue-flex--flex-wrap-nowrap {\n    -webkit-flex-wrap: nowrap;\n        -ms-flex-wrap: nowrap;\n            flex-wrap: nowrap;\n}\n\n.vue-flex--flex-wrap-wrap {\n    -webkit-flex-wrap: wrap;\n        -ms-flex-wrap: wrap;\n            flex-wrap: wrap;\n}\n\n.vue-flex--flex-wrap-wrap-reverse {\n    -webkit-flex-wrap: wrap-reverse;\n        -ms-flex-wrap: wrap-reverse;\n            flex-wrap: wrap-reverse;\n}\n\n.vue-flex--justify-content-flex-start {\n    -webkit-justify-content:flex-start;\n        -ms-flex-pack:start;\n            justify-content:flex-start;\n}\n\n.vue-flex--justify-content-flex-end {\n    -webkit-justify-content: flex-end;\n        -ms-flex-pack: end;\n            justify-content: flex-end;\n}\n\n.vue-flex--justify-content-center {\n    -webkit-justify-content: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n}\n\n.vue-flex--justify-content-space-between {\n    -webkit-justify-content: space-between;\n        -ms-flex-pack: justify;\n            justify-content: space-between;\n}\n\n.vue-flex--justify-content-space-around {\n    -webkit-justify-content: space-around;\n        -ms-flex-pack: distribute;\n            justify-content: space-around;\n}\n\n.vue-flex--align-items-flex-start {\n    -webkit-align-items: flex-start;\n        -ms-flex-align: start;\n            align-items: flex-start;\n}\n\n.vue-flex--align-items-flex-end {\n    -webkit-align-items: flex-end;\n        -ms-flex-align: end;\n            align-items: flex-end;\n}\n\n.vue-flex--align-items-center {\n    -webkit-align-items: center;\n        -ms-flex-align: center;\n            align-items: center;\n}\n\n.vue-flex--align-items-stretch {\n    -webkit-align-items: stretch;\n        -ms-flex-align: stretch;\n            align-items: stretch;\n}\n\n.vue-flex--align-items-baseline {\n    -webkit-align-items: baseline;\n        -ms-flex-align: baseline;\n            align-items: baseline;\n}\n\n.vue-flex--align-content-flex-start {\n    -webkit-align-content: flex-start;\n        -ms-flex-line-pack: start;\n            align-content: flex-start;\n}\n\n.vue-flex--align-content-flex-end {\n    -webkit-align-content: flex-end;\n        -ms-flex-line-pack: end;\n            align-content: flex-end;\n}\n\n.vue-flex--align-content-center {\n    -webkit-align-content: center;\n        -ms-flex-line-pack: center;\n            align-content: center;\n}\n\n.vue-flex--align-content-stretch {\n    -webkit-align-content: stretch;\n        -ms-flex-line-pack: stretch;\n            align-content: stretch;\n}\n\n.vue-flex--align-content-space-between {\n    -webkit-align-content: space-between;\n        -ms-flex-line-pack: justify;\n            align-content: space-between;\n}\n\n.vue-flex--align-content-space-around {\n    -webkit-align-content: space-around;\n        -ms-flex-line-pack: distribute;\n            align-content: space-around;\n}\n\n.vue-flex-item {\n\n    /* Fix flexbugs#2: Column flex items set to align-items:center overflow their container */\n    max-width: 100%;\n\n}\n\n.vue-flex-item--align-self-auto {\n    -webkit-align-self: auto;\n        -ms-flex-item-align: auto;\n            align-self: auto;\n}\n\n.vue-flex-item--align-self-flex-start {\n    -webkit-align-self: flex-start;\n        -ms-flex-item-align: start;\n            align-self: flex-start;\n}\n\n.vue-flex-item--align-self-flex-end {\n    -webkit-align-self: flex-end;\n        -ms-flex-item-align: end;\n            align-self: flex-end;\n}\n\n.vue-flex-item--align-self-center {\n    -webkit-align-self: center;\n        -ms-flex-item-align: center;\n            align-self: center;\n}\n\n.vue-flex-item--align-self-baseline {\n    -webkit-align-self: baseline;\n        -ms-flex-item-align: baseline;\n            align-self: baseline;\n}\n\n.vue-flex-item--align-self-stretch {\n    -webkit-align-self: stretch;\n        -ms-flex-item-align: stretch;\n            align-self: stretch;\n}\n",undefined);

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
