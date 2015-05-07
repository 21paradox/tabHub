describe('test tabHub for only one page', function () {

    var hub;

    beforeEach(function () {
        // use a clean state
       localStorage.clear();
    });

    afterEach(function () {
        // clean all events
        $(window).off();
        hub = null;
    });

    it('should normally run the callbacks', function (done) {

        var count = 0;

        hub = tabHub('myVal', function (emit) {

            count += 1;
            setTimeout(function () {

                emit('myOut');

                expect(count).toBe(1);
                expect(localStorage.getItem('myVal')).toBe('data:myOut');

                expect(spy).toHaveBeenCalledWith('myOut');
                expect(spy.calls.count()).toBe(1);
                done();

            }, 40);

        });

        var spy = jasmine.createSpy('spy');
        hub.onValue(spy);
    });


    it('should work well with two instance', function (done) {

        var count1 = 0;
        var def1 = $.Deferred();
        var def2 = $.Deferred();

        hub1 = tabHub('myVal1', function (emit) {
            count1 += 1;
            setTimeout(function () {

                emit('myOut1');

                expect(count1).toBe(1);
                expect(localStorage.getItem('myVal1')).toBe('data:myOut1');

                expect(spy1).toHaveBeenCalledWith('myOut1');
                expect(spy1.calls.count()).toBe(1);
                def1.resolve();

            }, 40);
        });

        var spy1 = jasmine.createSpy();
        hub1.onValue(spy1);

        var count2 = 0;

        hub2 = tabHub('myVal2', function (emit) {

            count2 += 1;
            setTimeout(function () {

                emit('myOut2');

                expect(count2).toBe(1);
                expect(localStorage.getItem('myVal2')).toBe('data:myOut2');

                expect(spy2).toHaveBeenCalledWith('myOut2');
                expect(spy2.calls.count()).toBe(1);
                def2.resolve();

            }, 40);

        });

        var spy2 = jasmine.createSpy();
        hub2.onValue(spy2);

        $.when(def1, def2)

        .done(function () {
            done();
        });

    });


    it('should work well with multiple emits(async)', function (done) {

        var count1 = 0;

        hub1 = tabHub('myVal1', function (emit) {
            count1 += 1;

            setTimeout(function () {
                emit('myOut1');

                setTimeout(function () {
                    emit('myOute')

                    expect(count1).toBe(1);
                    expect(localStorage.getItem('myVal1')).toBe('data:myOute');

                    expect(spy).toHaveBeenCalledWith('myOut1');
                    expect(spy).toHaveBeenCalledWith('myOute');
                    expect(spy.calls.count()).toBe(2);

                    done();
                }, 10);

            });

            var spy = jasmine.createSpy();
            hub1.onValue(spy);

        });
    });


    it('should work well with multiple emits(sync)', function (done) {

        var count1 = 0;
        hub1 = tabHub('myVal1', function (emit) {

            count1 += 1;

            emit('myOut1');
            emit('myOute')

            expect(count1).toBe(1);
            expect(localStorage.getItem('myVal1')).toBe('data:myOute');

            expect(spy).toHaveBeenCalledWith('myOut1');
            expect(spy).toHaveBeenCalledWith('myOute');
            expect(spy.calls.count()).toBe(2);

            done();
        });

        var spy = jasmine.createSpy();
        hub1.onValue(spy);
    });




});