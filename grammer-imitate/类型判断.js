const class2type = {}

"Boolean Number String Function Array Date RegExp Object Error Null Undefined Set Map".split(" ").map(function (item, index) {
	class2type["[object " + item + "]"] = item.toLocaleLowerCase()
})

function type(obj) {
	return typeof obj === 'object' || typeof obj === 'function' ?
		class2type[Object.prototype.toString.call(obj)] || "object" :
		typeof obj
}

/*
	在es6之前，js中的数据类型一共有6种：undefined null boolean number string object。其中前五种为基础数据类型，
	不可再分，而最后一种object是引用类型，是由基础数据类型构成的多值复合类型。Object.prototype.toString方法比较厉害，
	可以对引用类型的数据，判断出到底是哪种类型，即到底是对象、函数、数组、日期、正则、Set、Map等等。其实不光是引用类型，
	这个方法对基础数据类型，也是可以判断出来的
 */

