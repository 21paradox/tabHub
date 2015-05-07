//javascript snippet shared across pages
var noop1, noop2;

var hub = tabHub('myVal_spec2_01', function (e) {

});

hub.noop = noop1 || function () {

};

hub.onValue(function (val) {

    hub.noop(val, document.title);
});


var hub1 = tabHub('myVal_spec2_02', function (e) {

});

hub1.noop = noop2 || function () {

};

hub1.onValue(function (val) {
    hub1.noop(val, document.title);
});
