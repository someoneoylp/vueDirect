'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (Vue) {
    Vue.directive('touch', {
        bind: function bind(el, binding, vnode) {
            var type = binding.arg; // 传入点击的类型
            var coordinate = {}; // 记录坐标点的对象
            var timeOutTap = void 0;
            var timeOutLong = void 0;
            var scaleSize = void 0; // 缩放尺寸
            var displacement = {}; //移动的位移
            // 勾股定理计算距离
            function getDistance(bg, end) {
                return Math.sqrt(Math.pow(end.x - bg.x, 2) + Math.pow(end.y - bg.y, 2));
            }
            // 点击开始的时候
            el.addEventListener('touchstart', function (e) {
                // 获取第一个手指点击的坐标
                var x = e.touches[0].pageX;
                var y = e.touches[0].pageY;
                // 如果点击的时间很长，那么点击的类型就是长按 --- longTouch
                timeOutLong = setTimeout(function () {
                    timeOutLong = 0;
                    if (type === 'longTouch') {
                        binding.value.func(binding.value.param);
                    }
                }, 2000);
                timeOutTap = setTimeout(function () {
                    timeOutTap = 0;
                    if (type === 'tap' && e.touches.length === 1) {
                        binding.value.func(binding.value.param);
                    }
                }, 200);
                // 如果是两个手指，而且类型是缩放 --- scaleTocuh
                if (e.touches.length > 1 && type === 'scaleTouch') {
                    // 记录双指的间距长度
                    coordinate.start = getDistance({
                        x: e.touches[0].pageX,
                        y: e.touches[0].pageY
                    }, {
                        x: e.touches[1].pageX,
                        y: e.touches[1].pageY
                    });
                }
                // 如果是移动的话，还要记录下来最开始的位置,只能一个手指位移
                if (type === 'slideTouch' && e.touches.length == 1) {
                    // debugger
                    displacement.start = {
                        x: e.touches[0].pageX,
                        y: e.touches[0].pageY
                    };
                }
            }, false);

            el.addEventListener('touchmove', function (e) {
                clearTimeout(timeOutTap);
                clearTimeout(timeOutLong);
                timeOutTap = 0;timeOutLong = 0;
                // 如果是缩放类型
                if (type == 'scaleTouch' && e.touches.length === 2) {
                    // 计算移动过程中的两个手指的距离
                    coordinate.stop = getDistance({
                        x: e.touches[0].pageX,
                        y: e.touches[0].pageY
                    }, {
                        x: e.touches[1].pageX,
                        y: e.touches[1].pageY
                    });
                    // 设置缩放尺寸
                    scaleSize = coordinate.stop / coordinate.start - 1;
                    // 这里设置图片不能无限放大与缩小
                    // 这里设置放大缩小速度慢一点，所以 /4一下
                    binding.value.func(scaleSize / 2, false);
                }
                // 如果是移动类型
                if (type == 'slideTouch' && e.touches.length === 1) {
                    displacement.end = {
                        x: e.changedTouches[0].pageX,
                        y: e.changedTouches[0].pageY
                    };
                    binding.value.func({ x: displacement.end.x - displacement.start.x, y: displacement.end.y - displacement.start.y, is_endMove: false });
                }
            }, false);

            el.addEventListener('touchend', function (e) {
                if (type === 'scaleTouch') {
                    binding.value.func(0, true);
                }
                if (type === 'slideTouch') {
                    binding.value.func({ x: 0, y: 0, is_endMove: true });
                }
            }, false);
        }
    });
};