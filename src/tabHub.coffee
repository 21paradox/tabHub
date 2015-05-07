
###

 sync events are fired at these times
 page loads
 storage event
 page unload? 
 tab crashed?
 

###


init = (name, callback) ->
	
	$(window).on('storage', (e) ->
	
		key = e.originalEvent.key
		newValue = e.originalEvent.newValue
		oldValue = e.originalEvent.oldValue
		
		$(window).trigger("tabHub.#{key}", newValue)
	)

	# handle done state
	handleData = (eventData) ->
		console.log("dataReceived: #{eventData} #{document.title}")
	
	# handle callback
	done = (data) ->
		console.log("done called #{document.title}")
		localStorage.setItem(name, "data:#{data}")
		handleData(data)

	$(window).on("tabHub.#{name}", (e, newValue) ->
		
		if !newValue then return
		
		eventArr =  newValue.split(':')
		eventType = eventArr[0]
		eventData = eventArr[1]
		
		switch eventType
			when 'readable'
				localStorage.setItem(name,'pending:')
				callback(done)
				
			when 'pending' then return
			
			when 'data'
				handleData(eventData)
			when 'request'
				#console.log(123123)
				localStorage.setItem(name,'data:1111')
	)

	return {
		run: ->
			#request -> pending -> data
			 
			#localStorage.setItem(name, 'readable')
			#$(window).trigger("tabHub.#{name}", 'readable')
			
			localStorage.removeItem(name);
			localStorage.setItem(name, 'request')
			console.log(localStorage.getItem(name));
		,
		destory: -> $(window).off("tabHub.#{name}")
	}


aa = `init('aa', function (done, fail) {
            
    setTimeout(function() {
        
        done('123123123');
        
    }, 1000);
});`


aa.run()

#
#
#$(window).on('storage', function (e) {
#
#    //var storageEvent = e.originalEvent;
#    //var key = storageEvent.key;
#    var eventString = localStorage.getItem('aa:event');
#
#    if (eventString == 'pending') {
#        return;
#    } else if (eventString == 'begin') {
#        localStorage.setItem('aa:event', 'pending');
#        localStorage.removeItem('aa:data');
#
#        setTimeout(function () {
#            localStorage.setItem('aa:data', '123123');
#            $(window).trigger('storage');
#        }, 300);
#
#    } else if (eventString == 'end') {
#        localStorage.setItem('aa:event', 'pending');
#    }
#
#    //var diff = new Date().getTime() - eventTime;
#});
#
#
#
#$(window).on('storage', function () {
#
#    var eventString = localStorage.getItem('aa:data');
#
#    if (eventString) {
#        console.log(eventString)
#        console.log('aa:data', document.title);
#    }
#
#});

