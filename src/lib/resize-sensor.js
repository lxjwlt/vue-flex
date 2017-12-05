var util = require('./util');

module.exports = function (list, callback) {
    if (!list.hasOwnProperty('length')) {
        list = [list];
    }
    list.forEach(function (element) {
        bindSensor(element, callback);
    });
};


function bindSensor (element, callback) {

    if (element.__resizeQueue) {
        element.__resizeQueue.push(callback)
        return
    }

    var queue = element.__resizeQueue = [callback];

    var sensor = element.__resizeSensor = document.createElement('div');

    var style = util.cssText({
        position: 'absolute',
        left: '-10px',
        top: '-10px',
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        'z-index': -1,
        visibility: 'hidden'
    });

    var styleChild = util.cssText({
        position: 'absolute',
        left: 0,
        top: 0,
        transition: '0s'
    });

    var shrinkStyleChild = styleChild + ';' + util.cssText({
        width: '200%',
        height: '200%'
    });

    sensor.style.cssText = style;

    sensor.innerHTML =
        '<div style="' + style + '">' +
        '<div style="' + styleChild + '"></div>' +
        '</div>' +
        '<div style="' + style + '">' +
        '<div style="' + shrinkStyleChild + '"></div>' +
        '</div>';

    element.appendChild(sensor);

    if (sensor.offsetParent !== element) {
        util.css(element, {
            position: 'relative'
        });
    }

    var expand = sensor.childNodes[0];
    var expandChild = expand.childNodes[0];
    var shrink = sensor.childNodes[1];
    var dirty, timeID, newWidth, newHeight;
    var lastWidth = element.offsetWidth;
    var lastHeight = element.offsetHeight;
    var BIG_SIZE = 1000000;

    var reset = function () {
        expandChild.style.height =
            expandChild.style.width = BIG_SIZE + 'px';

        expand.scrollLeft = BIG_SIZE
        expand.scrollTop = BIG_SIZE

        shrink.scrollLeft = BIG_SIZE
        shrink.scrollTop = BIG_SIZE
    }

    reset()

    function onResized () {
        timeID = 0

        if (!dirty) return;

        lastWidth = newWidth
        lastHeight = newHeight

        for (var i = 0; i < queue.length; i++) {
            queue[i](newWidth, newHeight, element);
        }
    }

    function onScroll () {
        newWidth = element.offsetWidth
        newHeight = element.offsetHeight
        dirty = newWidth != lastWidth || newHeight != lastHeight

        if (dirty && !timeID) {
            timeID = requestAnimationFrame(onResized)
        }

        reset()
    }

    expand.addEventListener('scroll', onScroll);
    shrink.addEventListener('scroll', onScroll);
}
