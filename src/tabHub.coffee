
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
	
	### 
		registrer storage first
		when data received set data
		hack for IE
	###
#	$(window).on("storage.#{name}.first", (e) ->
#		
#		key = e.originalEvent.key
#		newValue = e.originalEvent.newValue
#		newValue?= localStorage.getItem(name) 
#		eventArr = newValue.split(':')
#		
#		if key is name
#			if eventArr[0] is 'data'
#				console.log("set lastValue #{eventArr[1]}", document.title)
#				out.lastValue = eventArr[1]
#				$(window).off("storage.#{name}.first")
#	)

	noop = $.noop;
	
	window.addEventListener('storage', noop, false)
	
	# use timeout here to manually trigger async method
	# because this will be run after other tabs update result
	
	$(document).ready(->
		
		setTimeout(->
			#console.log(out.lastValue, 'result', document.title)
			#console.log(out.lastValue, 'lastValue')
			
			#console.log localStorage.getItem(name)
			regeisterEvents()
			
			if emitTimes > 0 then return
			
			#console.log(name)
			if eventArr = localStorage.getItem(name)?.split(':')
				#console.log(eventArr, document.title)
				
				if eventArr[0] is 'data'
					#console.log(eventArr[1])
					for onValuecb in onValueArr
						onValuecb.call(null, eventArr[1])
						return
				#else
					#console.log('run cb', document.title)
			#console.log('runcb')		
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
			
			#console.log(document.hidden, document.title)
			if key is name #and newValue? #and !document.hasFocus()
	
				#console.log("storage",newValue, document.title)
				
				#console.log(newValue,'newValue')
				eventArr =  newValue.split(':')
				eventType = eventArr[0]
				eventData = eventArr[1]
				#console.log(eventArr, document.title, name)
				
				switch eventType
					when 'readable'
						# if other tab have lastValue then set data Event
						if out.lastValue? 
							#console.log('readable',out.lastValue)
							localStorage.setItem(name, "data:#{out.lastValue}")
						 	#
						 	
					when 'data'
						if eventData?
							out.lastValue = eventData
	
							for onValuecb in onValueArr
								onValuecb.call(null, eventData)
							#console.log("dataReceived: #{eventData} #{document.title}")
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