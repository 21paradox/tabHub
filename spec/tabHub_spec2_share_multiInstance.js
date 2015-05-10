
var fakeobj, hub, hub1, fakeobj1;

var hubCount = 0;
var hubCount1 = 0;

 localStorage.clear();

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
        hubCount += 1;
        //console.log('run')
    });


    hub.onValue(function (val) {
        fakeobj.noop(val, document.title);
        //console.log(val, document.title,'hub');
    });
    
    
    hub1 = tabHub('myVal_spec2_02', function (e) {
        //fakeobj1.onceCb();
        hubCount1 +=1;
         //console.log('run1')
    });


    hub1.onValue(function (val) {
        fakeobj1.noop(val, document.title);
        //console.log(val, document.title,'hub1');
    });
   
});