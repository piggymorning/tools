

// 1.实现then方法中存在promise的情况
// 2.实现错误处理，比如catch方法
function Promiser(func) {
	// 当前状态
	this.state = 'pending'
	// 当前值
	this.value = null
	// 当前错误
	this.error = null
	// 已订阅此promiser实例的其他实例
	this.subscribeInstance = []
	func.call(this, this.resolve.bind(this), this.reject.bind(this))
}

Promiser.prototype.then = function (successHandle, errorHandle) {
	const that = this
	return new Promiser(function () {
		this.successHandle = successHandle
		this.errorHandle = errorHandle
		that.subscribeInstance.push(this)
	})
}

Promiser.prototype.resolve = function (e) {
	this.state = 'fullfilled'
	this.value = e
	if (this.subscribeInstance.length > 0) {
		for (instance of this.subscribeInstance) {
			instance.resolve(instance.successHandle(e))
		}
	}
}
Promiser.prototype.reject = function (e) {
	this.state = 'failed'
	this.error = e
	if (this.subscribeInstance.length > 0) {
		for (instance of this.subscribeInstance.entries()) {
			instance.reject(instance.errorHandle(e))
		}
	}
}


const p1 = new Promiser(function (resolve, reject) {
	console.log('start....',)
	setTimeout(function () {
		resolve('setTimeOut')
	}, 3000)
})

const p2 = p1.then(function (e) {
	console.log('p2:', e)
	return 'from p2'
})
const p3 = p2.then(function (e) {
	console.log('p3', e)
	return 'from p3'
})

const p4 = p1.then(function (e) {
	console.log('p4', e)
})




