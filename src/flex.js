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
            var allSpill = true;
            var map = this.$children.reduce(function (map, child) {
                var basis = child.width;
                map.grow.push(child.cFlex.flexGrow);
                map.shrink.push(child.cFlex.flexShrink);
                map.basis.push(basis);
                map.spill.push(child.spill);
                map.contentWidth.push(child.contentWidth);

                map.growSum += child.cFlex.flexGrow;
                map.basisSum += basis;
                map.shrinkSum += child.cFlex.flexShrink * basis;

                if (child.spill) {
                    map.staticWidth += child.contentWidth;
                } else {
                    allSpill = false;
                }

                return map;
            }, {
                width: [],
                grow: [],
                shrink: [],
                basis: [],
                spill: [],
                contentWidth: [],
                basisSum: 0,
                growSum: 0,
                shrinkSum: 0,
                staticWidth: 0
            });

            if (this.width < map.staticWidth) {
                return [];
            }

            var del = this.width - map.basisSum;

            if (allSpill) {
                var match = [];
                var maxWidth = 0;
                var radio = del >= 0 ?
                    (map.growSum ? del / map.growSum : 0) :
                    (map.shrinkSum ? del / map.shrinkSum : 0);

                map.grow.forEach(function (grow, i) {
                    var width = map.basis[i] + (
                        del >= 0 ? radio * grow : radio * map.shrink[i] * map.basis[i]
                    );

                    if (width > maxWidth) {
                        match = [i];
                        maxWidth = width;
                    } else if (width === maxWidth) {
                        match.push(i);
                    }
                });
                maxWidth = Infinity;
                match = match.reduce(function (arr, index) {
                    var width = map.contentWidth[index];

                    if (width < maxWidth) {
                        arr = [index];
                        maxWidth = width;
                    } else if (width === maxWidth) {
                        arr.push(index);
                    }

                    return arr;
                }, []);

            } else {
                var targetIndex = map.spill.reduce(function (targetIndex, value, index) {
                    return value ? targetIndex : index;
                }, -1);

                var targetRatio = (map.contentWidth[targetIndex] - map.basis[targetIndex]) / (
                    del >= 0 ? map.grow[targetIndex] : map.shrink[targetIndex] * map.basis[targetIndex]
                );

                match = map.spill.reduce(function (arr, spill, i) {
                    if (spill) {
                        var width = map.basis[i] + targetRatio * (
                            del >= 0 ? map.grow[i] : map.shrink[i] * map.basis[i]
                        );

                        if (width >= map.contentWidth[i]) {
                            arr.push(i);
                        }
                    } else {
                        arr.push(i);
                    }
                    return arr;
                }, []);
            }

            return match || [];
        }
    },

    mounted: function () {
        var vm = this;

        this.sensor = new ResizeSensor(vm.$el, function () {

            if (vm.$el.offsetWidth > vm.width) {
                var match = vm.flexes.slice(0);
                vm.$children.forEach(function (child, i) {
                    child.$emit('recalculation', match.indexOf(i) >= 0);
                });
            }

            vm.width = vm.$el.offsetWidth;
        });

        vm.width = vm.$el.offsetWidth;
    }
};

module.exports = util.oldIE ? ieComponent : base;
