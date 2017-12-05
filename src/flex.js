/**
 * @file flex component
 */

var ResizeSensor = require('./lib/resize-sensor'),
    util = require('./lib/util');

function fixName (name) {
    return name.replace(/[A-Z]/g, function (value) {
        return '-' + value.toLowerCase();
    });
}

var base = {

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
                return {
                    margin: -(this.cGutter / 2) + 'px'
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
                style: this.css,
                ref: 'inner'
            }, this.$slots.default),
            createElem('div', {
                class: 'vue-flex_min-height-holder'
            })
        ]);
    }

};

var ieComponent = {

    mixins: [base],

    data: function () {
        return {
            width: 0
        };
    },
    computed: {
        flexes: function () {
            var map = this.$children.reduce(function (map, child) {
                var basis = child.width;
                map.grow.push(child.cFlex.flexGrow);
                map.shrink.push(child.cFlex.flexShrink);
                map.basis.push(basis);
                map.growSum += child.cFlex.flexGrow;
                map.basisSum += basis;
                map.shrinkSum += child.cFlex.flexShrink * basis;
                return map;
            }, {
                width: [],
                grow: [],
                shrink: [],
                basis: [],
                basisSum: 0,
                growSum: 0,
                shrinkSum: 0
            });

            var del = this.width - map.basisSum;

            if (del >= 0) {
                if (map.growSum) {
                    map.grow.forEach(function (grow, i) {
                        map.width[i] = map.basis[i] + del * grow / map.growSum;
                    })
                } else {
                    map.width = map.basis;
                }

            } else {
                if (map.growSum) {
                    map.shrink.forEach(function (shrink, i) {
                        map.width[i] = map.basis[i] - del * map.basis[i] * shrink / map.shrinkSum;
                    });
                } else {
                    map.width = map.basis;
                }

            }

            return map;
        }
    },

    mounted: function () {
        var vm = this;

        this.sensor = new ResizeSensor(vm.$el, function () {

            if (vm.$el.offsetWidth > vm.width) {
                vm.$children.forEach(function (child, i) {
                    child.$emit('recalculation', vm.flexes.width[i]);
                });
            }

            vm.width = vm.$el.offsetWidth;
        });

        vm.width = vm.$el.offsetWidth;
    }
};

module.exports = util.oldIE ? ieComponent : base;
