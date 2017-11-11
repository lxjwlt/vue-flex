<template>
    <!--
        Fix bugs of IE10-11 by nested flex wrapper:
        1. In IE 10-11, if min-height declarations on flex containers,
           their flex item children calculate size incorrectly.
        2. "align-content:center" doesn't work if "min-height" declarations on flex containers
           in column direction in IE 10-11
     -->
    <div class="vue-flex">
        <div class="vue-flex_inner" :class="cls">
            <slot></slot>
        </div>
    </div>
</template>

<script>

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
        }

    };

</script>

<style>
    .vue-flex,
    .vue-flex_inner {
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
    }

    .vue-flex--flex-direction-row {
        -webkit-flex-direction: row;
        -ms-flex-direction: row;
        flex-direction: row;
    }

    .vue-flex--flex-direction-row-reverse {
        -webkit-flex-direction: row-reverse;
        -ms-flex-direction: row-reverse;
        flex-direction: row-reverse;
    }

    .vue-flex--flex-direction-column {
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
    }

    .vue-flex--flex-direction-column-reverse {
        -webkit-flex-direction: column-reverse;
        -ms-flex-direction: column-reverse;
        flex-direction: column-reverse;
    }

    .vue-flex--flex-wrap-nowrap {
        -webkit-flex-wrap: nowrap;
        -ms-flex-wrap: nowrap;
        flex-wrap: nowrap;
    }

    .vue-flex--flex-wrap-wrap {
        -webkit-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
    }

    .vue-flex--flex-wrap-wrap-reverse {
        -webkit-flex-wrap: wrap-reverse;
        -ms-flex-wrap: wrap-reverse;
        flex-wrap: wrap-reverse;
    }

    .vue-flex--justify-content-flex-start {
        -webkit-justify-content:flex-start;
        -ms-flex-pack:start;
        justify-content:flex-start;
    }

    .vue-flex--justify-content-flex-end {
        -webkit-justify-content: flex-end;
        -ms-flex-pack: end;
        justify-content: flex-end;
    }

    .vue-flex--justify-content-center {
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
    }

    .vue-flex--justify-content-space-between {
        -webkit-justify-content: space-between;
        -ms-flex-pack: justify;
        justify-content: space-between;
    }

    .vue-flex--justify-content-space-around {
        -webkit-justify-content: space-around;
        -ms-flex-pack: distribute;
        justify-content: space-around;
    }

    .vue-flex--align-items-flex-start {
        -webkit-align-items: flex-start;
        -ms-flex-align: start;
        align-items: flex-start;
    }

    .vue-flex--align-items-flex-end {
        -webkit-align-items: flex-end;
        -ms-flex-align: end;
        align-items: flex-end;
    }

    .vue-flex--align-items-center {
        -webkit-align-items: center;
        -ms-flex-align: center;
        align-items: center;
    }

    .vue-flex--align-items-stretch {
        -webkit-align-items: stretch;
        -ms-flex-align: stretch;
        align-items: stretch;
    }

    .vue-flex--align-items-baseline {
        -webkit-align-items: baseline;
        -ms-flex-align: baseline;
        align-items: baseline;
    }

    .vue-flex--align-content-flex-start {
        -webkit-align-content: flex-start;
        -ms-flex-line-pack: start;
        align-content: flex-start;
    }

    .vue-flex--align-content-flex-end {
        -webkit-align-content: flex-end;
        -ms-flex-line-pack: end;
        align-content: flex-end;
    }

    .vue-flex--align-content-center {
        -webkit-align-content: center;
        -ms-flex-line-pack: center;
        align-content: center;
    }

    .vue-flex--align-content-stretch {
        -webkit-align-content: stretch;
        -ms-flex-line-pack: stretch;
        align-content: stretch;
    }

    .vue-flex--align-content-space-between {
        -webkit-align-content: space-between;
        -ms-flex-line-pack: justify;
        align-content: space-between;
    }

    .vue-flex--align-content-space-around {
        -webkit-align-content: space-around;
        -ms-flex-line-pack: distribute;
        align-content: space-around;
    }
</style>
