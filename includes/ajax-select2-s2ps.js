jQuery(function($) {
	$('.s2ps-post-selector').select2( {
									placeholder: 'Select a post',
									multiple: false,
									minimumInputLength: 3,
									ajax: {
										url: ajaxurl,
										dataType: 'json',
										data: function (term, page) {
											return {
												q: term,
												action: 's2ps_post_select_lookup',
												post_type: $(this).attr('data-post-type'),
												s2ps_post_select_field_id: $(this).attr('data-s2ps-post-select-field-id')
											};
										},
										results: s2psProcessPostSelectDataForSelect2,
										cache: true,
										delay: 250
									},
									initSelection: function(element, callback) {
										// the input tag has a value attribute preloaded that points to a preselected movie's id
										// this function resolves that id attribute to an object that select2 can render
										// using its formatResult renderer - that way the movie name is shown preselected
										var ids=$(element).val();
										if (ids!=="") {
											$.ajax(ajaxurl, {
												data: {
													action: 's2ps_get_post_titles',
													post_ids: ids
												},
												dataType: "json"
											}).done(function(data) {
												var processedData = s2psProcessPostSelectDataSingleForSelect2(data);
												setPreview( element[0].name, processedData.thumbnail, processedData.text, processedData.excerpt );
												callback(processedData); });
										}
									},
								}).on("change", function (e) {
									console.log(e, e.Event, e.added);
									setPreview( e.currentTarget.name,
										e.added ? e.added.thumbnail : '',
										e.added ? e.added.text : '',
										e.added ? e.added.excerpt : '' );
								});

	function setPreview(name, thumbnail, text, excerpt) {
		$('#' + name + '_container .thumbnail').attr('src', thumbnail ? thumbnail : '' );
		$('#' + name + '_container .title').html(text);
		$('#' + name + '_container .excerpt').html(excerpt);
	}
});

function s2psProcessPostSelectDataForSelect2( ajaxData, page, query ) {

	var items=[];
	var newItem=null;

	for (var thisId in ajaxData) {
		newItem = {
			'id': ajaxData[thisId]['id'],
			'text': ajaxData[thisId]['title'],
			'thumbnail': ajaxData[thisId]['thumbnail'],
			'excerpt': ajaxData[thisId]['excerpt']
		};
		items.push(newItem);
	}
	return { results: items };
}

function s2psProcessPostSelectDataSingleForSelect2( ajaxData, page, query ) {

	var items=[];
	var newItem=null;

	if(ajaxData.length){
		return {
			'id': ajaxData[0]['id'],
			'text': ajaxData[0]['title'],
			'thumbnail': ajaxData[0]['thumbnail'],
			'excerpt': ajaxData[0]['excerpt']
		};
	}

	return false;
}