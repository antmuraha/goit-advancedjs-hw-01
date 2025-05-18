class FormStorage {
  #storage;
  #storageKey;

  /**
   *
   * @param {string | null} storageType
   * @param {string} storageKey
   */
  constructor(storageType, storageKey) {
    this.#storage = storageType === 'local' ? localStorage : sessionStorage;
    this.#storageKey = storageKey;
  }

  /**
   *
   * @param {HTMLFormElement} form
   */
  save(form) {
    const formData = new FormData(form);
    const formDataObject = Object.fromEntries(formData.entries());
    const data = {};
    for (const [key, value] of Object.entries(formDataObject)) {
      if (typeof value === 'string') {
        data[key] = value.trim();
      } else {
        console.warn(`Value for ${key} is not a string:`, value);
      }
    }
    this.#storage.setItem(this.#storageKey, JSON.stringify(data));
  }

  get() {
    const value = this.#storage.getItem(this.#storageKey);
    if (!value) {
      return new FormData();
    }

    try {
      const data = JSON.parse(value);
      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
      }
      return formData;
    } catch (error) {
      console.error('Error parsing JSON', error);
    }

    return new FormData();
  }

  clean() {
    this.#storage.removeItem(this.#storageKey);
  }
}

export default FormStorage;
