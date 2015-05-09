
var fakeobj, hub, hub1, fakeobj1;

$(function () {

    fakeobj = fakeobj || {
        onceCb: function () { },
        noop: function () { }
    };
    
    fakeobj1 = fakeobj1 || {
        onceCb: function () { },
        noop: function () { }
    };


    hub = tabHub('myVal_spec2_01', function (e) {
        //fakeobj.onceCb();
    });


    hub.onValue(function (val) {
        fakeobj.noop(val, document.title);
        //console.log(val, document.title,'hub');
    });
    
    
    hub1 = tabHub('myVal_spec2_02', function (e) {
        //fakeobj1.onceCb();
    });


    hub1.onValue(function (val) {
        fakeobj1.noop(val, document.title);
        //console.log(val, document.title,'hub1');
    });
   
});