const arr = [2,5,6,11,23,31]
function max1(){
	function getMax(a,b){
		return Math.max(a,b)
	}
	return arr.reduce(getMax)
}

function max2(list){
	let result = list[0]
	for(let i=1;i<list.length;i++){
		result = Math.max(result,list[i])
	}
	return result
}
// 后面这两种方法真是方便法门，对于那种想给一个参数不固定的函数，传入数组参数的时候。max4是es6提供的方法，之前竟然没想到过能这样去用
function max3(list){
	/* 
		此处对apply的使用，可以和Array.prototype.slice(arguments)做一下比较，能够提出来的问题就是，对函数使用
		apply或者call的时候，什么时候第一个参数需要传this，什么时候不用考虑，直接传个null，这里面的关键就在于这个函数
		本身的类型。如果是个普通函数，接受参数的那种，那么使用的时候第一参数就不需要传this，因为函数内的处理程序就不涉及到
		this，而是直接对传入的参数进行计算。如果函数是属于原型对象中的某些方法，是对this进行操作的，那么这个时候就需要传
		入this，因为方法的内部可能是对this进行直接的计算操作和赋值的。两种函数本质上都是对对象进行操作，关键区别就在于一个是
		通过this来操作对象内部，另一个是直接操作传入的参数
	*/
	return Math.max.apply(null,list)
}

function max4(list){
	return Math.max(...list)
}





