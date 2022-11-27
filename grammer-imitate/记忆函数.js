function memorize(func, hasher) {
	const memorize = function (key) {
		const cache = memorize.cache
		const address = "" + (hasher ? hasher.apply(this, arguments) : key)
		if (cache[address]) return cache[address]
		else return cache[address] = func.apply(this, arguments)
	}
	memorize.cache = {}
	return memorize
} 

/* 
	从代码实现上可以看出来，如果是多参数的情况，一定得传一个hasher，让参数能够变为唯一标识
*/

function hasherDemo(){
    var args = Array.prototype.slice.call(arguments)
    return JSON.stringify(args)
}