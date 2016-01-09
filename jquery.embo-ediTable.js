(function($) {
	"use strict";
	var EmboCore = {
		Messages: {
			Error : "Something went wrong :"
		},
		Inputs : {
			text : '<input type="text" {{attrs}} />',
			link: '<a {{attrs}}>{{text}}</a>',
			textarea: '<textarea {{attrs}} >{{text}}</textarea>'
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
			var pairedElements = ["textarea", "link"];
			$.each(attrs, function(key, value){
				/*
				value, text, type 
				these attributes are not in Paired elements (textarea, link)
				*/
				
				if (["value", "text", "type"].indexOf(key) > -1)
				{
					if (pairedElements.indexOf(attrs.type) == -1)
					{
						attrString += key + "='" + value + "' ";
					}
				}
				else
				{
					attrString += key + "='" + value + "' ";
				}
			});
			
			if (pairedElements.indexOf(attrs.type) > -1)
			{
				if (attrs.text)
				{
					template = EmboCore.replace('text', attrs.text, template);
				}
				else if (attrs.value)
				{
					template = EmboCore.replace('text', attrs.value, template);
				}
			}
			return template.replace(keyString, attrString);
		}, 
		getActionButtons : function (){
			
		}
	}
	/*
	actionColIndex 		- column index for action buttons.
	actionButtons 		- an object with button texts (add, edit, done, delete).
	editableCols 		- array of editable columns.
						- Empty array makes all the columns editable.
	notEditableCols 	- array of not editable columns or default -1 if all columns are editable.
						** notEditableCols has higher priority, when a column in editableCols and notEditableCols arrays.
						** actionColIndex has highest priority.
	idSuffix 			- allow to add row index and column index to the end of the element id.
	nameSuffix 			- allow to add row index and column index to the end of the element name.
	
	attrs 				- an object contains attributes for the inputs/elements column wise.
						- 'type' attribute defines the type of the element.
						- 'text' attribute overwrite default text in the table cell. ('text' attribute has higher priority than cell value)
						** if the type is 'link', cell default value must be the url and scan set 'text' attribute as the display text Eg: "Click here"
	*/
    $.fn.editable = function(options) {
		var settings = $.extend({
				editableCols: [],
				notEditableCols: [],
				attrs : {},
				idSuffix: true,
				nameSuffix: true,
				actionColIndex : -1,
				actionButtons : {
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
							
							//Edit
							attrs = {
									id: "edit_row_" + rowIndex,
									class: "btn-editRow"
								};
								var button = EmboCore.addAttrs(attrs, EmboCore.Inputs.link);
								button = EmboCore.replace("text", settings.actionButtons.edit, button);
								actionHtml += button;
							
							
							//Delete
							attrs = {
									id: "delete_row_" + rowIndex,
									class: "btn-deleteRow"
								};
								var button = EmboCore.addAttrs(attrs, EmboCore.Inputs.link);
								button = EmboCore.replace("text", settings.actionButtons.delete, button);
								actionHtml += button;
							
							
							//Done
							attrs = {
									id: "done_row_" + rowIndex,
									class: "btn-editRowDone"
								};
								var button = EmboCore.addAttrs(attrs, EmboCore.Inputs.link);
								button = EmboCore.replace("text", settings.actionButtons.delete, button);
								actionHtml += button;
							
							$(this).html(actionHtml);
						}
						
						// Editable Cols Check
						if (typeof settings.editableCols == 'object' && settings.editableCols.length > 0) 
						{
							if (settings.editableCols.indexOf(colIndex) == -1)
							{
								editable = editable && false;
							}
						}
						// Not Editable Cols check
						if (typeof settings.notEditableCols == 'object' && settings.notEditableCols.length > 0) 
						{
							if (settings.notEditableCols.indexOf(colIndex) > -1)
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
									class: "",
									type: "text"
								}, settings.attrs[colIndex]);
								
								// if link 
								if (attrs.type.toLowerCase() == "link")
								{
									attrs = $.extend({
										href : attrs.value
									}, attrs);
								}
							
								//Suffix
								if (settings.idSuffix)
								{
									attrs.id += "_" + rowIndex + "_" + colIndex;
								}
								if (settings.nameSuffix)
								{
									attrs.name += "_" + rowIndex + "_" + colIndex;
								}
							}else
							{
								attrs = {
									value : value, 
									name: rowIndex + "_" + colIndex,
									id: rowIndex + "_" + colIndex,
									type: "text"
								}
							}
							
							var inputHtml = EmboCore.addAttrs(attrs, EmboCore.Inputs[attrs.type.toLowerCase()]); //EmboCore.replace("value", value, EmboCore.Inputs.Text);
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