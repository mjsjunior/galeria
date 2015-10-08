$(document).ready(function(){
	var pathname = window.location.pathname; // Returns path only
	var url      = window.location.href;     // Returns full URL

	var token = url.split('=')[1];

	cliend_id = '73cac3debac843d48323c7055bfc12e2';
	api = 'https://api.instagram.com/v1';


	//		users/self/feed?access_token=ACCESS-TOKEN
	

	myfeed = api+'/users/self/feed?access_token='+token;



	function addPost(post){
		var html = '<div class="post col md-3">'+
					'<a href="${link}">'+
						'<figure>'+
							'<img class="responsive" src="${linkImagem}" alt="">'+
						'</figure>'+
					'</a>'
					'<div class="caption">'+
						'<p>${caption}</p>'+
					'</div>'+
				'</div>';

		html = html.replace('${linkImagem}',post['images']['low_resolution']['url']);
		html = html.replace('${caption}',post['caption']['text']);
		html = html.replace('${link}',post['link']);
		$('#photos').append(html);
	}









	$.ajax({
		  url: myfeed,
		  dataType: "jsonp",
		  success: function (data) {
		    posts = data['data'];
		    for(i = 0;i<posts.length;i++)
		    {
		    		addPost(posts[i]);
		    	
		    	//$('#photos').append('<img style="'+style+'" src="'+posts[i]['images']['low_resolution']['url']+'" /> <br />');
		    }
		  }
		});


})