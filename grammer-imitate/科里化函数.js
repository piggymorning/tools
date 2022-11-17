/*
	科里化函数的直观效果就是把一个多参数函数变为只接收一个参数，可多次执行的函数
	实际的意义在于有些多参数函数，可能功能比较多，通用性很大，但是不好复用（因为使用的情况很多，不同情况对函数传的参数可能不一样）
	如果把函数科里化以后，可以先执行几次，传几个固定的参数进去，这样就相当于把一个多功能的函数变为了具体功能的函数，这个函数
	可以接着往下执行，并且可以复用
*/ 




// 此函数执行了以后还是返回一个函数，执行的话就相当于执行原函数。所以做的事本质很简单，相当于对原函数做了一个参数的合并，原函数再执行的时候就多了
// 一些基本参数了
function sub_curry(fn) {
	const args = Array.prototype.slice(arguments, 1)
	return function () {
		const argus = Array.prototype.slice(arguments)
		return fn.apply(this, args.concat(argus))
	}
}
// 这个函数从包裹层次上来看，和sub_curry函数是一样的，都跟返回了原函数本身一样，和sub_curry的区别在于，sub是在原函数的基础上做了参数合并，
// 此函数是加了一个参数判断功能，如果参数过了直接执行，参数不够继续往下累积
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
