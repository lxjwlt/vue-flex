/**
 * @file flex-item component
 */

function isNumber (str) {
    var m = str.match(/^[\d.\-+]+$/);
    return m && !isNaN(m);
}

function isUnitNumber (str) {
    var m = str.match(/^([\d.\-+]+)[^\s\d.\-+]+$/);
    return m && !isNaN(m[1]);
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

module.exports = {

    props: {
        order: [Number, String],
        flex: {
            type: [Number, String],
            'default': 1
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

            if (arr.length === 2 && (!isNumber(arr[0]) || !isNumber(arr[1]))) {
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
        css: function () {
            var style = {},
                parent = this.$parent;

            if (this.order || this.order === 0) {
                style.msFlexOrder = this.order;
                style.order = this.order;
            }

            if (this.cFlex) {
                style.flex = this.cFlex;
            }

            if (parent && parent.cGutter) {
                style.marginTop = style.marginBottom =
                    style.marginLeft = style.marginRight =
                        (parent.cGutter / 2) + 'px';
            }

            return style;
        }
    },

    watch: {
        cFlex: function () {
            this.__checkBoxSizingBug();
        }
    },

    render: function (createElem) {
        return createElem('div', {
            class: ['vue-flex-item', this.cls],
            style: this.css
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

                var arr = vm.cFlex.split(/\s+/g);

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
