function LocalStorage($cookies) {

  let isLocalStorageSupportedFn = function () {
    let testKey = 'test', storage = window.localStorage;
    try {
      storage.setItem(testKey, '1');
      storage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  };
  const isLocalStorageSupported = isLocalStorageSupportedFn();
  return {
    get: function (key) {
      let data = isLocalStorageSupported ? localStorage.getItem(key) : $cookies.get(key);
      let parsed = null;
      try {
        parsed = JSON.parse(data);
      } catch (e) {
        console.log(e);
      }
      return parsed;
    },
    set: function (key, value) {
      isLocalStorageSupported ? localStorage.setItem(key, JSON.stringify(value)) : $cookies.put(key, JSON.stringify(value));
    },
    remove: function (key) {
      isLocalStorageSupported ? localStorage.removeItem(key) : $cookies.remove(key);
    }
  }

}

LocalStorage.$inject = ['$cookies'];

export default LocalStorage;
