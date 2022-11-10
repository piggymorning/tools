function findIndex1(array, predicate, context) {
	for (let i = 0; i < array.length; i++) {
		if (predicate.call(context, array[i], i, array)) return i
	}
	return -1
}

function findLastIndex1(array,predicate,context){
	const length = array.length
	for(let i =length -1;i>=0;i--){
		if(predicate.call(context,array[i],i,array)) return i
	}
	return -1
}

// 返回函数，同时支持正序查询和倒叙查询。巧妙之处在于通过参数1或者-1来决定产生正序和倒序函数，参数本身又可以用在循环的判定上
function createFindIndex(dir) {
	return function (array, predicate, context) {
		let length = array.length
		let index = dir > 0 ? 0 : length - 1
		for (; index >= 0 && index < length; index += dir) {
			if (predicate.call(context, array[index], index, array)) return index
		}
		return -1
	}
}

let findIndex = createFindIndex(1)
let findLastIndex = createFindIndex(-1)

// 二分法：返回index，保证obj插入到index的位置数组依然有序
function sortIndex(array, obj) {

	let low = 0, high = array.length
	let mid = Math.floor((low + high) / 2)
	while (low < high) {
		if (array[mid] < obj) low = mid + 1
		else high = mid
	}
	return high
}


// 二分法加上处理函数的传入
function cb(func, context) {
	if (context === void 0) return func
	return function () {
		func.apply(context, arguments)
	}
}

// 
function sortedIndex(array, obj, iteratee, context) {
	iteratee = cb(iteratee, context)
	let low = 0, high = array.length
	while (low < high) {
		let mid = Math.floor((low + high) / 2)
		if (iteratee(array[mid]) < iteratee(obj)) {
			low = mid
		}
		else high = mid
	}
	return high
}

// 第二版
function createIndexOfFinder(dir) {

    return function(array, item, idx){
        var length = array.length;
        var i = 0;

        if (typeof idx == "number") {
            if (dir > 0) {
				/* 
					如果idx大于0，那么i就等于idx，意味着从idx这个索引值开始找
					如果idx小于0，那么用length减去idx的绝对值，正好就应该从这个索引值开始找，但是如果idx绝对值
					太大，那么就和从头开始找一样了，所以小于0的话，i就等于0了
				*/
                i = idx >= 0 ? idx : Math.max(length + idx, 0);
            }
            else {
				/*
					由于是倒叙查找，是由length来控制的查找范围
					如果idx大于0，把length设置为length或者idx+1中的最小值，超了length的部分，没有意义
					如果idx小于0，那么就用length去抵消这个差值
					这个里面很重要的一点是倒叙查找部分，对idx有个加1的操作，之所以有这个操作，是因为倒叙查找
					由于length是大于数组最大的index，所以以length来限制查找范围的话，默认是从length-1索引
					开始的，也就是说不管idx传没传，都默认idx为-1，那加入idx真的传了-1，最终length还应该就是
					length，应该加1来抵消一下
				 */
                length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
            }
        }

        for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
            if (array[idx] === item) return idx;
        }
        return -1;
    }
}

var indexOf = createIndexOfFinder(1);
var lastIndexOf = createIndexOfFinder(-1);