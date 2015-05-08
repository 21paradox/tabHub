
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

	$(window).on("storage.#{name}", (e) ->
		
		key = e.originalEvent.key
		newValue = e.originalEvent.newValue
		oldValue = e.originalEvent.oldValue

		#console.log(document.hidden, document.title)
		if key is name and newValue? #and !document.hasFocus()

			#console.log("storage",newValue, document.title)
			eventArr =  newValue.split(':')
			eventType = eventArr[0]
			eventData = eventArr[1]
			
			switch eventType
				when 'readable'
					# if other tab have lastValue then set data Event
					if out.lastValue? 
						localStorage.setItem(name, "data:#{out.lastValue}")
					 	#console.log('readable',out.lastValue)
					 	
				when 'data'
					if eventData?
						out.lastValue = eventData

						for onValuecb in onValueArr
							onValuecb.call(null, eventData)
						#console.log("dataReceived: #{eventData} #{document.title}")
				
	)

	# onValue callback Array
	onValueArr = [];

	# first remove this item
	localStorage.removeItem(name)
	# then init readable stream
	localStorage.setItem(name, 'readable')
	
	emit = (retValue) ->
		out.lastValue = retValue
		lock = true
		localStorage.setItem(name, "data:#{retValue}")
		
		for onValuecb in onValueArr
			onValuecb.call(null, retValue)
	
	# use timeout here to manually trigger async method
	# because this will be run after other tabs update result
	setTimeout(->
		#console.log(out.lastValue, 'result',document.title)
		if out.lastValue
			for onValuecb in onValueArr
				onValuecb.call(null, out.lastValue)
		else
			callback(emit)
	, 20)

	out = {

		destory: -> $(window).off("storage.#{name}"),

		onValue: (cb) ->
			onValueArr.push(cb)

			return ->
				index = $.inArray(cb, onValueArr)
				if index isnt -1 then onValueArr.splice(index, 1);
		,
		lastValue: null,
		emit: emit
	}
