(function($) {
	var EmboCore = {
		Messages: {
			Error : "Something went wrong :"
		},
		Inputs : {
			Text : '<input type="text" value="{{value}}"/>'
		},
		ShowLog : true,
		completed: function (){
			
		},
		failed: function (ex) {
			EmboCore.log('error', EmboCore.Messages.Error + ex);
		},
		ended : function () {
			
		},
		log : function (type, message){
			if (EmboCore.ShowLog){
				console.log(message);
			}
		},
		replace: function(key, value, template){
			var keyString = '{{'+ key +'}}';
			return template.replace(keyString, value);
		}
	}
	/*
	actionColIndex - column index for action buttons
	editableCols - array of editable columns or default -1 if all columns are editable
	*/
    $.fn.emboEdiTable = function(options) {
		var settings = $.extend({
			   actionColIndex : -1,
			   editableCols: -1,
			   completed: EmboCore.completed,
			   failed: EmboCore.failed,
			   ended: EmboCore.ended
		   }, options);
		return this.each(function(){
			try{
				var table = this;
				
				// add action column
				
				//turn all editable columns to input box
				$(table).find('tbody').find('tr').each(function (){
					var colIndex = 0;
					$(this).find('td').each(function (){
						var editable = true;
						if (colIndex == settings.actionColIndex)
						{
							editable = false;
						}
						if (typeof settings.editableCols == 'object') 
						{
							if (settings.editableCols.indexOf(colIndex) == -1)
							{
								editable = editable && false;
							}
						}
						
						if (editable)
						{
							var value = $(this).html();
							var inputHtml = EmboCore.replace("value", value, EmboCore.Inputs.Text);
							$(this).html(inputHtml);
						}
						colIndex += 1;
					});
				});
				if ($.isFunction(settings.completed)) {
					settings.completed.call(this);
				}
			
			}
			catch(ex)
			{
				if ($.isFunction(settings.failed)) {
					settings.failed.call(ex);
				}
			}
			finally {
			  if ($.isFunction(settings.ended)) {
					settings.ended.call(this);
				}
			}
			
		});
		
    }
	
}(jQuery));