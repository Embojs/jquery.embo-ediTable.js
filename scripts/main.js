
$(document).ready(function(){
    
	$('#myTable').editable({
		editableCols:[1, 2, 3],
		notEditableCols:[],
		actionColIndex: 0,
		attrs : {
			1 : {id: "one_id", name: "one_name", class: "test class", type: "text"},
			2 : {id: "two_id", name: "two_name", class: "test class", type: "textarea"},
			3 : {id: "two_id", name: "two_name", class: "test class", type: "link", text: "Click Here"}
			},
		idSuffix : true,
		nameSuffix: false,
		actionButtons : {
			add : "<i class='fa fa-plus'></i>", 
			edit: "<i class='fa fa-pencil-square-o'></i>",
			done: "<i class='fa fa-check'></i>",
			delete: "<i class='fa fa-trash-o'></i>"
			}
	});
	$('#myTable').DataTable();
});

