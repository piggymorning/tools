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

module.exports = {
	UF1, UF2, UF3
}