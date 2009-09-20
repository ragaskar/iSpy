iSpy = {
  spies_: []
};

iSpy.createSpy = function(name) {
  var spyObj = function() {
    spyObj.wasCalled = true;
    spyObj.callCount++;
    var args = iSpy.util.argsToArray(arguments);
    spyObj.mostRecentCall = {
      object: this,
      args: args
    };
    spyObj.calls.push({object: this, args: args});
    return spyObj.plan.apply(this, arguments);
  };

  spyObj.identity = name || 'unknown';
  spyObj.isSpy = true;

  spyObj.plan = function() {
  };

  spyObj.andCallThrough = function() {
    spyObj.plan = spyObj.originalValue;
    return spyObj;
  };
  spyObj.andReturn = function(value) {
    spyObj.plan = function() {
      return value;
    };
    return spyObj;
  };
  spyObj.andThrow = function(exceptionMsg) {
    spyObj.plan = function() {
      throw exceptionMsg;
    };
    return spyObj;
  };
  spyObj.andCallFake = function(fakeFunc) {
    spyObj.plan = fakeFunc;
    return spyObj;
  };
  spyObj.reset = function() {
    spyObj.wasCalled = false;
    spyObj.callCount = 0;
    spyObj.mostRecentCall = {};
    spyObj.calls = [];
  };
  spyObj.reset();

  return spyObj;
};

iSpy.createSpyObj = function(baseName, methodNames) {
  var obj = {};
  for (var i = 0; i < methodNames.length; i++) {
    obj[methodNames[i]] = iSpy.createSpy(baseName + '.' + methodNames[i]);
  }
  return obj;
};

iSpy.spyOn = function(obj, methodName) {
  if (obj == undefined) {
    throw "spyOn could not find an object to spy upon for " + methodName + "()";
  }

  if (obj[methodName] === undefined) {
    throw methodName + '() method does not exist';
  }

  if (obj[methodName] && obj[methodName].isSpy) {
    throw new Error(methodName + ' has already been spied upon');
  }

  var spyObj = iSpy.createSpy(methodName);

  iSpy.spies_.push(spyObj);
  spyObj.baseObj = obj;
  spyObj.methodName = methodName;
  spyObj.originalValue = obj[methodName];

  obj[methodName] = spyObj;

  return spyObj;
};

iSpy.removeAllSpies = function() {
  for (var i = 0; i < iSpy.spies_.length; i++) {
    var spy = iSpy.spies_[i];
    spy.baseObj[spy.methodName] = spy.originalValue;
  }
  iSpy.spies_ = [];
};

iSpy.util = {};

iSpy.util.argsToArray = function(args) {
  var array = [];
  for (var i =0; i < args.length; i++) {
    array.push(args[i]);
  }
  return array;
};

iSpy.util.contains_ = function(haystack, needle) {
  if (iSpy.util.isArray_(haystack)) {
    for (var i = 0; i < haystack.length; i++) {
      if (Screw.Matchers.equal.match(haystack[i], needle)) return true;
    }
    return false;
  }
  return haystack.indexOf(needle) >= 0;
};

iSpy.util.isArray_ = function(value) {
  return value &&
         typeof value === 'object' &&
         typeof value.length === 'number' &&
         typeof value.splice === 'function' &&
         !(value.propertyIsEnumerable('length'));
};