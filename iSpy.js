iSpy = {
  spies_: []
};

iSpy.createSpy = function(name) {
  var spyObj = function() {
    spyObj.wasCalled = true;
    spyObj.callCount++;
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push = arguments[i];
    }
    spyObj.mostRecentCall = {
      object: this,
      args: args
    };
    spyObj.argsForCall.push(args);
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
    spyObj.argsForCall = [];
    spyObj.mostRecentCall = {};
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
