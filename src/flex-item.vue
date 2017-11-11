<template>
    <div class="vue-flex-item" :class="cls" :style="style">
        <slot></slot>
    </div>
</template>

<script>

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
        }

    };

</script>

<style>
    .vue-flex-item {

        /*
            Fix: default value of 'flex' property is '0 1 auto' in modern browser,
            but it is '0 0 auto' in Internet Explorer 10
        */
        -webkit-flex: 0 1 auto;
        -ms-flex: 0 1 auto;
        flex: 0 1 auto;

        /*
            Fix: When using "align-items:center" on a flex container in the column direction,
            the contents of flex item, if too big, will overflow their container in IE 10-11.
        */
        max-width: 100%;
    }

    .vue-flex-item--align-self-auto {
        -webkit-align-self: auto;
        -ms-flex-item-align: auto;
        align-self: auto;
    }

    .vue-flex-item--align-self-flex-start {
        -webkit-align-self: flex-start;
        -ms-flex-item-align: start;
        align-self: flex-start;
    }

    .vue-flex-item--align-self-flex-end {
        -webkit-align-self: flex-end;
        -ms-flex-item-align: end;
        align-self: flex-end;
    }

    .vue-flex-item--align-self-center {
        -webkit-align-self: center;
        -ms-flex-item-align: center;
        align-self: center;
    }

    .vue-flex-item--align-self-baseline {
        -webkit-align-self: baseline;
        -ms-flex-item-align: baseline;
        align-self: baseline;
    }

    .vue-flex-item--align-self-stretch {
        -webkit-align-self: stretch;
        -ms-flex-item-align: stretch;
        align-self: stretch;
    }
</style>
