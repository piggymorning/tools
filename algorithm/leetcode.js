const { exchange } = require('./sortHelper')
function quickSortNoN(list, n) {
	n = n-1
	let res = {a:0}
	// 找到那个p点
	function __partition(list, l, r) {
		const index = l + Math.floor(Math.random() * (r - l))
		exchange(list, l, index)
		const target = list[l]
		// 保证[l+1,j]<target [j+1,i)=target [k,r]>target 
		let j = l, i = l+1, k = r+1
		while (i < k) {
			if (list[i] > target) {
				exchange(list, i, k - 1)
				k--
			} else if (list[i] < target) {
				exchange(list, i, j + 1)
				j++
				i++
			} else {
				i++
			}
		}
		exchange(list, l, j)
		j--
		return {
			min: j,
			max: k
		}
	}
	// 判断p点与k的索引值大小，继续迭代
	function __recurse(list, n, l, r) {
		if(l>=r){
			res.a = l
			return
		}
		const obj = __partition(list, l, r)
		if (n > obj.min && n < obj.max) {
			res.a = obj.min + 1
			return
		} else if (n <= obj.min) {
			__recurse(list, n, l, obj.min)
		} else if (n >= obj.max) {
			__recurse(list, n, obj.max, r)
		} 
	}
	__recurse(list, n, 0, list.length - 1)
	return list[res.a]
}

console.log('result-----',quickSortNoN([11,32,5,7,3,1,0,22,55,9,10],5)) 