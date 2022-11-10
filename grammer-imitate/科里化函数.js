// 这个科里化函数干的事情就是执行了相当于没执行，做了一下传参的叠加
function sub_curry(fn) {
	const args = Array.prototype.slice(arguments, 1)
	return function () {
		const argus = Array.prototype.slice(arguments)
		return fn.apply(this, args.concat(argus))
	}
}
// 这个curry中干的事也不多，主要就是做了个判断，看看传的参数个数够不够，够的话直接执行，不够的话，传给sub_curry函数，再包一层，做下参数叠加
function curry(fn, length) {
	length = length || fn.length
	const slice = Array.prototype.slice
	return function () {
		const args = [].concat(fn,slice.call(arguments))
		if (arguments < length) {
			return curry(sub_curry.apply(this, args), length - args.length)
		}
		else {
			return fn.apply(this, args)
		}
	}
}
