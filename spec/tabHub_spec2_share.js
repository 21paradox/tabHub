
//javascript snippet shared across pages
var hubCount = 0;
var onValueCount = 0;

localStorage.clear();

var fakeobj, hub;

$(function () {

    fakeobj = fakeobj || {
        onceCb: function () { },
        noop: function () { }
    };


    hub = tabHub('myVal_spec2', function (e) {
        
        fakeobj.onceCb();
        hubCount += 1;
        
    });


    hub.onValue(function (val) {
        
        fakeobj.noop(val, document.title);
        onValueCount += 1;
        //nameStorage only exists in iframe
        if (document.title == 'spec2_iframe') {
            
 
        }
 
    });

});