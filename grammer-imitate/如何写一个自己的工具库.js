/*
	写一个自己的工具库，首先需要思考的就是把这个库挂在哪里，一般来说可以挂在全局变量上，那么如何获取全局变量呢？
 */

(function () {
	// self是因为在浏览器环境下，self等同于window或者web worker中的全局变量，而webworker中是没有window对象的
	const root = (typeof self == 'object' && self.self == self && self) ||
	// global是node下的全局变量，node环境中没有window全局变量
		(typeof global == 'object' && global.self == global && global) ||
		// this是node的沙盒环境，即vm环境下的全局变量
		this ||
		// 微信小程序上述全局对象都没有
		{}
})()

// 最终版代码
(function() {

    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global) ||
        this || {};

    var ArrayProto = Array.prototype;

    var push = ArrayProto.push;

    var _ = function(obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };

    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    }

    _.VERSION = '0.1';

    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

    var isArrayLike = function(collection) {
        var length = collection.length;
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    _.each = function(obj, callback) {
        var length, i = 0;

        if (isArrayLike(obj)) {
            length = obj.length;
            for (; i < length; i++) {
                if (callback.call(obj[i], obj[i], i) === false) {
                    break;
                }
            }
        } else {
            for (i in obj) {
                if (callback.call(obj[i], obj[i], i) === false) {
                    break;
                }
            }
        }

        return obj;
    }

    _.isFunction = function(obj) {
        return typeof obj == 'function' || false;
    };

    _.functions = function(obj) {
        var names = [];
        for (var key in obj) {
            if (_.isFunction(obj[key])) names.push(key);
        }
        return names.sort();
    };

    /**
     * 在 _.mixin(_) 前添加自己定义的方法
     */
    _.reverse = function(string){
        return string.split('').reverse().join('');
    }

    _.mixin = function(obj) {
        _.each(_.functions(obj), function(name) {
            var func = _[name] = obj[name];
			/* 
				这里之所以不直接写_.prototype[name] = func，是因为对于每个func，都有两种执行方式，
				一种是直接通过_.func(params)调用，还有一种是通过原型方法调用，即_(params).func()。
				对于直接函数调用来说，参数是直接传给函数的，而对于原型方法来说，参数先放到了实例中，执行
				方法时是没有参数的，所以在给原型添加方法时，要对这些函数做一些处理，把存在实例中的wrapped
				作为参数给函数传过去
			*/
            _.prototype[name] = function() {
                var args = [this._wrapped];

                push.apply(args, arguments);

                return func.apply(_, args);
            };
        });
        return _;
    };

    _.mixin(_);

})()

// 下面写了个简版，把一些关键的细节用简易代码甚至是伪代码表达了出来
(function(){
	const root = global || window
	root._ = _
	function _(obj){
		if(this instanceof _) this._wrapped = obj
		else return new _(obj)
	}

	_.add = function(a,b){
		return a+b
	}

	_.chain = function(obj){
		const instance = new _(obj)
		instance.chain = true
		return instance
	}

	_.chainResult = function(instance,res){
		// 注意此处的_(res).chain()的写法和_.chain(res)的结果是一样的，这也是原型处理那块做的事，保证直接调用函数和通过原型方法调用函数结果一样
		return instance.chain?_(res).chain:res
	}
	for(funcName in _){
		const func = _[funcName]
		_.prototye[funcName] = function(){
			return func.apply(this,[this._wrapped,...[...arguments]])
		}
	}
	
})()
