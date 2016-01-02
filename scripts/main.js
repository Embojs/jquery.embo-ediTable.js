
$(document).ready(function(){
  
	$('#myTable').emboEdiTable({
		editableCols:[0, 2],
		actionColIndex: 3,
		attrs : {
				   0 : {id: "one_id", name: "one_name", class: "test class"}
				    },
				idSuffix : true,
				nameSuffix: false,
	});
});

