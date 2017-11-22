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
