
/*
 sync events are fired at these times
 page loads
 storage event
 page unload? 
 tab crashed?

 random numbers
 只要random出来的时间不一样，就不会有2个长连接存在
 randome出来的几率是一样的情况是 1/4


*/


//function randomIntFromInterval(min, max) {
//    return Math.floor(Math.random() * (max - min + 1) + min);
//}


//items = [0, 500, 1000, 2000];

//window.setInterval(function () {
//    var item = items[Math.floor(Math.random() * items.length)];

//    console.log(item);
//},500)

$(window).on('storage', function (e) {

    //var storageEvent = e.originalEvent;
    //var key = storageEvent.key;
    var eventString = localStorage.getItem('aa:event');

    if (eventString == 'pending') {
        return;
    } else if (eventString == 'begin') {
        localStorage.setItem('aa:event', 'pending');
        localStorage.removeItem('aa:data');

        setTimeout(function () {
            localStorage.setItem('aa:data', '123123');
            $(window).trigger('storage');
        }, 300);

    } else if (eventString == 'end') {
        localStorage.setItem('aa:event', 'pending');
    }

    //var diff = new Date().getTime() - eventTime;
});



$(window).on('storage', function () {

    var eventString = localStorage.getItem('aa:data');

    if (eventString) {
        console.log(eventString)
        console.log('aa:data', document.title);
    }

});
