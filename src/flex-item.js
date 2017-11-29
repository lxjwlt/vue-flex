/**
 * @file flex-item component
 */

var ResizeSensor = require('./lib/resize-sensor'),
    util = require('./lib/util'),
    defaultFlex = '1';

function isNumber (str) {
    var m = str.match(/^[\d.\-+]+$/);
    return m && !isNaN(m);
}

function splitStr (value) {
    var arr = value.trim().split(''),
        count = 0;

    return arr.map(function (char) {
        if (char === '(') {
            count += 1;
        } else if (char === ')') {
            count -= 1;
        }

        return !count && char === ' ' ? ':' : char;
    }).join('').split(/:+/g);
}

function throttle (callback) {
    var timeID = 0;

    return function () {
        if (!timeID) {
            timeID = requestAnimationFrame(function () {
                timeID = 0;
                callback();
            });
        }
    };
}

var ieMixin = {

    data: function () {
        return {
            width: 0,
            height: 0,
            'padding-left': '0px',
            'padding-right': '0px',
            'padding-bottom': '0px',
            'padding-top': '0px',
            'border-left-width': '0px',
            'border-right-width': '0px',
            'border-bottom-width': '0px',
            'border-top-width': '0px'
        };
    },

    computed: {
        sensorWidth: function () {
            return 'calc(' + [
                this.cFlex.flexBasis,
                this['padding-left'],
                this['padding-right'],
                this['border-left-width'],
                this['border-right-width']
            ].join(' - ') + ')';
        },
        sensorHeight: function () {
            return 'calc(' + [
                this.cFlex.flexBasis,
                this['padding-top'],
                this['padding-bottom'],
                this['border-left-top'],
                this['border-right-bottom']
            ].join(' - ') + ')';
        }
    },

    watch: {
        sensorWidth: function () {
            this.__updateSensor();
        },
        sensorHeight: function () {
            this.__updateSensor();
        }
    },

    mounted: function () {
        var vm = this;

        vm.__updateSensor();

        vm.$el.addEventListener('transitionend', throttle(vm.__updateBox));

        vm.__updateBox();
    },

    methods: {

        /**
         * fix flexbugs#7: flex-basis doesn't account for box-sizing:border-box
         * fix flexbugs#8: flex-basis doesn't support calc()
         */
        __updateSensor: function () {
            var vm = this,
                sensor = vm.sensor;

            if (!sensor) {
                sensor = vm.sensor = document.createElement('div');

                util.css(sensor, {
                    position: 'absolute',
                    'z-index': -999,
                    visibility: 'hidden',
                    opacity: 0,
                    width: vm.sensorWidth,
                    height: vm.sensorHeight
                });

                vm.$parent.$refs.inner.appendChild(sensor);

                new ResizeSensor(sensor, function () {
                    vm.width = sensor.offsetWidth;
                    vm.height = sensor.offsetHeight;
                });

                vm.width = sensor.offsetWidth;
                vm.height = sensor.offsetHeight;
            } else {
                util.css(sensor, {
                    width: vm.sensorWidth,
                    height: vm.sensorHeight
                });
            }
        },

        __updateBox: function () {
            var vm = this,
                style = getComputedStyle(vm.$el);

            Object.keys(vm.$data).forEach(function (name) {
                if (name.match(/^(padding|border)/)) {
                    vm[name] = style[name];
                }
            });
        }

    },
    beforeDestroy: function () {
        if (this.sensor) {
            this.sensor.parentNode.removeChild(this.sensor);
        }
    }

};

module.exports = {

    mixins: util.oldIE ? [ieMixin] : [],

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
        gutter: function () {
            return this.$parent && this.$parent.cGutter || 0;
        },
        isColumn: function () {
            return this.$parent && this.$parent.isColumn;
        },
        cFlex: function () {
            var value = !this.flex && this.flex !== 0 ? defaultFlex : String(this.flex).trim(),
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

            obj.flexGrow = obj.msFlexPositive = arr[0];

            obj.flexShrink = obj.msFlexNegative = arr[1];

            obj.flexBasis = obj.msFlexPreferredSize = arr[2];

            return obj;
        },
        css: function () {
            var style = {},
                cFlex = this.cFlex;

            if (this.order || this.order === 0) {
                style.msFlexOrder = this.order;
                style.order = this.order;
            }

            Object.keys(cFlex).forEach(function (key) {
                style[key] = cFlex[key];
            });

            if (util.oldIE) {
                style.flexBasis = style.msFlexPreferredSize =
                    (this.isColumn ? this.height : this.width) + 'px';
            }

            if (this.gutter) {
                style.margin = (this.gutter / 2) + 'px';
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
