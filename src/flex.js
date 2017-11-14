/**
 * @file flex component
 */

function fixName (name) {
    return name.replace(/[A-Z]/g, function (value) {
        return '-' + value.toLowerCase();
    });
}

module.exports = {

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
         * Fix bugs of IE10-11 by nested flex wrapper and a extra min-height-holder:
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
