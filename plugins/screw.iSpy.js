Screw.Matchers.spyOn = function(obj, methodName) {
  return iSpy.spyOn(obj, methodName);
};

Screw.Matchers.be_called = {
  match: function(expected, actual) {
    return (actual && actual.isSpy && actual.wasCalled);
  },

  failure_message: function(expected, actual, not) {
    if (!actual || !actual.isSpy) {
      return 'Expected a spy, but got ' + actual + '.';
    }
    if (not && actual.wasCalled) {
        return 'Expected spy "' + actual.identity + '" to not have been called, but it was.';
    } else {
      return 'Expected spy "' + actual.identity + '" to have been called, but it was not.';
    }
  }
};

(function($) {
  $(Screw).bind("before", function() {
    function removeAllSpies() {
      iSpy.removeAllSpies();
    }

    $('.it').bind('passed', function() {
      removeAllSpies();
    });
    $('.it').bind('failed', function() {
      removeAllSpies();
    });
  });
})(jQuery);
