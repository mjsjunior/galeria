$(document).ready(function(){
	var pathname = window.location.pathname; // Returns path only
	var url      = window.location.href;     // Returns full URL

	var token = url.split('=')[1];
	cliend_id = '73cac3debac843d48323c7055bfc12e2';

	username = '';
	user_id = '';
	website = '';
	profile_picture = '';
	full_name = '';
	fotos = '';
	seguidores = '';
	seguindo = '';

	post = '<div class="post col md-3">'+
					
						'<figure>'+
							'<img class="responsive" src="${linkImagem}" alt="">'+
						'</figure>'+
					
					'<div class="caption">'+
						'<p>${caption}</p>'+
					'</div>'+
				'</div>';



   
	api = 'https://api.instagram.com/v1';
	myfeed = api+'/users/self/feed?access_token='+token;
	myinfos = api+'/users/self?access_token='+token;
	search = api+'/users/search?q=${buscar}&access_token='+token;
	otherfotos = api+'/users/${user_id}/media/recent/?access_token='+token;


	loadUser();
	user_id = $('#user_id').val();
	
	
	function loadUser(){
		console.log('Carregando user....')
		$.ajax({
		  url: myinfos,
		  dataType: "jsonp",
		  success: function (data) {
		    data = data['data'];
		    username = data['username'];
			user_id = data['id'];
			$('#user_id').val(user_id);
			website = data['website'];
			profile_picture = data['profile_picture'];
			full_name = data['full_name'];
			fotos = data['counts']['media'];
			seguidores = data['counts']['followed_by'];
			seguindo = data['counts']['follows'];
			createProfile();
			
		  }
		});
	}


	$('#menuFeed').click(function(){
		carregarFeed(myfeed);
	});

	$('#logar').click(function(){
		carregarFeed(myfeed);
	});

	$('#menuPerfil').click(function(){
		carregarFotos();
	})

	$('#buscar').click(function(){
		user = $('#busca').val();
		url = search.replace('${buscar}',user);


		$.ajax({
		  url: url,
		  dataType: "jsonp",
		  success: function (data) {
	    	console.log('Data---> '+data['data'])
	    		
		  }
		});





	})
	

	function createProfile(){
		$('#username').text(username);
		$('#full_name').text(full_name);
		$('#profile_picture').attr('src',profile_picture);
		$('#fotos').text(fotos+' publicações');
		$('#seguidores').text(seguidores+' seguidores');
		$('#seguindo').text('seguindo '+seguindo);
	}

	function carregarFeed(url){
		$.ajax({
		  url: url,
		  dataType: "jsonp",
		  success: function (data) {
		    posts = data['data'];
		    $('#photos').empty();
		    for(i = 0;i<posts.length;i++)
		    {
	    		addPost(posts[i]);
		    }
		  }
		});
	}

	function carregarFotos(){
		$.ajax({
		  url: myprofile = api+'/users/'+user_id+'/media/recent/?access_token='+token,
		  dataType: "jsonp",
		  success: function (data) {
		    posts = data['data'];
		    $('#photos').empty();
		    for(i = 0;i<posts.length;i++)
		    {
	    		addPost(posts[i]);
		    }
		  }
		});
	}


	function addPost(post){
		var html = '<div class="post col md-3">'+
					'<a href="${link}">'+
						'<figure>'+
							'<img class="responsive" src="${linkImagem}" alt="">'+
						'</figure>'+
					'</a>'+
					'<div class="caption">'+
						'<p>${caption}</p>'+
					'</div>'+
				'</div>';
		html = html.replace('${linkImagem}',post['images']['low_resolution']['url']);
		html = html.replace('${caption}',post['caption']['text']);
		html = html.replace('${link}',post['link']);
		$('#photos').append(html);
	}

	


})