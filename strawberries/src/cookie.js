import Cookie from 'js-cookie';

const s = {
  getItem: (key, callback) => {
    const r = Cookie.get(key);
    callback(undefined, r);
  },
  setItem: (key, value, callback) => {
    Cookie.set(key, value);
    callback();
  },
  removeItem: (key, callback) => {
    Cookie.remove(key);
    callback();
  },
  getAllKeys: callback => {
    const r = Cookie.get();
    callback(undefined, Object.keys(r));
  },
};
export default s;
