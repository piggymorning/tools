

// 1.未捕获的错误处理
// 2.考虑一下如何实现promise中提供的其他方法

class Promiser {
	state = 'pending'
	value = null
	subscribeInstance = []
	constructor(func) {
		func(this.resolve.bind(this), this.reject.bind(this))
	}

	then(successHandle, errorHandle) {
		const { state, value, error, subscribeInstance } = this
		return new Promiser(function (resolve, reject) {
			// resolve是异步执行的，此时resolve还未执行
			if (state === 'pending') {
				this.successHandle = successHandle
				this.errorHandle = errorHandle
				subscribeInstance.push(this)
			} else if (state === 'fullfilled') {
				// resolve同步执行，此时resolve已经执行完毕，这个successHandle，其实就相当于是现在这个promise生成时接收的函数
				const handleResult = successHandle(value)
				// 如果是个promise实例，那么当前实例就不用要了，直接返回这个实例，后面的交给它处理就好了
				if (handleResult instanceof Promiser) return handleResult
				else resolve(handleResult)
			} else {
				if (errorHandle) {
					const handleResult = errorHandle(error)
					if (handleResult instanceof Promiser) return handleResult
					else (resolve(handleResult))
				} else {
					reject(error)
				}
			}
		})
	}

	resolve(e) {
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
	}

	reject(e) {
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

	catch(catchHandle) {
		this.then(null, catchHandle)
	}
}
/* 
	基础功能实现关键点：
	1、首先，then方法后面可以无限地接then方法，那么then方法返回的一定是个promiser实例
	2、要知道虽然在使用的效果是then方面里面的函数，是等上一个promise完成之后才能执行，但实际上跑
	代码的时候，是一连气把多个then方法全部执行玩的，所以这些方法里的函数，需要提前储存好
	3、原promise和then方法返回的promise，是两个promise实例，但是后者的执行需要前者执行完resolve以后，
	才能进行，因此两个promise看似是两个独立对象，但实际上有关联。我起初的想法是在这里改变上一个promise的
	resolve方法，这样上一个promise执行resolve的时候，就连带着本次的resolve一块执行了，但是会有一个问题，
	如果是直接改resolve方法，那改的是resolve字段对函数的引用。如果then方法后面又跟了一个then方法，那么
	在第二个then方法执行的时候，就会给第二个resolve字段更换新的函数，但是第一个resolve改变后的函数是不会
	再变了，那相当于第二个then方法就接不上了。这个问题其实有个简单的解法，就是不直接去改变resolve方法本身，
	而是在resolve方法内部添加处理，在实例上添加新的对象状态用来储存每一个then方法需要添加的东西，然后在resolve
	中去引用这个对象，之所以用对象是因为对象本身是一个稳定的引用，需要改东西的话，就去改对象里面的属性，大家使用
	的时候是通过这个固定的对象去使用的，后面因为某个地方对象中的某个方法或属性改变了，其他地方只要是通过对象引用的
	那都会拿到最新的值。这其实是个常识，但最开始确实没相当
	4、最终then方法的解决方案，就是每执行一次then方法，就把新的promise实例本身直接存到上一个promise中，这样
	上个promise resolve的时候，就可以直接从自身的状态中调用到跟自身续接的promise，并执行其中的resolve方法
	5、解决了then的问题，接下来就是resolve。resolve这块有个关键问题，如果then方法返回的还是一个promise对象，该如何处理？最直观
	的想法可能是在then方法处加个判断，先执行下那个函数看看，如果是普通值就正常处理，不是普通值就返回这个promise实例，
	但这样是不行的，因为then方法接收的函数，这个时候不能执行，执行的话也没有拿到上个promise的返回值，所以还是得
	从resolve方法下手。resolve主要做两件事，第一件事是改变当前promise实例的值和状态，第二件事是执行后面绑定的处理。  
	最终的解决方案挺巧妙的，就是从promise实例的角度来看，对象中有个状态专门是存储接下来需要调用的实例的，就是then
	方法干的事，这个状态是个数组，那如果resolve的时候，发现then方法接收的函数返回的是个promise，那说明当前实例
	上绑定的后面待处理的实例们还不该执行，应该在then方法函数的promise种resolve执行以后再执行，那就把当前实例绑定的
	待执行实例们直接添加到then方法函数返回的实例对应的待执行状态中就好了
	6、实现promise构造函数这个过程，我觉得有了一些开发思想上的变化，就是对于复杂的功能，很多时候用类和面向对象的方法
	真的会比较好处理。一个对象本身有哪些属性和方法，这些属性和方法都可以干什么，然后实例本身也可以作为参数直接传递，通过
	修改实例的属性，可以影响实例在执行常规操作时的额外功能处理                 
	*/
/* 
	reject处理环节与加同步处理关键点：第一版写出来的其实第一个环节是异步的，没有考虑同步的情况，所以promise中的state都没有用到
	1、reject的处理其实和resolve非常类似，主要有两个区别，一是reject如果处理完毕了，那本次其实就算是resolve了，接下来的实例还是需要
	接着执行resolve，而不是继续reject。另外就是对于reject的处理函数，有不存在的可能，那就相当于本次是reject的了，下面的实例还是需要处理reject环节
	2、第一次的写法里，其实只考虑了第一次promise是异步处理的情况，then方法只是把successHandle和errorHandle存了起来，然后把
	自己暂时存储在了上个promise的暂处理状态中。可是假如第一次promise是同步的情况，也就是resolve执行的时候，then方法还没执行呢，
	那then方面内部的东西，就需要自己来执行了，因此then方法里面需要添加逻辑处理。在写这段的时候，脑子里产生了两个灵感点，第一个
	是应该提前考虑一下代码的执行顺序，在第一个promise实例开始的时候，resolve的执行有两种情况，第一种情况是同步执行，那代码的顺序
	就是resolve先执行，之后then再执行，then执行的时候，自身也是个promise实例，那是resolve还是reject，就需要在then环节自己就
	处理了，而不是暂存到第一个promise实例中的subscribes中，因此之前第一版代码是不行的。第二种情况是resolve异步执行，比如放了个
	定时器，那么第一个promise执行完后，到了then方法这里，生成的新promise实例是否resolve或reject，就不能由自身决定了，这时就需要
	暂存在第一个promise的subsribs中。第二个灵感，就是在then方法里写了不少的逻辑判断，期初感觉思维有点乱，后来忽然发现，不需要考虑
	太多，最关键的是知道这个then方法，最终返回的是一个promise对象，多个then之间，都是较为独立的promise对象，中间的这些逻辑处理，
	无非就是改变相关的对象中的状态而已，因此把握住关键的return就可以了，剩下的都是对象内的小动作。此外，在写对象中的方法的时候，
	如果方法和多个对象有关系，那么需要考虑代码对多个对象的影响，就考虑当前的对象就可以了，即当前是哪个对象，然后这个方法会对对象本身产生
	什么影响，改变了哪些状态，最后返回的是哪个对象，就足够了

*/

/* 
	将构造函数形式的写法改为类的写法：
	1、类的写法确实相当于提供了语法糖，和构造函数的写法区别不大。关键点在于类中对属性和方法的组织规范，记住了就行。首先是实例的属性
	和方法，类中有个constructor函数，这个函数就和其名字一样，相当于就是原来的构造函数，这里面有this定义的属性和方法，就是实例的。
	construtor外面直接写上去的方法，就是原型方法。可以看到，这种规范其实写起来是最舒服的，之前写构造函数的时候，写的最多的就是实例
	的属性和原型的方法，现在类的规范，在写实例属性和原型方法时都很方便。在看文档的时候，还学到了一些其他的概念，对于类中的方法或者
	属性，有公有、私有、静态、动态之分。所谓动态属性或方法，就是最常用的，说它是动态，可能是因为所有实例都可以使用。与之相对的是静态
	方法，静态方法就是不同在实例上用，是固定绑定在类上的，只能通过类直接调用。公有、私有的话就是内外之分了，私有只能在类的内部调用，
	类的外部可以调用的方法或者属性就是公有
 */


const p1 = new Promiser(function (resolve, reject) {
	console.log('start....',)
	setTimeout(function () {
		resolve('setTimeOut')
	}, 3000)
})

const p2 = p1.then(function (e) {
	console.log('p2', e)
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

const p5 = p2.then(function (e) {
	console.log('this is p5:', e)
})




