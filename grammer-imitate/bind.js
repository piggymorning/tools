// 此版为初版，主要就是完成绑定this、传递参数以及返回一个函数的功能
Function.prototype.bind2 = function (context) {
	const self = this
	const args = Array.prototype.slice.call(arguments, 1)
	return function () {
		const bindArgs = Array.prototype.slice.call(arguments)
		return self.apply(context, args.concat(bindArgs))
	}
}

Function.prototype.bind3 = function (context) {
	if (typeof this !== 'function') {
		throw new Error('需要接收一个函数类型')
	}
	const self = this
	const args = Array.prototype.slice.call(arguments, 1)
	function fNop() { }
	fNop.prototype = self.prototype
	function Fbound() {
		const bindArgs = Array.prototype.slice.call(arguments)
		return self.apply(this instanceof fNop ? this : context, args.concat(bindArgs))
	}
	Fbound.prototype = new fNop()
	return Fbound
}

/*
	最终版里有几个关键点：
	Line21：这是最关键的，对于原函数使用bind函数以后，最终使用函数时，是正常使用还是当做构造函数来使用，最根本的区别
	就在于this的指向。如果是正常使用，则this应该指向context，如果是当做构造函数来使用，那么this就应该是指向Fbound
	的this。这里可能会觉得有点奇怪，this不应该是指向原函数的this吗（即self），并不是的，new的作用相当于是创建了一个
	新对象，然后把构造函数的this指向新对象，并且执行一遍构造函数。那么由于最终返回的函数是Fboud，如果Fboud最终被当做
	构造函数执行了，只有它内部的this才是指向实例对象，所以原函数apply的时候，context要传入this
	Line23：使用new方法获取实例，有两个关键点，一个是this，一个是原型继承。对于bind方法，最终会返回一个新的函数，可
	是对于使用者来说，并不会认为bind返回的是个新函数，我们会当成还是原函数，只不过是原函数的this被改变了。那么把bind
	后的函数通过new关键字来执行时，我们需要的效果是和直接对原函数执行new关键字是一样的，因此我们才需要把执行new关键字
	时，所需要的原函数的东西拿出来，在新函数中变相地使用一下。this已经说明白了，对于原型继承，比较简单，就是把构造函数
	的prototype绑定一下，这里面为了防止通过实例直接更改原函数的prototype，在中间又隔了一层
 */