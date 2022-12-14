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
	const { state, value, subscribeInstance } = this
	return new Promiser(function (resolve, reject) {
		if (state === 'pending') {
			this.successHandle = successHandle
			this.errorHandle = errorHandle
			subscribeInstance.push(this)
		} else if (state === 'fullfilled') {
			const handleResult = successHandle(value)
			if (handleResult instanceof Promiser) return handleResult
			else resolve(handleResult)
		} else {
			if (errorHandle) {
				const handleResult = errorHandle(value)
				if (handleResult instanceof Promiser) return handleResult
				else (resolve(handleResult))
			} else {
				reject(value)
			}
		}
	})
}

Promiser.prototype.resolve = function (e) {
	// 改变当前promise实例的状态和储存值
	this.state = 'fullfilled'
	this.value = e
	// this.subscribeInstance.length如果大于0，说明本次resolve是异步执行的，需要处理后面then方法提前在subscribeInstance中存好的待处理的实例
	if (this.subscribeInstance.length > 0) {
		for (instance of this.subscribeInstance) {
			// 这块对于then方法返回的实例来说，是在执行本体的方法，就像是普通的new Promise执行的时候，本体中的代码
			const thenResult = instance.successHandle(e)
			if (thenResult instanceof Promiser) {
				thenResult.subscribeInstance = [...thenResult.subscribeInstance, ...instance.subscribeInstance]
			} else {
				// 这块对于then方法返回的实例来说，是在执行本体后面绑定的方法
				instance.resolve(thenResult)
			}
		}
	}
	// 如果this.subscribeInstance.length如果小于0，说明后面要么是没跟then方法，要么就是resolve是同步执行的，都无需处理。如果是同步执行的，那后面的交给resolve去处理
}
Promiser.prototype.reject = function (e) {
	this.state = 'failed'
	this.error = e
	// 处理后续的相关的promise
	if (this.subscribeInstance.length > 0) {
		for (instance of this.subscribeInstance) {
			// 这块对于then方法返回的实例来说，是在执行本体的方法，就像是普通的new Promise执行的时候，本体中的代码
			if (instance.errorHandle) {
				// 这里的判断就是看看then方法返回的promise实例中，有没有负责错误处理的函数，有的话就处理，处理了以后
				// 靠then连起来的“链条”就又恢复正常了，所以接着往下执行,没有的话，就直接执行reject，相当于跨过当前实例
				// 的处理环节（因为没有给处理环节），接着把错误传递给后面的实例，看看有没有能够处理的
				const thenResult = instance.errorHandle(e)
				if (thenResult instanceof Promiser) {
					thenResult.subscribeInstance = [...thenResult.subscribeInstance, ...instance.subscribeInstance]
				} else {
					// 这块对于then方法返回的实例来说，是在执行本体后面绑定的方法
					instance.resolve(thenResult)
				}
			} else {
				instance.reject(e)
			}

		}
	}
}










const p = new Promiser(function(resolve,reject){
	console.log('1111111111111111111111',)
	setTimeout(function(){
		reject('error')
	},3000)
}).then(function(){
	console.log('p1')
	return 3
},function(){
	return new Promiser(function(resolve,reject){
		setTimeout(function(){
			console.log('reject--handled',)
			resolve('yes')
		},2000)
	})
}).then(function(e){console.log('haha',e)})






