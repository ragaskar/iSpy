iSpy is a port of [Jasmine's](http://github.com/pivotal/jasmine) spies for ScrewUnit

Basic usage (if you've placed iSpy in /public/javascripts/iSpy):

    require('/javascripts/iSpy/lib/iSpy');
    require('/javascripts/iSpy/plugins/screw.iSpy');

    Screw.Unit(function () {
      describe('Basic Example', function() {
        it('should replace the specified function with a spy object', function() {
          var TestClass = {
            someFunction: function() {
              originalFunctionWasCalled = true;
            }
          };
          spyOn(TestClass, 'someFunction');

          expect(TestClass.someFunction).to_not(have_been_called);
          expect(TestClass.someFunction.callCount).to(equal, 0);
          TestClass.someFunction('foo');
          expect(TestClass.someFunction).to(have_been_called);
          expect(TestClass.someFunction.callCount).to(equal, 1);
          expect(TestClass.someFunction.mostRecentCall.args).to(equal, ['foo']);
          expect(TestClass.someFunction.mostRecentCall.object).to(equal, TestClass);

          TestClass.someFunction('bar');
          expect(TestClass.someFunction.callCount).to(equal, 2);
          expect(TestClass.someFunction.mostRecentCall.args).to(equal, ['bar']);
        });
      });
    });

Thanks go to Christian Williams for writing the original version of spies for Jasmine.