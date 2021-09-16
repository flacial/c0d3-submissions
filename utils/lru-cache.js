class LRU_CACHE {
    #cache;
    #head;

    constructor(maxSize = 10) {
        this.maxSize = maxSize
        this.#cache = new Map()
        this.#head = null
    }


    addItem = (key, value) => {
        if (this.#cache.has(key)) return undefined

        if (this.size === this.maxSize) {
            this.#cache.delete(this.tail)

            this.#head = { key, value, prev: { ...this.#head }, next: null }
            this.#cache.set(key, this.#head)

            return this.keys
        }

        const headMainProps = () => ({ key: this.#head.key, value: this.#head.value })

        if (this.size === 0) {
            this.#head = { key, value, prev: { key, value }, next: { key, value } }
        } else {
            this.#head = { key, value, prev: { ...headMainProps() }, next: null }
        }

        this.#cache.set(this.#head.prev.key, { ...this.#head.prev, next: headMainProps() })
        this.#cache.set(key, this.#head)

        return this.keys
    }

    get size() {
        return this.#cache.size
    }

    get keys() {
        return this.#cache.keys()
    }

    get tail() {
        return this.keys.next().value
    }

    hasItem = (item) => this.#cache.has(item)
    getItem = (item) => {
        const cachedItem = this.#cache.get(item)

        this.#cache.delete(item)
        this.#cache.set(item, cachedItem)
        return cachedItem
    }
}

export default LRU_CACHE;