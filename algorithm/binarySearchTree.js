// TODO: 对类进行重新封装，对对外暴露的方法和私有方法做区分
class Node {
	constructor(key, value) {
		this.key = key
		this.value = value
		this.left = null
		this.right = null
	}
}

class BinarySearchTree {
	// 此处有个问题，就是样例代码的node到底是存在类里的还是
	constructor(key, value) {
		this.node = this.newNode(key, value)
		this.count
	}
	// private
	#insert(node, key, value) {
		if (!node) {
			this.count++
			return new Node(key, value)
		}
		if (key === node.key) {
			node.value = value
		} else if (key < node.key) {
			node.left = this.#insert(node.left, key, value)
		} else if (key > node.key) {
			node.right = this.#insert(node.right, key, value)
		}
		return node
	}
	#contain(node, key) {
		if (!node) {
			return false
		}
		if (key === node.key) {
			return true
		} else if (key > node.key) {
			return this.#contain(node.right, key)
		} else {
			return this.#contain(node.left, key)
		}
	}

	#minimum(node,key){
		if(!node.left){
			return node
		}else{
			return this.#minimum(node.left)
		}
	}

	#search(node, key) {
		if (!node) {
			return null
		}
		if (key === node.key) {
			return node
		} else if (key > node.key) {
			return this.#search(node.right, key)
		} else if (key < node.key) {
			return this.#search(node.left, key)
		}
	}
	#preOrder(node) {
		if (node) {
			console.log('value is:', node.value)
			this.#preOrder(node.left)
			this.#preOrder(node.right)
		}
	}
	#inOrder(node) {
		if (node) {
			this.#inOrder(node.left)
			console.log('value is:', node.value)
			this.#inOrder(node.right)
		}
	}
	#postOrder(node) {
		if (node) {
			this.#postOrder(node.left)
			this.#postOrder(node.right)
			console.log('value is:', node.value)
		}
	}
	#levelOrder(node) {
		const queue = []
		queue.push(node)
		while (queue.length > 0) {
			const currentNode = queue.shift()
			console.log('value is:', currentNode.value)
			if (currentNode.left) {
				queue.push(currentNode.left)
			}
			if (currentNode.right) {
				queue.push(currentNode.right)
			}
		}

	}
	/* 
		此处处理的非常巧妙，针对于在递归过程中，处理这种类似于链表结构的节点删减问题。删除本层节点，正常思路是需要
		通过上一层节点来进行删减，但是递归的写法当判断出当前节点是目标节点时，已经拿不到上层节点了。此处的处理方法
		就是递归时，每一层节点都等于下次递归函数处理的结果，然后递归函数无论走哪个分支判断，都会返回当前节点的值。
		这样的话，就可以通过控制当前递归环节的返回值，来影响上个节点的属性值。只不过写法上会让人觉得有些冗余，因为
		每个递归环节都返回一个值，但实际上这个值只需要改变一次
	 */
	#removeMin(node) {
		if (!node.left) {
			return node.right
		} else {
			node.left = this.#removeMin(node.left)
		}
		return node
	}
	#removeMax(node) {
		if (!node.right) {
			return node.left
		}
		node.right = this.#removeMax(node.right)
		return node
	}
	#removeNode(node, key) {
		if(!node){
			return null
		}
		if (key > node.key) {
			node.right = this.#removeNode(node.right, key)
		} else if (key < node.key) {
			node.left = this.#removeNode(node.left, key)
		} else if (key === node.key) {
			if (node.left && node.right) {
				const successor =this.copyNode(this.#minimum(node.right)) 
				const rightBranch = this.removeMin(node.right)
				successor.right = rightBranch
				successor.left = node.left
				return successor
			} else if (node.left) {
				return node.left
			} else if (node.right) {
				return node.right
			}
		}
		return node
	}
	newNode(key, value) {
		return { key, value, left: null, right: null }
	}
	copyNode(node){
		return {
			key:node.key,
			value:node.value,
			left:node.left,
			right:node.right,
		}
	}
	// public
	insert(key, value) {
		this.node = this.#insert(this.node, key, value)
	}
	contain(key) {
		return this.#contain(this.node, key)
	}
	search(key) {
		return this.#search(key)
	}
	preOrder() {
		if (this.node) {
			this.#preOrder(this.root)
		}
	}
	// 中序遍历可用于排序
	inOrder() {
		if (this.node) {
			this.#inOrder(this.node)
		}
	}
	// 后续遍历可用于空间释放
	postOrder() {
		if (this.node) {
			this.#postOrder(this.node)
		}
	}
	levelOrder() {
		if (this.node) {
			this.#levelOrder(this.node)
		}
	}
	removeMax() {
		if (this.node) {
			this.#removeMax(this.node)
		}
	}
	removeMin() {
		if (this.node) {
			this.node = this.#removeMin(this.node)
		}
	}
	removeNode(key) {
		if (node) {
			this.node = this.removeNode(this.node, key)
		}
	}
	size() {
		return this.count
	}
	count() {
		return this.count === 0
	}
}