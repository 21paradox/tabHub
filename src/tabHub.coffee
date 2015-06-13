
###

Easy browser tab events fireing and receiving.

Basic features are:

callback will be fired only once across all tabs
one tab emit event, other tabs received
###

tabHub = do ->
	
	###
		generate guid
		http://stackoverflow.com/questions/6248666/how-to-generate-short-uid-like-ax4j9z-in-js
	###
	guid = `("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)`
	
	return (name, callback) ->
	
		# detect IE
		IE = navigator.userAgent.indexOf("MSIE ") > -1 or navigator.userAgent.indexOf("Trident/") > -1;
		
		# detect IE8
		IE8 = 'onstorage' of document and IE
		
	
		### 
			set tabHub_emit_key key to cookie, and will expire after 1 second
			http://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
		###
		addCookie = (val) ->
			date = new Date()
			date.setTime(date.getTime() + 1000)
			document.cookie = "tabHub_emit_#{name}=#{val}; expires=#{date.toUTCString()}; path=/"
	
		# count the emit times
		emitTimes = 0
		
		if IE8 
			emit = (retValue) ->
				out.lastValue = retValue
				# ie8 will add Cookie for key
				val = "data:#{guid}:#{out.lastValue}"
				addCookie(val)
				localStorage.setItem(name, val)
				
				for onValuecb in onValueArr
					onValuecb.call(null, retValue)
				emitTimes += 1
		else 
			emit = (retValue) ->
				out.lastValue = retValue
				localStorage.setItem(name, "data:#{guid}:#{out.lastValue}")
				
				for onValuecb in onValueArr
					onValuecb.call(null, retValue)
				emitTimes += 1	
		
		# onValue callback Array
		onValueArr = [];
		
		# set a noop function, hack for IE
		noop = $.noop;
		
		if IE8 then $(document).on('storage.noop', noop)
		else $(window).on('storage.noop', noop)
		
		if callback?
			# ie8 add cookie
			if IE8 then addCookie("readable:#{guid}")
			# reset state to readable
			localStorage.setItem(name, "readable:#{guid}")
			
			$(document).ready(->
				
				# use timeout here to manually trigger async method
				# because this will be run after other tabs update result
				setTimeout(->
		
					registerEvents()
					
					if emitTimes > 0 then return
					
					if eventArr = localStorage.getItem(name)?.split(':')
						#console.log eventArr
						if eventArr[0] is 'data'
							 
							out.lastValue = eventArr[2]
							for onValuecb in onValueArr
								onValuecb.call(null, eventArr[2])
								return
					callback(emit)
					
					# remove noop function
					if IE8 then $(document).off('storage.noop')
					else $(window).off('storage.noop')
			
				, #if IE8 then 150 else 
				100)
			)
			
		else 
			$(document).ready(->
				(setImmediate ? setTimeout)(->
					registerEvents()
					if IE8 then $(document).off('storage.noop')
					else $(window).off('storage.noop')
				)
			)

		registerEvents = ->	
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
								# update lastValue
								out.lastValue = eventData
			
			
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
								# if not using setTimeout localStorage.getItem will be blocked execution
								(setImmediate ? setTimeout)(->
									safeGet = localStorage.getItem(name)
									if safeGet? and safeGet.split(':')['0'] is 'readable'
										localStorage.setItem(name, "data:#{guid}:#{out.lastValue}")					
								)
				
						when 'data'
							if eventData?
								for onValuecb in onValueArr
									onValuecb.call(null, eventData)
								# update lastValue
								out.lastValue = eventData
			
			
			ie8Handler = (e) ->
				###
					getCookie
					https://developer.mozilla.org/en-US/docs/Web/API/document/cookie
				### 
				#key = document.cookie.replace(/(?:(?:^|.*;\s*)tabHub_emit_key\s*\=\s*([^;]*).*$)|^.*$/, "$1");
				newValue = document.cookie.replace(///
												(?:(?:^|.*;\s*)
												tabHub_emit_#{name}
												\s*\=\s*([^;]*).*$)|^.*$
												///, "$1");
				#if key is name 
				if newValue
					
					#newValue = document.cookie.replace(/(?:(?:^|.*;\s*)tabHub_emit_val\s*\=\s*([^;]*).*$)|^.*$/, "$1");
					eventArr =  newValue.split(':')
					eventType = eventArr[0]
					eventGuid = eventArr[1]
					eventData = eventArr[2]
				
					# this hack is for IE http://stackoverflow.com/questions/18476564/ie-localstorage-event-misfired> 
					if eventGuid is guid then return
					
					if not newValue? then return
				
					switch eventType
							when 'readable'
								# if other tab have lastValue then set data Event
								if out.lastValue? 
									
									setTimeout(->
										safeGet = localStorage.getItem(name)
										if safeGet? and safeGet.split(':')['0'] is 'readable'
											val = "data:#{guid}:#{out.lastValue}"
											# ie8 will add Cookie for key
											addCookie(val)
											localStorage.setItem(name, val)					
									, 0)
									
							when 'data'
								if eventData?
									for onValuecb in onValueArr
										onValuecb.call(null, eventData)
									# update lastValue
									out.lastValue = eventData

			# IE8
			if IE8
				$(document).on("storage.#{name}", ie8Handler)
				$(window).on('unload', -> $(document).off("storage"))
			# IE9+
			else 
				if IE then handlerFn = ieHandler	
				# chrome firefox
				else handlerFn = handler
				
				$(window).on("storage.#{name}", handlerFn)
				$(window).on('unload', -> $(window).off("storage"))
			

		out = {
	
			destory: -> $(window).off("storage.#{name}"),
	
			onValue: (cb) ->
				onValueArr.push(cb)
	
				return ->
					index = $.inArray(cb, onValueArr)
					if index isnt -1 then onValueArr.splice(index, 1)
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