/**
 * @file inline-flex component
 */

module.exports = {
    mixins: [
        require('./flex')
    ],
    props: {
        inline: {
            default: 1,

            /**
             * not allow to change
             */
            validator: function (value) {
                return value;
            }
        }
    }
};
