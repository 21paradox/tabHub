﻿describe('test tabHub for only one page', function () {

    var IE8 = 'onstorage' in document;

    beforeEach(function () {
        // use a clean state
        localStorage.clear();
    });

    afterEach(function () {
        // clean all events
        $(window).off();
        //$('iframe').remove();
        //hub = null;
    });

    it('firstEnter main page, then iframe(iframe should not call), iframe emit mainpage getData', function (done) {

        var spy = jasmine.createSpy('spy');
        var spy1 = jasmine.createSpy('spy1');

        //hub.noop = spy;
        //hub1.noop = spy1;
        
        fakeobj.noop = spy;
        fakeobj1.noop = spy1;

        hub.emit('asd');
        hub1.emit('bsd');

        setTimeout(function () {

            expect(spy).toHaveBeenCalledWith(
                'asd',
                'spec2_main'
                );

            expect(spy1).toHaveBeenCalledWith(
                'bsd',
                'spec2_main'
                );


            var $iframe = $('<iframe src="spec/tabHub_spec2_iframe_multiInstance.html"></iframe>');

            $('body').append($iframe);

            var childWindow = $iframe[0].contentWindow;

            var spy3 = jasmine.createSpy('spy3');
            var spy4 = jasmine.createSpy('spy4');

            childWindow.fakeobj = {};
            childWindow.fakeobj1 = {};

            childWindow.fakeobj.noop = spy3;
            childWindow.fakeobj1.noop = spy4;

            $iframe.on('load', function () {

                setTimeout(function () {

                    expect(hubCount).toBe(0);
                    expect(hubCount1).toBe(0);

                    expect(childWindow.hubCount).toBe(0);
                    expect(childWindow.hubCount1).toBe(0);



                    if (!IE8) {

                        expect(spy3).toHaveBeenCalledWith(
                            'asd',
                            'spec2_iframe'
                            );

                        expect(spy4).toHaveBeenCalledWith(
                            'bsd',
                            'spec2_iframe'
                            );

                    }
                    //done();

                    var spy6 = jasmine.createSpy('spy6');
                    var spy7 = jasmine.createSpy('spy7');

                    childWindow.fakeobj.noop = spy6;
                    childWindow.fakeobj1.noop = spy7;

                    childWindow.hub.emit('csd');
                    childWindow.hub1.emit('dsd');

                    setTimeout(function () {

                        if (!IE8) {
                            expect(spy6).toHaveBeenCalledWith(
                                'csd',
                                'spec2_iframe'
                                );

                            expect(spy7).toHaveBeenCalledWith(
                                'dsd',
                                'spec2_iframe'
                                );
                        }


                        done();

                    }, 30);

                }, 150);

            });

        }, 110);



    });

});