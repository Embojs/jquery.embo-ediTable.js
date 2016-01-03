(function($) {
	var EmboCore = {
		Messages: {
			Error : "Something went wrong :"
		},
		Inputs : {
			Text : '<input type="text" {{attrs}} />',
			Link: '<a {{attrs}}>{{text}}</a>'
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
		},
		addAttrs: function (attrs, template) {
			var keyString = '{{attrs}}';
			var attrString = "";
			
			row = "";
			$.each(attrs, function(key, value){
				attrString += key + "='" + value + "' ";
			});
			return template.replace(keyString, attrString);
		}, 
		getActionButtons : function (){
			
		}
	}
	/*
	actionColIndex - column index for action buttons
	editableCols - array of editable columns or default -1 if all columns are editable
	*/
    $.fn.emboEdiTable = function(options) {
		var settings = $.extend({
				editableCols: -1,
				attrs : {},
				idSuffix: true,
				nameSuffix: true,
				actionColIndex : -1,
				actions : {
					add : "Add new row", 
					edit: "Edit",
					done: "Done",
					delete: "Delete"
					},
				completed: EmboCore.completed,
				failed: EmboCore.failed,
				ended: EmboCore.ended
		   }, options);
		return this.each(function(){
			try{
				var table = this;
				
				// add  button
				
				//turn all editable columns to input box
				var rowIndex = 0;
				$(table).find('tr').each(function (){
					var colIndex = 0;
					$(this).find('td').each(function (){
						var editable = true;
						if (colIndex == settings.actionColIndex)
						{
							editable = false;
							var attrs;
							var actionHtml = "";
							if (settings.actions.edit)
							{
								attrs = {
									id: "edit_row_" + rowIndex,
									class: "btn-editRow"
								};
								var button = EmboCore.addAttrs(attrs, EmboCore.Inputs.Link);
								button = EmboCore.replace("text", settings.actions.edit, button);
								actionHtml += button;
							}
							
							if (settings.actions.delete)
							{
								attrs = {
									id: "delete_row_" + rowIndex,
									class: "btn-deleteRow"
								};
								var button = EmboCore.addAttrs(attrs, EmboCore.Inputs.Link);
								button = EmboCore.replace("text", settings.actions.delete, button);
								actionHtml += button;
							}
							
							if (settings.actions.done)
							{
								attrs = {
									id: "done_row_" + rowIndex,
									class: "btn-editRowDone"
								};
								var button = EmboCore.addAttrs(attrs, EmboCore.Inputs.Link);
								button = EmboCore.replace("text", settings.actions.delete, button);
								actionHtml += button;
							}
							$(this).html(actionHtml);
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
							//Get attrs from setting and to add to input
							var attrs;
							if (settings.attrs[colIndex])
							{
								
								attrs = $.extend({
									value : value, 
									name: rowIndex + "_" + colIndex,
									id: rowIndex + "_" + colIndex,
									class: ""
								}, settings.attrs[colIndex]);
								
								//Suffix
								if (settings.idSuffix)
								{
									attrs.id += "_" + rowIndex;
								}
								if (settings.nameSuffix)
								{
									attrs.name += "_" + rowIndex;
								}
							}else
							{
								attrs = {
									value : value, 
									name: rowIndex + "_" + colIndex,
									id: rowIndex + "_" + colIndex
								}
							}
							
							var inputHtml = EmboCore.addAttrs(attrs, EmboCore.Inputs.Text); //EmboCore.replace("value", value, EmboCore.Inputs.Text);
							$(this).html(inputHtml);
						}
						colIndex += 1;
					});
					rowIndex += 1;
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