describe('test tabHub for only one page', function () {

    beforeEach(function () {
        // use a clean state
        localStorage.clear();
        window.myVal_spec2 = null;
    });

    afterEach(function () {
        // clean all events
        $(window).off();
        //$('iframe').remove();
        //hub = null;
    });

    it('firstEnter main page, then iframe(iframe should not call), iframe emit mainpage getData', function (done) {

        var spy = jasmine.createSpy('spy');

        window.spec2_main = spy;

        setTimeout(function () {

            hub.emit('asd');

            expect(spy).toHaveBeenCalledWith(
                'asd',
                'spec2_main'
                );

            var spy1 = jasmine.createSpy('spy1');

            window.spec2_iframe = spy1;

            var $iframe = $('<iframe src="spec/tabHub_spec2_iframe.html" id="tabHub_iframe"></iframe>');

            $('body').append($iframe);

            var childWindow = $iframe[0].contentWindow;

            $iframe.on('load', function () {
                //console.log($('#tabHub_iframe').contents()[0].title);
                //console.log(childWindow.hub)
                setTimeout(function () {

                    expect(spy1).toHaveBeenCalledWith(
                        'asd',
                        'spec2_iframe'
                    );
                    //window.spec2_main = function (va) {
                    //    console.log(va,'va')
                    //}

                    var spy3 = jasmine.createSpy('spy');
                    window.spec2_main = spy3;

                    childWindow.hub.emit('ddd');

                    setTimeout(function () {

                        expect(spy1).toHaveBeenCalledWith(
                            'ddd',
                            'spec2_iframe'
                        );

                        expect(spy3).toHaveBeenCalledWith(
                            'ddd',
                            'spec2_main'
                        );

                        done();

                    }, 40);

                }, 40);
            });

        }, 10);

    });

    xit('test above is rellay bad test, consider refactory it!!');
});