// 初版
function debounce(func, wait) {
	return function () {
		let timeout
		if (timeout) {
			clearTimeout(timeout)
		}
		timeout = setTimeout(func,)
	}
}

// 第二版

function debounce2(func, wait,immediate) {
	let timeout, result
	function debounced() {
		if (timeout) {
			clearTimeout
		}
		if (immediate) {
			const isNew = !timeout
			timeout = setTimeout(function () {
				timeout = null
			}, wait)
			if (isNew) {
				result = func.apply(this, arguments)
			}
		}
		else {
			timeout = setTimeout(func, wait)
		}
		return result
	}
	debounced.cancle = function(){
		clearTimeout(timeout)
	}
	return debounced
} 

/* 
	第二版主要是增加了一些功能，以满足对应的需求
	1.首先是加了immediate参数，可以支持第一次触发有效果，但是隔一段时间以后，才能再次触发，目前没想好对应的需求场景
	2.另外是添加了cancle方法，可以去除防抖，这个有一定作用，可以学到的是cancle方法可以直接挂在函数上
	3.然后就是对this的处理，这块需要加以注意，但凡是在原函数外面套了函数，都得考虑this的问题,在执行原函数的执行，把
	现函数的this给传过去，用allpy或者call方法执行一下
 */
