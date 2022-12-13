

// 1.实现错误处理，比如catch方法
// 2.需要考虑已经生成的promise，在其他的后执行的代码中，使用的情况
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
			const thenResult = instance.successHandle(e)
			if (thenResult instanceof Promiser) {
				thenResult.subscribeInstance = [...thenResult.subscribeInstance,...instance.subscribeInstance]
			} else {
				instance.resolve(thenResult)
			}
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
	console.log('p2',e)
	return new Promiser(function (resolve, reject) {
		setTimeout(function () {
			resolve('from p2')
		}, 3000)
	})
	
})
const p3 = p2.then(function (e) {
	console.log('p3', e)
	return new Promiser(function (resolve, reject) {
		setTimeout(function () {
			resolve('from p3')
		}, 3000)
	})
})

const p4 = p3.then(function (e) {
	console.log('p4', e)
})

const p5 = p2.then(function(e){
	console.log('this is p5:',e)
})




