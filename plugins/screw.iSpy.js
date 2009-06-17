Screw.Matchers.spyOn = function(obj, methodName) {
  return iSpy.spyOn(obj, methodName);
};

(function($) {
  $(Screw).bind("before", function(){
    function removeAllSpies() {
      iSpy.removeAllSpies();
    }

    $('.it').bind('passed', function(){ removeAllSpies(); });
    $('.it').bind('failed', function(){ removeAllSpies(); });
  });
})(jQuery);
