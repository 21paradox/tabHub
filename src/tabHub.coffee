
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
	
	emitTimes = 0

	emit = (retValue) ->
		out.lastValue = retValue
		localStorage.setItem(name, "data:#{retValue}")
		
		for onValuecb in onValueArr
			onValuecb.call(null, retValue)
		emitTimes += 1
	
	# onValue callback Array
	onValueArr = [];
	
	# first remove this item
	#localStorage.removeItem(name)
	# then init readable stream
	localStorage.setItem(name, 'readable')
	
	noop = $.noop;
	
	window.addEventListener('storage', noop, false)
	
	# use timeout here to manually trigger async method
	# because this will be run after other tabs update result
	
	$(document).ready(->
		
		setTimeout(->

			regeisterEvents()
			
			if emitTimes > 0 then return
			
			if eventArr = localStorage.getItem(name)?.split(':')
				
				if eventArr[0] is 'data'
					#console.log(eventArr[1])
					for onValuecb in onValueArr
						onValuecb.call(null, eventArr[1])
						return
			callback(emit)

	
#			if out.lastValue?
#				for onValuecb in onValueArr
#					onValuecb.call(null, out.lastValue)
#			else
#				#console.log('run cb', document.title)
#				callback(emit)
				
		, 100)
	)
	
	
	regeisterEvents = ->
		
		$(window).on("storage.#{name}", (e) ->
			
			key = e.originalEvent.key
			#oldValue = e.originalEvent.oldValue
			newValue = e.originalEvent.newValue 
			# if newValue not exist assgin getItem
			newValue?= localStorage.getItem(name) 
			
			if key is name #and newValue? #and !document.hasFocus()

				eventArr =  newValue.split(':')
				eventType = eventArr[0]
				eventData = eventArr[1]
				
				switch eventType
					when 'readable'
						# if other tab have lastValue then set data Event
						if out.lastValue? 
							#console.log('readable',out.lastValue)
							localStorage.setItem(name, "data:#{out.lastValue}")
						 	
					when 'data'
						if eventData?
							out.lastValue = eventData
	
							for onValuecb in onValueArr
								onValuecb.call(null, eventData)
		)
		
		$(window).on('unload', -> $(window).off("storage"))
		
	
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

#	  
#`var hub = tabHub('myVal', function (emit) {
#
#   setTimeout(function(){
#	   
#	   console.log('run123')
#	   
#	   emit(Math.random(100));
#   },1000)
#   
#});
#
#hub.onValue(function (d) {
#   console.log(d)
#})`;