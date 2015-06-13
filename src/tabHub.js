// Generated by CoffeeScript 1.9.2

/*

Easy browser tab events fireing and receiving.

Basic features are:

callback will be fired only once across all tabs
one tab emit event, other tabs received
 */
var tabHub;

tabHub = (function() {

  /*
  		generate guid
  		http://stackoverflow.com/questions/6248666/how-to-generate-short-uid-like-ax4j9z-in-js
   */
  var guid;
  guid = ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4);
  return function(name, callback) {
    var IE, IE8, addCookie, emit, emitTimes, noop, onValueArr, out, registerEvents;
    IE = navigator.userAgent.indexOf("MSIE ") > -1 || navigator.userAgent.indexOf("Trident/") > -1;
    IE8 = 'onstorage' in document && IE;

    /* 
    			set tabHub_emit_key key to cookie, and will expire after 1 second
    			http://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
     */
    addCookie = function(val) {
      var date;
      date = new Date();
      date.setTime(date.getTime() + 1000);
      return document.cookie = "tabHub_emit_" + name + "=" + val + "; expires=" + (date.toUTCString()) + "; path=/";
    };
    emitTimes = 0;
    if (IE8) {
      emit = function(retValue) {
        var i, len, onValuecb, val;
        out.lastValue = retValue;
        val = "data:" + guid + ":" + out.lastValue;
        addCookie(val);
        localStorage.setItem(name, val);
        for (i = 0, len = onValueArr.length; i < len; i++) {
          onValuecb = onValueArr[i];
          onValuecb.call(null, retValue);
        }
        return emitTimes += 1;
      };
    } else {
      emit = function(retValue) {
        var i, len, onValuecb;
        out.lastValue = retValue;
        localStorage.setItem(name, "data:" + guid + ":" + out.lastValue);
        for (i = 0, len = onValueArr.length; i < len; i++) {
          onValuecb = onValueArr[i];
          onValuecb.call(null, retValue);
        }
        return emitTimes += 1;
      };
    }
    onValueArr = [];
    noop = $.noop;
    if (IE8) {
      $(document).on('storage.noop', noop);
    } else {
      $(window).on('storage.noop', noop);
    }
    if (callback != null) {
      if (IE8) {
        addCookie("readable:" + guid);
      }
      localStorage.setItem(name, "readable:" + guid);
      $(document).ready(function() {
        return setTimeout(function() {
          var eventArr, i, len, onValuecb, ref;
          registerEvents();
          if (emitTimes > 0) {
            return;
          }
          if (eventArr = (ref = localStorage.getItem(name)) != null ? ref.split(':') : void 0) {
            if (eventArr[0] === 'data') {
              out.lastValue = eventArr[2];
              for (i = 0, len = onValueArr.length; i < len; i++) {
                onValuecb = onValueArr[i];
                onValuecb.call(null, eventArr[2]);
                return;
              }
            }
          }
          callback(emit);
          if (IE8) {
            return $(document).off('storage.noop');
          } else {
            return $(window).off('storage.noop');
          }
        }, 100);
      });
    } else {
      $(document).ready(function() {
        return (typeof setImmediate !== "undefined" && setImmediate !== null ? setImmediate : setTimeout)(function() {
          registerEvents();
          if (IE8) {
            return $(document).off('storage.noop');
          } else {
            return $(window).off('storage.noop');
          }
        });
      });
    }
    registerEvents = function() {
      var handler, handlerFn, ie8Handler, ieHandler;
      handler = function(e) {
        var eventArr, eventData, eventType, i, key, len, newValue, onValuecb;
        key = e.originalEvent.key;
        newValue = localStorage.getItem(name);
        if (key === name && newValue === e.originalEvent.newValue) {
          eventArr = newValue.split(':');
          eventType = eventArr[0];
          eventData = eventArr[2];
          switch (eventType) {
            case 'readable':
              if (out.lastValue != null) {
                return localStorage.setItem(name, "data:" + guid + ":" + out.lastValue);
              }
              break;
            case 'data':
              if (eventData != null) {
                for (i = 0, len = onValueArr.length; i < len; i++) {
                  onValuecb = onValueArr[i];
                  onValuecb.call(null, eventData);
                }
                return out.lastValue = eventData;
              }
          }
        }
      };
      ieHandler = function(e) {
        var eventArr, eventData, eventGuid, eventType, i, key, len, newValue, onValuecb;
        key = e.originalEvent.key;
        newValue = e.originalEvent.newValue;
        if (key === name) {
          eventArr = newValue.split(':');
          eventType = eventArr[0];
          eventGuid = eventArr[1];
          eventData = eventArr[2];
          if (eventGuid === guid) {
            return;
          }
          switch (eventType) {
            case 'readable':
              if (out.lastValue != null) {
                return (typeof setImmediate !== "undefined" && setImmediate !== null ? setImmediate : setTimeout)(function() {
                  var safeGet;
                  safeGet = localStorage.getItem(name);
                  if ((safeGet != null) && safeGet.split(':')['0'] === 'readable') {
                    return localStorage.setItem(name, "data:" + guid + ":" + out.lastValue);
                  }
                });
              }
              break;
            case 'data':
              if (eventData != null) {
                for (i = 0, len = onValueArr.length; i < len; i++) {
                  onValuecb = onValueArr[i];
                  onValuecb.call(null, eventData);
                }
                return out.lastValue = eventData;
              }
          }
        }
      };
      ie8Handler = function(e) {

        /*
        					getCookie
        					https://developer.mozilla.org/en-US/docs/Web/API/document/cookie
         */
        var eventArr, eventData, eventGuid, eventType, i, len, newValue, onValuecb;
        newValue = document.cookie.replace(RegExp("(?:(?:^|.*;\\s*)tabHub_emit_" + name + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1");
        if (newValue) {
          eventArr = newValue.split(':');
          eventType = eventArr[0];
          eventGuid = eventArr[1];
          eventData = eventArr[2];
          if (eventGuid === guid) {
            return;
          }
          if (newValue == null) {
            return;
          }
          switch (eventType) {
            case 'readable':
              if (out.lastValue != null) {
                return setTimeout(function() {
                  var safeGet, val;
                  safeGet = localStorage.getItem(name);
                  if ((safeGet != null) && safeGet.split(':')['0'] === 'readable') {
                    val = "data:" + guid + ":" + out.lastValue;
                    addCookie(val);
                    return localStorage.setItem(name, val);
                  }
                }, 0);
              }
              break;
            case 'data':
              if (eventData != null) {
                for (i = 0, len = onValueArr.length; i < len; i++) {
                  onValuecb = onValueArr[i];
                  onValuecb.call(null, eventData);
                }
                return out.lastValue = eventData;
              }
          }
        }
      };
      if (IE8) {
        $(document).on("storage." + name, ie8Handler);
        return $(window).on('unload', function() {
          return $(document).off("storage");
        });
      } else {
        if (IE) {
          handlerFn = ieHandler;
        } else {
          handlerFn = handler;
        }
        $(window).on("storage." + name, handlerFn);
        return $(window).on('unload', function() {
          return $(window).off("storage");
        });
      }
    };
    return out = {
      destory: function() {
        return $(window).off("storage." + name);
      },
      onValue: function(cb) {
        onValueArr.push(cb);
        return function() {
          var index;
          index = $.inArray(cb, onValueArr);
          if (index !== -1) {
            return onValueArr.splice(index, 1);
          }
        };
      },
      lastValue: null,
      emit: emit,
      guid: guid
    };
  };
})();
