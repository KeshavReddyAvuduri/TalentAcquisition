var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.ASSUME_ES5 = false;
$jscomp.ASSUME_NO_NATIVE_MAP = false;
$jscomp.ASSUME_NO_NATIVE_SET = false;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || typeof Object.defineProperties == 'function' ? Object.defineProperty : function(target, property, descriptor) {
  descriptor = descriptor;
  if (target == Array.prototype || target == Object.prototype) {
    return;
  }
  target[property] = descriptor.value;
};
$jscomp.getGlobal = function(maybeGlobal) {
  return typeof window != 'undefined' && window === maybeGlobal ? maybeGlobal : typeof global != 'undefined' && global != null ? global : maybeGlobal;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(target, polyfill, fromLang, toLang) {
  if (!polyfill) {
    return;
  }
  var obj = $jscomp.global;
  var split = target.split('.');
  for (var i = 0; i < split.length - 1; i++) {
    var key = split[i];
    if (!(key in obj)) {
      obj[key] = {};
    }
    obj = obj[key];
  }
  var property = split[split.length - 1];
  var orig = obj[property];
  var impl = polyfill(orig);
  if (impl == orig || impl == null) {
    return;
  }
  $jscomp.defineProperty(obj, property, {configurable:true, writable:true, value:impl});
};
$jscomp.polyfill('Array.prototype.copyWithin', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, start, opt_end) {
    var len = this.length;
    target = Number(target);
    start = Number(start);
    opt_end = Number(opt_end != null ? opt_end : len);
    if (target < start) {
      opt_end = Math.min(opt_end, len);
      while (start < opt_end) {
        if (start in this) {
          this[target++] = this[start++];
        } else {
          delete this[target++];
          start++;
        }
      }
    } else {
      opt_end = Math.min(opt_end, len + start - target);
      target += opt_end - start;
      while (opt_end > start) {
        if (--opt_end in this) {
          this[--target] = this[opt_end];
        } else {
          delete this[target];
        }
      }
    }
    return this;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.SYMBOL_PREFIX = 'jscomp_symbol_';
$jscomp.initSymbol = function() {
  $jscomp.initSymbol = function() {
  };
  if (!$jscomp.global['Symbol']) {
    $jscomp.global['Symbol'] = $jscomp.Symbol;
  }
};
$jscomp.Symbol = function() {
  var counter = 0;
  function Symbol(opt_description) {
    return $jscomp.SYMBOL_PREFIX + (opt_description || '') + counter++;
  }
  return Symbol;
}();
$jscomp.initSymbolIterator = function() {
  $jscomp.initSymbol();
  var symbolIterator = $jscomp.global['Symbol'].iterator;
  if (!symbolIterator) {
    symbolIterator = $jscomp.global['Symbol'].iterator = $jscomp.global['Symbol']('iterator');
  }
  if (typeof Array.prototype[symbolIterator] != 'function') {
    $jscomp.defineProperty(Array.prototype, symbolIterator, {configurable:true, writable:true, value:function() {
      return $jscomp.arrayIterator(this);
    }});
  }
  $jscomp.initSymbolIterator = function() {
  };
};
$jscomp.arrayIterator = function(array) {
  var index = 0;
  return $jscomp.iteratorPrototype(function() {
    if (index < array.length) {
      return {done:false, value:array[index++]};
    } else {
      return {done:true};
    }
  });
};
$jscomp.iteratorPrototype = function(next) {
  $jscomp.initSymbolIterator();
  var iterator = {next:next};
  iterator[$jscomp.global['Symbol'].iterator] = function() {
    return this;
  };
  return iterator;
};
$jscomp.iteratorFromArray = function(array, transform) {
  $jscomp.initSymbolIterator();
  if (array instanceof String) {
    array = array + '';
  }
  var i = 0;
  var iter = {next:function() {
    if (i < array.length) {
      var index = i++;
      return {value:transform(index, array[index]), done:false};
    }
    iter.next = function() {
      return {done:true, value:void 0};
    };
    return iter.next();
  }};
  iter[Symbol.iterator] = function() {
    return iter;
  };
  return iter;
};
$jscomp.polyfill('Array.prototype.entries', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function() {
    return $jscomp.iteratorFromArray(this, function(i, v) {
      return [i, v];
    });
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.prototype.fill', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(value, opt_start, opt_end) {
    var length = this.length || 0;
    if (opt_start < 0) {
      opt_start = Math.max(0, length + opt_start);
    }
    if (opt_end == null || opt_end > length) {
      opt_end = length;
    }
    opt_end = Number(opt_end);
    if (opt_end < 0) {
      opt_end = Math.max(0, length + opt_end);
    }
    for (var i = Number(opt_start || 0); i < opt_end; i++) {
      this[i] = value;
    }
    return this;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.findInternal = function(array, callback, thisArg) {
  if (array instanceof String) {
    array = String(array);
  }
  var len = array.length;
  for (var i = 0; i < len; i++) {
    var value = array[i];
    if (callback.call(thisArg, value, i, array)) {
      return {i:i, v:value};
    }
  }
  return {i:-1, v:void 0};
};
$jscomp.polyfill('Array.prototype.find', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(callback, opt_thisArg) {
    return $jscomp.findInternal(this, callback, opt_thisArg).v;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.prototype.findIndex', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(callback, opt_thisArg) {
    return $jscomp.findInternal(this, callback, opt_thisArg).i;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.from', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(arrayLike, opt_mapFn, opt_thisArg) {
    $jscomp.initSymbolIterator();
    opt_mapFn = opt_mapFn != null ? opt_mapFn : function(x) {
      return x;
    };
    var result = [];
    var iteratorFunction = arrayLike[Symbol.iterator];
    if (typeof iteratorFunction == 'function') {
      arrayLike = iteratorFunction.call(arrayLike);
      var next;
      var k = 0;
      while (!(next = arrayLike.next()).done) {
        result.push(opt_mapFn.call(opt_thisArg, next.value, k++));
      }
    } else {
      var len = arrayLike.length;
      for (var i = 0; i < len; i++) {
        result.push(opt_mapFn.call(opt_thisArg, arrayLike[i], i));
      }
    }
    return result;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Object.is', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(left, right) {
    if (left === right) {
      return left !== 0 || 1 / left === 1 / right;
    } else {
      return left !== left && right !== right;
    }
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.prototype.includes', function(orig) {
  if (orig) {
    return orig;
  }
  var includes = function(searchElement, opt_fromIndex) {
    var array = this;
    if (array instanceof String) {
      array = String(array);
    }
    var len = array.length;
    var i = opt_fromIndex || 0;
    if (i < 0) {
      i = Math.max(i + len, 0);
    }
    for (; i < len; i++) {
      var element = array[i];
      if (element === searchElement || Object.is(element, searchElement)) {
        return true;
      }
    }
    return false;
  };
  return includes;
}, 'es7', 'es3');
$jscomp.polyfill('Array.prototype.keys', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function() {
    return $jscomp.iteratorFromArray(this, function(i) {
      return i;
    });
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.of', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(var_args) {
    return Array.from(arguments);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.prototype.values', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function() {
    return $jscomp.iteratorFromArray(this, function(k, v) {
      return v;
    });
  };
  return polyfill;
}, 'es8', 'es3');
$jscomp.makeIterator = function(iterable) {
  $jscomp.initSymbolIterator();
  var iteratorFunction = iterable[Symbol.iterator];
  return iteratorFunction ? iteratorFunction.call(iterable) : $jscomp.arrayIterator(iterable);
};
$jscomp.FORCE_POLYFILL_PROMISE = false;
$jscomp.polyfill('Promise', function(NativePromise) {
  if (NativePromise && !$jscomp.FORCE_POLYFILL_PROMISE) {
    return NativePromise;
  }
  function AsyncExecutor() {
    this.batch_ = null;
  }
  AsyncExecutor.prototype.asyncExecute = function(f) {
    if (this.batch_ == null) {
      this.batch_ = [];
      this.asyncExecuteBatch_();
    }
    this.batch_.push(f);
    return this;
  };
  AsyncExecutor.prototype.asyncExecuteBatch_ = function() {
    var self = this;
    this.asyncExecuteFunction(function() {
      self.executeBatch_();
    });
  };
  var nativeSetTimeout = $jscomp.global['setTimeout'];
  AsyncExecutor.prototype.asyncExecuteFunction = function(f) {
    nativeSetTimeout(f, 0);
  };
  AsyncExecutor.prototype.executeBatch_ = function() {
    while (this.batch_ && this.batch_.length) {
      var executingBatch = this.batch_;
      this.batch_ = [];
      for (var i = 0; i < executingBatch.length; ++i) {
        var f = executingBatch[i];
        executingBatch[i] = null;
        try {
          f();
        } catch (error) {
          this.asyncThrow_(error);
        }
      }
    }
    this.batch_ = null;
  };
  AsyncExecutor.prototype.asyncThrow_ = function(exception) {
    this.asyncExecuteFunction(function() {
      throw exception;
    });
  };
  var PromiseState = {PENDING:0, FULFILLED:1, REJECTED:2};
  var PolyfillPromise = function(executor) {
    this.state_ = PromiseState.PENDING;
    this.result_ = undefined;
    this.onSettledCallbacks_ = [];
    var resolveAndReject = this.createResolveAndReject_();
    try {
      executor(resolveAndReject.resolve, resolveAndReject.reject);
    } catch (e) {
      resolveAndReject.reject(e);
    }
  };
  PolyfillPromise.prototype.createResolveAndReject_ = function() {
    var thisPromise = this;
    var alreadyCalled = false;
    function firstCallWins(method) {
      return function(x) {
        if (!alreadyCalled) {
          alreadyCalled = true;
          method.call(thisPromise, x);
        }
      };
    }
    return {resolve:firstCallWins(this.resolveTo_), reject:firstCallWins(this.reject_)};
  };
  PolyfillPromise.prototype.resolveTo_ = function(value) {
    if (value === this) {
      this.reject_(new TypeError('A Promise cannot resolve to itself'));
    } else {
      if (value instanceof PolyfillPromise) {
        this.settleSameAsPromise_(value);
      } else {
        if (isObject(value)) {
          this.resolveToNonPromiseObj_(value);
        } else {
          this.fulfill_(value);
        }
      }
    }
  };
  PolyfillPromise.prototype.resolveToNonPromiseObj_ = function(obj) {
    var thenMethod = undefined;
    try {
      thenMethod = obj.then;
    } catch (error) {
      this.reject_(error);
      return;
    }
    if (typeof thenMethod == 'function') {
      this.settleSameAsThenable_(thenMethod, obj);
    } else {
      this.fulfill_(obj);
    }
  };
  function isObject(value) {
    switch(typeof value) {
      case 'object':
        return value != null;
      case 'function':
        return true;
      default:
        return false;
    }
  }
  PolyfillPromise.prototype.reject_ = function(reason) {
    this.settle_(PromiseState.REJECTED, reason);
  };
  PolyfillPromise.prototype.fulfill_ = function(value) {
    this.settle_(PromiseState.FULFILLED, value);
  };
  PolyfillPromise.prototype.settle_ = function(settledState, valueOrReason) {
    if (this.state_ != PromiseState.PENDING) {
      throw new Error('Cannot settle(' + settledState + ', ' + valueOrReason + '): Promise already settled in state' + this.state_);
    }
    this.state_ = settledState;
    this.result_ = valueOrReason;
    this.executeOnSettledCallbacks_();
  };
  PolyfillPromise.prototype.executeOnSettledCallbacks_ = function() {
    if (this.onSettledCallbacks_ != null) {
      for (var i = 0; i < this.onSettledCallbacks_.length; ++i) {
        asyncExecutor.asyncExecute(this.onSettledCallbacks_[i]);
      }
      this.onSettledCallbacks_ = null;
    }
  };
  var asyncExecutor = new AsyncExecutor;
  PolyfillPromise.prototype.settleSameAsPromise_ = function(promise) {
    var methods = this.createResolveAndReject_();
    promise.callWhenSettled_(methods.resolve, methods.reject);
  };
  PolyfillPromise.prototype.settleSameAsThenable_ = function(thenMethod, thenable) {
    var methods = this.createResolveAndReject_();
    try {
      thenMethod.call(thenable, methods.resolve, methods.reject);
    } catch (error) {
      methods.reject(error);
    }
  };
  PolyfillPromise.prototype.then = function(onFulfilled, onRejected) {
    var resolveChild;
    var rejectChild;
    var childPromise = new PolyfillPromise(function(resolve, reject) {
      resolveChild = resolve;
      rejectChild = reject;
    });
    function createCallback(paramF, defaultF) {
      if (typeof paramF == 'function') {
        return function(x) {
          try {
            resolveChild(paramF(x));
          } catch (error) {
            rejectChild(error);
          }
        };
      } else {
        return defaultF;
      }
    }
    this.callWhenSettled_(createCallback(onFulfilled, resolveChild), createCallback(onRejected, rejectChild));
    return childPromise;
  };
  PolyfillPromise.prototype['catch'] = function(onRejected) {
    return this.then(undefined, onRejected);
  };
  PolyfillPromise.prototype.callWhenSettled_ = function(onFulfilled, onRejected) {
    var thisPromise = this;
    function callback() {
      switch(thisPromise.state_) {
        case PromiseState.FULFILLED:
          onFulfilled(thisPromise.result_);
          break;
        case PromiseState.REJECTED:
          onRejected(thisPromise.result_);
          break;
        default:
          throw new Error('Unexpected state: ' + thisPromise.state_);
      }
    }
    if (this.onSettledCallbacks_ == null) {
      asyncExecutor.asyncExecute(callback);
    } else {
      this.onSettledCallbacks_.push(callback);
    }
  };
  function resolvingPromise(opt_value) {
    if (opt_value instanceof PolyfillPromise) {
      return opt_value;
    } else {
      return new PolyfillPromise(function(resolve, reject) {
        resolve(opt_value);
      });
    }
  }
  PolyfillPromise['resolve'] = resolvingPromise;
  PolyfillPromise['reject'] = function(opt_reason) {
    return new PolyfillPromise(function(resolve, reject) {
      reject(opt_reason);
    });
  };
  PolyfillPromise['race'] = function(thenablesOrValues) {
    return new PolyfillPromise(function(resolve, reject) {
      var iterator = $jscomp.makeIterator(thenablesOrValues);
      for (var iterRec = iterator.next(); !iterRec.done; iterRec = iterator.next()) {
        resolvingPromise(iterRec.value).callWhenSettled_(resolve, reject);
      }
    });
  };
  PolyfillPromise['all'] = function(thenablesOrValues) {
    var iterator = $jscomp.makeIterator(thenablesOrValues);
    var iterRec = iterator.next();
    if (iterRec.done) {
      return resolvingPromise([]);
    } else {
      return new PolyfillPromise(function(resolveAll, rejectAll) {
        var resultsArray = [];
        var unresolvedCount = 0;
        function onFulfilled(i) {
          return function(ithResult) {
            resultsArray[i] = ithResult;
            unresolvedCount--;
            if (unresolvedCount == 0) {
              resolveAll(resultsArray);
            }
          };
        }
        do {
          resultsArray.push(undefined);
          unresolvedCount++;
          resolvingPromise(iterRec.value).callWhenSettled_(onFulfilled(resultsArray.length - 1), rejectAll);
          iterRec = iterator.next();
        } while (!iterRec.done);
      });
    }
  };
  return PolyfillPromise;
}, 'es6', 'es3');
$jscomp.polyfill('Promise.prototype.finally', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(onFinally) {
    return this.then(function(value) {
      var promise = Promise.resolve(onFinally());
      return promise.then(function() {
        return value;
      });
    }, function(reason) {
      var promise = Promise.resolve(onFinally());
      return promise.then(function() {
        throw reason;
      });
    });
  };
  return polyfill;
}, 'es9', 'es3');
$jscomp.underscoreProtoCanBeSet = function() {
  var x = {a:true};
  var y = {};
  try {
    y.__proto__ = x;
    return y.a;
  } catch (e) {
  }
  return false;
};
$jscomp.setPrototypeOf = typeof Object.setPrototypeOf == 'function' ? Object.setPrototypeOf : $jscomp.underscoreProtoCanBeSet() ? function(target, proto) {
  target.__proto__ = proto;
  if (target.__proto__ !== proto) {
    throw new TypeError(target + ' is not extensible');
  }
  return target;
} : null;
$jscomp.generator = {};
$jscomp.generator.ensureIteratorResultIsObject_ = function(result) {
  if (result instanceof Object) {
    return;
  }
  throw new TypeError('Iterator result ' + result + ' is not an object');
};
$jscomp.generator.Context = function() {
  this.isRunning_ = false;
  this.yieldAllIterator_ = null;
  this.yieldResult = undefined;
  this.nextAddress = 1;
  this.catchAddress_ = 0;
  this.finallyAddress_ = 0;
  this.abruptCompletion_ = null;
  this.finallyContexts_ = null;
};
$jscomp.generator.Context.prototype.start_ = function() {
  if (this.isRunning_) {
    throw new TypeError('Generator is already running');
  }
  this.isRunning_ = true;
};
$jscomp.generator.Context.prototype.stop_ = function() {
  this.isRunning_ = false;
};
$jscomp.generator.Context.prototype.jumpToErrorHandler_ = function() {
  this.nextAddress = this.catchAddress_ || this.finallyAddress_;
};
$jscomp.generator.Context.prototype.next_ = function(value) {
  this.yieldResult = value;
};
$jscomp.generator.Context.prototype.throw_ = function(e) {
  this.abruptCompletion_ = {exception:e, isException:true};
  this.jumpToErrorHandler_();
};
$jscomp.generator.Context.prototype['return'] = function(value) {
  this.abruptCompletion_ = {'return':value};
  this.nextAddress = this.finallyAddress_;
};
$jscomp.generator.Context.prototype.jumpThroughFinallyBlocks = function(nextAddress) {
  this.abruptCompletion_ = {jumpTo:nextAddress};
  this.nextAddress = this.finallyAddress_;
};
$jscomp.generator.Context.prototype.yield = function(value, resumeAddress) {
  this.nextAddress = resumeAddress;
  return {value:value};
};
$jscomp.generator.Context.prototype.yieldAll = function(iterable, resumeAddress) {
  var iterator = $jscomp.makeIterator(iterable);
  var result = iterator.next();
  $jscomp.generator.ensureIteratorResultIsObject_(result);
  if (result.done) {
    this.yieldResult = result.value;
    this.nextAddress = resumeAddress;
    return;
  }
  this.yieldAllIterator_ = iterator;
  return this.yield(result.value, resumeAddress);
};
$jscomp.generator.Context.prototype.jumpTo = function(nextAddress) {
  this.nextAddress = nextAddress;
};
$jscomp.generator.Context.prototype.jumpToEnd = function() {
  this.nextAddress = 0;
};
$jscomp.generator.Context.prototype.setCatchFinallyBlocks = function(catchAddress, finallyAddress) {
  this.catchAddress_ = catchAddress;
  if (finallyAddress != undefined) {
    this.finallyAddress_ = finallyAddress;
  }
};
$jscomp.generator.Context.prototype.setFinallyBlock = function(finallyAddress) {
  this.catchAddress_ = 0;
  this.finallyAddress_ = finallyAddress || 0;
};
$jscomp.generator.Context.prototype.leaveTryBlock = function(nextAddress, catchAddress) {
  this.nextAddress = nextAddress;
  this.catchAddress_ = catchAddress || 0;
};
$jscomp.generator.Context.prototype.enterCatchBlock = function(nextCatchBlockAddress) {
  this.catchAddress_ = nextCatchBlockAddress || 0;
  var exception = this.abruptCompletion_.exception;
  this.abruptCompletion_ = null;
  return exception;
};
$jscomp.generator.Context.prototype.enterFinallyBlock = function(nextCatchAddress, nextFinallyAddress, finallyDepth) {
  if (!finallyDepth) {
    this.finallyContexts_ = [this.abruptCompletion_];
  } else {
    this.finallyContexts_[finallyDepth] = this.abruptCompletion_;
  }
  this.catchAddress_ = nextCatchAddress || 0;
  this.finallyAddress_ = nextFinallyAddress || 0;
};
$jscomp.generator.Context.prototype.leaveFinallyBlock = function(nextAddress, finallyDepth) {
  var preservedContext = this.finallyContexts_.splice(finallyDepth || 0)[0];
  var abruptCompletion = this.abruptCompletion_ = this.abruptCompletion_ || preservedContext;
  if (abruptCompletion) {
    if (abruptCompletion.isException) {
      return this.jumpToErrorHandler_();
    }
    if (abruptCompletion.jumpTo != undefined && this.finallyAddress_ < abruptCompletion.jumpTo) {
      this.nextAddress = abruptCompletion.jumpTo;
      this.abruptCompletion_ = null;
    } else {
      this.nextAddress = this.finallyAddress_;
    }
  } else {
    this.nextAddress = nextAddress;
  }
};
$jscomp.generator.Context.prototype.forIn = function(object) {
  return new $jscomp.generator.Context.PropertyIterator(object);
};
$jscomp.generator.Context.PropertyIterator = function(object) {
  this.object_ = object;
  this.properties_ = [];
  for (var property in object) {
    this.properties_.push(property);
  }
  this.properties_.reverse();
};
$jscomp.generator.Context.PropertyIterator.prototype.getNext = function() {
  while (this.properties_.length > 0) {
    var property = this.properties_.pop();
    if (property in this.object_) {
      return property;
    }
  }
  return null;
};
$jscomp.generator.Engine_ = function(program) {
  this.context_ = new $jscomp.generator.Context;
  this.program_ = program;
};
$jscomp.generator.Engine_.prototype.next_ = function(value) {
  this.context_.start_();
  if (this.context_.yieldAllIterator_) {
    return this.yieldAllStep_(this.context_.yieldAllIterator_.next, value, this.context_.next_);
  }
  this.context_.next_(value);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.return_ = function(value) {
  this.context_.start_();
  var yieldAllIterator = this.context_.yieldAllIterator_;
  if (yieldAllIterator) {
    var returnFunction = 'return' in yieldAllIterator ? yieldAllIterator['return'] : function(v) {
      return {value:v, done:true};
    };
    return this.yieldAllStep_(returnFunction, value, this.context_['return']);
  }
  this.context_['return'](value);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.throw_ = function(exception) {
  this.context_.start_();
  if (this.context_.yieldAllIterator_) {
    return this.yieldAllStep_(this.context_.yieldAllIterator_['throw'], exception, this.context_.next_);
  }
  this.context_.throw_(exception);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.yieldAllStep_ = function(action, value, nextAction) {
  try {
    var result = action.call(this.context_.yieldAllIterator_, value);
    $jscomp.generator.ensureIteratorResultIsObject_(result);
    if (!result.done) {
      this.context_.stop_();
      return result;
    }
    var resultValue = result.value;
  } catch (e) {
    this.context_.yieldAllIterator_ = null;
    this.context_.throw_(e);
    return this.nextStep_();
  }
  this.context_.yieldAllIterator_ = null;
  nextAction.call(this.context_, resultValue);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.nextStep_ = function() {
  while (this.context_.nextAddress) {
    try {
      var yieldValue = this.program_(this.context_);
      if (yieldValue) {
        this.context_.stop_();
        return {value:yieldValue.value, done:false};
      }
    } catch (e) {
      this.context_.yieldResult = undefined;
      this.context_.throw_(e);
    }
  }
  this.context_.stop_();
  if (this.context_.abruptCompletion_) {
    var abruptCompletion = this.context_.abruptCompletion_;
    this.context_.abruptCompletion_ = null;
    if (abruptCompletion.isException) {
      throw abruptCompletion.exception;
    }
    return {value:abruptCompletion['return'], done:true};
  }
  return {value:undefined, done:true};
};
$jscomp.generator.Generator_ = function(engine) {
  this.next = function(opt_value) {
    return engine.next_(opt_value);
  };
  this['throw'] = function(exception) {
    return engine.throw_(exception);
  };
  this['return'] = function(value) {
    return engine.return_(value);
  };
  $jscomp.initSymbolIterator();
  this[Symbol.iterator] = function() {
    return this;
  };
};
$jscomp.generator.createGenerator = function(generator, program) {
  var result = new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(program));
  if ($jscomp.setPrototypeOf) {
    $jscomp.setPrototypeOf(result, generator.prototype);
  }
  return result;
};
$jscomp.asyncExecutePromiseGenerator = function(generator) {
  function passValueToGenerator(value) {
    return generator.next(value);
  }
  function passErrorToGenerator(error) {
    return generator['throw'](error);
  }
  return new Promise(function(resolve, reject) {
    function handleGeneratorRecord(genRec) {
      if (genRec.done) {
        resolve(genRec.value);
      } else {
        Promise.resolve(genRec.value).then(passValueToGenerator, passErrorToGenerator).then(handleGeneratorRecord, reject);
      }
    }
    handleGeneratorRecord(generator.next());
  });
};
$jscomp.asyncExecutePromiseGeneratorFunction = function(generatorFunction) {
  return $jscomp.asyncExecutePromiseGenerator(generatorFunction());
};
$jscomp.asyncExecutePromiseGeneratorProgram = function(program) {
  return $jscomp.asyncExecutePromiseGenerator(new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(program)));
};
$jscomp.checkEs6ConformanceViaProxy = function() {
  try {
    var proxied = {};
    var proxy = Object.create(new $jscomp.global['Proxy'](proxied, {'get':function(target, key, receiver) {
      return target == proxied && key == 'q' && receiver == proxy;
    }}));
    return proxy['q'] === true;
  } catch (err) {
    return false;
  }
};
$jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS = false;
$jscomp.ES6_CONFORMANCE = $jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS && $jscomp.checkEs6ConformanceViaProxy();
$jscomp.owns = function(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};
$jscomp.polyfill('WeakMap', function(NativeWeakMap) {
  function isConformant() {
    if (!NativeWeakMap || !Object.seal) {
      return false;
    }
    try {
      var x = Object.seal({});
      var y = Object.seal({});
      var map = new NativeWeakMap([[x, 2], [y, 3]]);
      if (map.get(x) != 2 || map.get(y) != 3) {
        return false;
      }
      map['delete'](x);
      map.set(y, 4);
      return !map.has(x) && map.get(y) == 4;
    } catch (err) {
      return false;
    }
  }
  if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
    if (NativeWeakMap && $jscomp.ES6_CONFORMANCE) {
      return NativeWeakMap;
    }
  } else {
    if (isConformant()) {
      return NativeWeakMap;
    }
  }
  var prop = '$jscomp_hidden_' + Math.random();
  function insert(target) {
    if (!$jscomp.owns(target, prop)) {
      var obj = {};
      $jscomp.defineProperty(target, prop, {value:obj});
    }
  }
  function patch(name) {
    var prev = Object[name];
    if (prev) {
      Object[name] = function(target) {
        insert(target);
        return prev(target);
      };
    }
  }
  patch('freeze');
  patch('preventExtensions');
  patch('seal');
  var index = 0;
  var PolyfillWeakMap = function(opt_iterable) {
    this.id_ = (index += Math.random() + 1).toString();
    if (opt_iterable) {
      $jscomp.initSymbol();
      $jscomp.initSymbolIterator();
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = entry.value;
        this.set(item[0], item[1]);
      }
    }
  };
  PolyfillWeakMap.prototype.set = function(key, value) {
    insert(key);
    if (!$jscomp.owns(key, prop)) {
      throw new Error('WeakMap key fail: ' + key);
    }
    key[prop][this.id_] = value;
    return this;
  };
  PolyfillWeakMap.prototype.get = function(key) {
    return $jscomp.owns(key, prop) ? key[prop][this.id_] : undefined;
  };
  PolyfillWeakMap.prototype.has = function(key) {
    return $jscomp.owns(key, prop) && $jscomp.owns(key[prop], this.id_);
  };
  PolyfillWeakMap.prototype['delete'] = function(key) {
    if (!$jscomp.owns(key, prop) || !$jscomp.owns(key[prop], this.id_)) {
      return false;
    }
    return delete key[prop][this.id_];
  };
  return PolyfillWeakMap;
}, 'es6', 'es3');
$jscomp.MapEntry = function() {
  this.previous;
  this.next;
  this.head;
  this.key;
  this.value;
};
$jscomp.polyfill('Map', function(NativeMap) {
  function isConformant() {
    if ($jscomp.ASSUME_NO_NATIVE_MAP || !NativeMap || typeof NativeMap != 'function' || !NativeMap.prototype.entries || typeof Object.seal != 'function') {
      return false;
    }
    try {
      NativeMap = NativeMap;
      var key = Object.seal({x:4});
      var map = new NativeMap($jscomp.makeIterator([[key, 's']]));
      if (map.get(key) != 's' || map.size != 1 || map.get({x:4}) || map.set({x:4}, 't') != map || map.size != 2) {
        return false;
      }
      var iter = map.entries();
      var item = iter.next();
      if (item.done || item.value[0] != key || item.value[1] != 's') {
        return false;
      }
      item = iter.next();
      if (item.done || item.value[0].x != 4 || item.value[1] != 't' || !iter.next().done) {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  }
  if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
    if (NativeMap && $jscomp.ES6_CONFORMANCE) {
      return NativeMap;
    }
  } else {
    if (isConformant()) {
      return NativeMap;
    }
  }
  $jscomp.initSymbol();
  $jscomp.initSymbolIterator();
  var idMap = new WeakMap;
  var PolyfillMap = function(opt_iterable) {
    this.data_ = {};
    this.head_ = createHead();
    this.size = 0;
    if (opt_iterable) {
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = entry.value;
        this.set(item[0], item[1]);
      }
    }
  };
  PolyfillMap.prototype.set = function(key, value) {
    key = key === 0 ? 0 : key;
    var r = maybeGetEntry(this, key);
    if (!r.list) {
      r.list = this.data_[r.id] = [];
    }
    if (!r.entry) {
      r.entry = {next:this.head_, previous:this.head_.previous, head:this.head_, key:key, value:value};
      r.list.push(r.entry);
      this.head_.previous.next = r.entry;
      this.head_.previous = r.entry;
      this.size++;
    } else {
      r.entry.value = value;
    }
    return this;
  };
  PolyfillMap.prototype['delete'] = function(key) {
    var r = maybeGetEntry(this, key);
    if (r.entry && r.list) {
      r.list.splice(r.index, 1);
      if (!r.list.length) {
        delete this.data_[r.id];
      }
      r.entry.previous.next = r.entry.next;
      r.entry.next.previous = r.entry.previous;
      r.entry.head = null;
      this.size--;
      return true;
    }
    return false;
  };
  PolyfillMap.prototype.clear = function() {
    this.data_ = {};
    this.head_ = this.head_.previous = createHead();
    this.size = 0;
  };
  PolyfillMap.prototype.has = function(key) {
    return !!maybeGetEntry(this, key).entry;
  };
  PolyfillMap.prototype.get = function(key) {
    var entry = maybeGetEntry(this, key).entry;
    return entry && entry.value;
  };
  PolyfillMap.prototype.entries = function() {
    return makeIterator(this, function(entry) {
      return [entry.key, entry.value];
    });
  };
  PolyfillMap.prototype.keys = function() {
    return makeIterator(this, function(entry) {
      return entry.key;
    });
  };
  PolyfillMap.prototype.values = function() {
    return makeIterator(this, function(entry) {
      return entry.value;
    });
  };
  PolyfillMap.prototype.forEach = function(callback, opt_thisArg) {
    var iter = this.entries();
    var item;
    while (!(item = iter.next()).done) {
      var entry = item.value;
      callback.call(opt_thisArg, entry[1], entry[0], this);
    }
  };
  PolyfillMap.prototype[Symbol.iterator] = PolyfillMap.prototype.entries;
  var maybeGetEntry = function(map, key) {
    var id = getId(key);
    var list = map.data_[id];
    if (list && $jscomp.owns(map.data_, id)) {
      for (var index = 0; index < list.length; index++) {
        var entry = list[index];
        if (key !== key && entry.key !== entry.key || key === entry.key) {
          return {id:id, list:list, index:index, entry:entry};
        }
      }
    }
    return {id:id, list:list, index:-1, entry:undefined};
  };
  var makeIterator = function(map, func) {
    var entry = map.head_;
    return $jscomp.iteratorPrototype(function() {
      if (entry) {
        while (entry.head != map.head_) {
          entry = entry.previous;
        }
        while (entry.next != entry.head) {
          entry = entry.next;
          return {done:false, value:func(entry)};
        }
        entry = null;
      }
      return {done:true, value:void 0};
    });
  };
  var createHead = function() {
    var head = {};
    head.previous = head.next = head.head = head;
    return head;
  };
  var mapIndex = 0;
  var getId = function(obj) {
    var type = obj && typeof obj;
    if (type == 'object' || type == 'function') {
      obj = obj;
      if (!idMap.has(obj)) {
        var id = '' + ++mapIndex;
        idMap.set(obj, id);
        return id;
      }
      return idMap.get(obj);
    }
    return 'p_' + obj;
  };
  return PolyfillMap;
}, 'es6', 'es3');
$jscomp.polyfill('Math.acosh', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    return Math.log(x + Math.sqrt(x * x - 1));
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.asinh', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x === 0) {
      return x;
    }
    var y = Math.log(Math.abs(x) + Math.sqrt(x * x + 1));
    return x < 0 ? -y : y;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.log1p', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x < 0.25 && x > -0.25) {
      var y = x;
      var d = 1;
      var z = x;
      var zPrev = 0;
      var s = 1;
      while (zPrev != z) {
        y *= x;
        s *= -1;
        z = (zPrev = z) + s * y / ++d;
      }
      return z;
    }
    return Math.log(1 + x);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.atanh', function(orig) {
  if (orig) {
    return orig;
  }
  var log1p = Math.log1p;
  var polyfill = function(x) {
    x = Number(x);
    return (log1p(x) - log1p(-x)) / 2;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.cbrt', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    if (x === 0) {
      return x;
    }
    x = Number(x);
    var y = Math.pow(Math.abs(x), 1 / 3);
    return x < 0 ? -y : y;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.clz32', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x) >>> 0;
    if (x === 0) {
      return 32;
    }
    var result = 0;
    if ((x & 4294901760) === 0) {
      x <<= 16;
      result += 16;
    }
    if ((x & 4278190080) === 0) {
      x <<= 8;
      result += 8;
    }
    if ((x & 4026531840) === 0) {
      x <<= 4;
      result += 4;
    }
    if ((x & 3221225472) === 0) {
      x <<= 2;
      result += 2;
    }
    if ((x & 2147483648) === 0) {
      result++;
    }
    return result;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.cosh', function(orig) {
  if (orig) {
    return orig;
  }
  var exp = Math.exp;
  var polyfill = function(x) {
    x = Number(x);
    return (exp(x) + exp(-x)) / 2;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.expm1', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x < .25 && x > -.25) {
      var y = x;
      var d = 1;
      var z = x;
      var zPrev = 0;
      while (zPrev != z) {
        y *= x / ++d;
        z = (zPrev = z) + y;
      }
      return z;
    }
    return Math.exp(x) - 1;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.hypot', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x, y, var_args) {
    x = Number(x);
    y = Number(y);
    var i, z, sum;
    var max = Math.max(Math.abs(x), Math.abs(y));
    for (i = 2; i < arguments.length; i++) {
      max = Math.max(max, Math.abs(arguments[i]));
    }
    if (max > 1e100 || max < 1e-100) {
      if (!max) {
        return max;
      }
      x = x / max;
      y = y / max;
      sum = x * x + y * y;
      for (i = 2; i < arguments.length; i++) {
        z = Number(arguments[i]) / max;
        sum += z * z;
      }
      return Math.sqrt(sum) * max;
    } else {
      sum = x * x + y * y;
      for (i = 2; i < arguments.length; i++) {
        z = Number(arguments[i]);
        sum += z * z;
      }
      return Math.sqrt(sum);
    }
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.imul', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(a, b) {
    a = Number(a);
    b = Number(b);
    var ah = a >>> 16 & 65535;
    var al = a & 65535;
    var bh = b >>> 16 & 65535;
    var bl = b & 65535;
    var lh = ah * bl + al * bh << 16 >>> 0;
    return al * bl + lh | 0;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.log10', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return Math.log(x) / Math.LN10;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.log2', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return Math.log(x) / Math.LN2;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.sign', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    return x === 0 || isNaN(x) ? x : x > 0 ? 1 : -1;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.sinh', function(orig) {
  if (orig) {
    return orig;
  }
  var exp = Math.exp;
  var polyfill = function(x) {
    x = Number(x);
    if (x === 0) {
      return x;
    }
    return (exp(x) - exp(-x)) / 2;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.tanh', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x === 0) {
      return x;
    }
    var y = Math.exp(-2 * Math.abs(x));
    var z = (1 - y) / (1 + y);
    return x < 0 ? -z : z;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.trunc', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (isNaN(x) || x === Infinity || x === -Infinity || x === 0) {
      return x;
    }
    var y = Math.floor(Math.abs(x));
    return x < 0 ? -y : y;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Number.EPSILON', function(orig) {
  return Math.pow(2, -52);
}, 'es6', 'es3');
$jscomp.polyfill('Number.MAX_SAFE_INTEGER', function() {
  return 9007199254740991;
}, 'es6', 'es3');
$jscomp.polyfill('Number.MIN_SAFE_INTEGER', function() {
  return -9007199254740991;
}, 'es6', 'es3');
$jscomp.polyfill('Number.isFinite', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    if (typeof x !== 'number') {
      return false;
    }
    return !isNaN(x) && x !== Infinity && x !== -Infinity;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Number.isInteger', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    if (!Number.isFinite(x)) {
      return false;
    }
    return x === Math.floor(x);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Number.isNaN', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return typeof x === 'number' && isNaN(x);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Number.isSafeInteger', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return Number.isInteger(x) && Math.abs(x) <= Number.MAX_SAFE_INTEGER;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Number.parseFloat', function(orig) {
  return orig || parseFloat;
}, 'es6', 'es3');
$jscomp.polyfill('Number.parseInt', function(orig) {
  return orig || parseInt;
}, 'es6', 'es3');
$jscomp.assign = typeof Object.assign == 'function' ? Object.assign : function(target, var_args) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    if (!source) {
      continue;
    }
    for (var key in source) {
      if ($jscomp.owns(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};
$jscomp.polyfill('Object.assign', function(orig) {
  return orig || $jscomp.assign;
}, 'es6', 'es3');
$jscomp.polyfill('Object.entries', function(orig) {
  if (orig) {
    return orig;
  }
  var entries = function(obj) {
    var result = [];
    for (var key in obj) {
      if ($jscomp.owns(obj, key)) {
        result.push([key, obj[key]]);
      }
    }
    return result;
  };
  return entries;
}, 'es8', 'es3');
$jscomp.polyfill('Object.getOwnPropertySymbols', function(orig) {
  if (orig) {
    return orig;
  }
  return function() {
    return [];
  };
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.ownKeys', function(orig) {
  if (orig) {
    return orig;
  }
  var symbolPrefix = 'jscomp_symbol_';
  function isSymbol(key) {
    return key.substring(0, symbolPrefix.length) == symbolPrefix;
  }
  var polyfill = function(target) {
    var keys = [];
    var names = Object.getOwnPropertyNames(target);
    var symbols = Object.getOwnPropertySymbols(target);
    for (var i = 0; i < names.length; i++) {
      (isSymbol(names[i]) ? symbols : keys).push(names[i]);
    }
    return keys.concat(symbols);
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Object.getOwnPropertyDescriptors', function(orig) {
  if (orig) {
    return orig;
  }
  var getOwnPropertyDescriptors = function(obj) {
    var result = {};
    var keys = Reflect.ownKeys(obj);
    for (var i = 0; i < keys.length; i++) {
      result[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
    }
    return result;
  };
  return getOwnPropertyDescriptors;
}, 'es8', 'es5');
$jscomp.polyfill('Object.setPrototypeOf', function(orig) {
  return orig || $jscomp.setPrototypeOf;
}, 'es6', 'es5');
$jscomp.polyfill('Object.values', function(orig) {
  if (orig) {
    return orig;
  }
  var values = function(obj) {
    var result = [];
    for (var key in obj) {
      if ($jscomp.owns(obj, key)) {
        result.push(obj[key]);
      }
    }
    return result;
  };
  return values;
}, 'es8', 'es3');
$jscomp.polyfill('Reflect.apply', function(orig) {
  if (orig) {
    return orig;
  }
  var apply = Function.prototype.apply;
  var polyfill = function(target, thisArg, argList) {
    return apply.call(target, thisArg, argList);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.objectCreate = $jscomp.ASSUME_ES5 || typeof Object.create == 'function' ? Object.create : function(prototype) {
  var ctor = function() {
  };
  ctor.prototype = prototype;
  return new ctor;
};
$jscomp.construct = function() {
  function reflectConstructWorks() {
    function Base() {
    }
    function Derived() {
    }
    new Base;
    Reflect.construct(Base, [], Derived);
    return new Base instanceof Base;
  }
  if (typeof Reflect != 'undefined' && Reflect.construct) {
    if (reflectConstructWorks()) {
      return Reflect.construct;
    }
    var brokenConstruct = Reflect.construct;
    var patchedConstruct = function(target, argList, opt_newTarget) {
      var out = brokenConstruct(target, argList);
      if (opt_newTarget) {
        Reflect.setPrototypeOf(out, opt_newTarget.prototype);
      }
      return out;
    };
    return patchedConstruct;
  }
  function construct(target, argList, opt_newTarget) {
    if (opt_newTarget === undefined) {
      opt_newTarget = target;
    }
    var proto = opt_newTarget.prototype || Object.prototype;
    var obj = $jscomp.objectCreate(proto);
    var apply = Function.prototype.apply;
    var out = apply.call(target, obj, argList);
    return out || obj;
  }
  return construct;
}();
$jscomp.polyfill('Reflect.construct', function(orig) {
  return $jscomp.construct;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.defineProperty', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey, attributes) {
    try {
      Object.defineProperty(target, propertyKey, attributes);
      var desc = Object.getOwnPropertyDescriptor(target, propertyKey);
      if (!desc) {
        return false;
      }
      return desc.configurable === (attributes.configurable || false) && desc.enumerable === (attributes.enumerable || false) && ('value' in desc ? desc.value === attributes.value && desc.writable === (attributes.writable || false) : desc.get === attributes.get && desc.set === attributes.set);
    } catch (err) {
      return false;
    }
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.deleteProperty', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey) {
    if (!$jscomp.owns(target, propertyKey)) {
      return true;
    }
    try {
      return delete target[propertyKey];
    } catch (err) {
      return false;
    }
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.getOwnPropertyDescriptor', function(orig) {
  return orig || Object.getOwnPropertyDescriptor;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.getPrototypeOf', function(orig) {
  return orig || Object.getPrototypeOf;
}, 'es6', 'es5');
$jscomp.findDescriptor = function(target, propertyKey) {
  var obj = target;
  while (obj) {
    var property = Reflect.getOwnPropertyDescriptor(obj, propertyKey);
    if (property) {
      return property;
    }
    obj = Reflect.getPrototypeOf(obj);
  }
  return undefined;
};
$jscomp.polyfill('Reflect.get', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey, opt_receiver) {
    if (arguments.length <= 2) {
      return target[propertyKey];
    }
    var property = $jscomp.findDescriptor(target, propertyKey);
    if (property) {
      return property.get ? property.get.call(opt_receiver) : property.value;
    }
    return undefined;
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.has', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey) {
    return propertyKey in target;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.isExtensible', function(orig) {
  if (orig) {
    return orig;
  }
  if ($jscomp.ASSUME_ES5 || typeof Object.isExtensible == 'function') {
    return Object.isExtensible;
  }
  return function() {
    return true;
  };
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.preventExtensions', function(orig) {
  if (orig) {
    return orig;
  }
  if (!($jscomp.ASSUME_ES5 || typeof Object.preventExtensions == 'function')) {
    return function() {
      return false;
    };
  }
  var polyfill = function(target) {
    Object.preventExtensions(target);
    return !Object.isExtensible(target);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.set', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey, value, opt_receiver) {
    var property = $jscomp.findDescriptor(target, propertyKey);
    if (!property) {
      if (Reflect.isExtensible(target)) {
        target[propertyKey] = value;
        return true;
      }
      return false;
    }
    if (property.set) {
      property.set.call(arguments.length > 3 ? opt_receiver : target, value);
      return true;
    } else {
      if (property.writable && !Object.isFrozen(target)) {
        target[propertyKey] = value;
        return true;
      }
    }
    return false;
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.setPrototypeOf', function(orig) {
  if (orig) {
    return orig;
  } else {
    if ($jscomp.setPrototypeOf) {
      var setPrototypeOf = $jscomp.setPrototypeOf;
      var polyfill = function(target, proto) {
        try {
          setPrototypeOf(target, proto);
          return true;
        } catch (e) {
          return false;
        }
      };
      return polyfill;
    } else {
      return null;
    }
  }
}, 'es6', 'es5');
$jscomp.polyfill('Set', function(NativeSet) {
  function isConformant() {
    if ($jscomp.ASSUME_NO_NATIVE_SET || !NativeSet || typeof NativeSet != 'function' || !NativeSet.prototype.entries || typeof Object.seal != 'function') {
      return false;
    }
    try {
      NativeSet = NativeSet;
      var value = Object.seal({x:4});
      var set = new NativeSet($jscomp.makeIterator([value]));
      if (!set.has(value) || set.size != 1 || set.add(value) != set || set.size != 1 || set.add({x:4}) != set || set.size != 2) {
        return false;
      }
      var iter = set.entries();
      var item = iter.next();
      if (item.done || item.value[0] != value || item.value[1] != value) {
        return false;
      }
      item = iter.next();
      if (item.done || item.value[0] == value || item.value[0].x != 4 || item.value[1] != item.value[0]) {
        return false;
      }
      return iter.next().done;
    } catch (err) {
      return false;
    }
  }
  if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
    if (NativeSet && $jscomp.ES6_CONFORMANCE) {
      return NativeSet;
    }
  } else {
    if (isConformant()) {
      return NativeSet;
    }
  }
  $jscomp.initSymbol();
  $jscomp.initSymbolIterator();
  var PolyfillSet = function(opt_iterable) {
    this.map_ = new Map;
    if (opt_iterable) {
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = entry.value;
        this.add(item);
      }
    }
    this.size = this.map_.size;
  };
  PolyfillSet.prototype.add = function(value) {
    value = value === 0 ? 0 : value;
    this.map_.set(value, value);
    this.size = this.map_.size;
    return this;
  };
  PolyfillSet.prototype['delete'] = function(value) {
    var result = this.map_['delete'](value);
    this.size = this.map_.size;
    return result;
  };
  PolyfillSet.prototype.clear = function() {
    this.map_.clear();
    this.size = 0;
  };
  PolyfillSet.prototype.has = function(value) {
    return this.map_.has(value);
  };
  PolyfillSet.prototype.entries = function() {
    return this.map_.entries();
  };
  PolyfillSet.prototype.values = function() {
    return this.map_.values();
  };
  PolyfillSet.prototype.keys = PolyfillSet.prototype.values;
  PolyfillSet.prototype[Symbol.iterator] = PolyfillSet.prototype.values;
  PolyfillSet.prototype.forEach = function(callback, opt_thisArg) {
    var set = this;
    this.map_.forEach(function(value) {
      return callback.call(opt_thisArg, value, value, set);
    });
  };
  return PolyfillSet;
}, 'es6', 'es3');
$jscomp.checkStringArgs = function(thisArg, arg, func) {
  if (thisArg == null) {
    throw new TypeError("The 'this' value for String.prototype." + func + ' must not be null or undefined');
  }
  if (arg instanceof RegExp) {
    throw new TypeError('First argument to String.prototype.' + func + ' must not be a regular expression');
  }
  return thisArg + '';
};
$jscomp.polyfill('String.prototype.codePointAt', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(position) {
    var string = $jscomp.checkStringArgs(this, null, 'codePointAt');
    var size = string.length;
    position = Number(position) || 0;
    if (!(position >= 0 && position < size)) {
      return void 0;
    }
    position = position | 0;
    var first = string.charCodeAt(position);
    if (first < 55296 || first > 56319 || position + 1 === size) {
      return first;
    }
    var second = string.charCodeAt(position + 1);
    if (second < 56320 || second > 57343) {
      return first;
    }
    return (first - 55296) * 1024 + second + 9216;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('String.prototype.endsWith', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(searchString, opt_position) {
    var string = $jscomp.checkStringArgs(this, searchString, 'endsWith');
    searchString = searchString + '';
    if (opt_position === void 0) {
      opt_position = string.length;
    }
    var i = Math.max(0, Math.min(opt_position | 0, string.length));
    var j = searchString.length;
    while (j > 0 && i > 0) {
      if (string[--i] != searchString[--j]) {
        return false;
      }
    }
    return j <= 0;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('String.fromCodePoint', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(var_args) {
    var result = '';
    for (var i = 0; i < arguments.length; i++) {
      var code = Number(arguments[i]);
      if (code < 0 || code > 1114111 || code !== Math.floor(code)) {
        throw new RangeError('invalid_code_point ' + code);
      }
      if (code <= 65535) {
        result += String.fromCharCode(code);
      } else {
        code -= 65536;
        result += String.fromCharCode(code >>> 10 & 1023 | 55296);
        result += String.fromCharCode(code & 1023 | 56320);
      }
    }
    return result;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('String.prototype.includes', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(searchString, opt_position) {
    var string = $jscomp.checkStringArgs(this, searchString, 'includes');
    return string.indexOf(searchString, opt_position || 0) !== -1;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('String.prototype.repeat', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(copies) {
    var string = $jscomp.checkStringArgs(this, null, 'repeat');
    if (copies < 0 || copies > 1342177279) {
      throw new RangeError('Invalid count value');
    }
    copies = copies | 0;
    var result = '';
    while (copies) {
      if (copies & 1) {
        result += string;
      }
      if (copies >>>= 1) {
        string += string;
      }
    }
    return result;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.stringPadding = function(padString, padLength) {
  var padding = padString !== undefined ? String(padString) : ' ';
  if (!(padLength > 0) || !padding) {
    return '';
  }
  var repeats = Math.ceil(padLength / padding.length);
  return padding.repeat(repeats).substring(0, padLength);
};
$jscomp.polyfill('String.prototype.padEnd', function(orig) {
  if (orig) {
    return orig;
  }
  var padEnd = function(targetLength, opt_padString) {
    var string = $jscomp.checkStringArgs(this, null, 'padStart');
    var padLength = targetLength - string.length;
    return string + $jscomp.stringPadding(opt_padString, padLength);
  };
  return padEnd;
}, 'es8', 'es3');
$jscomp.polyfill('String.prototype.padStart', function(orig) {
  if (orig) {
    return orig;
  }
  var padStart = function(targetLength, opt_padString) {
    var string = $jscomp.checkStringArgs(this, null, 'padStart');
    var padLength = targetLength - string.length;
    return $jscomp.stringPadding(opt_padString, padLength) + string;
  };
  return padStart;
}, 'es8', 'es3');
$jscomp.polyfill('String.prototype.startsWith', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(searchString, opt_position) {
    var string = $jscomp.checkStringArgs(this, searchString, 'startsWith');
    searchString = searchString + '';
    var strLen = string.length;
    var searchLen = searchString.length;
    var i = Math.max(0, Math.min(opt_position | 0, string.length));
    var j = 0;
    while (j < searchLen && i < strLen) {
      if (string[i++] != searchString[j++]) {
        return false;
      }
    }
    return j >= searchLen;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.arrayFromIterator = function(iterator) {
  var i;
  var arr = [];
  while (!(i = iterator.next()).done) {
    arr.push(i.value);
  }
  return arr;
};
$jscomp.arrayFromIterable = function(iterable) {
  if (iterable instanceof Array) {
    return iterable;
  } else {
    return $jscomp.arrayFromIterator($jscomp.makeIterator(iterable));
  }
};
$jscomp.inherits = function(childCtor, parentCtor) {
  childCtor.prototype = $jscomp.objectCreate(parentCtor.prototype);
  childCtor.prototype.constructor = childCtor;
  if ($jscomp.setPrototypeOf) {
    var setPrototypeOf = $jscomp.setPrototypeOf;
    setPrototypeOf(childCtor, parentCtor);
  } else {
    for (var p in parentCtor) {
      if (p == 'prototype') {
        continue;
      }
      if (Object.defineProperties) {
        var descriptor = Object.getOwnPropertyDescriptor(parentCtor, p);
        if (descriptor) {
          Object.defineProperty(childCtor, p, descriptor);
        }
      } else {
        childCtor[p] = parentCtor[p];
      }
    }
  }
  childCtor.superClass_ = parentCtor.prototype;
};
$jscomp.polyfill('WeakSet', function(NativeWeakSet) {
  function isConformant() {
    if (!NativeWeakSet || !Object.seal) {
      return false;
    }
    try {
      var x = Object.seal({});
      var y = Object.seal({});
      var set = new NativeWeakSet([x]);
      if (!set.has(x) || set.has(y)) {
        return false;
      }
      set['delete'](x);
      set.add(y);
      return !set.has(x) && set.has(y);
    } catch (err) {
      return false;
    }
  }
  if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
    if (NativeWeakSet && $jscomp.ES6_CONFORMANCE) {
      return NativeWeakSet;
    }
  } else {
    if (isConformant()) {
      return NativeWeakSet;
    }
  }
  var PolyfillWeakSet = function(opt_iterable) {
    this.map_ = new WeakMap;
    if (opt_iterable) {
      $jscomp.initSymbol();
      $jscomp.initSymbolIterator();
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = entry.value;
        this.add(item);
      }
    }
  };
  PolyfillWeakSet.prototype.add = function(elem) {
    this.map_.set(elem, true);
    return this;
  };
  PolyfillWeakSet.prototype.has = function(elem) {
    return this.map_.has(elem);
  };
  PolyfillWeakSet.prototype['delete'] = function(elem) {
    return this.map_['delete'](elem);
  };
  return PolyfillWeakSet;
}, 'es6', 'es3');
try {
  if (Array.prototype.values.toString().indexOf('[native code]') == -1) {
    delete Array.prototype.values;
  }
} catch (e) {
}
Ext.define('JobOpenings.model.filtertoolbar.EducationModel', {extend:'Ext.data.Model', fields:[{name:'ddo_jobeducation_id', type:'number'}, {name:'name', type:'string'}]});
Ext.define('JobOpenings.model.filtertoolbar.FilterbyApplicationStatus', {extend:'Ext.data.Model', fields:[{name:'ddo_jobapplicationstatus_id', type:'number'}, {name:'name', type:'string'}]});
Ext.define('JobOpenings.model.filtertoolbar.FilterbyStatus', {extend:'Ext.data.Model', fields:[{name:'ddo_jobopeningstatus_id', type:'number'}, {name:'name', type:'string'}]});
Ext.define('JobOpenings.model.filtertoolbar.HiringSourceCombo', {extend:'Ext.data.Model', fields:[{name:'ddo_jobhiringsource_id', type:'number'}, {name:'name', type:'string'}]});
Ext.define('JobOpenings.model.filtertoolbar.JobOpeningsDateStore', {extend:'Ext.data.Model', fields:[{name:'name', type:'string'}]});
Ext.define('JobOpenings.model.filtertoolbar.JobSkillsTypeStore', {extend:'Ext.data.Model', fields:[{name:'ddo_skills_id', type:'number'}, {name:'name', type:'string'}]});
Ext.define('JobOpenings.model.filtertoolbar.RatingModel', {extend:'Ext.data.Model', fields:[{name:'ddo_interviewrating_id', type:'number'}, {name:'name', type:'string'}]});
Ext.define('JobOpenings.model.filtertoolbar.TagModel', {extend:'Ext.data.Model', fields:[{name:'loc_id'}, {name:'loc_name'}]});
Ext.define('JobOpenings.model.form.InterviewModel', {extend:'Ext.data.Model', fields:['employeeid', 'employeename']});
Ext.define('JobOpenings.model.form.LocationModel', {extend:'Ext.data.Model', fields:[{name:'ddo_joblocation_id'}, {name:'name'}]});
Ext.define('JobOpenings.model.form.SkillsModel', {extend:'Ext.data.Model', fields:['ddo_skills_id', 'name']});
Ext.define('JobOpenings.model.jobopeningrequest.JobOpeningsRequestDataModel', {extend:'Ext.data.Model', fields:[{name:'title', type:'string'}, {name:'noofpositions', type:'number'}, {name:'minworkexperience', type:'number'}, {name:'maxworkexperience', type:'number'}, {name:'ddo_department_id', type:'number'}, {name:'description', convert:function(value, record) {
  return Ext.util.Format.stripTags(record.data.job_desc);
}}, {name:'recruiter_name'}, {name:'count'}, {name:'jobupdateddate'}, {name:'skill_ids', type:'string'}, {name:'ddo_joblocation_id', type:'number'}, {name:'interviewers_ids', type:'string'}, {name:'ddo_jobopening_id', type:'number'}, {name:'ddo_jobopeningstatus_id', type:'number'}]});
Ext.define('JobOpenings.model.jobopeningrequest.RecruiterList', {extend:'Ext.data.Model', fields:['recruiter_name', {convert:function(value, record) {
  record.data['recruiter_name'] = record.data['firstname'];
  delete record.data.firstname;
}}, 'employee_id']});
Ext.define('JobOpenings.store.filtertoolbar.EducationStore', {extend:'Ext.data.Store', alias:'store.educationstore', storeId:'educationStore', model:'JobOpenings.model.filtertoolbar.EducationModel', autoLoad:false, proxy:{type:'ajax', url:'jobapplication/getJobeducation', reader:{type:'json', rootProperty:'data'}}});
Ext.define('JobOpenings.store.filtertoolbar.FilterbyApplicationStatus', {extend:'Ext.data.Store', alias:'store.filterbyapplicationstatus', storeId:'applicationStatus', model:'JobOpenings.model.filtertoolbar.FilterbyApplicationStatus', autoLoad:false, proxy:{type:'ajax', url:'jobappinterview/appstatus', reader:{type:'json', rootProperty:'data'}}});
Ext.define('JobOpenings.store.filtertoolbar.FilterbyStatus', {extend:'Ext.data.Store', alias:'store.filterbyStatus', storeId:'status', model:'JobOpenings.model.filtertoolbar.FilterbyStatus', autoLoad:false, proxy:{type:'ajax', url:'jobopeningrequest/getJobStatusData', reader:{type:'json', rootProperty:'data'}}});
Ext.define('JobOpenings.store.filtertoolbar.HiringSourceCombo', {extend:'Ext.data.Store', alias:'store.hiringsourcecombo', storeId:'hiringSourceCombo', model:'JobOpenings.model.filtertoolbar.HiringSourceCombo', autoLoad:false, proxy:{type:'ajax', url:'jobapplication/hiringsource', reader:{type:'json', rootProperty:'data'}}});
Ext.define('JobOpenings.store.filtertoolbar.IdTypeCombo', {extend:'Ext.data.Store', alias:'store.idtypecombo', storeId:'idtypecombo', autoLoad:false, proxy:{type:'ajax', url:'resources/data/jobapplications/idtypes.json', reader:{type:'json', rootProperty:'data'}}});
Ext.define('JobOpenings.store.filtertoolbar.JobOpeningsDateStore', {extend:'Ext.data.Store', alias:'store.jobopeningsdatestore', storeId:'jobopeningsdatestore', model:'JobOpenings.model.filtertoolbar.JobOpeningsDateStore', proxy:{type:'ajax', url:'resources/data/jobopenings/filterstoolbar/filterbydate.json', reader:{type:'json', rootProperty:'filterbyDate'}}});
Ext.define('JobOpenings.store.filtertoolbar.JobSkillsTypeStore', {extend:'Ext.data.Store', alias:'store.jobskillstypestore', storeId:'jobSkillsStore', model:'JobOpenings.model.filtertoolbar.JobSkillsTypeStore', autoLoad:false, proxy:{type:'ajax', url:'skill/combo', reader:{type:'json', rootProperty:'data'}}});
Ext.define('JobOpenings.store.filtertoolbar.RatingStore', {extend:'Ext.data.Store', alias:'store.ratingstore', storeId:'ratingStore', model:'JobOpenings.model.filtertoolbar.RatingModel', autoLoad:false, proxy:{type:'ajax', url:'jobappinterview/getInterviewRating', reader:{type:'json', rootProperty:'data'}}});
Ext.define('JobOpenings.store.filtertoolbar.TagStore', {extend:'Ext.data.Store', alias:'store.tagstore', storeId:'location', model:'JobOpenings.model.filtertoolbar.TagModel', data:{items:[{loc_id:1, loc_name:'test'}]}, proxy:{type:'ajax', reader:{type:'json', rootProperty:'items'}}});
Ext.define('JobOpenings.store.form.LocationStore', {extend:'Ext.data.Store', alias:'store.locationstore', requires:['JobOpenings.model.form.LocationModel'], model:'JobOpenings.model.form.LocationModel', autoLoad:false, storeId:'joblocationstore', proxy:{type:'ajax', url:'/jobopeningrequest/getLocationData', reader:{type:'json', rootProperty:'data'}}});
Ext.define('JobOpenings.store.jobapplications.ApplicationStatus', {extend:'Ext.data.Store', alias:'store.applicationstatus', autoLoad:false, proxy:{type:'ajax', url:'resources/data/jobapplications/jobapplicationstatus.json', reader:{type:'json', rootProperty:'data'}}});
Ext.define('JobOpenings.store.jobapplications.IdCardType', {extend:'Ext.data.Store', alias:'store.applicationstatus', autoLoad:false, proxy:{type:'ajax', url:'resources/data/jobapplications/jobapplicationstatus.json', reader:{type:'json', rootProperty:'types'}}});
Ext.define('JobOpenings.store.jobopeningrequest.JobOpeningsRecruiter', {extend:'Ext.data.Store', alias:'store.jobopeningsrecruiter', storeId:'jobopeningsrecruiter', requires:['JobOpenings.model.jobopeningrequest.JobOpeningsRequestDataModel'], model:'JobOpenings.model.jobopeningrequest.JobOpeningsRequestDataModel', autoLoad:false, proxy:{type:'ajax', url:'/jobopeningrequest/getRecruitersList', reader:{type:'json', rootProperty:'data'}}});
Ext.define('JobOpenings.store.jobopeningrequest.RecruiterList', {extend:'Ext.data.Store', alias:'store.recruiterlist', requires:['JobOpenings.model.jobopeningrequest.RecruiterList'], model:'JobOpenings.model.jobopeningrequest.RecruiterList', autoLoad:false, proxy:{type:'ajax', url:'/jobopeningrequest/getRecruitersList', reader:{type:'json', rootProperty:'data'}}});
Ext.define('JobOpenings.view.alljobapplications.AllJobApplicationsUtil', {singleton:true, alternateClassName:['Util'], convertFileToJson:function(fileField, callback) {
  var file = fileField.fileInputEl.dom.files[0];
  var fileType = file.name.substr(file.name.lastIndexOf('.') + 1);
  var reader = new FileReader;
  reader.onload = function(e) {
    var data = e.target.result;
    var wb, output;
    var arr = fixdata(data);
    switch(fileType) {
      case 'xlsx':
      case 'xlsm':
      case 'xlsb':
      case 'xls':
        wb = X.read(btoa(arr), {type:'base64'});
        output = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        console.log(output);
        break;
      default:
        output = false;
    }
    callback(output);
  };
  reader.readAsArrayBuffer(file);
}});
Ext.define('JobOpenings.view.alljobapplications.AllJobApplicationsController', {extend:'Ext.app.ViewController', alias:'controller.alljobapplicationscontroller', requires:['JobOpenings.view.alljobapplications.AllJobApplicationsUtil'], onGridRowClick:function(ele, record, item, index, e, eOpts) {
  var mainView = Ext.ComponentQuery.query('[reference \x3d alljobapplicationreference]')[0], form = Ext.ComponentQuery.query('alljobapplicationsformviewmode')[0], jobportalField = Ext.ComponentQuery.query('[reference \x3d portalref]')[0];
  mainView.getLayout().setActiveItem(1);
  var myObj = {fnameView:record.data.appfirstname, lnameView:record.data.applastname, jobtitlenameView:record.data.currentjobtitle ? record.data.currentjobtitle.split('\x26apos;').join("'") : null, yearsnameView:record.data.workexpyears, monthsnameView:record.data.workexpmonths, skillsnameView:record.data.skillnames ? record.data.skillnames.join(', ') : null, locationnameView:record.data.currentlocation, educationnameView:record.data.education, univnameView:record.data.collegename, mobilenameView:record.data.mobile, 
  emailnameView:record.data.emailid, hiringnameView:record.data.name, portalnameView:record.data.jobportalname, appResumeView:record.data.resumename, identificationType:record.data.ddo_jobidentificationtype_id, identificationNumber:record.data.identification_num};
  form.reset();
  form.getForm().setValues(myObj);
  if (myObj.portalnameView == null) {
    jobportalField.hide();
  }
  Ext.ComponentQuery.query('[reference \x3d title_applicationCreatRef]')[0].setHtml(window.sessionStorage.newApplicationHead + '/' + 'View Application');
}, onKeyUpAllJobSearch:function(searchfield, record, eOpts) {
  var me = this.getView();
  var checkView = Ext.ComponentQuery.query('alljobapplications')[0].getLayout().getActiveItem().reference == 'alljobapplicationsgridviewref' ? true : false;
  var toGetReferenceView = Ext.ComponentQuery.query('alljobapplicationstoolbar')[0];
  if (searchfield.value.length >= 3) {
    this.searchJob(searchfield, checkView);
  } else {
    if (searchfield.value.length == 0) {
      var store = this.getViewModel().getStore('allJobAllicationsGridViewStore');
      store.clearFilter(true);
      store.load();
    }
  }
}, searchJob:function(searchfield, checkView) {
  var searchString = searchfield.value, dataview = Ext.ComponentQuery.query('[reference \x3d alljobapplicationsgridviewref]')[0], datviewStore = this.getViewModel().getStore('allJobAllicationsGridViewStore');
  if (datviewStore) {
    datviewStore.clearFilter(true);
    if (checkView) {
      var obj = {'property':'ddo_jobopeningstatus_id', 'value':1};
      datviewStore.addFilter(obj);
    }
    if (searchString.length >= 3) {
      datviewStore.filterBy(function(record) {
        var status = false, recruiter = false, appfirstname = false;
        if (appfirstname || record.data.recruiter) {
          var result = record.data.recruiter.search(new RegExp(searchString, 'gi'));
          if (result == 0) {
            recruiter = true;
          }
        }
        if (recruiter == false) {
          if (record.data.appfirstname) {
            appfirstname = true;
            var result = record.data.appfirstname.search(new RegExp(searchString, 'gi'));
          }
        }
        return result >= 0 && true;
      }, this);
    } else {
      if (searchString.length == 0) {
        datviewStore.clearFilter(true);
        datviewStore.load();
      }
    }
  }
}, onAllJobApplicationBackButtonClick:function() {
  Ext.ComponentQuery.query('[reference \x3d alljobapplicationreference]')[0].getLayout().setActiveItem(0);
}, exceluploadClick:function(ele, e, eOpts) {
  var me = this.getView();
  Ext.create('JobOpenings.view.alljobapplications.AllJobApplicationExcelFileUploadWindow', {vmStore:me.getViewModel().getStore('allJobAllicationsGridViewStore')}).show();
}, buttonOnlyChange:function(field, value, eval, e, eOpts) {
  var me = this, viewModel = me.getViewModel(), fileValue = field.value;
  rec = value.replace('C:\\fakepath\\', '');
  viewModel.set('resumePath2', rec);
  var uploadBtn = Ext.ComponentQuery.query('[reference \x3d excelfileuploadbtn]')[0];
  uploadBtn.setText(rec);
}, uploadExcelfile:function(btn, e, options) {
  var formRef = btn.up('form');
  var store = btn.up('window').vmStore;
  var win = btn.up('window');
  var combox = formRef.down('combobox');
  ddo_jobopening_id = combox.value;
  if (formRef.isValid()) {
    var formField = formRef.down('filefield');
    formField.ddo_jobopening_id = combox.value;
    JobOpenings.view.alljobapplications.AllJobApplicationsUtil.convertFileToJson(formField, function(data) {
      var formatedArray = data.map(function(el) {
        var o = Object.assign({}, el);
        o.ddo_jobopening_id = combox.value;
        return o;
      });
      if (formatedArray) {
        params = {applications:formatedArray};
        Ext.Ajax.request({url:'/jobapplication/jobapplications', method:'POST', scope:this, jsonData:params, success:function(resp) {
          var res = Ext.decode(resp.responseText), msg = res.message;
          store.load();
          win.close();
          console.log(data);
          Ext.Msg.alert('success', msg);
        }});
      } else {
        Ext.toast('Invalid File Format', 'Message', 't');
      }
    });
  } else {
    Ext.toast('Please upload the file', 'Message', 't');
  }
}});
Ext.define('JobOpenings.view.alljobapplications.AllJobApplicationsViewModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.alljobapplicationsviewmodel', reference:'alljobapplicationsref', data:{viewHide:false, initialInterviewShow:false, cancelformshow:true, awaitingfeedviewHide:true, addSch:false, feedbackData:'', resumePath:'', resumePath2:'Choose File', filtervalue:'', saveBtnDisable:true, uploadBtnForEditShow:true}, stores:{allJobAllicationsGridViewStore:{storeId:'allJobAllicationsGridViewStore', 
autoLoad:true, proxy:{type:'ajax', api:{read:'/jobapplication'}, reader:{type:'json', rootProperty:'data'}}}}});
Ext.define('JobOpenings.view.alljobapplications.AllJobApplicationsExcelFileupload', {extend:'Ext.form.Panel', xtype:'alljobapplicationsexcelfileupload', width:'100%', layout:{type:'vbox', pack:'center', align:'middle'}, requires:['JobOpenings.view.alljobapplications.AllJobApplicationsController', 'JobOpenings.view.alljobapplications.AllJobApplicationsViewModel'], viewModel:'alljobapplicationsviewmodel', controller:'alljobapplicationscontroller', items:[{xtype:'combobox', reference:'selectjobopeningref', 
name:'title', labelAlign:'top', width:300, style:'margin-left:190px !important;', fieldLabel:'Select Job Opening', allowBlank:false, tpl:Ext.create('Ext.XTemplate', '\x3cul class\x3d"x-list-plain"\x3e\x3ctpl for\x3d"."\x3e', '\x3cli role\x3d"option" class\x3d"x-boundlist-item" style\x3d"text-align:center;"\x3e{title}\x3c/li\x3e', '\x3c/tpl\x3e\x3c/ul\x3e'), displayTpl:Ext.create('Ext.XTemplate', '\x3ctpl for\x3d"."\x3e', '{title}', '\x3c/tpl\x3e'), cls:'requestCombo-cls selectjob-combo', queryMode:'local', 
displayField:'title', editable:false, valueField:'ddo_jobopening_id', emptyText:'Select', autoLoadOnValue:true}, {anchor:'100%', xtype:'filefield', opType:'upload', name:'appResume', iconCls:'upload-cls', reference:'referralfileuploadref', buttonOnly:true, allowBlank:false, listeners:{change:'buttonOnlyChange'}, bind:{value:'{resumePath}'}, buttonConfig:{cls:'upload-btn', width:180, iconCls:'x-fa fa-upload', iconAlign:'right', reference:'excelfileuploadbtn', text:'Choose File', name:'uploadid', bind:{text:'{resumePath2}'}}, 
fieldLabel:'Upload Excel:'}], bbar:[{xtype:'toolbar', width:'100%', margin:'0 0 30 0', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', text:'Upload', formBind:true, width:150, cls:'filter-submit-btn', listeners:{click:'uploadExcelfile'}}, {xtype:'tbfill'}]}]});
Ext.define('JobOpenings.view.alljobapplications.AllJobApplicationExcelFileUploadWindow', {extend:'Ext.window.Window', xtype:'allJobApplicationexcelfileuploadwindow', requires:['JobOpenings.view.alljobapplications.AllJobApplicationsExcelFileupload'], title:'Upload Excel File', modal:true, minHeight:200, maxHeight:300, width:620, margin:'5 50 0 0', layout:{type:'fit'}, closeAction:'hide', reference:'alljobapplicationexcelfileuploadwinref', resizable:false, cls:'ddo-filter-window', title:'Upload Excel File', 
initComponent:function() {
  var me = this;
  me.callParent(arguments);
  me.mon(Ext.getBody(), 'click', function(el, e) {
    me.close(me.closeAction);
  }, me, {delegate:'.x-mask'});
}, items:[{xtype:'alljobapplicationsexcelfileupload'}]});
Ext.define('JobOpenings.view.alljobapplications.AllJobApplicationsFormViewMode', {extend:'Ext.form.Panel', alias:'widget.alljobapplicationsformviewmode', cls:'form-cls apply-form', defaults:{width:'50%', labelAlign:'right', labelWidth:180, padding:5, labelStyle:'font-size:16px;'}, reference:'alljobApplicationFormViewModeRef', layout:{type:'vbox', align:'middle', pack:'center'}, title:'Job Application', buttonAlign:'center', items:[{xtype:'textfield', name:'fnameView', fieldLabel:'First Name:', readOnly:true, 
afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'textfield', name:'lnameView', readOnly:true, fieldLabel:'Last Name:', afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'textfield', name:'jobtitlenameView', readOnly:true, fieldLabel:'Current Job Title:', afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'fieldcontainer', 
fieldLabel:'Work Experience', cls:'fieldcontainer-cls', layout:'hbox', afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e', combineErrors:true, defaults:{padding:10, msgTarget:'side', flex:1, labelWidth:50, anchor:'70%'}, items:[{xtype:'textfield', readOnly:true, fieldLabel:'Years', name:'yearsnameView'}, {xtype:'textfield', readOnly:true, fieldLabel:'Months', name:'monthsnameView'}]}, {xtype:'textfield', fieldLabel:'Skills:', name:'skillsnameView', 
border:5, afterLabelTextTpl:'\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e', readOnly:true}, {xtype:'textfield', name:'locationnameView', readOnly:true, fieldLabel:'Current Location:', afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'textfield', fieldLabel:'Education:', name:'educationnameView', readOnly:true, afterLabelTextTpl:'\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e'}, {xtype:'textfield', name:'univnameView', 
readOnly:true, fieldLabel:'College / University:', afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'textfield', name:'mobilenameView', fieldLabel:'Mobile:', readOnly:true, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'textfield', name:'emailnameView', readOnly:true, fieldLabel:'Email Address', afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, 
{xtype:'fieldcontainer', cls:'fieldcontainer-cls', layout:'hbox', defaults:{msgTarget:'side', flex:1, anchor:'65%', labelStyle:'font-size:16px;'}, items:[{xtype:'textfield', name:'hiringnameView', readOnly:true, labelWidth:110, margin:'0 10 0 68', fieldLabel:'Hiring Source:', afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'textfield', name:'portalnameView', reference:'portalref', readOnly:true, fieldLabel:'Job Portal Name:', labelAlign:'right', 
afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}]}, {xtype:'fieldcontainer', cls:'fieldcontainer-cls', layout:'hbox', defaults:{msgTarget:'side', flex:1, anchor:'65%', labelStyle:'font-size:16px;'}, items:[{xtype:'combobox', name:'identificationType', emptyText:'Select', emptyCls:'referrals-empty-text', labelWidth:110, labelAlign:'right', margin:'0 10 0 68', fieldLabel:'Id Type:', readOnly:true, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, 
{xtype:'textfield', name:'identificationNumber', emptyText:'Select', fieldLabel:'Id Number:', emptyCls:'referrals-empty-text', readOnly:true, labelAlign:'right', maskRe:/^[A-Za-z0-9]*$/, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}]}, {xtype:'fieldcontainer', defaults:{width:'100%', labelAlign:'right', labelWidth:180, padding:5, labelStyle:'font-size:16px;'}, items:[{xtype:'textfield', anchor:'100%', name:'appResumeView', opType:'upload', 
iconCls:'upload-cls', afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e', fieldLabel:'Upload CV :', readOnly:true}]}]});
Ext.define('JobOpenings.view.alljobapplications.AllJobApplicationViewMode', {extend:'Ext.panel.Panel', alias:'widget.alljobapplicationviewmode', requires:['JobOpenings.view.alljobapplications.AllJobApplicationsFormViewMode', 'JobOpenings.view.alljobapplications.AllJobApplicationsController', 'JobOpenings.view.alljobapplications.AllJobApplicationsViewModel'], viewModel:{type:'alljobapplicationsviewmodel'}, controller:'alljobapplicationscontroller', cls:'job-header', tools:[{xtype:'button', scale:'medium', 
iconCls:'goalsbackbtn-cls', cls:'jobback-btn-cls', style:{border:0}, listeners:{click:'onAllJobApplicationBackButtonClick'}}, {xtype:'label', html:'Back', cls:'backlabel-cls'}, {xtype:'label', html:'Intern UI Development/View Application Details', cls:'titlelabel-cls', reference:'title_applicationCreatRef', margin:20}], items:[{xtype:'alljobapplicationsformviewmode'}]});
Ext.define('JobOpenings.view.alljobapplications.AllJobApplicationsToolbar', {extend:'Ext.panel.Panel', xtype:'alljobapplicationstoolbar', reference:'alljobapplicationstoolbarref', layout:{type:'hbox', width:'100%'}, cls:'filtertoolbar-cls', items:[{xtype:'button', width:6, cls:'karmascore-search-icon-field job-search-icon', height:6}, {xtype:'textfield', width:'30%', reference:'alljobapplicationssearchref', emptyText:'Search', enableKeyEvents:true, cls:'karmascore-search-field searchFields job-search-field', 
listeners:{change:'onKeyUpAllJobSearch'}}, {xtype:'tbfill'}, {xtype:'button', text:'Download Excel Template', width:170, height:35, textAlign:'center', cls:'alljobapplicationsexceltemp-btn-cls', href:'/resources/excelfileformat/ExcelUpload.xlsx', target:'_blank'}, {xtype:'button', text:'Upload Excel', width:100, height:35, textAlign:'center', cls:'create-new-btn-cls', listeners:{click:'exceluploadClick'}}, {xtype:'tbspacer', width:19}]});
Ext.define('JobOpenings.view.alljobapplications.AllJobApplicationsGridView', {extend:'Ext.container.Container', xtype:'alljobapplicationsgridview', reference:'alljobapplicationsgridviewref', requires:['JobOpenings.view.alljobapplications.AllJobApplicationsController', 'JobOpenings.view.alljobapplications.AllJobApplicationsToolbar'], controller:'alljobapplicationscontroller', viewModel:{type:'alljobapplicationsviewmodel'}, margin:'0 0 0 10', items:[{xtype:'container', html:'\x3cdiv class\x3d"jobtitle-cls"\x3eAll Job Applications\x3c/div\x3e'}, 
{xtype:'alljobapplicationstoolbar'}, {xtype:'grid', maxHeight:420, width:'98%', loadMask:true, margin:'0 0 10 10', cls:'karmalist-cls', style:'border:1px solid #efe8e8; background: black;', columns:[{text:'Candidate Name', flex:0.4, dataIndex:'appfirstname', cls:'grid-cls'}, {text:'Job Opening', flex:0.5, dataIndex:'title', cls:'grid-cls'}, {text:'Experience', flex:0.3, dataIndex:'minworkexperience', cls:'grid-cls'}, {text:'Skills', flex:0.4, dataIndex:'skillnames', cls:'grid-cls'}, {text:'Email', 
flex:0.5, dataIndex:'emailid', cls:'grid-cls'}, {text:'Mobile', flex:0.4, dataIndex:'mobile', cls:'grid-cls'}, {text:'Location', flex:0.3, dataIndex:'currentlocation', cls:'grid-cls'}, {text:'Recruiter', flex:0.3, dataIndex:'recruiter', cls:'grid-cls'}], listeners:{itemclick:'onGridRowClick'}}]});
Ext.define('JobOpenings.view.alljobapplications.AllJobApplications', {extend:'Ext.container.Container', xtype:'alljobapplications', requires:['JobOpenings.view.alljobapplications.AllJobApplicationsGridView', 'JobOpenings.view.alljobapplications.AllJobApplicationViewMode'], layout:{type:'card', activeItem:0}, margin:'10 0 0 10', reference:'alljobapplicationreference', items:[{xtype:'alljobapplicationsgridview', id:'alljobapplicationsId'}, {xtype:'alljobapplicationviewmode', id:'alljobapplicationviewmodeId'}]});
Ext.define('JobOpenings.view.applicationenquiry.ApplicationEnquiryController', {extend:'Ext.app.ViewController', alias:'controller.applicationenquirycontroller', onReadClick:function(sender, record) {
  var view = this.getView(), form = view.down('form').getForm(), values = form.getValues();
  var params = {ddo_jobidentificationtype_id:values.idtype, identification_num:values.idnumber};
  var url = '/jobapplication/getIdDetails';
  var method = 'GET';
  Ext.Ajax.request({url:url, method:method, scope:this, params:params, success:function(response, options) {
    var resp = Ext.decode(response.responseText);
    var store = this.getStore('gridstore');
    var data = {name:resp.data[0].lastname + ' ' + resp.data[0].firstname, email:resp.data[0].emailid};
    store.removeAll();
    store.add(data);
    Ext.ComponentQuery.query('[reference \x3d enquiryDetails]')[0].setHidden(false);
    Ext.ComponentQuery.query('[reference \x3d enquiryDetailsNotfoundref]')[0].hide();
    Ext.ComponentQuery.query('[reference \x3d selectType]')[0].hide();
  }, failure:function(response, options) {
    var store = this.getStore('gridstore');
    var data = {name:'--', email:'--'};
    store.removeAll();
    store.add(data);
    Ext.ComponentQuery.query('[reference \x3d enquiryDetailsNotfoundref]')[0].setHidden(false);
    Ext.ComponentQuery.query('[reference \x3d enquiryDetails]')[0].hide();
    Ext.ComponentQuery.query('[reference \x3d selectType]')[0].hide();
  }});
}});
Ext.define('JobOpenings.view.applicationenquiry.ApplicationEnquiryModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.enquiryviewmodel', stores:{gridstore:{autoLoad:false, fields:['name', 'email'], data:[{name:'--', email:'--'}]}}});
Ext.define('JobOpenings.view.applicationenquiry.ApplicationViewForm', {extend:'Ext.form.Panel', alias:'widget.applicationviewform', cls:'enquiry-cls', reference:'applicationform', margin:'20 0', title:'Application Details', items:[{xtype:'form', cls:'job-header', margin:'30 185', width:657, style:'border:1px solid #DEDEDE; padding-top: 15px;', reference:'jobopenform', layout:{type:'vbox', align:'middle', pack:'center'}, border:false, buttonAlign:'center', defaults:{width:'60%', labelAlign:'center', 
labelWidth:180, left:120, padding:5, labelStyle:'font-size:16px;'}, items:[{xtype:'combobox', reference:'myCombo', name:'idtype', fieldLabel:'Identification Type', cls:'enquiry-cls1', emptyText:'Identification Type', emptyCls:'referrals-empty-text', store:Ext.create('JobOpenings.store.filtertoolbar.IdTypeCombo'), displayField:'id_type', editable:false, valueField:'ddo_jobidentificationtype_id', afterLabelTextTpl:'\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e'}, {xtype:'textfield', 
name:'idnumber', required:true, maskRe:/^[0-9]*$/, minLength:10, maxLength:10, enforceMaxLength:true, reference:'jobtitleref', fieldLabel:'Identification Number', emptyText:'Mobile Number', emptyCls:'referrals-empty-text', allowBlank:false, afterLabelTextTpl:'\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e'}], buttons:[{text:'Verify', cls:'verifybtn-cls', margin:'0 0', width:'120px', formBind:true, listeners:{click:'onReadClick'}}]}, {xtype:'label', hidden:false, reference:'selectType', 
html:'Please select the identification type', cls:'textmsglabel-cls'}, {xtype:'label', hidden:true, reference:'enquiryDetails', html:'Application found for the given identification details', cls:'textmsglabel-cls'}, {xtype:'label', hidden:true, reference:'enquiryDetailsNotfoundref', html:'No matching application found for the given identification details!', cls:'textmsglabelnodata-cls'}, {xtype:'gridpanel', height:100, width:657, cls:'karmalist-cls enquiry-cls', style:'margin-left: 185px;border:1px solid #efe8e8; background: black;', 
columns:[{text:'Name', dataIndex:'name', flex:0.3}, {text:'Email ID', dataIndex:'email', flex:0.4}]}]});
Ext.define('JobOpenings.view.applicationenquiry.ApplicationEnquiry', {extend:'Ext.panel.Panel', xtype:'applicationenquiry', requires:['JobOpenings.view.applicationenquiry.ApplicationEnquiryController', 'JobOpenings.view.applicationenquiry.ApplicationEnquiryModel', 'JobOpenings.view.applicationenquiry.ApplicationViewForm'], layout:{type:'card'}, controller:'applicationenquirycontroller', viewModel:{type:'enquiryviewmodel'}, margin:'10 0 0 10', reference:'applicationenquiryreference', items:[{xtype:'applicationviewform'}]});
Ext.define('JobOpenings.view.interviewrequest.InterviewRequestController', {extend:'Ext.app.ViewController', alias:'controller.interviewrequestcontroller', beforeRender:function() {
  Ext.Ajax.request({url:'jobappinterview/getInterviewRating', method:'GET', scope:this, success:function(resp, b, data, f, g, h) {
    window.sessionStorage.getRatingStr = resp.responseText;
  }, failure:function(resp, b) {
  }});
  Ext.Ajax.request({url:'jobapplication/getJobeducation', method:'GET', scope:this, success:function(resp, b, data, f, g, h) {
    window.sessionStorage.myEduTypeArr = resp.responseText;
  }, failure:function(resp, b) {
  }});
}, onBackClick:function(item) {
  Ext.Msg.confirm('Confirm', 'Are you sure you want to go back?', function(btnText) {
    if (btnText === 'no') {
    } else {
      if (btnText === 'yes') {
        Ext.ComponentQuery.query('[reference \x3d jobapplicationreference]')[0].getLayout().setActiveItem(0);
      }
    }
  }, this);
}, onIntervReqClick:function(vw, record, item, index, e, eOpts) {
  if (e.target.innerText == 'Interview') {
    window.sessionStorage.renderingData = JSON.stringify(record.data);
    window.sessionStorage.ddo_jobapplication_id_forApplStatus = record.data.ddo_jobapplication;
    window.sessionStorage.ddo_jobapplicationstatus_id = record.data.ddo_jobapplicationstatus_id;
    var recTitle = record.data.currentjobtitle, recFirstname = record.data.firstname;
    if (recTitle.length > 30) {
      recTitle = recTitle.substring(0, 27) + '...';
    }
    if (recFirstname.length > 20) {
      recFirstname = recFirstname.substring(0, 17) + '...';
    }
    Ext.ComponentQuery.query('[reference \x3d interviewRequest_interviewTitleRef]')[0].setHtml(recTitle + '/' + recFirstname + '/' + 'Interview');
    Ext.ComponentQuery.query('[reference \x3d interviewreference]')[0].getLayout().setActiveItem(1);
    Ext.ComponentQuery.query('interviewrequestfeedbackmain')[0].items.items[1].items.items[0].store.loadRawData(record);
    var params = {ddo_jobapplicationinterview_id:record.data.ddo_jobapplicationinterview_id};
    Ext.Ajax.request({url:'/jobappinterview', method:'GET', scope:this, params:params, success:function(resp, b, data, f, g, h) {
      Ext.ComponentQuery.query('interviewrequestfeedbackview')[0].items.items[0].store.loadRawData(JSON.parse(resp.responseText));
      Ext.ComponentQuery.query('interviewrequestfeedbackview')[0].items.items[0].store.sort('updated', 'DESC');
      Ext.ComponentQuery.query('interviewrequestfeedbackview')[0].items.items[0].store.filter({property:'ddo_jobapplication_id', id:'fil_ddo_jobapplication_id', anyMatch:true, caseSensitie:false, value:record.data.ddo_jobapplication_id}, record.data.ddo_jobapplication_id, false);
      Ext.ComponentQuery.query('interviewrequestfeedbackview')[0].items.items[0].store.filter({property:'ddo_jobinterviewstatus_id', id:'fil_ddo_jobinterviewstatus_id', anyMatch:true, caseSensitie:false, value:/[1-2]/}, /[1-2]/, false);
      var getLoggedInUserId = Ext.getStore('login').data.items[0].data;
      Ext.ComponentQuery.query('interviewrequestfeedbackview')[0].items.items[0].store.filter({property:'interviewer_id', id:'by_interviewer_id', anyMatch:true, caseSensitie:false, value:getLoggedInUserId.ddo_employee_id}, getLoggedInUserId.ddo_employee_id, false);
    }, failure:function(resp, b) {
      var data = Ext.decode(resp.responseText);
      Ext.toast(data.message, false, 't');
    }});
  }
}, onKeyUpJobSearch:function(searchfield, e, eOpts) {
  var toGetReferenceView = this.getReferences().interviewrequestlistview;
  this.searchJob(toGetReferenceView.down('textfield'));
}, searchJob:function(searchfield) {
  var searchString = searchfield.value, dataview = this.getReferences().interviewdatalistview, datviewStore = dataview.getStore();
  if (datviewStore) {
    datviewStore.clearFilter(true);
    datviewStore.filterBy(function(record) {
      var result = record.data.firstname.search(new RegExp(searchString, 'gi'));
      return result >= 0;
    }, this);
  }
}, interviewRequestCancelClick:function(vw, record, item, index, e, eOpts) {
  var params = {ddo_jobapplicationinterview_id:JSON.parse(window.sessionStorage.renderingData).ddo_jobapplicationinterview_id, feedback:'', ddo_interviewrating_id:3};
  Ext.Ajax.request({url:'/jobappinterview', method:'PUT', scope:this, params:params, success:function(resp, b, data, f, g, h) {
    var msg = JSON.parse(resp.responseText).message;
    item.children[0].children[1].children[4].children[0].value = '';
    Ext.ComponentQuery.query('interviewrequestdesign')[0].getViewModel().getStore('interviewRequestListStore').load({params:{loginuser_id:Ext.getStore('login').data.items['0'].data.ddo_employee_id}});
    Ext.Msg.alert('success', msg);
  }, failure:function(resp, b) {
    var data = Ext.decode(resp.responseText);
    Ext.toast(data.message, false, 't');
  }});
}, interviewRequestSubmitClick:function(vw, record, item, index, e, eOpts) {
  var xRatingStr = JSON.parse(window.sessionStorage.getRatingStr), sectedText = item.children[0].children[1].children[4].children[0].children[1].outerText.split('\n')[0].trim();
  ratingId = null;
  xRatingStr.data.forEach(function(item) {
    if (sectedText == item.name.trim()) {
      ratingId = item.ddo_interviewrating_id;
    }
  });
  var params = {ddo_jobapplicationinterview_id:JSON.parse(window.sessionStorage.renderingData).ddo_jobapplicationinterview_id, feedback:item.children[0].children[1].children[5].children[0].value, ddo_interviewrating_id:ratingId, ddo_jobinterviewstatus_id:2};
  Ext.Ajax.request({url:'/jobappinterview', method:'PUT', scope:this, params:params, success:function(resp, b, data, f, g, h) {
    var msg = JSON.parse(resp.responseText).message;
    Ext.ComponentQuery.query('interviewrequestdesign')[0].getViewModel().getStore('interviewRequestListStore').load({params:{loginuser_id:Ext.getStore('login').data.items['0'].data.ddo_employee_id}});
    Ext.Msg.alert('success', msg);
  }, failure:function(resp, b) {
    var data = Ext.decode(resp.responseText);
    Ext.toast(data.message, false, 't');
  }});
}, ratingsCheckClick:function(vw, record, item, index, e, eOpts) {
  if (e.target.lastChild != null && e.target.className == 'act-cls') {
    if (e.target.lastChild.classList.value !== 'act-showcls') {
      item.children[0].children[1].children[4].children[0].children[1].children[0].children[1].className = 'act-showcls';
    } else {
      item.children[0].children[1].children[4].children[0].children[1].children[0].children[1].className = 'act-removecls';
    }
  } else {
    if (e.target.className == 'lili') {
      window.sessionStorage.intervw_req_feedback = true;
      var innerTxt = e.target.innerText;
      var xRatingStr = JSON.parse(window.sessionStorage.getRatingStr);
      var liHtml = '';
      xRatingStr.data.forEach(function(item) {
        liHtml += '\x3cli class\x3d"lili" value\x3d"' + item.ddo_interviewrating_id + '"\x3e' + item.name + '\x3c/li\x3e';
      });
      item.children[0].children[1].children[4].children[0].innerHTML = '\x3cimg class\x3d"intvwratingimg-cls" src\x3d"resources/images/feeds/likes/' + innerTxt + '.png"\x3e\x3cdiv style\x3d"position:absolute;"\x3e\x3cdiv class\x3d"act-cls"\x3e' + innerTxt + ' \x3ci class\x3d"x-fa fa-sort-desc arrow-cls"\x3e\x3c/i\x3e\x3cdiv class\x3d"act-showcls"\x3e\x3cul\x3e' + liHtml + '\x3c/ul\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e';
    }
    item.children[0].children[1].children[4].children[0].children[1].children[0].children[1].className = 'act-removecls';
    if (e.target.innerText == 'Submit') {
      if (item.children[0].children[1].children[5].children[0].value != '') {
        item.children[0].children[1].children[5].children[0].readOnly = true;
        this.interviewRequestSubmitClick(vw, record, item, index, e, eOpts);
      } else {
        Ext.toast('Feed Back Required!', false, 't');
      }
    }
    if (e.target.innerText == 'Cancel') {
      item.children[0].children[1].children[5].children[0].readOnly = false;
      this.interviewRequestCancelClick(vw, record, item, index, e, eOpts);
    }
    if (e.target.tagName == 'TEXTAREA') {
      window.sessionStorage.intervw_req_feedback = true;
    }
  }
}});
Ext.define('JobOpenings.view.jobopeningrequest.filtertoolbar.FilterViewModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.filterviewmodel', data:{locationName:'', ddo_jobopening_id:'', filtervalue:''}, stores:{locationStore:{autoLoad:false, proxy:{type:'ajax', url:'jobopeningrequest/getLocationData', reader:{type:'json', rootProperty:'data'}}}, departmentStore:{autoLoad:false, proxy:{type:'ajax', url:'dashboard/getDepartmentNames', reader:{type:'json', rootProperty:'data'}}}, interviewrsStore:{autoLoad:false, 
proxy:{type:'ajax', url:'utility/getempbasiclist', reader:{type:'json', rootProperty:'data'}}}, skillsStore:{autoLoad:false, storeId:'skillsstore', proxy:{type:'ajax', url:'skill/combo', reader:{type:'json', rootProperty:'data'}}}, jobOpeningDataViewStore:{autoLoad:false, proxy:{type:'ajax', url:'jobopeningrequest', reader:{type:'json', rootProperty:'data'}}, sorters:[{property:'jobupdateddate', direction:'DESC'}]}, jobRecruiterStore:{autoLoad:false, proxy:{type:'ajax', url:'/jobopeningrequest/getRecruitersList', 
reader:{type:'json', rootProperty:'data'}}}, jobReferralsDataViewStore:{autoLoad:false, proxy:{type:'ajax', url:'jobopeningrequest', reader:{type:'json', rootProperty:'data'}}, sorters:[{property:'jobupdateddate', direction:'DESC'}], filters:[{property:'ddo_jobopeningstatus_id', value:1}]}}});
Ext.define('JobOpenings.view.interviewrequest.Interviewlistview', {extend:'Ext.panel.Panel', xtype:'interviewlistview', requires:['JobOpenings.store.filtertoolbar.FilterbyStatus', 'JobOpenings.view.jobopeningrequest.filtertoolbar.FilterViewModel'], viewModel:{type:'filterviewmodel'}, reference:'interviewrequestlistview', layout:{type:'hbox', width:'100%'}, cls:'filtertoolbar-cls', items:[{xtype:'button', width:6, cls:'karmascore-search-icon-field job-search-icon', height:6, padding:'-8 11 14 12'}, 
{xtype:'textfield', width:'30%', reference:'jobsearchref_interv_req', enableKeyEvents:true, emptyText:'Search', cls:'karmascore-search-field searchFields job-search-field', listeners:{keyup:'onKeyUpJobSearch'}}]});
Ext.define('JobOpenings.view.interviewrequest.InterviewRequestModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.interviewrequestmodel', data:{locationName:''}, stores:{interviewRequestListStore:{autoLoad:false, proxy:{type:'ajax', url:'/jobappinterview/getinterviewrequests', method:'GET', reader:{type:'json', rootProperty:'data'}}, sorters:[{property:'updated', direction:'DESC'}]}, interviewReqFeedBackStore:{autoLoad:false, proxy:{type:'ajax', url:'/jobappinterview', method:'GET', reader:{type:'json', 
rootProperty:'data'}}}}});
Ext.define('JobOpenings.view.interviewrequest.InterviewRequestDesign', {extend:'Ext.container.Container', xtype:'interviewrequestdesign', requires:['JobOpenings.view.interviewrequest.Interviewlistview', 'JobOpenings.view.interviewrequest.InterviewRequestModel', 'JobOpenings.view.interviewrequest.InterviewRequestController'], cls:'myInterviewReq-cls noscrollbar', reference:'interviewlistview', viewModel:{type:'interviewrequestmodel'}, controller:'interviewrequestcontroller', items:[{xtype:'container', 
html:'\x3cdiv class\x3d"jobtitle-cls"\x3eInterview Request\x3c/div\x3e'}, {xtype:'interviewlistview'}, {xtype:'dataview', reference:'interviewdatalistview', cls:'jobdataviewcls', emptyText:'\x3cdiv class\x3d"projects-emptytext-cls"\x3eNo Interviews are schduled\x3c/div\x3e', itemTpl:['\x3cdiv class\x3d"intervReqCls"\x3e', '\x3cdiv class\x3d"jobsdiv-cls ddo-jobopening-item"\x3e', '\x3cdiv class\x3d"title-div-cls" data-qtip\x3d"{firstname}-{lastname}"\x3e\x3cspan class\x3d"title-cls"\x3e{[this.showName(values)]}\x3c/span\x3e', 
'\x3cspan\x3e | \x3c/span\x3e', '\x3cspan class\x3d"creator-cls"\x3e{[this.showCurrentjobtitle(values)]}\x3c/span\x3e', '\x3cdiv class\x3d"interview-cls"\x3eInterview\x3ci class\x3d"interview-iconcls arrow-cls"\x3e\x3c/i\x3e\x3c/span\x3e\x3c/div\x3e', '\x3c/div\x3e', '\x3cdiv class\x3d"loc-exp-interviewexp"\x3e\x3cspan\x3e\x3ci class\x3d"exp-iconcls arrow-cls"\x3e\x3c/i\x3e\x26nbsp{workexpyears}.{workexpmonths} Years Experience \x3c/span\x3e', '\x3cspan\x3e\x3ci class\x3d"location-iconcls arrow-cls"\x3e\x3c/i\x3e\x26nbsp{[this.showCurrentlocation(values)]}\x3c/span\x3e', 
'\x3c/div\x3e', '\x3cdiv class\x3d"loc-exp-interviewskill"\x3e\x3ci class\x3d"skill-iconcls arrow-cls"\x3e\x3c/i\x3e\x26nbsp{[this.showSkill(values)]}\x3c/div\x3e', '\x3cdiv class\x3d"loc-exp-interviewdec"\x3e', '\x3c/div\x3e', '\x3c/div\x3e', '\x3cdiv class\x3d"status-div-cls-interviewreq myInterviewReq_details_bottom" style\x3d"height:72px;"\x3e', '\x3cdiv class\x3d"status-div-phone"\x3e\x3cspan\x3e{[this.showIntervwType(values)]}\x3c/div\x3e', '\x3cdiv class\x3d"status-div-date"\x3e\x3cspan\x3e\x3ci class\x3d"date_iconcls_intrvw_req2 "\x3e\x3c/i\x3e\x26nbsp {[this.showDate(values)]} \x26nbsp \x26nbsp\x3c/span\x3e\x3c/div\x3e', 
'\x3cdiv class\x3d"status-div-time"\x3e\x3cspan\x3e\x3ci class\x3d"time_iconcls_intrvw_req2 "\x3e\x3c/i\x3e\x26nbsp {[this.showIntrvwTime(values)]} \x26nbsp \x26nbsp\x3c/span\x3e\x3c/div\x3e', '\x3c/div\x3e', '\x3c/div\x3e', {showCurrentlocation:function(values) {
  var currentlocation = values.currentlocation;
  if (currentlocation.length > 15) {
    return currentlocation.substring(0, 12) + '...';
  } else {
    return currentlocation;
  }
}, showCurrentjobtitle:function(values) {
  var currentjobtitle = values.currentjobtitle;
  if (currentjobtitle.length > 12) {
    return currentjobtitle.substring(0, 9) + '...';
  } else {
    return currentjobtitle;
  }
}, showName:function(values) {
  var fullname = values.firstname + ' ' + values.lastname;
  if (fullname.length > 20) {
    return fullname.substring(0, 17) + '...';
  } else {
    return fullname;
  }
}, showSkill:function(values) {
  var skillStr = '';
  try {
    var skillsArr = values.skillnames;
    skillsArr.forEach(function(item, index) {
      skillStr += skillsArr.length - 1 != index ? '#' + item + ', ' : '#' + item;
    });
  } catch (exce) {
  }
  if (skillStr.length > 29) {
    return skillStr.substring(0, 26) + '...';
  } else {
    return skillStr;
  }
}, showDate:function(values) {
  var intervwDate = values.interviewdate;
  return Ext.Date.format(new Date(intervwDate), 'd-m-Y');
}, showIntrvwTime:function(values) {
  return values.interviewtime.replace('-', '.');
}, showIntervwType:function(values) {
  if (values.interviewmode == 1) {
    return "\x3cspan\x3e\x3ci class\x3d'phone_iconcls_intrvw_req2 '\x3e\x3c/i\x3e\x26nbsp  Telephonic \x26nbsp \x26nbsp\x3c/span\x3e";
  }
  if (values.interviewmode == 2) {
    return "\x3cspan\x3e\x3ci class\x3d'skype_iconcls_intrvw_req2 '\x3e\x3c/i\x3e\x26nbsp Skype  \x26nbsp \x26nbsp\x3c/span\x3e";
  } else {
    return "\x3cspan\x3e\x3ci class\x3d'people_iconcls_intrvw_req2 '\x3e\x3c/i\x3e\x26nbsp Face-to-Face  \x26nbsp \x26nbsp\x3c/span\x3e";
  }
}}], itemSelector:'div.interview-cls', listeners:{itemclick:'onIntervReqClick'}}]});
Ext.define('JobOpenings.view.interviewrequest.interviewrequest.InterviewRequestFeedbackView', {extend:'Ext.container.Container', xtype:'interviewrequestfeedbackview', width:'99%', style:'padding-left: 63px; padding-top: 58px;', reference:'interviewrequestfeedbackviewref', requires:['JobOpenings.view.interviewrequest.InterviewRequestModel', 'JobOpenings.view.interviewrequest.InterviewRequestController'], controller:'interviewrequestcontroller', viewModel:{type:'interviewrequestmodel'}, items:[{xtype:'dataview', 
reference:'feedbackdataviewref', data:'', cls:'jobappviewcls_spacing', itemTpl:['\x3cdiv class\x3d"myPanelsCls" style\x3d"text-align:center;"\x3e', '\x3cdiv class\x3d"timeline-item jobtimelinecls3"\x3e', '\x3cdiv class\x3d"timeline-day"\x3e\x3c/div\x3e', '\x3cdiv class\x3d"timeline-outer"\x3e\x3cdiv class\x3d"timeline-inner"\x3e', '\x3c/div\x3e', '\x3c/div\x3e', '\x3c/div\x3e', '\x3ctable class\x3d"feedbktable-cls"\x3e', '\x3ctr class\x3d"feedbktr-cls"\x3e', '\x3cth class\x3d"nameheader-cls"\x3eInterviewer Name\x3c/th\x3e', 
'\x3cth class\x3d"typeheader-cls"\x3eInterviewer Type\x3c/th\x3e', '\x3cth class\x3d"typeheader-cls"\x3eInterviewer Mode\x3c/th\x3e', '\x3cth class\x3d"dtheader-cls"\x3eDate\x26Time\x3c/th\x3e', '\x3cth class\x3d"ratingheader-cls"\x3eRating\x3c/th\x3e', '\x3cth class\x3d""\x3eFeedback\x3c/th\x3e', '\x3cth class\x3d""\x3e\x3c/th\x3e', '\x3c/tr\x3e', '\x3ctr class\x3d"datatr-cls"\x3e', '\x3ctd\x3e{interviewrname}\x3c/td\x3e', '\x3ctd\x3e{[this.onIntervwTypeVal(values)]}\x3c/td\x3e', '\x3ctd\x3e{[this.onIntervwModeVal(values)]}\x3c/td\x3e', 
'\x3ctd\x3e{[this.convertDate(values)]}\x3cdiv\x3e{[this.showInterviewtime(values)]}\x3c/div\x3e\x3c/td\x3e', '\x3ctd\x3e{[this.getRatingIcon(values)]}\x3c/td\x3e', '\x3ctd class\x3d""\x3e{[this.onFeedbackVal(values)]}\x3cbr\x3e\x3c/td\x3e', '\x3ctd class\x3d""\x3e\x3cbutton class\x3d"intvwsubmit-btn" name\x3d"submit" id\x3d"submit" \x3eSubmit\x3c/button\x3e\x3cbr\x3e ', '\x3clabel class\x3d"intrvwReqCancel_lbl" name\x3d"cancel"\x3eCancel\x3c/label\x3e\x3c/td\x3e', '\x3c/tr\x3e', '\x3c/table\x3e', 
'\x3c/div\x3e', {getRatingIcon:function(values) {
  var ratingname = values.ratingname;
  var xRatingStr = JSON.parse(window.sessionStorage.getRatingStr);
  var liHtml = '';
  xRatingStr.data.forEach(function(item) {
    liHtml += '\x3cli class\x3d"lili" value\x3d"' + item.ddo_interviewrating_id + '"\x3e' + item.name + '\x3c/li\x3e';
  });
  return '\x3cdiv style\x3d"margin-top: -39px;"\x3e\x3cimg class\x3d"intvwratingimg-cls" src\x3d"resources/images/feeds/likes/' + ratingname + '.png' + '"\x3e\x3cdiv style\x3d"position:absolute;"\x3e' + '\x3cdiv class\x3d"act-cls"\x3e' + ratingname + '\x3ci class\x3d"x-fa fa-sort-desc arrow-cls"\x3e\x3c/i\x3e\x3cdiv class\x3d"act-removecls"\x3e\x3cul\x3e' + liHtml + '\x3c/ul\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e';
}, convertDate:function(values) {
  var intervwDate = values.interviewdate;
  return Ext.Date.format(new Date(intervwDate), 'd-m-Y');
}, showInterviewtime:function(values) {
  return values.interviewtime.replace('-', '.');
}, onIntervwTypeVal:function(values) {
  if (values.interviewtype == 1) {
    return 'Technical';
  } else {
    if (values.interviewtype == 2) {
      return 'HR';
    } else {
      return 'Manager';
    }
  }
}, onIntervwModeVal:function(values) {
  if (values.interviewmode == 1) {
    return 'Telephonic';
  } else {
    if (values.interviewmode == 2) {
      return 'Skype';
    } else {
      return 'FacetoFace';
    }
  }
}, onFeedbackVal:function(values) {
  if (values.feedback != 'NULL' && values.feedback != null) {
    return '\x3ctextarea class\x3d"intrvw_textarea" id\x3d"intrvw_textarea" placeholder\x3d"Write here..." name\x3d"feedbackTextArea" readonly\x3e' + values.feedback + '\x3c/textarea\x3e';
  } else {
    return '\x3ctextarea class\x3d"intrvw_textarea" placeholder\x3d"Write here..." name\x3d"feedbackTextArea"\x3e\x3c/textarea\x3e';
  }
}}], itemSelector:'.feedbktable-cls', listeners:{itemclick:'ratingsCheckClick', containerClick:function(vw, record, item) {
  var x = vw.all.elements;
  for (var i = 0; i < x.length; i++) {
    var y = x[i].lastChild.lastChild.children[4].lastChild.lastChild.lastChild.lastChild;
    if (y.className == 'act-showcls') {
      y.classList.remove('act-showcls');
      y.classList.add('act-removecls');
    }
  }
}}}]});
Ext.define('JobOpenings.view.jobapplications.JobApplicationsViewModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.jobapplicationsviewmodel', reference:'jobappvmref', data:{viewHide:false, initialInterviewShow:false, cancelformshow:true, awaitingfeedviewHide:true, addSch:false, feedbackData:'', resumePath:'', resumePath2:'Choose File', filtervalue:'', saveBtnDisable:true, uploadBtnForEditShow:true}, stores:{jobapplicantStore:{autoLoad:false, proxy:{type:'ajax', url:'resources/data/jobapplications/jobapplicantdetails.json', 
reader:{type:'json', rootProperty:'data'}}}, jobApplicationStatus:{autoLoad:false, proxy:{type:'ajax', url:'jobappinterview/appstatus', reader:{type:'json', rootProperty:'data'}}}, interviewrsStore:{autoLoad:false, proxy:{type:'ajax', url:'/jobappinterview/getInterviewPanelMembers', reader:{type:'json', rootProperty:'data'}}}, interviewFeedBackStore:{autoLoad:false, proxy:{type:'ajax', url:'/jobappinterview', reader:{type:'json', rootProperty:'data'}}}, interviewTypeStore:{storeId:'interviewtype', 
autoLoad:false, proxy:{type:'ajax', extraParams:{tablename:'ddo_interviewtype'}, api:{read:'/preference/preferencedata'}, reader:{type:'json', rootProperty:'data'}}}, interviewModeStore:{autoLoad:true, storeId:'interviewmode', proxy:{type:'ajax', extraParams:{tablename:'ddo_interviewmode'}, api:{read:'/preference/preferencedata'}, reader:{type:'json', rootProperty:'data'}}}, jobapplicationsappliedstore:{autoLoad:false, proxy:{type:'ajax', url:'jobapplication', reader:{type:'json', rootProperty:'data'}}, 
sorters:[{property:'jobupdateddate', direction:'DESC'}]}, jobApplicationsDataViewStore:{autoLoad:false, proxy:{type:'ajax', url:'jobopeningrequest', reader:{type:'json', rootProperty:'data'}}, sorters:[{property:'jobupdateddate', direction:'DESC'}], filters:[{property:'ddo_jobopeningstatus_id', value:1}]}, allJobAllicationsGridViewStore:{autoLoad:true, proxy:{type:'ajax', api:{read:'/jobapplication'}, reader:{type:'json', rootProperty:'data'}}}}});
Ext.define('JobOpenings.view.jobapplications.JobApplicationsViewController', {extend:'Ext.app.ViewController', alias:'controller.jobapplicationsviewController', init:function(application) {
  this.control({'[reference\x3d"intervwformref"] field':{change:function() {
    window.sessionStorage.job_app_form = '1';
  }}});
}, onMyPanelsClick:function(vw, record, item, index, e, eOpts) {
  var needPut = false;
  if (e.target.tagName == 'LABEL') {
    item.children[1].children[0].children[0].children[5].innerText = '';
    item.children[1].children[0].children[1].children[5].innerHTML = 'Awaiting for Feedback';
    item.children[1].children[0].children[1].children[6].innerHTML = '\x3cdiv class\x3d"intervw-sched-cancel-link-cls"\x3e\x3ci class\x3d"cancel-interview-iconcls arrow-cls"\x3e\x3c/i\x3eCancel\x3c/div\x3e\x3cdiv class\x3d"intervw-sched-reschedule-link-cls"\x3e\x3ci class\x3d"reschedule-interview-iconcls arrow-cls"\x3e\x3c/i\x3eReschedule\x3c/div\x3e\x3cdiv class\x3d"intervw-sched-delete-link-cls"\x3e\x3ci class\x3d"delete-interview-iconcls arrow-cls"\x3e\x3c/i\x3eDelete\x3c/div\x3e';
  } else {
    if (e.target.tagName == 'BUTTON') {
      needPut = true;
    } else {
      if (e.target.innerText == 'Cancel') {
        item.children[1].children[0].children[0].children[5].innerText = 'Reason for Cancelling';
        item.children[1].children[0].children[1].children[5].innerHTML = '\x3ctextarea class\x3d"intrvw_textarea2" name\x3d"feedbackTextArea"\x3e\x3c/textarea\x3e';
        item.children[1].children[0].children[1].children[6].innerHTML = "\x3cbutton class\x3d'intvwsubmit-btn2'\x3eConfirm\x3c/button\x3e\x3clabel class\x3d'intrvwReqCancel_lbl' style\x3d'margin:33px;'\x3eCancel\x3c/label\x3e";
        window.sessionStorage.cancelOrRescheduleParam = '1';
      } else {
      }
    }
  }
  if (e.target.tagName == 'TEXTAREA') {
    window.sessionStorage.job_app_form = '1';
  } else {
    window.sessionStorage.job_app_form = '0';
  }
  if (e.target.innerText == 'Reschedule') {
    item.children[1].children[0].children[0].children[5].innerText = 'Reason for Rescheduling';
    item.children[1].children[0].children[1].children[5].innerHTML = '\x3ctextarea class\x3d"intrvw_textarea2" name\x3d"feedbackTextArea"\x3e\x3c/textarea\x3e';
    item.children[1].children[0].children[1].children[6].innerHTML = "\x3cbutton class\x3d'intvwsubmit-btn2'\x3eConfirm\x3c/button\x3e\x3clabel class\x3d'intrvwReqCancel_lbl' style\x3d'margin:33px;'\x3eCancel\x3c/label\x3e";
    window.sessionStorage.cancelOrRescheduleParam = '2';
  }
  var isDelete = false;
  if (e.target.innerText == 'Delete') {
    needPut = true;
    isDelete = true;
  }
  if (needPut) {
    var url = '/jobappinterview', method = isDelete ? 'DELETE' : 'PUT';
    var ddo_jobapplicationinterview_id = record.data.ddo_jobapplicationinterview_id;
    if (isDelete) {
      var params = {ddo_jobapplicationinterview_id:ddo_jobapplicationinterview_id};
    } else {
      var params = {ddo_jobapplication_id:record.data.ddo_jobapplication_id, ddo_jobinterviewstatus_id:window.sessionStorage.cancelOrRescheduleParam == '1' ? 4 : 3, ddo_interviewrating_id:3, feedback:e.target.tagName == 'BUTTON' ? item.children[1].children[0].children[1].children[5].children['0'].value : '', interviewer_id:record.data.interviewer_id, interviewtype:record.data.interviewtype, interviewdate:record.data.interviewdate, interviewtime:record.data.interviewtime, ddo_jobapplicationinterview_id:ddo_jobapplicationinterview_id};
    }
    var isRecDelete = false;
    Ext.Ajax.request({url:url, method:method, scope:this, params:params, success:function(resp, b) {
      var res = Ext.decode(resp.responseText);
      var msg = res.message;
      isRecDelete = true;
      if (isRecDelete) {
        this.getView().getReferences().oninterviewscheduledref.items.items[2].items.items[0].store.load();
      }
      Ext.Msg.alert('success', msg);
      if (window.sessionStorage.cancelOrRescheduleParam == '2') {
        this.getView().getReferences().oninterviewscheduledref.items.items[0].hide();
        this.getView().getReferences().oninterviewscheduledref.items.items[1].show();
        var myForm = this.getView().getReferences().oninterviewscheduledref.items.items[1].items.items[1].items.items[0].getForm(), myFormFields = myForm.getFields();
        myFormFields.items[1].setValue(record.data.interviewer_id);
        myFormFields.items[2].setValue(record.data.interviewtype);
      }
    }, failure:function(resp, b) {
      var data = Ext.decode(resp.responseText);
      Ext.toast(data.message, false, 't');
    }});
  }
}, onBackClick:function(item) {
  if (window.sessionStorage.job_app_form == '1') {
    Ext.Msg.confirm('Confirm', 'Are you sure you want to go back?', function(btnText) {
      if (btnText === 'no') {
      } else {
        if (btnText === 'yes') {
          this.onBackClickFunc(item);
        }
      }
    }, this);
  } else {
    this.onBackClickFunc(item);
  }
}, onBackClickFunc:function(item) {
  Ext.ComponentQuery.query('interviewrequestdetailsform')[0].items.items[1].items.items['0'].getForm().reset();
  window.sessionStorage.job_app_form = '0';
  Ext.ComponentQuery.query('[reference \x3d jobapplicationreference]')[0].getLayout().setActiveItem('appliedList');
  var params = {ddo_jobopening_id:JSON.parse(window.sessionStorage.renderingData).ddo_jobopening_id};
  var url = '/jobapplication';
  var method = 'GET';
  Ext.Ajax.request({url:url, method:method, scope:this, params:params, success:function(resp, b, data, f, g, h) {
    Ext.ComponentQuery.query('jobapplicationsappliedlistview')[0].items.items[1].store.loadRawData(JSON.parse(resp.responseText));
  }, failure:function(resp, b) {
    var data = Ext.decode(resp.responseText);
    Ext.toast(data.message, false, 't');
  }});
}, onInterviewSaveBtnClick2:function(btn, e, eOpts) {
  var viewModel = this.getViewModel(), intvwform = this.getReferences().intervwformref, formValues = intvwform.getValues();
  this.saveInterviewFormData(formValues);
}, saveInterviewFormData:function(formValues) {
  var viewModel = this.getViewModel(), intvwform = this.getReferences().intervwformref;
  var url = '/jobappinterview', method = 'POST';
  var params = {ddo_jobapplication_id:JSON.parse(window.sessionStorage.renderingData).ddo_jobapplication, ddo_jobinterviewstatus_id:1, ddo_interviewrating_id:3, feedback:'', interviewer_id:formValues.interviewer_id, interviewtype:formValues.interviewtype, interviewdate:formValues.interviewdate, interviewtime:formValues.interviewtime, interviewmode:formValues.interviewmode};
  var isRecDelete = false;
  Ext.Ajax.request({url:url, method:method, scope:this, params:params, success:function(resp, b) {
    var res = Ext.decode(resp.responseText);
    var msg = res.message;
    Ext.ComponentQuery.query('oninterviewscheduled')[0].items.items[0].setHidden(false);
    Ext.ComponentQuery.query('oninterviewscheduled')[0].items.items[1].setHidden(true);
    isRecDelete = true;
    if (isRecDelete) {
      Ext.Ajax.request({url:'/jobappinterview', method:'GET', scope:this, success:function(resp, b, data, f, g, h) {
        Ext.ComponentQuery.query('oninterviewscheduled')[0].items.items[2].items.items[0].store.loadRawData(JSON.parse(resp.responseText));
        Ext.ComponentQuery.query('oninterviewscheduled')[0].items.items[2].items.items[0].store.sort('updated', 'DESC');
        Ext.ComponentQuery.query('oninterviewscheduled')[0].items.items[2].items.items[0].store.filter({property:'ddo_jobapplication_id', id:'filterBy_ddo_jobapplication_id', anyMatch:true, caseSensitie:false, value:JSON.parse(window.sessionStorage.renderingData).ddo_jobapplication}, JSON.parse(window.sessionStorage.renderingData).ddo_jobapplication, false);
        Ext.ComponentQuery.query('oninterviewscheduled')[0].items.items[0].setHidden(false);
        Ext.ComponentQuery.query('oninterviewscheduled')[0].items.items[1].setHidden(true);
        Ext.ComponentQuery.query('oninterviewscheduled')[0].items.items[2].setHidden(false);
        Ext.ComponentQuery.query('interviewrequestdetailsform')[0].items.items[1].items.items['0'].getForm().reset();
        window.sessionStorage.job_app_form = '0';
      }, failure:function(resp, b) {
        var data = Ext.decode(resp.responseText);
        Ext.toast(data.message, false, 't');
      }});
    }
    Ext.Msg.alert('success', msg);
  }, failure:function(resp, b) {
    var data = Ext.decode(resp.responseText);
    Ext.toast(data.message, false, 't');
  }});
}, onCancelIntvwClick:function(btn, e, opts) {
  this.getReferences().intervwformref.reset();
}, onInteviewAddBtnClick2:function(btn, e, eOpts) {
  Ext.ComponentQuery.query('oninterviewscheduled')[0].items.items[0].setHidden(true);
  Ext.ComponentQuery.query('oninterviewscheduled')[0].items.items[1].setHidden(false);
}, onApplicationStatusSelected:function(combo, arg2) {
  var params = {ddo_jobapplication_id:window.sessionStorage.ddo_jobapplication_id_forApplStatus, ddo_jobapplicationstatus_id:arg2.data.ddo_jobapplicationstatus_id}, url = '/jobapplication', method = 'PUT';
  Ext.Ajax.request({url:url, method:method, scope:this, params:params, success:function(resp, b) {
    var res = Ext.decode(resp.responseText);
    var msg = res.message;
    Ext.Msg.alert('success', msg);
  }, failure:function(resp, b) {
    var data = Ext.decode(resp.responseText);
    Ext.toast(data.message, false, 't');
  }});
}, onDwnldCVClick:function(btn, val) {
  var file_path = JSON.parse(window.sessionStorage.renderingData).resumepath;
  var a = document.createElement('A');
  a.href = file_path;
  a.download = JSON.parse(window.sessionStorage.renderingData).resumename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}});
Ext.define('JobOpenings.view.interviewrequest.interviewrequest.InterviewRequestFeedbackMain', {extend:'Ext.container.Container', xtype:'interviewrequestfeedbackmain', requires:['JobOpenings.view.jobapplications.JobApplicationsViewModel', 'JobOpenings.view.jobapplications.JobApplicationsViewController', 'JobOpenings.view.interviewrequest.interviewrequest.InterviewRequestFeedbackView'], reference:'interviewrequestfeedbackmainref', margin:'10 0 0 10', cls:'jobappviewcls noscrollbar interReqCls', width:'100%', 
controller:'jobapplicationsviewController', viewModel:{type:'jobapplicationsviewmodel'}, layout:{type:'vbox'}, items:[{xtype:'panel', width:'100%', items:[{xtype:'toolbar', cls:'inttoolbar-cls', dock:'top', items:[{xtype:'button', scale:'medium', iconCls:'goalsbackbtn-cls', cls:'jobback-btn-cls', style:{border:0}, listeners:{click:function() {
  if (window.sessionStorage.intervw_req_feedback == 'true') {
    Ext.Msg.confirm('Confirm', 'Are you sure you want to go back?', function(btnText) {
      if (btnText === 'no') {
      } else {
        if (btnText === 'yes') {
          Ext.ComponentQuery.query('interviewrequestdesign')[0].getViewModel().getStore('interviewRequestListStore').load();
          window.sessionStorage.intervw_req_feedback = false;
          Ext.ComponentQuery.query('[reference \x3d interviewreference]')[0].getLayout().setActiveItem(0);
        }
      }
    }, this);
  } else {
    Ext.ComponentQuery.query('interviewrequestdesign')[0].getViewModel().getStore('interviewRequestListStore').load();
    window.sessionStorage.intervw_req_feedback = false;
    Ext.ComponentQuery.query('[reference \x3d interviewreference]')[0].getLayout().setActiveItem(0);
  }
}}}, {xtype:'label', html:'Back', cls:'backlabel-cls'}, {xtype:'tbspacer', width:400}, {xtype:'label', html:'Interview', cls:'intTitle-cls', reference:'interviewRequest_interviewTitleRef'}]}]}, {xtype:'container', layout:'hbox', cls:'dtcnt-cls', items:[{xtype:'dataview', cls:'jobsdataviewcls', itemTpl:['\x3cdiv class\x3d"jobsdiv-cls ddo-jobopening-item"\x3e', '\x3cdiv class\x3d"datadiv-cls"\x3e', '\x3cdiv class\x3d"title-div-cls"\x3e\x3cspan class\x3d"title-cls getRatingIcon: function(values) { /* for correct rating icon display*/le-cls"\x3e{[this.showTitle(values,16)]}\x3c/span\x3e', 
'\x3cspan\x3e | \x3c/span\x3e', '\x3cspan class\x3d"creator-cls"\x3e{[this.showCurrentjobtitle(values)]}\x3c/span\x3e', '\x3c/div\x3e', '\x3cdiv class\x3d"loc-exp"\x3e\x3cspan\x3e\x3ci class\x3d"exp-iconcls arrow-cls"\x3e\x3c/i\x3e\x26nbsp{workexpyears}.{workexpmonths} Years Experience \x3c/span\x3e', '\x3cspan\x3e\x3ci class\x3d"location-iconcls arrow-cls"\x3e\x3c/i\x3e\x26nbsp{[this.showCurrentlocation(values)]}\x3c/span\x3e', '\x3c/div\x3e', '\x3cdiv class\x3d"detailscls"\x3e\x3ci class\x3d"skill-iconcls arrow-cls"\x3e\x3c/i\x3e{[this.showSkill(values)]}\x3c/div\x3e', 
'\x3cdiv class\x3d"detailscls"\x3e\x3ci class\x3d"education-iconcls arrow-cls"\x3e\x3c/i\x3e{[this.showEduVal(values)]} - {[this.showCollegename(values)]}\x3c/div\x3e', '\x3cdiv class\x3d"mob-emailsCls"\x3e', '\x3cdiv class\x3d"detailscls emaildv"\x3e\x3ci class\x3d"mobile-iconcls arrow-cls"\x3e\x3c/i\x3e+91\x26nbsp{[this.showMobile(values, 10)]}\x3c/div\x3e', '\x3cdiv class\x3d"detailscls maildv"\x3e\x3ci class\x3d"mail-iconcls arrow-cls"\x3e\x3c/i\x3e{[this.emailidShowFunc(values, 20)]}\x3c/div\x3e\x3c/div\x3e', 
'\x3c/div\x3e', '\x3cdiv class\x3d"combosdiv-cls"\x3e', '\x3cdiv\x3e', '\x3c/div\x3e', '\x3c/div\x3e', '\x3c/div\x3e', {showCollegename:function(values) {
  var collegename = values.collegename;
  if (collegename.length > 20) {
    return collegename.substring(0, 17) + '...';
  } else {
    return collegename;
  }
}, showCurrentlocation:function(values) {
  var currentlocation = values.currentlocation;
  if (currentlocation.length > 15) {
    return currentlocation.substring(0, 12) + '...';
  } else {
    return currentlocation;
  }
}, showCurrentjobtitle:function(values) {
  var currentjobtitle = values.currentjobtitle;
  if (currentjobtitle.length > 12) {
    return currentjobtitle.substring(0, 9) + '...';
  } else {
    return currentjobtitle;
  }
}, showTitle:function(values, limit) {
  var title = values.firstname + ' ' + values.lastname;
  if (title.length > limit) {
    return title.substring(0, 13) + '...';
  } else {
    return title;
  }
}, showSkill:function(values) {
  var skillStr = '';
  try {
    var skillsArr = values.skillnames;
    skillsArr.forEach(function(item, index) {
      skillStr += skillsArr.length - 1 != index ? '#' + item + ', ' : '#' + item;
    });
  } catch (exce) {
  }
  if (skillStr.length > 29) {
    return skillStr.substring(0, 26) + '...';
  } else {
    return skillStr;
  }
}, showMobile:function(values, limit) {
  var mobile = values.mobile.toString();
  if (mobile.length > limit) {
    return mobile.substring(0, 10) + '...';
  } else {
    return mobile;
  }
}, showEduVal:function(values) {
  var myEduTypeArr = JSON.parse(window.sessionStorage.myEduTypeArr).data;
  var myEduStr = '';
  myEduTypeArr.forEach(function(item) {
    if (values.ddo_jobeducation_id == item.ddo_jobeducation_id) {
      myEduStr = item.name;
    }
  });
  return myEduStr;
}, emailidShowFunc:function(values, limit) {
  var emailid = values.emailid;
  if (emailid.length > limit) {
    return emailid.substring(0, 20) + '...';
  } else {
    return emailid;
  }
}}], itemSelector:'div.status-div-cls'}, {xtype:'container', cls:'dwnlodcntcls', layout:'vbox', items:[{xtype:'button', text:'Download CV \x3cspan class\x3d"download-iconcls"\x3e\x3c/span\x3e', cls:'cvdwnldbtn', iconcls:'dwnldcv-cls', reference:'intervReqDowloadBtn', listeners:{click:function(btn, val) {
  var file_path = JSON.parse(window.sessionStorage.renderingData).resumepath;
  var a = document.createElement('A');
  a.href = file_path;
  a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}}}]}]}, {xtype:'interviewrequestfeedbackview'}]});
Ext.define('JobOpenings.view.interviewrequest.InterviewRequest', {extend:'Ext.container.Container', xtype:'interviewrequest', requires:['JobOpenings.view.interviewrequest.InterviewRequestController', 'JobOpenings.view.jobopeningrequest.filtertoolbar.FilterViewModel', 'JobOpenings.view.interviewrequest.InterviewRequestDesign', 'JobOpenings.view.interviewrequest.interviewrequest.InterviewRequestFeedbackView', 'JobOpenings.view.interviewrequest.interviewrequest.InterviewRequestFeedbackMain'], layout:{type:'card', 
activeItem:0}, controller:'interviewrequestcontroller', viewModel:{type:'filterviewmodel'}, margin:'10 0 0 10', reference:'interviewreference', items:[{xtype:'interviewrequestdesign'}, {xtype:'interviewrequestfeedbackmain'}]});
Ext.define('JobOpenings.view.interviewrequest.interviewrequest.InterviewRequestTimelineContainer', {extend:'Ext.container.Container', xtype:'interviewrequesttimelinecontainer', cls:'intvwtimelinecnt-cls', width:'100%', html:['\x3cdiv class\x3d"timeline-item jobtimelinecls"\x3e', '\x3cdiv class\x3d"timeline-day"\x3e\x3c/div\x3e', '\x3cdiv class\x3d"timeline-outer"\x3e\x3cdiv class\x3d"timeline-inner"\x3e', '\x3c/div\x3e', '\x3c/div\x3e']});
Ext.define('JobOpenings.view.jobapplications.JobApplicationFormViewMode', {extend:'Ext.form.Panel', alias:'widget.jobapplicationformviewmode', cls:'form-cls apply-form', defaults:{width:'50%', labelAlign:'right', labelWidth:180, padding:5, labelStyle:'font-size:16px;'}, reference:'jobApplicationFormViewModeRef', layout:{type:'vbox', align:'middle', pack:'center'}, title:'Job Application', buttonAlign:'center', items:[{xtype:'textfield', name:'fnameView', fieldLabel:'First Name:', readOnly:true, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, 
{xtype:'textfield', name:'lnameView', readOnly:true, fieldLabel:'Last Name:', afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'textfield', name:'jobtitlenameView', readOnly:true, fieldLabel:'Current Job Title:', afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'fieldcontainer', fieldLabel:'Work Experience', cls:'fieldcontainer-cls', layout:'hbox', afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e', 
combineErrors:true, defaults:{padding:10, msgTarget:'side', flex:1, labelWidth:50, anchor:'70%'}, items:[{xtype:'textfield', readOnly:true, fieldLabel:'Years', name:'yearsnameView'}, {xtype:'textfield', readOnly:true, fieldLabel:'Months', name:'monthsnameView'}]}, {xtype:'textfield', fieldLabel:'Skills:', name:'skillsnameView', border:5, afterLabelTextTpl:'\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e', readOnly:true}, {xtype:'textfield', name:'locationnameView', readOnly:true, fieldLabel:'Current Location:', 
afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'textfield', fieldLabel:'Education:', name:'educationnameView', readOnly:true, afterLabelTextTpl:'\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e'}, {xtype:'textfield', name:'univnameView', readOnly:true, fieldLabel:'College / University:', afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'textfield', name:'mobilenameView', 
fieldLabel:'Mobile:', readOnly:true, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'textfield', name:'emailnameView', readOnly:true, fieldLabel:'Email Address', afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'fieldcontainer', cls:'fieldcontainer-cls', layout:'hbox', defaults:{msgTarget:'side', flex:1, anchor:'65%', labelStyle:'font-size:16px;'}, items:[{xtype:'textfield', 
name:'hiringnameView', readOnly:true, labelWidth:110, margin:'0 10 0 68', fieldLabel:'Hiring Source:', afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'textfield', name:'portalnameView', reference:'portalref', readOnly:true, fieldLabel:'Job Portal Name:', labelAlign:'right', afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}]}, {xtype:'fieldcontainer', defaults:{width:'100%', labelAlign:'right', 
labelWidth:180, padding:5, labelStyle:'font-size:16px;'}, items:[{xtype:'textfield', anchor:'100%', name:'appResumeView', opType:'upload', iconCls:'upload-cls', afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e', fieldLabel:'Upload CV :', readOnly:true}]}]});
Ext.define('JobOpenings.view.jobapplications.NewJobApplyForm', {extend:'Ext.form.Panel', alias:'widget.newjobapplyform', cls:'form-cls apply-form', defaults:{width:'50%', labelAlign:'right', labelWidth:180, padding:5, labelStyle:'font-size:16px;'}, reference:'applyForm', layout:{type:'vbox', align:'middle', pack:'center'}, title:'Job Application', buttonAlign:'center', items:[{xtype:'textfield', name:'fname', required:true, fieldLabel:'First Name:', emptyCls:'referrals-empty-text', maskRe:/^[A-Za-z]*$/, 
emptyText:'Name', allowBlank:false, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'textfield', name:'lname', required:true, maskRe:/^[A-Za-z]*$/, fieldLabel:'Last Name:', emptyCls:'referrals-empty-text', emptyText:'Last Name', allowBlank:false, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'textfield', name:'jobtitlename', required:true, fieldLabel:'Current Job Title:', 
emptyCls:'referrals-empty-text', emptyText:'Write Job Title Eg: Technical Lead', allowBlank:false, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'fieldcontainer', fieldLabel:'Work Experience', cls:'fieldcontainer-cls', layout:'hbox', afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e', combineErrors:true, defaults:{padding:10, msgTarget:'side', flex:1, labelWidth:50, anchor:'70%'}, 
items:[{xtype:'numberfield', emptyText:'0', emptyCls:'referrals-empty-text', allowBlank:false, minValue:0, required:true, fieldLabel:'Years', name:'yearsname'}, {xtype:'numberfield', emptyText:'0', emptyCls:'referrals-empty-text', minValue:0, maxValue:12, allowBlank:false, required:true, fieldLabel:'Months', name:'monthsname'}]}, {xtype:'tagfield', fieldLabel:'Skills:', name:'skillsname', tpl:Ext.create('Ext.XTemplate', '\x3cul class\x3d"x-list-plain"\x3e\x3ctpl for\x3d"."\x3e', '\x3cli role\x3d"option" class\x3d"x-boundlist-item" style\x3d"text-align:center;"\x3e{name}\x3c/li\x3e', 
'\x3c/tpl\x3e\x3c/ul\x3e'), displayTpl:Ext.create('Ext.XTemplate', '\x3ctpl for\x3d"."\x3e', '{name}', '\x3c/tpl\x3e'), emptyText:'Use Words Eg : Angular JS', emptyCls:'referrals-empty-text1', hideTrigger:true, store:Ext.create('JobOpenings.store.filtertoolbar.JobSkillsTypeStore'), displayField:'name', valueField:'ddo_skills_id', queryMode:'local', forceSelection:false, maskRe:/^[A-Za-z0-9]*$/, autoShow:true, filterPickList:true, blankText:'This field is required', border:5, allowBlank:false, collapseOnSelect:true, 
clearFilterOnBlur:false, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e', listeners:{render:'onSkillRender', select:function(combo, record, eOpts) {
  combo.inputEl.dom.value = '';
  combo.lastMutatedValue = '';
}}, autoLoadOnValue:true}, {xtype:'textfield', name:'locationname', required:true, maskRe:/^[A-Za-z]*$/, fieldLabel:'Current Location:', emptyText:'Eg. Mumbai', emptyCls:'referrals-empty-text', allowBlank:false, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'combo', fieldLabel:'Education:', tpl:Ext.create('Ext.XTemplate', '\x3cul class\x3d"x-list-plain"\x3e\x3ctpl for\x3d"."\x3e', '\x3cli role\x3d"option" class\x3d"x-boundlist-item" style\x3d"text-align:center;"\x3e{name}\x3c/li\x3e', 
'\x3c/tpl\x3e\x3c/ul\x3e'), displayTpl:Ext.create('Ext.XTemplate', '\x3ctpl for\x3d"."\x3e', '{name}', '\x3c/tpl\x3e'), name:'educationname', emptyText:'Highest Education:', emptyCls:'referrals-empty-text', store:Ext.create('JobOpenings.store.filtertoolbar.EducationStore'), displayField:'name', valueField:'ddo_jobeducation_id', queryMode:'local', blankText:'This field is required', allowBlank:false, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e', 
editable:false, autoLoadOnValue:true}, {xtype:'textfield', name:'univname', maskRe:/^[A-Za-z0-9]*$/, emptyText:'Eg: Mahatma Gandhi Institute of Technology', emptyCls:'referrals-empty-text', fieldLabel:'College / University:', required:true, allowBlank:false, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'textfield', name:'mobilename', emptyText:'Mobile', emptyCls:'referrals-empty-text', maskRe:/^[0-9]*$/, fieldLabel:'Mobile:', required:true, 
minLength:10, maxLength:10, enforceMaxLength:true, enableKeyEvents:true, allowBlank:false, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e', listeners:{focusleave:'onMobileNumEnter'}}, {xtype:'textfield', name:'emailname', fieldLabel:'Email ID', emptyCls:'referrals-empty-text', emptyText:'Email', required:true, allowBlank:false, vtype:'email', vtypeText:'Enter valid email', afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, 
{xtype:'fieldcontainer', cls:'fieldcontainer-cls', layout:'hbox', defaults:{msgTarget:'side', flex:1, anchor:'65%', labelStyle:'font-size:16px;'}, items:[{xtype:'combobox', name:'hiringname', emptyText:'Select', emptyCls:'referrals-empty-text', labelWidth:110, margin:'0 10 0 68', required:true, allowBlank:false, tpl:Ext.create('Ext.XTemplate', '\x3cul class\x3d"x-list-plain"\x3e\x3ctpl for\x3d"."\x3e', '\x3cli role\x3d"option" class\x3d"x-boundlist-item" style\x3d"text-align:center;"\x3e{name}\x3c/li\x3e', 
'\x3c/tpl\x3e\x3c/ul\x3e'), displayTpl:Ext.create('Ext.XTemplate', '\x3ctpl for\x3d"."\x3e', '{name}', '\x3c/tpl\x3e'), fieldLabel:'Hiring Source:', queryMode:'local', displayField:'name', editable:false, valueField:'ddo_jobhiringsource_id', afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e', store:Ext.create('JobOpenings.store.filtertoolbar.HiringSourceCombo'), autoLoadOnValue:true, listeners:{select:'onHiringSourceSelection'}}, {xtype:'textfield', 
name:'portalname', emptyText:'Select', fieldLabel:'Job Portal Name:', emptyCls:'referrals-empty-text', labelAlign:'right', hidden:true, maskRe:/^[A-Za-z0-9]*$/}]}, {xtype:'fileuploadfield', anchor:'100%', name:'appResume', opType:'upload', iconCls:'upload-cls', reference:'fileuploadref', buttonOnly:true, required:true, allowBlank:false, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e', bind:{value:'{resumePath}'}, listeners:{change:'buttonOnlyChange'}, 
buttonConfig:{cls:'upload-btn', width:'100%', iconCls:'x-fa fa-upload', iconAlign:'right', name:'jobapplicationformid', reference:'uploadbuttonref', bind:{text:'{resumePath2}'}}, fieldLabel:'Upload CV:'}, {xtype:'fieldcontainer', items:[{xtype:'label', text:'Upload CV:', reference:'uploadlabelref', hidden:true, cls:'uploadhiddenlabel-cls', tpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'button', width:250, cls:'uploadeditbtn-cls', name:'uploadResumeHiddenBtn', 
reference:'uploadhiddenbtnref', iconCls:'x-fa fa-times', iconAlign:'right', hidden:true, bind:{text:'{resumePath2}'}, listeners:{btnIconEl:{click:function(btn) {
  var filefieldref = Ext.ComponentQuery.query('[reference \x3d fileuploadref]')[0], uploadBtnLabel = Ext.ComponentQuery.query('[reference \x3d uploadlabelref]')[0], uploadHiddenBtn = Ext.ComponentQuery.query('[reference \x3d uploadhiddenbtnref]')[0], uploadButton = Ext.ComponentQuery.query('[reference \x3d uploadbuttonref]')[0];
  uploadButton.setText('Choose File');
  uploadButton.setIconCls('x-fa fa-upload');
  uploadHiddenBtn.hide();
  uploadBtnLabel.hide();
  filefieldref.show();
  filefieldref.fileInputEl.dom.value = '';
  filefieldref.value = '';
  filefieldref.rawValue = '';
}}}}]}], bbar:{cls:'jobform-cls', layout:{type:'hbox', align:'middle', pack:'center'}, items:[{xtype:'button', text:'Save', width:200, disabledCls:'disable-btn', formBind:true, cls:'jobapplication-margin', listeners:{click:'onSaveFunc'}}, {xtype:'button', text:'Cancel', cls:['require-btn', 'referral-click'], handler:'onCancelBtnClick'}]}});
Ext.define('JobOpenings.view.jobapplications.JobApplyController', {extend:'Ext.app.ViewController', alias:'controller.jobapplycontroller', requires:['JobOpenings.view.jobapplications.NewJobApplyForm'], init:function(application) {
  this.control({'[xtype\x3d"newjobapplyform"] field':{change:function() {
    window.sessionStorage.job_app_form = '1';
  }}});
}, onCancelBtnClick:function() {
  var btnRef = Ext.ComponentQuery.query('[reference \x3d uploadbuttonref]')[0], uploadField = Ext.ComponentQuery.query('[reference \x3d fileuploadref]')[0];
  uploadField.show();
  btnRef.setText('Choose File');
  btnRef.setIconCls('x-fa fa-upload');
  uploadField.fileInputEl.dom.value = '';
  Ext.ComponentQuery.query('[reference \x3d uploadlabelref]')[0].hide();
  Ext.ComponentQuery.query('[reference \x3d uploadhiddenbtnref]')[0].hide();
  this.lookupReference('applyForm').getForm().reset();
}, buttonOnlyChange:function(field, value, e) {
  var me = this, viewModel = me.getViewModel(), file = field.fileInputEl.dom.files[0], fileValue = field.value, reader = new FileReader, format = file.type;
  fileExtension = file.name.split('.')[1];
  console.log('format check:', format);
  reader.onload = function() {
    if (format == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || format == 'text/plain' || format == 'application/msword' || format == 'application/pdf' || format == 'application/doc' || format == 'application/docx' || format == 'application/txt' || format == 'application/wps' || format == 'application/odt' || format == 'application/vnd.oasis.opendocument.text' || format == 'application/wpd' || format == 'application/rtf' || fileExtension == 'docx' || fileExtension == 
    'doc') {
      var appl = value.replace('C:\\fakepath\\', '');
      viewModel.set('resumePath2', appl);
      viewModel.set('uploadBtnForEditShow', false);
      var filefieldref = Ext.ComponentQuery.query('[reference \x3d fileuploadref]')[0], uploadBtnLabel = Ext.ComponentQuery.query('[reference \x3d uploadlabelref]')[0], uploadHiddenBtn = Ext.ComponentQuery.query('[reference \x3d uploadhiddenbtnref]')[0], uploadButton = Ext.ComponentQuery.query('[reference \x3d uploadbuttonref]')[0];
      uploadHiddenBtn.show();
      uploadHiddenBtn.setText(appl);
      uploadBtnLabel.show();
      filefieldref.hide();
      Ext.toast({html:'Your file uploaded successfully..!!', width:150, align:'t'});
    } else {
      Ext.toast({html:'Invalid Format', width:150, align:'t'});
    }
  };
  reader.readAsDataURL(file);
}, onInterviewBackButtonClick:function(item) {
  if (this.getReferences().applyForm != undefined) {
    this.getReferences().applyForm.getForm().getFields().items[12].hide();
  }
  if (window.sessionStorage.job_app_form == '1') {
    Ext.Msg.confirm('Confirm', 'Would you like to go back?', function(btnText) {
      if (btnText === 'no') {
      } else {
        if (btnText === 'yes') {
          this.onInterviewBackButtonClickFunc(item);
        }
      }
    }, this);
  } else {
    this.onInterviewBackButtonClickFunc(item);
  }
}, onInterviewBackButtonClickFunc:function(item) {
  window.sessionStorage.ddo_jobapplication = undefined;
  var params = {ddo_jobopening_id:parseInt(window.sessionStorage.ddo_jobopening_id), isjobApp:true};
  var url = '/jobapplication';
  var method = 'GET';
  Ext.Ajax.request({url:url, method:method, scope:this, params:params, success:function(resp, b, data, f, g, h) {
    var res = Ext.decode(resp.responseText);
    var msg = res.message;
    Ext.ComponentQuery.query('jobapplicationsappliedlistview')[0].items.items[1].store.loadRawData(JSON.parse(resp.responseText));
  }, failure:function(resp, b) {
    var data = Ext.decode(resp.responseText);
    Ext.toast(data.message, false, 't');
  }});
  var tagPanel = Ext.ComponentQuery.query('jobapplicationsappliedfilterview'), tagPanelItm = tagPanel[0].items.items;
  tagPanelItm[3].hide();
  tagPanelItm[4].hide();
  tagPanelItm[5].hide();
  var getDataStore = Ext.ComponentQuery.query('jobapplicationsappliedlistview')[0].down('dataview').getStore();
  getDataStore.removeFilter('filterByLocation');
  getDataStore.removeFilter('filterByDepartment');
  getDataStore.removeFilter('filterByDate');
  Ext.ComponentQuery.query('[reference \x3d jobapplicationreference]')[0].getLayout().setActiveItem('appliedList');
}, onSaveFunc:function(btn, e, opts) {
  var view = this.getView(), me = this, form = view.down('form').getForm(), values = form.getValues(), viewModel = view.getViewModel(), uploadHiddenBtn = Ext.ComponentQuery.query('[reference \x3d uploadhiddenbtnref]')[0], fileUpload = Ext.ComponentQuery.query('[reference \x3d fileuploadref]')[0], resumePath = window.sessionStorage.resumepath;
  var params = {ddo_jobapplicationstatus_id:1, ddo_jobeducation_id:values.educationname, ddo_jobhiringsource_id:values.hiringname, ddo_jobidentificationtype_id:values.identificationType, firstName:values.fname, lastName:values.lname, currentJobTitle:values.jobtitlename, workExpYears:parseInt(values.yearsname), workExpMonths:parseInt(values.monthsname), currentLocation:values.locationname, collegeName:values.univname, mobile:parseInt(values.mobilename), emailId:values.emailname, jobPortalName:values.portalname, 
  identification_num:values.identificationNumber, resumePath:viewModel.get('resumePath') || fileUpload.value, app_skills:values.skillsname.toString()};
  params.resumename = viewModel.get('resumePath2');
  var method = '';
  if (isNaN(window.sessionStorage.ddo_jobapplication)) {
    method = 'POST';
    window.sessionStorage.ddo_jobapplication = undefined;
    params.ddo_jobopening_id = parseInt(window.sessionStorage.ddo_jobopening_id);
  } else {
    params.ddo_jobapplication_id = parseInt(window.sessionStorage.ddo_jobapplication);
    method = 'PUT';
  }
  if (fileUpload.value != '') {
    if (viewModel.get('uploadBtnForEditShow') == false) {
      btn.up('form').submit({url:'/jobapplication/uploadResume', clientValidation:false, waitMsg:'Uploading your file...', success:function() {
        var text = Ext.JSON.decode(arguments[1].response.responseText), resumePathApp = text.data, fakePath = viewModel.data.resumePath;
        var appl = fakePath.replace('C:\\fakepath\\', '');
        viewModel.set('resumePath', '../' + resumePathApp);
        viewModel.set('resumePath2', appl);
        params.resumePath = resumePathApp;
        viewModel.set('uploadBtnForEditShow', true);
        var url = '/jobapplication';
        Ext.Ajax.request({url:url, method:method, scope:this, params:params, success:function(resp, b) {
          if (isNaN(window.sessionStorage.ddo_jobapplication)) {
            Ext.ComponentQuery.query('jobapplicationsappliedlistview')[0].items.items[1].store.add(params);
          }
          var res = Ext.decode(resp.responseText), msg = res.message, filefieldref = Ext.ComponentQuery.query('[reference \x3d fileuploadref]')[0], uploadBtnLabel = Ext.ComponentQuery.query('[reference \x3d uploadlabelref]')[0], uploadHiddenBtn = Ext.ComponentQuery.query('[reference \x3d uploadhiddenbtnref]')[0], uploadButton = Ext.ComponentQuery.query('[reference \x3d uploadbuttonref]')[0];
          filefieldref.show();
          uploadButton.setIconCls('x-fa fa-upload');
          uploadButton.setText('Choose File');
          uploadHiddenBtn.hide();
          uploadBtnLabel.hide();
          Ext.ComponentQuery.query('[reference \x3d applyForm]')[0].getForm().reset();
          window.sessionStorage.ddo_jobapplication = undefined;
          window.sessionStorage.job_app_form = '0';
          Ext.Msg.alert('success', msg);
          me.onInterviewBackButtonClick();
        }, failure:function(resp, b) {
          var data = Ext.decode(resp.responseText);
          Ext.toast(data.message, false, 't');
        }});
      }, failure:function() {
        Ext.toast({html:'Please fill all the required fields before uploading the file', width:150, align:'t'});
      }});
    } else {
      var url = '/jobapplication';
      Ext.Ajax.request({url:url, method:method, scope:this, params:params, success:function(resp, b) {
        if (isNaN(window.sessionStorage.ddo_jobapplication)) {
          Ext.ComponentQuery.query('jobapplicationsappliedlistview')[0].items.items[1].store.add(params);
        }
        var res = Ext.decode(resp.responseText), msg = res.message, filefieldref = Ext.ComponentQuery.query('[reference \x3d fileuploadref]')[0], uploadBtnLabel = Ext.ComponentQuery.query('[reference \x3d uploadlabelref]')[0], uploadHiddenBtn = Ext.ComponentQuery.query('[reference \x3d uploadhiddenbtnref]')[0], uploadButton = Ext.ComponentQuery.query('[reference \x3d uploadbuttonref]')[0];
        filefieldref.show();
        uploadButton.setIconCls('x-fa fa-upload');
        uploadButton.setText('Choose File');
        uploadHiddenBtn.hide();
        uploadBtnLabel.hide();
        Ext.ComponentQuery.query('[reference \x3d applyForm]')[0].getForm().reset();
        window.sessionStorage.ddo_jobapplication = undefined;
        window.sessionStorage.job_app_form = '0';
        Ext.Msg.alert('success', msg);
        me.onInterviewBackButtonClick();
      }, failure:function(resp, b) {
        var data = Ext.decode(resp.responseText);
        Ext.toast(data.message, false, 't');
      }});
    }
  } else {
    Ext.toast('Please Upload the file', false, 't');
  }
}, resetForm:function() {
  Ext.suspendLayouts();
  var form = this.getReferences().newjobapplyform;
  var fields = form.getForm().getFields().items;
  Ext.each(fields, function(f) {
    f.value = '';
    f.originalValue = '';
    var desc_field = fields[3], department_field = fields[2].rawValue;
    if (desc_field.isDirty() == true || department_field == 'Not Found') {
      desc_field.setValue('');
      department_field.replace(department_field, '');
    }
    f.resetToInitialValue();
  });
  Ext.resumeLayouts(true);
}, onSkillRender:function(combo, eOpts) {
  var comboStore = combo.getStore('JobOpenings.store.filtertoolbar.JobSkillsTypeStore');
  comboStore.load();
}, onHiringSourceSelection:function(combo, eOpts) {
  if (combo.value == 3) {
    this.getReferences().applyForm.getForm().getFields().items[12].show();
  } else {
    this.getReferences().applyForm.getForm().getFields().items[12].hide();
  }
}, onMobileNumEnter:function(mobile, e, eOpts) {
  if (mobile.value.length < 10) {
    var msg = 'Please enter 10 digit mobile number';
    Ext.Msg.alert('Warning', msg);
  }
}});
Ext.define('JobOpenings.view.jobapplications.AllJobApplicationViewMode', {extend:'Ext.panel.Panel', alias:'widget.alljobapplicationviewmode', requires:['JobOpenings.view.jobapplications.JobApplicationFormViewMode', 'JobOpenings.view.jobapplications.JobApplyController', 'JobOpenings.view.jobapplications.JobApplicationsViewModel'], viewModel:{type:'jobapplicationsviewmodel'}, controller:'jobapplycontroller', cls:'job-header', tools:[{xtype:'button', scale:'medium', iconCls:'goalsbackbtn-cls', cls:'jobback-btn-cls', 
style:{border:0}, listeners:{click:'onAllJobApplicationBackButtonClick'}}, {xtype:'label', html:'Back', cls:'backlabel-cls'}, {xtype:'label', html:'Intern UI Development/Add Application', cls:'titlelabel-cls', reference:'title_applicationCreatRef', margin:20}], items:[{xtype:'jobapplicationformviewmode'}]});
Ext.define('JobOpenings.view.jobopeningrequest.filtertoolbar.JobOpeningsFilterView', {extend:'Ext.panel.Panel', xtype:'jobopeningsfilterview', requires:['JobOpenings.store.filtertoolbar.FilterbyStatus', 'JobOpenings.view.jobopeningrequest.filtertoolbar.FilterViewModel'], viewModel:{type:'filterviewmodel'}, reference:'filterview', layout:{type:'hbox', width:'100%'}, cls:'filtertoolbar-cls', items:[{xtype:'button', width:6, cls:'karmascore-search-icon-field job-search-icon', height:6, padding:'-8 11 14 12'}, 
{xtype:'textfield', width:'30%', reference:'jobsearchref', emptyText:'Search', enableKeyEvents:true, cls:'karmascore-search-field searchFields job-search-field', listeners:{keyup:'onKeyUpJobSearch'}}, {xtype:'button', cls:'filter-btncls', listeners:{click:'hideCombobox'}}, {items:[{xtype:'button', reference:'dateFilterBtn', cls:'filterBtnsCls'}, {xtype:'button', reference:'dateFilterBtnCancel', cls:'filterBtnsClsCancel', text:'x', listeners:{click:'onCloseFilterClk'}}], hidden:true}, {items:[{xtype:'button', 
reference:'locationFilterBtn', cls:'filterBtnsCls'}, {xtype:'button', reference:'locationFilterBtnCancel', cls:'filterBtnsClsCancel', text:'x', listeners:{click:'onCloseFilterClk'}}], hidden:true}, {items:[{xtype:'button', reference:'departmentFilterBtn', cls:'filterBtnsCls'}, {xtype:'button', reference:'departmentFilterBtnCancel', cls:'filterBtnsClsCancel', text:'x', listeners:{click:'onCloseFilterClk'}}], hidden:true}, {xtype:'tbfill'}, {xtype:'combobox', fieldLabel:'Status', tpl:Ext.create('Ext.XTemplate', 
'\x3cul class\x3d"x-list-plain"\x3e\x3ctpl for\x3d"."\x3e', '\x3cli role\x3d"option" class\x3d"x-boundlist-item" style\x3d"text-align:center;"\x3e{name}\x3c/li\x3e', '\x3c/tpl\x3e\x3c/ul\x3e'), displayTpl:Ext.create('Ext.XTemplate', '\x3ctpl for\x3d"."\x3e', '{name}', '\x3c/tpl\x3e'), reference:'jobstatuscomboref', queryMode:'local', displayField:'name', valueField:'id', emptyText:'All', editable:false, cls:'requestCombo-cls', store:Ext.create('JobOpenings.store.filtertoolbar.FilterbyStatus'), autoLoadOnValue:true, 
listeners:{select:'onStatusSelectionFilter'}}, {xtype:'button', text:'Create New', width:100, height:35, textAlign:'center', cls:'create-new-btn-cls', listeners:{click:'onCreateNewJob'}, bind:{hidden:'{showJobsCreateBtn}'}}, {xtype:'tbspacer', width:19}]});
Ext.define('JobOpenings.view.jobapplications.JobApplicationsfilterview', {extend:'Ext.panel.Panel', xtype:'jobapplicationfilterview', requires:['JobOpenings.store.filtertoolbar.FilterbyStatus', 'JobOpenings.view.jobapplications.JobApplicationsViewModel'], viewModel:{type:'jobapplicationsviewmodel'}, reference:'applicationfilterview', layout:{type:'hbox', width:'100%'}, cls:'filtertoolbar-cls', items:[{xtype:'button', width:6, cls:'karmascore-search-icon-field job-search-icon', height:6, padding:'-8 11 14 12'}, 
{xtype:'textfield', width:'30%', reference:'jobsearchref_job_app_all', enableKeyEvents:true, emptyText:'Search', cls:'karmascore-search-field searchFields job-search-field', listeners:{keyup:'onKeyUpJobSearch'}}, {xtype:'button', cls:'filter-btncls', listeners:{click:'hideCombobox'}}, {items:[{xtype:'button', reference:'dateFilterBtn', cls:'filterBtnsCls'}, {xtype:'button', reference:'dateFilterBtnCancel', cls:'filterBtnsClsCancel', text:'x', listeners:{click:'onCloseFilterClk'}}], hidden:true}, 
{items:[{xtype:'button', reference:'locationFilterBtn', cls:'filterBtnsCls'}, {xtype:'button', reference:'locationFilterBtnCancel', cls:'filterBtnsClsCancel', text:'x', listeners:{click:'onCloseFilterClk'}}], hidden:true}, {items:[{xtype:'button', reference:'departmentFilterBtn', cls:'filterBtnsCls'}, {xtype:'button', reference:'departmentFilterBtnCancel', cls:'filterBtnsClsCancel', text:'x', listeners:{click:'onCloseFilterClk'}}], hidden:true}, {xtype:'tbfill'}, {xtype:'combobox', fieldLabel:'Status', 
reference:'jobstatuscomboref', queryMode:'local', displayField:'name', valueField:'id', emptyText:'All', cls:['requestCombo-cls', 'request-combo-margin'], store:Ext.create('JobOpenings.store.filtertoolbar.FilterbyStatus'), autoLoadOnValue:true, listeners:{select:'onStatusSelectionFilter'}, hidden:true}, {xtype:'tbspacer', width:20}]});
Ext.define('JobOpenings.view.jobapplications.filtertoolbar.JobApplicationsAppliedFilterView', {extend:'Ext.panel.Panel', xtype:'jobapplicationsappliedfilterview', requires:['JobOpenings.store.filtertoolbar.FilterbyStatus'], reference:'appliedfilterview', viewModel:{type:'jobapplicationsviewmodel'}, layout:{type:'hbox', width:'100%'}, cls:'filtertoolbar-cls', dockedItems:[{xtype:'toolbar', cls:'tooltip-cls', dock:'top', items:[{xtype:'button', scale:'medium', iconCls:'goalsbackbtn-cls', cls:'jobback-btn-cls', 
style:{border:0}, listeners:{click:'onBackClick'}}, {xtype:'label', html:'Back', cls:'backlabel-cls'}, {xtype:'label', html:'Intern UI Development/Applications', cls:'titlelabel-cls', reference:'title_applicationViewRef', margin:20}]}], items:[{xtype:'button', width:6, cls:'karmascore-search-icon-field job-search-icon', height:6, padding:'-8 11 14 12'}, {xtype:'textfield', width:'30%', reference:'jobsearchref_job_applied', enableKeyEvents:true, emptyText:'Search', cls:'karmascore-search-field searchFields job-search-field', 
listeners:{keyup:'onKeyUpJobSearch'}}, {xtype:'button', cls:'filter-btncls', listeners:{click:'hideCombobox'}}, {items:[{xtype:'button', reference:'dateFilterBtn', cls:'filterBtnsCls'}, {xtype:'button', reference:'dateFilterBtnCancel', cls:'filterBtnsClsCancel', text:'x', listeners:{click:'onCloseFilterClkapplied'}}], hidden:true}, {items:[{xtype:'button', reference:'locationFilterBtn', cls:'filterBtnsCls'}, {xtype:'button', reference:'locationFilterBtnCancel', cls:'filterBtnsClsCancel', text:'x', 
listeners:{click:'onCloseFilterClkapplied'}}], hidden:true}, {items:[{xtype:'button', reference:'departmentFilterBtn', cls:'filterBtnsCls'}, {items:[{xtype:'button', reference:'dateFilterBtn', cls:'filterBtnsCls'}, {xtype:'button', reference:'dateFilterBtnCancel', cls:'filterBtnsClsCancel', text:'x', listeners:{click:'onCloseFilterClkapplied'}}], hidden:true}, {items:[{xtype:'button', reference:'locationFilterBtn', cls:'filterBtnsCls'}, {xtype:'button', reference:'locationFilterBtnCancel', cls:'filterBtnsClsCancel', 
text:'x', listeners:{click:'onCloseFilterClkapplied'}}], hidden:true}, {items:[{xtype:'button', reference:'departmentFilterBtn', cls:'filterBtnsCls'}, {xtype:'button', reference:'departmentFilterBtnCancel', cls:'filterBtnsClsCancel', text:'x', listeners:{click:'onCloseFilterClkapplied'}}], hidden:true}, {xtype:'tbfill'}, {xtype:'combobox', height:25, fieldLabel:'Status', tpl:Ext.create('Ext.XTemplate', '\x3cul class\x3d"x-list-plain"\x3e\x3ctpl for\x3d"."\x3e', '\x3cli role\x3d"option" class\x3d"x-boundlist-item" style\x3d"text-align:center;"\x3e{name}\x3c/li\x3e', 
'\x3c/tpl\x3e\x3c/ul\x3e'), displayTpl:Ext.create('Ext.XTemplate', '\x3ctpl for\x3d"."\x3e', '{name}', '\x3c/tpl\x3e'), reference:'jobappliedstatuscomboref', queryMode:'local', displayField:'name', editable:false, valueField:'ddo_jobapplicationstatus_id', emptyText:'All', cls:'requestCombo-cls', store:Ext.create('JobOpenings.store.filtertoolbar.FilterbyApplicationStatus'), autoLoadOnValue:true, xtype:'button', reference:'departmentFilterBtnCancel', cls:'filterBtnsClsCancel', text:'x', listeners:{click:'onCloseFilterClkapplied'}}], 
hidden:true}, {xtype:'tbfill'}, {xtype:'combobox', height:25, width:289, fieldLabel:'Status', reference:'jobappliedstatuscomboref', queryMode:'local', displayField:'name', editable:false, tpl:Ext.create('Ext.XTemplate', '\x3cul class\x3d"x-list-plain"\x3e\x3ctpl for\x3d"."\x3e', '\x3cli role\x3d"option" class\x3d"x-boundlist-item" style\x3d"text-align:center;"\x3e{name}\x3c/li\x3e', '\x3c/tpl\x3e\x3c/ul\x3e'), displayTpl:Ext.create('Ext.XTemplate', '\x3ctpl for\x3d"."\x3e', '{name}', '\x3c/tpl\x3e'), 
valueField:'ddo_jobapplicationstatus_id', emptyText:'All', cls:'requestCombo-cls', store:Ext.create('JobOpenings.store.filtertoolbar.FilterbyApplicationStatus'), autoLoadOnValue:true, listeners:{select:'onStatusSelectionFilter'}}, {xtype:'button', text:'New Application', height:35, textAlign:'center', cls:'create-new-btn-cls', bind:{hidden:'{showJobAppCreateBtn}'}, listeners:{click:function(btn) {
  var recTitle = window.sessionStorage.newApplicationHead;
  if (recTitle.length > 52) {
    recTitle = recTitle.substring(0, 49) + '...';
  }
  Ext.ComponentQuery.query('[reference \x3d title_applicationCreationRef]')[0].setHtml(recTitle + '/ ' + 'Add Application');
  Ext.ComponentQuery.query('[reference \x3d jobapplicationreference]')[0].getLayout().setActiveItem('jobapply');
  var btnRef = Ext.ComponentQuery.query('[reference \x3d uploadbuttonref]')[0], fileuploadField = Ext.ComponentQuery.query('[reference \x3d fileuploadref]')[0], uploadHiddenLabel = Ext.ComponentQuery.query('[reference \x3d uploadlabelref]')[0], uploadHiddenBtn = Ext.ComponentQuery.query('[reference \x3d uploadhiddenbtnref]')[0];
  uploadHiddenBtn.hide();
  uploadHiddenLabel.hide();
  fileuploadField.show();
  btnRef.setText('Choose File');
  btnRef.setIconCls('x-fa fa-upload');
  Ext.ComponentQuery.query('[reference \x3d applyForm]')[0].getForm().reset();
  window.sessionStorage.ddo_jobapplication = undefined;
  window.sessionStorage.job_app_form = '0';
}}}, {xtype:'tbspacer', width:19}]});
Ext.define('JobOpenings.view.jobapplications.JobApplicationRequestListView', {extend:'Ext.container.Container', xtype:'jobapplicationrequest', requires:['JobOpenings.view.jobopeningrequest.filtertoolbar.JobOpeningsFilterView', 'JobOpenings.view.jobapplications.JobApplicationsViewModel', 'JobOpenings.view.jobapplications.JobApplicationsfilterview', 'JobOpenings.view.jobapplications.filtertoolbar.JobApplicationsAppliedFilterView'], cls:'jobopening-cls noscrollbar', controller:'jobappliedformcontroller', 
viewModel:{type:'jobapplicationsviewmodel'}, reference:'jobapplicationrequestlistview', items:[{xtype:'container', html:'\x3cdiv class\x3d"jobtitle-cls"\x3eJob Applications\x3c/div\x3e'}, {xtype:'jobapplicationfilterview'}, {xtype:'dataview', reference:'jobapplieddataview', cls:'jobdataviewcls', emptyText:'\x3cdiv class\x3d"projects-emptytext-cls"\x3eNo Jobs available\x3c/div\x3e', itemTpl:['\x3cdiv class\x3d"jobsdiv-cls ddo-jobopening-item-applications"\x3e', '\x3cdiv class\x3d"title-div-cls" data-qtip\x3d"{title}-{department_name}"\x3e\x3cspan class\x3d"title-cls"\x3e{[this.showTitle(values,15)]}\x3c/span\x3e', 
'\x3cspan\x3e | \x3c/span\x3e', '\x3cspan class\x3d"creator-cls" data-qtip\x3d"{firstname}"\x3eCreated by {[this.showName(values,8)]}\x3c/span\x3e\x3c/div\x3e', '{[this.workOnPriorityShow(values)]}', '\x3cdiv class\x3d"positions-cls"\x3e( {count_status}/{noofpositions} ) Positions\x3c/div\x3e', '\x3cdiv class\x3d"loc-exp"\x3e\x3cspan\x3e\x3ci class\x3d"exp-iconcls arrow-cls"\x3e\x3c/i\x3e\x26nbsp{minworkexperience} - {maxworkexperience} Years Experience \x3c/span\x3e', '\x3cspan\x3e\x3ci class\x3d"location-iconcls arrow-cls"\x3e\x3c/i\x3e\x26nbsp{location_name}\x3c/span\x3e', 
'\x3c/div\x3e', '\x3cdiv class\x3d"skill-cls"\x3e\x3ci class\x3d"skill-iconcls arrow-cls"\x3e\x3c/i\x3e{[this.showSkill(values)]}\x3c/div\x3e', '\x3cdiv class\x3d"desc-cls"\x3e{[this.showDescription(values,100)]}\x3c/div\x3e', '\x3c/div\x3e', '\x3cdiv class\x3d"status-div-cls"\x3e\x3cdiv class\x3d"status-textcls"\x3e\x3cspan \x3e{count} Applications\x3c/span\x3e\x3c/div\x3e', '\x3cdiv class\x3d" create-jobapplication-btn-cls forNewAppli"\x3eView Applications', '\x3c/div\x3e', '\x3c/div\x3e', '\x3c/div\x3e', 
{showDescription:function(values, limit) {
  var desc = values.job_desc;
  if (desc.length >= limit) {
    return '\x3cdiv style\x3d"text-overflow: ellipsis; white-space: nowrap; overflow: hidden; width:411px; height: 36px;"\x3e' + desc + '\x3c/div\x3e';
  } else {
    return desc;
  }
}, showTitle:function(values, limit) {
  var title = values.title + ' - ' + values.department_name;
  if (title.length >= limit) {
    return title.substring(0, 17) + '...';
  } else {
    return title;
  }
}, showName:function(values, limit) {
  var name = values.firstname;
  if (name.length >= limit) {
    return name.substring(0, 8) + '...';
  } else {
    return name;
  }
}, showSkill:function(values) {
  var skillStr = '';
  try {
    var skillsArr = values.skillnames;
    skillsArr.forEach(function(item, index) {
      skillStr += skillsArr.length - 1 != index ? '#' + item + ', ' : '#' + item;
    });
  } catch (exce) {
  }
  return skillStr;
}, workOnPriorityShow:function(values) {
  if (values.work_on_priority == 'Y') {
    return '\x3cdiv class\x3d"create-jobapplication-starbtn-cls"\x3e\x3cspan\x3e\x3ci class\x3d"star-cls arrow-cls"\x3e\x3c/i\x3e\x3c/span\x3e\x3c/div\x3e';
  } else {
    return '';
  }
}}], itemSelector:'div.status-div-cls', listeners:{itemclick:'onViewApplicationClick'}}]});
Ext.define('JobOpenings.view.jobapplications.JobApplicationViewMode', {extend:'Ext.panel.Panel', alias:'widget.jobapplicationviewmode', requires:['JobOpenings.view.jobapplications.JobApplicationFormViewMode', 'JobOpenings.view.jobapplications.JobApplyController', 'JobOpenings.view.jobapplications.JobApplicationsViewModel'], viewModel:{type:'jobapplicationsviewmodel'}, controller:'jobapplycontroller', cls:'job-header', tools:[{xtype:'button', scale:'medium', iconCls:'goalsbackbtn-cls', cls:'jobback-btn-cls', 
style:{border:0}, listeners:{click:'onInterviewBackButtonClick'}}, {xtype:'label', html:'Back', cls:'backlabel-cls'}, {xtype:'label', html:'Intern UI Development/Add Application', cls:'titlelabel-cls', reference:'title_applicationCreatRef', margin:20}], items:[{xtype:'jobapplicationformviewmode'}]});
Ext.define('JobOpenings.view.jobapplications.JobApplicationsAppliedListView', {extend:'Ext.container.Container', xtype:'jobapplicationsappliedlistview', requires:['JobOpenings.view.jobapplications.filtertoolbar.JobApplicationsAppliedFilterView', 'JobOpenings.view.jobapplications.JobApplicationsViewModel'], cls:'jobopening-cls noscrollbar', reference:'appliedlistview', controller:'jobappliedformcontroller', viewModel:{type:'jobapplicationsviewmodel'}, items:[{xtype:'jobapplicationsappliedfilterview'}, 
{xtype:'dataview', reference:'jobapplicationdataview', cls:'jobdataviewcls', emptyText:'\x3cdiv class\x3d"projects-emptytext-cls"\x3eNo Jobs available\x3c/div\x3e', itemTpl:['\x3cdiv class\x3d"itemSelecCls"\x3e', '\x3cdiv class\x3d"jobsdiv-cls ddo-jobopening-item"\x3e', '\x3cdiv class\x3d"title-div-cls"\x3e\x3cspan class\x3d"title-cls"\x3e{[this.showName(values)]}\x3c/span\x3e', '\x3cspan\x3e | \x3c/span\x3e', '\x3cspan class\x3d"creator-cls"\x3e{[this.showCurrentjobtitle(values)]}\x3c/span\x3e', 
'\x3cdiv class\x3d"interview-cls" style\x3d"{[this.intervwDisabled(values)]}"\x3eInterview\x3ci class\x3d"interview-iconcls arrow-cls"\x3e\x3c/i\x3e\x3c/span\x3e\x3c/div\x3e', '\x3c/div\x3e', '\x3cdiv class\x3d"loc-exp-applications"\x3e\x3cspan\x3e\x3ci class\x3d"exp-iconcls arrow-cls"\x3e\x3c/i\x3e\x26nbsp{workexpyears}.{workexpmonths} Years Experience \x3c/span\x3e', '\x3cspan\x3e\x3ci class\x3d"location-iconcls arrow-cls"\x3e\x3c/i\x3e\x26nbsp{currentlocation}\x3c/span\x3e', '\x3c/div\x3e', '\x3cdiv class\x3d"loc-exp-applications-skills"\x3e\x3ci class\x3d"skill-iconcls arrow-cls"\x3e\x3c/i\x3e\x26nbsp{[this.getAllSkills(values)]}\x3c/div\x3e', 
'\x3cdiv class\x3d"loc-exp-applications-edu"\x3e\x3ci class\x3d"education-iconcls arrow-cls"\x3e\x3c/i\x3e\x26nbsp{education} - {[this.showCollegename(values)]}\x3c/div\x3e', '\x3cdiv class\x3d"loc-exp-applications-con"\x3e', '\x3cspan\x3e\x3ci class\x3d"phone_iconcls_intrvw_req"\x3e\x3c/i\x3e\x26nbsp+91\x26nbsp{[this.showMobile(values)]} \x26nbsp \x26nbsp\x3c/span\x3e', '\x3cspan\x3e\x3ci class\x3d"mail-iconcls arrow-cls"\x3e\x3c/i\x3e\x26nbsp {[this.showEmailId(values)]}\x3c/span\x3e', '\x3c/div\x3e', 
'\x3c/div\x3e', '\x3cdiv class\x3d"status-div-cls"\x3e\x3cdiv class\x3d"status-textcls"\x3eStatus: \x3cspan class\x3d"{job_status_name}" style\x3d"color:{colorcode};"\x3e{appstatus}\x3c/span\x3e\x3c/div\x3e', '\x3cdiv class\x3d"status-combo-cls"\x3e\x3ca href\x3d{resumepath} target\x3d"_blank" download \x3d{resumename} style\x3d"text-decoration: none;"\x3e\x3cspan class\x3d"download-cls"\x3eDownloadCV \x3ci class\x3d"download-iconcls arrow-cls"\x3e\x3c/i\x3e\x3c/span\x3e\x3c/a\x3e', '\x3cspan\x3e | \x3c/span\x3e', 
'\x3cdiv class\x3d"act-cls"\x3eActions \x3ci class\x3d"x-fa fa-sort-desc arrow-cls"\x3e\x3c/i\x3e', '\x3cdiv class\x3d"act-removecls"\x3e{[this.getActions(values)]}', '\x3c/div\x3e\x3c/div\x3e', '\x3c/div\x3e', '\x3c/div\x3e', '\x3c/div\x3e', {showMobile:function(values) {
  var mobile = values.mobile != undefined && values.mobile != null ? values.mobile.toString() : '';
  if (mobile.length > 10) {
    return mobile.substring(0, 10) + '...';
  } else {
    return mobile;
  }
}, showEmailId:function(values) {
  var emailid = values.emailid != undefined && values.emailid != null ? values.emailid : '';
  if (emailid.length > 25) {
    return emailid.substring(0, 22) + '...';
  } else {
    return emailid;
  }
}, showCollegename:function(values) {
  var collegename = values.collegename != undefined && values.collegename != null ? values.collegename : '';
  if (collegename.length > 20) {
    return collegename.substring(0, 17) + '...';
  } else {
    return collegename;
  }
}, showName:function(values) {
  var fullname = values.appfirstname + ' ' + values.applastname;
  if (fullname.length > 20) {
    return fullname.substring(0, 17) + '...';
  } else {
    return fullname;
  }
}, showCurrentjobtitle:function(values) {
  var currentjobtitle = values.currentjobtitle != undefined && values.currentjobtitle != null ? values.currentjobtitle : '';
  if (currentjobtitle.length > 12) {
    return currentjobtitle.substring(0, 9) + '...';
  } else {
    return currentjobtitle;
  }
}, intervwDisabled:function(values) {
  if (values.currentjobtitle == undefined || values.currentjobtitle == null) {
    return 'background-color: #908d8d;';
  }
}, getAllSkills:function(values) {
  var skillStr = '';
  try {
    var skillsArr = values.skillnames != undefined && values.skillnames != null ? values.skillnames : [];
    skillsArr.forEach(function(item, index) {
      skillStr += skillsArr.length - 1 != index ? '#' + item + ', ' : '#' + item;
    });
  } catch (exce) {
  }
  if (skillStr.length > 29) {
    return skillStr.substring(0, 26) + '...';
  } else {
    return skillStr;
  }
}, getActions:function(values) {
  var view = Ext.ComponentQuery.query('mainviewport')[0], viewModel = view.getViewModel(), showAction = viewModel.data.showAction;
  var actions = [], actionsStore = Ext.getStore('jobopenings.JobopeningsActions');
  if (actionsStore) {
    actionsStore.each(function(rec) {
      var actionName = rec.get('action_name');
      if (viewModel.get('editJobApplication') == true && actionName == 'Edit') {
        actions.push('\x3cli\x3e' + rec.get('action_name') + '\x3c/li\x3e');
      }
      if (viewModel.get('deleteJobApplication') == true && actionName == 'Delete') {
        actions.push('\x3cli\x3e' + rec.get('action_name') + '\x3c/li\x3e');
      }
    });
  }
  return '\x3cul\x3e' + actions.toString().replace(/,/g, '') + '\x3c/ul\x3e';
}}], itemSelector:'div.itemSelecCls', listeners:{itemclick:'onJobOpeningClick', containerClick:'onContainerClick'}}]});
Ext.define('JobOpenings.view.jobapplications.JobAppliedFormController', {extend:'Ext.app.ViewController', alias:'controller.jobappliedformcontroller', onBackClick:function(item) {
  var tagPanel = Ext.ComponentQuery.query('jobapplicationsappliedfilterview'), tagPanelItm = tagPanel[0].items.items;
  tagPanelItm[3].hide();
  tagPanelItm[4].hide();
  tagPanelItm[5].hide();
  var getDataStore = Ext.ComponentQuery.query('jobapplicationsappliedlistview')[0].down('dataview').getStore();
  getDataStore.removeFilter('filterByLocation');
  getDataStore.removeFilter('filterByExperience');
  getDataStore.removeFilter('filterByDate');
  Ext.ComponentQuery.query('[reference \x3d jobapplicationreference]')[0].getLayout().setActiveItem('mainList');
  Ext.Ajax.request({url:'jobopeningrequest', method:'GET', scope:this, success:function(resp, b, data, f, g, h) {
    var res = Ext.decode(resp.responseText);
    var msg = res.message;
    Ext.ComponentQuery.query('jobapplicationrequest')[0].items.items[2].store.loadRawData(JSON.parse(resp.responseText));
  }, failure:function(resp, b) {
    var data = Ext.decode(resp.responseText);
    Ext.toast(data.message, false, 't');
  }});
}, onJobOpeningClick:function(vw, record, item, index, e, eOpts) {
  x = vw.all.elements;
  for (var i = 0; i < x.length; i++) {
    z = x[i].lastChild.lastChild.lastChild.children[1];
    if (z.className == 'act-showcls') {
      z.classList.remove('act-showcls');
      z.classList.add('act-removecls');
    }
  }
  if (e.target.className == 'title-cls') {
    var mainView = Ext.ComponentQuery.query('[reference \x3d jobapplicationreference]')[0], form = Ext.ComponentQuery.query('jobapplicationformviewmode')[0], jobportalField = Ext.ComponentQuery.query('[reference \x3d portalref]')[0];
    mainView.getLayout().setActiveItem(4);
    var myObj = {fnameView:record.data.appfirstname, lnameView:record.data.applastname, jobtitlenameView:record.data.currentjobtitle ? record.data.currentjobtitle.split('\x26apos;').join("'") : null, yearsnameView:record.data.workexpyears, monthsnameView:record.data.workexpmonths, skillsnameView:record.data.skillnames ? record.data.skillnames.join(', ') : null, locationnameView:record.data.currentlocation, educationnameView:record.data.education, univnameView:record.data.collegename, mobilenameView:record.data.mobile, 
    emailnameView:record.data.emailid, hiringnameView:record.data.name, portalnameView:record.data.jobportalname, appResumeView:record.data.resumename, identificationType:record.data.ddo_jobidentificationtype_id, identificationNumber:record.data.identification_num};
    form.getForm().setValues(myObj);
    if (myObj.portalnameView == null) {
      jobportalField.hide();
    }
    Ext.ComponentQuery.query('[reference \x3d title_applicationCreatRef]')[0].setHtml(window.sessionStorage.newApplicationHead + '/' + 'View Application');
  }
  if (e.target.lastChild != null && e.target.className == 'act-cls') {
    if (e.target.lastChild.classList.value !== 'act-showcls') {
      item.children[1].children[1].children[2].children[1].className = 'act-showcls';
    } else {
      item.children[1].children[1].children[2].children[1].className = 'act-removecls';
    }
  }
  if (e.target.innerText == 'Delete') {
    Ext.Msg.confirm('Confirm', 'Are you sure you want to delete this job application?', function(btnText) {
      if (btnText === 'no') {
      } else {
        if (btnText === 'yes') {
          var params = {ddo_jobapplication_id:record.data.ddo_jobapplication};
          var url = '/jobapplication';
          var method = 'DELETE';
          Ext.Ajax.request({url:url, method:method, scope:this, params:params, success:function(resp, b) {
            var res = Ext.decode(resp.responseText), msg = res.message;
            this.getViewModel().getStore('jobApplicationsDataViewStore').load();
            var params = {ddo_jobopening_id:parseInt(record.data.ddo_jobopening_id)};
            var url = '/jobapplication';
            var method = 'GET';
            Ext.Ajax.request({url:url, method:method, scope:this, params:params, success:function(resp, b, data, f, g, h) {
              this.getViewModel().getStore('jobapplicationsappliedstore').loadRawData(JSON.parse(resp.responseText));
            }, failure:function(resp, b) {
            }});
            Ext.Msg.alert('success', msg);
          }, failure:function(resp, b) {
            var data = Ext.decode(resp.responseText);
            Ext.toast(data.message, false, 't');
          }});
        }
      }
    }, this);
  } else {
    if (e.target.innerText == 'Edit') {
      var form = Ext.ComponentQuery.query('[reference \x3d jobapplicationreference]')[0];
      form.getLayout().setActiveItem(2);
      var applicationData = record.data;
      var ddo_jobopening_id = record.data.ddo_jobopening_id;
      if (record.data.currentjobtitle != undefined && record.data.currentjobtitle != null) {
        record.data.currentJobTitle = record.data.currentjobtitle.split('\x26apos;').join("'");
      }
      var fields = Ext.ComponentQuery.query('newjobapplyform')[0].getForm().getFields();
      var viewModel = this.getViewModel(), filefieldref = Ext.ComponentQuery.query('[reference \x3d fileuploadref]')[0], uploadHiddenBtn = Ext.ComponentQuery.query('[reference \x3d uploadhiddenbtnref]')[0], uploadHiddenLabel = Ext.ComponentQuery.query('[reference \x3d uploadlabelref]')[0];
      viewModel.set('resumePath', record.data.resumepath);
      filefieldref.value = record.data.resumepath;
      filefieldref.setRawValue(record.data.resumepath);
      filefieldref.setValue(record.data.resumepath);
      filefieldref.hide();
      uploadHiddenBtn.show();
      uploadHiddenLabel.show();
      uploadHiddenBtn.setText(record.data.resumename);
      this.loadRecord(record);
      var dataview = this.getReferences().jobapplicationdataview;
      dataview.getStore().reload();
      dataview.refresh();
      setTimeout(function() {
        Ext.each(fields.items, function(field) {
          field.dirty = false;
          field.wasDirty = false;
        });
      }, 1000);
      Ext.ComponentQuery.query('[reference \x3d title_applicationCreationRef]')[0].setHtml(window.sessionStorage.newApplicationHead + '/' + 'Edit Application');
      window.sessionStorage.ddo_jobapplication = record.data.ddo_jobapplication;
      window.sessionStorage.job_app_form = '0';
    }
  }
  var intervwPerm = true;
  if (e.target.innerText == 'Interview') {
    if (record.data.currentjobtitle == undefined || record.data.currentjobtitle == null) {
      intervwPerm = false;
    }
  }
  if (e.target.innerText == 'Interview' && intervwPerm == true) {
    window.sessionStorage.renderingData = JSON.stringify(record.data);
    window.sessionStorage.ddo_jobapplication_id_forApplStatus = record.data.ddo_jobapplication;
    var tagPanel = Ext.ComponentQuery.query('jobapplicationsappliedfilterview'), tagPanelItm = tagPanel[0].items.items;
    tagPanelItm[3].hide();
    tagPanelItm[4].hide();
    tagPanelItm[5].hide();
    var getDataStore = Ext.ComponentQuery.query('jobapplicationsappliedlistview')[0].down('dataview').getStore();
    getDataStore.removeFilter('filterByLocation');
    getDataStore.removeFilter('filterByExperience');
    getDataStore.removeFilter('filterByDate');
    var recTitle = record.data.title, recAppFirstName = record.data.appfirstname;
    if (recTitle.length > 25) {
      recTitle = recTitle.substring(0, 22) + '...';
    }
    if (recAppFirstName.length > 25) {
      recAppFirstName = recAppFirstName.substring(0, 22) + '...';
    }
    Ext.ComponentQuery.query('[reference \x3d jobapplications_interviewScreenTitle]')[0].setHtml(recTitle + '/' + recAppFirstName + '/' + 'Interview');
    Ext.ComponentQuery.query('[reference \x3d jobapplicationreference]')[0].getLayout().setActiveItem('interviewschd');
    var mainViewModel = Ext.ComponentQuery.query('mainviewport')[0].getViewModel();
    if (mainViewModel.data.addInterviewShow == true) {
      Ext.ComponentQuery.query('[reference \x3d oninterviewscheduledref]')[0].items.items[0].show();
    } else {
      Ext.ComponentQuery.query('[reference \x3d oninterviewscheduledref]')[0].items.items[0].hide();
    }
    Ext.ComponentQuery.query('scheduleinterview')[0].items.items[1].items.items[0].store.loadRawData(record);
    Ext.ComponentQuery.query('[reference \x3d interviewerref]')[0].setValue(record.data.ddo_jobapplicationstatus_id);
    Ext.Ajax.request({url:'/jobappinterview', method:'GET', scope:this, success:function(resp, b, data, f, g, h) {
      Ext.ComponentQuery.query('oninterviewscheduled')[0].items.items[2].items.items[0].store.loadRawData(JSON.parse(resp.responseText));
      Ext.ComponentQuery.query('oninterviewscheduled')[0].items.items[2].items.items[0].store.sort('updated', 'DESC');
      Ext.ComponentQuery.query('oninterviewscheduled')[0].items.items[2].items.items[0].store.filter({property:'ddo_jobapplication_id', id:'filterBy_ddo_jobapplication_id', anyMatch:true, caseSensitie:false, value:record.data.ddo_jobapplication}, record.data.ddo_jobapplication, false);
      if (Ext.ComponentQuery.query('oninterviewscheduled')[0].items.items[2].items.items[0].store.data.items.length > 0) {
        var mainViewModel = Ext.ComponentQuery.query('mainviewport')[0].getViewModel();
        if (mainViewModel.data.addInterviewShow == true) {
          Ext.ComponentQuery.query('oninterviewscheduled')[0].items.items[0].setHidden(false);
          Ext.ComponentQuery.query('oninterviewscheduled')[0].items.items[1].setHidden(true);
          Ext.ComponentQuery.query('oninterviewscheduled')[0].items.items[2].setHidden(false);
        } else {
          Ext.ComponentQuery.query('oninterviewscheduled')[0].items.items[0].setHidden(true);
          Ext.ComponentQuery.query('oninterviewscheduled')[0].items.items[1].setHidden(true);
          Ext.ComponentQuery.query('oninterviewscheduled')[0].items.items[2].setHidden(false);
          Ext.ComponentQuery.query('addInterviewPlusIconRef')[0].addCls('requestdetails-cls');
        }
      } else {
        Ext.ComponentQuery.query('oninterviewscheduled')[0].items.items[0].setHidden(true);
        Ext.ComponentQuery.query('oninterviewscheduled')[0].items.items[1].setHidden(false);
        Ext.ComponentQuery.query('oninterviewscheduled')[0].items.items[2].setHidden(true);
      }
      var interviewSchview = Ext.ComponentQuery.query('[reference \x3d interviewschdref]')[0], jobappViewModel = interviewSchview.getViewModel(), interviewersComboStore = jobappViewModel.getStore('interviewrsStore'), ddo_jobopening_id = record.data.ddo_jobopening_id;
      interviewersComboStore.getProxy().extraParams = {'ddo_jobopening_id':ddo_jobopening_id};
      interviewersComboStore.load();
    }, failure:function(resp, b) {
      var data = Ext.decode(resp.responseText);
      Ext.toast(data.message, false, 't');
    }});
  }
}, loadRecord:function(record) {
  this._record = record;
  return this.setValues(record.getData());
}, setValues:function(values) {
  var me = Ext.ComponentQuery.query('newjobapplyform')[0], v, vLen, val;
  Ext.suspendLayouts();
  var filename = '';
  if (values.resumepath != '' && values.resumepath != undefined && values.resumepath != null) {
    filename = values.resumepath;
  }
  if (values) {
    var fieldObj = {fname:values.appfirstname, lname:values.applastname, jobtitlename:values.currentjobtitle, yearsname:values.workexpyears, monthsname:values.workexpmonths, skillsname:values.app_skills != null ? values.app_skills.split(',') : null, locationname:values.currentlocation, educationname:values.ddo_jobeducation_id, univname:values.collegename, mobilename:values.mobile, emailname:values.emailid, hiringname:values.ddo_jobhiringsource_id, portalname:values.jobportalname, appResume:values.resumepath, 
    identificationType:values.ddo_jobidentificationtype_id, identificationNumber:values.identification_num};
    fieldObj.uploadResumeHiddenBtn = values.resumepath;
    me.getForm().setValues(fieldObj);
    var v = values.resumepath, btnRef = Ext.ComponentQuery.query('[reference \x3d uploadbuttonref]')[0], filefieldref = Ext.ComponentQuery.query('[reference \x3d fileuploadref]')[0];
    btnRef.setText(values.resumename);
    btnRef.setIconCls('x-fa fa-times');
    filefieldref.value = values.resumepath;
    filefieldref.setValue(values.resumepath);
    filefieldref.setRawValue(values.resumepath);
    window.sessionStorage.ddo_jobapplication = values.ddo_jobapplication;
    window.sessionStorage.resumepath = values.resumepath;
  }
  Ext.resumeLayouts(true);
  return this;
}, onViewApplicationClick:function(vw, record, item, index, e, eOpts) {
  var jobDataView = Ext.ComponentQuery.query('[reference \x3d jobapplicationdataview]')[0];
  var store = this.getViewModel().getStore('jobapplicationsappliedstore');
  jobDataView.getStore().clearFilter();
  jobDataView.refresh();
  Ext.ComponentQuery.query('[reference \x3d jobsearchref_job_applied]')[0].setValue('');
  var params = {ddo_jobopening_id:parseInt(record.data.ddo_jobopening_id)};
  var url = '/jobapplication';
  var method = 'GET';
  Ext.Ajax.request({url:url, method:method, scope:this, params:params, success:function(resp, b, data, f, g, h) {
    Ext.ComponentQuery.query('jobapplicationsappliedlistview')[0].items.items[1].store.loadRawData(JSON.parse(resp.responseText));
  }, failure:function(resp, b) {
    var data = Ext.decode(resp.responseText);
    Ext.toast(data.message, false, 't');
  }});
  var tagPanel = Ext.ComponentQuery.query('jobapplicationfilterview'), tagPanelItm = tagPanel[0].items.items;
  tagPanelItm[3].hide();
  tagPanelItm[4].hide();
  tagPanelItm[5].hide();
  var getDataStore = Ext.ComponentQuery.query('jobapplicationrequest')[0].down('dataview').getStore();
  getDataStore.removeFilter('filterByLocation');
  getDataStore.removeFilter('filterByExperience');
  getDataStore.removeFilter('filterByDate');
  var filterWindow = Ext.ComponentQuery.query('[reference \x3d filterapplicationwinref]')[0];
  if (filterWindow != undefined) {
    var winForm = filterWindow.down('form');
    winForm.getForm().findField('filterlocation').setValue('All');
    winForm.getForm().findField('minworkexperience').setValue('0');
    winForm.getForm().findField('maxworkexperience').setValue('0');
    winForm.getForm().findField('filterDateName').setValue('All');
  }
  var jobStatusCombo = Ext.ComponentQuery.query('[reference \x3d jobappliedstatuscomboref]')[0];
  jobStatusCombo.setValue(null);
  jobStatusCombo.getStore().clearFilter();
  window.sessionStorage.ddo_jobopening_id = record.data.ddo_jobopening_id;
  window.sessionStorage.newApplicationHead = record.data.title + '-' + record.data.department_name;
  var recTitle = record.data.title;
  if (recTitle.length > 52) {
    recTitle = recTitle.substring(0, 49) + '...';
  }
  Ext.ComponentQuery.query('[reference \x3d title_applicationViewRef]')[0].setHtml(recTitle + '/' + 'Applications');
  Ext.ComponentQuery.query('[reference \x3d jobapplicationreference]')[0].getLayout().setActiveItem('appliedList');
}, onContainerClick:function(vw, record, item) {
  x = vw.all.elements;
  for (var i = 0; i < x.length; i++) {
    z = x[i].lastChild.lastChild.lastChild.children[1];
    if (z.className == 'act-showcls') {
      z.classList.remove('act-showcls');
      z.classList.add('act-removecls');
    }
  }
}, hideCombobox:function(com, e, eOpts) {
  if (Ext.ComponentQuery.query('[reference \x3d filterapplicationwinref]')[0] == undefined) {
    Ext.create('JobOpenings.view.jobapplications.filtertoolbar.JobApplicationsAppliedAddfilterWindow').show();
  } else {
    var filterWindow = Ext.ComponentQuery.query('[reference \x3d filterapplicationwinref]')[0];
    filterWindow.show();
    var winForm = filterWindow.down('form'), formValues = winForm.getValues(), viewmodel = this.getViewModel();
    if (viewmodel.data.filtervalue == 'filterByLocation') {
      winForm.getForm().findField('filterlocation').setValue('All');
    } else {
      if (viewmodel.data.filtervalue == 'filterByExperience') {
        winForm.getForm().findField('minworkexperience').setValue(null);
        winForm.getForm().findField('maxworkexperience').setValue(null);
      } else {
        if (viewmodel.data.filtervalue == 'filterByDate') {
          winForm.getForm().findField('filterDateName').setValue('All');
        }
      }
    }
  }
  if (Ext.ComponentQuery.query('[reference \x3d jobapplicationreference]')[0].getLayout().getActiveItem().id == 'mainList') {
    Ext.ComponentQuery.query('jobapplicationsappliedfiltercomboboxes')[0].items.items[0].items.items[0].items.items[1].show();
    Ext.ComponentQuery.query('jobapplicationsappliedfiltercomboboxes')[0].items.items[1].items.items[0].items.items[1].show();
  } else {
    Ext.ComponentQuery.query('jobapplicationsappliedfiltercomboboxes')[0].items.items[0].items.items[0].items.items[1].hide();
    Ext.ComponentQuery.query('jobapplicationsappliedfiltercomboboxes')[0].items.items[1].items.items[0].items.items[1].hide();
  }
}, onCloseFilterClk:function(btn) {
  var parentBtnRef = btn.reference.split('Cancel')[0], viewModel = this.getViewModel();
  var parentClassViewItms = Ext.ComponentQuery.query('jobapplicationfilterview')[0].items.items;
  parentClassViewItms.forEach(function(item, index) {
    if (index == 3 || index == 4 || index == 5) {
      if (item.items.items[0].reference == parentBtnRef) {
        item.hide();
        var removeFilterValue = index == 4 ? 'filterByLocation' : index == 5 ? 'filterByExperience' : 'filterByDate';
        var dataview = Ext.ComponentQuery.query('jobapplicationrequest')[0].down('dataview');
        var openingsView = Ext.ComponentQuery.query('jobapplicationrequest')[0];
        var store = openingsView.getViewModel().getStore('jobApplicationsDataViewStore');
        store.removeFilter(removeFilterValue);
        viewModel.set('filtervalue', removeFilterValue);
      }
    }
  });
}, onCloseFilterClkapplied:function(btn) {
  var parentBtnRef = btn.reference.split('Cancel')[0], viewModel = this.getViewModel();
  var parentClassViewItms = Ext.ComponentQuery.query('jobapplicationsappliedfilterview')[0].items.items;
  parentClassViewItms.forEach(function(item, index) {
    if (index == 3 || index == 4 || index == 5) {
      if (item.items.items[0].reference == parentBtnRef) {
        item.hide();
        var removeFilterValue = index == 4 ? 'filterByLocation' : index == 5 ? 'filterByExperience' : 'filterByDate';
        var dataview = Ext.ComponentQuery.query('jobapplicationsappliedlistview')[0].down('dataview');
        var openingsView = Ext.ComponentQuery.query('jobapplicationsappliedlistview')[0];
        var store = openingsView.getViewModel().getStore('jobapplicationsappliedstore');
        store.removeFilter(removeFilterValue);
        viewModel.set('filtervalue', removeFilterValue);
      }
    }
  });
}, onKeyUpJobSearch:function(searchfield, e, eOpts) {
  var checkView = Ext.ComponentQuery.query('jobapplications')[0].getLayout().getActiveItem().reference == 'jobapplicationrequestlistview' ? true : false;
  var toGetReferenceView = checkView ? this.getReferences().applicationfilterview : this.getReferences().appliedfilterview;
  this.searchJob(toGetReferenceView.down('textfield'), toGetReferenceView.down('combobox'), checkView);
}, onStatusSelectionFilter:function(statuscombo, record, eOpts) {
  var checkView = Ext.ComponentQuery.query('jobapplications')[0].getLayout().getActiveItem().reference == 'jobapplicationrequestlistview' ? true : false;
  var toGetReferenceView = checkView ? this.getReferences().applicationfilterview : this.getReferences().appliedfilterview;
  this.searchJob(toGetReferenceView.down('textfield'), toGetReferenceView.down('combobox'), checkView);
}, searchJob:function(searchfield, statuscombo, checkView) {
  var searchString = searchfield.value, dataview = checkView ? this.getReferences().jobapplieddataview : this.getReferences().jobapplicationdataview, dataviewStore = checkView ? this.getViewModel().getStore('jobApplicationsDataViewStore') : this.getViewModel().getStore('jobapplicationsappliedstore');
  if (statuscombo.value != null && statuscombo.value != 'All' && statuscombo.rawValue != 'All') {
    var statusVal = statuscombo.getSelectedRecord().data.ddo_jobapplicationstatus_id;
  } else {
    if (statuscombo.value == 'All' || statuscombo.rawValue == 'All') {
      var statusVal = null;
    } else {
      var statusVal = statuscombo.getValue();
    }
  }
  if (dataviewStore) {
    if (!checkView) {
      if (!Ext.isEmpty(statusVal)) {
        dataviewStore.filter({property:'ddo_jobapplicationstatus_id', id:'ddo_jobapplicationstatus_id', anyMatch:true, caseSensitie:false, value:statusVal}, statusVal, false);
      } else {
        dataviewStore.removeFilter('ddo_jobapplicationstatus_id');
      }
    }
    if (checkView) {
      if (!Ext.isEmpty(searchString)) {
        dataviewStore.filter({property:'title', id:'title', anyMatch:true, caseSensitie:false, value:searchString}, searchString, false);
      } else {
        dataviewStore.removeFilter('title');
      }
      var obj = {'property':'ddo_jobopeningstatus_id', 'value':1};
      dataviewStore.addFilter(obj);
    } else {
      if (!Ext.isEmpty(searchString)) {
        dataviewStore.filter({property:'appfirstname', id:'appfirstname', anyMatch:true, caseSensitie:false, value:searchString}, searchString, false);
      } else {
        dataviewStore.removeFilter('appfirstname');
      }
    }
  }
}});
Ext.define('JobOpenings.view.jobapplications.JobApplyMain', {extend:'Ext.panel.Panel', alias:'widget.jobapplymain', requires:['JobOpenings.view.jobapplications.NewJobApplyForm', 'JobOpenings.view.jobapplications.JobApplyController', 'JobOpenings.view.jobapplications.JobApplicationsViewModel'], viewModel:{type:'jobapplicationsviewmodel'}, controller:'jobapplycontroller', cls:'job-header', tools:[{xtype:'button', scale:'medium', iconCls:'goalsbackbtn-cls', cls:'jobback-btn-cls', style:{border:0}, listeners:{click:'onInterviewBackButtonClick'}}, 
{xtype:'label', html:'Back', cls:'backlabel-cls'}, {xtype:'label', html:'Intern UI Development/Add Application', cls:'titlelabel-cls', reference:'title_applicationCreationRef', margin:20}], items:[{xtype:'newjobapplyform'}]});
Ext.define('JobOpenings.view.jobapplications.interviewdetails.InterviewFeedBack', {extend:'Ext.container.Container', xtype:'interviewfeedback', width:'100%', cls:'feedbkcnt-cls feedbkcnt2-cls', requires:['JobOpenings.view.jobapplications.JobApplicationsViewModel', 'JobOpenings.view.jobapplications.JobApplicationsViewController'], bind:{hidden:'{viewHide}'}, controller:'jobapplicationsviewController', viewModel:{type:'jobapplicationsviewmodel'}, items:[{xtype:'dataview', reference:'feedbackdataviewrref', 
itemTpl:['\x3ctable class\x3d"feedbktable-cls" \x3e', '\x3ctr class\x3d"feedbktr-cls"\x3e', '\x3cth class\x3d"nameheader-cls" width\x3d"20%"\x3eInterviewer Name\x3c/th\x3e', '\x3cth class\x3d"typeheader-cls" width\x3d"15%"\x3eInterviewer Type\x3c/th\x3e', '\x3cth class\x3d"dtheader-cls" width\x3d"15%"\x3eDate\x26Time\x3c/th\x3e', '\x3cth class\x3d"ratingheader-cls" width\x3d"15%"\x3eRating\x3c/th\x3e', '\x3cth class\x3d"fdbkheader-cls"\x3eFeedback\x3c/th\x3e', '\x3c/tr\x3e', '\x3ctr class\x3d"datatr-cls"\x3e', 
'\x3ctd\x3e{interviewrname}\x3c/td\x3e', '\x3ctd\x3e{[this.onIntervwTypeVal(values)]}\x3c/td\x3e', '\x3ctd\x3e{[this.convertDate(values)]}\x3cdiv\x3e{interviewtime}\x3c/div\x3e\x3c/td\x3e', '\x3ctd\x3e{[this.getRatingIcon(values)]}\x3c/td\x3e', '\x3ctd class \x3d"fdbktd-cls"\x3e{feedback}\x3c/td\x3e', '\x3c/tr\x3e', '\x3c/table\x3e', {getRatingIcon:function(values) {
  var ratingname = values.ratingname, imgurl = values.ratingimgpath;
  return '\x3cdiv\x3e\x3cimg class\x3d"intvwratingimg-cls" src\x3d"resources/images/feeds/likes/' + ratingname + '.png' + '"\x3e\x3cdiv\x3e' + ratingname + '\x3c/div\x3e\x3c/div\x3e';
}, convertDate:function(values) {
  var intervwDate = values.interviewdate;
  return Ext.Date.format(new Date(intervwDate), 'd-m-Y');
}, onIntervwTypeVal:function(values) {
  if (values.interviewtype == 2) {
    return 'Telephonic';
  } else {
    return 'Face-to-Face';
  }
}}], itemSelector:'div.intvwdiv-cls'}]});
Ext.define('JobOpenings.view.jobapplications.interviewdetails.TimelineContainer', {extend:'Ext.container.Container', xtype:'timelinecontainer', style:'top:-49px !important;', width:'100%', html:['\x3cdiv class\x3d"timeline-item jobtimelinecls"\x3e', '\x3cdiv class\x3d"timeline-day"\x3e\x3c/div\x3e', '\x3cdiv class\x3d"timeline-outer"\x3e\x3cdiv class\x3d"timeline-inner"\x3e', '\x3c/div\x3e', '\x3c/div\x3e']});
Ext.define('JobOpenings.view.jobapplications.interviewdetails.InterviewDataview', {extend:'Ext.container.Container', xtype:'interviewdataview', width:'100%', bind:{hidden:'{initialInterviewShow}'}, requires:['JobOpenings.view.jobapplications.interviewdetails.TimelineContainer'], layout:{type:'hbox'}, reference:'interviewdvref', items:[{xtype:'timelinecontainer'}, {xtype:'container', cls:'intvwschcnt-cls', items:[{xtype:'form', cls:'intvwschform-cls', reference:'intervwformref', width:'100%', height:130, 
layout:'hbox', items:[{xtype:'hiddenfield', name:'ddo_jobapplicationinterview_id'}, {xtype:'combo', name:'interviewer_id', reference:'interviewerref', fieldLabel:'Interview Panel', labelAlign:'top', emptyText:'Select Interviewer', displayField:'empname', valueField:'empid', queryMode:'local', forceSelection:false, matchFieldWidth:true, clearOnBackspace:false, tagCustomiseMom:true, tagMomOwnerId:'123', filterPickList:true, typeAhead:false, blankText:'This field is required', allowBlank:false, bind:{}}, 
{xtype:'combo', name:'interviewtype', labelAlign:'top', reference:'interviewtyperefdata', fieldLabel:'Interview Type', emptyText:'Select Interview Type', displayField:'name', valueField:'interviewtype_id', queryMode:'local', forceSelection:false, matchFieldWidth:true, clearOnBackspace:false, tagCustomiseMom:true, tagMomOwnerId:'123', filterPickList:true, typeAhead:false, blankText:'This field is required', allowBlank:false, bind:{}}, {xtype:'datefield', editable:false, required:true, fieldLabel:'Date', 
labelAlign:'top', alwaysOnTop:true, format:'Y-m-d', name:'interviewdate', disabledCls:'notestatus-item-disabled', reference:'fromDate', bind:{value:'{interviewdate}'}, emptyText:'Select Date', minValue:new Date, createPicker:function() {
  var me = this, format = Ext.String.format;
  return Ext.create('Ext.picker.Date', {pickerField:me, ownerCt:me.ownerCt, renderTo:document.body, floating:true, hidden:true, focusOnShow:true, cls:'ddo-create-datepicker', minDate:me.minValue, maxDate:me.maxValue, disabledDatesRE:me.disabledDatesRE, disabledDatesText:me.disabledDatesText, disabledDays:me.disabledDays, disabledDaysText:me.disabledDaysText, format:me.format, showToday:me.showToday, startDay:me.startDay, minText:format(me.minText, me.formatDate(me.minValue)), maxText:format(me.maxText, 
  me.formatDate(me.maxValue)), listeners:{scope:me, select:me.onSelect}, keyNavConfig:{esc:function() {
    me.collapse();
  }}});
}}, {xtype:'timefield', name:'interviewtime', reference:'intvwTime', fieldLabel:'Time', labelAlign:'top', required:true, bind:{value:'{interviewtime}'}, editable:false, emptyText:'Select Time', minValue:'00:00', maxValue:'24:00', hideTrigger:false, format:'H-i', increment:30, listConfig:{cls:'mom-stime-cls'}}, {xtype:'button', text:'Save', reference:'intvwsavebtnref', cls:'intvwsave-btn', formBind:true, listeners:{click:'onInterviewSaveBtnClick'}}, {xtype:'buttongroup', cls:'singlebtngrp-cls', reference:'intvwbtngrpref', 
columns:1, items:[{text:'Cancel', cls:'intvwcancel-btn', formBind:true, listeners:{click:'onCancelIntvwClick'}}, {text:'Reschedule', cls:'intvwcancel-btn', bind:{hidden:'{cancelReschedulebtnsHide}'}, listeners:{click:'onRescheduleClick'}}, {text:'Delete', cls:'intvwcancel-btn', bind:{hidden:'{cancelReschedulebtnsHide}'}, listeners:{click:'onDeleteIntvwClick'}}]}]}]}]});
Ext.define('JobOpenings.view.jobapplications.interviewdetails.ScheduleFeedBackView', {extend:'JobOpenings.view.jobapplications.interviewdetails.TimelineContainer', xtype:'schedulefeedbackview', width:'100%', cls:'feedbkcnt-cls', bind:{hidden:'{awaitingfeedviewHide}'}, config:{feedbkformData:''}, items:[{xtype:'dataview', reference:'feedbackdataviewref', data:'', itemTpl:['\x3ctable class\x3d"feedbktable-cls"\x3e', '\x3ctr class\x3d"feedbktr-cls"\x3e', '\x3cth class\x3d"nameheader-cls" width\x3d"20%"\x3eInterviewer Name\x3c/th\x3e', 
'\x3cth class\x3d"typeheader-cls" width\x3d"15%"\x3eInterviewer Type\x3c/th\x3e', '\x3cth class\x3d"dtheader-cls" width\x3d"15%"\x3eDate\x26Time\x3c/th\x3e', '\x3cth class\x3d"ratingheader-cls" width\x3d"15%"\x3eRating\x3c/th\x3e', '\x3cth class\x3d"fdbkheader-cls"\x3e\x3c/th\x3e', '\x3cth class\x3d"fdbkheade-cls"\x3e\x3c/th\x3e', '\x3c/tr\x3e', '\x3ctr class\x3d"datatr-cls"\x3e', '\x3ctd\x3e{interviewrname}\x3c/td\x3e', '\x3ctd\x3e{interviewtype}\x3c/td\x3e', '\x3ctd\x3e{[this.convertDate(values)]}\x3cdiv\x3e{interviewtime}\x3c/div\x3e\x3c/td\x3e', 
'\x3ctd\x3e{[this.getRatingIcon(values)]}\x3c/td\x3e', '\x3ctd class \x3d"fdbktd-cls"\x3eAwaiting for Feedback\x3c/td\x3e', '\x3ctd class \x3d"fdbktd-cls"\x3e', '\x3cdiv\x3eCancel\x3c/div\x3e', '\x3cdiv\x3eReschedule\x3c/div\x3e', '\x3cdiv\x3eDelete\x3c/div\x3e', '\x3c/td\x3e', '\x3c/tr\x3e', '\x3c/table\x3e', {getRatingIcon:function(values) {
  var ratingname = values.ratingname, imgurl = values.ratingimgpath;
  return 'TBD';
}, convertDate:function(values) {
  var intervwDate = values.interviewdate;
  return Ext.Date.format(new Date(intervwDate), 'd-m-Y');
}}], itemSelector:'div.intvwdiv-cls'}], listeners:{boxready:function() {
  var feedbkRecord = this.config.feedbkformData;
  var vw = this.down('dataview');
  vw.setData(feedbkRecord);
}}});
Ext.define('JobOpenings.view.jobapplications.interviewdetails.AddInterviewSchedule', {extend:'Ext.container.Container', xtype:'addinterviewschedule', width:'100%', cls:'addintvwsch-cls', html:['\x3cdiv clss\x3d"addintvwcls"\x3e', '\x3cdiv class\x3d"jobtimelinecls"\x3e', '\x3c/div\x3e', '\x3c/div\x3e\x3c/div\x3e', '\x3cdiv class \x3d"schviewcls"\x3e', '\x3cdiv class\x3d"schtextcls"\x3eSchedule Interview\x3c/div\x3e', '\x3c/div\x3e\x3c/div\x3e'], items:[{xtype:'button', cls:'schroundcls', iconCls:'plus-icon intvwplus-icon', 
listeners:{click:'onInteviewAddBtnClick'}}]});
Ext.define('JobOpenings.view.jobapplications.interviewdetails.InterviewCancelForm', {extend:'Ext.container.Container', xtype:'interviewcancelform', width:'100%', bind:{hidden:'{cancelformshow}'}, requires:['JobOpenings.view.jobapplications.interviewdetails.AddInterviewSchedule'], items:[{xtype:'addinterviewschedule', bind:{hidden:'{addIntvwschviewHide}'}}, {xtype:'container', cls:'intvwschcnt-cls', reference:'intvwcancelcntref', items:[{xtype:'form', cls:'intvwschform-cls cancelform-cls', reference:'intervwcancelformref', 
width:'100%', height:130, layout:'hbox', items:[{xtype:'hiddenfield', name:'ddo_jobapplicationinterview_id'}, {xtype:'combo', name:'interviewer_id', reference:'empnameref', fieldLabel:'Interview Panel', labelAlign:'top', emptyText:'Select Interviewer', displayField:'empname', valueField:'empid', queryMode:'local', hideTrigger:true, disabled:true, width:'17%', forceSelection:false, matchFieldWidth:true, clearOnBackspace:false, tagCustomiseMom:true, tagMomOwnerId:'123', filterPickList:true, typeAhead:false, 
blankText:'This field is required', allowBlank:false, bind:{value:'{empname}'}}, {xtype:'combo', name:'interviewtype', labelAlign:'top', reference:'inttyperef', fieldLabel:'Interview Type', emptyText:'Select Interview Type', displayField:'name', valueField:'interviewtype_id', queryMode:'local', forceSelection:false, hideTrigger:true, disabled:true, matchFieldWidth:true, clearOnBackspace:false, tagCustomiseMom:true, tagMomOwnerId:'123', filterPickList:true, typeAhead:false, blankText:'This field is required', 
allowBlank:false, width:'15%', bind:{value:'{interviewtype}'}}, {xtype:'datefield', editable:false, required:true, fieldLabel:'Date', labelAlign:'top', alwaysOnTop:true, disabled:true, width:'15%', name:'interviewdate', hideTrigger:true, reference:'fmdateref', bind:{value:'{interviewdate}'}, emptyText:'Select Date'}, {xtype:'displayfield', fieldLabel:'Rating', cls:'ratingcancel-cls', name:'rating', labelAlign:'top', disabled:true, width:'10%', value:'TBD'}, {xtype:'textareafield', grow:false, cls:'canceltextarea-cls', 
labelAlign:'top', reference:'canceltextarearef', width:'35%', name:'Reason-for-Cancelling', fieldLabel:'Reason for Cancelling'}, {xtype:'buttongroup', cls:'singlebtngrp-cls cancelbtngrp', reference:'intvwcancelbtngrp', columns:1, width:'18%', items:[{text:'Confirm', cls:'intvwconfirm-btn', reference:'confirmbtnref', listeners:{click:'onConfirmClick'}}, {text:'Cancel', cls:'intcancl-btn', reference:'intvwcancelbtnref', listeners:{click:'onCancelClick'}}]}]}]}]});
Ext.define('JobOpenings.view.jobapplications.interviewdetails.main.InterviewRequestDetailsAll', {extend:'Ext.container.Container', xtype:'interviewrequestdetailsall', width:'99%', style:'padding-left: 63px;', reference:'interviewrequestdetailsallref', cls:'requestdetails-cls', items:[{xtype:'dataview', reference:'feedbackdataviewrref', data:'', cls:'jobappviewcls_spacing', itemTpl:['\x3cdiv class\x3d"myPanelsCls" style\x3d"text-align:center"\x3e', '\x3cdiv class\x3d"timeline-item jobtimelinecls2"\x3e', 
'\x3cdiv class\x3d"timeline-day"\x3e\x3c/div\x3e', '\x3cdiv class\x3d"timeline-outer"\x3e\x3cdiv class\x3d"timeline-inner"\x3e', '\x3c/div\x3e', '\x3c/div\x3e', '\x3c/div\x3e', '\x3ctable class\x3d"feedbktable2-cls" style\x3d"{[this.backgrndColor(values)]}"\x3e', '\x3ctr class\x3d"feedbktr-cls" style\x3d"{[this.backgrndColor(values)]}"\x3e', '\x3cth class\x3d"nameheader-cls" width\x3d"15%"\x3eInterviewer Name\x3c/th\x3e', '\x3cth class\x3d"typeheader-cls" width\x3d"15%"\x3eInterviewer Type\x3c/th\x3e', 
'\x3cth class\x3d"typeheader-cls" width\x3d"15%"\x3eInterviewer Mode\x3c/th\x3e', '\x3cth class\x3d"dtheader-cls" width\x3d"12%"\x3eDate\x26Time\x3c/th\x3e', '\x3cth class\x3d"ratingheader-cls" width\x3d"10%"\x3eRating\x3c/th\x3e', '\x3cth width\x3d"" class\x3d"fdbkheader-cls" style\x3d"padding-top: 17px; display:{[this.isHiddenFeedback1(values, 1)]};"\x3eFeedback\x3c/th\x3e', '\x3cth class\x3d"nameheader-cls" width\x3d"56%" style\x3d"margin-top:30px; display:{[this.isHiddenAwaitingFeedback(values)]};"\x3e{[this.checkHiddenHeader(values, 1)]}\x3c/th\x3e', 
'\x3cth class\x3d"nameheader-cls" width\x3d"0%" style\x3d"display:{[this.isHiddenAwaitingFeedback(values)]};"\x3e\x3c/th\x3e', '\x3c/tr\x3e', '\x3ctr class\x3d"datatr-cls"\x3e', '\x3ctd width\x3d"15%" class\x3d"intervw-sched-dt-cls"\x3e{interviewrname}\x3c/td\x3e', '\x3ctd width\x3d"15%" class\x3d"intervw-sched-dt-cls"\x3e{[this.onIntervwTypeVal(values)]}\x3c/td\x3e', '\x3ctd width\x3d"15%" class\x3d"intervw-sched-dt-cls"\x3e{[this.onIntervwModeVal(values)]}\x3c/td\x3e', '\x3ctd width\x3d"12%" class\x3d"intervw-sched-dt-cls"\x3e{[this.convertDate(values)]}\x3cdiv\x3e{interviewtime}\x3c/div\x3e\x3c/td\x3e', 
'\x3ctd width\x3d"10%" class\x3d"intervw-sched-dt-cls"\x3e{[this.getRatingIcon(values)]}\x3c/td\x3e', '\x3ctd width\x3d"288%" class\x3d"intervw-sched-feed-dt-cls fdbktd-cls" style\x3d"display:{[this.isHiddenFeedback1(values, 1)]};"\x3e{feedback}\x3c/td\x3e', '\x3ctd width\x3d"32%" style\x3d"color: {[this.ifFeedbackAwaiting(values)]};" style\x3d"display:{[this.isHiddenAwaitingFeedback(values)]};"\x3e{[this.checkHiddenHeader(values, 2)]}\x3c/td\x3e', '\x3ctd width\x3d"80%" style\x3d"display:{[this.isHiddenAwaitingFeedback(values)]};"\x3e{[this.checkHiddenHeader(values, 3)]}\x3c/td\x3e', 
'\x3c/tr\x3e', '\x3c/table\x3e', '\x3c/div\x3e', {getRatingIcon:function(values) {
  if (values.ddo_jobinterviewstatus_id == 2) {
    var ratingname = values.ratingname, imgurl = values.ratingimgpath;
    return '\x3cdiv\x3e\x3cimg class\x3d"intvwratingimg-cls" src\x3d"resources/images/feeds/likes/' + ratingname + '.png' + '"\x3e\x3cdiv\x3e' + ratingname + '\x3c/div\x3e\x3c/div\x3e';
  } else {
    return '\x3cdiv\x3eTBD\x3c/div\x3e';
  }
}, convertDate:function(values) {
  var intervwDate = values.interviewdate;
  return Ext.Date.format(new Date(intervwDate), 'd-m-Y');
}, onIntervwTypeVal:function(values) {
  if (values.interviewtype == 1) {
    return 'Technical';
  } else {
    if (values.interviewtype == 2) {
      return 'HR';
    } else {
      return 'Manager';
    }
  }
}, onIntervwModeVal:function(values) {
  if (values.interviewmode == 1) {
    return 'Telephonic';
  } else {
    if (values.interviewmode == 2) {
      return 'Skype';
    } else {
      return 'FacetoFace';
    }
  }
}, isHiddenFeedback1:function(values, check) {
  if (values.ddo_jobinterviewstatus_id == 2 && check == 1) {
    return 'block';
  } else {
    return 'none';
  }
}, isHiddenAwaitingFeedback:function(values) {
  if (values.ddo_jobinterviewstatus_id == 1 || values.ddo_jobinterviewstatus_id == 3 || values.ddo_jobinterviewstatus_id == 4) {
    return 'block';
  } else {
    return 'none';
  }
}, checkHiddenHeader:function(values, check) {
  if (check == 1) {
    if (values.ddo_jobinterviewstatus_id == 1) {
      return '';
    }
    if (values.ddo_jobinterviewstatus_id == 3) {
      return 'Reason for Rescheduling';
    }
    if (values.ddo_jobinterviewstatus_id == 4) {
      return 'Reason for Cancel';
    }
  }
  if (check == 2) {
    if (values.ddo_jobinterviewstatus_id == 1) {
      return 'Awaiting for Feedback';
    }
    if (values.ddo_jobinterviewstatus_id == 3) {
      return values.feedback;
    }
    if (values.ddo_jobinterviewstatus_id == 4) {
      return values.feedback;
    }
  }
  if (check == 3) {
    if (values.ddo_jobinterviewstatus_id == 1) {
      var mainViewModel = Ext.ComponentQuery.query('mainviewport')[0].getViewModel();
      if (mainViewModel.data.addInterviewShow == true) {
        return '\x3cdiv class\x3d"intervw-sched-cancel-link-cls"\x3e\x3ci class\x3d"cancel-interview-iconcls arrow-cls"\x3e\x3c/i\x3eCancel\x3c/div\x3e\x3cdiv class\x3d"intervw-sched-reschedule-link-cls"\x3e\x3ci class\x3d"reschedule-interview-iconcls arrow-cls"\x3e\x3c/i\x3eReschedule\x3c/div\x3e\x3cdiv class\x3d"intervw-sched-delete-link-cls"\x3e\x3ci class\x3d"delete-interview-iconcls arrow-cls"\x3e\x3c/i\x3eDelete\x3c/div\x3e';
      }
    }
    if (values.ddo_jobinterviewstatus_id == 3) {
      return '\x3ci class\x3d"rescheduled-interview-iconcls arrow-cls"\x3e\x3c/i\x3eInterview Rescheduled';
    }
    if (values.ddo_jobinterviewstatus_id == 4) {
      return '\x3ci class\x3d"cancel-interview-iconcls arrow-cls"\x3e\x3c/i\x3eInterview Canceled';
    }
  }
}, backgrndColor:function(values) {
  if (values.ddo_jobinterviewstatus_id == 3) {
    return 'background-color: #FFF6E5;';
  }
  if (values.ddo_jobinterviewstatus_id == 4) {
    return 'background-color: #F3F3F3;';
  }
}, ifFeedbackAwaiting:function(values) {
  if (values.ddo_jobinterviewstatus_id == 1) {
    return '#5dc27c';
  } else {
    return 'black';
  }
}}], itemSelector:'div.myPanelsCls', listeners:{itemclick:'onMyPanelsClick'}}]});
Ext.define('JobOpenings.view.jobapplications.interviewdetails.main.InterviewRequestDetailsForm', {extend:'Ext.container.Container', xtype:'interviewrequestdetailsform', requires:['JobOpenings.view.jobapplications.interviewdetails.TimelineContainer'], width:'100%', layout:{type:'hbox'}, initComponent:function() {
  this.callParent(arguments);
  Ext.ComponentQuery.query('[reference \x3d interviewtyperef]')[0].getStore().load();
  Ext.ComponentQuery.query('[reference \x3d interviewmoderef]')[0].getStore().load();
}, items:[{xtype:'timelinecontainer'}, {xtype:'container', cls:'intvwschcnt-cls2', style:'margin-bottom:80px;', items:[{xtype:'form', cls:['intvwschform-cls', 'intvwschform-cls3'], reference:'intervwformref', width:'100%', layout:'vbox', items:[{xtype:'fieldcontainer', layout:'hbox', margin:'0 0 100 0', items:[{xtype:'hiddenfield', name:'ddo_jobapplicationinterview_id'}, {xtype:'combo', name:'interviewer_id', fieldLabel:'Interviewer Name', labelAlign:'top', emptyText:'Select Interviewer', cls:'intrvwname-cls', 
displayField:'empname', valueField:'empid', queryMode:'local', forceSelection:false, matchFieldWidth:true, clearOnBackspace:false, tagCustomiseMom:true, tagMomOwnerId:'123', filterPickList:true, typeAhead:false, blankText:'This field is required', allowBlank:false}, {xtype:'combo', name:'interviewtype', labelAlign:'top', reference:'interviewtyperef', fieldLabel:'Interview Type', cls:'intrvwtype-cls', emptyText:'Select Interview Type', displayField:'name', valueField:'id', queryMode:'local', forceSelection:true, 
matchFieldWidth:true, clearOnBackspace:false, tagCustomiseMom:true, tagMomOwnerId:'123', filterPickList:true, typeAhead:false, blankText:'This field is required', validateOnChange:true, allowBlank:false}, {xtype:'combo', name:'interviewmode', labelAlign:'top', reference:'interviewmoderef', fieldLabel:'Interview Mode', editable:false, cls:'intrvwmode-cls', emptyText:'Select Interview Mode', displayField:'name', valueField:'id', queryMode:'local', forceSelection:true, matchFieldWidth:true, clearOnBackspace:false, 
tagCustomiseMom:true, tagMomOwnerId:'123', filterPickList:true, typeAhead:false, blankText:'This field is required', allowBlank:false}, {xtype:'datefield', editable:false, required:true, allowBlank:false, cls:['intrvwdate-cls', 'intrvwdate-clss'], style:'margin: 0px; right: auto; left: 318px; top: -22px;', fieldLabel:'Date', labelAlign:'top', format:'Y-m-d', alwaysOnTop:true, name:'interviewdate', disabledCls:'notestatus-item-disabled', reference:'fromDate', bind:{value:'{interviewdate}'}, emptyText:'Select Date', 
listeners:{}, minValue:new Date, createPicker:function() {
  var me = this, format = Ext.String.format;
  return Ext.create('Ext.picker.Date', {pickerField:me, ownerCt:me.ownerCt, renderTo:document.body, floating:true, hidden:true, focusOnShow:true, cls:'ddo-create-datepicker', minDate:me.minValue, maxDate:me.maxValue, disabledDatesRE:me.disabledDatesRE, disabledDatesText:me.disabledDatesText, disabledDays:me.disabledDays, disabledDaysText:me.disabledDaysText, format:me.format, showToday:me.showToday, startDay:me.startDay, minText:format(me.minText, me.formatDate(me.minValue)), maxText:format(me.maxText, 
  me.formatDate(me.maxValue)), listeners:{scope:me, select:me.onSelect}, keyNavConfig:{esc:function() {
    me.collapse();
  }}});
}}, {xtype:'timefield', name:'interviewtime', reference:'intvwTime', cls:['intrvwtime-cls', 'intrvwtime-clss'], fieldLabel:'Time', labelAlign:'top', required:true, allowBlank:false, bind:{value:'{interviewtime}'}, editable:false, emptyText:'Select Time', minValue:'8:00 AM', maxValue:'8:00 PM', hideTrigger:false, format:'g-i A', increment:30, listConfig:{cls:'mom-stime-cls'}}]}, {xtype:'button', text:'Save', reference:'intvwsavebtnref', cls:['intvwsave-btn', 'intvwsave-bttn'], formBind:true, listeners:{click:'onInterviewSaveBtnClick2'}}, 
{xtype:'buttongroup', cls:['singlebtngrp-cls', 'intvwcancel-bttn'], reference:'intvwbtngrpref', columns:1, items:[{text:'Cancel', cls:'intvwcancel-btn', listeners:{click:'onCancelIntvwClick'}}]}]}]}]});
Ext.define('JobOpenings.view.jobapplications.interviewdetails.main.OnInterviewScheduled', {extend:'Ext.container.Container', xtype:'oninterviewscheduled', requires:['JobOpenings.view.jobapplications.interviewdetails.main.InterviewRequestDetailsAll', 'JobOpenings.view.jobapplications.interviewdetails.main.InterviewRequestDetailsForm'], margin:'10 0 0 10', reference:'oninterviewscheduledref', items:[{xtype:'container', width:'100%', cls:'add-interview-cls', html:['\x3cdiv clss\x3d"addintvwcls"\x3e', 
'\x3cdiv class\x3d"jobtimelinecls"\x3e', '\x3c/div\x3e', '\x3c/div\x3e\x3c/div\x3e', '\x3cdiv class \x3d"schviewcls"\x3e', '\x3cdiv class\x3d"schtextcls2"\x3eSchedule Interview\x3c/div\x3e', '\x3c/div\x3e\x3c/div\x3e'], items:[{xtype:'button', cls:'schroundcls2', reference:'addInterviewPlusIconRef', iconCls:'plus-icon intvwplus-icon', listeners:{click:'onInteviewAddBtnClick2'}}]}, {xtype:'interviewrequestdetailsform'}, {xtype:'interviewrequestdetailsall'}]});
Ext.define('JobOpenings.view.jobapplications.interviewdetails.main.InterviewDetailsMain', {extend:'Ext.container.Container', xtype:'interviewdetailsmain', requires:['JobOpenings.view.jobapplications.interviewdetails.InterviewDataview', 'JobOpenings.view.jobapplications.interviewdetails.main.OnInterviewScheduled'], layout:{type:'card', activeItem:1}, margin:'10 0 0 10', width:'100%', reference:'interviewdetailsmainref', items:[{xtype:'interviewdataview'}, {xtype:'oninterviewscheduled'}]});
Ext.define('JobOpenings.view.jobapplications.interviewdetails.ScheduleInterview', {extend:'Ext.container.Container', xtype:'scheduleinterview', requires:['JobOpenings.view.jobapplications.JobApplicationsViewModel', 'JobOpenings.view.jobapplications.JobApplicationsViewController', 'JobOpenings.view.jobapplications.interviewdetails.InterviewFeedBack', 'JobOpenings.view.jobapplications.interviewdetails.InterviewDataview', 'JobOpenings.view.jobapplications.interviewdetails.ScheduleFeedBackView', 'JobOpenings.view.jobapplications.interviewdetails.AddInterviewSchedule', 
'JobOpenings.view.jobapplications.interviewdetails.InterviewCancelForm', 'JobOpenings.view.jobapplications.interviewdetails.main.InterviewDetailsMain'], reference:'interviewschdref', margin:'10 0 0 10', cls:'jobappviewcls noscrollbar', width:'100%', controller:'jobapplicationsviewController', viewModel:{type:'jobapplicationsviewmodel'}, layout:{type:'vbox'}, items:[{xtype:'panel', width:'100%', items:[{xtype:'toolbar', cls:'inttoolbar-cls', dock:'top', items:[{xtype:'button', scale:'medium', iconCls:'goalsbackbtn-cls', 
cls:'jobback-btn-cls', style:{border:0}, listeners:{click:'onBackClick'}}, {xtype:'label', html:'Back', cls:'backlabel-cls'}, {xtype:'tbspacer', width:400}, {xtype:'label', html:'Interview', cls:'intTitle-cls', reference:'jobapplications_interviewScreenTitle'}]}]}, {xtype:'container', layout:'hbox', cls:'dtcnt-cls', items:[{xtype:'dataview', cls:'jobsdataviewcls', bind:{store:'{jobapplicantStore}'}, itemTpl:['\x3cdiv class\x3d"jobsdiv-cls ddo-jobopening-item"\x3e', '\x3cdiv class\x3d"datadiv-cls"\x3e', 
'\x3cdiv class\x3d"title-div-cls"\x3e\x3cspan class\x3d"title-cls"\x3e{[this.showTitle(values,16)]}\x3c/span\x3e', '\x3cspan\x3e | \x3c/span\x3e', '\x3cspan class\x3d"creator-cls"\x3e{[this.showCurrentjobtitle(values)]}\x3c/span\x3e', '\x3c/div\x3e', '\x3cdiv class\x3d"loc-exp"\x3e\x3cspan\x3e\x3ci class\x3d"exp-iconcls arrow-cls"\x3e\x3c/i\x3e\x26nbsp{workexpyears}.{workexpmonths} Years Experience \x3c/span\x3e', '\x3cspan\x3e\x3ci class\x3d"location-iconcls arrow-cls"\x3e\x3c/i\x3e\x26nbsp{[this.showCurrentlocation(values)]}\x3c/span\x3e', 
'\x3c/div\x3e', '\x3cdiv class\x3d"detailscls"\x3e\x3ci class\x3d"skill-iconcls arrow-cls"\x3e\x3c/i\x3e{[this.showSkills(values)]}\x3c/div\x3e', '\x3cdiv class\x3d"detailscls"\x3e\x3ci class\x3d"education-iconcls arrow-cls"\x3e\x3c/i\x3e{education} - {[this.showCollegename(values)]}\x3c/div\x3e', '\x3cdiv\x3e\x3cdiv class\x3d"detailscls emaildv"\x3e\x3ci class\x3d"mobile-iconcls arrow-cls"\x3e\x3c/i\x3e+91\x26nbsp{[this.showMobile(values, 10)]}\x3c/div\x3e', '\x3cdiv class\x3d"detailscls" style\x3d"float:right;margin-right: 31%!important;"\x3e\x3ci class\x3d"mail-iconcls arrow-cls"\x3e\x3c/i\x3e{[this.showEmailId(values, 20)]}\x3c/div\x3e\x3c/div\x3e', 
'\x3c/div\x3e', '\x3cdiv class\x3d"combosdiv-cls"\x3e', '\x3cdiv\x3e', '\x3c/div\x3e', '\x3c/div\x3e', '\x3c/div\x3e', {showCurrentlocation:function(values) {
  var currentlocation = values.currentlocation != undefined && values.currentlocation != null ? values.currentlocation : '';
  if (currentlocation.length > 15) {
    return currentlocation.substring(0, 12) + '...';
  } else {
    return currentlocation;
  }
}, showCollegename:function(values) {
  var collegename = values.collegename != undefined && values.collegename != null ? values.collegename : '';
  if (collegename.length > 20) {
    return collegename.substring(0, 17) + '...';
  } else {
    return collegename;
  }
}, showCurrentjobtitle:function(values) {
  var currentjobtitle = values.currentjobtitle != undefined && values.currentjobtitle != null ? values.currentjobtitle : '';
  if (currentjobtitle.length > 12) {
    return currentjobtitle.substring(0, 9) + '...';
  } else {
    return currentjobtitle;
  }
}, showTitle:function(values, limit) {
  var title = values.appfirstname + ' ' + values.applastname;
  if (title.length > limit) {
    return title.substring(0, 13) + '...';
  } else {
    return title;
  }
}, showMobile:function(values, limit) {
  var mobile = values.mobile != undefined && values.mobile != null ? values.mobile.toString() : '';
  if (mobile.length > limit) {
    return mobile.substring(0, 10) + '...';
  } else {
    return mobile;
  }
}, showEmailId:function(values, limit) {
  var emailid = values.emailid != undefined && values.emailid != null ? values.emailid : '';
  if (emailid.length > limit) {
    return emailid.substring(0, 17) + '...';
  } else {
    return emailid;
  }
}, showSkills:function(values) {
  var skillStr = '';
  try {
    var skillsArr = values.skillnames;
    skillsArr.forEach(function(item, index) {
      skillStr += skillsArr.length - 1 != index ? '#' + item + ', ' : '#' + item;
    });
  } catch (exce) {
  }
  if (skillStr.length > 29) {
    return skillStr.substring(0, 26) + '...';
  } else {
    return skillStr;
  }
}}], itemSelector:'div.status-div-cls'}, {xtype:'container', cls:'dwnlodcntcls', layout:'vbox', items:[{xtype:'button', text:'Download CV \x3cspan class\x3d"download-iconcls"\x3e\x3c/span\x3e', cls:'cvdwnldbtn2', iconcls:'dwnldcv-cls', listeners:{click:'onDwnldCVClick'}}, {xtype:'combo', name:'appstatus', reference:'interviewerref', cls:'appstatuscombo-cls appliStatus', fieldLabel:'Application Status', labelAlign:'top', emptyText:'Select Status', displayField:'name', valueField:'ddo_jobapplicationstatus_id', 
queryMode:'local', forceSelection:true, allowBlank:false, matchFieldWidth:true, clearOnBackspace:false, width:176, editable:false, filterPickList:true, typeAhead:false, bind:{disabled:'{jobAppStatusDisable}'}, listeners:{select:'onApplicationStatusSelected'}}]}]}, {xtype:'interviewdetailsmain'}]});
Ext.define('JobOpenings.view.jobapplications.JobApplications', {extend:'Ext.container.Container', xtype:'jobapplications', requires:['JobOpenings.view.jobapplications.JobApplicationRequestListView', 'JobOpenings.view.jobapplications.JobApplicationsAppliedListView', 'JobOpenings.view.jobapplications.JobAppliedFormController', 'JobOpenings.view.jobapplications.JobApplyMain', 'JobOpenings.view.jobapplications.interviewdetails.ScheduleInterview', 'JobOpenings.view.jobapplications.JobApplicationViewMode'], 
layout:{type:'card', activeItem:0}, margin:'10 0 0 10', reference:'jobapplicationreference', items:[{xtype:'jobapplicationrequest'}, {xtype:'jobapplicationsappliedlistview'}, {xtype:'jobapplymain'}, {xtype:'scheduleinterview'}, {xtype:'jobapplicationviewmode'}]});
Ext.define('JobOpenings.view.jobapplications.NewJobApplyViewModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.newjobapplyviewmodel'});
Ext.define('JobOpenings.view.jobapplications.filtertoolbar.JobApplicationsAppliedFilterController', {extend:'Ext.app.ViewController', alias:'controller.jobapplicationsappliedfiltercontroller', onApplyBtnClick:function(btn, e, eOpts) {
  var form = this.getView(), locationValue = form.getValues().filterlocation, departmentValue = form.getValues().filterdepartment, minExpValue = form.getValues().minworkexperience, maxExpValue = form.getValues().maxworkexperience, dateValue = form.getValues().filterDateName, match = locationValue, checkView = Ext.ComponentQuery.query('jobapplications')[0].getLayout().getActiveItem().reference == 'jobapplicationrequestlistview' ? true : false, listview = checkView ? Ext.ComponentQuery.query('jobapplicationrequest') : 
  Ext.ComponentQuery.query('jobapplicationsappliedlistview'), dataview = listview[0].down('dataview'), dataviewStore = dataview.getStore(), window = form.up('window'), vm = this.getViewModel(), tagPanel = checkView ? Ext.ComponentQuery.query('jobapplicationfilterview') : Ext.ComponentQuery.query('jobapplicationsappliedfilterview'), tagPanelItm = tagPanel[0].items.items;
  tagPanelItm[3].hide();
  tagPanelItm[4].hide();
  tagPanelItm[5].hide();
  if (!Ext.isEmpty(locationValue) && locationValue != 'All') {
    dataviewStore.filter({property:'ddo_joblocation_id', id:'filterByLocation', anyMatch:true, caseSensitie:false, value:locationValue}, locationValue, false);
    tagPanelItm[4].show();
    var locRefText = this.getReferences().filtercomboref.getSelectedRecord().data.name;
    var textVal = locRefText.substring(0, 10);
    tagPanelItm[4].items.items[0].setText(textVal);
  } else {
    dataviewStore.removeFilter('filterByLocation');
  }
  if (!Ext.isEmpty(departmentValue) && departmentValue != 'All') {
    dataviewStore.filter({property:'ddo_department_id', id:'filterByDepartment', anyMatch:true, caseSensitie:false, value:departmentValue}, departmentValue, false);
    tagPanelItm[5].show();
    var depRefText = this.getReferences().deptcomboref.getSelectedRecord().data.name;
    var textVal = depRefText.substring(0, 10);
    tagPanelItm[5].items.items[0].setText(textVal);
  } else {
    dataviewStore.removeFilter('filterByDepartment');
  }
  if (!Ext.isEmpty(minExpValue) && minExpValue != 'All') {
    var formMinExpVal = minExpValue, formMaxExpVal = maxExpValue;
    dataviewStore.filter({id:'filterByExperience', filterFn:function(rec) {
      minExpVal = rec.data.minworkexperience, maxExpVal = rec.data.maxworkexperience;
      if (minExpVal == formMinExpVal && maxExpVal == formMaxExpVal) {
        return true;
      } else {
        return false;
      }
    }});
    tagPanelItm[5].show();
    var expText = formMinExpVal + '-' + formMaxExpVal + ' Exp.Years';
    var textVal = expText.substring(0, 13);
    tagPanelItm[5].items.items[0].setText(textVal);
  }
  if (!Ext.isEmpty(dateValue) && dateValue != 'All') {
    var days = null;
    if (dateValue == 'Past 24 HR') {
      days = 1;
    }
    if (dateValue == 'Past Week') {
      days = 7;
    }
    if (dateValue == 'Custom Range') {
      var customRangeDate = this.getReferences().customDateRef.value;
      if (customRangeDate != null || customRangeDate != undefined) {
        var oneDay = 24 * 60 * 60 * 1000;
        var firstDate = new Date(customRangeDate);
        var secondDate = new Date;
        days = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
      } else {
        return;
      }
    }
    dataviewStore.filter({property:'jobupdateddate', id:'filterByDate', anyMatch:true, caseSensitie:false, value:dateValue, filterFn:function(record) {
      var date = new Date;
      var last = new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
      return new Date(record.data.jobupdateddate) >= last && new Date(record.data.jobupdateddate) <= new Date;
    }}, dateValue, false);
    tagPanelItm[3].show();
    if (dateValue != 'Custom Range') {
      var textVal = dateValue.substring(0, 10);
    } else {
      var dateRefText = Ext.Date.format(new Date(this.getReferences().customDateRef.value), 'd/m/y'), textVal = dateRefText.substring(0, 10);
    }
    tagPanelItm[3].items.items[0].setText(textVal);
  } else {
    dataviewStore.removeFilter('filterByDate');
  }
  window.close();
  var jobStatusCombo = Ext.ComponentQuery.query('[reference \x3d jobappliedstatuscomboref]')[0];
  jobStatusCombo.getStore().clearFilter();
}, onFilterDateSelect:function(combo, record, eOpts) {
  var store = combo.getStore(), fieldValue = combo.getSelection().data.name;
  if (fieldValue == 'Custom Range') {
    this.getReferences().customDateRef.show();
  } else {
    this.getReferences().customDateRef.hide();
  }
}, onMinValueSelect:function(field, e, eOpts) {
  var form = Ext.ComponentQuery.query('[reference \x3d jaFiltersForm]')[0], maxVal = form.getValues().maxworkexperience, minVal = field.value;
  if (maxVal != '' && minVal >= parseInt(maxVal)) {
    Utility.topAlertMessage('WARNING', 'Please Enter value less than maxExp value');
    field.setValue(null);
  } else {
    return minVal;
  }
}, onMaxValueSelect:function(field, e, eOpts) {
  var form = Ext.ComponentQuery.query('[reference \x3d jaFiltersForm]')[0], minVal = form.getValues().minworkexperience, maxVal = field.value;
  if (minVal != '' && maxVal < parseInt(minVal)) {
    Utility.topAlertMessage('WARNING', 'Please Enter value more than minExp value');
    field.setValue(null);
  } else {
    return maxVal;
  }
}});
Ext.define('JobOpenings.view.jobapplications.filtertoolbar.JobApplicationsAppliedFilterComboboxes', {extend:'Ext.form.Panel', xtype:'jobapplicationsappliedfiltercomboboxes', requires:['JobOpenings.store.filtertoolbar.JobOpeningsDateStore', 'JobOpenings.store.form.LocationStore', 'JobOpenings.view.jobapplications.filtertoolbar.JobApplicationsAppliedFilterController', 'JobOpenings.view.jobopeningrequest.filtertoolbar.FilterViewModel'], viewModel:'filterviewmodel', controller:'jobapplicationsappliedfiltercontroller', 
reference:'jaFiltersForm', layout:'column', items:[{columnWidth:0.5, items:[{layout:{type:'vbox'}, items:[{xtype:'combobox', reference:'filterdate', name:'filterDateName', labelAlign:'top', fieldLabel:'Filter by Date', tpl:Ext.create('Ext.XTemplate', '\x3cul class\x3d"x-list-plain"\x3e\x3ctpl for\x3d"."\x3e', '\x3cli role\x3d"option" class\x3d"x-boundlist-item" style\x3d"text-align:center;"\x3e{name}\x3c/li\x3e', '\x3c/tpl\x3e\x3c/ul\x3e'), displayTpl:Ext.create('Ext.XTemplate', '\x3ctpl for\x3d"."\x3e', 
'{name}', '\x3c/tpl\x3e'), margin:'10 0 0 90', cls:'requestCombo-cls', queryMode:'local', displayField:'name', valueField:'name', value:'All', editable:false, store:Ext.create('JobOpenings.store.filtertoolbar.JobOpeningsDateStore'), autoLoadOnValue:true, listeners:{select:'onFilterDateSelect'}}, {items:[{xtype:'fieldcontainer', fieldLabel:'Filter by Experience', cls:'fieldcontainer-cls', labelWidth:100, layout:'hbox', msgTarget:'side', labelAlign:'top', margin:'10 0 0 90', labelStyle:'text-align:right;', 
items:[{xtype:'numberfield', emptyText:'Min', cls:'requestCombo-cls', emptyCls:'referrals-empty-text', reference:'fminref', name:'minworkexperience', minValue:0, width:65, enableKeyEvents:true, mouseWheelEnabled:false, listeners:{blur:'onMinValueSelect'}}, {xtype:'label', text:'To', margin:'10 10'}, {xtype:'numberfield', emptyText:'Max', emptyCls:'referrals-empty-text', cls:'requestCombo-cls', allowBlank:false, mouseWheelEnabled:false, reference:'fmaxref', minValue:0, enableKeyEvents:true, name:'maxworkexperience', 
width:65, listeners:{blur:'onMaxValueSelect'}}]}]}]}]}, {columnWidth:0.5, items:[{layout:{type:'vbox'}, items:[{fieldLabel:'Custom Date', labelAlign:'top', xtype:'datefield', cls:'requestCombo-cls', name:'filterCustomDate', reference:'customDateRef', margin:'10 90 0 0', editable:false, allowBlank:false, maxValue:new Date, hidden:true}, {xtype:'combobox', labelAlign:'top', cls:'requestCombo-cls', name:'filterlocation', reference:'filtercomboref', fieldLabel:'Filter by Location', tpl:Ext.create('Ext.XTemplate', 
'\x3cul class\x3d"x-list-plain"\x3e\x3ctpl for\x3d"."\x3e', '\x3cli role\x3d"option" class\x3d"x-boundlist-item" style\x3d"text-align:center;"\x3e{name}\x3c/li\x3e', '\x3c/tpl\x3e\x3c/ul\x3e'), displayTpl:Ext.create('Ext.XTemplate', '\x3ctpl for\x3d"."\x3e', '{name}', '\x3c/tpl\x3e'), margin:'10 90 0 0', queryMode:'local', displayField:'name', valueField:'ddo_joblocation_id', value:'All', editable:false, autoLoadOnValue:true}]}]}], dockedItems:[{xtype:'toolbar', width:'100%', margin:'0 0 30 0', dock:'bottom', 
items:[{xtype:'tbfill'}, {xtype:'button', text:'Apply', width:150, cls:'filter-submit-btn', listeners:{click:'onApplyBtnClick'}}, {xtype:'tbfill'}]}]});
Ext.define('JobOpenings.view.jobapplications.filtertoolbar.JobApplicationsAppliedAddfilterWindow', {extend:'Ext.window.Window', xtype:'jobapplicationsappliedaddfilterwindow', requires:['JobOpenings.view.jobapplications.filtertoolbar.JobApplicationsAppliedFilterComboboxes'], title:'Add Filter', modal:true, minHeight:200, maxHeight:300, width:620, margin:'5 50 0 0', layout:{type:'fit'}, closeAction:'hide', reference:'filterapplicationwinref', resizable:false, cls:'ddo-filter-window', title:'Add Filters', 
initComponent:function() {
  var me = this;
  me.callParent(arguments);
  me.mon(Ext.getBody(), 'click', function(el, e) {
    me.close(me.closeAction);
  }, me, {delegate:'.x-mask'});
}, items:[{xtype:'jobapplicationsappliedfiltercomboboxes'}]});
Ext.define('JobOpenings.view.jobopeningrequest.JobOpenFormController', {extend:'Ext.app.ViewController', alias:'controller.jobopenformcontroller', requires:[], onContainerClick:function(vw, record, item) {
  x = vw.all.elements;
  for (var i = 0; i < x.length - 2; i++) {
    y = x[i].lastChild.lastChild.firstChild.lastChild;
    z = x[i].lastChild.lastChild.lastChild.lastChild;
    if (y.className == 'act-showcls' || z.className == 'act-showcls') {
      y.classList.remove('act-showcls');
      y.classList.add('act-removecls');
      z.classList.remove('act-showcls');
      z.classList.add('act-removecls');
    }
  }
}, onDepartmentRender:function(combo, eOpts) {
  var departmentStore = combo.getStore();
}, onSkillRender:function(combo, eOpts) {
  var comboStore = combo.getStore('JobOpenings.store.form.SkillsStore');
}, onJobLocationRender:function(combo, eOpts) {
  var comboStore = combo.getStore('JobOpenings.store.form.LocationStore');
}, onInterviewRender:function(combo, eOpts) {
  var interviewStore = combo.getStore();
}, onMinValueSelect:function(field, e, eOpts) {
  var form = this.getReferences().jobform, maxVal = form.getValues().maxworkexperience, minVal = field.value;
  if (maxVal != '' && minVal >= parseInt(maxVal)) {
    Utility.topAlertMessage('WARNING', 'Please Enter value less than maxExp value');
    field.setValue(null);
  } else {
    if (minVal < 0) {
      Utility.topAlertMessage('WARNING', 'Please Enter positive numbers only');
      field.setValue(null);
    } else {
      return minVal;
    }
  }
}, onMaxValueSelect:function(field, e, eOpts) {
  var form = this.getReferences().jobform, minVal = form.getValues().minworkexperience, maxVal = field.value;
  if (minVal != '' && maxVal < parseInt(minVal)) {
    Utility.topAlertMessage('WARNING', 'Please Enter value more than minExp value');
    field.setValue(null);
  } else {
    if (maxVal < 0) {
      Utility.topAlertMessage('WARNING', 'Please Enter positive numbers only');
      field.setValue(null);
    } else {
      return maxVal;
    }
  }
}, onFormSaveClick:function(btn, e, eOpts) {
  var ddo_jobopeningstatus_id = 2;
  this.jobCreation(ddo_jobopeningstatus_id);
}, onDraftSaveClick:function() {
  var ddo_jobopeningstatus_id = 3;
  this.jobCreation(ddo_jobopeningstatus_id);
}, jobCreation:function(ddo_jobopeningstatus_id) {
  var view = this.getReferences().listview;
  viewId = view.getId();
  var view = this.getView(), form = view.down('form').getForm(), values = form.getValues(), dataview = this.getReferences().jobdataview, store = dataview.getStore();
  noLineBreakValue = values.job_desc.replace(/(\r\n|\n|\r)/gm, ' '), trimValue = noLineBreakValue.replace(/\s\s+/g, ' ').trim();
  var descText = trimValue;
  var titleText = values.title.split("'").join('\x26apos;');
  var checkbx = this.getReferences().jobworkcheckboxref, isChecked = checkbx.isChecked();
  if (checkbx.value == false) {
    checkbx.value = 'N';
  } else {
    checkbx.value = 'Y';
  }
  var params = {ddo_joblocation_id:values.ddo_joblocation_id, title:titleText, description:descText, minsalary:values.minsalary, maxsalary:values.maxsalary, ddo_jobopeningstatus_id:ddo_jobopeningstatus_id, noofpositions:values.noofpositions, minworkexperience:values.minworkexperience, maxworkexperience:values.maxworkexperience, skill_ids:values.skill_ids, ddo_projects_clients_id:values.ddo_projects_clients_id, interviewers_ids:values.interviewers_ids, closuredate:values.closuredate, work_on_priority:checkbx.value};
  console.log('params', params);
  if (values.description == '') {
    Utility.topAlertMessage('WARNING', 'Please Fill  Description Field');
  } else {
    var url = Api.URL.jobopenings.CREATE, method = 'POST';
    if (values.ddo_jobopening_id != '') {
      url = Api.URL.jobopenings.UPDATE;
      var ddo_jobopening_id = values.ddo_jobopening_id, method = 'PUT';
      params['ddo_jobopening_id'] = ddo_jobopening_id;
      var dirtyFields = [], fields = form.getFields().items;
      var formValues = {};
      Ext.each(fields, function(field) {
        if (field.isDirty()) {
          dirtyFields.push(field);
          formValues[field.name] = field.getValue();
        }
      });
      console.log('formValues', formValues);
      if (form.isDirty()) {
        formValues['ddo_jobopening_id'] = ddo_jobopening_id;
        formValues['work_on_priority'] = checkbx.value;
        formValues['ddo_jobopeningstatus_id'] = ddo_jobopeningstatus_id;
        params = formValues;
      } else {
        params = params;
      }
    }
    Ext.Ajax.request({url:url, method:method, scope:this, params:params, success:function(resp, b) {
      this.resetForm();
      store.add(params);
      var res = Ext.decode(resp.responseText);
      var msg = res.message;
      Ext.Msg.alert('success', msg);
      this.getView().getLayout().setActiveItem(viewId);
      this.getJobOpeningViewRefresh();
    }, failure:function(resp, b) {
      var data = Ext.decode(resp.responseText);
      Ext.toast(data.message, false, 't');
    }});
  }
}, onBackClick:function(item) {
  var view = this.getReferences().listview;
  viewId = view.getId();
  var form = this.getReferences().jobform.form;
  skillcombo = this.getReferences().jobform.items.items['0'].items.items[6], interview_combo = this.getReferences().jobform.items.items['0'].items.items[8];
  interview_combo.collapse();
  skillcombo.collapse();
  if (form.isValid() == true) {
    Ext.Msg.confirm('Confirm', 'Are you sure you want to go back?', function(btnText) {
      if (btnText === 'no') {
      } else {
        if (btnText === 'yes') {
          this.getView().getLayout().setActiveItem(viewId);
          this.getJobOpeningViewRefresh();
        }
      }
    }, this);
  } else {
    this.getView().getLayout().setActiveItem(viewId);
    this.getJobOpeningViewRefresh();
  }
  var tagPanel = Ext.ComponentQuery.query('jobopeningsfilterview'), tagPanelItm = tagPanel[0].items.items;
  tagPanelItm[3].hide();
  tagPanelItm[4].hide();
  tagPanelItm[5].hide();
  var getDataStore = Ext.ComponentQuery.query('jobopeningsrequestlistview')[0].down('dataview').getStore();
  getDataStore.removeFilter('filterByLocation');
  getDataStore.removeFilter('filterByDepartment');
  getDataStore.removeFilter('filterByDate');
}, getJobOpeningViewRefresh:function() {
  var dataview = this.getReferences().jobdataview;
  var searchField = this.getReferences().filterview.down('textfield');
  var statusField = this.getReferences().filterview.down('combobox');
  searchField.setValue('');
  statusField.setValue('All');
  dataview.getStore().clearFilter();
  statusField.getStore().clearFilter();
  dataview.refresh();
}, hideCombobox:function(com, e, eOpts) {
  var tagPanel = Ext.ComponentQuery.query('jobopeningsfilterview'), tagPanelItm = tagPanel[0].items.items;
  var getDataStore = Ext.ComponentQuery.query('jobopeningsrequestlistview')[0].down('dataview').getStore();
  if (Ext.ComponentQuery.query('[reference \x3d filterwinref]')[0] == undefined) {
    Ext.create('JobOpenings.view.jobopeningrequest.filtertoolbar.JobOpeningsRequestAddfilterWindow').show();
  } else {
    var filterWindow = Ext.ComponentQuery.query('[reference \x3d filterwinref]')[0];
    filterWindow.show();
    var winForm = filterWindow.down('form'), formValues = winForm.getValues(), viewmodel = this.getViewModel();
  }
}, onCreateNewJob:function() {
  var view = this.getReferences().jobform, formViewId = view.getId();
  this.getView().getLayout().setActiveItem(formViewId).reset();
  view.reset();
}, onJobOpeningClick:function(vw, record, item, index, e, eOpts) {
  x = vw.all.elements;
  for (var i = 0; i < x.length - 2; i++) {
    y = x[i].lastChild.lastChild.firstChild.lastChild;
    z = x[i].lastChild.lastChild.lastChild.lastChild;
    if (index != i) {
      if (y.className == 'act-showcls' || z.className == 'act-showcls') {
        y.classList.remove('act-showcls');
        y.classList.add('act-removecls');
        z.classList.remove('act-showcls');
        z.classList.add('act-removecls');
      }
    }
  }
  if (e.target.className == 'rec-assigncls') {
    if (e.target.lastChild.classList.value !== 'act-showcls') {
      item.children[1].children[1].children[0].children[1].className = 'act-showcls';
    } else {
      item.children[1].children[1].children[0].children[1].className = 'act-removecls';
    }
    item.children[1].children[1].lastChild.lastChild.className = 'act-removecls';
    var status = record.data.job_status_name;
    if (status == 'Closed' || status == 'Drafted' || status == 'Rejected') {
      item.children[1].children[1].children[0].children[1].children[0].className = 'assignto-disabledCls';
    }
  } else {
    if (e.target.classList[2] == 'assign-arrow') {
      if (e.target.parentElement.lastChild.classList.value !== 'act-showcls') {
        item.children[1].children[1].children[0].children[1].className = 'act-showcls';
      } else {
        item.children[1].children[1].children[0].children[1].className = 'act-removecls';
      }
      item.children[1].children[1].lastChild.lastChild.className = 'act-removecls';
      var status = record.data.job_status_name;
      if (status == 'Closed' || status == 'Drafted' || status == 'Rejected') {
        item.children[1].children[1].children[0].children[1].children[0].className = 'assignto-disabledCls';
      }
    }
  }
  if (e.target.lastChild != null && e.target.className == 'act-cls') {
    if (e.target.lastChild.classList.value !== 'act-showcls') {
      item.children[1].children[1].children[2].children[1].className = 'act-showcls';
    } else {
      item.children[1].children[1].children[2].children[1].className = 'act-removecls';
    }
    item.children[1].children[1].children[0].lastChild.className = 'act-removecls';
  }
  if (e.target.classList[2] == 'act-arrow') {
    if (e.target.parentElement.lastChild.classList.value !== 'act-showcls') {
      item.children[1].children[1].children[2].children[1].className = 'act-showcls';
    } else {
      item.children[1].children[1].children[2].children[1].className = 'act-removecls';
    }
    item.children[1].children[1].children[0].lastChild.className = 'act-removecls';
  }
  if (e.target.classList.value == 'checkImg') {
    var jobOpeningsStore = Ext.getStore('jobopenings.JobRecruiter');
    var recruitersLength = jobOpeningsStore.data.items.length, checkedRecruitersList = [];
    if (record.data.recruiter_id != null) {
      var recStr = record.data.recruiter_id, parsedData = JSON.parse('[' + recStr + ']');
      checkedRecruitersList = parsedData;
    }
    for (var i = 0; i < recruitersLength; i++) {
      var items = jobOpeningsStore.data.items;
      if (items[i].data.recruiter_name == e.target.parentElement.className) {
        e.target.className = 'uncheckImg';
        e.target.classList.remove('checkImg');
        items[i].data.isChecked = true;
        checkedRecruitersList.push(items[i].data.ddo_employee_id);
      }
    }
    jobOpeningsStore.getProxy().extraParams = {recruiter_id:checkedRecruitersList.join()};
    var recruiter_id = checkedRecruitersList.join();
    var ddo_jobopening_id = record.data.ddo_jobopening_id;
    var ddo_jobopeningstatus_id = record.data.ddo_jobopeningstatus_id;
    var description = record.data.job_desc;
    params = {ddo_jobopening_id:ddo_jobopening_id, recruiter_id:recruiter_id, description:description};
    this.updateRecruitersData(params);
  } else {
    if (e.target.classList.value == 'uncheckImg') {
      var jobOpeningsStore = Ext.getStore('jobopenings.JobRecruiter'), ddo_jobopening_id = record.data.ddo_jobopening_id, ddo_jobopeningstatus_id = record.data.ddo_jobopeningstatus_id, description = record.data.job_desc;
      var recruitersLength = jobOpeningsStore.data.items.length, checkedRecruitersList = [], list = [];
      for (var i = 0; i < recruitersLength; i++) {
        var items = jobOpeningsStore.data.items;
        if (items[i].data.recruiter_name == e.target.parentElement.className) {
          e.target.className = 'checkImg';
          e.target.classList.remove('uncheckImg');
          items[i].data.isChecked = false;
          checkedRecruitersList.pop(items[i].data.ddo_employee_id);
        }
      }
      console.log(checkedRecruitersList);
      params = {ddo_jobopening_id:ddo_jobopening_id, recruiter_id:checkedRecruitersList.join(), description:description};
      console.log(params.recruiter_id);
      this.updateRecruitersData(params);
    }
  }
  if (e.target.innerText == 'Close' || e.target.innerText == 'Approve' || e.target.innerText == 'Reject') {
    var ddo_jobopening_id = record.data.ddo_jobopening_id;
    var ddo_jobopeningstatus_id = record.data.ddo_jobopeningstatus_id;
    var status = 'Closed';
    params = {ddo_jobopening_id:ddo_jobopening_id, ddo_jobopeningstatus_id:ddo_jobopeningstatus_id, status:status};
    if (e.target.innerText == 'Approve') {
      var ddo_jobopening_id = record.data.ddo_jobopening_id;
      var ddo_jobopeningstatus_id = record.data.ddo_jobopeningstatus_id;
      var status = 'Approved';
      params = {ddo_jobopening_id:ddo_jobopening_id, ddo_jobopeningstatus_id:ddo_jobopeningstatus_id, status:status};
    } else {
      if (e.target.innerText == 'Reject') {
        var ddo_jobopening_id = record.data.ddo_jobopening_id;
        var ddo_jobopeningstatus_id = record.data.ddo_jobopeningstatus_id;
        var status = 'Rejected';
        params = {ddo_jobopening_id:ddo_jobopening_id, ddo_jobopeningstatus_id:ddo_jobopeningstatus_id, status:status};
      }
    }
    Ext.Ajax.request({url:Api.URL.jobstatus.UPDATE, method:'PUT', scope:this, params:params, success:function(response) {
      var data = Ext.decode(response.responseText);
      var view = this.getView().down('jobopeningsrequestlistview');
    }});
  } else {
    if (e.target.innerText == 'Edit') {
      var form = this.getReferences().jobform, formViewId = form.getId();
      this.getView().getLayout().setActiveItem(formViewId);
      var ddo_jobopening_id = record.data.ddo_jobopening_id;
      record.data.title = record.data.title.split('\x26apos;').join("'");
      this.loadRecord(record);
      var dataview = this.getReferences().jobdataview;
      dataview.refresh();
      var fields = form.getForm().getFields();
      setTimeout(function() {
        Ext.each(fields.items, function(field) {
          field.dirty = false;
          field.wasDirty = false;
        });
      }, 1000);
    } else {
      if (e.target.innerText == 'Delete') {
        Ext.Msg.confirm('Confirm', 'Are you sure you want to delete this Job?', function(btnText) {
          if (btnText === 'no') {
          } else {
            if (btnText === 'yes') {
              var statusCondition = false;
              if (record.data.ddo_jobopeningstatus_id == 2 || record.data.ddo_jobopeningstatus_id == 3 || record.data.ddo_jobopeningstatus_id == 4 || record.data.ddo_jobopeningstatus_id == 5) {
                statusCondition = true;
              } else {
                if (record.data.ddo_jobopeningstatus_id == 1) {
                  statusCondition = false;
                  Ext.Msg.alert('success', 'Please Close the Job Opening Instead!');
                } else {
                  statusCondition = false;
                }
              }
              if (statusCondition) {
                var ddo_jobopening_id = record.data.ddo_jobopening_id;
                params = {ddo_jobopening_id:ddo_jobopening_id};
                Ext.Ajax.request({url:Api.URL.jobopenings.DELETE, method:'DELETE', scope:this, params:params, success:function(response) {
                  var data = Ext.decode(response.responseText);
                  var dataview = this.getReferences().jobdataview;
                  dataview.refresh();
                }});
              }
            }
          }
        }, this);
      }
    }
  }
  if (e.target.className == 'title-cls') {
    var form = this.getReferences().jobOpeningsFormDataViewModeRef, formViewId = form.getId();
    this.getView().getLayout().setActiveItem(2);
    var myObj = {titleView:record.data.title.split('\x26apos;').join("'"), ddo_department_idView:record.data.department_name, job_descView:Ext.util.Format.stripTags(record.data.description.replace(/<div>/g, '\n\x3cdiv\x3e')), noofpositionsView:record.data.noofpositions.toString(), minsalary:record.data.minsalary, maxsalary:record.data.maxsalary, closuredateView:record.data.closuredate, work_on_priorityView:record.data.work_on_priority, ddo_projects_clients_id:record.data.ddo_projects_clients_id, 
    minworkexperienceView:record.data.minworkexperience.toString(), maxworkexperienceView:record.data.maxworkexperience.toString(), skill_idsView:record.data.skillnames.join(', '), ddo_joblocation_idView:record.data.location_name, interviewers_idsView:record.data.interviewersnames.join(', ')};
    form.getForm().setValues(myObj);
  }
}, updateRecruitersData:function(params) {
  Ext.Ajax.request({url:Api.URL.jobopenings.UPDATE, method:'PUT', scope:this, params:params, success:function(response) {
    var data = Ext.decode(response.responseText);
    var view = this.getView().down('jobopeningsrequestlistview');
  }, failure:function(resp, b) {
    var data = Ext.decode(resp.responseText);
    Ext.toast(data.message, false, 't');
  }});
}, onKeyUpJobSearch:function(searchfield, e, eOpts) {
  this.searchJob(this.getReferences().filterview.down('textfield'), this.getReferences().filterview.down('combobox'));
}, onStatusSelectionFilter:function(statuscombo, record, eOpts) {
  this.searchJob(this.getReferences().filterview.down('textfield'), this.getReferences().filterview.down('combobox'));
}, searchJob:function(searchfield, statuscombo) {
  var searchString = searchfield.value, dataview = this.getReferences().jobdataview, dataviewStore = dataview.getStore();
  if (statuscombo.value != null && statuscombo.value != 'All' && statuscombo.rawValue != 'All') {
    var statusVal = statuscombo.getSelectedRecord().data.ddo_jobopeningstatus_id;
  } else {
    if (statuscombo.value == 'All' || statuscombo.rawValue == 'All') {
      var statusVal = null;
    } else {
      var statusVal = statuscombo.getValue();
    }
  }
  if (dataviewStore) {
    if (!Ext.isEmpty(statusVal)) {
      dataviewStore.filter({property:'ddo_jobopeningstatus_id', id:'ddo_jobopeningstatus_id', anyMatch:true, caseSensitie:false, value:statusVal}, statusVal, false);
    } else {
      dataviewStore.removeFilter('ddo_jobopeningstatus_id');
    }
    if (!Ext.isEmpty(searchString)) {
      dataviewStore.filter({property:'title', id:'title', anyMatch:true, caseSensitie:false, value:searchString}, searchString, false);
    } else {
      dataviewStore.removeFilter('title');
    }
  }
}, loadRecord:function(record) {
  this._record = record;
  return this.setValues(record.getData());
}, setValues:function(values) {
  var me = this.getReferences().jobopenform, v, vLen, val;
  function setVal(fieldId, val) {
    var field = me.getForm().findField(fieldId);
    if (field) {
      if (field.name == 'closuredate') {
        field.setValue(new Date(val));
      } else {
        field.setValue(val);
      }
      if (me.trackResetOnLoad) {
        field.resetOriginalValue();
      }
    }
  }
  Ext.suspendLayouts();
  if (Ext.isArray(values)) {
    vLen = values.length;
    for (v = 0; v < vLen; v++) {
      val = values[v];
      setVal(val.id, val.value);
    }
  } else {
    Ext.iterate(values, setVal);
  }
  Ext.resumeLayouts(true);
  return this;
}, resetForm:function() {
  Ext.suspendLayouts();
  var form = this.getReferences().jobopenform;
  var fields = form.getForm().getFields().items;
  Ext.each(fields, function(f) {
    f.value = '';
    f.originalValue = '';
    var desc_field = fields[3], department_field = fields[2].rawValue;
    if (desc_field.isDirty() == true || department_field == 'Not Found') {
      desc_field.setValue('');
    }
    f.resetToInitialValue();
  });
  Ext.resumeLayouts(true);
}, onCloseFilterClk:function(btn) {
  var parentBtnRef = btn.reference.split('Cancel')[0], viewModel = this.getViewModel();
  var parentClassViewItms = Ext.ComponentQuery.query('jobopeningsfilterview')[0].items.items;
  parentClassViewItms.forEach(function(item, index) {
    if (index == 3 || index == 4 || index == 5) {
      if (item.items.items[0].reference == parentBtnRef) {
        item.hide();
        var removeFilterValue = index == 4 ? 'filterByLocation' : index == 5 ? 'filterByDepartment' : 'filterByDate';
        var dataview = Ext.ComponentQuery.query('jobopeningsrequestlistview')[0].down('dataview');
        var openingsView = Ext.ComponentQuery.query('jobopeningsrequestlistview')[0];
        var store = openingsView.getViewModel().getStore('jobOpeningDataViewStore');
        store.removeFilter(removeFilterValue);
        viewModel.set('filtervalue', removeFilterValue);
        var filterWindow = Ext.ComponentQuery.query('[reference \x3d filterwinref]')[0];
        var winForm = filterWindow.down('form');
        if (index == 4) {
          winForm.getForm().findField('filterlocation').setValue('All');
        } else {
          if (index == 5) {
            winForm.getForm().findField('filterdepartment').setValue('All');
          } else {
            if (index == 3) {
              winForm.getForm().findField('filterDateName').setValue('All');
            }
          }
        }
      }
    }
  });
}, onNoofPositeionsEnter:function(position, e, eOpts) {
  if (position.value < 0) {
    var msg = 'Please enter positive numbers only';
    Ext.Msg.alert('Warning', msg);
    position.reset();
  }
}, onKeyDownDate:function(dateField, e, eOpts) {
  Utility.onDateField(dateField, e, eOpts);
}});
Ext.define('JobOpenings.view.jobopeningrequest.JobOpenFormViewModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.jobopenformviewmodel'});
Ext.define('JobOpenings.view.jobopeningrequest.JobOpeningsFormDataViewMode', {extend:'Ext.form.Panel', xtype:'jobOpeningsFormDataViewMode', cls:'form-cls', reference:'jobOpeningsFormDataViewModeRef', dockedItems:[{xtype:'toolbar', cls:'tooltip-cls', dock:'top', items:[{xtype:'button', scale:'medium', iconCls:'goalsbackbtn-cls', cls:'jobback-btn-cls', style:{border:0}, listeners:{click:'onBackClick'}}, {xtype:'label', html:'Create New Job Opening', cls:'backlabel-cls'}]}], items:[{xtype:'form', title:'Requirement Details', 
cls:'job-header', reference:'jobopenformViewRef', layout:{type:'vbox', align:'middle', pack:'center'}, border:false, buttonAlign:'center', defaults:{width:'70%', labelAlign:'right', labelWidth:180, padding:5, labelStyle:'font-size:16px;'}, items:[{xtype:'textfield', name:'titleView', readOnly:true, fieldLabel:'Job Title:', afterLabelTextTpl:'\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e'}, {xtype:'textarea', readOnly:true, name:'job_descView', fieldLabel:'Job Description', height:135, 
afterLabelTextTpl:'\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e'}, {items:[{xtype:'fieldcontainer', fieldLabel:'Salary Range', cls:'fieldcontainer-cls', labelStyle:'font-size:16px;', labelAlign:'right', labelWidth:178, layout:'hbox', items:[{xtype:'textfield', flex:1, name:'minsalary', width:100, readOnly:true}, {xtype:'label', text:'To', margin:'10 10'}, {xtype:'textfield', flex:1, name:'maxsalary', width:100, readOnly:true}, {xtype:'label', text:'Lacs', margin:'10 10'}]}]}, {items:[{xtype:'fieldcontainer', 
fieldLabel:'No. of Positions', cls:'fieldcontainer-cls', labelWidth:178, width:700, layout:'hbox', afterLabelTextTpl:'\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e', msgTarget:'side', labelAlign:'right', labelStyle:'font-size:16px;', items:[{xtype:'textfield', readOnly:true, name:'noofpositionsView', positionlabel:'positionlabel-cls', width:80, afterLabelTextTpl:'\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e'}, {xtype:'textfield', readOnly:true, name:'closuredateView', 
width:250, labelAlign:'right', cls:['closuredatecls', 'closuredatecls1'], labelStyle:'font-size:15px;width:170px;padding-right:5px', fieldLabel:'Expected Closure Date', afterLabelTextTpl:'\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e'}, {xtype:'checkbox', boxLabel:'Work on Priority', name:'work_on_priorityView', inputValue:'Y', width:250, checked:false, readOnly:true, cls:['workprioritycls', 'workprioritycls1'], labelAlign:'right', labelStyle:'font-size:16px;'}]}]}, {items:[{xtype:'fieldcontainer', 
fieldLabel:'Work Experience', cls:'fieldcontainer-cls', labelWidth:100, layout:'hbox', afterLabelTextTpl:'\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e', msgTarget:'side', labelAlign:'right', labelWidth:178, labelStyle:'font-size:16px;', items:[{xtype:'textfield', readOnly:true, name:'minworkexperienceView'}, {xtype:'label', text:'To', margin:'10 10'}, {xtype:'textfield', readOnly:true, name:'maxworkexperienceView', width:'50'}]}]}, {xtype:'textfield', readOnly:true, fieldLabel:'Skills', 
name:'skill_idsView', border:5, afterLabelTextTpl:'\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e'}, {xtype:'textfield', readOnly:true, name:'ddo_joblocation_idView', fieldLabel:'Job Location', afterLabelTextTpl:'\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e'}, {xtype:'textfield', readOnly:true, name:'ddo_projects_clients_id', fieldLabel:'Client', afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'textfield', 
readOnly:true, cls:'tag-cls', name:'interviewers_idsView', fieldLabel:'Interview Panel', afterLabelTextTpl:'\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e'}]}]});
Ext.define('JobOpenings.view.jobopeningrequest.JobOpeningsRequestListView', {extend:'Ext.container.Container', xtype:'jobopeningsrequestlistview', requires:['JobOpenings.view.jobopeningrequest.filtertoolbar.JobOpeningsFilterView', 'JobOpenings.view.jobopeningrequest.filtertoolbar.FilterViewModel'], cls:'jobopening-cls noscrollbar', reference:'listview', viewModel:{type:'filterviewmodel'}, items:[{xtype:'container', html:'\x3cdiv class\x3d"jobtitle-cls"\x3eJob Opening Requests\x3c/div\x3e'}, {xtype:'jobopeningsfilterview'}, 
{xtype:'dataview', reference:'jobdataview', cls:'jobdataviewcls', emptyText:'\x3cdiv class\x3d"projects-emptytext-cls"\x3eNo Jobs available\x3c/div\x3e', itemTpl:['\x3cdiv class\x3d"jobOpenFormView"\x3e', '\x3cdiv class\x3d"jobsdiv-cls ddo-jobopening-item"\x3e', '\x3cdiv class\x3d"title-div-cls" data-qtip\x3d"{title}-{department_name}"\x3e\x3cspan class\x3d"title-cls"\x3e{[this.showTitle(values,15)]}\x3c/span\x3e', '\x3cspan\x3e | \x3c/span\x3e', '\x3cspan class\x3d"creator-cls" data-qtip\x3d"{firstname}"\x3eCreated by {[this.showName(values,8)]}\x3c/span\x3e', 
'{[this.workOnPriorityShow(values)]}', '\x3cdiv class\x3d"positions-cls"\x3e( {noofpositions} ) Positions\x3c/div\x3e', '\x3c/div\x3e', '\x3cdiv class\x3d"loc-exp"\x3e\x3cspan\x3e\x3ci class\x3d"exp-iconcls arrow-cls"\x3e\x3c/i\x3e\x26nbsp{minworkexperience} - {maxworkexperience} Years Experience \x3c/span\x3e', '\x3cspan\x3e\x3ci class\x3d"location-iconcls arrow-cls"\x3e\x3c/i\x3e\x26nbsp{location_name}\x3c/span\x3e', '\x3c/div\x3e', '\x3cdiv class\x3d"skill-cls"\x3e\x3ci class\x3d"skill-iconcls arrow-cls"\x3e\x3c/i\x3e{[this.getSkillNames(values)]}\x3c/div\x3e', 
'\x3cdiv class\x3d"desc-cls"\x3e{[this.showDescription(values,100)]}\x3c/div\x3e', '\x3c/div\x3e', '\x3cdiv class\x3d"status-div-cls"\x3e\x3cdiv class\x3d"status-textcls"\x3eStatus: \x3cspan class\x3d"{job_status_name}"\x3e{job_status_name}\x3c/span\x3e\x3c/div\x3e', '\x3cdiv class\x3d"status-combo-cls"\x3e{[this.listRecruiter(values)]}', '\x3cspan\x3e | \x3c/span\x3e', '\x3cdiv class\x3d"act-cls"\x3eActions \x3ci class\x3d"x-fa fa-sort-desc act-arrow arrow-cls"\x3e\x3c/i\x3e', '\x3cdiv class\x3d"act-removecls"\x3e{[this.getActions(values)]}', 
'\x3c/div\x3e\x3c/div\x3e', '\x3c/div\x3e', '\x3c/div\x3e', '\x3c/div\x3e', {getActions:function(values) {
  var view = Ext.ComponentQuery.query('mainviewport')[0], viewModel = view.getViewModel(), showAction = viewModel.data.showAction, jobStatus = values.job_status_name, jobAppCount = values.count;
  var actions = [], actionsStore = Ext.getStore('jobopenings.JobopeningsActions');
  if (actionsStore) {
    actionsStore.each(function(rec) {
      var actionName = rec.get('action_name');
      if (viewModel.get('editAction') == true && actionName == 'Edit') {
        actions.push('\x3cli\x3e' + rec.get('action_name') + '\x3c/li\x3e');
      }
      if (viewModel.get('deleteAction') == true && actionName == 'Delete') {
        if (jobStatus == 'Awaiting Approval' || jobStatus == 'Drafted') {
          actions.push('\x3cli\x3e' + rec.get('action_name') + '\x3c/li\x3e');
        } else {
          if (jobStatus == 'Rejected' && jobAppCount == 0 || jobStatus == 'Closed' && jobAppCount == 0) {
            actions.push('\x3cli\x3e' + rec.get('action_name') + '\x3c/li\x3e');
          }
        }
      }
      if (viewModel.get('closeAction') == true && actionName == 'Close') {
        actions.push('\x3cli\x3e' + rec.get('action_name') + '\x3c/li\x3e');
      }
      if (viewModel.get('approveAction') == true && actionName == 'Approve') {
        actions.push('\x3cli\x3e' + rec.get('action_name') + '\x3c/li\x3e');
      }
      if (viewModel.get('rejectAction') == true && actionName == 'Reject') {
        actions.push('\x3cli\x3e' + rec.get('action_name') + '\x3c/li\x3e');
      }
    });
  }
  return '\x3cul\x3e' + actions.toString().replace(/,/g, '') + '\x3c/ul\x3e';
}, listRecruiter:function(values) {
  var lists = [], jobOpeningsStore = Ext.getStore('jobopenings.JobRecruiter');
  if (jobOpeningsStore) {
    jobOpeningsStore.each(function(rec) {
      var str = values.recruiter_id, recList = JSON.parse('[' + values.recruiter_id + ']');
      if (values.recruiter_id != null && recList[recList.indexOf(rec.data.ddo_employee_id)] == rec.data.ddo_employee_id || rec.data.isChecked == true) {
        lists.push('\x3cli class\x3d"' + rec.get('recruiter_name') + '"\x3e\x3c/span\x3e\x3ci class\x3d"uncheckImg"\x3e\x3c/i\x3e' + rec.get('recruiter_name') + '\x3c/li\x3e');
      } else {
        lists.push('\x3cli  class\x3d"' + rec.get('recruiter_name') + '"\x3e\x3c/span\x3e\x3ci class\x3d"checkImg"\x3e\x3c/i\x3e' + rec.get('recruiter_name') + '\x3c/li\x3e');
      }
    });
  }
  var assignVisible = values.isAssignVisible ? 'act-showcls' : 'act-removecls';
  return '\x3cdiv class\x3d"rec-assigncls"\x3eAssign To \x3ci class\x3d"x-fa fa-sort-desc assign-arrow arrow-cls"\x3e\x3c/i\x3e\x3cdiv class\x3d"' + assignVisible + '"\x3e\x3cul\x3e' + lists.toString().replace(/,/g, '') + '\x3c/ul\x3e\x3c/div\x3e\x3c/div\x3e';
}, showDescription:function(values, limit) {
  var desc = values.job_desc;
  if (desc.length >= limit) {
    return '\x3cdiv style\x3d"text-overflow: ellipsis; white-space: nowrap; overflow: hidden; width:411px; height: 36px;"\x3e' + desc + '\x3c/div\x3e';
  } else {
    return desc;
  }
}, showTitle:function(values, limit) {
  var title = values.title;
  if (title.length >= limit) {
    return title.substring(0, 17) + '...';
  } else {
    return title;
  }
}, showName:function(values, limit) {
  var name = values.firstname;
  if (name.length >= limit) {
    return name.substring(0, 8) + '...';
  } else {
    return name;
  }
}, getSkillNames:function(values) {
  var skillnames = values.skillnames, skills = skillnames.toString();
  return skills;
}, workOnPriorityShow:function(values) {
  if (values.work_on_priority == 'Y') {
    return '\x3cdiv class\x3d"create-jobapplication-starbtn-cls"\x3e\x3cspan\x3e\x3ci class\x3d"star-cls arrow-cls"\x3e\x3c/i\x3e\x3c/span\x3e\x3c/div\x3e';
  } else {
    return '';
  }
}}], itemSelector:'div.jobOpenFormView', listeners:{itemclick:'onJobOpeningClick', containerClick:'onContainerClick'}}]});
Ext.define('JobOpenings.view.jobopeningrequest.JobOpeningsViewForm', {extend:'Ext.form.Panel', alias:'widget.jobopeningsviewform', xtype:'jobopeningsviewform', cls:'form-cls', reference:'jobform', dockedItems:[{xtype:'toolbar', cls:'tooltip-cls', dock:'top', items:[{xtype:'button', scale:'medium', iconCls:'goalsbackbtn-cls', cls:'jobback-btn-cls', style:{border:0}, listeners:{click:'onBackClick'}}, {xtype:'label', html:'Create New Job Opening', cls:'backlabel-cls'}]}], items:[{xtype:'form', title:'Requirement Details', 
cls:'job-header', reference:'jobopenform', layout:{type:'vbox', align:'middle', pack:'center'}, border:false, buttonAlign:'center', defaults:{width:'70%', labelAlign:'right', labelWidth:180, padding:5, labelStyle:'font-size:16px;'}, items:[{xtype:'hiddenfield', name:'ddo_jobopening_id'}, {xtype:'textfield', name:'title', required:true, reference:'jobtitleref', fieldLabel:'Job Title:', emptyText:'Write Job Title Eg: Technical Lead', emptyCls:'referrals-empty-text', allowBlank:false, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e', 
bind:{value:'title'}}, {xtype:'htmleditor', cls:'editor-cls', name:'job_desc', reference:'editorref', fieldLabel:'Job Description', id:'myEditor', submitEmptyText:false, required:true, enableFont:false, enableLists:false, enableLinks:true, enableAlignments:true, enableSourceEdit:false, enableColors:false, enableFontSize:false, allowBlank:false, isValid:function() {
  var val = this.getValue();
  if (val) {
    return true;
  } else {
    return false;
  }
}, border:1, labelCls:'html-editor-label', validateOnChange:true, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {items:[{xtype:'fieldcontainer', fieldLabel:'Salary Range', cls:'fieldcontainer-cls', labelStyle:'font-size:16px;', labelAlign:'right', labelWidth:178, layout:'hbox', items:[{xtype:'textfield', flex:1, emptyCls:'referrals-empty-text', emptyText:'0', name:'minsalary', minLength:0, maxLength:5, width:100, enforceMaxLength:true, maskRe:/^[0-9]*$/}, 
{xtype:'label', text:'To', margin:'10 10'}, {xtype:'textfield', flex:1, emptyCls:'referrals-empty-text', emptyText:'0', name:'maxsalary', minLength:0, maxLength:5, width:100, enforceMaxLength:true, maskRe:/^[0-9]*$/}, {xtype:'label', text:'Lacs', margin:'10 10'}]}]}, {items:[{xtype:'fieldcontainer', fieldLabel:'No. of Positions', cls:'fieldcontainer-cls', allowBlank:false, labelWidth:178, width:700, layout:'hbox', afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e', 
msgTarget:'side', labelAlign:'right', labelStyle:'font-size:16px;', items:[{xtype:'numberfield', name:'noofpositions', reference:'positionref', positionlabel:'positionlabel-cls', allowBlank:false, maskRe:/^[0-9]*$/, width:80, minValue:1, value:0, enableKeyEvents:true, invalidText:'Please enter valid data', afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e', listeners:{focusleave:'onNoofPositeionsEnter'}}, {xtype:'datefield', editable:true, required:true, 
name:'closuredate', width:250, labelAlign:'right', format:'d-m-Y', submitFormat:'Y-m-d', maskRe:/[0-9\-\/]/, allowBlank:false, cls:['closuredatecls', 'closuredatecls1'], labelStyle:'font-size:15px;width:170px;padding-right:5px', fieldLabel:'Expected Closure Date', afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e', minValue:new Date, createPicker:function() {
  var me = this, format = Ext.String.format;
  return Ext.create('Ext.picker.Date', {pickerField:me, ownerCt:me.ownerCt, renderTo:document.body, floating:true, hidden:true, focusOnShow:true, cls:'ddo-create-datepicker', minDate:me.minValue, maxDate:me.maxValue, disabledDatesRE:me.disabledDatesRE, disabledDatesText:me.disabledDatesText, disabledDays:me.disabledDays, disabledDaysText:me.disabledDaysText, format:me.format, showToday:me.showToday, startDay:me.startDay, minText:format(me.minText, me.formatDate(me.minValue)), maxText:format(me.maxText, 
  me.formatDate(me.maxValue)), listeners:{scope:me, select:me.onSelect}, keyNavConfig:{esc:function() {
    me.collapse();
  }}});
}, listeners:{focusleave:'onKeyDownDate'}}, {xtype:'checkbox', boxLabel:'Work on Priority', name:'work_on_priority', inputValue:'Y', width:250, checked:false, cls:['workprioritycls', 'workprioritycls1'], labelAlign:'right', labelStyle:'font-size:16px;', reference:'jobworkcheckboxref'}]}]}, {items:[{xtype:'fieldcontainer', fieldLabel:'Work Experience', cls:'fieldcontainer-cls', allowBlank:false, labelWidth:100, layout:'hbox', afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e', 
msgTarget:'side', labelAlign:'right', labelWidth:178, labelStyle:'font-size:16px;', items:[{xtype:'numberfield', emptyText:'Minimum', emptyCls:'referrals-empty-text', reference:'minref', name:'minworkexperience', minValue:0, enableKeyEvents:true, allowBlank:false, mouseWheelEnabled:false, listeners:{blur:'onMinValueSelect'}}, {xtype:'label', text:'To', margin:'10 10'}, {xtype:'numberfield', emptyText:'Maximum', emptyCls:'referrals-empty-text', allowBlank:false, mouseWheelEnabled:false, reference:'maxref', 
minValue:0, enableKeyEvents:true, name:'maxworkexperience', width:'50', listeners:{blur:'onMaxValueSelect'}}]}]}, {xtype:'tagfield', fieldLabel:'Skills', tpl:Ext.create('Ext.XTemplate', '\x3cul class\x3d"x-list-plain"\x3e\x3ctpl for\x3d"."\x3e', '\x3cli role\x3d"option" class\x3d"x-boundlist-item" style\x3d"text-align:center;"\x3e{name}\x3c/li\x3e', '\x3c/tpl\x3e\x3c/ul\x3e'), displayTpl:Ext.create('Ext.XTemplate', '\x3ctpl for\x3d"."\x3e', '{name}', '\x3c/tpl\x3e'), name:'skill_ids', hideTrigger:true, 
reference:'skillref', emptyText:'Use Words Eg : Angular JS', emptyCls:'referrals-empty-text1', displayField:'name', valueField:'ddo_skills_id', queryMode:'local', forceSelection:false, maskRe:/^[A-Za-z0-9]*$/, autoShow:true, selectOnTab:true, tabIndex:1, filterPickList:true, blankText:'This field is required', border:5, collapseOnSelect:true, allowBlank:false, clearFilterOnBlur:false, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e', listeners:{render:'onSkillRender', 
select:function(combo, record, eOpts) {
  combo.inputEl.dom.value = '';
  combo.lastMutatedValue = '';
}}}, {xtype:'combobox', name:'ddo_joblocation_id', fieldLabel:'Job Location', reference:'locationref', queryMode:'local', emptyText:'Select Location', emptyCls:'referrals-empty-text', tpl:Ext.create('Ext.XTemplate', '\x3cul class\x3d"x-list-plain"\x3e\x3ctpl for\x3d"."\x3e', '\x3cli role\x3d"option" class\x3d"x-boundlist-item" style\x3d"text-align:center;"\x3e{name}\x3c/li\x3e', '\x3c/tpl\x3e\x3c/ul\x3e'), displayTpl:Ext.create('Ext.XTemplate', '\x3ctpl for\x3d"."\x3e', '{name}', '\x3c/tpl\x3e'), 
editable:false, typeAhead:false, displayField:'name', valueField:'ddo_joblocation_id', allowBlank:false, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e', listeners:{render:'onJobLocationRender'}}, {xtype:'combobox', name:'ddo_projects_clients_id', fieldLabel:'Client', reference:'clientref', queryMode:'local', emptyText:'Select Client', emptyCls:'referrals-empty-text', tpl:Ext.create('Ext.XTemplate', '\x3cul class\x3d"x-list-plain"\x3e\x3ctpl for\x3d"."\x3e', 
'\x3cli role\x3d"option" class\x3d"x-boundlist-item" style\x3d"text-align:center;"\x3e{name}\x3c/li\x3e', '\x3c/tpl\x3e\x3c/ul\x3e'), displayTpl:Ext.create('Ext.XTemplate', '\x3ctpl for\x3d"."\x3e', '{name}', '\x3c/tpl\x3e'), editable:false, typeAhead:false, displayField:'name', valueField:'ddo_projects_clients_id', afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'tagfield', cls:'tag-cls', name:'interviewers_ids', reference:'interviewref', 
fieldLabel:'Interview Panel', hideTrigger:true, emptyText:'Type Users Eg : Will Smith', emptyCls:'referrals-empty-text1', displayField:'empname', valueField:'empid', queryMode:'local', forceSelection:false, matchFieldWidth:true, clearOnBackspace:false, tagCustomiseMom:true, tagMomOwnerId:'123', filterPickList:true, typeAhead:false, blankText:'This field is required', allowBlank:false, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e', listeners:{render:'onInterviewRender', 
select:function(combo, record, eOpts) {
  combo.inputEl.dom.value = '';
  combo.collapse();
}}}]}], bbar:{cls:'jobform-cls', layout:{type:'hbox', align:'middle', pack:'center'}, padding:'25 0 21 0', items:[{xtype:'button', text:'Save and Send for Approval', cls:['approval-btn', 'approval-margin'], width:200, formBind:true, listeners:{click:'onFormSaveClick'}, style:'border-radius: 4px !important; left: 335px !important;'}, {xtype:'button', text:'Save Requirement', cls:'require-btn', formBind:true, listeners:{click:'onDraftSaveClick'}}]}});
Ext.define('JobOpenings.view.jobopeningrequest.JobOpeningsRequestView', {extend:'Ext.container.Container', xtype:'jobopeningsrequestview', requires:['JobOpenings.view.jobopeningrequest.JobOpeningsRequestListView', 'JobOpenings.view.jobopeningrequest.JobOpeningsViewForm', 'JobOpenings.view.jobopeningrequest.JobOpenFormController', 'JobOpenings.view.jobopeningrequest.filtertoolbar.FilterViewModel', 'JobOpenings.view.jobopeningrequest.JobOpeningsFormDataViewMode'], layout:{type:'card', activeItem:0}, 
reference:'jobmainview', controller:'jobopenformcontroller', viewModel:{type:'filterviewmodel'}, margin:'10 0 0 10', items:[{xtype:'jobopeningsrequestlistview', id:'list'}, {xtype:'jobopeningsviewform', id:'form'}, {xtype:'jobOpeningsFormDataViewMode', id:'viewform'}]});
Ext.define('JobOpenings.view.jobopeningrequest.filtertoolbar.FilterTagsView', {extend:'Ext.container.Container', xtype:'filtertagsview', extend:'Ext.view.View', requires:['JobOpenings.store.filtertoolbar.TagStore'], loadMask:false, overItemCls:'ddo-interest-over', store:'JobOpenings.store.filtertoolbar.TagStore', emptyText:'\x3cdiv class \x3d "ddo-emptytext"\x3e\x3c/div\x3e', tpl:['\x3ctpl\x3e', '\x3cdiv class \x3d "ddo-intertesttpl"\x3e', '\x3cdiv class\x3d"ddo-interests"\x3e{loc_name}\x3c/div\x3e', 
'\x3ctpl\x3e', '\x3cdiv class\x3d"ddo-interetsts-delete" data-action\x3d"deleteLocationFilter"\x3e\x3c/div\x3e', '\x3c/tpl\x3e', '\x3c/div\x3e', '\x3c/tpl\x3e', {}], itemSelector:'div.ddo-intertesttpl'});
Ext.define('JobOpenings.view.jobopeningrequest.filtertoolbar.JobOpeningsFilterController', {extend:'Ext.app.ViewController', alias:'controller.jobopeningsfiltercontroller', onLocationSelect:function(combo, record, eOpts) {
  var store = combo.getStore(), fieldValue = combo.getSelection().data.ddo_joblocation_id, match = fieldValue;
}, onApplyBtnClick:function(btn, e, eOpts) {
  var form = this.getView(), locationValue = form.getValues().filterlocation, departmentValue = form.getValues().filterdepartment, dateValue = form.getValues().filterDateName, match = locationValue, listview = Ext.ComponentQuery.query('jobopeningsrequestlistview'), dataview = listview[0].down('dataview[reference\x3d"jobdataview"]'), dataviewStore = dataview.getStore(), window = form.up('window'), vm = this.getViewModel(), tagPanel = Ext.ComponentQuery.query('jobopeningsfilterview'), tagPanelItm = 
  tagPanel[0].items.items;
  tagPanelItm[3].hide();
  tagPanelItm[4].hide();
  tagPanelItm[5].hide();
  if (!Ext.isEmpty(locationValue) && locationValue != 'All') {
    dataviewStore.filter({property:'ddo_joblocation_id', id:'filterByLocation', anyMatch:true, caseSensitie:false, value:locationValue}, locationValue, false);
    tagPanelItm[4].show();
    var locRefText = this.getReferences().filtercomboref.getSelectedRecord().data.name;
    var textVal = locRefText.substring(0, 10);
    tagPanelItm[4].items.items[0].setText(textVal);
  } else {
    dataviewStore.removeFilter('filterByLocation');
  }
  if (!Ext.isEmpty(departmentValue) && departmentValue != 'All') {
    dataviewStore.filter({property:'ddo_department_id', id:'filterByDepartment', anyMatch:true, caseSensitie:false, value:departmentValue}, departmentValue, false);
    tagPanelItm[5].show();
    var depRefText = this.getReferences().deptcomboref.getSelectedRecord().data.name;
    var textVal = depRefText.substring(0, 10);
    tagPanelItm[5].items.items[0].setText(textVal);
  } else {
    dataviewStore.removeFilter('filterByDepartment');
  }
  if (!Ext.isEmpty(dateValue) && dateValue != 'All') {
    var days = null;
    if (dateValue == 'Past 24 HR') {
      days = 1;
    }
    if (dateValue == 'Past Week') {
      days = 7;
    }
    if (dateValue == 'Custom Range') {
      var customRangeDate = this.getReferences().customDateRef.value;
      if (customRangeDate != null || customRangeDate != undefined) {
        var oneDay = 24 * 60 * 60 * 1000;
        var firstDate = new Date(customRangeDate);
        var secondDate = new Date;
        days = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
      } else {
        return;
      }
    }
    dataviewStore.filter({property:'jobupdateddate', id:'filterByDate', anyMatch:true, caseSensitie:false, value:dateValue, filterFn:function(record) {
      var date = new Date;
      var last = new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
      return new Date(record.data.jobupdateddate) >= last && new Date(record.data.jobupdateddate) <= new Date;
    }}, dateValue, false);
    tagPanelItm[3].show();
    if (dateValue != 'Custom Range') {
      var textVal = dateValue.substring(0, 10);
    } else {
      var dateRefText = Ext.Date.format(new Date(this.getReferences().customDateRef.value), 'd/m/y'), textVal = dateRefText.substring(0, 10);
    }
    tagPanelItm[3].items.items[0].setText(textVal);
  } else {
    dataviewStore.removeFilter('filterByDate');
  }
  window.close();
}, onFilterDateSelect:function(combo, record, eOpts) {
  var store = combo.getStore(), fieldValue = combo.getSelection().data.name;
  if (fieldValue == 'Custom Range') {
    this.getReferences().customDateRef.show();
  } else {
    this.getReferences().customDateRef.hide();
  }
}});
Ext.define('JobOpenings.view.jobopeningrequest.filtertoolbar.JobOpeningRequestFilterComboboxes', {extend:'Ext.form.Panel', xtype:'jobopeningrequestfiltercomboboxes', requires:['JobOpenings.store.filtertoolbar.JobOpeningsDateStore', 'JobOpenings.store.form.LocationStore', 'JobOpenings.view.jobopeningrequest.filtertoolbar.JobOpeningsFilterController', 'JobOpenings.view.jobopeningrequest.filtertoolbar.FilterViewModel'], viewModel:'filterviewmodel', controller:'jobopeningsfiltercontroller', layout:'column', 
items:[{columnWidth:0.5, items:[{layout:{type:'vbox'}, items:[{xtype:'combobox', reference:'filterdate', name:'filterDateName', labelAlign:'top', fieldLabel:'Filter by Date', margin:'10 0 0 90', tpl:Ext.create('Ext.XTemplate', '\x3cul class\x3d"x-list-plain"\x3e\x3ctpl for\x3d"."\x3e', '\x3cli role\x3d"option" class\x3d"x-boundlist-item" style\x3d"text-align:center;"\x3e{name}\x3c/li\x3e', '\x3c/tpl\x3e\x3c/ul\x3e'), displayTpl:Ext.create('Ext.XTemplate', '\x3ctpl for\x3d"."\x3e', '{name}', '\x3c/tpl\x3e'), 
cls:'requestCombo-cls', queryMode:'local', displayField:'name', editable:false, valueField:'name', value:'All', store:Ext.create('JobOpenings.store.filtertoolbar.JobOpeningsDateStore'), autoLoadOnValue:true, listeners:{select:'onFilterDateSelect'}}, {xtype:'combobox', labelAlign:'top', name:'filterdepartment', reference:'deptcomboref', fieldLabel:'Filter by Department', cls:'requestCombo-cls', editable:false, margin:'10 0 0 90', queryMode:'local', tpl:Ext.create('Ext.XTemplate', '\x3cul class\x3d"x-list-plain"\x3e\x3ctpl for\x3d"."\x3e', 
'\x3cli role\x3d"option" class\x3d"x-boundlist-item" style\x3d"text-align:center;"\x3e{name}\x3c/li\x3e', '\x3c/tpl\x3e\x3c/ul\x3e'), displayTpl:Ext.create('Ext.XTemplate', '\x3ctpl for\x3d"."\x3e', '{name}', '\x3c/tpl\x3e'), displayField:'name', valueField:'ddo_department_id', value:'All', autoLoadOnValue:true}]}]}, {columnWidth:0.5, items:[{layout:{type:'vbox'}, items:[{fieldLabel:'Custom Date', labelAlign:'top', xtype:'datefield', cls:'requestCombo-cls', name:'filterCustomDate', reference:'customDateRef', 
margin:'10 90 0 0', editable:false, allowBlank:false, maxValue:new Date, hidden:true}, {xtype:'combobox', labelAlign:'top', cls:'requestCombo-cls', name:'filterlocation', reference:'filtercomboref', editable:false, fieldLabel:'Filter by Location', tpl:Ext.create('Ext.XTemplate', '\x3cul class\x3d"x-list-plain"\x3e\x3ctpl for\x3d"."\x3e', '\x3cli role\x3d"option" class\x3d"x-boundlist-item" style\x3d"text-align:center;"\x3e{name}\x3c/li\x3e', '\x3c/tpl\x3e\x3c/ul\x3e'), displayTpl:Ext.create('Ext.XTemplate', 
'\x3ctpl for\x3d"."\x3e', '{name}', '\x3c/tpl\x3e'), margin:'10 90 0 0', queryMode:'local', displayField:'name', valueField:'ddo_joblocation_id', value:'All', autoLoadOnValue:true, listeners:{select:'onLocationSelect'}, bind:{store:'{locationStore}'}}]}]}], dockedItems:[{xtype:'toolbar', width:'100%', margin:'0 0 30 0', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', text:'Apply', width:150, cls:'filter-submit-btn', listeners:{click:'onApplyBtnClick'}}, {xtype:'tbfill'}]}]});
Ext.define('JobOpenings.view.jobopeningrequest.filtertoolbar.JobOpeningsFilterViews', {extend:'Ext.panel.Panel', xtype:'jobopeningsfilterviews', requires:['JobOpenings.store.filtertoolbar.FilterbyStatus', 'JobOpenings.view.jobopeningrequest.filtertoolbar.FilterViewModel'], viewModel:{type:'filterviewmodel'}, reference:'filterview', layout:{type:'hbox', width:'100%'}, items:[{xtype:'combobox', fieldLabel:'Status', reference:'jobstatuscomboref', queryMode:'local', displayField:'name', valueField:'id', 
emptyText:'All', cls:'requestCombo-cls', store:Ext.create('JobOpenings.store.filtertoolbar.FilterbyStatus'), autoLoadOnValue:true, listeners:{select:'onStatusSelectionFilter'}}]});
Ext.define('JobOpenings.view.referrals.filtertoolbar.JobReferralsFilterController', {extend:'Ext.app.ViewController', alias:'controller.jobreferralsfiltercontroller', onLocationSelect:function(combo, record, eOpts) {
  var store = combo.getStore(), fieldValue = combo.getSelection().data.ddo_joblocation_id, match = fieldValue;
}, onApplyBtnClick:function(btn, e, eOpts) {
  var form = this.getView(), locationValue = form.getValues().filterlocation, departmentValue = form.getValues().filterdepartment, dateValue = form.getValues().filterDateName, match = locationValue, listview = Ext.ComponentQuery.query('jobopeningsreferralslistview'), dataview = listview[0].down('dataview[reference\x3d"jobdataviewreferrals"]'), dataviewStore = dataview.getStore(), window = form.up('window'), vm = this.getViewModel(), tagPanel = Ext.ComponentQuery.query('jobreferralsfilterview'), tagPanelItm = 
  tagPanel[0].items.items;
  tagPanelItm[3].hide();
  tagPanelItm[4].hide();
  tagPanelItm[5].hide();
  if (!Ext.isEmpty(locationValue) && locationValue != 'All') {
    dataviewStore.filter({property:'ddo_joblocation_id', id:'filterByLocation', anyMatch:true, caseSensitie:false, value:locationValue}, locationValue, false);
    tagPanelItm[4].show();
    var locRefText = this.getReferences().filtercomboref.getSelectedRecord().data.name;
    var textVal = locRefText.substring(0, 10);
    tagPanelItm[4].items.items[0].setText(textVal);
  } else {
    dataviewStore.removeFilter('filterByLocation');
  }
  if (!Ext.isEmpty(departmentValue) && departmentValue != 'All') {
    dataviewStore.filter({property:'ddo_department_id', id:'filterByDepartment', anyMatch:true, caseSensitie:false, value:departmentValue}, departmentValue, false);
    tagPanelItm[5].show();
    var depRefText = this.getReferences().deptcomboref.getSelectedRecord().data.name;
    var textVal = depRefText.substring(0, 10);
    tagPanelItm[5].items.items[0].setText(textVal);
  } else {
    dataviewStore.removeFilter('filterByDepartment');
  }
  if (!Ext.isEmpty(dateValue) && dateValue != 'All') {
    var days = null;
    if (dateValue == 'Past 24 HR') {
      days = 1;
    }
    if (dateValue == 'Past Week') {
      days = 7;
    }
    if (dateValue == 'Custom Range') {
      var customRangeDate = this.getReferences().customDateRef.value;
      if (customRangeDate != null || customRangeDate != undefined) {
        var oneDay = 24 * 60 * 60 * 1000;
        var firstDate = new Date(customRangeDate);
        var secondDate = new Date;
        days = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
      } else {
        return;
      }
    }
    dataviewStore.filter({property:'jobupdateddate', id:'filterByDate', anyMatch:true, caseSensitie:false, value:dateValue, filterFn:function(record) {
      var date = new Date;
      var last = new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
      return new Date(record.data.jobupdateddate) >= last && new Date(record.data.jobupdateddate) <= new Date;
    }}, dateValue, false);
    tagPanelItm[3].show();
    if (dateValue != 'Custom Range') {
      var textVal = dateValue.substring(0, 10);
    } else {
      var dateRefText = Ext.Date.format(new Date(this.getReferences().customDateRef.value), 'd/m/y'), textVal = dateRefText.substring(0, 10);
    }
    tagPanelItm[3].items.items[0].setText(textVal);
  } else {
    dataviewStore.removeFilter('filterByDate');
  }
  window.close();
}, onFilterDateSelect:function(combo, record, eOpts) {
  var store = combo.getStore(), fieldValue = combo.getSelection().data.name;
  if (fieldValue == 'Custom Range') {
    this.getReferences().customDateRef.show();
  } else {
    this.getReferences().customDateRef.hide();
  }
}});
Ext.define('JobOpenings.view.referrals.filtertoolbar.JobReferralsFilterComboboxes', {extend:'Ext.form.Panel', xtype:'jobreferralsfiltercomboboxes', requires:['JobOpenings.store.filtertoolbar.JobOpeningsDateStore', 'JobOpenings.store.form.LocationStore', 'JobOpenings.view.referrals.filtertoolbar.JobReferralsFilterController', 'JobOpenings.view.jobopeningrequest.filtertoolbar.FilterViewModel'], viewModel:'filterviewmodel', controller:'jobreferralsfiltercontroller', layout:'column', items:[{columnWidth:0.5, 
items:[{layout:{type:'vbox'}, items:[{xtype:'combobox', reference:'filterdate', name:'filterDateName', labelAlign:'top', tpl:Ext.create('Ext.XTemplate', '\x3cul class\x3d"x-list-plain"\x3e\x3ctpl for\x3d"."\x3e', '\x3cli role\x3d"option" class\x3d"x-boundlist-item" style\x3d"text-align:center;"\x3e{name}\x3c/li\x3e', '\x3c/tpl\x3e\x3c/ul\x3e'), displayTpl:Ext.create('Ext.XTemplate', '\x3ctpl for\x3d"."\x3e', '{name}', '\x3c/tpl\x3e'), fieldLabel:'Filter by Date', margin:'10 0 0 90', cls:'requestCombo-cls', 
queryMode:'local', displayField:'name', valueField:'name', value:'All', editable:false, store:Ext.create('JobOpenings.store.filtertoolbar.JobOpeningsDateStore'), autoLoadOnValue:true, listeners:{select:'onFilterDateSelect'}}, {xtype:'combobox', labelAlign:'top', name:'filterdepartment', reference:'deptcomboref', tpl:Ext.create('Ext.XTemplate', '\x3cul class\x3d"x-list-plain"\x3e\x3ctpl for\x3d"."\x3e', '\x3cli role\x3d"option" class\x3d"x-boundlist-item" style\x3d"text-align:center;"\x3e{name}\x3c/li\x3e', 
'\x3c/tpl\x3e\x3c/ul\x3e'), displayTpl:Ext.create('Ext.XTemplate', '\x3ctpl for\x3d"."\x3e', '{name}', '\x3c/tpl\x3e'), fieldLabel:'Filter by Department', cls:'requestCombo-cls', margin:'10 0 0 90', editable:false, queryMode:'local', displayField:'name', valueField:'ddo_department_id', value:'All', autoLoadOnValue:true}]}]}, {columnWidth:0.5, items:[{layout:{type:'vbox'}, items:[{fieldLabel:'Custom Date', labelAlign:'top', xtype:'datefield', cls:'requestCombo-cls', name:'filterCustomDate', reference:'customDateRef', 
margin:'10 90 0 0', editable:false, allowBlank:false, maxValue:new Date, hidden:true}, {xtype:'combobox', labelAlign:'top', cls:'requestCombo-cls', name:'filterlocation', reference:'filtercomboref', tpl:Ext.create('Ext.XTemplate', '\x3cul class\x3d"x-list-plain"\x3e\x3ctpl for\x3d"."\x3e', '\x3cli role\x3d"option" class\x3d"x-boundlist-item" style\x3d"text-align:center;"\x3e{name}\x3c/li\x3e', '\x3c/tpl\x3e\x3c/ul\x3e'), displayTpl:Ext.create('Ext.XTemplate', '\x3ctpl for\x3d"."\x3e', '{name}', '\x3c/tpl\x3e'), 
fieldLabel:'Filter by Location', margin:'10 90 0 0', queryMode:'local', displayField:'name', editable:false, valueField:'ddo_joblocation_id', value:'All', autoLoadOnValue:true, listeners:{select:'onLocationSelect'}}]}]}], dockedItems:[{xtype:'toolbar', width:'100%', margin:'0 0 30 0', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', text:'Apply', width:150, cls:'filter-submit-btn', listeners:{click:'onApplyBtnClick'}}, {xtype:'tbfill'}]}]});
Ext.define('JobOpenings.view.referrals.filtertoolbar.JobReferralsAddfilterWindow', {extend:'Ext.window.Window', xtype:'filterwindow', requires:['JobOpenings.view.referrals.filtertoolbar.JobReferralsFilterComboboxes'], title:'Add Filter', modal:true, height:300, width:620, margin:'5 50 0 0', layout:{type:'fit'}, closeAction:'hide', reference:'filterreferwinref', resizable:false, cls:'ddo-filter-window', title:'Add Filters', initComponent:function() {
  var me = this;
  me.callParent(arguments);
  me.mon(Ext.getBody(), 'click', function(el, e) {
    me.close(me.closeAction);
  }, me, {delegate:'.x-mask'});
}, items:[{xtype:'jobreferralsfiltercomboboxes'}]});
Ext.define('JobOpenings.view.jobopeningrequest.filtertoolbar.JobOpeningsRequestAddfilterWindow', {extend:'Ext.window.Window', xtype:'filterwindow', requires:['JobOpenings.view.jobopeningrequest.filtertoolbar.JobOpeningRequestFilterComboboxes'], title:'Add Filter', modal:true, height:300, width:620, margin:'5 50 0 0', layout:{type:'fit'}, closeAction:'hide', reference:'filterwinref', resizable:false, cls:'ddo-filter-window', title:'Add Filters', initComponent:function() {
  var me = this;
  me.callParent(arguments);
  me.mon(Ext.getBody(), 'click', function(el, e) {
    me.close(me.closeAction);
  }, me, {delegate:'.x-mask'});
}, items:[{xtype:'jobopeningrequestfiltercomboboxes'}]});
Ext.define('JobOpenings.view.preferences.PreferencesController', {extend:'Ext.app.ViewController', alias:'controller.preferencescontroller', onAddNewClick:function(btn, e, eOpts) {
  var view = this.getView();
  var preferencesWindow = Ext.ComponentQuery.query('preferenceswindow')[0] || Ext.create('JobOpenings.view.preferences.PreferencesWindow'), form = preferencesWindow.down('form');
  this.onFormLoadTrue(form);
  form.reset();
  preferencesWindow.show();
  preferencesWindow.edit = false;
}, onFormLoadTrue:function(form) {
  var formValues = form.getValues();
  var items = form.getForm().getFields().items, i = 0, len = items.length;
  for (; i < len; i++) {
    var formField = items[i];
    formField.setValue('');
    if (formField.mixins && formField.mixins.field && typeof formField.mixins.field['initValue'] == 'function') {
      formField.mixins.field.initValue.apply(formField);
      formField.wasDirty = false;
    }
  }
}, onGridRowClick:function(row, record, tr, rowIndex, e, eOpts) {
  var preferencesWindow = Ext.ComponentQuery.query('preferenceswindow')[0] || Ext.create('JobOpenings.view.preferences.PreferencesWindow'), form = preferencesWindow.down('form');
  this.onFormLoadDirtyFalse(form, record);
  form.reset();
  form.loadRecord(record);
  preferencesWindow.show();
  preferencesWindow.edit = true;
}, onFormLoadDirtyFalse:function(form, record) {
  form.items.items.forEach(function(rec) {
    rec.originalValue = record.get(rec.name);
  });
}, onWindowOutsideTap:function(event, target) {
  var view = this;
  Utility.onSetUpWinOutterTap(event, target, view);
}, onFormCancelClick:function(btn, e, eOpts) {
  var preferencesWindow, form;
  preferencesWindow = btn.up('window');
  form = preferencesWindow.down('form');
  form.reset();
  preferencesWindow.close();
}, onFormSaveClick:function(btn, e, eOpts) {
  var gridStore, preferencesWindow, form, formRec, params, name, valueMatch, editRec;
  gridStore = Ext.ComponentQuery.query('preferencesgrid')[0].getStore();
  preferencesWindow = btn.up('window');
  form = preferencesWindow.down('form');
  formRec = form.getValues();
  name = Ext.String.trim(formRec.name);
  valueMatch = gridStore.findRecord('name', name, 0, false, false, true);
  if (preferencesWindow.edit) {
    editRec = gridStore.findRecord('id', formRec.id);
    if (valueMatch && editRec && editRec.get('name').toLowerCase() == valueMatch.get('name').toLowerCase()) {
      valueMatch = null;
    }
  }
  if (!valueMatch) {
    if (form.isDirty()) {
      if (preferencesWindow.edit) {
        form.updateRecord();
        params = {id:formRec.id, name:formRec.name, description:formRec.description, tablename:gridStore.proxy.extraParams.tablename};
        Ext.Ajax.request({url:'/preference/preferencedata', method:'PUT', jsonData:params, success:function(resp, b) {
          gridStore.load();
          Ext.getBody().unmask();
        }, failure:function(resp, b) {
          Ext.getBody().unmask();
        }});
      } else {
        formRec.tablename = gridStore.proxy.extraParams.tablename;
        gridStore.add(formRec);
        gridStore.sync({callback:function() {
          gridStore.load();
        }});
      }
      form.reset();
      preferencesWindow.close();
    } else {
      form.reset();
      preferencesWindow.close();
    }
  } else {
    Ext.Msg.alert('Warning', 'Record is existing!');
  }
}, onPreferencesClick:function(ele, record, item, index, e, eOpts) {
  var store = this.getStore('preferncesStore');
  store.getProxy().extraParams = {tablename:record.data.tablename};
  store.load();
}});
Ext.define('JobOpenings.view.preferences.PreferencesGridModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.preferencesgridmodel', stores:{preferncesStore:{fields:['name', 'description'], autoLoad:false, proxy:{type:'ajax', extraParams:{tablename:'ddo_jobtype'}, api:{read:'/preference/preferencedata', create:'/preference/preferencedata', update:'/preference/preferencedata', destroy:'/preference/preferencedata'}, reader:{type:'json', rootProperty:'data'}, actionMethods:{read:'GET', create:'POST', 
update:'PUT', destroy:'DELETE'}}}}});
Ext.define('JobOpenings.view.preferences.PreferencesGridView', {extend:'Ext.grid.Panel', alias:'widget.preferencesgrid', plugins:'gridfilters', cls:'karmalist-cls', style:'border:1px solid #efe8e8; background: black;', columns:[{text:'Name', flex:0.3, dataIndex:'name'}, {text:'Description', flex:0.4, dataIndex:'description'}, {text:'Action', flex:0.1, xtype:'actioncolumn', align:'center', items:[{iconCls:'delete-plus', tooltip:'Delete', handler:function(grid, rowIndex, colIndex) {
  var gridStore = grid.getStore('preferncesStore'), rec = gridStore.getAt(rowIndex), params;
  params = {tablename:gridStore.proxy.extraParams.tablename, id:rec.data.id, name:rec.data.name};
  var url = '/preference/preferencedata';
  Ext.Ajax.request({url:url, method:'DELETE', params:params, success:function(resp, b) {
    gridStore.removeAt(rowIndex);
    gridStore.reload();
    Ext.getBody().unmask();
  }, failure:function(resp, b) {
    Ext.getBody().unmask();
  }});
}}]}], listeners:{rowdblclick:'onGridRowClick'}});
Ext.define('JobOpenings.view.preferences.PreferencesToolbar', {extend:'Ext.toolbar.Toolbar', alias:'widget.preferencestoolbar', cls:'rule-tb-cls', items:[{xtype:'tbfill'}, {xtype:'button', text:'Add New', iconCls:'rule-plus', margin:0, cls:'rule-add-btn', listeners:{click:'onAddNewClick'}}]});
Ext.define('JobOpenings.view.preferences.PreferencesTypesListModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.preferencestypeslistmodel', stores:{preferencestypelist:{autoLoad:false, proxy:{type:'ajax', url:'/preference/categories', reader:{type:'json', rootProperty:'data'}}}}});
Ext.define('JobOpenings.view.preferences.PreferencesTypesListView', {extend:'Ext.container.Container', xtype:'preferencestypeslistView', requires:['JobOpenings.view.preferences.PreferencesTypesListModel'], viewModel:{type:'preferencestypeslistmodel'}, items:[{xtype:'dataview', itemTpl:'\x3cdiv class\x3d"preferenceslist"\x3e{name}\x3c/div\x3e', itemSelector:'div.preferenceslist', listeners:{itemclick:'onPreferencesClick'}}]});
Ext.define('JobOpenings.view.preferences.PreferencesView', {extend:'Ext.panel.Panel', xtype:'preferencesview', requires:['JobOpenings.view.preferences.PreferencesGridView', 'JobOpenings.view.preferences.PreferencesTypesListView', 'JobOpenings.view.preferences.PreferencesGridModel', 'JobOpenings.view.preferences.PreferencesController', 'JobOpenings.view.preferences.PreferencesToolbar'], margin:20, cls:'karmarule-cls', viewModel:{type:'preferencesgridmodel'}, controller:'preferencescontroller', layout:{type:'hbox', 
width:'100%'}, tbar:[{xtype:'preferencestoolbar', cls:'wallet-toolbar-cls', width:'100%', height:70, html:'\x3ch3\x3ePreferences\x3c/h3\x3e'}], items:[{xtype:'preferencestypeslistView', flex:0.7}, {xtype:'tbspacer', width:20}, {xtype:'preferencesgrid', flex:2}, {xtype:'tbspacer', width:10}]});
Ext.define('JobOpenings.view.preferences.PreferencesWindow', {extend:'Ext.window.Window', alias:'widget.preferenceswindow', modal:true, resizable:false, cls:'rule-window-cls', width:600, closable:false, closeAction:'hide', requires:['JobOpenings.view.preferences.PreferencesGridModel', 'JobOpenings.view.preferences.PreferencesController'], title:'Preferences', controller:'preferencescontroller', viewModel:{type:'preferencesgridmodel'}, initComponent:function() {
  this.callParent(arguments);
  var controller = this.getController();
  Ext.getDoc().on('click', Ext.bind(controller.onWindowOutsideTap, controller));
}, destroy:function() {
  var controller = this.getController();
  Ext.getDoc().un('click', Ext.bind(controller.onWindowOutsideTap, controller));
}, listeners:{show:function(win, opts) {
  win.center();
}}, width:600, height:250, items:[{xtype:'form', bbar:{layout:{type:'hbox'}, padding:'25 0 21 0', items:[{xtype:'button', text:'Cancel', cls:'karmaform-cancel-btn', listeners:{click:'onFormCancelClick'}}, {xtype:'button', text:'Save', cls:'karmaform-save-btn', formBind:true, listeners:{click:'onFormSaveClick'}}]}, items:[{xtype:'hiddenfield', name:'id'}, {xtype:'textfield', allowBlank:false, name:'name', emptyText:'Name', required:true, cls:'rule-name-cls'}, {xtype:'textfield', allowBlank:false, 
name:'description', emptyText:'Description', cls:'rule-name-cls'}]}]});
Ext.define('JobOpenings.view.referrals.JobReferralsController', {extend:'Ext.app.ViewController', alias:'controller.jobreferralscontroller', init:function(application) {
  this.control({'[xtype\x3d"referralsmain"] field':{change:function() {
    window.sessionStorage.referrals_form_change = '1';
  }}});
}, onBackClick:function(item) {
  var jobSearchField = Ext.ComponentQuery.query('[reference \x3d jobsearchref_job_referrals]')[0];
  jobSearchField.setValue('');
  var jobDataView = Ext.ComponentQuery.query('[reference \x3d jobmyreferralsdata]')[0];
  jobDataView.getStore().clearFilter();
  var tagPanel = Ext.ComponentQuery.query('jobreferralsfilterview'), tagPanelItm = tagPanel[0].items.items;
  tagPanelItm[3].hide();
  tagPanelItm[4].hide();
  tagPanelItm[5].hide();
  var getDataStore = Ext.ComponentQuery.query('jobopeningsreferralslistview')[0].down('dataview').getStore();
  getDataStore.removeFilter('filterByLocation');
  getDataStore.removeFilter('filterByDepartment');
  getDataStore.removeFilter('filterByDate');
  Ext.ComponentQuery.query('[reference \x3d jobreferralsreference]')[0].getLayout().setActiveItem('referralsList');
}, onKeyUpJobSearch:function(searchfield, record, eOpts) {
  var checkView = Ext.ComponentQuery.query('jobopeningsreferralsview')[0].getLayout().getActiveItem().reference == 'referralslistview' ? true : false;
  var toGetReferenceView = checkView ? Ext.ComponentQuery.query('jobreferralsfilterview')[0] : Ext.ComponentQuery.query('jobopenigsmyreferralsfilterview')[0];
  this.searchJob(toGetReferenceView.down('textfield'), checkView);
}, searchJob:function(searchfield, checkView) {
  var searchString = searchfield.value, dataview = checkView ? Ext.ComponentQuery.query('[reference \x3d jobdataviewreferrals]')[0] : Ext.ComponentQuery.query('[reference \x3d jobmyreferralsdata]')[0], datviewStore = dataview.getStore();
  if (datviewStore) {
    datviewStore.clearFilter(true);
    if (checkView) {
      var obj = {'property':'ddo_jobopeningstatus_id', 'value':1};
      datviewStore.addFilter(obj);
    }
    datviewStore.filterBy(function(record) {
      var status = false;
      if (checkView) {
        var result = record.data.title.search(new RegExp(searchString, 'gi'));
      } else {
        if (record.data.appfirstname) {
          var result = record.data.appfirstname.search(new RegExp(searchString, 'gi'));
        } else {
          if (record.data.firstname) {
            var result = record.data.firstname.search(new RegExp(searchString, 'gi'));
          }
        }
      }
      return result >= 0 && true;
    }, this);
  }
}, onJobOpeningClick:function(vw, record, item, index, e, eOpts) {
  if (vw.up('jobopeningsreferralslistview')) {
    var mainView = Ext.ComponentQuery.query('[reference \x3d jobreferralsreference]')[0], form = Ext.ComponentQuery.query('jobOpeningsFormDataViewMode')[0];
    mainView.getLayout().setActiveItem(4);
    var recTitle = record.data.title;
    var myObj = {titleView:record.data.title.split('\x26apos;').join("'"), ddo_department_idView:record.data.department_name, job_descView:Ext.util.Format.stripTags(record.data.description.replace(/<div>/g, '\n\x3cdiv\x3e')), noofpositionsView:record.data.noofpositions.toString(), minsalary:record.data.minsalary, maxsalary:record.data.maxsalary, closuredateView:record.data.closuredate, work_on_priorityView:record.data.work_on_priority, ddo_projects_clients_id:record.data.ddo_projects_clients_id, 
    minworkexperienceView:record.data.minworkexperience.toString(), maxworkexperienceView:record.data.maxworkexperience.toString(), skill_idsView:record.data.skillnames.join(', '), ddo_joblocation_idView:record.data.location_name, interviewers_idsView:record.data.interviewersnames.join(', ')};
    form.getForm().setValues(myObj);
  } else {
    if (e.target.className == 'title-cls') {
      var mainView = Ext.ComponentQuery.query('[reference \x3d jobreferralsreference]')[0], form = Ext.ComponentQuery.query('referralsformview')[0];
      mainView.getLayout().setActiveItem(3);
      var myObj = {firstnameView:record.data.appfirstname, lastnameView:record.data.applastname, emailView:record.data.emailid, phoneView:record.data.mobile, comboView:record.data.recommendation, recommendationView:record.data.relationship, appResumeView:record.data.resumename};
      var recTitle = record.data.title;
      Ext.ComponentQuery.query('[reference \x3d referralTitleRef]')[0].setHtml(recTitle + '/ ' + 'Refer a Friend');
      form.getForm().setValues(myObj);
    }
  }
  if (e.target.innerText == 'Refer a Friend') {
    var view = Ext.ComponentQuery.query('[reference \x3d jobreferralsreference]')[0], viewModel = view.getViewModel(), referralFileUpload = Ext.ComponentQuery.query('[reference \x3d referralfileuploadref]')[0], referralUploadBtn = Ext.ComponentQuery.query('[reference \x3d referraluploadbtn]')[0];
    uploadBtn = Ext.ComponentQuery.query('[reference \x3d referraluploadbtn]')[0];
    viewModel.set('ddo_jobopening_id', record.data.ddo_jobopening_id);
    var recTitle = record.data.title;
    if (recTitle.length > 52) {
      recTitle = recTitle.substring(0, 49) + '...';
    }
    referralFileUpload.show();
    referralUploadBtn.setText('Choose File');
    referralFileUpload.fileInputEl.dom.value = '';
    Ext.ComponentQuery.query('[reference \x3d referraluploadlabelref]')[0].hide();
    Ext.ComponentQuery.query('[reference \x3d referraluploadhiddenbtnref]')[0].hide();
    Ext.ComponentQuery.query('[reference \x3d title_myreferralsCreationRef]')[0].setHtml(recTitle + '/ ' + 'Refer a Friend');
    Ext.ComponentQuery.query('[reference \x3d jobreferralsreference]')[0].getLayout().setActiveItem('referralMain');
    Ext.ComponentQuery.query('referralsadd')[0].getForm().reset();
    window.sessionStorage.referrals_form_change = '0';
  }
  if (e.target.lastChild != null && e.target.className == 'act-cls') {
    if (e.target.lastChild.classList.value !== 'act-showcls') {
      item.children[1].children[2].children[1].className = 'act-showcls';
    } else {
      item.children[1].children[2].children[1].className = 'act-removecls';
    }
  } else {
    if (e.target.innerText == 'Edit') {
      var form = Ext.ComponentQuery.query('[reference \x3d jobreferralsreference]')[0].getLayout().setActiveItem('referralMain');
      var ddo_referral_id = 2;
      var ddo_referral_id = record.data.ddo_referral_id;
      record.data.title = record.data.title.split('\x26apos;').join("'");
      this.loadRecord(record);
      var dataview = this.getReferences().jobmyreferralsdata;
      dataview.getStore().reload();
      dataview.refresh();
      var fields = form.getForm().getFields();
      setTimeout(function() {
        Ext.each(fields.items, function(field) {
          field.dirty = false;
          field.wasDirty = false;
        });
      }, 1000);
    } else {
      if (e.target.innerText == 'Delete') {
        Ext.Msg.confirm('Confirm', 'Are you sure you want to delete this Job?', function(btnText) {
          if (btnText === 'no') {
          } else {
            if (btnText === 'yes') {
              var ddo_employeereferral_id = record.data.ddo_employeereferral_id;
              params = {ddo_employeereferral_id:ddo_employeereferral_id};
              var url = '/jobapplication', method = 'DELETE';
              Ext.Ajax.request({url:url, method:method, scope:this, params:params, success:function(response) {
                var data = Ext.decode(response.responseText);
                var dataview = this.getReferences().jobmyreferralsdata;
                dataview.getStore().reload();
                dataview.refresh();
              }});
            }
          }
        }, this);
      }
    }
  }
}, onContainerClick:function(vw, record, item) {
  x = vw.all.elements;
  for (var i = 0; i < x.length; i++) {
    z = x[i].lastChild.lastChild.lastChild;
    if (z.className == 'act-showcls') {
      z.classList.remove('act-showcls');
      z.classList.add('act-removecls');
    }
  }
}, hideCombobox:function(com, e, eOpts) {
  if (Ext.ComponentQuery.query('[reference \x3d filterreferwinref]')[0] == undefined) {
    Ext.create('JobOpenings.view.referrals.filtertoolbar.JobReferralsAddfilterWindow').show();
  } else {
    var filterWindow = Ext.ComponentQuery.query('[reference \x3d filterreferwinref]')[0];
    filterWindow.show();
    var winForm = filterWindow.down('form'), formValues = winForm.getValues(), viewmodel = this.getViewModel();
    if (viewmodel.data.filtervalue == 'filterByLocation') {
      winForm.getForm().findField('filterlocation').setValue('All');
    } else {
      if (viewmodel.data.filtervalue == 'filterByDepartment') {
        winForm.getForm().findField('filterdepartment').setValue('All');
      } else {
        if (viewmodel.data.filtervalue == 'filterByDate') {
          winForm.getForm().findField('filterDateName').setValue('All');
        }
      }
    }
  }
}, hideComboboxMyReferrals:function(com, e, eOpts) {
  if (Ext.ComponentQuery.query('[reference \x3d filtermyreferwinref]')[0] == undefined) {
    Ext.create('JobOpenings.view.referrals.filtertoolbar.JobMyReferralsAddfilterWindow').show();
  } else {
    var filterWindow = Ext.ComponentQuery.query('[reference \x3d filtermyreferwinref]')[0];
    filterWindow.show();
    var winForm = filterWindow.down('form'), formValues = winForm.getValues(), viewmodel = this.getViewModel();
    if (viewmodel.data.filtervalue == 'filterByLocation') {
      winForm.getForm().findField('filterlocation').setValue('All');
    } else {
      if (viewmodel.data.filtervalue == 'filterByDepartment') {
        winForm.getForm().findField('filterdepartment').setValue('All');
      } else {
        if (viewmodel.data.filtervalue == 'filterByDate') {
          winForm.getForm().findField('filterDateName').setValue('All');
        }
      }
    }
  }
}, onreferralCloseFilterClk:function(btn) {
  var parentBtnRef = btn.reference.split('Cancel')[0], viewModel = this.getViewModel();
  var parentClassViewItms = Ext.ComponentQuery.query('jobreferralsfilterview')[0].items.items;
  parentClassViewItms.forEach(function(item, index) {
    if (index == 3 || index == 4 || index == 5) {
      if (item.items.items[0].reference == parentBtnRef) {
        item.hide();
        var removeFilterValue = index == 4 ? 'filterByLocation' : index == 5 ? 'filterByDepartment' : 'filterByDate';
        var dataview = Ext.ComponentQuery.query('jobopeningsreferralslistview')[0].down('dataview');
        var openingsView = Ext.ComponentQuery.query('jobopeningsreferralslistview')[0];
        var store = openingsView.getViewModel().getStore('jobReferralsDataViewStore');
        store.removeFilter(removeFilterValue);
        viewModel.set('filtervalue', removeFilterValue);
      }
    }
  });
}, onCloseFilterClkMyReferrals:function(btn) {
  var parentBtnRef = btn.reference.split('Cancel')[0], viewModel = this.getViewModel();
  var parentClassViewItms = Ext.ComponentQuery.query('jobopenigsmyreferralsfilterview')[0].items.items;
  parentClassViewItms.forEach(function(item, index) {
    if (index == 3 || index == 4 || index == 5) {
      if (item.items.items[0].reference == parentBtnRef) {
        item.hide();
        var removeFilterValue = index == 4 ? 'filterByLocation' : index == 5 ? 'filterByDepartment' : 'filterByDate';
        var getDataStore = Ext.ComponentQuery.query('jobopenigsmyreferralsview')[0].down('dataview');
        var openingsView = Ext.ComponentQuery.query('jobopenigsmyreferralsview')[0];
        var store = openingsView.getViewModel().getStore('jobapplicationsappliedstore');
        store.removeFilter(removeFilterValue);
        viewModel.set('filtervalue', removeFilterValue);
      }
    }
  });
}, onCancelBtnClick:function() {
  var uploadBtn = Ext.ComponentQuery.query('[reference \x3d referraluploadbtn]')[0], uploadField = Ext.ComponentQuery.query('[reference \x3d referralfileuploadref]')[0];
  uploadField.show();
  uploadBtn.setText('Choose File');
  uploadBtn.setIconCls('x-fa fa-upload');
  uploadField.fileInputEl.dom.value = '';
  Ext.ComponentQuery.query('[reference \x3d referraluploadlabelref]')[0].hide();
  Ext.ComponentQuery.query('[reference \x3d referraluploadhiddenbtnref]')[0].hide();
  this.lookupReference('referralsForm').getForm().reset();
}, buttonOnlyChange:function(field, value, eval, e, eOpts) {
  var me = this, viewModel = me.getViewModel(), file = field.fileInputEl.dom.files[0], fileValue = field.value, reader = new FileReader, format = file.type, fileExtension = file.name.split('.')[1], uploadField = Ext.ComponentQuery.query('[reference \x3d referralfileuploadref]')[0], referraluploadlabel = Ext.ComponentQuery.query('[reference \x3d referraluploadlabelref]')[0], referraluploadhiddenBtn = Ext.ComponentQuery.query('[reference \x3d referraluploadhiddenbtnref]')[0];
  reader.onload = function() {
    if (format == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || format == 'text/plain' || format == 'application/msword' || format == 'application/pdf' || format == 'application/doc' || format == 'application/docx' || format == 'application/txt' || format == 'application/wps' || format == 'application/odt' || format == 'application/vnd.oasis.opendocument.text' || format == 'application/wpd' || format == 'application/rtf' || fileExtension == 'docx' || fileExtension == 
    'doc') {
      rec = value.replace('C:\\fakepath\\', '');
      viewModel.set('resumePath2', rec);
      var uploadBtn = Ext.ComponentQuery.query('[reference \x3d referraluploadbtn]')[0];
      uploadBtn.setText(rec);
      uploadField.hide();
      referraluploadhiddenBtn.show();
      referraluploadlabel.show();
      referraluploadhiddenBtn.setText(rec);
      Ext.toast({html:'Your file uploaded successfully..!!', width:150, align:'t'});
    } else {
      Ext.toast({html:'Invalid Format', width:150, align:'t'});
    }
  };
  reader.readAsDataURL(file);
}, BackButtonClick:function() {
  if (window.sessionStorage.referrals_form_change == '1') {
    Ext.Msg.confirm('Confirm', 'Are you sure you want to go back?', function(btnText) {
      if (btnText === 'no') {
      } else {
        if (btnText === 'yes') {
          Ext.ComponentQuery.query('[reference \x3d jobreferralsreference]')[0].getLayout().setActiveItem('referralsList');
          var referralFileUpload = Ext.ComponentQuery.query('[reference \x3d referralfileuploadref]')[0];
          referralFileUpload.fileInputEl.dom.value = '';
          window.sessionStorage.referrals_form_change = '0';
        }
      }
    }, this);
  } else {
    Ext.ComponentQuery.query('[reference \x3d jobreferralsreference]')[0].getLayout().setActiveItem('referralsList');
    var referralFileUpload = Ext.ComponentQuery.query('[reference \x3d referralfileuploadref]')[0];
    referralFileUpload.fileInputEl.dom.value = '';
    window.sessionStorage.referrals_form_change = '0';
  }
  var tagPanel = Ext.ComponentQuery.query('jobreferralsfilterview'), tagPanelItm = tagPanel[0].items.items;
  tagPanelItm[3].hide();
  tagPanelItm[4].hide();
  tagPanelItm[5].hide();
  var getDataStore = Ext.ComponentQuery.query('jobopeningsreferralslistview')[0].down('dataview').getStore();
  getDataStore.removeFilter('filterByLocation');
  getDataStore.removeFilter('filterByDepartment');
  getDataStore.removeFilter('filterByDate');
}, onMyReferralsView:function(myreferrals, e, eOpts) {
  var params = {referred_BY:Ext.getStore('login').data.items[0].data.ddo_employee_id};
  var url = '/jobapplication';
  var method = 'GET';
  Ext.Ajax.request({url:url, method:method, scope:this, params:params, success:function(resp, b) {
    var res = Ext.decode(resp.responseText), msg = res.message;
    Ext.ComponentQuery.query('jobopenigsmyreferralsview')[0].items.items[1].store.loadRawData(JSON.parse(resp.responseText));
    Ext.ComponentQuery.query('[reference \x3d jobreferralsreference]')[0].getLayout().setActiveItem('myreferrals');
  }, failure:function(resp, b) {
    var data = Ext.decode(resp.responseText);
    Ext.toast(data.message, false, 't');
  }});
  var tagPanel = Ext.ComponentQuery.query('jobopenigsmyreferralsfilterview'), tagPanelItm = tagPanel[0].items.items;
  tagPanelItm[3].hide();
  tagPanelItm[4].hide();
  tagPanelItm[5].hide();
  var getDataStore = Ext.ComponentQuery.query('jobopenigsmyreferralsview')[0].down('dataview').getStore();
  getDataStore.removeFilter('filterByLocation');
  getDataStore.removeFilter('filterByDepartment');
  getDataStore.removeFilter('filterByDate');
  Ext.ComponentQuery.query('[reference \x3d jobreferralsreference]')[0].getLayout().setActiveItem('myreferrals');
}, onReferClick:function(btn, e, eOpts) {
  var view = this.getView(), form = view.down('form').getForm(), values = form.getValues(), me = this, refView = Ext.ComponentQuery.query('[reference \x3d jobreferralsreference]')[0], uploadBtn = Ext.ComponentQuery.query('[reference \x3d referraluploadbtn]')[0], viewModel = refView.getViewModel();
  var params = {referred_by:Ext.getStore('login').data.items[0].data.ddo_employee_id, firstName:values.firstname, lastName:values.lastname, emailId:values.email, mobile:parseInt(values.phone), Recommendation:values.recommendation, Relationship:values.combo, resumePath:this.getViewModel().data.resumePath, ddo_jobopening_id:viewModel.data.ddo_jobopening_id, ddo_jobapplicationstatus_id:1};
  var method = 'POST';
  var url = '/jobapplication';
  if (uploadBtn.text != 'Choose File') {
    btn.up('form').submit({url:'/jobapplication/uploadResume', waitMsg:'Uploading your file...', clientValidation:false, success:function() {
      var text = Ext.JSON.decode(arguments[1].response.responseText), resumePath = text.data, fakePath = viewModel.data.resumePath;
      rec = fakePath.replace('C:\\fakepath\\', '');
      viewModel.set('resumePath2', rec);
      viewModel.set('resumePath', '../' + resumePath);
      params.resumePath = viewModel.get('resumePath');
      params.resumename = viewModel.get('resumePath2');
      Ext.Ajax.request({url:url, method:method, scope:this, params:params, success:function(resp, b) {
        var res = Ext.decode(resp.responseText), msg = res.message, uploadBtn = Ext.ComponentQuery.query('[reference \x3d referraluploadbtn]')[0], uploadField = Ext.ComponentQuery.query('[reference \x3d referralfileuploadref]')[0];
        Ext.Msg.alert('success', msg);
        uploadField.show();
        uploadField.fileInputEl.dom.value = '';
        Ext.ComponentQuery.query('[reference \x3d referraluploadlabelref]')[0].hide();
        Ext.ComponentQuery.query('[reference \x3d referraluploadhiddenbtnref]')[0].hide();
        Ext.ComponentQuery.query('[reference \x3d referralsForm]')[0].getForm().reset();
        Ext.ComponentQuery.query('jobopenigsmyreferralsview')[0].items.items[1].store.add(params);
        me.onInterviewBackButtonClick();
      }, failure:function(resp, b) {
        var data = Ext.decode(resp.responseText);
        Ext.toast(data.message, false, 't');
      }});
    }, failure:function() {
      Ext.toast({html:'Record not created', width:150, align:'t'});
    }});
  } else {
    Ext.Ajax.request({url:url, method:method, scope:this, params:params, success:function(resp, b) {
      var res = Ext.decode(resp.responseText), msg = res.message, uploadBtn = Ext.ComponentQuery.query('[reference \x3d referraluploadbtn]')[0];
      Ext.Msg.alert('success', msg);
      uploadBtn.setText('Choose File');
      uploadBtn.setIconCls('x-fa fa-upload');
      Ext.ComponentQuery.query('[reference \x3d referralsForm]')[0].getForm().reset();
      Ext.ComponentQuery.query('jobopenigsmyreferralsview')[0].items.items[1].store.add(params);
      me.onInterviewBackButtonClick();
    }, failure:function(resp, b) {
      var data = Ext.decode(resp.responseText);
      Ext.toast(data.message, false, 't');
    }});
  }
}, onInterviewBackButtonClick:function(item) {
  Ext.Msg.confirm('Confirm', 'Job Referral Created Succesfully! Would you like to go back?', function(btnText) {
    if (btnText === 'no') {
    } else {
      if (btnText === 'yes') {
        var params = {referred_BY:Ext.getStore('login').data.items[0].data.ddo_employee_id};
        var url = '/jobapplication';
        var method = 'GET';
        Ext.Ajax.request({url:url, method:method, scope:this, params:params, success:function(resp, b) {
          var res = Ext.decode(resp.responseText), msg = res.message;
          Ext.ComponentQuery.query('[reference \x3d jobreferralsreference]')[0].getLayout().setActiveItem('myreferrals');
          Ext.ComponentQuery.query('jobopenigsmyreferralsview')[0].items.items[1].store.loadRawData(JSON.parse(resp.responseText));
        }, failure:function(resp, b) {
          var data = Ext.decode(resp.responseText);
          Ext.toast(data.message, false, 't');
        }});
      }
    }
  }, this);
}});
Ext.define('JobOpenings.view.referrals.filtertoolbar.JobMyReferralsFilter', {extend:'Ext.panel.Panel', xtype:'jobopenigsmyreferralsfilterview', requires:['JobOpenings.store.filtertoolbar.FilterbyStatus', 'JobOpenings.view.referrals.JobReferralsController', 'JobOpenings.view.jobapplications.JobApplicationsViewModel'], viewModel:{type:'jobapplicationsviewmodel'}, controller:'jobreferralscontroller', reference:'myreferralsfilterview', layout:{type:'hbox', width:'100%'}, cls:'filtertoolbar-cls', dockedItems:[{xtype:'toolbar', 
cls:'tooltip-cls', dock:'top', items:[{xtype:'button', scale:'medium', iconCls:'goalsbackbtn-cls', cls:'jobback-btn-cls', style:{border:0}, listeners:{click:'onBackClick'}}, {xtype:'label', html:'Back', cls:'backlabel-cls'}, {xtype:'label', html:'My Referrals', cls:'titlelabelMyreferrals-cls', margin:20}]}], items:[{xtype:'button', width:6, cls:'karmascore-search-icon-field job-search-icon', height:6, padding:'-8 11 14 12'}, {xtype:'textfield', width:'30%', reference:'jobsearchref_job_referrals', 
emptyText:'Search', enableKeyEvents:true, cls:'karmascore-search-field searchFields job-search-field', listeners:{keyup:'onKeyUpJobSearch'}}, {xtype:'button', cls:'filter-btncls', listeners:{click:'hideComboboxMyReferrals'}}, {items:[{xtype:'button', reference:'dateFilterBtn', cls:'filterBtnsCls'}, {xtype:'button', reference:'dateFilterBtnCancel', cls:'filterBtnsClsCancel', text:'x', listeners:{click:'onCloseFilterClkMyReferrals'}}], hidden:true}, {items:[{xtype:'button', reference:'locationFilterBtn', 
cls:'filterBtnsCls'}, {xtype:'button', reference:'locationFilterBtnCancel', cls:'filterBtnsClsCancel', text:'x', listeners:{click:'onCloseFilterClkMyReferrals'}}], hidden:true}, {items:[{xtype:'button', reference:'departmentFilterBtn', cls:'filterBtnsCls'}, {xtype:'button', reference:'departmentFilterBtnCancel', cls:'filterBtnsClsCancel', text:'x', listeners:{click:'onCloseFilterClkMyReferrals'}}], hidden:true}]});
Ext.define('JobOpenings.view.referrals.JobOpeningsMyReferralsView', {extend:'Ext.container.Container', xtype:'jobopenigsmyreferralsview', requires:['JobOpenings.view.referrals.filtertoolbar.JobMyReferralsFilter', 'JobOpenings.view.referrals.JobReferralsController', 'JobOpenings.view.jobapplications.JobApplicationsViewModel'], cls:'myreferrals-cls noscrollbar', reference:'jobmyreferralsview', viewModel:{type:'jobapplicationsviewmodel'}, controller:'jobreferralscontroller', items:[{xtype:'jobopenigsmyreferralsfilterview'}, 
{xtype:'dataview', reference:'jobmyreferralsdata', cls:'jobdataviewcls', emptyText:'\x3cdiv class\x3d"projects-emptytext-cls"\x3eNo Jobs available\x3c/div\x3e', itemTpl:['\x3cdiv class\x3d"my-referral-class-all-views"\x3e', '\x3cdiv class\x3d"jobsdiv-cls ddo-jobopening-item "\x3e', '\x3cdiv class\x3d"title-div-cls"\x3e\x3cspan class\x3d"title-cls"\x3e{appfirstname} {applastname}\x3c/span\x3e', '\x3ctpl if\x3d"this.showCurrentJobTitle(values)"\x3e', '\x3cspan\x3e | \x3c/span\x3e', '\x3cspan class\x3d"creator-cls"\x3e{title}\x3c/span\x3e', 
'\x3c/tpl\x3e', '\x3c/div\x3e', '\x3ctpl if\x3d"skillnames"\x3e', '\x3cdiv class\x3d"loc-exp-myreferrals"\x3e\x3ci class\x3d"skill-iconcls arrow-cls"\x3e\x3c/i\x3e{[this.showSkill(values)]}\x3c/div\x3e', '\x3c/tpl\x3e', '\x3cdiv class\x3d"loc-exp-myreferrals"\x3e', '\x3cspan\x3e\x3ci class\x3d"mobile-iconcls arrow-cls"\x3e\x3c/i\x3e\x26nbsp+91\x26nbsp{mobile} \x26nbsp \x26nbsp\x3c/span\x3e', '\x3cspan\x3e\x3ci class\x3d"mail-iconcls arrow-cls"\x3e\x3c/i\x3e\x26nbsp{emailid}\x3c/span\x3e', '\x3c/div\x3e', 
'\x3c/div\x3e', '\x3cdiv class\x3d"status-div-cls"\x3e\x3cdiv class\x3d"status-textcls"\x3eStatus: \x3cspan class\x3d"{job_status_name}" style\x3d"color:{colorcode};"\x3e{appstatus}\x3c/span\x3e\x3c/div\x3e', '\x3cdiv class\x3d"status-combo-cls"\x3e\x3ca href\x3d{resumepath} target\x3d"_blank" download\x3d{resumename} style\x3d"text-decoration: none;"\x3e\x3cspan class\x3d"download-cls"\x3eDownloadCV \x3ci class\x3d"download-iconcls arrow-cls"\x3e\x3c/i\x3e\x3c/span\x3e\x3c/a\x3e', '\x3c/div\x3e', 
'\x3c/div\x3e', '\x3c/div\x3e', {showSkill:function(values) {
  var skillStr = '';
  try {
    var skillsArr = values.skillnames;
    skillsArr.forEach(function(item, index) {
      skillStr += skillsArr.length - 1 != index ? '#' + item + ', ' : '#' + item;
    });
  } catch (exce) {
  }
  return skillStr;
}, showCurrentJobTitle:function(values) {
  var jobtitle = values.title;
  if (jobtitle === null) {
    return false;
  } else {
    return jobtitle;
  }
}}], itemSelector:'div.my-referral-class-all-views', listeners:{itemclick:'onJobOpeningClick'}}]});
Ext.define('JobOpenings.view.referrals.JobReferralsView', {extend:'Ext.panel.Panel', xtype:'jobreferralsfilterview', requires:['JobOpenings.store.filtertoolbar.FilterbyStatus', 'JobOpenings.view.jobopeningrequest.filtertoolbar.FilterViewModel', 'JobOpenings.view.referrals.JobReferralsController'], viewModel:{type:'filterviewmodel'}, controller:'jobreferralscontroller', reference:'referralsfilterview', layout:{type:'hbox', width:'100%'}, cls:'filtertoolbar-cls', items:[{xtype:'button', width:6, cls:'karmascore-search-icon-field job-search-icon', 
height:6, padding:'-8 11 14 12'}, {xtype:'textfield', width:'30%', reference:'jobsearchref_job_ref', enableKeyEvents:true, emptyText:'Search', cls:'karmascore-search-field searchFields job-search-field', listeners:{keyup:'onKeyUpJobSearch'}}, {xtype:'button', cls:'filter-btncls', listeners:{click:'hideCombobox'}}, {items:[{xtype:'button', reference:'dateFilterBtn', cls:'filterBtnsCls'}, {xtype:'button', reference:'dateFilterBtnCancel', cls:'filterBtnsClsCancel', text:'x', listeners:{click:'onreferralCloseFilterClk'}}], 
hidden:true}, {items:[{xtype:'button', reference:'locationFilterBtn', cls:'filterBtnsCls'}, {xtype:'button', reference:'locationFilterBtnCancel', cls:'filterBtnsClsCancel', text:'x', listeners:{click:'onreferralCloseFilterClk'}}], hidden:true}, {items:[{xtype:'button', reference:'departmentFilterBtn', cls:'filterBtnsCls'}, {xtype:'button', reference:'departmentFilterBtnCancel', cls:'filterBtnsClsCancel', text:'x', listeners:{click:'onreferralCloseFilterClk'}}], hidden:true}, {xtype:'tbfill'}, {xtype:'button', 
text:'My Referrals', width:132, height:40, textAlign:'center', cls:'myreferrals-btn-cls', listeners:{click:'onMyReferralsView'}}, {xtype:'tbspacer', width:19}]});
Ext.define('JobOpenings.view.referrals.JobOpeningsReferralsListView', {extend:'Ext.container.Container', xtype:'jobopeningsreferralslistview', requires:['JobOpenings.view.referrals.JobReferralsView', 'JobOpenings.view.jobopeningrequest.filtertoolbar.FilterViewModel', 'JobOpenings.view.referrals.JobReferralsController'], cls:'jobopening-cls noscrollbar', controller:'jobreferralscontroller', viewModel:{type:'filterviewmodel'}, reference:'referralslistview', items:[{xtype:'container', html:'\x3cdiv class\x3d "jobtitle-cls"\x3eJob Openings \x3c/div\x3e'}, 
{xtype:'jobreferralsfilterview'}, {xtype:'dataview', reference:'jobdataviewreferrals', cls:'jobdataviewcls', emptyText:'\x3cdiv class\x3d"projects-emptytext-cls"\x3eNo Jobs available\x3c/div\x3e', itemTpl:['\x3cdiv class\x3d"jobsdiv-cls ddo-jobopening-item"\x3e', '\x3cdiv class\x3d"title-div-cls" data-qtip\x3d"{title}-{department_name}"\x3e\x3cspan class\x3d"title-cls"\x3e{[this.showTitle(values,15)]}\x3c/span\x3e', '\x3cspan\x3e | \x3c/span\x3e', '\x3cspan class\x3d"creator-cls" data-qtip\x3d"{firstname}"\x3eCreated by {[this.showName(values,8)]}\x3c/span\x3e\x3c/div\x3e', 
'\x3cdiv class\x3d"positions-cls"\x3e( {count_status}/{noofpositions} ) Positions\x3c/div\x3e', '\x3cdiv class\x3d"loc-exp-referrals"\x3e\x3cspan\x3e\x3ci class\x3d"exp-iconcls arrow-cls"\x3e\x3c/i\x3e\x26nbsp{minworkexperience} - {maxworkexperience} Years Experience \x3c/span\x3e', '\x3cspan\x3e\x3ci class\x3d"location-iconcls arrow-cls"\x3e\x3c/i\x3e\x26nbsp{location_name}\x3c/span\x3e', '\x3c/div\x3e', '\x3cdiv class\x3d"skill-cls"\x3e\x3ci class\x3d"skill-iconcls arrow-cls"\x3e\x3c/i\x3e{[this.showSkill(values)]}\x3c/div\x3e', 
'\x3cdiv class\x3d"desc-cls"\x3e{[this.showDescription(values,100)]}\x3c/div\x3e', '\x3c/div\x3e', '\x3cdiv class\x3d"status-div-cls status-div-referrals-cls"\x3e', '\x3cdiv class\x3d"act-cls create-jobreferrals-btn-cls "\x3eRefer a Friend', '\x3c/div\x3e', '\x3c/div\x3e', '\x3c/div\x3e', {listRecruiter:function(values) {
  var lists = [];
  var jobOpeningsStore = Ext.getStore('jobopenings.JobRecruiter');
  if (jobOpeningsStore) {
    jobOpeningsStore.each(function(rec) {
      lists.push('\x3cli\x3e\x3ci class\x3d"checkImg"\x3e\x3c/i\x3e' + rec.get('recruiter_name') + '\x3c/li\x3e');
    });
  }
  var assignVisible = values.isAssignVisible ? 'act-showcls' : 'act-removecls';
  return '\x3cdiv class\x3d"rec-assigncls"\x3eAssign To \x3ci class\x3d"x-fa fa-sort-desc arrow-cls"\x3e\x3c/i\x3e\x3cdiv class\x3d"' + assignVisible + '"\x3e\x3cul\x3e' + lists.toString().replace(/,/g, '') + '\x3c/ul\x3e\x3c/div\x3e\x3c/div\x3e';
}, showDescription:function(values, limit) {
  var desc = values.job_desc;
  if (desc.length >= limit) {
    return '\x3cdiv style\x3d"text-overflow: ellipsis; white-space: nowrap; overflow: hidden; width:411px; height: 36px;"\x3e' + desc + '\x3c/div\x3e';
  } else {
    return desc;
  }
}, showTitle:function(values, limit) {
  var department = values.department_name;
  if (department == null || department == '') {
    department = '';
  } else {
    department = ' - ' + department;
  }
  var title = values.title + department;
  if (title.length >= limit) {
    return title.substring(0, 22) + '...';
  } else {
    return title;
  }
}, showName:function(values, limit) {
  var name = values.firstname;
  if (name.length >= limit) {
    return name.substring(0, 8) + '...';
  } else {
    return name;
  }
}, showSkill:function(values) {
  var skillStr = '';
  try {
    var skillsArr = values.skillnames;
    skillsArr.forEach(function(item, index) {
      skillStr += skillsArr.length - 1 != index ? '#' + item + ', ' : '#' + item;
    });
  } catch (exce) {
  }
  return skillStr;
}}], listeners:{itemclick:'onJobOpeningClick'}}]});
Ext.define('JobOpenings.view.referrals.ReferralsViewmodel', {extend:'Ext.app.ViewModel', alias:'viewmodel.referralviewmodel', data:{locationName:'', resumePath2:'Choose File'}, stores:{referralstore:{autoLoad:false, proxy:{type:'ajax', url:'jobapplication', reader:{type:'json', rootProperty:'data'}}}, referralcombostore:{autoLoad:true, proxy:{type:'ajax', url:'resources/data/jobapplications/referralcombo.json', reader:{type:'json', rootProperty:'data'}}}}});
Ext.define('JobOpenings.view.referrals.Referralsadd', {extend:'Ext.form.Panel', alias:'widget.referralsadd', requires:['JobOpenings.view.referrals.ReferralsViewmodel'], viewModel:{type:'referralviewmodel'}, cls:'form-cls apply-form', defaults:{width:'50%', labelAlign:'right', labelWidth:220, padding:5, labelStyle:'font-size:16px;'}, reference:'referralsForm', layout:{type:'vbox', align:'middle', pack:'center'}, title:'Employee Referral Form', buttonAlign:'center', items:[{xtype:'hiddenfield', name:'ddo_referral'}, 
{xtype:'hiddenfield', name:'ddo_jobopening_id'}, {xtype:'textfield', name:'firstname', fieldLabel:'First Name:', emptyCls:'referrals-empty-text', maskRe:/^[A-Za-z]*$/, emptyText:'Name', allowBlank:false, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'textfield', name:'lastname', fieldLabel:'Last Name:', emptyCls:'referrals-empty-text', maskRe:/^[A-Za-z]*$/, emptyText:'Last Name', allowBlank:false, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, 
{xtype:'textfield', name:'email', fieldLabel:'Email', emptyCls:'referrals-empty-text', emptyText:'Email ID', required:true, allowBlank:false, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e', vtype:'email'}, {xtype:'textfield', name:'phone', emptyText:'Phone', fieldLabel:'Phone:', emptyCls:'referrals-empty-text', maskRe:/^[0-9]*$/, required:true, minLength:10, maxLength:10, enforceMaxLength:true, allowBlank:false, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, 
{xtype:'combobox', name:'combo', reference:'referralcombo', queryMode:'local', displayField:'name', emptyText:'Eg:friend', editable:false, tpl:Ext.create('Ext.XTemplate', '\x3cul class\x3d"x-list-plain"\x3e\x3ctpl for\x3d"."\x3e', '\x3cli role\x3d"option" class\x3d"x-boundlist-item" style\x3d"text-align:center;"\x3e{name}\x3c/li\x3e', '\x3c/tpl\x3e\x3c/ul\x3e'), displayTpl:Ext.create('Ext.XTemplate', '\x3ctpl for\x3d"."\x3e', '{name}', '\x3c/tpl\x3e'), emptyCls:'referrals-empty-text', fieldLabel:'How do you know this person:'}, 
{xtype:'textfield', name:'recommendation', emptyCls:'referrals-empty-text', fieldLabel:'Recommendation:', emptyText:'Enter why WTT is good for Him/Her'}, {anchor:'100%', xtype:'fileuploadfield', opType:'upload', name:'appResume', iconCls:'upload-cls', reference:'referralfileuploadref', buttonOnly:true, listeners:{change:'buttonOnlyChange'}, bind:{value:'{resumePath}'}, buttonConfig:{cls:'upload-btn', width:'100%', iconCls:'x-fa fa-upload', iconAlign:'right', reference:'referraluploadbtn', name:'uploadid', 
id:'uploadid', bind:{text:'{resumePath2}'}}, fieldLabel:'Upload CV:'}, {xtype:'fieldcontainer', width:550, items:[{xtype:'label', text:'Upload CV:', reference:'referraluploadlabelref', hidden:true, cls:'uploadhiddenlabel-cls referrallabelCls', tpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'button', width:300, cls:'uploadeditbtn-cls', name:'uploadResumeHiddenBtn', reference:'referraluploadhiddenbtnref', iconCls:'x-fa fa-times', iconAlign:'right', 
hidden:true, bind:{text:'{resumePath2}'}, listeners:{btnIconEl:{click:function(btn) {
  var referralFileUpload = Ext.ComponentQuery.query('[reference \x3d referralfileuploadref]')[0], referralUploadBtn = Ext.ComponentQuery.query('[reference \x3d referraluploadbtn]')[0];
  referralFileUpload.show();
  referralUploadBtn.setText('Choose File');
  referralFileUpload.fileInputEl.dom.value = '';
  Ext.ComponentQuery.query('[reference \x3d referraluploadlabelref]')[0].hide();
  Ext.ComponentQuery.query('[reference \x3d referraluploadhiddenbtnref]')[0].hide();
}}}}]}], bbar:{cls:'jobform-cls', layout:{type:'hbox', align:'middle', pack:'center'}, items:[{xtype:'button', text:'Refer', width:200, disabledCls:'disable-btn', formBind:true, cls:'referral-margin', listeners:{click:'onReferClick'}}, {xtype:'button', text:'Cancel', cls:['require-btn', 'referral-click'], handler:'onCancelBtnClick'}]}});
Ext.define('JobOpenings.view.referrals.ReferralsMain', {extend:'Ext.panel.Panel', alias:'widget.referralsmain', requires:['JobOpenings.view.referrals.Referralsadd', 'JobOpenings.view.referrals.JobReferralsController', 'JobOpenings.view.referrals.ReferralsViewmodel'], viewModel:{type:'referralviewmodel'}, controller:'jobreferralscontroller', cls:'job-header', tools:[{xtype:'button', scale:'medium', iconCls:'goalsbackbtn-cls', cls:'jobback-btn-cls', style:{border:0}, listeners:{click:'BackButtonClick'}}, 
{xtype:'label', html:'Back', cls:'backlabel-cls'}, {xtype:'label', html:'Intern UI Development/Refer a friend', reference:'title_myreferralsCreationRef', cls:'titlelabel-cls', margin:20}], items:[{xtype:'referralsadd', id:'referralsform'}]});
Ext.define('JobOpenings.view.referrals.ReferralsFormView', {extend:'Ext.form.Panel', alias:'widget.referralsformview', requires:['JobOpenings.view.referrals.ReferralsViewmodel'], viewModel:{type:'referralviewmodel'}, cls:'form-cls apply-form', defaults:{width:'50%', labelAlign:'right', labelWidth:220, padding:5, labelStyle:'font-size:16px;'}, reference:'referralsformviewRef', layout:{type:'vbox', align:'middle', pack:'center'}, title:'Employee Referral Form', buttonAlign:'center', items:[{xtype:'textfield', 
name:'firstnameView', fieldLabel:'First Name:', readOnly:true, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'textfield', name:'lastnameView', fieldLabel:'Last Name:', readOnly:true, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'textfield', name:'emailView', fieldLabel:'Email', readOnly:true, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, 
{xtype:'textfield', name:'phoneView', fieldLabel:'Phone:', readOnly:true, afterLabelTextTpl:'\x3csup\x3e\x3cspan class\x3d"ta-mandatory-field-cls"\x3e*\x3c/span\x3e\x3c/sup\x3e'}, {xtype:'textfield', name:'comboView', readOnly:true, fieldLabel:'How do you know this person:'}, {xtype:'textfield', name:'recommendationView', readOnly:true, fieldLabel:'Recommendation:'}, {xtype:'fieldcontainer', defaults:{width:'100%', labelAlign:'right', labelWidth:220, padding:5, labelStyle:'font-size:16px;'}, items:[{anchor:'100%', 
xtype:'textfield', opType:'upload', name:'appResumeView', iconCls:'upload-cls', readOnly:true, fieldLabel:'Upload CV:'}]}]});
Ext.define('JobOpenings.view.referrals.ReferralsMainView', {extend:'Ext.panel.Panel', alias:'widget.referralsmainview', requires:['JobOpenings.view.referrals.ReferralsFormView', 'JobOpenings.view.referrals.JobReferralsController', 'JobOpenings.view.referrals.ReferralsViewmodel'], viewModel:{type:'referralviewmodel'}, controller:'jobreferralscontroller', cls:'job-header', tools:[{xtype:'button', scale:'medium', iconCls:'goalsbackbtn-cls', cls:'jobback-btn-cls', style:{border:0}, listeners:{click:function() {
  Ext.ComponentQuery.query('[reference \x3d jobreferralsreference]')[0].getLayout().setActiveItem(2);
}}}, {xtype:'label', html:'Back', cls:'backlabel-cls'}, {xtype:'label', html:'Intern UI Development/Refer a friend', reference:'referralTitleRef', cls:'titlelabel-cls', margin:20}], items:[{xtype:'referralsformview', id:'referralsviewformid'}]});
Ext.define('JobOpenings.view.referrals.JobOpeningsReferralsView', {extend:'Ext.container.Container', xtype:'jobopeningsreferralsview', requires:['JobOpenings.view.referrals.JobOpeningsReferralsListView', 'JobOpenings.view.jobopeningrequest.filtertoolbar.FilterViewModel', 'JobOpenings.view.referrals.JobOpeningsMyReferralsView', 'JobOpenings.view.referrals.JobReferralsController', 'JobOpenings.view.referrals.ReferralsMain', 'JobOpenings.view.referrals.ReferralsMainView', 'JobOpenings.view.jobopeningrequest.JobOpeningsFormDataViewMode'], 
layout:{type:'card', activeItem:0}, margin:'10 0 0 10', viewModel:{type:'filterviewmodel'}, controller:'jobreferralscontroller', reference:'jobreferralsreference', items:[{xtype:'jobopeningsreferralslistview', id:'referralsList'}, {xtype:'referralsmain', id:'referralMain'}, {xtype:'jobopenigsmyreferralsview', id:'myreferrals'}, {xtype:'referralsmainview', id:'myreferralsview'}, {xtype:'jobOpeningsFormDataViewMode'}]});
Ext.define('JobOpenings.view.referrals.filtertoolbar.JobMyReferralsFilterController', {extend:'Ext.app.ViewController', alias:'controller.jobmyreferralsfiltercontroller', onLocationSelect:function(combo, record, eOpts) {
  var store = combo.getStore(), fieldValue = combo.getSelection().data.ddo_joblocation_id, match = fieldValue;
}, onApplyBtnClickMyReferrals:function(btn, e, eOpts) {
  var form = this.getView(), locationValue = form.getValues().filterlocation, departmentValue = form.getValues().filterdepartment, dateValue = form.getValues().filterDateName, match = locationValue, listview = Ext.ComponentQuery.query('jobopenigsmyreferralsview'), dataview = listview[0].down('dataview[reference\x3d"jobmyreferralsdata"]'), dataviewStore = dataview.getStore(), window = form.up('window'), vm = this.getViewModel(), tagPanel = Ext.ComponentQuery.query('jobopenigsmyreferralsfilterview'), 
  tagPanelItm = tagPanel[0].items.items;
  tagPanelItm[3].hide();
  tagPanelItm[4].hide();
  tagPanelItm[5].hide();
  if (!Ext.isEmpty(locationValue) && locationValue != 'All') {
    dataviewStore.filter({property:'ddo_joblocation_id', id:'filterByLocation', anyMatch:true, caseSensitie:false, value:locationValue}, locationValue, false);
    tagPanelItm[4].show();
    var locRefText = this.getReferences().filtercomboref.getSelectedRecord().data.name;
    var textVal = locRefText.substring(0, 10);
    tagPanelItm[4].items.items[0].setText(textVal);
  } else {
    dataviewStore.removeFilter('filterByLocation');
  }
  if (!Ext.isEmpty(departmentValue) && departmentValue != 'All') {
    dataviewStore.filter({property:'ddo_department_id', id:'filterByDepartment', anyMatch:true, caseSensitie:false, value:departmentValue}, departmentValue, false);
    tagPanelItm[5].show();
    var depRefText = this.getReferences().deptcomboref.getSelectedRecord().data.name;
    var textVal = depRefText.substring(0, 10);
    tagPanelItm[5].items.items[0].setText(textVal);
  } else {
    dataviewStore.removeFilter('filterByDepartment');
  }
  if (!Ext.isEmpty(dateValue) && dateValue != 'All') {
    var days = null;
    if (dateValue == 'Past 24 HR') {
      days = 1;
    }
    if (dateValue == 'Past Week') {
      days = 7;
    }
    if (dateValue == 'Custom Range') {
      var customRangeDate = this.getReferences().customDateRef.value;
      if (customRangeDate != null || customRangeDate != undefined) {
        var oneDay = 24 * 60 * 60 * 1000;
        var firstDate = new Date(customRangeDate);
        var secondDate = new Date;
        days = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
      } else {
        return;
      }
    }
    dataviewStore.filter({property:'jobupdateddate', id:'filterByDate', anyMatch:true, caseSensitie:false, value:dateValue, filterFn:function(record) {
      var date = new Date;
      var last = new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
      return new Date(record.data.jobupdateddate) >= last && new Date(record.data.jobupdateddate) <= new Date;
    }}, dateValue, false);
    tagPanelItm[3].show();
    if (dateValue != 'Custom Range') {
      var textVal = dateValue.substring(0, 10);
    } else {
      var dateRefText = Ext.Date.format(new Date(this.getReferences().customDateRef.value), 'd/m/y'), textVal = dateRefText.substring(0, 10);
    }
    tagPanelItm[3].items.items[0].setText(textVal);
  } else {
    dataviewStore.removeFilter('filterByDate');
  }
  window.close();
}, onFilterDateSelect:function(combo, record, eOpts) {
  var store = combo.getStore(), fieldValue = combo.getSelection().data.name;
  if (fieldValue == 'Custom Range') {
    this.getReferences().customDateRef.show();
  } else {
    this.getReferences().customDateRef.hide();
  }
}});
Ext.define('JobOpenings.view.referrals.filtertoolbar.JobMyReferralsFilterComboboxes', {extend:'Ext.form.Panel', xtype:'jobmyreferralsfiltercomboboxes', requires:['JobOpenings.store.filtertoolbar.JobOpeningsDateStore', 'JobOpenings.store.form.LocationStore', 'JobOpenings.view.referrals.filtertoolbar.JobMyReferralsFilterController', 'JobOpenings.view.jobopeningrequest.filtertoolbar.FilterViewModel'], viewModel:'filterviewmodel', controller:'jobmyreferralsfiltercontroller', layout:'column', items:[{columnWidth:0.5, 
items:[{layout:{type:'vbox'}, items:[{xtype:'combobox', reference:'filterdate', name:'filterDateName', labelAlign:'top', tpl:Ext.create('Ext.XTemplate', '\x3cul class\x3d"x-list-plain"\x3e\x3ctpl for\x3d"."\x3e', '\x3cli role\x3d"option" class\x3d"x-boundlist-item" style\x3d"text-align:center;"\x3e{name}\x3c/li\x3e', '\x3c/tpl\x3e\x3c/ul\x3e'), displayTpl:Ext.create('Ext.XTemplate', '\x3ctpl for\x3d"."\x3e', '{name}', '\x3c/tpl\x3e'), fieldLabel:'Filter by Date', margin:'10 0 0 90', cls:'requestCombo-cls', 
queryMode:'local', displayField:'name', valueField:'name', value:'All', editable:false, store:Ext.create('JobOpenings.store.filtertoolbar.JobOpeningsDateStore'), autoLoadOnValue:true, listeners:{select:'onFilterDateSelect'}}, {xtype:'combobox', labelAlign:'top', name:'filterdepartment', reference:'deptcomboref', tpl:Ext.create('Ext.XTemplate', '\x3cul class\x3d"x-list-plain"\x3e\x3ctpl for\x3d"."\x3e', '\x3cli role\x3d"option" class\x3d"x-boundlist-item" style\x3d"text-align:center;"\x3e{name}\x3c/li\x3e', 
'\x3c/tpl\x3e\x3c/ul\x3e'), displayTpl:Ext.create('Ext.XTemplate', '\x3ctpl for\x3d"."\x3e', '{name}', '\x3c/tpl\x3e'), fieldLabel:'Filter by Department', cls:'requestCombo-cls', margin:'10 0 0 90', queryMode:'local', displayField:'name', editable:false, valueField:'ddo_department_id', value:'All', autoLoadOnValue:true}]}]}, {columnWidth:0.5, items:[{layout:{type:'vbox'}, items:[{fieldLabel:'Custom Date', labelAlign:'top', xtype:'datefield', cls:'requestCombo-cls', name:'filterCustomDate', reference:'customDateRef', 
margin:'10 90 0 0', editable:false, allowBlank:false, maxValue:new Date, hidden:true}, {xtype:'combobox', labelAlign:'top', cls:'requestCombo-cls', name:'filterlocation', reference:'filtercomboref', tpl:Ext.create('Ext.XTemplate', '\x3cul class\x3d"x-list-plain"\x3e\x3ctpl for\x3d"."\x3e', '\x3cli role\x3d"option" class\x3d"x-boundlist-item" style\x3d"text-align:center;"\x3e{name}\x3c/li\x3e', '\x3c/tpl\x3e\x3c/ul\x3e'), displayTpl:Ext.create('Ext.XTemplate', '\x3ctpl for\x3d"."\x3e', '{name}', '\x3c/tpl\x3e'), 
fieldLabel:'Filter by Location', margin:'10 90 0 0', queryMode:'local', displayField:'name', valueField:'ddo_joblocation_id', value:'All', editable:false, autoLoadOnValue:true, listeners:{select:'onLocationSelect'}}]}]}], dockedItems:[{xtype:'toolbar', width:'100%', margin:'0 0 30 0', dock:'bottom', items:[{xtype:'tbfill'}, {xtype:'button', text:'Apply', width:150, cls:'filter-submit-btn', listeners:{click:'onApplyBtnClickMyReferrals'}}, {xtype:'tbfill'}]}]});
Ext.define('JobOpenings.view.referrals.filtertoolbar.JobMyReferralsAddfilterWindow', {extend:'Ext.window.Window', xtype:'jobmyreferralsaddfilterwindow', requires:['JobOpenings.view.referrals.filtertoolbar.JobMyReferralsFilterComboboxes'], title:'Add Filter', modal:true, height:300, width:620, margin:'5 50 0 0', layout:{type:'fit'}, closeAction:'hide', reference:'filtermyreferwinref', resizable:false, cls:'ddo-filter-window', title:'Add Filters', initComponent:function() {
  var me = this;
  me.callParent(arguments);
  me.mon(Ext.getBody(), 'click', function(el, e) {
    me.close(me.closeAction);
  }, me, {delegate:'.x-mask'});
}, items:[{xtype:'jobmyreferralsfiltercomboboxes'}]});
