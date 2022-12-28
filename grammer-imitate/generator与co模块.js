function* gen(){
	const r1 = yield thunk1()
	const r2 = yield thunk2(r1)
	const r3 = yield thunk3()
}
// 回调函数版co
function runForCallback(gen) {
	const g = gen()
	/*
		这里的co模块关键就是这个next函数，也就是回调函数，但是这里理解上会有一个点，对于程序本身来说，这个
		next函数本来是不存在的，这里加上它，有两个原因，一是第一个yield执行完毕后，第二个yield或者thunk
		还未执行，而要执行第二个yield，需要再次调用next方法，并且把上一个yield返回的值通过next方法传递
		，所以在第一个yield执行完毕，这个时候就需要拿一个假的回调函数，把第一个yield返回的thunk函数中的值
		取出来了，之所以这一个next函数就能取遍所有的thunk函数的值，是因为thunk函数对回调函数的使用都遵循
		同一套规范，即第一个参数是err，第二个是数据。
		具体拿上面的gen函数举例，代码中的thunk2才应该是thunk1的回调函数，但是从next的代码实现中可以看到
		两者并没有直接衔接上，而是中间用了next先。这就是程序处理上的灵活性，原本的前后函数衔接关系并不重要，
		关键在于它们之间接口是怎样的，只要能够满足接口对接，那中间完全可以插入别的函数，方便接收上游数据，
		中间加处理，然后再给到下游真正的函数。这个思路在后面的thunkToPromise方法中也有体现到
	 */
	function next(data) {
		const result = g.next(data)
		if (result.done) return
		result.value(next)
	}
	next()
}

function runForPromise(gen){
	const g = gen()

	function next(data){
		const result = g.next(data)
		result.value.then(function(value){
			next(value)
		})
	}

	next()
}






// co模块最终实现版
function run(gen) {
	var gen = gen();
	return new Promise(function (resolve, reject) {
		function next(data) {
			try {
				var result = gen.next(data);
			} catch (e) {
				return reject(e);
			}
			if (result.done) {
				return resolve(result.value)
			};
			var value = toPromise(result.value);
			value.then(function (data) {
				next(data);
			}, function (e) {
				reject(e)
			});
		}
		next()
	})

}

function isPromise(obj) {
	return 'function' == typeof obj.then;
}

function toPromise(obj) {
	if (isPromise(obj)) return obj;
	if ('function' == typeof obj) return thunkToPromise(obj);
	return obj;
}

function thunkToPromise(fn) {
	return new Promise(function (resolve, reject) {
		/*
			这块也是体现了上面提到的思想，我希望对原函数fn做一些转化处理。写代码的思路就是，首先要知道转化
			后的返回数据是什么结构，这里是promise对象，那就return出去一个promise。之后我要能够拿到原函
			数内部的数据，那我就按照原函数的接口，把一个回调函数塞进去，通过原函数与回调函数定义的接口，拿
			到我们需要的数据 
		*/
		fn(function (err, res) {
			if (err) return reject(err);
			resolve(res);
		});
	});
}

module.exports = run;