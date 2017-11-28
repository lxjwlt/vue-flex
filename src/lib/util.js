module.exports = {
    css: function (elem, config, important) {
        Object.keys(config).forEach(function (name) {
            elem.style.setProperty(name, config[name], important === 0 ? '' : 'important');
        });
    },
    cssText: function (config, important) {
        var list = [];
        Object.keys(config).forEach(function (name) {
            list.push(name + ':' + config[name] + (important === 0 ? '' : '!important'));
        });
        return list.join(';');
    }
};
