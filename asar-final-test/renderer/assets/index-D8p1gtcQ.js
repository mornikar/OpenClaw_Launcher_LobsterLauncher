/**
* @vue/shared v3.5.32
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function makeMap(str) {
  const map = /* @__PURE__ */ Object.create(null);
  for (const key of str.split(",")) map[key] = 1;
  return (val) => val in map;
}
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isDate = (val) => toTypeString(val) === "[object Date]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-\w/g;
const camelize = cacheStringFunction(
  (str) => {
    return str.replace(camelizeRE, (c) => c.slice(1).toUpperCase());
  }
);
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction(
  (str) => {
    const s = str ? `on${capitalize(str)}` : ``;
    return s;
  }
);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, ...arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](...arg);
  }
};
const def = (obj, key, value, writable = false) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    writable,
    value
  });
};
const looseToNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value) || isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
function looseCompareArrays(a, b) {
  if (a.length !== b.length) return false;
  let equal = true;
  for (let i = 0; equal && i < a.length; i++) {
    equal = looseEqual(a[i], b[i]);
  }
  return equal;
}
function looseEqual(a, b) {
  if (a === b) return true;
  let aValidType = isDate(a);
  let bValidType = isDate(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a.getTime() === b.getTime() : false;
  }
  aValidType = isSymbol(a);
  bValidType = isSymbol(b);
  if (aValidType || bValidType) {
    return a === b;
  }
  aValidType = isArray(a);
  bValidType = isArray(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareArrays(a, b) : false;
  }
  aValidType = isObject(a);
  bValidType = isObject(b);
  if (aValidType || bValidType) {
    if (!aValidType || !bValidType) {
      return false;
    }
    const aKeysCount = Object.keys(a).length;
    const bKeysCount = Object.keys(b).length;
    if (aKeysCount !== bKeysCount) {
      return false;
    }
    for (const key in a) {
      const aHasKey = a.hasOwnProperty(key);
      const bHasKey = b.hasOwnProperty(key);
      if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
        return false;
      }
    }
  }
  return String(a) === String(b);
}
function looseIndexOf(arr, val) {
  return arr.findIndex((item) => looseEqual(item, val));
}
const isRef$1 = (val) => {
  return !!(val && val["__v_isRef"] === true);
};
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (isRef$1(val)) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce(
        (entries, [key, val2], i) => {
          entries[stringifySymbol(key, i) + " =>"] = val2;
          return entries;
        },
        {}
      )
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
    };
  } else if (isSymbol(val)) {
    return stringifySymbol(val);
  } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const stringifySymbol = (v, i = "") => {
  var _a;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v
  );
};
/**
* @vue/reactivity v3.5.32
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let activeEffectScope;
class EffectScope {
  // TODO isolatedDeclarations "__v_skip"
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this._on = 0;
    this.effects = [];
    this.cleanups = [];
    this._isPaused = false;
    this.__v_skip = true;
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = true;
      let i, l;
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].pause();
        }
      }
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].pause();
      }
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active) {
      if (this._isPaused) {
        this._isPaused = false;
        let i, l;
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].resume();
          }
        }
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].resume();
        }
      }
    }
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    if (++this._on === 1) {
      this.prevScope = activeEffectScope;
      activeEffectScope = this;
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    if (this._on > 0 && --this._on === 0) {
      activeEffectScope = this.prevScope;
      this.prevScope = void 0;
    }
  }
  stop(fromParent) {
    if (this._active) {
      this._active = false;
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      this.effects.length = 0;
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      this.cleanups.length = 0;
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
    }
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
let activeSub;
const pausedQueueEffects = /* @__PURE__ */ new WeakSet();
class ReactiveEffect {
  constructor(fn) {
    this.fn = fn;
    this.deps = void 0;
    this.depsTail = void 0;
    this.flags = 1 | 4;
    this.next = void 0;
    this.cleanup = void 0;
    this.scheduler = void 0;
    if (activeEffectScope && activeEffectScope.active) {
      activeEffectScope.effects.push(this);
    }
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    if (this.flags & 64) {
      this.flags &= -65;
      if (pausedQueueEffects.has(this)) {
        pausedQueueEffects.delete(this);
        this.trigger();
      }
    }
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags & 2 && !(this.flags & 32)) {
      return;
    }
    if (!(this.flags & 8)) {
      batch(this);
    }
  }
  run() {
    if (!(this.flags & 1)) {
      return this.fn();
    }
    this.flags |= 2;
    cleanupEffect(this);
    prepareDeps(this);
    const prevEffect = activeSub;
    const prevShouldTrack = shouldTrack;
    activeSub = this;
    shouldTrack = true;
    try {
      return this.fn();
    } finally {
      cleanupDeps(this);
      activeSub = prevEffect;
      shouldTrack = prevShouldTrack;
      this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let link = this.deps; link; link = link.nextDep) {
        removeSub(link);
      }
      this.deps = this.depsTail = void 0;
      cleanupEffect(this);
      this.onStop && this.onStop();
      this.flags &= -2;
    }
  }
  trigger() {
    if (this.flags & 64) {
      pausedQueueEffects.add(this);
    } else if (this.scheduler) {
      this.scheduler();
    } else {
      this.runIfDirty();
    }
  }
  /**
   * @internal
   */
  runIfDirty() {
    if (isDirty(this)) {
      this.run();
    }
  }
  get dirty() {
    return isDirty(this);
  }
}
let batchDepth = 0;
let batchedSub;
let batchedComputed;
function batch(sub, isComputed = false) {
  sub.flags |= 8;
  if (isComputed) {
    sub.next = batchedComputed;
    batchedComputed = sub;
    return;
  }
  sub.next = batchedSub;
  batchedSub = sub;
}
function startBatch() {
  batchDepth++;
}
function endBatch() {
  if (--batchDepth > 0) {
    return;
  }
  if (batchedComputed) {
    let e = batchedComputed;
    batchedComputed = void 0;
    while (e) {
      const next = e.next;
      e.next = void 0;
      e.flags &= -9;
      e = next;
    }
  }
  let error;
  while (batchedSub) {
    let e = batchedSub;
    batchedSub = void 0;
    while (e) {
      const next = e.next;
      e.next = void 0;
      e.flags &= -9;
      if (e.flags & 1) {
        try {
          ;
          e.trigger();
        } catch (err) {
          if (!error) error = err;
        }
      }
      e = next;
    }
  }
  if (error) throw error;
}
function prepareDeps(sub) {
  for (let link = sub.deps; link; link = link.nextDep) {
    link.version = -1;
    link.prevActiveLink = link.dep.activeLink;
    link.dep.activeLink = link;
  }
}
function cleanupDeps(sub) {
  let head;
  let tail = sub.depsTail;
  let link = tail;
  while (link) {
    const prev = link.prevDep;
    if (link.version === -1) {
      if (link === tail) tail = prev;
      removeSub(link);
      removeDep(link);
    } else {
      head = link;
    }
    link.dep.activeLink = link.prevActiveLink;
    link.prevActiveLink = void 0;
    link = prev;
  }
  sub.deps = head;
  sub.depsTail = tail;
}
function isDirty(sub) {
  for (let link = sub.deps; link; link = link.nextDep) {
    if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) {
      return true;
    }
  }
  if (sub._dirty) {
    return true;
  }
  return false;
}
function refreshComputed(computed2) {
  if (computed2.flags & 4 && !(computed2.flags & 16)) {
    return;
  }
  computed2.flags &= -17;
  if (computed2.globalVersion === globalVersion) {
    return;
  }
  computed2.globalVersion = globalVersion;
  if (!computed2.isSSR && computed2.flags & 128 && (!computed2.deps && !computed2._dirty || !isDirty(computed2))) {
    return;
  }
  computed2.flags |= 2;
  const dep = computed2.dep;
  const prevSub = activeSub;
  const prevShouldTrack = shouldTrack;
  activeSub = computed2;
  shouldTrack = true;
  try {
    prepareDeps(computed2);
    const value = computed2.fn(computed2._value);
    if (dep.version === 0 || hasChanged(value, computed2._value)) {
      computed2.flags |= 128;
      computed2._value = value;
      dep.version++;
    }
  } catch (err) {
    dep.version++;
    throw err;
  } finally {
    activeSub = prevSub;
    shouldTrack = prevShouldTrack;
    cleanupDeps(computed2);
    computed2.flags &= -3;
  }
}
function removeSub(link, soft = false) {
  const { dep, prevSub, nextSub } = link;
  if (prevSub) {
    prevSub.nextSub = nextSub;
    link.prevSub = void 0;
  }
  if (nextSub) {
    nextSub.prevSub = prevSub;
    link.nextSub = void 0;
  }
  if (dep.subs === link) {
    dep.subs = prevSub;
    if (!prevSub && dep.computed) {
      dep.computed.flags &= -5;
      for (let l = dep.computed.deps; l; l = l.nextDep) {
        removeSub(l, true);
      }
    }
  }
  if (!soft && !--dep.sc && dep.map) {
    dep.map.delete(dep.key);
  }
}
function removeDep(link) {
  const { prevDep, nextDep } = link;
  if (prevDep) {
    prevDep.nextDep = nextDep;
    link.prevDep = void 0;
  }
  if (nextDep) {
    nextDep.prevDep = prevDep;
    link.nextDep = void 0;
  }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function cleanupEffect(e) {
  const { cleanup } = e;
  e.cleanup = void 0;
  if (cleanup) {
    const prevSub = activeSub;
    activeSub = void 0;
    try {
      cleanup();
    } finally {
      activeSub = prevSub;
    }
  }
}
let globalVersion = 0;
class Link {
  constructor(sub, dep) {
    this.sub = sub;
    this.dep = dep;
    this.version = dep.version;
    this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Dep {
  // TODO isolatedDeclarations "__v_skip"
  constructor(computed2) {
    this.computed = computed2;
    this.version = 0;
    this.activeLink = void 0;
    this.subs = void 0;
    this.map = void 0;
    this.key = void 0;
    this.sc = 0;
    this.__v_skip = true;
  }
  track(debugInfo) {
    if (!activeSub || !shouldTrack || activeSub === this.computed) {
      return;
    }
    let link = this.activeLink;
    if (link === void 0 || link.sub !== activeSub) {
      link = this.activeLink = new Link(activeSub, this);
      if (!activeSub.deps) {
        activeSub.deps = activeSub.depsTail = link;
      } else {
        link.prevDep = activeSub.depsTail;
        activeSub.depsTail.nextDep = link;
        activeSub.depsTail = link;
      }
      addSub(link);
    } else if (link.version === -1) {
      link.version = this.version;
      if (link.nextDep) {
        const next = link.nextDep;
        next.prevDep = link.prevDep;
        if (link.prevDep) {
          link.prevDep.nextDep = next;
        }
        link.prevDep = activeSub.depsTail;
        link.nextDep = void 0;
        activeSub.depsTail.nextDep = link;
        activeSub.depsTail = link;
        if (activeSub.deps === link) {
          activeSub.deps = next;
        }
      }
    }
    return link;
  }
  trigger(debugInfo) {
    this.version++;
    globalVersion++;
    this.notify(debugInfo);
  }
  notify(debugInfo) {
    startBatch();
    try {
      if (false) ;
      for (let link = this.subs; link; link = link.prevSub) {
        if (link.sub.notify()) {
          ;
          link.sub.dep.notify();
        }
      }
    } finally {
      endBatch();
    }
  }
}
function addSub(link) {
  link.dep.sc++;
  if (link.sub.flags & 4) {
    const computed2 = link.dep.computed;
    if (computed2 && !link.dep.subs) {
      computed2.flags |= 4 | 16;
      for (let l = computed2.deps; l; l = l.nextDep) {
        addSub(l);
      }
    }
    const currentTail = link.dep.subs;
    if (currentTail !== link) {
      link.prevSub = currentTail;
      if (currentTail) currentTail.nextSub = link;
    }
    link.dep.subs = link;
  }
}
const targetMap = /* @__PURE__ */ new WeakMap();
const ITERATE_KEY = /* @__PURE__ */ Symbol(
  ""
);
const MAP_KEY_ITERATE_KEY = /* @__PURE__ */ Symbol(
  ""
);
const ARRAY_ITERATE_KEY = /* @__PURE__ */ Symbol(
  ""
);
function track(target, type, key) {
  if (shouldTrack && activeSub) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = new Dep());
      dep.map = depsMap;
      dep.key = key;
    }
    {
      dep.track();
    }
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    globalVersion++;
    return;
  }
  const run = (dep) => {
    if (dep) {
      {
        dep.trigger();
      }
    }
  };
  startBatch();
  if (type === "clear") {
    depsMap.forEach(run);
  } else {
    const targetIsArray = isArray(target);
    const isArrayIndex = targetIsArray && isIntegerKey(key);
    if (targetIsArray && key === "length") {
      const newLength = Number(newValue);
      depsMap.forEach((dep, key2) => {
        if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) {
          run(dep);
        }
      });
    } else {
      if (key !== void 0 || depsMap.has(void 0)) {
        run(depsMap.get(key));
      }
      if (isArrayIndex) {
        run(depsMap.get(ARRAY_ITERATE_KEY));
      }
      switch (type) {
        case "add":
          if (!targetIsArray) {
            run(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              run(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          } else if (isArrayIndex) {
            run(depsMap.get("length"));
          }
          break;
        case "delete":
          if (!targetIsArray) {
            run(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              run(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          }
          break;
        case "set":
          if (isMap(target)) {
            run(depsMap.get(ITERATE_KEY));
          }
          break;
      }
    }
  }
  endBatch();
}
function reactiveReadArray(array) {
  const raw = /* @__PURE__ */ toRaw(array);
  if (raw === array) return raw;
  track(raw, "iterate", ARRAY_ITERATE_KEY);
  return /* @__PURE__ */ isShallow(array) ? raw : raw.map(toReactive);
}
function shallowReadArray(arr) {
  track(arr = /* @__PURE__ */ toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
  return arr;
}
function toWrapped(target, item) {
  if (/* @__PURE__ */ isReadonly(target)) {
    return /* @__PURE__ */ isReactive(target) ? toReadonly(toReactive(item)) : toReadonly(item);
  }
  return toReactive(item);
}
const arrayInstrumentations = {
  __proto__: null,
  [Symbol.iterator]() {
    return iterator(this, Symbol.iterator, (item) => toWrapped(this, item));
  },
  concat(...args) {
    return reactiveReadArray(this).concat(
      ...args.map((x) => isArray(x) ? reactiveReadArray(x) : x)
    );
  },
  entries() {
    return iterator(this, "entries", (value) => {
      value[1] = toWrapped(this, value[1]);
      return value;
    });
  },
  every(fn, thisArg) {
    return apply(this, "every", fn, thisArg, void 0, arguments);
  },
  filter(fn, thisArg) {
    return apply(
      this,
      "filter",
      fn,
      thisArg,
      (v) => v.map((item) => toWrapped(this, item)),
      arguments
    );
  },
  find(fn, thisArg) {
    return apply(
      this,
      "find",
      fn,
      thisArg,
      (item) => toWrapped(this, item),
      arguments
    );
  },
  findIndex(fn, thisArg) {
    return apply(this, "findIndex", fn, thisArg, void 0, arguments);
  },
  findLast(fn, thisArg) {
    return apply(
      this,
      "findLast",
      fn,
      thisArg,
      (item) => toWrapped(this, item),
      arguments
    );
  },
  findLastIndex(fn, thisArg) {
    return apply(this, "findLastIndex", fn, thisArg, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(fn, thisArg) {
    return apply(this, "forEach", fn, thisArg, void 0, arguments);
  },
  includes(...args) {
    return searchProxy(this, "includes", args);
  },
  indexOf(...args) {
    return searchProxy(this, "indexOf", args);
  },
  join(separator) {
    return reactiveReadArray(this).join(separator);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...args) {
    return searchProxy(this, "lastIndexOf", args);
  },
  map(fn, thisArg) {
    return apply(this, "map", fn, thisArg, void 0, arguments);
  },
  pop() {
    return noTracking(this, "pop");
  },
  push(...args) {
    return noTracking(this, "push", args);
  },
  reduce(fn, ...args) {
    return reduce(this, "reduce", fn, args);
  },
  reduceRight(fn, ...args) {
    return reduce(this, "reduceRight", fn, args);
  },
  shift() {
    return noTracking(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(fn, thisArg) {
    return apply(this, "some", fn, thisArg, void 0, arguments);
  },
  splice(...args) {
    return noTracking(this, "splice", args);
  },
  toReversed() {
    return reactiveReadArray(this).toReversed();
  },
  toSorted(comparer) {
    return reactiveReadArray(this).toSorted(comparer);
  },
  toSpliced(...args) {
    return reactiveReadArray(this).toSpliced(...args);
  },
  unshift(...args) {
    return noTracking(this, "unshift", args);
  },
  values() {
    return iterator(this, "values", (item) => toWrapped(this, item));
  }
};
function iterator(self2, method, wrapValue) {
  const arr = shallowReadArray(self2);
  const iter = arr[method]();
  if (arr !== self2 && !/* @__PURE__ */ isShallow(self2)) {
    iter._next = iter.next;
    iter.next = () => {
      const result = iter._next();
      if (!result.done) {
        result.value = wrapValue(result.value);
      }
      return result;
    };
  }
  return iter;
}
const arrayProto = Array.prototype;
function apply(self2, method, fn, thisArg, wrappedRetFn, args) {
  const arr = shallowReadArray(self2);
  const needsWrap = arr !== self2 && !/* @__PURE__ */ isShallow(self2);
  const methodFn = arr[method];
  if (methodFn !== arrayProto[method]) {
    const result2 = methodFn.apply(self2, args);
    return needsWrap ? toReactive(result2) : result2;
  }
  let wrappedFn = fn;
  if (arr !== self2) {
    if (needsWrap) {
      wrappedFn = function(item, index) {
        return fn.call(this, toWrapped(self2, item), index, self2);
      };
    } else if (fn.length > 2) {
      wrappedFn = function(item, index) {
        return fn.call(this, item, index, self2);
      };
    }
  }
  const result = methodFn.call(arr, wrappedFn, thisArg);
  return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
}
function reduce(self2, method, fn, args) {
  const arr = shallowReadArray(self2);
  const needsWrap = arr !== self2 && !/* @__PURE__ */ isShallow(self2);
  let wrappedFn = fn;
  let wrapInitialAccumulator = false;
  if (arr !== self2) {
    if (needsWrap) {
      wrapInitialAccumulator = args.length === 0;
      wrappedFn = function(acc, item, index) {
        if (wrapInitialAccumulator) {
          wrapInitialAccumulator = false;
          acc = toWrapped(self2, acc);
        }
        return fn.call(this, acc, toWrapped(self2, item), index, self2);
      };
    } else if (fn.length > 3) {
      wrappedFn = function(acc, item, index) {
        return fn.call(this, acc, item, index, self2);
      };
    }
  }
  const result = arr[method](wrappedFn, ...args);
  return wrapInitialAccumulator ? toWrapped(self2, result) : result;
}
function searchProxy(self2, method, args) {
  const arr = /* @__PURE__ */ toRaw(self2);
  track(arr, "iterate", ARRAY_ITERATE_KEY);
  const res = arr[method](...args);
  if ((res === -1 || res === false) && /* @__PURE__ */ isProxy(args[0])) {
    args[0] = /* @__PURE__ */ toRaw(args[0]);
    return arr[method](...args);
  }
  return res;
}
function noTracking(self2, method, args = []) {
  pauseTracking();
  startBatch();
  const res = (/* @__PURE__ */ toRaw(self2))[method].apply(self2, args);
  endBatch();
  resetTracking();
  return res;
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
function hasOwnProperty(key) {
  if (!isSymbol(key)) key = String(key);
  const obj = /* @__PURE__ */ toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
class BaseReactiveHandler {
  constructor(_isReadonly = false, _isShallow = false) {
    this._isReadonly = _isReadonly;
    this._isShallow = _isShallow;
  }
  get(target, key, receiver) {
    if (key === "__v_skip") return target["__v_skip"];
    const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return isShallow2;
    } else if (key === "__v_raw") {
      if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
        return target;
      }
      return;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly2) {
      let fn;
      if (targetIsArray && (fn = arrayInstrumentations[key])) {
        return fn;
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(
      target,
      key,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ isRef(target) ? target : receiver
    );
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (isShallow2) {
      return res;
    }
    if (/* @__PURE__ */ isRef(res)) {
      const value = targetIsArray && isIntegerKey(key) ? res : res.value;
      return isReadonly2 && isObject(value) ? /* @__PURE__ */ readonly(value) : value;
    }
    if (isObject(res)) {
      return isReadonly2 ? /* @__PURE__ */ readonly(res) : /* @__PURE__ */ reactive(res);
    }
    return res;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(false, isShallow2);
  }
  set(target, key, value, receiver) {
    let oldValue = target[key];
    const isArrayWithIntegerKey = isArray(target) && isIntegerKey(key);
    if (!this._isShallow) {
      const isOldValueReadonly = /* @__PURE__ */ isReadonly(oldValue);
      if (!/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value)) {
        oldValue = /* @__PURE__ */ toRaw(oldValue);
        value = /* @__PURE__ */ toRaw(value);
      }
      if (!isArrayWithIntegerKey && /* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value)) {
        if (isOldValueReadonly) {
          return true;
        } else {
          oldValue.value = value;
          return true;
        }
      }
    }
    const hadKey = isArrayWithIntegerKey ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(
      target,
      key,
      value,
      /* @__PURE__ */ isRef(target) ? target : receiver
    );
    if (target === /* @__PURE__ */ toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  }
  deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0);
    }
    return result;
  }
  has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  ownKeys(target) {
    track(
      target,
      "iterate",
      isArray(target) ? "length" : ITERATE_KEY
    );
    return Reflect.ownKeys(target);
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(true, isShallow2);
  }
  set(target, key) {
    return true;
  }
  deleteProperty(target, key) {
    return true;
  }
}
const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(true);
const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = /* @__PURE__ */ toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return extend(
      // inheriting all iterator properties
      Object.create(innerIterator),
      {
        // iterator protocol
        next() {
          const { value, done } = innerIterator.next();
          return done ? { value, done } : {
            value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
            done
          };
        }
      }
    );
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : type === "clear" ? void 0 : this;
  };
}
function createInstrumentations(readonly2, shallow) {
  const instrumentations = {
    get(key) {
      const target = this["__v_raw"];
      const rawTarget = /* @__PURE__ */ toRaw(target);
      const rawKey = /* @__PURE__ */ toRaw(key);
      if (!readonly2) {
        if (hasChanged(key, rawKey)) {
          track(rawTarget, "get", key);
        }
        track(rawTarget, "get", rawKey);
      }
      const { has } = getProto(rawTarget);
      const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
      if (has.call(rawTarget, key)) {
        return wrap(target.get(key));
      } else if (has.call(rawTarget, rawKey)) {
        return wrap(target.get(rawKey));
      } else if (target !== rawTarget) {
        target.get(key);
      }
    },
    get size() {
      const target = this["__v_raw"];
      !readonly2 && track(/* @__PURE__ */ toRaw(target), "iterate", ITERATE_KEY);
      return target.size;
    },
    has(key) {
      const target = this["__v_raw"];
      const rawTarget = /* @__PURE__ */ toRaw(target);
      const rawKey = /* @__PURE__ */ toRaw(key);
      if (!readonly2) {
        if (hasChanged(key, rawKey)) {
          track(rawTarget, "has", key);
        }
        track(rawTarget, "has", rawKey);
      }
      return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
    },
    forEach(callback, thisArg) {
      const observed = this;
      const target = observed["__v_raw"];
      const rawTarget = /* @__PURE__ */ toRaw(target);
      const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
      !readonly2 && track(rawTarget, "iterate", ITERATE_KEY);
      return target.forEach((value, key) => {
        return callback.call(thisArg, wrap(value), wrap(key), observed);
      });
    }
  };
  extend(
    instrumentations,
    readonly2 ? {
      add: createReadonlyMethod("add"),
      set: createReadonlyMethod("set"),
      delete: createReadonlyMethod("delete"),
      clear: createReadonlyMethod("clear")
    } : {
      add(value) {
        const target = /* @__PURE__ */ toRaw(this);
        const proto = getProto(target);
        const rawValue = /* @__PURE__ */ toRaw(value);
        const valueToAdd = !shallow && !/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value) ? rawValue : value;
        const hadKey = proto.has.call(target, valueToAdd) || hasChanged(value, valueToAdd) && proto.has.call(target, value) || hasChanged(rawValue, valueToAdd) && proto.has.call(target, rawValue);
        if (!hadKey) {
          target.add(valueToAdd);
          trigger(target, "add", valueToAdd, valueToAdd);
        }
        return this;
      },
      set(key, value) {
        if (!shallow && !/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value)) {
          value = /* @__PURE__ */ toRaw(value);
        }
        const target = /* @__PURE__ */ toRaw(this);
        const { has, get } = getProto(target);
        let hadKey = has.call(target, key);
        if (!hadKey) {
          key = /* @__PURE__ */ toRaw(key);
          hadKey = has.call(target, key);
        }
        const oldValue = get.call(target, key);
        target.set(key, value);
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value);
        }
        return this;
      },
      delete(key) {
        const target = /* @__PURE__ */ toRaw(this);
        const { has, get } = getProto(target);
        let hadKey = has.call(target, key);
        if (!hadKey) {
          key = /* @__PURE__ */ toRaw(key);
          hadKey = has.call(target, key);
        }
        get ? get.call(target, key) : void 0;
        const result = target.delete(key);
        if (hadKey) {
          trigger(target, "delete", key, void 0);
        }
        return result;
      },
      clear() {
        const target = /* @__PURE__ */ toRaw(this);
        const hadItems = target.size !== 0;
        const result = target.clear();
        if (hadItems) {
          trigger(
            target,
            "clear",
            void 0,
            void 0
          );
        }
        return result;
      }
    }
  );
  const iteratorMethods = [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ];
  iteratorMethods.forEach((method) => {
    instrumentations[method] = createIterableMethod(method, readonly2, shallow);
  });
  return instrumentations;
}
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = createInstrumentations(isReadonly2, shallow);
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
// @__NO_SIDE_EFFECTS__
function reactive(target) {
  if (/* @__PURE__ */ isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
// @__NO_SIDE_EFFECTS__
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
// @__NO_SIDE_EFFECTS__
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
// @__NO_SIDE_EFFECTS__
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
// @__NO_SIDE_EFFECTS__
function isReactive(value) {
  if (/* @__PURE__ */ isReadonly(value)) {
    return /* @__PURE__ */ isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
// @__NO_SIDE_EFFECTS__
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
// @__NO_SIDE_EFFECTS__
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
// @__NO_SIDE_EFFECTS__
function isProxy(value) {
  return value ? !!value["__v_raw"] : false;
}
// @__NO_SIDE_EFFECTS__
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? /* @__PURE__ */ toRaw(raw) : observed;
}
function markRaw(value) {
  if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) {
    def(value, "__v_skip", true);
  }
  return value;
}
const toReactive = (value) => isObject(value) ? /* @__PURE__ */ reactive(value) : value;
const toReadonly = (value) => isObject(value) ? /* @__PURE__ */ readonly(value) : value;
// @__NO_SIDE_EFFECTS__
function isRef(r) {
  return r ? r["__v_isRef"] === true : false;
}
// @__NO_SIDE_EFFECTS__
function ref(value) {
  return createRef(value, false);
}
function createRef(rawValue, shallow) {
  if (/* @__PURE__ */ isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, isShallow2) {
    this.dep = new Dep();
    this["__v_isRef"] = true;
    this["__v_isShallow"] = false;
    this._rawValue = isShallow2 ? value : /* @__PURE__ */ toRaw(value);
    this._value = isShallow2 ? value : toReactive(value);
    this["__v_isShallow"] = isShallow2;
  }
  get value() {
    {
      this.dep.track();
    }
    return this._value;
  }
  set value(newValue) {
    const oldValue = this._rawValue;
    const useDirectValue = this["__v_isShallow"] || /* @__PURE__ */ isShallow(newValue) || /* @__PURE__ */ isReadonly(newValue);
    newValue = useDirectValue ? newValue : /* @__PURE__ */ toRaw(newValue);
    if (hasChanged(newValue, oldValue)) {
      this._rawValue = newValue;
      this._value = useDirectValue ? newValue : toReactive(newValue);
      {
        this.dep.trigger();
      }
    }
  }
}
function unref(ref2) {
  return /* @__PURE__ */ isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (/* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return /* @__PURE__ */ isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
class ComputedRefImpl {
  constructor(fn, setter, isSSR) {
    this.fn = fn;
    this.setter = setter;
    this._value = void 0;
    this.dep = new Dep(this);
    this.__v_isRef = true;
    this.deps = void 0;
    this.depsTail = void 0;
    this.flags = 16;
    this.globalVersion = globalVersion - 1;
    this.next = void 0;
    this.effect = this;
    this["__v_isReadonly"] = !setter;
    this.isSSR = isSSR;
  }
  /**
   * @internal
   */
  notify() {
    this.flags |= 16;
    if (!(this.flags & 8) && // avoid infinite self recursion
    activeSub !== this) {
      batch(this, true);
      return true;
    }
  }
  get value() {
    const link = this.dep.track();
    refreshComputed(this);
    if (link) {
      link.version = this.dep.version;
    }
    return this._value;
  }
  set value(newValue) {
    if (this.setter) {
      this.setter(newValue);
    }
  }
}
// @__NO_SIDE_EFFECTS__
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, isSSR);
  return cRef;
}
const INITIAL_WATCHER_VALUE = {};
const cleanupMap = /* @__PURE__ */ new WeakMap();
let activeWatcher = void 0;
function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
  if (owner) {
    let cleanups = cleanupMap.get(owner);
    if (!cleanups) cleanupMap.set(owner, cleanups = []);
    cleanups.push(cleanupFn);
  }
}
function watch$1(source, cb, options = EMPTY_OBJ) {
  const { immediate, deep, once, scheduler, augmentJob, call } = options;
  const reactiveGetter = (source2) => {
    if (deep) return source2;
    if (/* @__PURE__ */ isShallow(source2) || deep === false || deep === 0)
      return traverse(source2, 1);
    return traverse(source2);
  };
  let effect2;
  let getter;
  let cleanup;
  let boundCleanup;
  let forceTrigger = false;
  let isMultiSource = false;
  if (/* @__PURE__ */ isRef(source)) {
    getter = () => source.value;
    forceTrigger = /* @__PURE__ */ isShallow(source);
  } else if (/* @__PURE__ */ isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => /* @__PURE__ */ isReactive(s) || /* @__PURE__ */ isShallow(s));
    getter = () => source.map((s) => {
      if (/* @__PURE__ */ isRef(s)) {
        return s.value;
      } else if (/* @__PURE__ */ isReactive(s)) {
        return reactiveGetter(s);
      } else if (isFunction(s)) {
        return call ? call(s, 2) : s();
      } else ;
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = call ? () => call(source, 2) : source;
    } else {
      getter = () => {
        if (cleanup) {
          pauseTracking();
          try {
            cleanup();
          } finally {
            resetTracking();
          }
        }
        const currentEffect = activeWatcher;
        activeWatcher = effect2;
        try {
          return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
        } finally {
          activeWatcher = currentEffect;
        }
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    const depth = deep === true ? Infinity : deep;
    getter = () => traverse(baseGetter(), depth);
  }
  const scope = getCurrentScope();
  const watchHandle = () => {
    effect2.stop();
    if (scope && scope.active) {
      remove(scope.effects, effect2);
    }
  };
  if (once && cb) {
    const _cb = cb;
    cb = (...args) => {
      _cb(...args);
      watchHandle();
    };
  }
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = (immediateFirstRun) => {
    if (!(effect2.flags & 1) || !effect2.dirty && !immediateFirstRun) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
        if (cleanup) {
          cleanup();
        }
        const currentWatcher = activeWatcher;
        activeWatcher = effect2;
        try {
          const args = [
            newValue,
            // pass undefined as the old value when it's changed for the first time
            oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
            boundCleanup
          ];
          oldValue = newValue;
          call ? call(cb, 3, args) : (
            // @ts-expect-error
            cb(...args)
          );
        } finally {
          activeWatcher = currentWatcher;
        }
      }
    } else {
      effect2.run();
    }
  };
  if (augmentJob) {
    augmentJob(job);
  }
  effect2 = new ReactiveEffect(getter);
  effect2.scheduler = scheduler ? () => scheduler(job, false) : job;
  boundCleanup = (fn) => onWatcherCleanup(fn, false, effect2);
  cleanup = effect2.onStop = () => {
    const cleanups = cleanupMap.get(effect2);
    if (cleanups) {
      if (call) {
        call(cleanups, 4);
      } else {
        for (const cleanup2 of cleanups) cleanup2();
      }
      cleanupMap.delete(effect2);
    }
  };
  if (cb) {
    if (immediate) {
      job(true);
    } else {
      oldValue = effect2.run();
    }
  } else if (scheduler) {
    scheduler(job.bind(null, true), true);
  } else {
    effect2.run();
  }
  watchHandle.pause = effect2.pause.bind(effect2);
  watchHandle.resume = effect2.resume.bind(effect2);
  watchHandle.stop = watchHandle;
  return watchHandle;
}
function traverse(value, depth = Infinity, seen) {
  if (depth <= 0 || !isObject(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Map();
  if ((seen.get(value) || 0) >= depth) {
    return value;
  }
  seen.set(value, depth);
  depth--;
  if (/* @__PURE__ */ isRef(value)) {
    traverse(value.value, depth, seen);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], depth, seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, depth, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], depth, seen);
    }
    for (const key of Object.getOwnPropertySymbols(value)) {
      if (Object.prototype.propertyIsEnumerable.call(value, key)) {
        traverse(value[key], depth, seen);
      }
    }
  }
  return value;
}
/**
* @vue/runtime-core v3.5.32
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const stack = [];
let isWarning = false;
function warn$1(msg, ...args) {
  if (isWarning) return;
  isWarning = true;
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        // eslint-disable-next-line no-restricted-syntax
        msg + args.map((a) => {
          var _a, _b;
          return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
        }).join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
  isWarning = false;
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (/* @__PURE__ */ isRef(value)) {
    value = formatProp(key, /* @__PURE__ */ toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = /* @__PURE__ */ toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
function callWithErrorHandling(fn, instance, type, args) {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  if (isArray(fn)) {
    const values = [];
    for (let i = 0; i < fn.length; i++) {
      values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
    }
    return values;
  }
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    if (errorHandler) {
      pauseTracking();
      callWithErrorHandling(errorHandler, null, 10, [
        err,
        exposedInstance,
        errorInfo
      ]);
      resetTracking();
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev, throwUnhandledErrorInProduction);
}
function logError(err, type, contextVNode, throwInDev = true, throwInProd = false) {
  if (throwInProd) {
    throw err;
  } else {
    console.error(err);
  }
}
const queue = [];
let flushIndex = -1;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id || middleJobId === id && middleJob.flags & 2) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!(job.flags & 1)) {
    const jobId = getId(job);
    const lastJob = queue[queue.length - 1];
    if (!lastJob || // fast path when the job id is larger than the tail
    !(job.flags & 2) && jobId >= getId(lastJob)) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(jobId), 0, job);
    }
    job.flags |= 1;
    queueFlush();
  }
}
function queueFlush() {
  if (!currentFlushPromise) {
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray(cb)) {
    if (activePostFlushCbs && cb.id === -1) {
      activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
    } else if (!(cb.flags & 1)) {
      pendingPostFlushCbs.push(cb);
      cb.flags |= 1;
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(instance, seen, i = flushIndex + 1) {
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.flags & 2) {
      if (instance && cb.id !== instance.uid) {
        continue;
      }
      queue.splice(i, 1);
      i--;
      if (cb.flags & 4) {
        cb.flags &= -2;
      }
      cb();
      if (!(cb.flags & 4)) {
        cb.flags &= -2;
      }
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)].sort(
      (a, b) => getId(a) - getId(b)
    );
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      const cb = activePostFlushCbs[postFlushIndex];
      if (cb.flags & 4) {
        cb.flags &= -2;
      }
      if (!(cb.flags & 8)) cb();
      cb.flags &= -2;
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
function flushJobs(seen) {
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && !(job.flags & 8)) {
        if (false) ;
        if (job.flags & 4) {
          job.flags &= ~1;
        }
        callWithErrorHandling(
          job,
          job.i,
          job.i ? 15 : 14
        );
        if (!(job.flags & 4)) {
          job.flags &= ~1;
        }
      }
    }
  } finally {
    for (; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job) {
        job.flags &= -2;
      }
    }
    flushIndex = -1;
    queue.length = 0;
    flushPostFlushCbs();
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs();
    }
  }
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx) return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    let res;
    try {
      res = fn(...args);
    } finally {
      setCurrentRenderingInstance(prevInstance);
      if (renderFnWithContext._d) {
        setBlockTracking(1);
      }
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function withDirectives(vnode, directives) {
  if (currentRenderingInstance === null) {
    return vnode;
  }
  const instance = getComponentPublicInstance(currentRenderingInstance);
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
    if (dir) {
      if (isFunction(dir)) {
        dir = {
          mounted: dir,
          updated: dir
        };
      }
      if (dir.deep) {
        traverse(value);
      }
      bindings.push({
        dir,
        instance,
        value,
        oldValue: void 0,
        arg,
        modifiers
      });
    }
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
function provide(key, value) {
  if (currentInstance) {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = getCurrentInstance();
  if (instance || currentApp) {
    let provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null || instance.ce ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else ;
  }
}
const ssrContextKey = /* @__PURE__ */ Symbol.for("v-scx");
const useSSRContext = () => {
  {
    const ctx = inject(ssrContextKey);
    return ctx;
  }
};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, options = EMPTY_OBJ) {
  const { immediate, deep, flush, once } = options;
  const baseWatchOptions = extend({}, options);
  const runsImmediately = cb && immediate || !cb && flush !== "post";
  let ssrCleanup;
  if (isInSSRComponentSetup) {
    if (flush === "sync") {
      const ctx = useSSRContext();
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
    } else if (!runsImmediately) {
      const watchStopHandle = () => {
      };
      watchStopHandle.stop = NOOP;
      watchStopHandle.resume = NOOP;
      watchStopHandle.pause = NOOP;
      return watchStopHandle;
    }
  }
  const instance = currentInstance;
  baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
  let isPre = false;
  if (flush === "post") {
    baseWatchOptions.scheduler = (job) => {
      queuePostRenderEffect(job, instance && instance.suspense);
    };
  } else if (flush !== "sync") {
    isPre = true;
    baseWatchOptions.scheduler = (job, isFirstRun) => {
      if (isFirstRun) {
        job();
      } else {
        queueJob(job);
      }
    };
  }
  baseWatchOptions.augmentJob = (job) => {
    if (cb) {
      job.flags |= 4;
    }
    if (isPre) {
      job.flags |= 2;
      if (instance) {
        job.id = instance.uid;
        job.i = instance;
      }
    }
  };
  const watchHandle = watch$1(source, cb, baseWatchOptions);
  if (isInSSRComponentSetup) {
    if (ssrCleanup) {
      ssrCleanup.push(watchHandle);
    } else if (runsImmediately) {
      watchHandle();
    }
  }
  return watchHandle;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const reset = setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  reset();
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
const TeleportEndKey = /* @__PURE__ */ Symbol("_vte");
const isTeleport = (type) => type.__isTeleport;
const leaveCbKey = /* @__PURE__ */ Symbol("_leaveCb");
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    vnode.transition = hooks;
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
// @__NO_SIDE_EFFECTS__
function defineComponent(options, extraOptions) {
  return isFunction(options) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
  ) : options;
}
function markAsyncBoundary(instance) {
  instance.ids = [instance.ids[0] + instance.ids[2]++ + "-", 0, 0];
}
function isTemplateRefKey(refs, key) {
  let desc;
  return !!((desc = Object.getOwnPropertyDescriptor(refs, key)) && !desc.configurable);
}
const pendingSetRefMap = /* @__PURE__ */ new WeakMap();
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray(rawRef)) {
    rawRef.forEach(
      (r, i) => setRef(
        r,
        oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef),
        parentSuspense,
        vnode,
        isUnmount
      )
    );
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) {
      setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
    }
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref3 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  const rawSetupState = /* @__PURE__ */ toRaw(setupState);
  const canSetSetupRef = setupState === EMPTY_OBJ ? NO : (key) => {
    if (isTemplateRefKey(refs, key)) {
      return false;
    }
    return hasOwn(rawSetupState, key);
  };
  const canSetRef = (ref22, key) => {
    if (key && isTemplateRefKey(refs, key)) {
      return false;
    }
    return true;
  };
  if (oldRef != null && oldRef !== ref3) {
    invalidatePendingSetRef(oldRawRef);
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (canSetSetupRef(oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (/* @__PURE__ */ isRef(oldRef)) {
      const oldRawRefAtom = oldRawRef;
      if (canSetRef(oldRef, oldRawRefAtom.k)) {
        oldRef.value = null;
      }
      if (oldRawRefAtom.k) refs[oldRawRefAtom.k] = null;
    }
  }
  if (isFunction(ref3)) {
    callWithErrorHandling(ref3, owner, 12, [value, refs]);
  } else {
    const _isString = isString(ref3);
    const _isRef = /* @__PURE__ */ isRef(ref3);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? canSetSetupRef(ref3) ? setupState[ref3] : refs[ref3] : canSetRef() || !rawRef.k ? ref3.value : refs[rawRef.k];
          if (isUnmount) {
            isArray(existing) && remove(existing, refValue);
          } else {
            if (!isArray(existing)) {
              if (_isString) {
                refs[ref3] = [refValue];
                if (canSetSetupRef(ref3)) {
                  setupState[ref3] = refs[ref3];
                }
              } else {
                const newVal = [refValue];
                if (canSetRef(ref3, rawRef.k)) {
                  ref3.value = newVal;
                }
                if (rawRef.k) refs[rawRef.k] = newVal;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref3] = value;
          if (canSetSetupRef(ref3)) {
            setupState[ref3] = value;
          }
        } else if (_isRef) {
          if (canSetRef(ref3, rawRef.k)) {
            ref3.value = value;
          }
          if (rawRef.k) refs[rawRef.k] = value;
        } else ;
      };
      if (value) {
        const job = () => {
          doSet();
          pendingSetRefMap.delete(rawRef);
        };
        job.id = -1;
        pendingSetRefMap.set(rawRef, job);
        queuePostRenderEffect(job, parentSuspense);
      } else {
        invalidatePendingSetRef(rawRef);
        doSet();
      }
    }
  }
}
function invalidatePendingSetRef(rawRef) {
  const pendingSetRef = pendingSetRefMap.get(rawRef);
  if (pendingSetRef) {
    pendingSetRef.flags |= 8;
    pendingSetRefMap.delete(rawRef);
  }
}
getGlobalThis().requestIdleCallback || ((cb) => setTimeout(cb, 1));
getGlobalThis().cancelIdleCallback || ((id) => clearTimeout(id));
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      pauseTracking();
      const reset = setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      reset();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => {
  if (!isInSSRComponentSetup || lifecycle === "sp") {
    injectHook(lifecycle, (...args) => hook(...args), target);
  }
};
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook(
  "bu"
);
const onUpdated = createHook("u");
const onBeforeUnmount = createHook(
  "bum"
);
const onUnmounted = createHook("um");
const onServerPrefetch = createHook(
  "sp"
);
const onRenderTriggered = createHook("rtg");
const onRenderTracked = createHook("rtc");
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
const NULL_DYNAMIC_COMPONENT = /* @__PURE__ */ Symbol.for("v-ndc");
function renderList(source, renderItem, cache, index) {
  let ret;
  const cached = cache;
  const sourceIsArray = isArray(source);
  if (sourceIsArray || isString(source)) {
    const sourceIsReactiveArray = sourceIsArray && /* @__PURE__ */ isReactive(source);
    let needsWrap = false;
    let isReadonlySource = false;
    if (sourceIsReactiveArray) {
      needsWrap = !/* @__PURE__ */ isShallow(source);
      isReadonlySource = /* @__PURE__ */ isReadonly(source);
      source = shallowReadArray(source);
    }
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(
        needsWrap ? isReadonlySource ? toReadonly(toReactive(source[i])) : toReactive(source[i]) : source[i],
        i,
        void 0,
        cached
      );
    }
  } else if (typeof source === "number") {
    {
      ret = new Array(source);
      for (let i = 0; i < source; i++) {
        ret[i] = renderItem(i + 1, i, void 0, cached);
      }
    }
  } else if (isObject(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(
        source,
        (item, i) => renderItem(item, i, void 0, cached)
      );
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i, cached);
      }
    }
  } else {
    ret = [];
  }
  return ret;
}
const getPublicInstance = (i) => {
  if (!i) return null;
  if (isStatefulComponent(i)) return getComponentPublicInstance(i);
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) => i.props,
    $attrs: (i) => i.attrs,
    $slots: (i) => i.slots,
    $refs: (i) => i.refs,
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $host: (i) => i.ce,
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => {
      queueJob(i.update);
    }),
    $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
    $watch: (i) => instanceWatch.bind(i)
  })
);
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    if (key === "__v_skip") {
      return true;
    }
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (hasOwn(props, key)) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance.attrs, "get", "");
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else ;
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, props, type }
  }, key) {
    let cssModules;
    return !!(accessCache[key] || data !== EMPTY_OBJ && key[0] !== "$" && hasOwn(data, key) || hasSetupBinding(setupState, key) || hasOwn(props, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key) || (cssModules = type.__cssModules) && cssModules[key]);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
function normalizePropsOrEmits(props) {
  return isArray(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject(data)) ;
    else {
      instance.data = /* @__PURE__ */ reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get,
        set
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook(created, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val,
          enumerable: true
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components) instance.components = components;
  if (directives) instance.directives = directives;
  if (serverPrefetch) {
    markAsyncBoundary(instance);
  }
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (/* @__PURE__ */ isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  let getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      {
        watch(getter, handler);
      }
    }
  } else if (isFunction(raw)) {
    {
      watch(getter, raw.bind(publicThis));
    }
  } else if (isObject(raw)) {
    if (isArray(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else ;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m) => mergeOptions(resolved, m, optionMergeStrategies, true)
      );
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m) => mergeOptions(to, m, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose") ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction(to) ? to.call(this, this) : to,
      isFunction(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray(to) && isArray(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to) return from;
  if (!from) return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = extend({}, rootComponent);
    }
    if (rootProps != null && !isObject(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new WeakSet();
    const pluginCleanupFns = [];
    let isMounted = false;
    const app = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin)) ;
        else if (plugin && isFunction(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app, ...options);
        } else if (isFunction(plugin)) {
          installedPlugins.add(plugin);
          plugin(app, ...options);
        } else ;
        return app;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app;
      },
      mount(rootContainer, isHydrate, namespace) {
        if (!isMounted) {
          const vnode = app._ceVNode || createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (namespace === true) {
            namespace = "svg";
          } else if (namespace === false) {
            namespace = void 0;
          }
          {
            render(vnode, rootContainer, namespace);
          }
          isMounted = true;
          app._container = rootContainer;
          rootContainer.__vue_app__ = app;
          return getComponentPublicInstance(vnode.component);
        }
      },
      onUnmount(cleanupFn) {
        pluginCleanupFns.push(cleanupFn);
      },
      unmount() {
        if (isMounted) {
          callWithAsyncErrorHandling(
            pluginCleanupFns,
            app._instance,
            16
          );
          render(null, app._container);
          delete app._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app;
      },
      runWithContext(fn) {
        const lastApp = currentApp;
        currentApp = app;
        try {
          return fn();
        } finally {
          currentApp = lastApp;
        }
      }
    };
    return app;
  };
}
let currentApp = null;
const getModelModifiers = (props, modelName) => {
  return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
};
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted) return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modifiers = isModelListener2 && getModelModifiers(props, event.slice(7));
  if (modifiers) {
    if (modifiers.trim) {
      args = rawArgs.map((a) => isString(a) ? a.trim() : a);
    }
    if (modifiers.number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
const mixinEmitsCache = /* @__PURE__ */ new WeakMap();
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = asMixin ? mixinEmitsCache : appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const {
    type: Component,
    vnode,
    proxy,
    withProxy,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render,
    renderCache,
    props,
    data,
    setupState,
    ctx,
    inheritAttrs
  } = instance;
  const prev = setCurrentRenderingInstance(instance);
  let result;
  let fallthroughAttrs;
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      const thisProxy = false ? new Proxy(proxyToUse, {
        get(target, key, receiver) {
          warn$1(
            `Property '${String(
              key
            )}' was accessed via 'this'. Avoid using 'this' in templates.`
          );
          return Reflect.get(target, key, receiver);
        }
      }) : proxyToUse;
      result = normalizeVNode(
        render.call(
          thisProxy,
          proxyToUse,
          renderCache,
          false ? /* @__PURE__ */ shallowReadonly(props) : props,
          setupState,
          data,
          ctx
        )
      );
      fallthroughAttrs = attrs;
    } else {
      const render2 = Component;
      if (false) ;
      result = normalizeVNode(
        render2.length > 1 ? render2(
          false ? /* @__PURE__ */ shallowReadonly(props) : props,
          false ? {
            get attrs() {
              markAttrsAccessed();
              return /* @__PURE__ */ shallowReadonly(attrs);
            },
            slots,
            emit: emit2
          } : { attrs, slots, emit: emit2 }
        ) : render2(
          false ? /* @__PURE__ */ shallowReadonly(props) : props,
          null
        )
      );
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(
            fallthroughAttrs,
            propsOptions
          );
        }
        root = cloneVNode(root, fallthroughAttrs, false, true);
      }
    }
  }
  if (vnode.dirs) {
    root = cloneVNode(root, null, false, true);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    setTransitionHooks(root, vnode.transition);
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (hasPropValueChanged(nextProps, prevProps, key) && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (hasPropValueChanged(nextProps, prevProps, key) && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function hasPropValueChanged(nextProps, prevProps, key) {
  const nextProp = nextProps[key];
  const prevProp = prevProps[key];
  if (key === "style" && isObject(nextProp) && isObject(prevProp)) {
    return !looseEqual(nextProp, prevProp);
  }
  return nextProp !== prevProp;
}
function updateHOCHostEl({ vnode, parent, suspense }, el) {
  while (parent) {
    const root = parent.subTree;
    if (root.suspense && root.suspense.activeBranch === vnode) {
      root.suspense.vnode.el = root.el = el;
      vnode = root;
    }
    if (root === vnode) {
      (vnode = parent.vnode).el = el;
      parent = parent.parent;
    } else {
      break;
    }
  }
  if (suspense && suspense.activeBranch === vnode) {
    suspense.vnode.el = el;
  }
}
const internalObjectProto = {};
const createInternalObject = () => Object.create(internalObjectProto);
const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = createInternalObject();
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : /* @__PURE__ */ shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = /* @__PURE__ */ toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance.attrs, "set", "");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = /* @__PURE__ */ toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          const reset = setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          reset();
        }
      } else {
        value = defaultValue;
      }
      if (instance.ce) {
        instance.ce._setProp(key, value);
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
const mixinPropsCache = /* @__PURE__ */ new WeakMap();
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = asMixin ? mixinPropsCache : appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys) needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
        const propType = prop.type;
        let shouldCast = false;
        let shouldCastTrue = true;
        if (isArray(propType)) {
          for (let index = 0; index < propType.length; ++index) {
            const type = propType[index];
            const typeName = isFunction(type) && type.name;
            if (typeName === "Boolean") {
              shouldCast = true;
              break;
            } else if (typeName === "String") {
              shouldCastTrue = false;
            }
          }
        } else {
          shouldCast = isFunction(propType) && propType.name === "Boolean";
        }
        prop[
          0
          /* shouldCast */
        ] = shouldCast;
        prop[
          1
          /* shouldCastTrue */
        ] = shouldCastTrue;
        if (shouldCast || hasOwn(prop, "default")) {
          needCastKeys.push(normalizedKey);
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$" && !isReservedProp(key)) {
    return true;
  }
  return false;
}
const isInternalKey = (key) => key === "_" || key === "_ctx" || key === "$stable";
const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    if (false) ;
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key)) continue;
    const value = rawSlots[key];
    if (isFunction(value)) {
      slots[key] = normalizeSlot(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const assignSlots = (slots, children, optimized) => {
  for (const key in children) {
    if (optimized || !isInternalKey(key)) {
      slots[key] = children[key];
    }
  }
};
const initSlots = (instance, children, optimized) => {
  const slots = instance.slots = createInternalObject();
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      assignSlots(slots, children, optimized);
      if (optimized) {
        def(slots, "_", type, true);
      }
    } else {
      normalizeObjectSlots(children, slots);
    }
  } else if (children) {
    normalizeVNodeSlots(instance, children);
  }
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        assignSlots(slots, children, optimized);
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
        delete slots[key];
      }
    }
  }
};
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target = getGlobalThis();
  target.__VUE__ = true;
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    insertStaticContent: hostInsertStaticContent
  } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref3, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, namespace);
        }
        break;
      case Fragment:
        processFragment(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        break;
      default:
        if (shapeFlag & 1) {
          processElement(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 6) {
          processComponent(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 64) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else if (shapeFlag & 128) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else ;
    }
    if (ref3 != null && parentComponent) {
      setRef(ref3, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    } else if (ref3 == null && n1 && n1.ref != null) {
      setRef(n1.ref, null, parentSuspense, n1, true);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateText(n2.children),
        container,
        anchor
      );
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateComment(n2.children || ""),
        container,
        anchor
      );
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, namespace) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(
      n2.children,
      container,
      anchor,
      namespace,
      n2.el,
      n2.anchor
    );
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    if (n2.type === "svg") {
      namespace = "svg";
    } else if (n2.type === "math") {
      namespace = "mathml";
    }
    if (n1 == null) {
      mountElement(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      const customElement = n1.el && n1.el._isVueCE ? n1.el : null;
      try {
        if (customElement) {
          customElement._beginPatch();
        }
        patchElement(
          n1,
          n2,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } finally {
        if (customElement) {
          customElement._endPatch();
        }
      }
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { props, shapeFlag, transition, dirs } = vnode;
    el = vnode.el = hostCreateElement(
      vnode.type,
      namespace,
      props && props.is,
      props
    );
    if (shapeFlag & 8) {
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & 16) {
      mountChildren(
        vnode.children,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(vnode, namespace),
        slotScopeIds,
        optimized
      );
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "created");
    }
    setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    if (props) {
      for (const key in props) {
        if (key !== "value" && !isReservedProp(key)) {
          hostPatchProp(el, key, null, props[key], namespace, parentComponent);
        }
      }
      if ("value" in props) {
        hostPatchProp(el, "value", null, props.value, namespace);
      }
      if (vnodeHook = props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = needTransition(parentSuspense, transition);
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        try {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          needCallTransitionHooks && transition.enter(el);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
        } finally {
        }
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
        const parentVNode = parentComponent.vnode;
        setScopeId(
          el,
          parentVNode,
          parentVNode.scopeId,
          parentVNode.slotScopeIds,
          parentComponent.parent
        );
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(
        null,
        child,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) {
      hostSetElementText(el, "");
    }
    if (dynamicChildren) {
      patchBlockChildren(
        n1.dynamicChildren,
        dynamicChildren,
        el,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds
      );
    } else if (!optimized) {
      patchChildren(
        n1,
        n2,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds,
        false
      );
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(el, oldProps, newProps, parentComponent, namespace);
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, namespace);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(el, key, prev, next, namespace, parentComponent);
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(el, oldProps, newProps, parentComponent, namespace);
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
        oldVNode.shapeFlag & (6 | 64 | 128)) ? hostParentNode(oldVNode.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          fallbackContainer
        )
      );
      patch(
        oldVNode,
        newVNode,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        true
      );
    }
  };
  const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
    if (oldProps !== newProps) {
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(
              el,
              key,
              oldProps[key],
              null,
              namespace,
              parentComponent
            );
          }
        }
      }
      for (const key in newProps) {
        if (isReservedProp(key)) continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(el, key, prev, next, namespace, parentComponent);
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(
        // #10007
        // such fragment like `<></>` will be compiled into
        // a fragment which doesn't have a children.
        // In this case fallback to an empty array
        n2.children || [],
        container,
        fragmentEndAnchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
      // of renderSlot() with no valid children
      n1.dynamicChildren && n1.dynamicChildren.length === dynamicChildren.length) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          container,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds
        );
        if (
          // #2080 if the stable fragment has a key, it's a <template v-for> that may
          //  get moved around. Make sure all root level vnodes inherit el.
          // #2134 or if it's a component root, it may also get moved around
          // as the component is being moved.
          n2.key != null || parentComponent && n2 === parentComponent.subTree
        ) {
          traverseStaticChildren(
            n1,
            n2,
            true
            /* shallow */
          );
        }
      } else {
        patchChildren(
          n1,
          n2,
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(
          n2,
          container,
          anchor,
          namespace,
          optimized
        );
      } else {
        mountComponent(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          optimized
        );
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
    const instance = initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent,
      parentSuspense
    );
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance, false, optimized);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
        initialVNode.placeholder = placeholder.el;
      }
    } else {
      setupRenderEffect(
        instance,
        initialVNode,
        container,
        anchor,
        parentSuspense,
        namespace,
        optimized
      );
    }
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent, root, type } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        {
          if (root.ce && root.ce._hasShadowRoot()) {
            root.ce._injectChildStyle(
              type,
              instance.parent ? instance.parent.type : void 0
            );
          }
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(
            null,
            subTree,
            container,
            anchor,
            instance,
            parentSuspense,
            namespace
          );
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
            parentSuspense
          );
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance;
        {
          const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
          if (nonHydratedAsyncRoot) {
            if (next) {
              next.el = vnode.el;
              updateComponentPreRender(instance, next, optimized);
            }
            nonHydratedAsyncRoot.asyncDep.then(() => {
              queuePostRenderEffect(() => {
                if (!instance.isUnmounted) update();
              }, parentSuspense);
            });
            return;
          }
        }
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(
          prevTree,
          nextTree,
          // parent may have changed if it's in a teleport
          hostParentNode(prevTree.el),
          // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          namespace
        );
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, next, vnode),
            parentSuspense
          );
        }
      }
    };
    instance.scope.on();
    const effect2 = instance.effect = new ReactiveEffect(componentUpdateFn);
    instance.scope.off();
    const update = instance.update = effect2.run.bind(effect2);
    const job = instance.job = effect2.runIfDirty.bind(effect2);
    job.i = instance;
    job.id = instance.uid;
    effect2.scheduler = () => queueJob(job);
    toggleRecurse(instance, true);
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs(instance);
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(
        c1[i],
        nextChild,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
    if (oldLength > newLength) {
      unmountChildren(
        c1,
        parentComponent,
        parentSuspense,
        true,
        false,
        commonLength
      );
    } else {
      mountChildren(
        c2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
        commonLength
      );
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(
            null,
            c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(
            prevChild,
            c2[newIndex],
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchorVNode = c2[nextIndex + 1];
        const anchor = nextIndex + 1 < l2 ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          anchorVNode.el || resolveAsyncComponentPlaceholder(anchorVNode)
        ) : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition2) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove22 = () => {
          if (vnode.ctx.isUnmounted) {
            hostRemove(el);
          } else {
            hostInsert(el, container, anchor);
          }
        };
        const performLeave = () => {
          if (el._isLeaving) {
            el[leaveCbKey](
              true
              /* cancelled */
            );
          }
          leave(el, () => {
            remove22();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove22, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const {
      type,
      props,
      ref: ref3,
      children,
      dynamicChildren,
      shapeFlag,
      patchFlag,
      dirs,
      cacheIndex,
      memo
    } = vnode;
    if (patchFlag === -2) {
      optimized = false;
    }
    if (ref3 != null) {
      pauseTracking();
      setRef(ref3, null, parentSuspense, vnode, true);
      resetTracking();
    }
    if (cacheIndex != null) {
      parentComponent.renderCache[cacheIndex] = void 0;
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(
          vnode,
          parentComponent,
          parentSuspense,
          internals,
          doRemove
        );
      } else if (dynamicChildren && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !dynamicChildren.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(
          dynamicChildren,
          parentComponent,
          parentSuspense,
          false,
          true
        );
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    const shouldInvalidateMemo = memo != null && cacheIndex == null;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs || shouldInvalidateMemo) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
        if (shouldInvalidateMemo) {
          vnode.el = null;
        }
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, job, subTree, um, m, a } = instance;
    invalidateMount(m);
    invalidateMount(a);
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (job) {
      job.flags |= 8;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    const el = hostNextSibling(vnode.anchor || vnode.el);
    const teleportEnd = el && el[TeleportEndKey];
    return teleportEnd ? hostNextSibling(teleportEnd) : el;
  };
  let isFlushing = false;
  const render = (vnode, container, namespace) => {
    let instance;
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
        instance = container._vnode.component;
      }
    } else {
      patch(
        container._vnode || null,
        vnode,
        container,
        null,
        null,
        null,
        namespace
      );
    }
    container._vnode = vnode;
    if (!isFlushing) {
      isFlushing = true;
      flushPreFlushCbs(instance);
      flushPostFlushCbs();
      isFlushing = false;
    }
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  return {
    render,
    hydrate,
    createApp: createAppAPI(render)
  };
}
function resolveChildrenNamespace({ type, props }, currentNamespace) {
  return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
}
function toggleRecurse({ effect: effect2, job }, allowed) {
  if (allowed) {
    effect2.flags |= 32;
    job.flags |= 4;
  } else {
    effect2.flags &= -33;
    job.flags &= -5;
  }
}
function needTransition(parentSuspense, transition) {
  return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray(ch1) && isArray(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow && c2.patchFlag !== -2)
          traverseStaticChildren(c1, c2);
      }
      if (c2.type === Text) {
        if (c2.patchFlag === -1) {
          c2 = ch2[i] = cloneIfMounted(c2);
        }
        c2.el = c1.el;
      }
      if (c2.type === Comment && !c2.el) {
        c2.el = c1.el;
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
function locateNonHydratedAsyncRoot(instance) {
  const subComponent = instance.subTree.component;
  if (subComponent) {
    if (subComponent.asyncDep && !subComponent.asyncResolved) {
      return subComponent;
    } else {
      return locateNonHydratedAsyncRoot(subComponent);
    }
  }
}
function invalidateMount(hooks) {
  if (hooks) {
    for (let i = 0; i < hooks.length; i++)
      hooks[i].flags |= 8;
  }
}
function resolveAsyncComponentPlaceholder(anchorVnode) {
  if (anchorVnode.placeholder) {
    return anchorVnode.placeholder;
  }
  const instance = anchorVnode.component;
  if (instance) {
    return resolveAsyncComponentPlaceholder(instance.subTree);
  }
  return null;
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
const Fragment = /* @__PURE__ */ Symbol.for("v-fgt");
const Text = /* @__PURE__ */ Symbol.for("v-txt");
const Comment = /* @__PURE__ */ Symbol.for("v-cmt");
const Static = /* @__PURE__ */ Symbol.for("v-stc");
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value, inVOnce = false) {
  isBlockTreeEnabled += value;
  if (value < 0 && currentBlock && inVOnce) {
    currentBlock.hasOnce = true;
  }
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(
    createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      true
    )
  );
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(
    createVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      true
    )
  );
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({
  ref: ref3,
  ref_key,
  ref_for
}) => {
  if (typeof ref3 === "number") {
    ref3 = "" + ref3;
  }
  return ref3 != null ? isString(ref3) || /* @__PURE__ */ isRef(ref3) || isFunction(ref3) ? { i: currentRenderingInstance, r: ref3, k: ref_key, f: !!ref_for } : ref3 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
  !isBlockNode && // has current parent block
  currentBlock && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(
      type,
      props,
      true
      /* mergeRef: true */
    );
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag = -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject(style)) {
      if (/* @__PURE__ */ isProxy(style) && !isArray(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true
  );
}
function guardReactiveProps(props) {
  if (!props) return null;
  return /* @__PURE__ */ isProxy(props) || isInternalObject(props) ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
  const { props, ref: ref3, patchFlag, children, transition } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      mergeRef && ref3 ? isArray(ref3) ? ref3.concat(normalizeRef(extraProps)) : [ref3, normalizeRef(extraProps)] : normalizeRef(extraProps)
    ) : ref3,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetStart: vnode.targetStart,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    placeholder: vnode.placeholder,
    el: vnode.el,
    anchor: vnode.anchor,
    ctx: vnode.ctx,
    ce: vnode.ce
  };
  if (transition && cloneTransition) {
    setTransitionHooks(
      cloned,
      transition.clone(cloned)
    );
  }
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function createStaticVNode(content, numberOfNodes) {
  const vnode = createVNode(Static, null, content);
  vnode.staticCount = numberOfNodes;
  return vnode;
}
function createCommentVNode(text = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray(child)) {
    return createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode
      child.slice()
    );
  } else if (isVNode(child)) {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !isInternalObject(children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        } else if (incoming == null && existing == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !isModelListener(key)) {
          ret[key] = incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    ids: parent ? parent.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let setInSSRSetupState;
{
  const g = getGlobalThis();
  const registerGlobalSetter = (key, setter) => {
    let setters;
    if (!(setters = g[key])) setters = g[key] = [];
    setters.push(setter);
    return (v) => {
      if (setters.length > 1) setters.forEach((set) => set(v));
      else setters[0](v);
    };
  };
  internalSetCurrentInstance = registerGlobalSetter(
    `__VUE_INSTANCE_SETTERS__`,
    (v) => currentInstance = v
  );
  setInSSRSetupState = registerGlobalSetter(
    `__VUE_SSR_SETTERS__`,
    (v) => isInSSRComponentSetup = v
  );
}
const setCurrentInstance = (instance) => {
  const prev = currentInstance;
  internalSetCurrentInstance(instance);
  instance.scope.on();
  return () => {
    instance.scope.off();
    internalSetCurrentInstance(prev);
  };
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false, optimized = false) {
  isSSR && setInSSRSetupState(isSSR);
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children, optimized || isSSR);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isSSR && setInSSRSetupState(false);
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
  const { setup } = Component;
  if (setup) {
    pauseTracking();
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    const reset = setCurrentInstance(instance);
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [
        instance.props,
        setupContext
      ]
    );
    const isAsyncSetup = isPromise(setupResult);
    resetTracking();
    reset();
    if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) {
      markAsyncBoundary(instance);
    }
    if (isAsyncSetup) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult);
        }).catch((e) => {
          handleError(e, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult);
    }
  } else {
    finishComponentSetup(instance);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else ;
  finishComponentSetup(instance);
}
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    instance.render = Component.render || NOOP;
  }
  {
    const reset = setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions(instance);
    } finally {
      resetTracking();
      reset();
    }
  }
}
const attrsProxyHandlers = {
  get(target, key) {
    track(target, "get", "");
    return target[key];
  }
};
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  {
    return {
      attrs: new Proxy(instance.attrs, attrsProxyHandlers),
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getComponentPublicInstance(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  } else {
    return instance.proxy;
  }
}
const classifyRE = /(?:^|[-_])\w/g;
const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component, includeInferred = true) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function formatComponentName(instance, Component, isRoot = false) {
  let name = getComponentName(Component);
  if (!name && Component.__file) {
    const match = Component.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component) {
          return key;
        }
      }
    };
    name = inferFromRegistry(instance.components) || instance.parent && inferFromRegistry(
      instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  const c = /* @__PURE__ */ computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  return c;
};
const version = "3.5.32";
/**
* @vue/runtime-dom v3.5.32
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let policy = void 0;
const tt = typeof window !== "undefined" && window.trustedTypes;
if (tt) {
  try {
    policy = /* @__PURE__ */ tt.createPolicy("vue", {
      createHTML: (val) => val
    });
  } catch (e) {
  }
}
const unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
const svgNS = "http://www.w3.org/2000/svg";
const mathmlNS = "http://www.w3.org/1998/Math/MathML";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, namespace, is, props) => {
    const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el, text) => {
    el.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(content, parent, anchor, namespace, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling)) break;
      }
    } else {
      templateContainer.innerHTML = unsafeToTrustedHTML(
        namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content
      );
      const template = templateContainer.content;
      if (namespace === "svg" || namespace === "mathml") {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      // first
      before ? before.nextSibling : parent.firstChild,
      // last
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
const vtcKey = /* @__PURE__ */ Symbol("_vtc");
function patchClass(el, value, isSVG) {
  const transitionClasses = el[vtcKey];
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
const vShowOriginalDisplay = /* @__PURE__ */ Symbol("_vod");
const vShowHidden = /* @__PURE__ */ Symbol("_vsh");
const CSS_VAR_TEXT = /* @__PURE__ */ Symbol("");
const displayRE = /(?:^|;)\s*display\s*:/;
function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = isString(next);
  let hasControlledDisplay = false;
  if (next && !isCssString) {
    if (prev) {
      if (!isString(prev)) {
        for (const key in prev) {
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      } else {
        for (const prevStyle of prev.split(";")) {
          const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      }
    }
    for (const key in next) {
      if (key === "display") {
        hasControlledDisplay = true;
      }
      setStyle(style, key, next[key]);
    }
  } else {
    if (isCssString) {
      if (prev !== next) {
        const cssVarText = style[CSS_VAR_TEXT];
        if (cssVarText) {
          next += ";" + cssVarText;
        }
        style.cssText = next;
        hasControlledDisplay = displayRE.test(next);
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
  }
  if (vShowOriginalDisplay in el) {
    el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
    if (el[vShowHidden]) {
      style.display = "none";
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (val == null) val = "";
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(
          hyphenate(prefixed),
          val.replace(importantRE, ""),
          "important"
        );
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance, isBoolean = isSpecialBooleanAttr(key)) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (value == null || isBoolean && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(
        key,
        isBoolean ? "" : isSymbol(value) ? String(value) : value
      );
    }
  }
}
function patchDOMProp(el, key, value, parentComponent, attrName) {
  if (key === "innerHTML" || key === "textContent") {
    if (value != null) {
      el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value) : value;
    }
    return;
  }
  const tag = el.tagName;
  if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
  !tag.includes("-")) {
    const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
    const newValue = value == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      el.type === "checkbox" ? "on" : ""
    ) : String(value);
    if (oldValue !== newValue || !("_value" in el)) {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    el._value = value;
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e) {
  }
  needRemove && el.removeAttribute(attrName || key);
}
function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}
const veiKey = /* @__PURE__ */ Symbol("_vei");
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el[veiKey] || (el[veiKey] = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(
        nextValue,
        instance
      );
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event, options];
}
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    if (!e._vts) {
      e._vts = Date.now();
    } else if (e._vts <= invoker.attached) {
      return;
    }
    callWithAsyncErrorHandling(
      patchStopImmediatePropagation(e, invoker.value),
      instance,
      5,
      [e]
    );
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map(
      (fn) => (e2) => !e2._stopped && fn && fn(e2)
    );
  } else {
    return value;
  }
}
const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
const patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
  const isSVG = namespace === "svg";
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(el, key, nextValue);
    if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) {
      patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
    }
  } else if (
    // #11081 force set props for possible async custom element
    el._isVueCE && // #12408 check if it's declared prop or it's async custom element
    (shouldSetAsPropForVueCE(el, key) || // @ts-expect-error _def is private
    el._def.__asyncLoader && (/[A-Z]/.test(key) || !isString(nextValue)))
  ) {
    patchDOMProp(el, camelize(key), nextValue, parentComponent, key);
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && isNativeOn(key) && isFunction(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate" || key === "autocorrect") {
    return false;
  }
  if (key === "sandbox" && el.tagName === "IFRAME") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (key === "width" || key === "height") {
    const tag = el.tagName;
    if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
      return false;
    }
  }
  if (isNativeOn(key) && isString(value)) {
    return false;
  }
  return key in el;
}
function shouldSetAsPropForVueCE(el, key) {
  const props = (
    // @ts-expect-error _def is private
    el._def.props
  );
  if (!props) {
    return false;
  }
  const camelKey = camelize(key);
  return Array.isArray(props) ? props.some((prop) => camelize(prop) === camelKey) : Object.keys(props).some((prop) => camelize(prop) === camelKey);
}
const getModelAssigner = (vnode) => {
  const fn = vnode.props["onUpdate:modelValue"] || false;
  return isArray(fn) ? (value) => invokeArrayFns(fn, value) : fn;
};
function onCompositionStart(e) {
  e.target.composing = true;
}
function onCompositionEnd(e) {
  const target = e.target;
  if (target.composing) {
    target.composing = false;
    target.dispatchEvent(new Event("input"));
  }
}
const assignKey = /* @__PURE__ */ Symbol("_assign");
function castValue(value, trim, number) {
  if (trim) value = value.trim();
  if (number) value = looseToNumber(value);
  return value;
}
const vModelText = {
  created(el, { modifiers: { lazy, trim, number } }, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    const castToNumber = number || vnode.props && vnode.props.type === "number";
    addEventListener(el, lazy ? "change" : "input", (e) => {
      if (e.target.composing) return;
      el[assignKey](castValue(el.value, trim, castToNumber));
    });
    if (trim || castToNumber) {
      addEventListener(el, "change", () => {
        el.value = castValue(el.value, trim, castToNumber);
      });
    }
    if (!lazy) {
      addEventListener(el, "compositionstart", onCompositionStart);
      addEventListener(el, "compositionend", onCompositionEnd);
      addEventListener(el, "change", onCompositionEnd);
    }
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(el, { value }) {
    el.value = value == null ? "" : value;
  },
  beforeUpdate(el, { value, oldValue, modifiers: { lazy, trim, number } }, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    if (el.composing) return;
    const elValue = (number || el.type === "number") && !/^0\d/.test(el.value) ? looseToNumber(el.value) : el.value;
    const newValue = value == null ? "" : value;
    if (elValue === newValue) {
      return;
    }
    const rootNode = el.getRootNode();
    if ((rootNode instanceof Document || rootNode instanceof ShadowRoot) && rootNode.activeElement === el && el.type !== "range") {
      if (lazy && value === oldValue) {
        return;
      }
      if (trim && el.value.trim() === newValue) {
        return;
      }
    }
    el.value = newValue;
  }
};
const vModelCheckbox = {
  // #4096 array checkboxes need to be deep traversed
  deep: true,
  created(el, _, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    addEventListener(el, "change", () => {
      const modelValue = el._modelValue;
      const elementValue = getValue(el);
      const checked = el.checked;
      const assign = el[assignKey];
      if (isArray(modelValue)) {
        const index = looseIndexOf(modelValue, elementValue);
        const found = index !== -1;
        if (checked && !found) {
          assign(modelValue.concat(elementValue));
        } else if (!checked && found) {
          const filtered = [...modelValue];
          filtered.splice(index, 1);
          assign(filtered);
        }
      } else if (isSet(modelValue)) {
        const cloned = new Set(modelValue);
        if (checked) {
          cloned.add(elementValue);
        } else {
          cloned.delete(elementValue);
        }
        assign(cloned);
      } else {
        assign(getCheckboxValue(el, checked));
      }
    });
  },
  // set initial checked on mount to wait for true-value/false-value
  mounted: setChecked,
  beforeUpdate(el, binding, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    setChecked(el, binding, vnode);
  }
};
function setChecked(el, { value, oldValue }, vnode) {
  el._modelValue = value;
  let checked;
  if (isArray(value)) {
    checked = looseIndexOf(value, vnode.props.value) > -1;
  } else if (isSet(value)) {
    checked = value.has(vnode.props.value);
  } else {
    if (value === oldValue) return;
    checked = looseEqual(value, getCheckboxValue(el, true));
  }
  if (el.checked !== checked) {
    el.checked = checked;
  }
}
const vModelRadio = {
  created(el, { value }, vnode) {
    el.checked = looseEqual(value, vnode.props.value);
    el[assignKey] = getModelAssigner(vnode);
    addEventListener(el, "change", () => {
      el[assignKey](getValue(el));
    });
  },
  beforeUpdate(el, { value, oldValue }, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    if (value !== oldValue) {
      el.checked = looseEqual(value, vnode.props.value);
    }
  }
};
const vModelSelect = {
  // <select multiple> value need to be deep traversed
  deep: true,
  created(el, { value, modifiers: { number } }, vnode) {
    const isSetModel = isSet(value);
    addEventListener(el, "change", () => {
      const selectedVal = Array.prototype.filter.call(el.options, (o) => o.selected).map(
        (o) => number ? looseToNumber(getValue(o)) : getValue(o)
      );
      el[assignKey](
        el.multiple ? isSetModel ? new Set(selectedVal) : selectedVal : selectedVal[0]
      );
      el._assigning = true;
      nextTick(() => {
        el._assigning = false;
      });
    });
    el[assignKey] = getModelAssigner(vnode);
  },
  // set value in mounted & updated because <select> relies on its children
  // <option>s.
  mounted(el, { value }) {
    setSelected(el, value);
  },
  beforeUpdate(el, _binding, vnode) {
    el[assignKey] = getModelAssigner(vnode);
  },
  updated(el, { value }) {
    if (!el._assigning) {
      setSelected(el, value);
    }
  }
};
function setSelected(el, value) {
  const isMultiple = el.multiple;
  const isArrayValue = isArray(value);
  if (isMultiple && !isArrayValue && !isSet(value)) {
    return;
  }
  for (let i = 0, l = el.options.length; i < l; i++) {
    const option = el.options[i];
    const optionValue = getValue(option);
    if (isMultiple) {
      if (isArrayValue) {
        const optionType = typeof optionValue;
        if (optionType === "string" || optionType === "number") {
          option.selected = value.some((v) => String(v) === String(optionValue));
        } else {
          option.selected = looseIndexOf(value, optionValue) > -1;
        }
      } else {
        option.selected = value.has(optionValue);
      }
    } else if (looseEqual(getValue(option), value)) {
      if (el.selectedIndex !== i) el.selectedIndex = i;
      return;
    }
  }
  if (!isMultiple && el.selectedIndex !== -1) {
    el.selectedIndex = -1;
  }
}
function getValue(el) {
  return "_value" in el ? el._value : el.value;
}
function getCheckboxValue(el, checked) {
  const key = checked ? "_trueValue" : "_falseValue";
  return key in el ? el[key] : checked;
}
const systemModifiers = ["ctrl", "shift", "alt", "meta"];
const modifierGuards = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
};
const withModifiers = (fn, modifiers) => {
  if (!fn) return fn;
  const cache = fn._withMods || (fn._withMods = {});
  const cacheKey = modifiers.join(".");
  return cache[cacheKey] || (cache[cacheKey] = (event, ...args) => {
    for (let i = 0; i < modifiers.length; i++) {
      const guard = modifierGuards[modifiers[i]];
      if (guard && guard(event, modifiers)) return;
    }
    return fn(event, ...args);
  });
};
const keyNames = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
};
const withKeys = (fn, modifiers) => {
  const cache = fn._withKeys || (fn._withKeys = {});
  const cacheKey = modifiers.join(".");
  return cache[cacheKey] || (cache[cacheKey] = (event) => {
    if (!("key" in event)) {
      return;
    }
    const eventKey = hyphenate(event.key);
    if (modifiers.some(
      (k) => k === eventKey || keyNames[k] === eventKey
    )) {
      return fn(event);
    }
  });
};
const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const createApp = (...args) => {
  const app = ensureRenderer().createApp(...args);
  const { mount } = app;
  app.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container) return;
    const component = app._component;
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    if (container.nodeType === 1) {
      container.textContent = "";
    }
    const proxy = mount(container, false, resolveRootNamespace(container));
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app;
};
function resolveRootNamespace(container) {
  if (container instanceof SVGElement) {
    return "svg";
  }
  if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
    return "mathml";
  }
}
function normalizeContainer(container) {
  if (isString(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
const _imports_0 = "" + new URL("../qrcode/476d247a7f3a7ac35e70d25ef915e6e.jpg", import.meta.url).href;
const _imports_1 = "" + new URL("../qrcode/c3acf471c8be6977b8af49c7bcfc359.jpg", import.meta.url).href;
const _hoisted_1$7 = { class: "card credentials-card" };
const _hoisted_2$7 = { class: "card-header" };
const _hoisted_3$7 = { class: "credential-row" };
const _hoisted_4$7 = { class: "credential-value" };
const _hoisted_5$6 = { class: "credential-row" };
const _hoisted_6$6 = ["title"];
const _hoisted_7$6 = ["disabled"];
const _hoisted_8$6 = ["disabled"];
const _hoisted_9$6 = { class: "credential-row" };
const _hoisted_10$6 = ["disabled"];
const _hoisted_11$5 = { class: "card" };
const _hoisted_12$5 = { class: "card-content" };
const _hoisted_13$5 = ["onClick", "onContextmenu"];
const _hoisted_14$5 = { class: "shortcut-icon" };
const _hoisted_15$5 = { class: "shortcut-name" };
const _hoisted_16$5 = { class: "shortcut-path" };
const _hoisted_17$5 = ["onClick", "onContextmenu"];
const _hoisted_18$5 = { class: "shortcut-icon" };
const _hoisted_19$5 = { class: "shortcut-name" };
const _hoisted_20$5 = { class: "shortcut-path" };
const _hoisted_21$5 = { class: "card" };
const _hoisted_22$5 = { class: "card-content" };
const _hoisted_23$5 = ["onClick"];
const _hoisted_24$5 = { class: "shortcut-icon" };
const _hoisted_25$5 = { class: "shortcut-name" };
const _hoisted_26$5 = {
  key: 0,
  class: "shortcut-path"
};
const _hoisted_27$5 = {
  key: 1,
  class: "shortcut-path"
};
const _hoisted_28$5 = { class: "card" };
const _hoisted_29$5 = { class: "services-grid" };
const _hoisted_30$5 = ["onContextmenu"];
const _hoisted_31$4 = { class: "service-status" };
const _hoisted_32$3 = { class: "service-icon" };
const _hoisted_33$3 = { class: "service-name" };
const _hoisted_34$3 = { class: "service-actions" };
const _hoisted_35$3 = ["onClick"];
const _hoisted_36$3 = ["onClick"];
const _hoisted_37$3 = {
  key: 0,
  class: "section-title"
};
const _hoisted_38$3 = {
  key: 1,
  class: "services-grid"
};
const _hoisted_39$3 = ["onContextmenu"];
const _hoisted_40$3 = { class: "service-status" };
const _hoisted_41$3 = { class: "service-icon" };
const _hoisted_42$3 = { class: "service-name" };
const _hoisted_43$3 = { class: "service-actions" };
const _hoisted_44$3 = ["onClick"];
const _hoisted_45$3 = ["onClick"];
const _hoisted_46$3 = {
  key: 2,
  class: "section-title"
};
const _hoisted_47$3 = { class: "bottom-bar" };
const _hoisted_48$3 = { class: "modal-header" };
const _hoisted_49$3 = { class: "modal-body" };
const _hoisted_50$2 = { class: "form-group" };
const _hoisted_51$1 = { class: "form-group" };
const _hoisted_52$1 = { class: "modal-footer" };
const _hoisted_53$1 = { class: "modal-header" };
const _hoisted_54$1 = { class: "modal-body" };
const _hoisted_55$1 = { class: "confirm-message" };
const _hoisted_56$1 = { class: "modal-footer" };
const _hoisted_57$1 = {
  key: 4,
  class: "modal-overlay"
};
const _hoisted_58$1 = { class: "modal install-modal" };
const _hoisted_59$1 = { class: "modal-body" };
const _hoisted_60 = { class: "install-progress" };
const _hoisted_61 = { class: "progress-stage" };
const _hoisted_62 = { class: "progress-bar-container" };
const _hoisted_63 = { class: "progress-percentage" };
const _hoisted_64 = { class: "modal-header" };
const _hoisted_65 = { class: "modal-body" };
const _hoisted_66 = { class: "form-group" };
const _hoisted_67 = { class: "icon-picker" };
const _hoisted_68 = { class: "icon-preview" };
const _hoisted_69 = { class: "form-group" };
const _hoisted_70 = { class: "form-group" };
const _hoisted_71 = { class: "input-with-btn" };
const _hoisted_72 = { class: "modal-footer" };
const _hoisted_73 = { class: "modal-header" };
const _hoisted_74 = { class: "modal-body" };
const _hoisted_75 = { class: "form-group" };
const _hoisted_76 = { class: "icon-picker" };
const _hoisted_77 = { class: "icon-preview" };
const _hoisted_78 = { class: "form-group" };
const _hoisted_79 = { class: "form-group" };
const _hoisted_80 = { class: "input-with-btn" };
const _hoisted_81 = {
  key: 0,
  class: "error-message"
};
const _hoisted_82 = { class: "modal-footer" };
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "HomePage",
  setup(__props) {
    const config = /* @__PURE__ */ ref({
      gatewayUrl: "http://localhost:18789",
      token: "",
      password: ""
    });
    const editingCredential = /* @__PURE__ */ ref(null);
    const editingValue = /* @__PURE__ */ ref("");
    const codingPlanConfig = /* @__PURE__ */ ref({
      apiKey: "",
      baseUrl: ""
    });
    const openclawPaths = /* @__PURE__ */ ref({
      main: null,
      config: "",
      skills: "",
      agents: "",
      workspace: "",
      dotOpenclaw: ""
    });
    const openclawInstallModal = /* @__PURE__ */ ref({
      show: false,
      progress: 0,
      stage: "",
      message: ""
    });
    const confirmDialog = /* @__PURE__ */ ref({
      show: false,
      title: "",
      message: "",
      onConfirm: null
    });
    const customFolders = /* @__PURE__ */ ref([]);
    const contextMenu = /* @__PURE__ */ ref({
      show: false,
      x: 0,
      y: 0,
      target: null
    });
    const codingPlanModal = /* @__PURE__ */ ref({
      show: false,
      apiKey: "",
      baseUrl: ""
    });
    const donateModal = /* @__PURE__ */ ref({
      show: false
    });
    const addServiceModal = /* @__PURE__ */ ref({
      show: false,
      name: "",
      exePath: "",
      icon: "🔧",
      iconPath: ""
    });
    const addFolderModal = /* @__PURE__ */ ref({
      show: false,
      name: "",
      path: "",
      icon: "📁",
      iconPath: "",
      error: ""
      // 添加错误提示
    });
    const services = /* @__PURE__ */ ref([]);
    const localServices = /* @__PURE__ */ ref([]);
    const commonLinks = /* @__PURE__ */ ref([
      { id: "dashboard", icon: "📊", name: "Dashboard", type: "url", url: "http://localhost:18789/dashboard" },
      { id: "onboard", icon: "🚀", name: "安装向导", type: "url", url: "http://localhost:18789/onboard/chat?session=agent%3Amain%3Amain" },
      { id: "docs", icon: "📖", name: "官方文档", type: "url", url: "https://docs.openclaw.ai" },
      { id: "clawhub", icon: "🛒", name: "ClawHub", type: "url", url: "https://clawhub.ai" },
      { id: "codingplan", icon: "💳", name: "CodingPlan", type: "codingplan", url: "" },
      { id: "feishu", icon: "📮", name: "飞书开放平台", type: "url", url: "https://open.feishu.cn/app" }
    ]);
    const showPassword = /* @__PURE__ */ ref(false);
    const copiedField = /* @__PURE__ */ ref(null);
    const isFetchingToken = /* @__PURE__ */ ref(false);
    onMounted(async () => {
      console.log("HomePage 组件已挂载");
      console.log("window.api:", window.api);
      try {
        console.log("Loading config...");
        await loadConfig();
        console.log("Config loaded");
        console.log("Loading OpenClaw paths...");
        await loadOpenClawPaths();
        console.log("OpenClaw paths loaded");
        console.log("Loading custom folders...");
        await loadCustomFolders();
        console.log("Custom folders loaded");
        console.log("Loading services...");
        await loadServices();
        console.log("Services loaded");
        console.log("Loading CodingPlan config...");
        await loadCodingPlanConfig();
        console.log("CodingPlan config loaded");
        startStatusMonitor();
        console.log("Status monitor started");
      } catch (e) {
        console.error("Failed to load HomePage data:", e);
      }
      document.addEventListener("click", closeContextMenu);
    });
    onUnmounted(() => {
      document.removeEventListener("click", closeContextMenu);
      if (statusInterval) {
        clearInterval(statusInterval);
      }
    });
    async function loadConfig() {
      try {
        const savedConfig = await window.api.getConfig();
        config.value = savedConfig;
        const detected = await window.api.detectOpenClaw();
        if (detected.token) {
          config.value.token = detected.token;
        }
      } catch (e) {
        console.error("加载配置失败:", e);
      }
    }
    async function loadCodingPlanConfig() {
      try {
        const saved = await window.api.getCodingPlanConfig();
        codingPlanConfig.value = saved;
        codingPlanModal.value.apiKey = saved.apiKey;
        codingPlanModal.value.baseUrl = saved.baseUrl;
      } catch (e) {
        console.error("加载 CodingPlan 配置失败:", e);
      }
    }
    async function saveCodingPlan() {
      try {
        await window.api.saveCodingPlanConfig({
          apiKey: codingPlanModal.value.apiKey,
          baseUrl: codingPlanModal.value.baseUrl
        });
        codingPlanConfig.value = { ...codingPlanModal.value };
        codingPlanModal.value.show = false;
      } catch (e) {
        console.error("保存 CodingPlan 配置失败:", e);
      }
    }
    async function loadOpenClawPaths() {
      try {
        openclawPaths.value = await window.api.getOpenClawPaths();
      } catch (e) {
        console.error("加载路径失败:", e);
      }
    }
    async function loadCustomFolders() {
      try {
        const folders = await window.api.getCustomFolders();
        customFolders.value = folders.map((f) => ({
          ...f,
          icon: f.icon || "📁"
        }));
      } catch (e) {
        console.error("加载自定义文件夹失败:", e);
      }
    }
    async function loadServices() {
      try {
        const savedServices = await window.api.getServices();
        services.value = [
          {
            id: "gateway",
            name: "OpenClaw Gateway",
            icon: "🦞",
            type: "system",
            exePath: "",
            status: "stopped"
          }
        ];
        if (savedServices.length > 0) {
          localServices.value = savedServices;
        }
        await checkAllServicesStatus();
      } catch (e) {
        console.error("加载服务失败:", e);
      }
    }
    async function checkAllServicesStatus() {
      for (const service of localServices.value) {
        try {
          const status = await window.api.checkServiceStatus(service.exePath.split("\\").pop() || service.name);
          service.status = status;
        } catch {
          service.status = "not_found";
        }
      }
      try {
        const result = await window.api.checkServiceStatus("openclaw.exe");
        services.value[0].status = result;
      } catch {
        services.value[0].status = "not_found";
      }
    }
    let statusInterval = null;
    function startStatusMonitor() {
      statusInterval = window.setInterval(checkAllServicesStatus, 5e3);
    }
    async function openFolder(path) {
      if (path) {
        await window.api.openFolder(path);
      }
    }
    async function openLink(link) {
      if (link.type === "codingplan") {
        codingPlanModal.value.apiKey = codingPlanConfig.value.apiKey;
        codingPlanModal.value.baseUrl = codingPlanConfig.value.baseUrl;
        codingPlanModal.value.show = true;
      } else if (link.id === "onboard") {
        await handleOnboard();
      } else {
        await window.api.openUrl(link.url);
      }
    }
    async function handleOnboard() {
      const result = await window.api.detectOpenClaw();
      if (result.path) {
        confirmDialog.value = {
          show: true,
          title: "打开安装向导",
          message: "检测到 OpenClaw 已安装目录，是否打开安装向导？",
          onConfirm: () => {
            confirmDialog.value.show = false;
            window.api.openUrl("http://localhost:18789/onboard/chat?session=agent%3Amain%3Amain");
          }
        };
      } else {
        confirmDialog.value = {
          show: true,
          title: "安装 OpenClaw",
          message: "检测到本地未安装 OpenClaw，是否现在安装？\n\n安装过程将自动完成以下步骤：\n1. 创建安装目录\n2. 安装 OpenClaw CLI\n3. 初始化配置\n4. 启动 Gateway",
          onConfirm: startOpenClawInstall
        };
      }
    }
    async function startOpenClawInstall() {
      confirmDialog.value.show = false;
      openclawInstallModal.value = {
        show: true,
        progress: 0,
        stage: "preparing",
        message: "准备中..."
      };
      const removeListener = window.api.onOpenClawInstallProgress((data) => {
        openclawInstallModal.value.progress = data.progress;
        openclawInstallModal.value.stage = data.stage;
        openclawInstallModal.value.message = data.message;
      });
      try {
        const result = await window.api.installOpenClaw();
        if (result.success) {
          openclawInstallModal.value.message = "安装完成！正在打开安装向导...";
          openclawInstallModal.value.progress = 100;
          await new Promise((resolve) => setTimeout(resolve, 1500));
          await window.api.openUrl("http://localhost:18789/onboard/chat?session=agent%3Amain%3Amain");
          openclawInstallModal.value.show = false;
        } else {
          openclawInstallModal.value.message = "安装失败: " + (result.error || "未知错误");
        }
      } catch (e) {
        console.error("安装 OpenClaw 失败:", e);
        openclawInstallModal.value.message = "安装失败: " + String(e);
      } finally {
        removeListener();
      }
    }
    function closeConfirmDialog() {
      confirmDialog.value.show = false;
      confirmDialog.value.onConfirm = null;
    }
    async function openTerminal() {
      await window.api.openTerminal();
    }
    async function copyCredential(field, value) {
      await window.api.copyToClipboard(value);
      copiedField.value = field;
      setTimeout(() => {
        copiedField.value = null;
      }, 1500);
    }
    function togglePasswordVisibility() {
      showPassword.value = !showPassword.value;
    }
    function startEditCredential(field, currentValue) {
      editingCredential.value = field;
      editingValue.value = currentValue;
    }
    async function saveEditCredential() {
      if (editingCredential.value) {
        try {
          if (editingCredential.value === "token") {
            config.value.token = editingValue.value;
          } else if (editingCredential.value === "password") {
            config.value.password = editingValue.value;
          } else if (editingCredential.value === "gatewayUrl") {
            config.value.gatewayUrl = editingValue.value;
          }
          await window.api.saveConfig(config.value);
        } catch (e) {
          console.error("保存凭证失败:", e);
        }
        editingCredential.value = null;
        editingValue.value = "";
      }
    }
    function cancelEditCredential() {
      editingCredential.value = null;
      editingValue.value = "";
    }
    function toggleDonateModal() {
      donateModal.value.show = !donateModal.value.show;
    }
    async function refreshToken() {
      isFetchingToken.value = true;
      try {
        const result = await window.api.fetchToken();
        if (result.success && result.token) {
          config.value.token = result.token;
          await window.api.saveConfig(config.value);
        } else if (result.token) {
          config.value.token = result.token;
          await window.api.saveConfig(config.value);
        }
      } catch (e) {
        console.error("获取 Token 失败:", e);
      } finally {
        isFetchingToken.value = false;
      }
    }
    function showContextMenu(event, item, type) {
      event.preventDefault();
      event.stopPropagation();
      contextMenu.value = {
        show: true,
        x: event.clientX,
        y: event.clientY,
        target: { ...item, type }
      };
    }
    function closeContextMenu() {
      contextMenu.value.show = false;
    }
    async function handleContextMenuAction(action) {
      const target = contextMenu.value.target;
      closeContextMenu();
      if (!target) return;
      switch (action) {
        case "open":
          if (target.path) {
            await openFolder(target.path);
          }
          break;
        case "bind":
          await bindNewFolder(target);
          break;
        case "start":
          await startServiceById(target.id);
          break;
        case "stop":
          await stopServiceById(target.id);
          break;
        case "force-stop":
          await window.api.forceStopService();
          services.value[0].status = "stopped";
          break;
        case "delete":
          await deleteLocalService(target.id);
          break;
        case "delete-folder":
          await deleteCustomFolder(target.key);
          break;
      }
    }
    async function bindNewFolder(target) {
      const path = await window.api.selectFolder();
      if (path) {
        if (target.key && !target.key.startsWith("custom_")) {
          await window.api.bindFolder(target.key, path);
          await loadCustomFolders();
        } else {
          addFolderModal.value.show = true;
          addFolderModal.value.path = path;
        }
      }
    }
    function showAddFolderModal() {
      addFolderModal.value = {
        show: true,
        name: "",
        path: "",
        icon: "📁",
        iconPath: null,
        error: ""
      };
    }
    async function selectFolderPath() {
      const path = await window.api.selectFolder();
      if (path) {
        addFolderModal.value.path = path;
        if (!addFolderModal.value.name) {
          const parts = path.split("\\");
          addFolderModal.value.name = parts[parts.length - 1] || "自定义文件夹";
        }
      }
    }
    async function selectFolderIcon() {
      const path = await window.api.selectImage();
      if (path) {
        addFolderModal.value.iconPath = path;
        if (!addFolderModal.value.name) {
          const parts = path.split("\\");
          addFolderModal.value.name = parts[parts.length - 1] || "自定义文件夹";
        }
      }
    }
    async function confirmAddFolder() {
      console.log("confirmAddFolder 被调用");
      if (!addFolderModal.value.name.trim()) {
        addFolderModal.value.error = "请输入文件夹名称";
        return;
      }
      if (!addFolderModal.value.path.trim()) {
        addFolderModal.value.error = "请选择文件夹路径";
        return;
      }
      const exists = customFolders.value.some(
        (f) => f.name.toLowerCase() === addFolderModal.value.name.toLowerCase()
      );
      if (exists) {
        addFolderModal.value.error = "已存在同名文件夹";
        return;
      }
      try {
        const newFolder = {
          key: `custom_${Date.now()}`,
          name: addFolderModal.value.name.trim(),
          path: addFolderModal.value.path.trim(),
          icon: addFolderModal.value.iconPath ? "📷" : addFolderModal.value.icon
        };
        const folders = JSON.parse(JSON.stringify([...customFolders.value, newFolder]));
        console.log("准备保存文件夹, folders:", JSON.stringify(folders));
        console.log("window.api:", window.api);
        console.log("window.api.saveCustomFolders:", window.api?.saveCustomFolders);
        const result = await window.api.saveCustomFolders(folders);
        console.log("保存结果:", result);
        if (!result || !result.success) {
          addFolderModal.value.error = result?.error || "保存失败，请重试";
          console.error("保存文件夹失败:", result?.error);
          return;
        }
        await loadCustomFolders();
        addFolderModal.value.show = false;
        addFolderModal.value.error = "";
      } catch (e) {
        addFolderModal.value.error = "保存失败，请重试";
        console.error("保存文件夹失败:", e);
      }
    }
    async function deleteCustomFolder(key) {
      const folders = JSON.parse(JSON.stringify(customFolders.value.filter((f) => f.key !== key)));
      await window.api.saveCustomFolders(folders);
      await loadCustomFolders();
    }
    async function startServiceById(id) {
      if (id === "gateway") {
        const success = await window.api.startGateway();
        if (success) {
          setTimeout(() => checkAllServicesStatus(), 2e3);
        }
      }
    }
    async function stopServiceById(id) {
      if (id === "gateway") {
        const success = await window.api.stopGateway();
        if (success) {
          services.value[0].status = "stopped";
        }
      } else {
        const service = localServices.value.find((s) => s.id === id);
        if (service) {
          const exeName = service.exePath.split("\\").pop() || service.name;
          const success = await window.api.stopService(exeName);
          if (success) {
            service.status = "stopped";
          }
        }
      }
    }
    async function startService(service) {
      const success = await window.api.startService({
        id: service.id,
        name: service.name,
        exePath: service.exePath
      });
      if (success) {
        setTimeout(() => checkAllServicesStatus(), 2e3);
      }
    }
    async function stopLocalService(service) {
      const exeName = service.exePath.split("\\").pop() || service.name;
      const success = await window.api.stopService(exeName);
      if (success) {
        service.status = "stopped";
      }
    }
    async function startAllServices() {
      for (const service of localServices.value) {
        if (service.status !== "running") {
          await startService(service);
        }
      }
      await startServiceById("gateway");
      setTimeout(() => checkAllServicesStatus(), 2e3);
    }
    async function stopAllServices() {
      await stopServiceById("gateway");
      for (const service of localServices.value) {
        if (service.status === "running") {
          await stopLocalService(service);
        }
      }
      setTimeout(() => checkAllServicesStatus(), 1e3);
    }
    function showAddServiceModal() {
      addServiceModal.value = {
        show: true,
        name: "",
        exePath: "",
        icon: "🔧",
        iconPath: null
      };
    }
    async function selectServiceFile() {
      const path = await window.api.selectFile([
        { name: "可执行文件", extensions: ["exe", "bat", "cmd"] },
        { name: "所有文件", extensions: ["*"] }
      ]);
      if (path) {
        addServiceModal.value.exePath = path;
        if (!addServiceModal.value.name) {
          const parts = path.split("\\");
          const fileName = parts[parts.length - 1] || "";
          addServiceModal.value.name = fileName.replace(/\.(exe|bat|cmd)$/i, "");
        }
      }
    }
    async function selectServiceIcon() {
      const path = await window.api.selectImage();
      if (path) {
        addServiceModal.value.iconPath = path;
      }
    }
    async function addLocalService() {
      if (!addServiceModal.value.name || !addServiceModal.value.exePath) {
        return;
      }
      const newService = {
        id: `local_${Date.now()}`,
        name: addServiceModal.value.name,
        icon: addServiceModal.value.iconPath ? "📷" : addServiceModal.value.icon,
        iconPath: addServiceModal.value.iconPath,
        exePath: addServiceModal.value.exePath,
        status: "stopped"
      };
      const servicesList = [...localServices.value, newService];
      await window.api.saveServices(servicesList);
      localServices.value = servicesList;
      addServiceModal.value.show = false;
    }
    async function deleteLocalService(id) {
      const servicesList = localServices.value.filter((s) => s.id !== id);
      await window.api.saveServices(servicesList);
      localServices.value = servicesList;
    }
    const displayToken = computed(() => {
      if (!config.value.token) return "";
      return config.value.token.length > 20 ? config.value.token.substring(0, 20) + "..." : config.value.token;
    });
    function getFolderItems() {
      return [
        { key: "main", name: "OpenClaw 文件", icon: "🦞", path: openclawPaths.value.main, description: "主目录" },
        { key: "dotOpenclaw", name: "配置目录", icon: "⚙️", path: openclawPaths.value.dotOpenclaw, description: ".openclaw" },
        { key: "skills", name: "Skills 目录", icon: "🎯", path: openclawPaths.value.skills, description: "skills" },
        { key: "agents", name: "Agents 目录", icon: "🤖", path: openclawPaths.value.agents, description: "agents" },
        { key: "workspace", name: "工作空间", icon: "📂", path: openclawPaths.value.workspace, description: "workspace" },
        { key: "terminal", name: "命令行", icon: "💻", path: "terminal", description: "打开终端" }
      ];
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "home-page",
        onClick: closeContextMenu
      }, [
        createBaseVNode("div", _hoisted_1$7, [
          createBaseVNode("div", _hoisted_2$7, [
            _cache[40] || (_cache[40] = createBaseVNode("div", { class: "card-title" }, [
              createBaseVNode("span", null, "🔑"),
              createBaseVNode("span", null, "凭证信息")
            ], -1)),
            createBaseVNode("button", {
              class: "btn btn-sm btn-secondary",
              onClick: togglePasswordVisibility,
              title: "切换密码显示"
            }, toDisplayString(showPassword.value ? "🙈" : "👁"), 1)
          ]),
          createBaseVNode("div", _hoisted_3$7, [
            _cache[41] || (_cache[41] = createBaseVNode("span", { class: "credential-label" }, "Gateway URL:", -1)),
            editingCredential.value === "gatewayUrl" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              withDirectives(createBaseVNode("input", {
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => editingValue.value = $event),
                class: "credential-input",
                onKeyup: [
                  withKeys(saveEditCredential, ["enter"]),
                  withKeys(cancelEditCredential, ["escape"])
                ]
              }, null, 544), [
                [vModelText, editingValue.value]
              ]),
              createBaseVNode("button", {
                class: "copy-btn success",
                onClick: saveEditCredential
              }, "✓"),
              createBaseVNode("button", {
                class: "copy-btn",
                onClick: cancelEditCredential
              }, "✕")
            ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
              createBaseVNode("span", _hoisted_4$7, toDisplayString(config.value.gatewayUrl), 1),
              createBaseVNode("button", {
                class: "copy-btn",
                onClick: _cache[1] || (_cache[1] = ($event) => startEditCredential("gatewayUrl", config.value.gatewayUrl))
              }, "✏️"),
              createBaseVNode("button", {
                class: normalizeClass(["copy-btn", { copied: copiedField.value === "gatewayUrl" }]),
                onClick: _cache[2] || (_cache[2] = ($event) => copyCredential("gatewayUrl", config.value.gatewayUrl))
              }, toDisplayString(copiedField.value === "gatewayUrl" ? "✓" : "📋"), 3)
            ], 64))
          ]),
          createBaseVNode("div", _hoisted_5$6, [
            _cache[42] || (_cache[42] = createBaseVNode("span", { class: "credential-label" }, "Token:", -1)),
            editingCredential.value === "token" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              withDirectives(createBaseVNode("input", {
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => editingValue.value = $event),
                class: "credential-input",
                onKeyup: [
                  withKeys(saveEditCredential, ["enter"]),
                  withKeys(cancelEditCredential, ["escape"])
                ]
              }, null, 544), [
                [vModelText, editingValue.value]
              ]),
              createBaseVNode("button", {
                class: "copy-btn success",
                onClick: saveEditCredential
              }, "✓"),
              createBaseVNode("button", {
                class: "copy-btn",
                onClick: cancelEditCredential
              }, "✕")
            ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
              createBaseVNode("span", {
                class: "credential-value",
                title: config.value.token
              }, toDisplayString(displayToken.value || "未检测到 Token"), 9, _hoisted_6$6),
              createBaseVNode("button", {
                class: "copy-btn",
                onClick: _cache[4] || (_cache[4] = ($event) => startEditCredential("token", config.value.token))
              }, "✏️"),
              createBaseVNode("button", {
                class: normalizeClass(["copy-btn", { copied: copiedField.value === "token" }]),
                onClick: _cache[5] || (_cache[5] = ($event) => copyCredential("token", config.value.token)),
                disabled: !config.value.token
              }, toDisplayString(copiedField.value === "token" ? "✓" : "📋"), 11, _hoisted_7$6),
              createBaseVNode("button", {
                class: "copy-btn primary",
                disabled: isFetchingToken.value,
                onClick: refreshToken,
                title: "重新获取 Token"
              }, toDisplayString(isFetchingToken.value ? "⏳" : "🔄"), 9, _hoisted_8$6)
            ], 64))
          ]),
          createBaseVNode("div", _hoisted_9$6, [
            _cache[43] || (_cache[43] = createBaseVNode("span", { class: "credential-label" }, "密码:", -1)),
            editingCredential.value === "password" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              withDirectives(createBaseVNode("input", {
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => editingValue.value = $event),
                type: "password",
                class: "credential-input",
                onKeyup: [
                  withKeys(saveEditCredential, ["enter"]),
                  withKeys(cancelEditCredential, ["escape"])
                ]
              }, null, 544), [
                [vModelText, editingValue.value]
              ]),
              createBaseVNode("button", {
                class: "copy-btn success",
                onClick: saveEditCredential
              }, "✓"),
              createBaseVNode("button", {
                class: "copy-btn",
                onClick: cancelEditCredential
              }, "✕")
            ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
              createBaseVNode("span", {
                class: normalizeClass(["credential-value", { masked: !showPassword.value }])
              }, toDisplayString(showPassword.value ? config.value.password || "未设置" : "••••••••"), 3),
              createBaseVNode("button", {
                class: "copy-btn",
                onClick: _cache[7] || (_cache[7] = ($event) => startEditCredential("password", config.value.password))
              }, "✏️"),
              createBaseVNode("button", {
                class: normalizeClass(["copy-btn", { copied: copiedField.value === "password" }]),
                onClick: _cache[8] || (_cache[8] = ($event) => copyCredential("password", config.value.password)),
                disabled: !config.value.password
              }, toDisplayString(copiedField.value === "password" ? "✓" : "📋"), 11, _hoisted_10$6)
            ], 64))
          ])
        ]),
        createBaseVNode("div", _hoisted_11$5, [
          createBaseVNode("div", { class: "card-header" }, [
            _cache[44] || (_cache[44] = createBaseVNode("div", { class: "card-title" }, [
              createBaseVNode("span", null, "📁"),
              createBaseVNode("span", null, "文件夹")
            ], -1)),
            createBaseVNode("button", {
              class: "btn btn-sm btn-primary",
              onClick: showAddFolderModal
            }, " ➕ 添加 ")
          ]),
          createBaseVNode("div", _hoisted_12$5, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(getFolderItems(), (item) => {
              return openBlock(), createElementBlock("div", {
                key: item.key,
                class: normalizeClass(["shortcut-card", { "no-path": !item.path && item.key !== "terminal" }]),
                onClick: ($event) => item.key === "terminal" ? openTerminal() : openFolder(item.path),
                onContextmenu: ($event) => showContextMenu($event, item, "folder")
              }, [
                createBaseVNode("span", _hoisted_14$5, toDisplayString(item.icon), 1),
                createBaseVNode("span", _hoisted_15$5, toDisplayString(item.name), 1),
                createBaseVNode("span", _hoisted_16$5, toDisplayString(item.path || item.description), 1)
              ], 42, _hoisted_13$5);
            }), 128)),
            (openBlock(true), createElementBlock(Fragment, null, renderList(customFolders.value, (folder) => {
              return openBlock(), createElementBlock("div", {
                key: folder.key,
                class: "shortcut-card",
                onClick: ($event) => openFolder(folder.path),
                onContextmenu: ($event) => showContextMenu($event, folder, "folder")
              }, [
                createBaseVNode("span", _hoisted_18$5, toDisplayString(folder.icon), 1),
                createBaseVNode("span", _hoisted_19$5, toDisplayString(folder.name), 1),
                createBaseVNode("span", _hoisted_20$5, toDisplayString(folder.path), 1)
              ], 40, _hoisted_17$5);
            }), 128))
          ])
        ]),
        createBaseVNode("div", _hoisted_21$5, [
          _cache[45] || (_cache[45] = createBaseVNode("div", { class: "card-header" }, [
            createBaseVNode("div", { class: "card-title" }, [
              createBaseVNode("span", null, "⭐"),
              createBaseVNode("span", null, "常用")
            ])
          ], -1)),
          createBaseVNode("div", _hoisted_22$5, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(commonLinks.value, (link) => {
              return openBlock(), createElementBlock("div", {
                key: link.id,
                class: "shortcut-card",
                onClick: ($event) => openLink(link)
              }, [
                createBaseVNode("span", _hoisted_24$5, toDisplayString(link.icon), 1),
                createBaseVNode("span", _hoisted_25$5, toDisplayString(link.name), 1),
                link.type === "url" ? (openBlock(), createElementBlock("span", _hoisted_26$5, toDisplayString(link.url), 1)) : (openBlock(), createElementBlock("span", _hoisted_27$5, "点击配置"))
              ], 8, _hoisted_23$5);
            }), 128))
          ])
        ]),
        createBaseVNode("div", _hoisted_28$5, [
          _cache[49] || (_cache[49] = createBaseVNode("div", { class: "card-header" }, [
            createBaseVNode("div", { class: "card-title" }, [
              createBaseVNode("span", null, "⚡"),
              createBaseVNode("span", null, "服务管理")
            ])
          ], -1)),
          _cache[50] || (_cache[50] = createBaseVNode("div", { class: "section-title" }, "默认服务", -1)),
          createBaseVNode("div", _hoisted_29$5, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(services.value, (service) => {
              return openBlock(), createElementBlock("div", {
                key: service.id,
                class: "service-card shortcut-card",
                onContextmenu: ($event) => showContextMenu($event, service, "service")
              }, [
                createBaseVNode("div", _hoisted_31$4, [
                  createBaseVNode("span", {
                    class: normalizeClass(["status-dot", service.status])
                  }, null, 2),
                  createBaseVNode("span", null, toDisplayString(service.status === "running" ? "运行中" : service.status === "stopped" ? "已停止" : "未找到"), 1)
                ]),
                createBaseVNode("span", _hoisted_32$3, toDisplayString(service.icon), 1),
                createBaseVNode("span", _hoisted_33$3, toDisplayString(service.name), 1),
                _cache[46] || (_cache[46] = createBaseVNode("span", { class: "service-type" }, "系统服务", -1)),
                createBaseVNode("div", _hoisted_34$3, [
                  service.status !== "running" ? (openBlock(), createElementBlock("button", {
                    key: 0,
                    class: "btn btn-sm btn-success",
                    onClick: ($event) => startServiceById(service.id)
                  }, " ▶ 启动 ", 8, _hoisted_35$3)) : (openBlock(), createElementBlock("button", {
                    key: 1,
                    class: "btn btn-sm btn-danger",
                    onClick: ($event) => stopServiceById(service.id)
                  }, " ⏹ 停止 ", 8, _hoisted_36$3))
                ])
              ], 40, _hoisted_30$5);
            }), 128))
          ]),
          localServices.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_37$3, "本地服务")) : createCommentVNode("", true),
          localServices.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_38$3, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(localServices.value, (service) => {
              return openBlock(), createElementBlock("div", {
                key: service.id,
                class: "service-card shortcut-card",
                onContextmenu: ($event) => showContextMenu($event, service, "service")
              }, [
                createBaseVNode("div", _hoisted_40$3, [
                  createBaseVNode("span", {
                    class: normalizeClass(["status-dot", service.status])
                  }, null, 2),
                  createBaseVNode("span", null, toDisplayString(service.status === "running" ? "运行中" : service.status === "stopped" ? "已停止" : "未找到"), 1)
                ]),
                createBaseVNode("span", _hoisted_41$3, toDisplayString(service.icon), 1),
                createBaseVNode("span", _hoisted_42$3, toDisplayString(service.name), 1),
                _cache[47] || (_cache[47] = createBaseVNode("span", { class: "service-type" }, "本地应用", -1)),
                createBaseVNode("div", _hoisted_43$3, [
                  service.status !== "running" ? (openBlock(), createElementBlock("button", {
                    key: 0,
                    class: "btn btn-sm btn-success",
                    onClick: ($event) => startService(service)
                  }, " ▶ 启动 ", 8, _hoisted_44$3)) : (openBlock(), createElementBlock("button", {
                    key: 1,
                    class: "btn btn-sm btn-danger",
                    onClick: ($event) => stopLocalService(service)
                  }, " ⏹ 停止 ", 8, _hoisted_45$3))
                ])
              ], 40, _hoisted_39$3);
            }), 128)),
            createBaseVNode("div", {
              class: "shortcut-card add-card",
              onClick: showAddServiceModal
            }, [..._cache[48] || (_cache[48] = [
              createBaseVNode("span", { class: "shortcut-icon" }, "➕", -1),
              createBaseVNode("span", { class: "shortcut-name" }, "添加服务", -1)
            ])])
          ])) : createCommentVNode("", true),
          localServices.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_46$3, [
            createBaseVNode("button", {
              class: "btn btn-primary btn-sm",
              onClick: showAddServiceModal
            }, " ➕ 添加本地服务 ")
          ])) : createCommentVNode("", true)
        ]),
        createBaseVNode("div", _hoisted_47$3, [
          createBaseVNode("button", {
            class: "btn btn-coffee",
            onClick: withModifiers(toggleDonateModal, ["stop"]),
            title: "☕ 请作者GT喝杯咖啡 - 点击打赏"
          }, [..._cache[51] || (_cache[51] = [
            createBaseVNode("span", { class: "coffee-icon" }, "☕", -1),
            createBaseVNode("span", { class: "coffee-text" }, "请作者GT喝咖啡", -1)
          ])]),
          createBaseVNode("button", {
            class: "btn btn-danger btn-lg",
            onClick: withModifiers(stopAllServices, ["stop"])
          }, " ⏹ 全部停止 "),
          createBaseVNode("button", {
            class: "btn btn-success btn-lg",
            onClick: withModifiers(startAllServices, ["stop"])
          }, " ⚡ 全部启动 ")
        ]),
        donateModal.value.show ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "donate-overlay",
          onClick: toggleDonateModal
        }, [
          createBaseVNode("div", {
            class: "donate-modal",
            onClick: _cache[9] || (_cache[9] = withModifiers(() => {
            }, ["stop"]))
          }, [
            createBaseVNode("div", { class: "donate-header" }, [
              _cache[52] || (_cache[52] = createBaseVNode("h3", null, "☕ 请作者GT喝杯咖啡", -1)),
              createBaseVNode("button", {
                class: "close-btn",
                onClick: toggleDonateModal
              }, "✕")
            ]),
            _cache[53] || (_cache[53] = createStaticVNode('<div class="donate-content" data-v-65bb6780><p class="donate-tip" data-v-65bb6780>您的支持是我最大的动力 💪</p><div class="qrcode-container" data-v-65bb6780><div class="qrcode-item" data-v-65bb6780><span class="qrcode-label" data-v-65bb6780>💚 微信</span><img src="' + _imports_0 + '" alt="微信收款码" class="qrcode-img" data-v-65bb6780></div><div class="qrcode-item" data-v-65bb6780><span class="qrcode-label" data-v-65bb6780>💙 支付宝</span><img src="' + _imports_1 + '" alt="支付宝收款码" class="qrcode-img" data-v-65bb6780></div></div></div>', 1))
          ])
        ])) : createCommentVNode("", true),
        contextMenu.value.show ? (openBlock(), createElementBlock("div", {
          key: 1,
          class: "context-menu",
          style: normalizeStyle({ left: contextMenu.value.x + "px", top: contextMenu.value.y + "px" }),
          onClick: _cache[17] || (_cache[17] = withModifiers(() => {
          }, ["stop"]))
        }, [
          contextMenu.value.target?.type === "folder" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            createBaseVNode("div", {
              class: "context-menu-item",
              onClick: _cache[10] || (_cache[10] = ($event) => handleContextMenuAction("open"))
            }, " 📂 打开 "),
            createBaseVNode("div", {
              class: "context-menu-item",
              onClick: _cache[11] || (_cache[11] = ($event) => handleContextMenuAction("bind"))
            }, " 🔗 绑定/添加文件夹 "),
            contextMenu.value.target?.key?.startsWith("custom_") ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "context-menu-item danger",
              onClick: _cache[12] || (_cache[12] = ($event) => handleContextMenuAction("delete-folder"))
            }, " 🗑 删除 ")) : createCommentVNode("", true)
          ], 64)) : createCommentVNode("", true),
          contextMenu.value.target?.type === "service" ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
            contextMenu.value.target?.status !== "running" ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "context-menu-item",
              onClick: _cache[13] || (_cache[13] = ($event) => handleContextMenuAction("start"))
            }, " ▶ 启动 ")) : createCommentVNode("", true),
            contextMenu.value.target?.status === "running" ? (openBlock(), createElementBlock("div", {
              key: 1,
              class: "context-menu-item",
              onClick: _cache[14] || (_cache[14] = ($event) => handleContextMenuAction("stop"))
            }, " ⏹ 停止 ")) : createCommentVNode("", true),
            contextMenu.value.target?.id === "gateway" && contextMenu.value.target?.status === "running" ? (openBlock(), createElementBlock("div", {
              key: 2,
              class: "context-menu-item danger",
              onClick: _cache[15] || (_cache[15] = ($event) => handleContextMenuAction("force-stop"))
            }, " 💀 强制停止 ")) : createCommentVNode("", true),
            contextMenu.value.target?.id?.startsWith("local_") ? (openBlock(), createElementBlock("div", {
              key: 3,
              class: "context-menu-item danger",
              onClick: _cache[16] || (_cache[16] = ($event) => handleContextMenuAction("delete"))
            }, " 🗑 删除 ")) : createCommentVNode("", true)
          ], 64)) : createCommentVNode("", true)
        ], 4)) : createCommentVNode("", true),
        codingPlanModal.value.show ? (openBlock(), createElementBlock("div", {
          key: 2,
          class: "modal-overlay",
          onClick: _cache[23] || (_cache[23] = ($event) => codingPlanModal.value.show = false)
        }, [
          createBaseVNode("div", {
            class: "modal",
            onClick: _cache[22] || (_cache[22] = withModifiers(() => {
            }, ["stop"]))
          }, [
            createBaseVNode("div", _hoisted_48$3, [
              _cache[54] || (_cache[54] = createBaseVNode("h3", null, "💳 CodingPlan 配置", -1)),
              createBaseVNode("button", {
                class: "close-btn",
                onClick: _cache[18] || (_cache[18] = ($event) => codingPlanModal.value.show = false)
              }, "✕")
            ]),
            createBaseVNode("div", _hoisted_49$3, [
              createBaseVNode("div", _hoisted_50$2, [
                _cache[55] || (_cache[55] = createBaseVNode("label", null, "API Key", -1)),
                withDirectives(createBaseVNode("input", {
                  type: "password",
                  "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => codingPlanModal.value.apiKey = $event),
                  placeholder: "输入 API Key",
                  class: "form-input"
                }, null, 512), [
                  [vModelText, codingPlanModal.value.apiKey]
                ])
              ]),
              createBaseVNode("div", _hoisted_51$1, [
                _cache[56] || (_cache[56] = createBaseVNode("label", null, "Base URL", -1)),
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => codingPlanModal.value.baseUrl = $event),
                  placeholder: "https://api.codingplan.dev",
                  class: "form-input"
                }, null, 512), [
                  [vModelText, codingPlanModal.value.baseUrl]
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_52$1, [
              createBaseVNode("button", {
                class: "btn btn-secondary",
                onClick: _cache[21] || (_cache[21] = ($event) => codingPlanModal.value.show = false)
              }, "取消"),
              createBaseVNode("button", {
                class: "btn btn-primary",
                onClick: saveCodingPlan
              }, "保存")
            ])
          ])
        ])) : createCommentVNode("", true),
        confirmDialog.value.show ? (openBlock(), createElementBlock("div", {
          key: 3,
          class: "modal-overlay",
          onClick: closeConfirmDialog
        }, [
          createBaseVNode("div", {
            class: "modal confirm-modal",
            onClick: _cache[25] || (_cache[25] = withModifiers(() => {
            }, ["stop"]))
          }, [
            createBaseVNode("div", _hoisted_53$1, [
              createBaseVNode("h3", null, "⚠️ " + toDisplayString(confirmDialog.value.title), 1),
              createBaseVNode("button", {
                class: "close-btn",
                onClick: closeConfirmDialog
              }, "✕")
            ]),
            createBaseVNode("div", _hoisted_54$1, [
              createBaseVNode("div", _hoisted_55$1, toDisplayString(confirmDialog.value.message), 1)
            ]),
            createBaseVNode("div", _hoisted_56$1, [
              createBaseVNode("button", {
                class: "btn btn-secondary",
                onClick: closeConfirmDialog
              }, "取消"),
              createBaseVNode("button", {
                class: "btn btn-primary",
                onClick: _cache[24] || (_cache[24] = ($event) => confirmDialog.value.onConfirm?.())
              }, "确定")
            ])
          ])
        ])) : createCommentVNode("", true),
        openclawInstallModal.value.show ? (openBlock(), createElementBlock("div", _hoisted_57$1, [
          createBaseVNode("div", _hoisted_58$1, [
            _cache[57] || (_cache[57] = createBaseVNode("div", { class: "modal-header" }, [
              createBaseVNode("h3", null, "🚀 安装 OpenClaw")
            ], -1)),
            createBaseVNode("div", _hoisted_59$1, [
              createBaseVNode("div", _hoisted_60, [
                createBaseVNode("div", _hoisted_61, toDisplayString(openclawInstallModal.value.message), 1),
                createBaseVNode("div", _hoisted_62, [
                  createBaseVNode("div", {
                    class: "progress-bar",
                    style: normalizeStyle({ width: openclawInstallModal.value.progress + "%" })
                  }, null, 4)
                ]),
                createBaseVNode("div", _hoisted_63, toDisplayString(openclawInstallModal.value.progress) + "%", 1)
              ])
            ])
          ])
        ])) : createCommentVNode("", true),
        addServiceModal.value.show ? (openBlock(), createElementBlock("div", {
          key: 5,
          class: "modal-overlay",
          onClick: _cache[32] || (_cache[32] = ($event) => addServiceModal.value.show = false)
        }, [
          createBaseVNode("div", {
            class: "modal",
            onClick: _cache[31] || (_cache[31] = withModifiers(() => {
            }, ["stop"]))
          }, [
            createBaseVNode("div", _hoisted_64, [
              _cache[58] || (_cache[58] = createBaseVNode("h3", null, "➕ 添加本地服务", -1)),
              createBaseVNode("button", {
                class: "close-btn",
                onClick: _cache[26] || (_cache[26] = ($event) => addServiceModal.value.show = false)
              }, "✕")
            ]),
            createBaseVNode("div", _hoisted_65, [
              createBaseVNode("div", _hoisted_66, [
                _cache[59] || (_cache[59] = createBaseVNode("label", null, "图标（点击选择图片）", -1)),
                createBaseVNode("div", _hoisted_67, [
                  createBaseVNode("span", _hoisted_68, toDisplayString(addServiceModal.value.icon), 1),
                  withDirectives(createBaseVNode("input", {
                    type: "text",
                    "onUpdate:modelValue": _cache[27] || (_cache[27] = ($event) => addServiceModal.value.icon = $event),
                    placeholder: "🔧",
                    class: "form-input"
                  }, null, 512), [
                    [vModelText, addServiceModal.value.icon]
                  ]),
                  createBaseVNode("button", {
                    class: "btn btn-secondary",
                    onClick: selectServiceIcon
                  }, "📷 上传")
                ])
              ]),
              createBaseVNode("div", _hoisted_69, [
                _cache[60] || (_cache[60] = createBaseVNode("label", null, "服务名称", -1)),
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  "onUpdate:modelValue": _cache[28] || (_cache[28] = ($event) => addServiceModal.value.name = $event),
                  placeholder: "输入服务名称",
                  class: "form-input"
                }, null, 512), [
                  [vModelText, addServiceModal.value.name]
                ])
              ]),
              createBaseVNode("div", _hoisted_70, [
                _cache[61] || (_cache[61] = createBaseVNode("label", null, "启动文件路径（支持 .exe/.bat）", -1)),
                createBaseVNode("div", _hoisted_71, [
                  withDirectives(createBaseVNode("input", {
                    type: "text",
                    "onUpdate:modelValue": _cache[29] || (_cache[29] = ($event) => addServiceModal.value.exePath = $event),
                    placeholder: "选择或输入路径",
                    class: "form-input"
                  }, null, 512), [
                    [vModelText, addServiceModal.value.exePath]
                  ]),
                  createBaseVNode("button", {
                    class: "btn btn-secondary",
                    onClick: selectServiceFile
                  }, "📂 浏览")
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_72, [
              createBaseVNode("button", {
                class: "btn btn-secondary",
                onClick: _cache[30] || (_cache[30] = ($event) => addServiceModal.value.show = false)
              }, "取消"),
              createBaseVNode("button", {
                class: "btn btn-primary",
                onClick: addLocalService
              }, "添加")
            ])
          ])
        ])) : createCommentVNode("", true),
        addFolderModal.value.show ? (openBlock(), createElementBlock("div", {
          key: 6,
          class: "modal-overlay",
          onClick: _cache[39] || (_cache[39] = ($event) => addFolderModal.value.show = false)
        }, [
          createBaseVNode("div", {
            class: "modal",
            onClick: _cache[38] || (_cache[38] = withModifiers(() => {
            }, ["stop"]))
          }, [
            createBaseVNode("div", _hoisted_73, [
              _cache[62] || (_cache[62] = createBaseVNode("h3", null, "📁 添加文件夹", -1)),
              createBaseVNode("button", {
                class: "close-btn",
                onClick: _cache[33] || (_cache[33] = ($event) => addFolderModal.value.show = false)
              }, "✕")
            ]),
            createBaseVNode("div", _hoisted_74, [
              createBaseVNode("div", _hoisted_75, [
                _cache[63] || (_cache[63] = createBaseVNode("label", null, "图标（点击选择图片）", -1)),
                createBaseVNode("div", _hoisted_76, [
                  createBaseVNode("span", _hoisted_77, toDisplayString(addFolderModal.value.icon), 1),
                  withDirectives(createBaseVNode("input", {
                    type: "text",
                    "onUpdate:modelValue": _cache[34] || (_cache[34] = ($event) => addFolderModal.value.icon = $event),
                    placeholder: "📁",
                    class: "form-input"
                  }, null, 512), [
                    [vModelText, addFolderModal.value.icon]
                  ]),
                  createBaseVNode("button", {
                    class: "btn btn-secondary",
                    onClick: selectFolderIcon
                  }, "📷 上传")
                ])
              ]),
              createBaseVNode("div", _hoisted_78, [
                _cache[64] || (_cache[64] = createBaseVNode("label", null, "文件夹名称", -1)),
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  "onUpdate:modelValue": _cache[35] || (_cache[35] = ($event) => addFolderModal.value.name = $event),
                  placeholder: "输入文件夹名称",
                  class: "form-input"
                }, null, 512), [
                  [vModelText, addFolderModal.value.name]
                ])
              ]),
              createBaseVNode("div", _hoisted_79, [
                _cache[65] || (_cache[65] = createBaseVNode("label", null, "文件夹路径", -1)),
                createBaseVNode("div", _hoisted_80, [
                  withDirectives(createBaseVNode("input", {
                    type: "text",
                    "onUpdate:modelValue": _cache[36] || (_cache[36] = ($event) => addFolderModal.value.path = $event),
                    placeholder: "选择文件夹路径",
                    class: "form-input"
                  }, null, 512), [
                    [vModelText, addFolderModal.value.path]
                  ]),
                  createBaseVNode("button", {
                    class: "btn btn-secondary",
                    onClick: selectFolderPath
                  }, "📂 浏览")
                ])
              ]),
              addFolderModal.value.error ? (openBlock(), createElementBlock("div", _hoisted_81, " ⚠️ " + toDisplayString(addFolderModal.value.error), 1)) : createCommentVNode("", true)
            ]),
            createBaseVNode("div", _hoisted_82, [
              createBaseVNode("button", {
                class: "btn btn-secondary",
                onClick: _cache[37] || (_cache[37] = ($event) => addFolderModal.value.show = false)
              }, "取消"),
              createBaseVNode("button", {
                class: "btn btn-primary",
                onClick: confirmAddFolder
              }, "添加")
            ])
          ])
        ])) : createCommentVNode("", true)
      ]);
    };
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const HomePage = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-65bb6780"]]);
const _hoisted_1$6 = { class: "usage-page" };
const _hoisted_2$6 = { class: "card" };
const _hoisted_3$6 = { class: "card-header" };
const _hoisted_4$6 = ["disabled"];
const _hoisted_5$5 = {
  key: 0,
  class: "resources-grid"
};
const _hoisted_6$5 = { class: "resource-item" };
const _hoisted_7$5 = { class: "resource-header" };
const _hoisted_8$5 = { class: "resource-value" };
const _hoisted_9$5 = { class: "progress" };
const _hoisted_10$5 = { class: "resource-detail" };
const _hoisted_11$4 = { class: "resource-item" };
const _hoisted_12$4 = { class: "resource-header" };
const _hoisted_13$4 = { class: "resource-value" };
const _hoisted_14$4 = { class: "progress" };
const _hoisted_15$4 = { class: "resource-detail" };
const _hoisted_16$4 = { class: "resource-header" };
const _hoisted_17$4 = { class: "resource-name" };
const _hoisted_18$4 = { class: "resource-value" };
const _hoisted_19$4 = { class: "progress" };
const _hoisted_20$4 = { class: "resource-detail" };
const _hoisted_21$4 = {
  key: 1,
  class: "loading-state"
};
const _hoisted_22$4 = { class: "card" };
const _hoisted_23$4 = { class: "card-header" };
const _hoisted_24$4 = ["disabled"];
const _hoisted_25$4 = { class: "stats-grid" };
const _hoisted_26$4 = { class: "stat-card" };
const _hoisted_27$4 = { class: "stat-content" };
const _hoisted_28$4 = { class: "stat-value" };
const _hoisted_29$4 = { class: "stat-card" };
const _hoisted_30$4 = { class: "stat-content" };
const _hoisted_31$3 = { class: "stat-value" };
const _hoisted_32$2 = { class: "stat-card" };
const _hoisted_33$2 = { class: "stat-content" };
const _hoisted_34$2 = { class: "stat-value" };
const _hoisted_35$2 = { class: "stat-card" };
const _hoisted_36$2 = { class: "stat-content" };
const _hoisted_37$2 = { class: "stat-value" };
const _hoisted_38$2 = {
  key: 0,
  class: "usage-note"
};
const _hoisted_39$2 = { class: "card" };
const _hoisted_40$2 = { class: "card-header" };
const _hoisted_41$2 = ["disabled"];
const _hoisted_42$2 = {
  key: 0,
  class: "model-list"
};
const _hoisted_43$2 = { class: "model-info" };
const _hoisted_44$2 = { class: "model-name" };
const _hoisted_45$2 = { class: "model-requests" };
const _hoisted_46$2 = { class: "model-bar-container" };
const _hoisted_47$2 = { class: "model-percent" };
const _hoisted_48$2 = {
  key: 1,
  class: "empty-state"
};
const _hoisted_49$2 = { class: "empty-text" };
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "UsagePage",
  setup(__props) {
    const systemInfo = /* @__PURE__ */ ref(null);
    const apiUsage = /* @__PURE__ */ ref({
      today: { requests: 0, tokens: 0 },
      thisWeek: { requests: 0, tokens: 0 },
      thisMonth: { requests: 0, tokens: 0 }
    });
    const apiUsageNote = /* @__PURE__ */ ref("");
    const isLoadingApiUsage = /* @__PURE__ */ ref(false);
    const modelUsage = /* @__PURE__ */ ref([]);
    const modelUsageNote = /* @__PURE__ */ ref("");
    const isLoadingModelUsage = /* @__PURE__ */ ref(false);
    const isRefreshing = /* @__PURE__ */ ref(false);
    let refreshInterval = null;
    onMounted(async () => {
      await loadSystemInfo();
      await loadApiUsage();
      await loadModelUsage();
      startAutoRefresh();
    });
    async function loadSystemInfo() {
      try {
        isRefreshing.value = true;
        const info = await window.api.getSystemInfo();
        if (info) {
          systemInfo.value = info;
        }
      } catch (e) {
        console.error("加载系统信息失败:", e);
      } finally {
        isRefreshing.value = false;
      }
    }
    async function loadApiUsage() {
      try {
        isLoadingApiUsage.value = true;
        const result = await window.api.getApiUsage();
        if (result.success && result.data) {
          apiUsage.value = result.data;
          apiUsageNote.value = result.note || "";
        } else {
          apiUsageNote.value = result.error || "获取失败";
        }
      } catch (e) {
        console.error("加载API使用统计失败:", e);
        apiUsageNote.value = "加载失败";
      } finally {
        isLoadingApiUsage.value = false;
      }
    }
    async function loadModelUsage() {
      try {
        isLoadingModelUsage.value = true;
        const result = await window.api.getModelUsage();
        if (result.success && result.data) {
          modelUsage.value = result.data.models || [];
          modelUsageNote.value = result.note || "";
        } else {
          modelUsageNote.value = result.error || "获取失败";
        }
      } catch (e) {
        console.error("加载模型使用分布失败:", e);
        modelUsageNote.value = "加载失败";
      } finally {
        isLoadingModelUsage.value = false;
      }
    }
    function startAutoRefresh() {
      refreshInterval = window.setInterval(loadSystemInfo, 5e3);
    }
    onUnmounted(() => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    });
    function formatBytes(bytes) {
      if (bytes === 0) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB", "GB", "TB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    }
    function formatNumber(num) {
      return num.toLocaleString();
    }
    function getProgressClass(usage) {
      if (usage < 50) return "low";
      if (usage < 80) return "medium";
      return "high";
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$6, [
        _cache[19] || (_cache[19] = createBaseVNode("h2", { class: "page-title" }, "📊 使用情况", -1)),
        createBaseVNode("div", _hoisted_2$6, [
          createBaseVNode("div", _hoisted_3$6, [
            _cache[0] || (_cache[0] = createBaseVNode("div", { class: "card-title" }, [
              createBaseVNode("span", null, "💻"),
              createBaseVNode("span", null, "本地资源监控")
            ], -1)),
            createBaseVNode("button", {
              class: "btn btn-sm btn-secondary",
              onClick: loadSystemInfo,
              disabled: isRefreshing.value
            }, toDisplayString(isRefreshing.value ? "⏳" : "🔄") + " 刷新 ", 9, _hoisted_4$6)
          ]),
          systemInfo.value ? (openBlock(), createElementBlock("div", _hoisted_5$5, [
            createBaseVNode("div", _hoisted_6$5, [
              createBaseVNode("div", _hoisted_7$5, [
                _cache[1] || (_cache[1] = createBaseVNode("span", { class: "resource-icon" }, "🖥️", -1)),
                _cache[2] || (_cache[2] = createBaseVNode("span", { class: "resource-name" }, "CPU 使用率", -1)),
                createBaseVNode("span", _hoisted_8$5, toDisplayString(systemInfo.value.cpu.usage) + "%", 1)
              ]),
              createBaseVNode("div", _hoisted_9$5, [
                createBaseVNode("div", {
                  class: normalizeClass(["progress-bar", getProgressClass(systemInfo.value.cpu.usage)]),
                  style: normalizeStyle({ width: systemInfo.value.cpu.usage + "%" })
                }, null, 6)
              ]),
              createBaseVNode("div", _hoisted_10$5, toDisplayString(systemInfo.value.cpu.cores) + " 核心", 1)
            ]),
            createBaseVNode("div", _hoisted_11$4, [
              createBaseVNode("div", _hoisted_12$4, [
                _cache[3] || (_cache[3] = createBaseVNode("span", { class: "resource-icon" }, "🧠", -1)),
                _cache[4] || (_cache[4] = createBaseVNode("span", { class: "resource-name" }, "内存使用", -1)),
                createBaseVNode("span", _hoisted_13$4, toDisplayString(systemInfo.value.memory.usage) + "%", 1)
              ]),
              createBaseVNode("div", _hoisted_14$4, [
                createBaseVNode("div", {
                  class: normalizeClass(["progress-bar", getProgressClass(systemInfo.value.memory.usage)]),
                  style: normalizeStyle({ width: systemInfo.value.memory.usage + "%" })
                }, null, 6)
              ]),
              createBaseVNode("div", _hoisted_15$4, toDisplayString(formatBytes(systemInfo.value.memory.used)) + " / " + toDisplayString(formatBytes(systemInfo.value.memory.total)), 1)
            ]),
            (openBlock(true), createElementBlock(Fragment, null, renderList(systemInfo.value.disk, (disk) => {
              return openBlock(), createElementBlock("div", {
                class: "resource-item",
                key: disk.mount
              }, [
                createBaseVNode("div", _hoisted_16$4, [
                  _cache[5] || (_cache[5] = createBaseVNode("span", { class: "resource-icon" }, "💾", -1)),
                  createBaseVNode("span", _hoisted_17$4, "磁盘 " + toDisplayString(disk.mount), 1),
                  createBaseVNode("span", _hoisted_18$4, toDisplayString(disk.usage) + "%", 1)
                ]),
                createBaseVNode("div", _hoisted_19$4, [
                  createBaseVNode("div", {
                    class: normalizeClass(["progress-bar", getProgressClass(disk.usage)]),
                    style: normalizeStyle({ width: disk.usage + "%" })
                  }, null, 6)
                ]),
                createBaseVNode("div", _hoisted_20$4, toDisplayString(formatBytes(disk.used)) + " / " + toDisplayString(formatBytes(disk.total)), 1)
              ]);
            }), 128))
          ])) : (openBlock(), createElementBlock("div", _hoisted_21$4, [..._cache[6] || (_cache[6] = [
            createBaseVNode("span", null, "⏳ 加载中...", -1)
          ])]))
        ]),
        createBaseVNode("div", _hoisted_22$4, [
          createBaseVNode("div", _hoisted_23$4, [
            _cache[7] || (_cache[7] = createBaseVNode("div", { class: "card-title" }, [
              createBaseVNode("span", null, "🌐"),
              createBaseVNode("span", null, "API 使用统计")
            ], -1)),
            createBaseVNode("button", {
              class: "btn btn-sm btn-primary",
              onClick: loadApiUsage,
              disabled: isLoadingApiUsage.value
            }, toDisplayString(isLoadingApiUsage.value ? "⏳" : "📥") + " 从 Gateway 获取 ", 9, _hoisted_24$4)
          ]),
          createBaseVNode("div", _hoisted_25$4, [
            createBaseVNode("div", _hoisted_26$4, [
              _cache[9] || (_cache[9] = createBaseVNode("div", { class: "stat-icon" }, "📅", -1)),
              createBaseVNode("div", _hoisted_27$4, [
                _cache[8] || (_cache[8] = createBaseVNode("div", { class: "stat-label" }, "今日请求", -1)),
                createBaseVNode("div", _hoisted_28$4, toDisplayString(formatNumber(apiUsage.value.today.requests)), 1)
              ])
            ]),
            createBaseVNode("div", _hoisted_29$4, [
              _cache[11] || (_cache[11] = createBaseVNode("div", { class: "stat-icon" }, "💬", -1)),
              createBaseVNode("div", _hoisted_30$4, [
                _cache[10] || (_cache[10] = createBaseVNode("div", { class: "stat-label" }, "今日 Token", -1)),
                createBaseVNode("div", _hoisted_31$3, toDisplayString(formatNumber(apiUsage.value.today.tokens)), 1)
              ])
            ]),
            createBaseVNode("div", _hoisted_32$2, [
              _cache[13] || (_cache[13] = createBaseVNode("div", { class: "stat-icon" }, "📆", -1)),
              createBaseVNode("div", _hoisted_33$2, [
                _cache[12] || (_cache[12] = createBaseVNode("div", { class: "stat-label" }, "本周请求", -1)),
                createBaseVNode("div", _hoisted_34$2, toDisplayString(formatNumber(apiUsage.value.thisWeek.requests)), 1)
              ])
            ]),
            createBaseVNode("div", _hoisted_35$2, [
              _cache[15] || (_cache[15] = createBaseVNode("div", { class: "stat-icon" }, "🗓️", -1)),
              createBaseVNode("div", _hoisted_36$2, [
                _cache[14] || (_cache[14] = createBaseVNode("div", { class: "stat-label" }, "本月请求", -1)),
                createBaseVNode("div", _hoisted_37$2, toDisplayString(formatNumber(apiUsage.value.thisMonth.requests)), 1)
              ])
            ])
          ]),
          apiUsageNote.value ? (openBlock(), createElementBlock("div", _hoisted_38$2, [
            createBaseVNode("span", null, "💡 " + toDisplayString(apiUsageNote.value), 1)
          ])) : createCommentVNode("", true)
        ]),
        createBaseVNode("div", _hoisted_39$2, [
          createBaseVNode("div", _hoisted_40$2, [
            _cache[16] || (_cache[16] = createBaseVNode("div", { class: "card-title" }, [
              createBaseVNode("span", null, "🤖"),
              createBaseVNode("span", null, "模型使用分布")
            ], -1)),
            createBaseVNode("button", {
              class: "btn btn-sm btn-primary",
              onClick: loadModelUsage,
              disabled: isLoadingModelUsage.value
            }, toDisplayString(isLoadingModelUsage.value ? "⏳" : "📥") + " 刷新统计 ", 9, _hoisted_41$2)
          ]),
          modelUsage.value.length > 0 && modelUsage.value[0].usage > 0 ? (openBlock(), createElementBlock("div", _hoisted_42$2, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(modelUsage.value, (model) => {
              return openBlock(), createElementBlock("div", {
                class: "model-item",
                key: model.name
              }, [
                createBaseVNode("div", _hoisted_43$2, [
                  createBaseVNode("span", _hoisted_44$2, toDisplayString(model.name), 1),
                  createBaseVNode("span", _hoisted_45$2, toDisplayString(formatNumber(model.requests)) + " 请求", 1)
                ]),
                createBaseVNode("div", _hoisted_46$2, [
                  createBaseVNode("div", {
                    class: "model-bar",
                    style: normalizeStyle({ width: model.usage + "%" })
                  }, null, 4)
                ]),
                createBaseVNode("span", _hoisted_47$2, toDisplayString(model.usage) + "%", 1)
              ]);
            }), 128))
          ])) : (openBlock(), createElementBlock("div", _hoisted_48$2, [
            _cache[17] || (_cache[17] = createBaseVNode("span", { class: "empty-icon" }, "📊", -1)),
            createBaseVNode("span", _hoisted_49$2, toDisplayString(modelUsageNote.value || "暂无模型使用数据"), 1),
            _cache[18] || (_cache[18] = createBaseVNode("span", { class: "empty-hint" }, "使用 AI 服务后会自动统计", -1))
          ]))
        ])
      ]);
    };
  }
});
const UsagePage = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-7b2bf2a4"]]);
const _hoisted_1$5 = { class: "settings-page" };
const _hoisted_2$5 = { class: "card" };
const _hoisted_3$5 = { class: "settings-list" };
const _hoisted_4$5 = { class: "setting-item" };
const _hoisted_5$4 = { class: "switch" };
const _hoisted_6$4 = { class: "setting-item" };
const _hoisted_7$4 = { class: "switch" };
const _hoisted_8$4 = { class: "setting-item" };
const _hoisted_9$4 = { class: "card" };
const _hoisted_10$4 = { class: "settings-list" };
const _hoisted_11$3 = { class: "setting-item" };
const _hoisted_12$3 = { class: "switch" };
const _hoisted_13$3 = { class: "setting-item" };
const _hoisted_14$3 = { class: "switch" };
const _hoisted_15$3 = { class: "card" };
const _hoisted_16$3 = { class: "settings-list" };
const _hoisted_17$3 = { class: "setting-item" };
const _hoisted_18$3 = { class: "setting-item" };
const _hoisted_19$3 = { class: "card" };
const _hoisted_20$3 = { class: "settings-list" };
const _hoisted_21$3 = { class: "setting-item" };
const _hoisted_22$3 = { class: "card" };
const _hoisted_23$3 = { class: "settings-list" };
const _hoisted_24$3 = { class: "setting-item" };
const _hoisted_25$3 = { class: "setting-item" };
const _hoisted_26$3 = { class: "card" };
const _hoisted_27$3 = { class: "settings-list" };
const _hoisted_28$3 = { class: "setting-item" };
const _hoisted_29$3 = { class: "setting-info" };
const _hoisted_30$3 = { class: "setting-desc path-desc" };
const _hoisted_31$2 = { class: "setting-item" };
const _hoisted_32$1 = { class: "setting-info" };
const _hoisted_33$1 = { class: "setting-desc path-desc" };
const _hoisted_34$1 = { class: "setting-item" };
const _hoisted_35$1 = { class: "setting-info" };
const _hoisted_36$1 = { class: "setting-desc path-desc" };
const _hoisted_37$1 = { class: "setting-item" };
const _hoisted_38$1 = { class: "setting-info" };
const _hoisted_39$1 = { class: "setting-desc path-desc" };
const _hoisted_40$1 = { class: "setting-item" };
const _hoisted_41$1 = { class: "setting-info" };
const _hoisted_42$1 = { class: "setting-desc path-desc" };
const _hoisted_43$1 = { class: "card" };
const _hoisted_44$1 = { class: "settings-list" };
const _hoisted_45$1 = { class: "setting-item" };
const _hoisted_46$1 = { class: "switch" };
const _hoisted_47$1 = { class: "card" };
const _hoisted_48$1 = { class: "about-info" };
const _hoisted_49$1 = { class: "about-version" };
const _hoisted_50$1 = { class: "version-details" };
const _hoisted_51 = { class: "version-item" };
const _hoisted_52 = { class: "version-item" };
const _hoisted_53 = { class: "version-item" };
const _hoisted_54 = { class: "about-links" };
const _hoisted_55 = { class: "settings-actions" };
const _hoisted_56 = ["disabled"];
const _hoisted_57 = { key: 0 };
const _hoisted_58 = { key: 1 };
const _hoisted_59 = { key: 2 };
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "SettingsPage",
  setup(__props) {
    const settings = /* @__PURE__ */ ref({
      gatewayUrl: "http://localhost:18789",
      gatewayPort: 18789,
      startupDelay: 1e3,
      theme: "dark",
      autoStartGateway: true,
      minimizeToTray: true,
      restoreOnStart: true,
      showNotifications: true,
      checkUpdates: true,
      maxLogSize: 10,
      logRetention: 7
    });
    const openclawPaths = /* @__PURE__ */ ref({
      main: "",
      config: "",
      skills: "",
      models: "",
      workspace: ""
    });
    const saveStatus = /* @__PURE__ */ ref("idle");
    const versionInfo = /* @__PURE__ */ ref({
      version: "1.0.0",
      electron: "",
      chrome: "",
      node: ""
    });
    onMounted(async () => {
      await loadSettings();
      await loadPaths();
      loadVersionInfo();
    });
    async function loadSettings() {
      try {
        const config = await window.api.getConfig();
        settings.value = {
          gatewayUrl: config.gatewayUrl || "http://localhost:18789",
          gatewayPort: config.gatewayPort || 18789,
          startupDelay: config.startupDelay || 1e3,
          theme: config.theme || "dark",
          autoStartGateway: config.autoStartGateway ?? true,
          minimizeToTray: config.minimizeToTray ?? true,
          restoreOnStart: config.restoreOnStart ?? true,
          showNotifications: true,
          checkUpdates: true,
          maxLogSize: 10,
          logRetention: 7
        };
      } catch (e) {
        console.error("加载设置失败:", e);
      }
    }
    async function loadPaths() {
      try {
        const paths = await window.api.getOpenClawPaths();
        openclawPaths.value = {
          main: paths.main || "未检测到",
          config: paths.config || "未检测到",
          skills: paths.config ? `${paths.config}\\skills` : "未检测到",
          models: paths.config ? `${paths.config}\\models` : "未检测到",
          workspace: paths.workspace || "未检测到"
        };
      } catch (e) {
        console.error("加载路径信息失败:", e);
      }
    }
    function loadVersionInfo() {
      versionInfo.value = {
        version: "1.0.0",
        electron: "v28.0.0",
        chrome: "v120.0.0",
        node: "v18.19.0"
      };
    }
    async function saveSettings() {
      saveStatus.value = "saving";
      try {
        const config = await window.api.getConfig();
        const updatedConfig = {
          ...config,
          gatewayUrl: settings.value.gatewayUrl,
          gatewayPort: settings.value.gatewayPort,
          startupDelay: settings.value.startupDelay,
          theme: settings.value.theme,
          autoStartGateway: settings.value.autoStartGateway
        };
        await window.api.saveConfig(updatedConfig);
        saveStatus.value = "saved";
        setTimeout(() => {
          saveStatus.value = "idle";
        }, 2e3);
      } catch (e) {
        console.error("保存设置失败:", e);
        saveStatus.value = "idle";
      }
    }
    function resetSettings() {
      settings.value = {
        gatewayUrl: "http://localhost:18789",
        gatewayPort: 18789,
        startupDelay: 1e3,
        theme: "dark",
        autoStartGateway: true,
        minimizeToTray: true,
        restoreOnStart: true,
        showNotifications: true,
        checkUpdates: true,
        maxLogSize: 10,
        logRetention: 7
      };
    }
    async function openPath(path) {
      if (path && path !== "未检测到") {
        await window.api.openFolder(path);
      }
    }
    async function openLogDir() {
      await window.api.openFolder("C:\\Users\\Q\\AppData\\Roaming\\lobster-launcher\\logs");
    }
    async function openDataDir() {
      await window.api.openFolder("C:\\Users\\Q\\AppData\\Roaming\\lobster-launcher\\data");
    }
    async function checkForUpdates() {
      alert("当前已是最新版本！");
    }
    function openExternalLink(url) {
      window.api.openUrl(url);
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$5, [
        _cache[56] || (_cache[56] = createBaseVNode("h2", { class: "page-title" }, "⚙️ 设置", -1)),
        createBaseVNode("div", _hoisted_2$5, [
          _cache[23] || (_cache[23] = createBaseVNode("div", { class: "card-header" }, [
            createBaseVNode("div", { class: "card-title" }, [
              createBaseVNode("span", null, "🚀"),
              createBaseVNode("span", null, "启动设置")
            ])
          ], -1)),
          createBaseVNode("div", _hoisted_3$5, [
            createBaseVNode("div", _hoisted_4$5, [
              _cache[19] || (_cache[19] = createBaseVNode("div", { class: "setting-info" }, [
                createBaseVNode("span", { class: "setting-name" }, "开机自启动"),
                createBaseVNode("span", { class: "setting-desc" }, "启动时自动运行龙虾启动器")
              ], -1)),
              createBaseVNode("label", _hoisted_5$4, [
                withDirectives(createBaseVNode("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => settings.value.autoStartGateway = $event)
                }, null, 512), [
                  [vModelCheckbox, settings.value.autoStartGateway]
                ]),
                _cache[18] || (_cache[18] = createBaseVNode("span", { class: "slider" }, null, -1))
              ])
            ]),
            createBaseVNode("div", _hoisted_6$4, [
              _cache[21] || (_cache[21] = createBaseVNode("div", { class: "setting-info" }, [
                createBaseVNode("span", { class: "setting-name" }, "启动时还原窗口"),
                createBaseVNode("span", { class: "setting-desc" }, "启动应用时自动显示主窗口")
              ], -1)),
              createBaseVNode("label", _hoisted_7$4, [
                withDirectives(createBaseVNode("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => settings.value.restoreOnStart = $event)
                }, null, 512), [
                  [vModelCheckbox, settings.value.restoreOnStart]
                ]),
                _cache[20] || (_cache[20] = createBaseVNode("span", { class: "slider" }, null, -1))
              ])
            ]),
            createBaseVNode("div", _hoisted_8$4, [
              _cache[22] || (_cache[22] = createBaseVNode("div", { class: "setting-info" }, [
                createBaseVNode("span", { class: "setting-name" }, "全部启动延迟"),
                createBaseVNode("span", { class: "setting-desc" }, "批量启动服务时的间隔时间（毫秒）")
              ], -1)),
              withDirectives(createBaseVNode("input", {
                type: "number",
                class: "input setting-input setting-input-sm",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => settings.value.startupDelay = $event),
                placeholder: "1000",
                min: "0",
                max: "10000"
              }, null, 512), [
                [
                  vModelText,
                  settings.value.startupDelay,
                  void 0,
                  { number: true }
                ]
              ])
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_9$4, [
          _cache[28] || (_cache[28] = createBaseVNode("div", { class: "card-header" }, [
            createBaseVNode("div", { class: "card-title" }, [
              createBaseVNode("span", null, "🪟"),
              createBaseVNode("span", null, "窗口设置")
            ])
          ], -1)),
          createBaseVNode("div", _hoisted_10$4, [
            createBaseVNode("div", _hoisted_11$3, [
              _cache[25] || (_cache[25] = createBaseVNode("div", { class: "setting-info" }, [
                createBaseVNode("span", { class: "setting-name" }, "最小化到托盘"),
                createBaseVNode("span", { class: "setting-desc" }, "关闭窗口时最小化到系统托盘")
              ], -1)),
              createBaseVNode("label", _hoisted_12$3, [
                withDirectives(createBaseVNode("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => settings.value.minimizeToTray = $event)
                }, null, 512), [
                  [vModelCheckbox, settings.value.minimizeToTray]
                ]),
                _cache[24] || (_cache[24] = createBaseVNode("span", { class: "slider" }, null, -1))
              ])
            ]),
            createBaseVNode("div", _hoisted_13$3, [
              _cache[27] || (_cache[27] = createBaseVNode("div", { class: "setting-info" }, [
                createBaseVNode("span", { class: "setting-name" }, "显示通知"),
                createBaseVNode("span", { class: "setting-desc" }, "服务状态变化时显示系统通知")
              ], -1)),
              createBaseVNode("label", _hoisted_14$3, [
                withDirectives(createBaseVNode("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => settings.value.showNotifications = $event)
                }, null, 512), [
                  [vModelCheckbox, settings.value.showNotifications]
                ]),
                _cache[26] || (_cache[26] = createBaseVNode("span", { class: "slider" }, null, -1))
              ])
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_15$3, [
          _cache[31] || (_cache[31] = createBaseVNode("div", { class: "card-header" }, [
            createBaseVNode("div", { class: "card-title" }, [
              createBaseVNode("span", null, "🔌"),
              createBaseVNode("span", null, "服务设置")
            ])
          ], -1)),
          createBaseVNode("div", _hoisted_16$3, [
            createBaseVNode("div", _hoisted_17$3, [
              _cache[29] || (_cache[29] = createBaseVNode("div", { class: "setting-info" }, [
                createBaseVNode("span", { class: "setting-name" }, "Gateway 地址"),
                createBaseVNode("span", { class: "setting-desc" }, "OpenClaw Gateway 服务地址")
              ], -1)),
              withDirectives(createBaseVNode("input", {
                type: "text",
                class: "input setting-input",
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => settings.value.gatewayUrl = $event),
                placeholder: "http://localhost:18789"
              }, null, 512), [
                [vModelText, settings.value.gatewayUrl]
              ])
            ]),
            createBaseVNode("div", _hoisted_18$3, [
              _cache[30] || (_cache[30] = createBaseVNode("div", { class: "setting-info" }, [
                createBaseVNode("span", { class: "setting-name" }, "Gateway 端口"),
                createBaseVNode("span", { class: "setting-desc" }, "Gateway 检测端口号")
              ], -1)),
              withDirectives(createBaseVNode("input", {
                type: "number",
                class: "input setting-input setting-input-sm",
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => settings.value.gatewayPort = $event),
                placeholder: "18789"
              }, null, 512), [
                [
                  vModelText,
                  settings.value.gatewayPort,
                  void 0,
                  { number: true }
                ]
              ])
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_19$3, [
          _cache[34] || (_cache[34] = createBaseVNode("div", { class: "card-header" }, [
            createBaseVNode("div", { class: "card-title" }, [
              createBaseVNode("span", null, "🎨"),
              createBaseVNode("span", null, "外观设置")
            ])
          ], -1)),
          createBaseVNode("div", _hoisted_20$3, [
            createBaseVNode("div", _hoisted_21$3, [
              _cache[33] || (_cache[33] = createBaseVNode("div", { class: "setting-info" }, [
                createBaseVNode("span", { class: "setting-name" }, "主题"),
                createBaseVNode("span", { class: "setting-desc" }, "选择应用主题")
              ], -1)),
              withDirectives(createBaseVNode("select", {
                class: "input setting-input setting-select",
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => settings.value.theme = $event)
              }, [..._cache[32] || (_cache[32] = [
                createBaseVNode("option", { value: "dark" }, "深色", -1),
                createBaseVNode("option", { value: "light" }, "浅色", -1),
                createBaseVNode("option", { value: "system" }, "跟随系统", -1)
              ])], 512), [
                [vModelSelect, settings.value.theme]
              ])
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_22$3, [
          _cache[38] || (_cache[38] = createBaseVNode("div", { class: "card-header" }, [
            createBaseVNode("div", { class: "card-title" }, [
              createBaseVNode("span", null, "📋"),
              createBaseVNode("span", null, "日志设置")
            ])
          ], -1)),
          createBaseVNode("div", _hoisted_23$3, [
            createBaseVNode("div", _hoisted_24$3, [
              _cache[35] || (_cache[35] = createBaseVNode("div", { class: "setting-info" }, [
                createBaseVNode("span", { class: "setting-name" }, "单个日志最大"),
                createBaseVNode("span", { class: "setting-desc" }, "单个日志文件最大大小（MB）")
              ], -1)),
              withDirectives(createBaseVNode("input", {
                type: "number",
                class: "input setting-input setting-input-sm",
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => settings.value.maxLogSize = $event),
                min: "1",
                max: "100"
              }, null, 512), [
                [
                  vModelText,
                  settings.value.maxLogSize,
                  void 0,
                  { number: true }
                ]
              ])
            ]),
            createBaseVNode("div", _hoisted_25$3, [
              _cache[36] || (_cache[36] = createBaseVNode("div", { class: "setting-info" }, [
                createBaseVNode("span", { class: "setting-name" }, "日志保留天数"),
                createBaseVNode("span", { class: "setting-desc" }, "自动清理超过指定天数的日志")
              ], -1)),
              withDirectives(createBaseVNode("input", {
                type: "number",
                class: "input setting-input setting-input-sm",
                "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => settings.value.logRetention = $event),
                min: "1",
                max: "365"
              }, null, 512), [
                [
                  vModelText,
                  settings.value.logRetention,
                  void 0,
                  { number: true }
                ]
              ])
            ]),
            createBaseVNode("div", { class: "setting-item" }, [
              _cache[37] || (_cache[37] = createBaseVNode("div", { class: "setting-info" }, [
                createBaseVNode("span", { class: "setting-name" }, "日志目录"),
                createBaseVNode("span", { class: "setting-desc path-desc" }, "C:\\Users\\Q\\AppData\\Roaming\\lobster-launcher\\logs")
              ], -1)),
              createBaseVNode("button", {
                class: "btn btn-secondary btn-sm",
                onClick: openLogDir
              }, " 📂 打开 ")
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_26$3, [
          _cache[45] || (_cache[45] = createBaseVNode("div", { class: "card-header" }, [
            createBaseVNode("div", { class: "card-title" }, [
              createBaseVNode("span", null, "📁"),
              createBaseVNode("span", null, "路径信息")
            ])
          ], -1)),
          createBaseVNode("div", _hoisted_27$3, [
            createBaseVNode("div", _hoisted_28$3, [
              createBaseVNode("div", _hoisted_29$3, [
                _cache[39] || (_cache[39] = createBaseVNode("span", { class: "setting-name" }, "OpenClaw 主目录", -1)),
                createBaseVNode("span", _hoisted_30$3, toDisplayString(openclawPaths.value.main), 1)
              ]),
              createBaseVNode("button", {
                class: "btn btn-secondary btn-sm",
                onClick: _cache[10] || (_cache[10] = ($event) => openPath(openclawPaths.value.main))
              }, " 📂 ")
            ]),
            createBaseVNode("div", _hoisted_31$2, [
              createBaseVNode("div", _hoisted_32$1, [
                _cache[40] || (_cache[40] = createBaseVNode("span", { class: "setting-name" }, "配置目录", -1)),
                createBaseVNode("span", _hoisted_33$1, toDisplayString(openclawPaths.value.config), 1)
              ]),
              createBaseVNode("button", {
                class: "btn btn-secondary btn-sm",
                onClick: _cache[11] || (_cache[11] = ($event) => openPath(openclawPaths.value.config))
              }, " 📂 ")
            ]),
            createBaseVNode("div", _hoisted_34$1, [
              createBaseVNode("div", _hoisted_35$1, [
                _cache[41] || (_cache[41] = createBaseVNode("span", { class: "setting-name" }, "Skills 目录", -1)),
                createBaseVNode("span", _hoisted_36$1, toDisplayString(openclawPaths.value.skills), 1)
              ]),
              createBaseVNode("button", {
                class: "btn btn-secondary btn-sm",
                onClick: _cache[12] || (_cache[12] = ($event) => openPath(openclawPaths.value.skills))
              }, " 📂 ")
            ]),
            createBaseVNode("div", _hoisted_37$1, [
              createBaseVNode("div", _hoisted_38$1, [
                _cache[42] || (_cache[42] = createBaseVNode("span", { class: "setting-name" }, "模型目录", -1)),
                createBaseVNode("span", _hoisted_39$1, toDisplayString(openclawPaths.value.models), 1)
              ]),
              createBaseVNode("button", {
                class: "btn btn-secondary btn-sm",
                onClick: _cache[13] || (_cache[13] = ($event) => openPath(openclawPaths.value.models))
              }, " 📂 ")
            ]),
            createBaseVNode("div", _hoisted_40$1, [
              createBaseVNode("div", _hoisted_41$1, [
                _cache[43] || (_cache[43] = createBaseVNode("span", { class: "setting-name" }, "工作区目录", -1)),
                createBaseVNode("span", _hoisted_42$1, toDisplayString(openclawPaths.value.workspace), 1)
              ]),
              createBaseVNode("button", {
                class: "btn btn-secondary btn-sm",
                onClick: _cache[14] || (_cache[14] = ($event) => openPath(openclawPaths.value.workspace))
              }, " 📂 ")
            ]),
            createBaseVNode("div", { class: "setting-item" }, [
              _cache[44] || (_cache[44] = createBaseVNode("div", { class: "setting-info" }, [
                createBaseVNode("span", { class: "setting-name" }, "数据目录"),
                createBaseVNode("span", { class: "setting-desc path-desc" }, "C:\\Users\\Q\\AppData\\Roaming\\lobster-launcher\\data")
              ], -1)),
              createBaseVNode("button", {
                class: "btn btn-secondary btn-sm",
                onClick: openDataDir
              }, " 📂 ")
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_43$1, [
          _cache[48] || (_cache[48] = createBaseVNode("div", { class: "card-header" }, [
            createBaseVNode("div", { class: "card-title" }, [
              createBaseVNode("span", null, "🔄"),
              createBaseVNode("span", null, "更新设置")
            ])
          ], -1)),
          createBaseVNode("div", _hoisted_44$1, [
            createBaseVNode("div", _hoisted_45$1, [
              _cache[47] || (_cache[47] = createBaseVNode("div", { class: "setting-info" }, [
                createBaseVNode("span", { class: "setting-name" }, "自动检查更新"),
                createBaseVNode("span", { class: "setting-desc" }, "启动时自动检查是否有新版本")
              ], -1)),
              createBaseVNode("label", _hoisted_46$1, [
                withDirectives(createBaseVNode("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => settings.value.checkUpdates = $event)
                }, null, 512), [
                  [vModelCheckbox, settings.value.checkUpdates]
                ]),
                _cache[46] || (_cache[46] = createBaseVNode("span", { class: "slider" }, null, -1))
              ])
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_47$1, [
          _cache[55] || (_cache[55] = createBaseVNode("div", { class: "card-header" }, [
            createBaseVNode("div", { class: "card-title" }, [
              createBaseVNode("span", null, "ℹ️"),
              createBaseVNode("span", null, "关于")
            ])
          ], -1)),
          createBaseVNode("div", _hoisted_48$1, [
            _cache[52] || (_cache[52] = createBaseVNode("div", { class: "about-logo" }, "🦞", -1)),
            _cache[53] || (_cache[53] = createBaseVNode("div", { class: "about-name" }, "龙虾启动器", -1)),
            createBaseVNode("div", _hoisted_49$1, "版本 " + toDisplayString(versionInfo.value.version), 1),
            _cache[54] || (_cache[54] = createBaseVNode("div", { class: "about-desc" }, "OpenClaw 桌面管理工具", -1)),
            createBaseVNode("div", _hoisted_50$1, [
              createBaseVNode("div", _hoisted_51, [
                _cache[49] || (_cache[49] = createBaseVNode("span", null, "Electron", -1)),
                createBaseVNode("span", null, toDisplayString(versionInfo.value.electron), 1)
              ]),
              createBaseVNode("div", _hoisted_52, [
                _cache[50] || (_cache[50] = createBaseVNode("span", null, "Chrome", -1)),
                createBaseVNode("span", null, toDisplayString(versionInfo.value.chrome), 1)
              ]),
              createBaseVNode("div", _hoisted_53, [
                _cache[51] || (_cache[51] = createBaseVNode("span", null, "Node.js", -1)),
                createBaseVNode("span", null, toDisplayString(versionInfo.value.node), 1)
              ])
            ]),
            createBaseVNode("div", _hoisted_54, [
              createBaseVNode("button", {
                class: "btn btn-secondary btn-sm",
                onClick: checkForUpdates
              }, " 📝 检查更新 "),
              createBaseVNode("button", {
                class: "btn btn-secondary btn-sm",
                onClick: _cache[16] || (_cache[16] = ($event) => openExternalLink("https://github.com"))
              }, " 🐛 反馈问题 "),
              createBaseVNode("button", {
                class: "btn btn-secondary btn-sm",
                onClick: _cache[17] || (_cache[17] = ($event) => openExternalLink("https://openclaw.com"))
              }, " 📖 使用文档 ")
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_55, [
          createBaseVNode("button", {
            class: "btn btn-secondary",
            onClick: resetSettings
          }, " 🔄 重置 "),
          createBaseVNode("button", {
            class: "btn btn-primary",
            onClick: saveSettings,
            disabled: saveStatus.value === "saving"
          }, [
            saveStatus.value === "saving" ? (openBlock(), createElementBlock("span", _hoisted_57, "保存中...")) : saveStatus.value === "saved" ? (openBlock(), createElementBlock("span", _hoisted_58, "✓ 已保存")) : (openBlock(), createElementBlock("span", _hoisted_59, "💾 保存设置"))
          ], 8, _hoisted_56)
        ])
      ]);
    };
  }
});
const SettingsPage = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-6a1bac7e"]]);
const _hoisted_1$4 = { class: "skills-page" };
const _hoisted_2$4 = {
  key: 1,
  class: "loading"
};
const _hoisted_3$4 = {
  key: 2,
  class: "skills-container"
};
const _hoisted_4$4 = { class: "all-skills-panel" };
const _hoisted_5$3 = { class: "panel-header" };
const _hoisted_6$3 = { class: "count" };
const _hoisted_7$3 = { class: "category-tabs" };
const _hoisted_8$3 = ["onClick"];
const _hoisted_9$3 = { class: "skills-list" };
const _hoisted_10$3 = ["onClick"];
const _hoisted_11$2 = { class: "skill-info" };
const _hoisted_12$2 = { class: "skill-name" };
const _hoisted_13$2 = { class: "skill-category" };
const _hoisted_14$2 = {
  key: 0,
  class: "skill-desc"
};
const _hoisted_15$2 = { class: "skill-badges" };
const _hoisted_16$2 = {
  key: 0,
  class: "check-mark"
};
const _hoisted_17$2 = {
  key: 1,
  class: "badge-blacklist"
};
const _hoisted_18$2 = {
  key: 0,
  class: "empty-state"
};
const _hoisted_19$2 = { class: "action-bar" };
const _hoisted_20$2 = ["disabled"];
const _hoisted_21$2 = { class: "config-center-panel" };
const _hoisted_22$2 = { class: "model-source-section" };
const _hoisted_23$2 = { class: "model-source-options" };
const _hoisted_24$2 = {
  key: 0,
  class: "codingplan-input"
};
const _hoisted_25$2 = { class: "blacklist-section" };
const _hoisted_26$2 = { class: "section-title" };
const _hoisted_27$2 = { class: "count-badge" };
const _hoisted_28$2 = { class: "blacklist-content" };
const _hoisted_29$2 = { class: "item-name" };
const _hoisted_30$2 = ["onClick"];
const _hoisted_31$1 = {
  key: 0,
  class: "empty-state small"
};
const _hoisted_32 = { class: "config-panel" };
const _hoisted_33 = { class: "config-content" };
const _hoisted_34 = { class: "config-item" };
const _hoisted_35 = {
  key: 0,
  class: "edit-name"
};
const _hoisted_36 = { class: "current-name" };
const _hoisted_37 = {
  key: 0,
  class: "active-badge"
};
const _hoisted_38 = { class: "profile-list" };
const _hoisted_39 = ["onClick"];
const _hoisted_40 = { class: "profile-name" };
const _hoisted_41 = { class: "profile-source" };
const _hoisted_42 = { class: "profile-actions" };
const _hoisted_43 = ["onClick"];
const _hoisted_44 = ["onClick"];
const _hoisted_45 = { class: "modal-header" };
const _hoisted_46 = { class: "modal-body" };
const _hoisted_47 = { class: "form-group" };
const _hoisted_48 = { class: "input-with-btn" };
const _hoisted_49 = { class: "modal-footer" };
const _hoisted_50 = ["disabled"];
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "SkillsPage",
  setup(__props) {
    const allSkills = /* @__PURE__ */ ref([]);
    const categories = /* @__PURE__ */ ref({});
    const skillsConfig = /* @__PURE__ */ ref({
      profiles: [],
      activeProfile: "default"
    });
    const currentProfile = /* @__PURE__ */ ref({
      name: "默认配置",
      blacklist: [],
      modelSource: "local",
      codingplanModel: ""
    });
    const selectedCategory = /* @__PURE__ */ ref(null);
    const selectedSkills = /* @__PURE__ */ ref([]);
    const importModal = /* @__PURE__ */ ref({
      show: false,
      sourceFolder: ""
    });
    const loading = /* @__PURE__ */ ref(false);
    const toast = /* @__PURE__ */ ref({ show: false, message: "", type: "success" });
    function showToast(message, type = "success") {
      toast.value = { show: true, message, type };
      setTimeout(() => {
        toast.value.show = false;
      }, 3e3);
    }
    const categoryList = computed(() => {
      return Object.entries(categories.value).map(([name, count]) => ({
        name,
        count
      }));
    });
    const filteredSkills = computed(() => {
      if (!selectedCategory.value) {
        return allSkills.value;
      }
      return allSkills.value.filter((s) => s.category === selectedCategory.value);
    });
    async function loadData() {
      loading.value = true;
      try {
        const skillsResult = await window.api.getAllSkills();
        if (skillsResult.success) {
          allSkills.value = skillsResult.skills;
          categories.value = skillsResult.categories || {};
        }
        const configResult = await window.api.getSkillsConfig();
        if (configResult.success && configResult.config) {
          skillsConfig.value = configResult.config;
          const active = skillsConfig.value.profiles.find((p2) => p2.name === skillsConfig.value.activeProfile);
          if (active) {
            currentProfile.value = {
              name: active.name,
              blacklist: active.blacklist || [],
              modelSource: active.modelSource || "local",
              codingplanModel: active.codingplanModel || ""
            };
          }
        } else {
          skillsConfig.value = {
            profiles: [{
              name: "默认配置",
              blacklist: [],
              modelSource: "local",
              codingplanModel: ""
            }],
            activeProfile: "默认配置"
          };
          currentProfile.value = {
            name: "默认配置",
            blacklist: [],
            modelSource: "local",
            codingplanModel: ""
          };
          await saveConfig();
        }
      } catch (e) {
        console.error("加载Skills数据失败:", e);
        showToast("加载数据失败", "error");
      } finally {
        loading.value = false;
      }
    }
    function selectCategory(category) {
      selectedCategory.value = category;
      selectedSkills.value = [];
    }
    function addToBlacklist() {
      if (selectedSkills.value.length === 0) return;
      for (const skillName of selectedSkills.value) {
        if (!currentProfile.value.blacklist.includes(skillName)) {
          currentProfile.value.blacklist.push(skillName);
        }
      }
      selectedSkills.value = [];
      showToast(`已添加 ${selectedSkills.value.length || 0} 个 Skills 到黑名单`);
    }
    function removeFromBlacklist(index) {
      currentProfile.value.blacklist.splice(index, 1);
    }
    function toggleSkill(name) {
      const index = selectedSkills.value.indexOf(name);
      if (index === -1) {
        selectedSkills.value.push(name);
      } else {
        selectedSkills.value.splice(index, 1);
      }
    }
    function createNewProfile() {
      const newProfile = {
        name: `配置${skillsConfig.value.profiles.length + 1}`,
        blacklist: [],
        modelSource: "local",
        codingplanModel: ""
      };
      skillsConfig.value.profiles.push(newProfile);
      currentProfile.value = { ...newProfile };
      skillsConfig.value.activeProfile = newProfile.name;
      saveConfig();
      showToast("已创建新配置");
    }
    function switchProfile(name) {
      const profile = skillsConfig.value.profiles.find((p2) => p2.name === name);
      if (profile) {
        currentProfile.value = {
          name: profile.name,
          blacklist: profile.blacklist || [],
          modelSource: profile.modelSource || "local",
          codingplanModel: profile.codingplanModel || ""
        };
        skillsConfig.value.activeProfile = name;
        saveConfig();
      }
    }
    async function saveConfig() {
      try {
        const index = skillsConfig.value.profiles.findIndex((p2) => p2.name === currentProfile.value.name);
        if (index !== -1) {
          skillsConfig.value.profiles[index] = { ...currentProfile.value };
        } else {
          skillsConfig.value.profiles.push({ ...currentProfile.value });
        }
        const configToSave = JSON.parse(JSON.stringify(skillsConfig.value));
        const result = await window.api.saveSkillsConfig(configToSave);
        if (result && result.success) {
          showToast("配置已保存");
        } else {
          showToast(result?.error || "保存失败", "error");
        }
      } catch (e) {
        console.error("保存配置失败:", e);
        showToast("保存失败", "error");
      }
    }
    function deleteProfile(name) {
      if (skillsConfig.value.profiles.length <= 1) {
        showToast("至少保留一个配置", "error");
        return;
      }
      const index = skillsConfig.value.profiles.findIndex((p2) => p2.name === name);
      if (index !== -1) {
        const deletedProfile = skillsConfig.value.profiles[index];
        skillsConfig.value.profiles.splice(index, 1);
        if (skillsConfig.value.activeProfile === name) {
          skillsConfig.value.activeProfile = skillsConfig.value.profiles[0].name;
          currentProfile.value = { ...skillsConfig.value.profiles[0] };
        }
        saveConfigWithResult().then((success) => {
          if (success) {
            showToast(`「${deletedProfile.name}」已删除`);
          } else {
            skillsConfig.value.profiles.splice(index, 0, deletedProfile);
            if (skillsConfig.value.activeProfile !== name) {
              skillsConfig.value.activeProfile = name;
              currentProfile.value = { ...deletedProfile };
            }
            showToast("删除失败", "error");
          }
        });
      }
    }
    async function saveConfigWithResult() {
      try {
        const configToSave = JSON.parse(JSON.stringify(skillsConfig.value));
        const result = await window.api.saveSkillsConfig(configToSave);
        return result && result.success;
      } catch (e) {
        console.error("保存配置失败:", e);
        return false;
      }
    }
    function setAsActive(name) {
      skillsConfig.value.activeProfile = name;
      saveConfig();
      showToast(`已将「${name}」设为当前配置`);
    }
    const editingProfileName = /* @__PURE__ */ ref(null);
    const newProfileName = /* @__PURE__ */ ref("");
    function startEditProfileName(name) {
      editingProfileName.value = name;
      newProfileName.value = name;
    }
    function finishEditProfileName() {
      if (editingProfileName.value && newProfileName.value.trim()) {
        const profile = skillsConfig.value.profiles.find((p2) => p2.name === editingProfileName.value);
        if (profile) {
          const oldName = profile.name;
          profile.name = newProfileName.value.trim();
          if (skillsConfig.value.activeProfile === oldName) {
            skillsConfig.value.activeProfile = profile.name;
          }
          if (currentProfile.value.name === oldName) {
            currentProfile.value.name = profile.name;
          }
          saveConfig();
          showToast("配置名称已修改");
        }
      }
      editingProfileName.value = null;
    }
    function showImportModal() {
      importModal.value.show = true;
      importModal.value.sourceFolder = "";
    }
    async function selectImportFolder() {
      const path = await window.api.selectFolder();
      if (path) {
        importModal.value.sourceFolder = path;
      }
    }
    async function importSkillsFromFolder() {
      if (!importModal.value.sourceFolder) {
        showToast("请选择要导入的文件夹", "error");
        return;
      }
      try {
        const result = await window.api.importSkillsFromFolder(importModal.value.sourceFolder);
        if (result.success) {
          showToast(`成功导入 ${result.count || 0} 个 Skills`);
          importModal.value.show = false;
          await loadData();
        } else {
          showToast(result.error || "导入失败", "error");
        }
      } catch (e) {
        console.error("导入 Skills 失败:", e);
        showToast("导入失败，请重试", "error");
      }
    }
    onMounted(() => {
      loadData();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$4, [
        toast.value.show ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(["toast", toast.value.type])
        }, toDisplayString(toast.value.message), 3)) : createCommentVNode("", true),
        createBaseVNode("div", { class: "page-header" }, [
          _cache[13] || (_cache[13] = createBaseVNode("div", { class: "header-left" }, [
            createBaseVNode("h2", null, "🎯 Skills 设置"),
            createBaseVNode("p", { class: "subtitle" }, "管理 Skills 黑名单和模型来源配置")
          ], -1)),
          createBaseVNode("div", { class: "header-actions" }, [
            createBaseVNode("button", {
              class: "btn btn-secondary",
              onClick: showImportModal
            }, " 📥 导入 Skills ")
          ])
        ]),
        loading.value ? (openBlock(), createElementBlock("div", _hoisted_2$4, [..._cache[14] || (_cache[14] = [
          createBaseVNode("span", null, "加载中...", -1)
        ])])) : (openBlock(), createElementBlock("div", _hoisted_3$4, [
          createBaseVNode("div", _hoisted_4$4, [
            createBaseVNode("div", _hoisted_5$3, [
              _cache[15] || (_cache[15] = createBaseVNode("h3", null, "📦 All Skills", -1)),
              createBaseVNode("span", _hoisted_6$3, toDisplayString(allSkills.value.length) + " 个", 1)
            ]),
            createBaseVNode("div", _hoisted_7$3, [
              createBaseVNode("button", {
                class: normalizeClass(["tab-btn", { active: !selectedCategory.value }]),
                onClick: _cache[0] || (_cache[0] = ($event) => selectCategory(null))
              }, " 全部 ", 2),
              (openBlock(true), createElementBlock(Fragment, null, renderList(categoryList.value, (cat) => {
                return openBlock(), createElementBlock("button", {
                  key: cat.name,
                  class: normalizeClass(["tab-btn", { active: selectedCategory.value === cat.name }]),
                  onClick: ($event) => selectCategory(cat.name)
                }, toDisplayString(cat.name) + " (" + toDisplayString(cat.count) + ") ", 11, _hoisted_8$3);
              }), 128))
            ]),
            createBaseVNode("div", _hoisted_9$3, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(filteredSkills.value, (skill) => {
                return openBlock(), createElementBlock("div", {
                  key: skill.name,
                  class: normalizeClass(["skill-item", {
                    selected: selectedSkills.value.includes(skill.name),
                    blacklisted: currentProfile.value.blacklist.includes(skill.name)
                  }]),
                  onClick: ($event) => toggleSkill(skill.name)
                }, [
                  _cache[16] || (_cache[16] = createBaseVNode("div", { class: "skill-icon" }, "🔧", -1)),
                  createBaseVNode("div", _hoisted_11$2, [
                    createBaseVNode("div", _hoisted_12$2, toDisplayString(skill.name), 1),
                    createBaseVNode("div", _hoisted_13$2, toDisplayString(skill.category), 1),
                    skill.description ? (openBlock(), createElementBlock("div", _hoisted_14$2, toDisplayString(skill.description), 1)) : createCommentVNode("", true)
                  ]),
                  createBaseVNode("div", _hoisted_15$2, [
                    selectedSkills.value.includes(skill.name) ? (openBlock(), createElementBlock("span", _hoisted_16$2, "✓")) : createCommentVNode("", true),
                    currentProfile.value.blacklist.includes(skill.name) ? (openBlock(), createElementBlock("span", _hoisted_17$2, "🚫")) : createCommentVNode("", true)
                  ])
                ], 10, _hoisted_10$3);
              }), 128)),
              filteredSkills.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_18$2, [..._cache[17] || (_cache[17] = [
                createBaseVNode("span", null, "😶 未找到 Skills", -1),
                createBaseVNode("p", null, "请确保已安装 OpenClaw 并配置 Skills 目录", -1)
              ])])) : createCommentVNode("", true)
            ]),
            createBaseVNode("div", _hoisted_19$2, [
              createBaseVNode("button", {
                class: "btn btn-danger",
                onClick: addToBlacklist,
                disabled: selectedSkills.value.length === 0
              }, " 🚫 添加到黑名单 ", 8, _hoisted_20$2)
            ])
          ]),
          createBaseVNode("div", _hoisted_21$2, [
            createBaseVNode("div", _hoisted_22$2, [
              _cache[20] || (_cache[20] = createBaseVNode("div", { class: "section-title" }, [
                createBaseVNode("span", null, "🤖 模型来源")
              ], -1)),
              createBaseVNode("div", _hoisted_23$2, [
                createBaseVNode("label", {
                  class: normalizeClass(["radio-option", { active: currentProfile.value.modelSource === "local" }])
                }, [
                  withDirectives(createBaseVNode("input", {
                    type: "radio",
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => currentProfile.value.modelSource = $event),
                    value: "local",
                    onChange: saveConfig
                  }, null, 544), [
                    [vModelRadio, currentProfile.value.modelSource]
                  ]),
                  _cache[18] || (_cache[18] = createBaseVNode("span", { class: "radio-label" }, [
                    createBaseVNode("span", { class: "radio-icon" }, "💻"),
                    createBaseVNode("span", { class: "radio-text" }, "本地模型")
                  ], -1))
                ], 2),
                createBaseVNode("label", {
                  class: normalizeClass(["radio-option", { active: currentProfile.value.modelSource === "codingplan" }])
                }, [
                  withDirectives(createBaseVNode("input", {
                    type: "radio",
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => currentProfile.value.modelSource = $event),
                    value: "codingplan",
                    onChange: saveConfig
                  }, null, 544), [
                    [vModelRadio, currentProfile.value.modelSource]
                  ]),
                  _cache[19] || (_cache[19] = createBaseVNode("span", { class: "radio-label" }, [
                    createBaseVNode("span", { class: "radio-icon" }, "☁️"),
                    createBaseVNode("span", { class: "radio-text" }, "CodingPlan 模型")
                  ], -1))
                ], 2)
              ]),
              currentProfile.value.modelSource === "codingplan" ? (openBlock(), createElementBlock("div", _hoisted_24$2, [
                withDirectives(createBaseVNode("input", {
                  type: "text",
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => currentProfile.value.codingplanModel = $event),
                  placeholder: "输入 CodingPlan 模型名称",
                  class: "input"
                }, null, 512), [
                  [vModelText, currentProfile.value.codingplanModel]
                ])
              ])) : createCommentVNode("", true)
            ]),
            createBaseVNode("div", _hoisted_25$2, [
              createBaseVNode("div", _hoisted_26$2, [
                _cache[21] || (_cache[21] = createBaseVNode("span", null, "🚫 黑名单", -1)),
                createBaseVNode("span", _hoisted_27$2, toDisplayString(currentProfile.value.blacklist.length) + " 个", 1)
              ]),
              createBaseVNode("div", _hoisted_28$2, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(currentProfile.value.blacklist, (skillName, index) => {
                  return openBlock(), createElementBlock("div", {
                    key: skillName,
                    class: "blacklist-item"
                  }, [
                    _cache[22] || (_cache[22] = createBaseVNode("span", { class: "item-icon" }, "🚫", -1)),
                    createBaseVNode("span", _hoisted_29$2, toDisplayString(skillName), 1),
                    createBaseVNode("button", {
                      class: "btn-icon",
                      onClick: ($event) => removeFromBlacklist(index),
                      title: "移除"
                    }, "✕", 8, _hoisted_30$2)
                  ]);
                }), 128)),
                currentProfile.value.blacklist.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_31$1, [..._cache[23] || (_cache[23] = [
                  createBaseVNode("span", null, "黑名单为空", -1),
                  createBaseVNode("p", null, "从左侧选择 Skills 添加到黑名单", -1)
                ])])) : createCommentVNode("", true)
              ])
            ]),
            createBaseVNode("div", { class: "action-bar" }, [
              createBaseVNode("button", {
                class: "btn btn-success full-width",
                onClick: saveConfig
              }, " 💾 保存配置 ")
            ])
          ]),
          createBaseVNode("div", _hoisted_32, [
            _cache[26] || (_cache[26] = createBaseVNode("div", { class: "panel-header" }, [
              createBaseVNode("h3", null, "⚙️ 配置管理")
            ], -1)),
            createBaseVNode("div", _hoisted_33, [
              createBaseVNode("div", _hoisted_34, [
                _cache[24] || (_cache[24] = createBaseVNode("label", null, "当前配置", -1)),
                editingProfileName.value === currentProfile.value.name ? (openBlock(), createElementBlock("div", _hoisted_35, [
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => newProfileName.value = $event),
                    type: "text",
                    class: "input",
                    onKeyup: [
                      withKeys(finishEditProfileName, ["enter"]),
                      _cache[5] || (_cache[5] = withKeys(($event) => editingProfileName.value = null, ["escape"]))
                    ]
                  }, null, 544), [
                    [vModelText, newProfileName.value]
                  ]),
                  createBaseVNode("button", {
                    class: "btn-icon",
                    onClick: finishEditProfileName
                  }, "✓")
                ])) : (openBlock(), createElementBlock("div", {
                  key: 1,
                  class: "profile-name-display",
                  onDblclick: _cache[7] || (_cache[7] = ($event) => startEditProfileName(currentProfile.value.name))
                }, [
                  createBaseVNode("span", _hoisted_36, toDisplayString(currentProfile.value.name), 1),
                  skillsConfig.value.activeProfile === currentProfile.value.name ? (openBlock(), createElementBlock("span", _hoisted_37, "当前")) : createCommentVNode("", true),
                  createBaseVNode("button", {
                    class: "btn-icon",
                    onClick: _cache[6] || (_cache[6] = ($event) => startEditProfileName(currentProfile.value.name))
                  }, "✏️")
                ], 32))
              ]),
              createBaseVNode("div", _hoisted_38, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(skillsConfig.value.profiles, (profile) => {
                  return openBlock(), createElementBlock("div", {
                    key: profile.name,
                    class: normalizeClass(["profile-item", { active: skillsConfig.value.activeProfile === profile.name }])
                  }, [
                    createBaseVNode("div", {
                      class: "profile-info",
                      onClick: ($event) => switchProfile(profile.name)
                    }, [
                      createBaseVNode("span", _hoisted_40, toDisplayString(profile.name), 1),
                      createBaseVNode("span", _hoisted_41, toDisplayString(profile.modelSource === "local" ? "💻 本地" : "☁️ CodingPlan"), 1)
                    ], 8, _hoisted_39),
                    createBaseVNode("div", _hoisted_42, [
                      skillsConfig.value.activeProfile !== profile.name ? (openBlock(), createElementBlock("button", {
                        key: 0,
                        class: "btn-icon small",
                        onClick: withModifiers(($event) => setAsActive(profile.name), ["stop"]),
                        title: "设为当前配置"
                      }, " ⭐ ", 8, _hoisted_43)) : createCommentVNode("", true),
                      skillsConfig.value.profiles.length > 1 ? (openBlock(), createElementBlock("button", {
                        key: 1,
                        class: "btn-icon small danger",
                        onClick: withModifiers(($event) => deleteProfile(profile.name), ["stop"]),
                        title: "删除"
                      }, " 🗑 ", 8, _hoisted_44)) : createCommentVNode("", true)
                    ])
                  ], 2);
                }), 128))
              ]),
              createBaseVNode("button", {
                class: "btn btn-secondary full-width",
                onClick: createNewProfile
              }, " ➕ 新建配置 "),
              _cache[25] || (_cache[25] = createBaseVNode("div", { class: "help-section" }, [
                createBaseVNode("h4", null, "💡 使用说明"),
                createBaseVNode("ul", null, [
                  createBaseVNode("li", null, "黑名单中的 Skills 将不会被加载"),
                  createBaseVNode("li", null, "选择本地模型使用本地部署的模型"),
                  createBaseVNode("li", null, "选择 CodingPlan 使用云端模型 API"),
                  createBaseVNode("li", null, "双击配置名称可进行重命名")
                ])
              ], -1))
            ])
          ])
        ])),
        importModal.value.show ? (openBlock(), createElementBlock("div", {
          key: 3,
          class: "modal-overlay",
          onClick: _cache[12] || (_cache[12] = ($event) => importModal.value.show = false)
        }, [
          createBaseVNode("div", {
            class: "modal",
            onClick: _cache[11] || (_cache[11] = withModifiers(() => {
            }, ["stop"]))
          }, [
            createBaseVNode("div", _hoisted_45, [
              _cache[27] || (_cache[27] = createBaseVNode("h3", null, "📥 导入 Skills", -1)),
              createBaseVNode("button", {
                class: "close-btn",
                onClick: _cache[8] || (_cache[8] = ($event) => importModal.value.show = false)
              }, "✕")
            ]),
            createBaseVNode("div", _hoisted_46, [
              _cache[29] || (_cache[29] = createBaseVNode("p", { class: "import-tip" }, "选择包含 Skills 的文件夹（每个 Skill 需要是一个独立的子目录）", -1)),
              createBaseVNode("div", _hoisted_47, [
                _cache[28] || (_cache[28] = createBaseVNode("label", null, "文件夹路径", -1)),
                createBaseVNode("div", _hoisted_48, [
                  withDirectives(createBaseVNode("input", {
                    type: "text",
                    "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => importModal.value.sourceFolder = $event),
                    placeholder: "选择要导入的文件夹",
                    class: "form-input",
                    readonly: ""
                  }, null, 512), [
                    [vModelText, importModal.value.sourceFolder]
                  ]),
                  createBaseVNode("button", {
                    class: "btn btn-secondary",
                    onClick: selectImportFolder
                  }, "📂 浏览")
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_49, [
              createBaseVNode("button", {
                class: "btn btn-secondary",
                onClick: _cache[10] || (_cache[10] = ($event) => importModal.value.show = false)
              }, "取消"),
              createBaseVNode("button", {
                class: "btn btn-primary",
                onClick: importSkillsFromFolder,
                disabled: !importModal.value.sourceFolder
              }, " 开始导入 ", 8, _hoisted_50)
            ])
          ])
        ])) : createCommentVNode("", true)
      ]);
    };
  }
});
const SkillsPage = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-048f75eb"]]);
const _hoisted_1$3 = { class: "models-page" };
const _hoisted_2$3 = {
  key: 0,
  class: "folders-section"
};
const _hoisted_3$3 = { class: "folders-list" };
const _hoisted_4$3 = ["onClick"];
const _hoisted_5$2 = { class: "folder-path" };
const _hoisted_6$2 = ["onClick"];
const _hoisted_7$2 = {
  key: 1,
  class: "loading"
};
const _hoisted_8$2 = {
  key: 2,
  class: "error-state"
};
const _hoisted_9$2 = {
  key: 3,
  class: "models-container"
};
const _hoisted_10$2 = { class: "models-list-panel" };
const _hoisted_11$1 = { class: "panel-header" };
const _hoisted_12$1 = { class: "count" };
const _hoisted_13$1 = { class: "models-list" };
const _hoisted_14$1 = ["onClick"];
const _hoisted_15$1 = { class: "model-info" };
const _hoisted_16$1 = { class: "model-name" };
const _hoisted_17$1 = { class: "model-meta" };
const _hoisted_18$1 = { class: "meta-item" };
const _hoisted_19$1 = { class: "meta-item" };
const _hoisted_20$1 = { class: "meta-type" };
const _hoisted_21$1 = {
  key: 0,
  class: "empty-state"
};
const _hoisted_22$1 = { class: "model-details-panel" };
const _hoisted_23$1 = { class: "panel-header" };
const _hoisted_24$1 = {
  key: 0,
  class: "loading"
};
const _hoisted_25$1 = {
  key: 1,
  class: "details-content"
};
const _hoisted_26$1 = { class: "detail-header" };
const _hoisted_27$1 = { class: "detail-filename" };
const _hoisted_28$1 = ["onClick"];
const _hoisted_29$1 = { class: "detail-content" };
const _hoisted_30$1 = {
  key: 2,
  class: "empty-state"
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "ModelsPage",
  setup(__props) {
    const models = /* @__PURE__ */ ref([]);
    const customModelFolders = /* @__PURE__ */ ref([]);
    const selectedModel = /* @__PURE__ */ ref(null);
    const modelDetails = /* @__PURE__ */ ref({});
    const loading = /* @__PURE__ */ ref(true);
    const detailsLoading = /* @__PURE__ */ ref(false);
    const error = /* @__PURE__ */ ref("");
    async function loadModels() {
      loading.value = true;
      error.value = "";
      try {
        const result = await window.api.getLocalModels();
        if (result.success) {
          models.value = result.models;
          customModelFolders.value = result.customFolders || [];
        } else {
          error.value = result.error || "加载模型失败";
        }
      } catch (e) {
        error.value = "加载模型失败";
        console.error(e);
      } finally {
        loading.value = false;
      }
    }
    async function selectModel(model) {
      selectedModel.value = model.path;
      detailsLoading.value = true;
      modelDetails.value = {};
      try {
        const result = await window.api.getModelDetails(model.path);
        if (result.success && result.details) {
          modelDetails.value = result.details;
        }
      } catch (e) {
        console.error("加载模型详情失败:", e);
      } finally {
        detailsLoading.value = false;
      }
    }
    async function openModelFolder(model) {
      await window.api.openFolder(model.path);
    }
    async function copyContent(content) {
      await window.api.copyToClipboard(content);
    }
    async function addModelFolder() {
      const path = await window.api.selectFolder();
      if (path) {
        try {
          const result = await window.api.addModelFolder(path);
          if (result && result.success) {
            await loadModels();
          } else {
            error.value = result?.error || "添加失败";
          }
        } catch (e) {
          error.value = "添加失败";
          console.error(e);
        }
      }
    }
    async function removeModelFolder(folder) {
      try {
        const result = await window.api.removeModelFolder(folder);
        if (result.success) {
          await loadModels();
        } else {
          error.value = result.error || "移除失败";
        }
      } catch (e) {
        error.value = "移除失败";
        console.error(e);
      }
    }
    async function openModelFolderLocation(folder) {
      await window.api.openFolder(folder);
    }
    onMounted(() => {
      loadModels();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$3, [
        createBaseVNode("div", { class: "page-header" }, [
          _cache[1] || (_cache[1] = createBaseVNode("div", { class: "header-left" }, [
            createBaseVNode("h2", null, "🤖 模型管理"),
            createBaseVNode("p", { class: "subtitle" }, "管理本地模型文件")
          ], -1)),
          createBaseVNode("button", {
            class: "btn btn-primary",
            onClick: addModelFolder
          }, " ➕ 添加模型文件夹 ")
        ]),
        customModelFolders.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_2$3, [
          _cache[3] || (_cache[3] = createBaseVNode("div", { class: "section-title" }, [
            createBaseVNode("span", null, "📂 已添加的模型文件夹")
          ], -1)),
          createBaseVNode("div", _hoisted_3$3, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(customModelFolders.value, (folder) => {
              return openBlock(), createElementBlock("div", {
                key: folder,
                class: "folder-item"
              }, [
                createBaseVNode("div", {
                  class: "folder-info",
                  onClick: ($event) => openModelFolderLocation(folder)
                }, [
                  _cache[2] || (_cache[2] = createBaseVNode("span", { class: "folder-icon" }, "📁", -1)),
                  createBaseVNode("span", _hoisted_5$2, toDisplayString(folder), 1)
                ], 8, _hoisted_4$3),
                createBaseVNode("button", {
                  class: "btn-icon",
                  onClick: ($event) => removeModelFolder(folder),
                  title: "移除"
                }, "🗑", 8, _hoisted_6$2)
              ]);
            }), 128))
          ])
        ])) : createCommentVNode("", true),
        loading.value ? (openBlock(), createElementBlock("div", _hoisted_7$2, [..._cache[4] || (_cache[4] = [
          createBaseVNode("span", null, "加载中...", -1)
        ])])) : error.value ? (openBlock(), createElementBlock("div", _hoisted_8$2, [
          createBaseVNode("span", null, "❌ " + toDisplayString(error.value), 1),
          _cache[5] || (_cache[5] = createBaseVNode("p", null, "请确保已安装 OpenClaw 并配置模型目录", -1)),
          createBaseVNode("button", {
            class: "btn btn-primary",
            onClick: loadModels
          }, "重试")
        ])) : (openBlock(), createElementBlock("div", _hoisted_9$2, [
          createBaseVNode("div", _hoisted_10$2, [
            createBaseVNode("div", _hoisted_11$1, [
              _cache[6] || (_cache[6] = createBaseVNode("h3", null, "📦 本地模型", -1)),
              createBaseVNode("span", _hoisted_12$1, toDisplayString(models.value.length) + " 个", 1)
            ]),
            createBaseVNode("div", _hoisted_13$1, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(models.value, (model) => {
                return openBlock(), createElementBlock("div", {
                  key: model.path,
                  class: normalizeClass(["model-item", { selected: selectedModel.value === model.path }]),
                  onClick: ($event) => selectModel(model)
                }, [
                  _cache[7] || (_cache[7] = createBaseVNode("div", { class: "model-icon" }, "🤖", -1)),
                  createBaseVNode("div", _hoisted_15$1, [
                    createBaseVNode("div", _hoisted_16$1, toDisplayString(model.name), 1),
                    createBaseVNode("div", _hoisted_17$1, [
                      createBaseVNode("span", _hoisted_18$1, "📦 " + toDisplayString(model.size), 1),
                      createBaseVNode("span", _hoisted_19$1, "📅 " + toDisplayString(model.modified), 1),
                      createBaseVNode("span", _hoisted_20$1, toDisplayString(model.modelType || "本地模型"), 1),
                      createBaseVNode("span", {
                        class: normalizeClass(["meta-source", model.source === "默认目录" ? "default" : "custom"])
                      }, toDisplayString(model.source === "默认目录" ? "🏠 默认" : "📂 自定义"), 3)
                    ])
                  ])
                ], 10, _hoisted_14$1);
              }), 128)),
              models.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_21$1, [..._cache[8] || (_cache[8] = [
                createBaseVNode("span", null, "📭 未找到模型", -1),
                createBaseVNode("p", null, "请添加模型文件夹来扫描模型文件", -1)
              ])])) : createCommentVNode("", true)
            ])
          ]),
          createBaseVNode("div", _hoisted_22$1, [
            createBaseVNode("div", _hoisted_23$1, [
              _cache[9] || (_cache[9] = createBaseVNode("h3", null, "📄 模型详情", -1)),
              selectedModel.value ? (openBlock(), createElementBlock("button", {
                key: 0,
                class: "btn btn-secondary btn-small",
                onClick: _cache[0] || (_cache[0] = ($event) => openModelFolder(models.value.find((m) => m.path === selectedModel.value)))
              }, " 📂 打开目录 ")) : createCommentVNode("", true)
            ]),
            detailsLoading.value ? (openBlock(), createElementBlock("div", _hoisted_24$1, [..._cache[10] || (_cache[10] = [
              createBaseVNode("span", null, "加载详情...", -1)
            ])])) : Object.keys(modelDetails.value).length > 0 ? (openBlock(), createElementBlock("div", _hoisted_25$1, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(modelDetails.value, (content, filename) => {
                return openBlock(), createElementBlock("div", {
                  key: filename,
                  class: "detail-section"
                }, [
                  createBaseVNode("div", _hoisted_26$1, [
                    createBaseVNode("span", _hoisted_27$1, "📄 " + toDisplayString(filename), 1),
                    createBaseVNode("button", {
                      class: "btn-icon",
                      onClick: ($event) => copyContent(content),
                      title: "复制"
                    }, "📋", 8, _hoisted_28$1)
                  ]),
                  createBaseVNode("pre", _hoisted_29$1, toDisplayString(content), 1)
                ]);
              }), 128))
            ])) : (openBlock(), createElementBlock("div", _hoisted_30$1, [..._cache[11] || (_cache[11] = [
              createBaseVNode("span", null, "👈 选择一个模型", -1),
              createBaseVNode("p", null, "点击左侧列表中的模型查看详情", -1)
            ])]))
          ])
        ]))
      ]);
    };
  }
});
const ModelsPage = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-642b97ef"]]);
const _hoisted_1$2 = { class: "terminal-page" };
const _hoisted_2$2 = { class: "terminal-container" };
const _hoisted_3$2 = { class: "time" };
const _hoisted_4$2 = { class: "content" };
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "TerminalPage",
  setup(__props) {
    const terminalRef = /* @__PURE__ */ ref(null);
    const shellConfig = /* @__PURE__ */ ref({
      shell: "cmd.exe"
    });
    const history = /* @__PURE__ */ ref([]);
    async function loadConfig() {
      try {
        const result = await window.api.getTerminalConfig();
        if (result.success) {
          shellConfig.value.shell = result.shell;
        }
      } catch (e) {
        console.error("加载终端配置失败:", e);
      }
    }
    function addToHistory(type, content) {
      const now = /* @__PURE__ */ new Date();
      const time = now.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const lines = content.split("\n");
      for (const line of lines) {
        if (line.trim()) {
          history.value.push({ type, content: line, time });
        }
      }
      nextTick(() => {
        if (terminalRef.value) {
          terminalRef.value.scrollTop = terminalRef.value.scrollHeight;
        }
      });
    }
    function clearTerminal() {
      history.value = [];
    }
    async function openExternalTerminal() {
      await window.api.openTerminal();
    }
    onMounted(() => {
      loadConfig();
      addToHistory("output", "欢迎使用终端 - 输入命令并按 Enter 执行");
      addToHistory("output", `Shell: ${shellConfig.value.shell}`);
      addToHistory("output", '提示: 点击右下角"打开外部终端"可使用完整终端功能');
      addToHistory("output", "---");
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$2, [
        createBaseVNode("div", { class: "page-header" }, [
          _cache[0] || (_cache[0] = createBaseVNode("div", { class: "header-left" }, [
            createBaseVNode("h2", null, "💻 终端"),
            createBaseVNode("p", { class: "subtitle" }, "命令行工具")
          ], -1)),
          createBaseVNode("div", { class: "header-actions" }, [
            createBaseVNode("button", {
              class: "btn btn-secondary",
              onClick: clearTerminal
            }, " 🗑 清除 "),
            createBaseVNode("button", {
              class: "btn btn-primary",
              onClick: openExternalTerminal
            }, " 📂 打开外部终端 ")
          ])
        ]),
        createBaseVNode("div", _hoisted_2$2, [
          createBaseVNode("div", {
            ref_key: "terminalRef",
            ref: terminalRef,
            class: "terminal-output"
          }, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(history.value, (item, index) => {
              return openBlock(), createElementBlock("div", {
                key: index,
                class: normalizeClass(["history-item", item.type])
              }, [
                createBaseVNode("span", _hoisted_3$2, toDisplayString(item.time), 1),
                createBaseVNode("span", _hoisted_4$2, toDisplayString(item.content), 1)
              ], 2);
            }), 128))
          ], 512)
        ])
      ]);
    };
  }
});
const TerminalPage = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-a9758fd3"]]);
const _hoisted_1$1 = { class: "tools-page" };
const _hoisted_2$1 = { class: "page-header" };
const _hoisted_3$1 = {
  key: 0,
  class: "loading"
};
const _hoisted_4$1 = {
  key: 1,
  class: "tools-container"
};
const _hoisted_5$1 = {
  key: 0,
  class: "empty-state"
};
const _hoisted_6$1 = {
  key: 1,
  class: "tools-grid"
};
const _hoisted_7$1 = { class: "tool-icon" };
const _hoisted_8$1 = { class: "tool-info" };
const _hoisted_9$1 = { class: "tool-name" };
const _hoisted_10$1 = { class: "tool-path" };
const _hoisted_11 = {
  key: 0,
  class: "tool-desc"
};
const _hoisted_12 = { class: "tool-badges" };
const _hoisted_13 = {
  key: 0,
  class: "badge"
};
const _hoisted_14 = { class: "tool-actions" };
const _hoisted_15 = ["onClick"];
const _hoisted_16 = ["onClick"];
const _hoisted_17 = ["onClick"];
const _hoisted_18 = { class: "modal" };
const _hoisted_19 = { class: "modal-header" };
const _hoisted_20 = { class: "modal-body" };
const _hoisted_21 = { class: "form-item" };
const _hoisted_22 = { class: "form-item" };
const _hoisted_23 = { class: "input-group" };
const _hoisted_24 = { class: "form-item" };
const _hoisted_25 = { class: "icon-picker" };
const _hoisted_26 = ["onClick"];
const _hoisted_27 = { class: "form-item" };
const _hoisted_28 = { class: "form-item" };
const _hoisted_29 = { class: "checkbox-label" };
const _hoisted_30 = { class: "modal-footer" };
const _hoisted_31 = ["disabled"];
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ToolsPage",
  setup(__props) {
    const tools = /* @__PURE__ */ ref([]);
    const addToolModal = /* @__PURE__ */ ref({
      show: false,
      name: "",
      path: "",
      icon: "🔧",
      description: "",
      runInTerminal: false
    });
    const loading = /* @__PURE__ */ ref(true);
    async function loadTools() {
      loading.value = true;
      try {
        const result = await window.api.getTools();
        if (result.success) {
          tools.value = result.tools || [];
        }
      } catch (e) {
        console.error("加载工具失败:", e);
      } finally {
        loading.value = false;
      }
    }
    async function saveTools() {
      try {
        await window.api.saveTools(tools.value);
      } catch (e) {
        console.error("保存工具失败:", e);
      }
    }
    async function selectScript() {
      try {
        const path = await window.api.selectFile([
          { name: "脚本文件", extensions: ["bat", "cmd", "ps1", "py", "js", "ts", "sh"] },
          { name: "可执行文件", extensions: ["exe", "bat", "cmd"] },
          { name: "所有文件", extensions: ["*"] }
        ]);
        if (path) {
          addToolModal.value.path = path;
          if (!addToolModal.value.name) {
            const parts = path.split(/[/\\]/);
            const filename = parts[parts.length - 1];
            addToolModal.value.name = filename.replace(/\.[^.]+$/, "");
          }
        }
      } catch (e) {
        console.error("选择文件失败:", e);
      }
    }
    async function addTool() {
      if (!addToolModal.value.name || !addToolModal.value.path) return;
      const newTool = {
        id: Date.now().toString(),
        name: addToolModal.value.name,
        path: addToolModal.value.path,
        icon: addToolModal.value.icon,
        description: addToolModal.value.description,
        runInTerminal: addToolModal.value.runInTerminal
      };
      tools.value.push(newTool);
      await saveTools();
      addToolModal.value = {
        show: false,
        name: "",
        path: "",
        icon: "🔧",
        description: "",
        runInTerminal: false
      };
    }
    async function deleteTool(id) {
      const index = tools.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        tools.value.splice(index, 1);
        await saveTools();
      }
    }
    async function runTool(tool) {
      try {
        await window.api.runTool(tool);
      } catch (e) {
        console.error("运行工具失败:", e);
      }
    }
    async function openToolLocation(tool) {
      await window.api.openToolLocation(tool.path);
    }
    const iconList = ["🔧", "⚙️", "🔨", "💻", "📦", "📁", "🛠️", "⚡", "🚀", "🎯", "📝", "🔍", "📊", "🎨", "🧩", "🔗"];
    onMounted(() => {
      loadTools();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        createBaseVNode("div", _hoisted_2$1, [
          _cache[8] || (_cache[8] = createBaseVNode("div", { class: "header-left" }, [
            createBaseVNode("h2", null, "🔧 小工具"),
            createBaseVNode("p", { class: "subtitle" }, "管理常用脚本和工具")
          ], -1)),
          createBaseVNode("button", {
            class: "btn btn-primary",
            onClick: _cache[0] || (_cache[0] = ($event) => addToolModal.value.show = true)
          }, " ➕ 添加工具 ")
        ]),
        loading.value ? (openBlock(), createElementBlock("div", _hoisted_3$1, [..._cache[9] || (_cache[9] = [
          createBaseVNode("span", null, "加载中...", -1)
        ])])) : (openBlock(), createElementBlock("div", _hoisted_4$1, [
          tools.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_5$1, [..._cache[10] || (_cache[10] = [
            createBaseVNode("span", null, "🛠️", -1),
            createBaseVNode("h3", null, "暂无小工具", -1),
            createBaseVNode("p", null, "点击右上角按钮添加常用脚本和工具", -1)
          ])])) : (openBlock(), createElementBlock("div", _hoisted_6$1, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(tools.value, (tool) => {
              return openBlock(), createElementBlock("div", {
                key: tool.id,
                class: "tool-card"
              }, [
                createBaseVNode("div", _hoisted_7$1, toDisplayString(tool.icon), 1),
                createBaseVNode("div", _hoisted_8$1, [
                  createBaseVNode("div", _hoisted_9$1, toDisplayString(tool.name), 1),
                  createBaseVNode("div", _hoisted_10$1, toDisplayString(tool.path), 1),
                  tool.description ? (openBlock(), createElementBlock("div", _hoisted_11, toDisplayString(tool.description), 1)) : createCommentVNode("", true),
                  createBaseVNode("div", _hoisted_12, [
                    tool.runInTerminal ? (openBlock(), createElementBlock("span", _hoisted_13, "终端")) : createCommentVNode("", true)
                  ])
                ]),
                createBaseVNode("div", _hoisted_14, [
                  createBaseVNode("button", {
                    class: "btn btn-primary btn-small",
                    onClick: ($event) => runTool(tool),
                    title: "运行"
                  }, " ▶ ", 8, _hoisted_15),
                  createBaseVNode("button", {
                    class: "btn btn-secondary btn-small",
                    onClick: ($event) => openToolLocation(tool),
                    title: "打开位置"
                  }, " 📂 ", 8, _hoisted_16),
                  createBaseVNode("button", {
                    class: "btn btn-danger btn-small",
                    onClick: ($event) => deleteTool(tool.id),
                    title: "删除"
                  }, " 🗑 ", 8, _hoisted_17)
                ])
              ]);
            }), 128))
          ]))
        ])),
        addToolModal.value.show ? (openBlock(), createElementBlock("div", {
          key: 2,
          class: "modal-overlay",
          onClick: _cache[7] || (_cache[7] = withModifiers(($event) => addToolModal.value.show = false, ["self"]))
        }, [
          createBaseVNode("div", _hoisted_18, [
            createBaseVNode("div", _hoisted_19, [
              _cache[11] || (_cache[11] = createBaseVNode("h3", null, "添加小工具", -1)),
              createBaseVNode("button", {
                class: "btn-close",
                onClick: _cache[1] || (_cache[1] = ($event) => addToolModal.value.show = false)
              }, "✕")
            ]),
            createBaseVNode("div", _hoisted_20, [
              createBaseVNode("div", _hoisted_21, [
                _cache[12] || (_cache[12] = createBaseVNode("label", null, "名称", -1)),
                withDirectives(createBaseVNode("input", {
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => addToolModal.value.name = $event),
                  type: "text",
                  class: "input",
                  placeholder: "工具名称"
                }, null, 512), [
                  [vModelText, addToolModal.value.name]
                ])
              ]),
              createBaseVNode("div", _hoisted_22, [
                _cache[13] || (_cache[13] = createBaseVNode("label", null, "脚本路径", -1)),
                createBaseVNode("div", _hoisted_23, [
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => addToolModal.value.path = $event),
                    type: "text",
                    class: "input",
                    placeholder: "选择脚本文件"
                  }, null, 512), [
                    [vModelText, addToolModal.value.path]
                  ]),
                  createBaseVNode("button", {
                    class: "btn btn-secondary",
                    onClick: selectScript
                  }, "浏览")
                ])
              ]),
              createBaseVNode("div", _hoisted_24, [
                _cache[14] || (_cache[14] = createBaseVNode("label", null, "图标", -1)),
                createBaseVNode("div", _hoisted_25, [
                  (openBlock(), createElementBlock(Fragment, null, renderList(iconList, (icon) => {
                    return createBaseVNode("button", {
                      key: icon,
                      class: normalizeClass(["icon-btn", { selected: addToolModal.value.icon === icon }]),
                      onClick: ($event) => addToolModal.value.icon = icon
                    }, toDisplayString(icon), 11, _hoisted_26);
                  }), 64))
                ])
              ]),
              createBaseVNode("div", _hoisted_27, [
                _cache[15] || (_cache[15] = createBaseVNode("label", null, "描述（可选）", -1)),
                withDirectives(createBaseVNode("input", {
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => addToolModal.value.description = $event),
                  type: "text",
                  class: "input",
                  placeholder: "简短描述"
                }, null, 512), [
                  [vModelText, addToolModal.value.description]
                ])
              ]),
              createBaseVNode("div", _hoisted_28, [
                createBaseVNode("label", _hoisted_29, [
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => addToolModal.value.runInTerminal = $event),
                    type: "checkbox"
                  }, null, 512), [
                    [vModelCheckbox, addToolModal.value.runInTerminal]
                  ]),
                  _cache[16] || (_cache[16] = createBaseVNode("span", null, "在终端中运行", -1))
                ]),
                _cache[17] || (_cache[17] = createBaseVNode("p", { class: "hint" }, "勾选后将在新终端窗口中运行脚本", -1))
              ])
            ]),
            createBaseVNode("div", _hoisted_30, [
              createBaseVNode("button", {
                class: "btn btn-secondary",
                onClick: _cache[6] || (_cache[6] = ($event) => addToolModal.value.show = false)
              }, "取消"),
              createBaseVNode("button", {
                class: "btn btn-primary",
                disabled: !addToolModal.value.name || !addToolModal.value.path,
                onClick: addTool
              }, " 添加 ", 8, _hoisted_31)
            ])
          ])
        ])) : createCommentVNode("", true)
      ]);
    };
  }
});
const ToolsPage = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-88220843"]]);
const _hoisted_1 = { class: "app-container" };
const _hoisted_2 = { class: "sidebar" };
const _hoisted_3 = { class: "nav-menu" };
const _hoisted_4 = ["onClick"];
const _hoisted_5 = { class: "nav-icon" };
const _hoisted_6 = { class: "nav-label" };
const _hoisted_7 = { class: "main-content" };
const _hoisted_8 = { class: "content-area" };
const _hoisted_9 = {
  key: 7,
  class: "coming-soon"
};
const _hoisted_10 = { class: "coming-text" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "App",
  setup(__props) {
    const currentPage = /* @__PURE__ */ ref("home");
    const pages = [
      { id: "home", icon: "🏠", label: "首页" },
      { id: "usage", icon: "📊", label: "使用情况" },
      { id: "models", icon: "🤖", label: "模型管理" },
      { id: "skills", icon: "🎯", label: "Skills设置" },
      { id: "tools", icon: "🔧", label: "小工具" },
      { id: "terminal", icon: "💻", label: "终端" },
      { id: "settings", icon: "⚙️", label: "设置" }
    ];
    function switchPage(pageId) {
      currentPage.value = pageId;
    }
    onMounted(() => {
      const unsubStart = window.api.onTriggerStartAll(() => {
        window.dispatchEvent(new CustomEvent("start-all-services"));
      });
      const unsubStop = window.api.onTriggerStopAll(() => {
        window.dispatchEvent(new CustomEvent("stop-all-services"));
      });
      onUnmounted(() => {
        unsubStart();
        unsubStop();
      });
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        _cache[2] || (_cache[2] = createBaseVNode("div", { class: "bg-effects" }, [
          createBaseVNode("div", { class: "bg-gradient bg-gradient-1" }),
          createBaseVNode("div", { class: "bg-gradient bg-gradient-2" }),
          createBaseVNode("div", { class: "bg-grid" })
        ], -1)),
        createBaseVNode("aside", _hoisted_2, [
          _cache[0] || (_cache[0] = createBaseVNode("div", { class: "sidebar-header" }, [
            createBaseVNode("div", { class: "logo" }, [
              createBaseVNode("span", { class: "logo-icon" }, "🦞"),
              createBaseVNode("span", { class: "logo-text" }, "龙虾启动器")
            ])
          ], -1)),
          createBaseVNode("nav", _hoisted_3, [
            (openBlock(), createElementBlock(Fragment, null, renderList(pages, (page) => {
              return createBaseVNode("div", {
                key: page.id,
                class: normalizeClass(["nav-item", { active: currentPage.value === page.id }]),
                onClick: ($event) => switchPage(page.id)
              }, [
                createBaseVNode("span", _hoisted_5, toDisplayString(page.icon), 1),
                createBaseVNode("span", _hoisted_6, toDisplayString(page.label), 1)
              ], 10, _hoisted_4);
            }), 64))
          ])
        ]),
        createBaseVNode("main", _hoisted_7, [
          createBaseVNode("div", _hoisted_8, [
            currentPage.value === "home" ? (openBlock(), createBlock(HomePage, { key: 0 })) : currentPage.value === "usage" ? (openBlock(), createBlock(UsagePage, { key: 1 })) : currentPage.value === "settings" ? (openBlock(), createBlock(SettingsPage, { key: 2 })) : currentPage.value === "skills" ? (openBlock(), createBlock(SkillsPage, { key: 3 })) : currentPage.value === "models" ? (openBlock(), createBlock(ModelsPage, { key: 4 })) : currentPage.value === "terminal" ? (openBlock(), createBlock(TerminalPage, { key: 5 })) : currentPage.value === "tools" ? (openBlock(), createBlock(ToolsPage, { key: 6 })) : (openBlock(), createElementBlock("div", _hoisted_9, [
              _cache[1] || (_cache[1] = createBaseVNode("span", { class: "coming-icon" }, "🚧", -1)),
              createBaseVNode("span", _hoisted_10, toDisplayString(pages.find((p2) => p2.id === currentPage.value)?.label) + " - 敬请期待", 1)
            ]))
          ])
        ])
      ]);
    };
  }
});
const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-30b56951"]]);
createApp(App).mount("#app");
