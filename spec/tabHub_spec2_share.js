
//javascript snippet shared across pages

//var hub = tabHub('myVal_spec2', function (e) {

//    //$(window).on('emit', function (e, data) {

//    //    console.log(data, 'emit');
//    //    emit(data);
//    //});
//});

//var spec2_iframe;
//var spec2_main;

//hub.onValue(function (val) {

//    console.log(val +'onvalue', document.title)
//    if(window.top !== window){ //this is iframe
//        //window.top.alert(111);

//        if (window.top.spec2_iframe) {
//            window.top.spec2_iframe(val, document.title);
//        }

//    } else {

//        if (window.spec2_main) {
//            window.spec2_main(val, document.title);
//        }
//    }

//});


//javascript snippet shared across pages


var fakeobj, hub;

$(function () {

    fakeobj = fakeobj || {
        onceCb: function () { },
        noop: function () { }
    };


    hub = tabHub('myVal_spec2', function (e) {
        console.log('111')
        fakeobj.onceCb();
        
    });


    hub.onValue(function (val) {
       
        fakeobj.noop(val, document.title);
    });

});