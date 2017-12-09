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

function getUltimates (arr, func, isMax) {
    var match = [],
        ultimate = isMax ? -Infinity : Infinity;

    if (typeof arr === 'number') {
        arr = Array.apply(null, Array(arr)).map(function (v, i) {
            return i;
        });
    }

    arr.forEach(function (item, i) {
        var value = func(item, i);
        if (isMax && value > ultimate || !isMax && value < ultimate) {
            match = [item];
            ultimate = value;
        } else if (value === ultimate) {
            match.push(item);
        }
    });

    return match;
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
            width: 0,
            height: 0
        };
    },
    computed: {
        resets: function () {
            var isColumn = this.isColumn,
                containerSize = isColumn ? this.height : this.width,
                noSpillIndex = -1,
                grow = [], shrink = [], basis = [], contentSize = [],
                staticSize = 0, growSum = 0, basisSum = 0, shrinkSum = 0,
                match, del, isGrow, radio;

            this.$children.forEach(function (child, i) {
                var basisSize = isColumn ? child.height : child.width,
                    childContentSize = isColumn ? child.contentHeight : child.contentWidth;

                grow.push(child.cFlex.flexGrow);
                shrink.push(child.cFlex.flexShrink);
                basis.push(basisSize);
                contentSize.push(childContentSize);

                growSum += child.cFlex.flexGrow;
                basisSum += basisSize;
                shrinkSum += child.cFlex.flexShrink * basisSize;

                if (child.spill) {
                    staticSize += childContentSize;
                } else {
                    noSpillIndex = i;
                }
            });

            if (containerSize < staticSize) {
                return [];
            }

            del = containerSize - basisSum;
            isGrow = del >= 0;

            if (noSpillIndex < 0) {
                radio = isGrow ?
                    (growSum ? del / growSum : 0) :
                    (shrinkSum ? del / shrinkSum : 0);

                match = getUltimates(grow.length, function (index) {
                    return basis[index] + (
                        isGrow ? radio * grow[index] : radio * shrink[index] * basis[index]
                    );
                }, 1);

                match = getUltimates(match, function (index) {
                    return contentSize[index];
                }, 0);

            } else {
                radio = (contentSize[noSpillIndex] - basis[noSpillIndex]) / (
                    isGrow ? grow[noSpillIndex] : shrink[noSpillIndex] * basis[noSpillIndex]
                );

                match = grow.reduce(function (arr, spill, i) {
                    var size = basis[i] + radio * (
                        isGrow ? grow[i] : shrink[i] * basis[i]
                    );

                    if (size >= contentSize[i]) {
                        arr.push(i);
                    }

                    return arr;
                }, []);
            }

            return match;
        }
    },

    watch: {
        resets: {
            deep: true,
            handler: function () {
                var vm = this;
                vm.resets.slice(0).forEach(function (index) {
                    vm.$children[index].$emit('reset');
                });
            }
        }
    },

    mounted: function () {
        var vm = this;

        this.sensor = new ResizeSensor(vm.$el, function (width, height) {
            vm.width = width;
            vm.height = height;
        });

        vm.width = vm.$el.offsetWidth;
        vm.height = vm.$el.offsetHeight;
    }
};

module.exports = util.oldIE ? ieComponent : base;
