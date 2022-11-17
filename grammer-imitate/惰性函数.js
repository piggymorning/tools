/*
	惰性函数的应用场景是如果一个函数，在一个需要判断场景的情况下，只需要判断一次，后面就不需要判断了，那么就不需要搞一个函数，
	每次调用都重复走一遍判断过程
	惰性函数的实现原理也非常简单，就是函数里面加判断，判断好了以后，把结果函数直接赋给原惰性函数变量，这样第一次执行完毕以后，
	后面的执行就都是已经判断好的函数在执行了
 */

function addEvent (type, el, fn) {
    if (window.addEventListener) {
        addEvent = function (type, el, fn) {
            el.addEventListener(type, fn, false);
        }
    }
    else if(window.attachEvent){
        addEvent = function (type, el, fn) {
            el.attachEvent('on' + type, fn);
        }
    }
}