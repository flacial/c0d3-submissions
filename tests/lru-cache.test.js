import LRU_CACHE from '../utils/lru-cache.js';

const reduceMapKeys = (mapIterator, max = 10, i = 0, obj = {}) => {
  const currentElement = mapIterator.next().value;

  if (i === max || !currentElement) return obj;

  obj[currentElement] = i;

  return reduceMapKeys(mapIterator, max, i + 1, obj);
};

describe('LruCache', () => {
  it('should remove Potato, Rabbit, and Dog, and insert Break, Maybe, and Sure.', () => {
    const lru = new LRU_CACHE(10);

    lru.addItem('Potato', 123);
    lru.addItem('Rabbit', 981);
    lru.addItem('Dog', 101);
    lru.addItem('Cat', 242);
    lru.addItem('Monkey', 13123);

    lru.addItem('Johnny', 1213);
    lru.addItem('Mike', 18993);
    lru.addItem('Elisa', 999);
    lru.addItem('Fresh', 10111);
    lru.addItem('Banana', 100001);

    lru.addItem('Break', 5555);
    lru.addItem('Maybe', 7777);
    lru.addItem('Sure', 83535);

    expect(reduceMapKeys(lru.keys, 10)).toEqual({
      Cat: 0,
      Monkey: 1,
      Johnny: 2,
      Mike: 3,
      Elisa: 4,
      Fresh: 5,
      Banana: 6,
      Break: 7,
      Maybe: 8,
      Sure: 9,
    });
  });

  it('should insert 3 items', () => {
    const lru = new LRU_CACHE(10);

    lru.addItem('Break', 5555);
    lru.addItem('Maybe', 7777);
    lru.addItem('Sure', 83535);

    expect(reduceMapKeys(lru.keys, 10)).toEqual({
      Break: 0,
      Maybe: 1,
      Sure: 2,
    });
  });

  it('should remove 2 items and add 2', () => {
    const lru = new LRU_CACHE(3);

    lru.addItem('Break', 5555);
    lru.addItem('Maybe', 7777);
    lru.addItem('Sure', 83535);

    lru.addItem('Potato', 24234);
    lru.addItem('Fried Chicken', 1010);

    expect(reduceMapKeys(lru.keys, 3)).toEqual({
      Sure: 0,
      Potato: 1,
      'Fried Chicken': 2,
    });
  });

  it('should move Dog to middle and Monk to Head', () => {
    const lru = new LRU_CACHE(3);

    lru.addItem('Potato', 123);
    lru.addItem('Rabbit', 981);
    lru.addItem('Dog', 101);
    lru.addItem('Monk', 1011);
    lru.addItem('Fresh', 1011);
    lru.getItem('Dog');
    lru.getItem('Monk');

    expect(reduceMapKeys(lru.keys, 3)).toEqual({
      Fresh: 0,
      Dog: 1,
      Monk: 2,
    });
  });
});
