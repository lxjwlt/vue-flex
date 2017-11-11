/**
 * @file flex-item component
 */

function isNumber (str) {
    return str && str.match && str.match(/^\d+$/);
}

function isUnitNumber (str) {
    return str && str.match && str.match(/^\d+[^\d]+$/);
}

module.exports = {

    props: {
        order: {
            type: [Number, String]
        },
        flex: {
            type: [Number, String]
        },
        alignSelf: {
            type: String
        }
    },

    computed: {
        cls: function () {
            if (this.alignSelf) {
                return 'vue-item--align-self-' + this.alignSelf;
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

    render: function (createElem) {
        return createElem('div', {
            'class': ['vue-flex-item', this.cls],
            style: this.style
        }, [ this.$slots.default ]);
    }

};
