Screw.Unit(function () {
  describe('base spy tests', function() {
    it('should replace the specified function with a spy object', function() {
      var originalFunctionWasCalled = false;
      var TestClass = {
        someFunction: function() {
          originalFunctionWasCalled = true;
        }
      };
      spyOn(TestClass, 'someFunction');

      expect(TestClass.someFunction.wasCalled).to(equal, false);
      expect(TestClass.someFunction.callCount).to(equal, 0);
      TestClass.someFunction('foo');
      expect(TestClass.someFunction.wasCalled).to(equal, true);
      expect(TestClass.someFunction.callCount).to(equal, 1);
      expect(TestClass.someFunction.mostRecentCall.args).to(equal, ['foo']);
      expect(TestClass.someFunction.mostRecentCall.object).to(equal, TestClass);
      expect(originalFunctionWasCalled).to(equal, false);

      TestClass.someFunction('bar');
      expect(TestClass.someFunction.callCount).to(equal, 2);
      expect(TestClass.someFunction.mostRecentCall.args).to(equal, ['bar']);
    });

    it('should allow you to view args for a particular call', function() {
      var originalFunctionWasCalled = false;
      var TestClass = {
        someFunction: function() {
          originalFunctionWasCalled = true;
        }
      };
      spyOn(TestClass, 'someFunction');

      TestClass.someFunction('foo');
      TestClass.someFunction('bar');
      expect(TestClass.someFunction.argsForCall[0]).to(equal, ['foo']);
      expect(TestClass.someFunction.argsForCall[1]).to(equal, ['bar']);
      expect(TestClass.someFunction.mostRecentCall.args).to(equal, ['bar']);
    });

    it('should be possible to call through to the original method, or return a specific result', function() {
      var originalFunctionWasCalled = false;
      var passedArgs;
      var passedObj;
      var TestClass = {
        someFunction: function() {
          originalFunctionWasCalled = true;
          passedArgs = arguments;
          passedObj = this;
          return "return value from original function";
        }
      };

      spyOn(TestClass, 'someFunction').andCallThrough();
      var result = TestClass.someFunction('arg1', 'arg2');
      expect(result).to(equal, "return value from original function");
      expect(originalFunctionWasCalled).to(equal, true);
      expect(passedArgs).to(equal, ['arg1', 'arg2']);
      expect(passedObj).to(equal, TestClass);
      expect(TestClass.someFunction.wasCalled).to(equal, true);
    });

    it('should be possible to return a specific value', function() {
      var originalFunctionWasCalled = false;
      var TestClass = {
        someFunction: function() {
          originalFunctionWasCalled = true;
          return "return value from original function";
        }
      };

      spyOn(TestClass, 'someFunction').andReturn("some value");
      originalFunctionWasCalled = false;
      var result = TestClass.someFunction('arg1', 'arg2');
      expect(result).to(equal, "some value");
      expect(originalFunctionWasCalled).to(equal, false);
    });

    it('should be possible to throw a specific error', function() {
      var originalFunctionWasCalled = false;
      var TestClass = {
        someFunction: function() {
          originalFunctionWasCalled = true;
          return "return value from original function";
        }
      };

      spyOn(TestClass, 'someFunction').andThrow(new Error('fake error'));
      var exception;
      try {
        TestClass.someFunction('arg1', 'arg2');
      } catch (e) {
        exception = e;
      }
      expect(exception.message).to(equal, 'fake error');
      expect(originalFunctionWasCalled).to(equal, false);
    });

    it('should be possible to call a specified function', function() {
      var originalFunctionWasCalled = false;
      var fakeFunctionWasCalled = false;
      var passedArgs;
      var passedObj;
      var TestClass = {
        someFunction: function() {
          originalFunctionWasCalled = true;
          return "return value from original function";
        }
      };

      spyOn(TestClass, 'someFunction').andCallFake(function() {
        fakeFunctionWasCalled = true;
        passedArgs = arguments;
        passedObj = this;
        return "return value from fake function";
      });

      var result = TestClass.someFunction('arg1', 'arg2');
      expect(result).to(equal, "return value from fake function");
      expect(originalFunctionWasCalled).to(equal, false);
      expect(fakeFunctionWasCalled).to(equal, true);
      expect(passedArgs).to(equal, ['arg1', 'arg2']);
      expect(passedObj).to(equal, TestClass);
      expect(TestClass.someFunction.wasCalled).to(equal, true);
    });

    it('is torn down when this.removeAllSpies is called', function() {
      var originalFunctionWasCalled = false;
      var TestClass = {
        someFunction: function() {
          originalFunctionWasCalled = true;
        }
      };
      spyOn(TestClass, 'someFunction');

      TestClass.someFunction('foo');
      expect(originalFunctionWasCalled).to(equal, false);

      iSpy.removeAllSpies();

      TestClass.someFunction('foo');
      expect(originalFunctionWasCalled).to(equal, true);
    });

    describe('wonderfully hacky way to test our after behavior because of SU limitations', function () {
      var originalRemoveAllSpies;
      var iSpyRemoveAllSpiesWasCalled = false;

      it('calls removeAllSpies during spec finish', function() {
        originalRemoveAllSpies = iSpy.removeAllSpies;
        iSpy.removeAllSpies = function () {
          iSpyRemoveAllSpiesWasCalled = true;
        };
      });

      it('calls removeAllSpies during spec finish', function() {
        expect(iSpyRemoveAllSpiesWasCalled).to(equal, true);
        iSpy.removeAllSpies = originalRemoveAllSpies;

      });

    });

    it('throws an exception when some method is spied on twice', function() {
      var TestClass = { someFunction: function() {
      } };
      spyOn(TestClass, 'someFunction');
      var exception;
      try {
        spyOn(TestClass, 'someFunction');
      } catch (e) {
        exception = e;
      }
      expect(exception).to_not(be_undefined);
    });

    it('should be able to reset a spy', function() {
      var TestClass = { someFunction: function() {
      } };
      spyOn(TestClass, 'someFunction');

      expect(TestClass.someFunction).to_not(have_been_called);
      TestClass.someFunction();
      expect(TestClass.someFunction).to(have_been_called);
      TestClass.someFunction.reset();
      expect(TestClass.someFunction).to_not(have_been_called);
      expect(TestClass.someFunction.callCount).to(equal, 0);
    });

    it("should create an object with a bunch of spy methods when you call iSpy.createSpyObj()", function() {
      var spyObj = iSpy.createSpyObj('BaseName', ['method1', 'method2']);
      expect(spyObj.method1.identity).to(equal, 'BaseName.method1');
      expect(spyObj.method2.identity).to(equal, 'BaseName.method2');
    });

    it("have_been_called_with should succeed if the matcher has ever been called with the passed arguments", function() {
      var spy = iSpy.createSpy('example Spy');
      spy('grault');
      expect(spy).to(have_been_called_with, ['grault']);
      spy('foo', ['bar', 2], {baz: 'quux'});
      expect(spy).to(have_been_called_with, 'foo', ['bar', 2], {baz: 'quux'});
    });

    it("have_been_called_with should fail if the matcher has never been called with the passed arguments", function() {
      var spy = iSpy.createSpy('example Spy');
      spy('grault');
      expect(spy).to_not(have_been_called_with, ['foo']);
      spy('foo', ['bar', 2], {baz: 'quux'});
      expect(spy).to_not(have_been_called_with, ['foo', ['bar', 2], {baz: 'baz'}]);
    });

  });
});

