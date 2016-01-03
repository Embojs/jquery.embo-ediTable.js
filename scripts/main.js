
$(document).ready(function(){
  
	$('#myTable').emboEdiTable({
		editableCols:[1, 2],
		actionColIndex: 0,
		attrs : {
			0 : {id: "one_id", name: "one_name", class: "test class"}
			},
		idSuffix : true,
		nameSuffix: false,
		actions : {
			add : "<i class='fa fa-plus'></i>", 
			edit: "<i class='fa fa-pencil-square-o'></i>",
			done: "<i class='fa fa-check'></i>",
			delete: "<i class='fa fa-trash-o'></i>"
			},
	});
});

