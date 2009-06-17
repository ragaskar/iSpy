Screw.Matchers.spyOn = function(obj, methodName) {
  return iSpy.spyOn(obj, methodName);
};

Screw.Matchers.be_called = {
  match: function(expected, actual) {
    console.debug(arguments);
    return (this.actual && this.actual.isSpy && this.actual.wasCalled);
  },

  failure_message: function(expected, actual, not) {
    if (!this.actual || !this.actual.isSpy) {
      return 'Expected a spy, but got ' + actual + '.';
    }
    if (!actual.wasCalled) {
      return 'Expected spy "' + this.actual.identity + '" to have been called, but it was not.';
    }
    return 'mystery fail!!!!';
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
