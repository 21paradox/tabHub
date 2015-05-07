
###

 sync events are fired at these times
 page loads
 storage event
 page unload?
 tab crashed?
 TODOS!!
 
 IE8兼容性问题,IE8下 storage event不是 window而是 document，
 而且 没有Event key http://jsfiddle.net/rodneyrehm/bAhJL/

###

tabHub = (name, callback) ->

	$(window).on('storage', (e) ->

		key = e.originalEvent.key
		newValue = e.originalEvent.newValue
		oldValue = e.originalEvent.oldValue

		#console.log("storage #{newValue}", document.title)
		if key is name
			$(window).trigger("tabHub.#{name}", newValue)
	)


	$(window).on("tabHub.#{name}", (e, newValue) ->

		if !newValue then return

		eventArr =  newValue.split(':')
		eventType = eventArr[0]
		eventData = eventArr[1]

		switch eventType
			when 'readable'
				# if other tab have lastValue then set data Event
				if out.lastValue? then localStorage.setItem(name, "data:#{out.lastValue}")
			when 'data'
				handleData(eventData)

	)

	# handle done state
	handleData = (eventData) ->

		if eventData?
			out.lastValue = eventData
			emit(eventData)
			console.log("dataReceived: #{eventData} #{document.title}")

	# onValue callback Array
	onValueArr = [];

	# first remove this item
	localStorage.removeItem(name)
	# then init readable stream
	localStorage.setItem(name, 'readable')
	
	emit = (retValue) ->
		out.lastValue = retValue
		localStorage.setItem(name, "data:#{retValue}")
		for onValuecb in onValueArr
			onValuecb.call(null, retValue)
	
	# use timeout here to manually trigger async method
	# because this will be run after other tabs update result
	setTimeout(->
		console.log(out.lastValue, 'result')
		if out.lastValue
			for onValuecb in onValueArr
				onValuecb.call(null, out.lastValue)
		else
			callback(emit)
	, 20)

	out = {

		destory: -> $(window).off("tabHub.#{name}"),

		onValue: (cb) ->
			onValueArr.push(cb)

			return ->
				index = $.inArray(cb, onValueArr)
				if index isnt -1 then onValueArr.splice(index, 1);
		,
		lastValue: null,
		emit: emit
	}


#aa = `init('aa', function (emit, fail) {
#
#    setTimeout(function() {
#
#        emit('123123123');
#
#    }, 1000);
#});`


##onValue will be called more than you think!
#aa.onValue((data) ->
#	console.log(data, document.title)
#)


