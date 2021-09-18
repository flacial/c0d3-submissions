class LRU_Cache {
    #cache;

    constructor(maxSize = 10) {
        this.maxSize = maxSize
        this.#cache = new Map()
    }


    addItem = (key, value) => {
        if (this.#cache.has(key)) return this

        if (this.#cache.size === this.maxSize) this.#cache.delete(this.tail)

        this.#cache.set(key, value)
        return this
    }

    // Used for jest testing.
    get keys() { return this.#cache.keys() }

    get tail() { return this.keys.next().value }

    hasItem = (key) => this.#cache.has(key)
    getItem = (key) => {
        const cachedItem = this.#cache.get(key)

        this.#cache.delete(key)
        this.#cache.set(key, cachedItem)
        return cachedItem
    }
}

export default LRU_Cache;