Screw.Matchers.spyOn = function(obj, methodName) {
  return iSpy.spyOn(obj, methodName);
};

Screw.Matchers.have_been_called = {
  match: function(expected, actual) {
    return (actual && actual.isSpy && actual.wasCalled);
  },

  failure_message: function(expected, actual, not) {
    if (!actual || !actual.isSpy) {
      return 'Expected a spy, but got ' + $.print(actual) + '.';
    }
    if (not && actual.wasCalled) {
      return 'Expected spy "' + actual.identity + '" to not have been called, but it was.';
    } else {
      return 'Expected spy "' + actual.identity + '" to have been called, but it was not.';
    }
  }
};

Screw.Matchers.have_been_called_with = {
  match: function(expected, actual) {
    console.log(expected)
    if (!jQuery.isArray(expected)) {
      throw('You called have_been_called_with without an array as the expected argument. Expected should be an array of arguments you expect to recieve.');
    }
    if (actual && actual.isSpy && actual.wasCalled) {
      return iSpy.util.contains_(actual.calls.map(function(call) {return call.args;}), expected);
    }
  },

  failure_message: function(expected, actual, not) {
    if (!actual || !actual.isSpy) {
      return 'Expected a spy, but got ' + $.print(actual) + '.';
    }

    if (not && actual.wasCalled) {
      return 'Expected spy "' + actual.identity + '" to not have been called with ' + $.print(expected) + ', but it was.';
    } else if (!actual.wasCalled) {
      return 'Expected spy "' + actual.identity + '" to have been called with ' + $.print(expected) + ', but it was not called.';
    } else {
      return 'Expected spy "' + actual.identity + '" to have been called with ' + $.print(expected) + ', but it was called ' + actual.calls.length + ' times  with ' + $.print(actual.calls.map(function(call) {return call.args;}));
    }
  }
};

Screw.Unit(function(screw) {
  with (screw) {
    after(function() {
      iSpy.removeAllSpies();
    });
  }
});