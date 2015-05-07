# tabHub

Easy browser tab events fireing and receiving.

Basic features are:

 * callback will be fired `only once` across all tabs
 * one tab emit event, other tabs received

**remind**：this project requires `jquery` !!

### Usage

 ```js
var hub = tabHub('event1', function (emit) {
	// this callback will no longer be fired if other tab already fired this
    $.get('/api').done(function(data){
       emit(data);
    });
});

hub.onValue(function(data) {
	if(data == 'sync'){
     //do something
    }
});

//any where else need to brocast through tabs
$('xxx').click(function(){
   hub.emit('sync')
})

```

## API

### tabHub('eventsName', callback)
register cross tabs events.

1. `eventsName` must be unique.
2. once the emit function called, callback will `no longer` be fired.
3. you should call emit with `string`, because it will go to localstorage.
4. your emit should not containg `:`, because i use `:` to seperate.

### hub.onValue(callback)
1. this callback will be fired `more` than you think
2. hub.onValue(cb) returned a function for deregister events

### hub.emit('string')
1. emit a cross tab events
2. emit function inside calback is also the same

### hub.lastValue
get the lastValue that emited

### hub.destory()
remove all this instance listeners.

```js
var hub = tabHub('myVal_spec1', function (emit) {
});

hub.onValue(function(data) {

});


```

### amd，commonjs, cmd?
not yet support. 
You can `wrap` your self.


### Contribute
Contributions are very very welcome!!!


License
=======

[The X11 (“MIT”) License](LICENSE)


