/* 
	对Math.max的灵活运用:max方法是Math的静态方法，使用的时候应该直接调用，然后支持传入多个参数，那我们如果需要获得一个
	数组中的最大值，则需要把数组给max方法传进去，可以max方法不接收数组形式的参数，这个时候就可以考虑用apply方法做一下
	衔接，也就是说apply方法的用处，不仅是可以改变函数执行时候的this值，还可以接收一个数组形式的参数，并用普通多参数的
	形式给函数传递过去
*/

function getMax(list){
	return Math.max.apply(null,list)
}
