// Node ≥ 22 memiliki `localStorage` global eksperimental yang kosong tanpa --localstorage-file,
// dan menutupi localStorage milik jsdom. Untuk tes, sediakan penyimpanan sederhana di memori.
class PenyimpananMemori {
  #data = new Map();
  get length() {
    return this.#data.size;
  }
  key(i) {
    return [...this.#data.keys()][i] ?? null;
  }
  getItem(k) {
    return this.#data.has(String(k)) ? this.#data.get(String(k)) : null;
  }
  setItem(k, v) {
    this.#data.set(String(k), String(v));
  }
  removeItem(k) {
    this.#data.delete(String(k));
  }
  clear() {
    this.#data.clear();
  }
}

let rusak = false;
try {
  rusak = typeof globalThis.localStorage?.clear !== 'function';
} catch {
  rusak = true;
}
if (rusak) {
  Object.defineProperty(globalThis, 'localStorage', { value: new PenyimpananMemori(), configurable: true, writable: true });
}
