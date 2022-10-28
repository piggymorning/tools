// 使用时间戳版
function throttle1(func, wait) {
	let args, context
	let previous = 0
	return function () {
		context = this
		args = arguments
		let now = + new Date()
		if (now - previous > wait) {
			func.apply(context, args)
			previous = now
		}
	}
}

// 使用定时器版
function throttle2(func, wait) {
	let timeout, context, args
	return function () {
		context = this
		args = arguments
		if (!timeout) {
			timeout = setTimeout(function () {
				timeout = null
				func.apply(context, args)
			}, wait)
		}
	}
}

/*
	时间戳版特点是第一次触发就会执行，停止触发后不会再执行。定时器版的特点是第一次触发不会执行，但停止触发后，还会再执行一次
	接下来是结合版
	之所以会有这种结合版，主要是因为通过对时间戳版和定时器版的单纯改造，无法实现稳定的间隔一段时间执行一次函数
 */

function throttle3(func, wait) {
	let args, timeout, context
	let previous = 0
	return function () {
		context = this
		args = arguments
		const now = +new Date()
		const remaining = wait - (now - previous)
		if (remaining <= 0 || remaining > wait) {
			// 此处清理上一次定时器，是为了防止在上一次定时器执行过后，下一次的定时器会立即加上。
			if(timeout){
				clearTimeout(timeout)
				timeout = null
			}
			func.apply(context, args)
			previous = now
		} else if (!timeout) {
			timeout = setTimeout(function () {
				timeout = null
				// 此处对previous做处理是防止timeout执行后， 时间戳部分会立即执行
				previous = now
				func.apply(context,remaining)
			}, wait)
		}
	}
}