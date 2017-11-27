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

module.exports = {

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
            if (arr[2] !== 'content') {
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
                cFlex = this.cFlex;

            if (this.order || this.order === 0) {
                style.msFlexOrder = this.order;
                style.order = this.order;
            }

            Object.keys(cFlex).forEach(function (key) {
                style[key] = cFlex[key];
            });

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
