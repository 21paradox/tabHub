﻿describe('test tabHub for only one page', function () {

    var IE8 = 'onstorage' in document;

    beforeEach(function () {
        // use a clean state
        localStorage.clear();
        window.myVal_spec2 = null;

    });

    afterEach(function () {
        // clean all events
        $(window).off();
        //$('iframe').remove();
        //hub = null

    });

    if (!IE8) {

        // ie8 cannot spyon ifram object
        it('firstEnter main page, then iframe(iframe should not call), iframe emit mainpage getData', function (done) {

            var spy = jasmine.createSpy('spy');
            var spy1 = jasmine.createSpy('onceCb');

            fakeobj.noop = spy;
            fakeobj.onceCb = spy1;

            setTimeout(function () {

                expect(spy1).toHaveBeenCalled();

                hub.emit('asd');

                expect(spy).toHaveBeenCalledWith(
                    'asd',
                    'spec2_main'
                    );

                var $iframe = $('<iframe src="spec/tabHub_spec2_iframe.html"></iframe>');

                $('body').append($iframe);

                var childWindow = $iframe[0].contentWindow;

                childWindow.fakeobj = {};
                var spy3 = jasmine.createSpy('spy3');
                var spy4 = jasmine.createSpy('onceCb1');

                childWindow.fakeobj.noop = spy3;
                childWindow.fakeobj.onceCb = spy4;

                $iframe.on('load', function () {

                    setTimeout(function () {

                        expect(spy3).toHaveBeenCalledWith(
                            'asd',
                            'spec2_iframe'
                            );


                        expect(spy4).not.toHaveBeenCalled();

                        expect(childWindow.hubCount).toBe(0);
                

                        // setTimeout(function () {

                        childWindow.hub.emit('ddd');

                        setTimeout(function () {

                            expect(spy).toHaveBeenCalledWith(
                                'ddd',
                                'spec2_main'
                                );

                            //                            expect(spy3).toHaveBeenCalledWith(
                            //                                'ddd',
                            //                                'spec2_iframe'
                            //                            );



                            done();

                        }, 50);
                        //});

                    }, 110);

                });

            }, 110);

        });

    } else {

        it('firstEnter main page, then iframe(iframe should not call), iframe emit mainpage getData', function (done) {

            var spy = jasmine.createSpy('spy');
            var spy1 = jasmine.createSpy('onceCb');

            fakeobj.noop = spy;
            fakeobj.onceCb = spy1;

            setTimeout(function () {

                expect(spy1).toHaveBeenCalled();

                hub.emit('asd');

                expect(spy).toHaveBeenCalledWith(
                    'asd',
                    'spec2_main'
                    );

                var $iframe = $('<iframe src="spec/tabHub_spec2_iframe.html"></iframe>');

                $('body').append($iframe);

                var childWindow = $iframe[0].contentWindow;

                $iframe.on('load', function () {

                    setTimeout(function () {

                        expect(childWindow.onValueCount).toBe(1);
                        expect(childWindow.hubCount).toBe(0);

                        childWindow.hub.emit('ddd');

                        setTimeout(function () {

                            expect(spy).toHaveBeenCalledWith(
                                'ddd',
                                'spec2_main'
                                );

                            done();

                        }, 50);


                    }, 110);

                });

            }, 110);

        });

    }



});