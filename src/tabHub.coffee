
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

tabHub = do ->
	
	###
	generate guid
	http://stackoverflow.com/questions/6248666/how-to-generate-short-uid-like-ax4j9z-in-js
	###
	guid = `("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)`
	
	return (name, callback) ->
	
		emitTimes = 0
	
		emit = (retValue) ->
			out.lastValue = retValue
			localStorage.setItem(name, "data:#{guid}:#{out.lastValue}")
			
			for onValuecb in onValueArr
				onValuecb.call(null, retValue)
			emitTimes += 1
		
		# onValue callback Array
		onValueArr = [];
		
		# set a noop function, hack for ie
		noop = $.noop;
		window.addEventListener?('storage', noop, false)
		
		# first remove this item
		#localStorage.removeItem(name)
		# then init readable stream
		localStorage.setItem(name, "readable:#{guid}")
			
		# use timeout here to manually trigger async method
		# because this will be run after other tabs update result
		
		$(document).ready(->
			
			setTimeout(->
	
				regeisterEvents()
				
				if emitTimes > 0 then return
				
				if eventArr = localStorage.getItem(name)?.split(':')
					#console.log eventArr
					if eventArr[0] is 'data'
						 
						for onValuecb in onValueArr
							onValuecb.call(null, eventArr[2])
							return
				callback(emit)
				window.removeEventListener?('storage', noop, false)
		
	#			if out.lastValue?
	#				for onValuecb in onValueArr
	#					onValuecb.call(null, out.lastValue)
	#			else
	#				#console.log('run cb', document.title)
	#				callback(emit)
					
			, 100)
		)
		

		regeisterEvents = ->	
			# register storage event
			
			handler = (e) ->
				
				key = e.originalEvent.key
				newValue =  localStorage.getItem(name)
				
				if key is name and newValue is e.originalEvent.newValue
				
					eventArr =  newValue.split(':')
					eventType = eventArr[0]
					#eventGuid = eventArr[1]
					eventData = eventArr[2]
					
					switch eventType
						when 'readable'
							# if other tab have lastValue then set data Event
							if out.lastValue?
								localStorage.setItem(name, "data:#{guid}:#{out.lastValue}") 
								
						when 'data'
							if eventData?
								for onValuecb in onValueArr
									onValuecb.call(null, eventData)
			
			
			ieHandler = (e) ->
				
				key = e.originalEvent.key
				newValue = e.originalEvent.newValue 

				if key is name 

					eventArr =  newValue.split(':')
					eventType = eventArr[0]
					eventGuid = eventArr[1]
					eventData = eventArr[2]
					
					# this hack is for IE http://stackoverflow.com/questions/18476564/ie-localstorage-event-misfired> 
					if eventGuid is guid then return
					
					switch eventType
						when 'readable'
							# if other tab have lastValue then set data Event
							if out.lastValue? 
								#console.log('readable',out.lastValue)
								setTimeout(->
									safeGet = localStorage.getItem(name)
									if safeGet? and safeGet.split(':')['0'] is 'readable'
										localStorage.setItem(name, "data:#{guid}:#{out.lastValue}")					
								, 0)
				
						when 'data'
							if eventData?
								for onValuecb in onValueArr
									onValuecb.call(null, eventData)
			
			
			# detect IE
			IE = navigator.userAgent.indexOf("MSIE ") > -1 or navigator.userAgent.indexOf("Trident/") > -1;
			
			$(window).on("storage.#{name}", if IE then ieHandler else handler)
			
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
			emit: emit,
			guid: guid
		}
	







	  
#`var hub = tabHub('myVal', function (emit) {
#
#   setTimeout(function(){
#	   
#	   $('body').append('run123')
#	   
#	   emit(Math.random(100));
#   },1000)
#   
#});
#
#hub.onValue(function (d) {
#  // console.log(d)
#  
#  $('#body').append('onvalue: ' + d);
# 
#})`;