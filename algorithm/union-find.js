class UF1 {
	constructor(n) {
		this.id = []
		this.count = n
		for (let i = 0; i < n; i++) {
			this.id[i] = i
		}
	}

	find(p) {
		if (p >= 0 && p < this.count) {
			return this.id[p]
		}
	}

	isConnected(p, q) {
		return this.find(p) === this.find(q)
	}

	unionElements(p, q) {
		const pId = this.find(p)
		const qId = this.find(q)
		if (pId === qId) {
			return
		}
		for (let i = 0; i < this.count; i++) {
			if (this.id[i] === pId) {
				this.id[i] = qId
			}
		}
	}
}
/* 
快速并查集，在原版基础上，做了优化。初版每个元素的值，对应索引标识，集合通过索引标识来确认。这版元素的值对应父节点的索引，
需要并集的时候，两个集合的根节点关联上就可以了
 */
class UF2 {
	constructor(n) {
		this.id = []
		this.count = n
		for (let i = 0; i < n; i++) {
			this.id[i] = i
		}
	}

	find(p) {
		if (p >= 0 && p < this.count) {
			while (p !== this.id[p]) {
				p = this.id[p]
			}
			return p
		}
	}

	isConnected(p, q) {
		return this.find(p) === this.find(q)
	}

	unionElements(p, q) {
		const pRoot = this.find(p)
		const qRoot = this.find(q)
		if (pRoot === qRoot) {
			return
		}
		this.id[pRoot] = qRoot
	}
}
// 在快速并查集的基础上，做了size优化，防止某个集合链条太长，find的时候过于费力，速度提升很大
class UF3 {
	constructor(n) {
		this.id = []
		this.count = n
		this.size = []
		for (let i = 0; i < n; i++) {
			this.id[i] = i
			this.size[i] = 1
		}
	}

	find(p) {
		if (p >= 0 && p < this.count) {
			while (p !== this.id[p]) {
				p = this.id[p]
			}
			return p
		}
	}

	isConnected(p, q) {
		return this.find(p) === this.find(q)
	}

	unionElements(p, q) {
		const pRoot = this.find(p)
		const qRoot = this.find(q)
		if (pRoot === qRoot) {
			return
		}
		if (this.size[pRoot] < this.size[qRoot]) {
			this.id[pRoot] = qRoot
			this.size[qRoot] += this.size[pRoot]
		} else {
			this.id[qRoot] = pRoot
			this.size[pRoot] += this.size[qRoot]
		}
	}
}

// 终极版，UF3版用size防止链条长度过大，size为根节点下面挂着的节点数。这版使用的是rank，为根节点对应的层级数，对长度的限制更加严格了
// 添加了路径压缩
class UF4 {
	constructor(n) {
		this.id = []
		this.count = n
		this.rank = []
		for (let i = 0; i < n; i++) {
			this.id[i] = i
			this.rank[i] = 1
		}
	}

	find(p) {
		// if (p >= 0 && p < this.count) {
		// 	while (p !== this.id[p]) {
		// 		p = this.id[p]
		// 	}
		// 	return p
		// }

		/* --------------------------路径压缩版本--------------------------------------*/
		if (p >= 0 && p < this.count) {
			while (p !== this.id[p]) {
				this.id[p] = this.id[this.id[p]]
				p = this.id[p]
			}
		}

		/* --------------------------极限路径压缩版本，压缩后每个子节点和根节点都紧挨着--------------------------------------*/
		if (p >= 0 && p < this.count) {
			if (p !== this.id[p]) {
				this.id[p] = this.find(this.id[p])
			} else {
				return this.id[p]
			}
		}

	}

	isConnected(p, q) {
		return this.find(p) === this.find(q)
	}

	unionElements(p, q) {
		const pRoot = this.find(p)
		const qRoot = this.find(q)
		if (pRoot === qRoot) {
			return
		}
		if (this.rank[pRoot] < this.rank[qRoot]) {
			this.id[pRoot] = qRoot
		} else if (this.rank[pRoot] > this.rank[qRoot]) {
			this.id[qRoot] = pRoot
		} else {
			this.id[qRoot] = pRoot
			this.rank[pRoot] += 1
		}
	}
}
module.exports = {
	UF1, UF2, UF3, UF4
}