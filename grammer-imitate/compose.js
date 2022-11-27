function compose() {
	const args = [].slice.apply(arguments)
	let length = args.length - 1
	return function () {
		let result = args[length].apply(this, [].slice.apply(arguments))
		while (--length) result = args[length].apply(this, result)
		return result
	}
}

/*
	这个compose函数以函数作为参数，然后可以按照函数参数从左到右的顺序，依次执行，上个函数的执行结果，是下个函数的执行
	参数。这个compose函数和curry函数一样，单独地放在这里，体会不到它们的明显优势，但是如果把两个函数合起来使用，厉害
	之处就出来了。
	这里面涉及到一个编程的思想，叫pointfree，本质就是使用一些通用的函数，组合出各种复杂运算，上层运算不直接操作数据，
	而是通过底层函数去处理，即不使用所要处理的值，只合成运算过程。按照这个思想，比如对一个数据要进行一连串的复杂处理，
	那么就可以把这些复杂处理拆分成一个个单一的处理函数，然后用compose一次性的组织起来，在compose执行的那一行代码，就
	可以很明显地看出来，数据是怎么处理的，怎么流向的，相当于把函数执行本身语义化了。curry也是一样，它把多参数函数转为
	单参数函数可以执行多次，这样每次执行，本身就都是一个语义化的过程，而且通过参数的顺序和执行的程度，方便控制函数本身
	的状态。总之两者结合起来使用，一个复杂的计算过程，可以被转化为简单的一行代码，而且这一行代码的可读性非常强，总体简洁明了
 */