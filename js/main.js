$(document).ready(function(){
	new WOW().init();
	
	var pathname = window.location.pathname; // Returns path only
	var url      = window.location.href;     // Returns full URL

   
	api = 'https://api.instagram.com/v1';
	var token = url.split('=')[1];
	myfeed = api+'/users/self/feed?access_token='+token;

	if(token)
	{
		page = 'feed'
		$('#logar').hide();
		carregarFeed(myfeed,true);
	}else{
		$('#menuFeed').hide();
		$('#logar').show();
		$('#photos').append('<div class="row"> <h1 style="font-weight:300;text-align:center;"> <i class="fa fa-exclamation-circle" style="color:red;"></i> Faça login para continuar!</h1> </row>');
	}



	cliend_id = '73cac3debac843d48323c7055bfc12e2';
	ajaxFeed = null;
	ajaxPerfil = null;
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



	
	myinfos = api+'/users/self?access_token='+token;
	search = api+'/users/search?q=${buscar}&access_token='+token;
	otherfotos = api+'/users/${user_id}/media/recent/?access_token='+token;


	loadUser(myinfos);
	user_id = $('#user_id').val();
	
	
	function loadUser(url){
		$.ajax({
		  url: url,
		  dataType: "jsonp",
		  success: function (data) {
		    data = data['data'];
		    username = '@'+data['username'];
		    if(url === myinfos){
		    	user_id = data['id'];
				$('#user_id').val(user_id);
				$('#menuPerfil').text(data['username']);
		    }
			
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
		page = 'feed'
		carregarFeed(myfeed,true);
	});

	$('#logar').click(function(){
		carregarFeed(myfeed,true);
	});

	$('#menuPerfil').click(function(){

		page = 'perfil'
		carregarFotos(api+'/users/'+user_id+'/media/recent/?access_token='+token,true);
	})

	

	function createProfile(){
		$('#username').text(username);
		$('#full_name').text(full_name);
		console.log('foto')
			console.log(profile_picture);
		$('#profile_picture').attr('src',profile_picture);

		$('#fotos').html('<strong>'+fotos+'</strong> publicações');
		$('#seguidores').html('<strong>'+seguidores+'</strong> Seguidores');
		$('#seguindo').html('Seguindo <strong>'+seguindo+'</strong>');
		$('#perfil').addClass('animated fadeInDown');
	}

	function carregarFeed(url,clean){
		ajaxFeed = $.ajax({
		  url: url,
		  dataType: "jsonp",
		  success: function (data) {
		  	next = data['pagination']['next_url'];
		  	$('#next').val(next);
		    posts = data['data'];
		    if(clean)
		   	 $('#photos').empty();

		    for(i = 0;i<posts.length;i++)
		    {
	    		addPost(posts[i]);
		    }

		  }
		});

	}

	function carregarFotos(url,clean){
		
		$.ajax({
		  url: url,
		  dataType: "jsonp",
		  success: function (data) {
		    posts = data['data'];
		    next = data['pagination']['next_url'];
		  	$('#next').val(next);

		    if(clean)
		   	 $('#photos').empty();

		    if(!posts)
		    	renderEmptyPosts();
		    for(i = 0;i<posts.length;i++)
		    {
	    		addPost(posts[i]);
		    }
		  }
		});
	}




	$('#busca').keyup(throttle(function(){
		$('#perfil').removeClass('animated fadeInDown');
	    	buscar = $(this).val();
			url = search.replace('${buscar}',buscar);
			console.log(buscar);
			console.log(url);

			$.ajax({
				url: url,
				dataType: "jsonp",
					success: function (resp) {
						console.log(resp);
						console.log('ID BUSCA: '+resp['data'][0]['id']);
						idBuscar = resp['data'][0]['id'];

						imprimirBusca(resp['data']);
					}
			});

	}));

	
    function throttle(f, delay){
		    var timer = null;
		    return function(){
		        var context = this, args = arguments;
		        clearTimeout(timer);
		        timer = window.setTimeout(function(){
		            f.apply(context, args);
		        },
		        delay || 200);
		    };
		}

    function imprimirBusca(data){
    	$('.resultadoBusca').empty();
    	$('.resultadoBusca').show('slow');
    	var html = '<li> <input type="hidden" class="user_id" value="${user_id}" >'+
    			' <img src="${foto}" alt="">'+
    			' ${full_name} <br /> @${username}</li>'

    	for(i = 0 ; i< data.length ; i++)
    	{
    		var li = html;
    		li = li.replace('${user_id}',data[i]['id']);
    		li = li.replace('${full_name}',data[i]['full_name']);
    		li = li.replace('${foto}',data[i]['profile_picture']);
    		li = li.replace('${username}',data[i]['username']);
    		$('.resultadoBusca').append(li);
    	}

    	$(document).mouseup(function (e)
			{
			    var container = $(".resultadoBusca");

			    if (!container.is(e.target) // if the target of the click isn't the container...
			        && container.has(e.target).length === 0) // ... nor a descendant of the container
			    {
			    	container.empty();
			        container.hide();
			    }
			});
		
    	

    	
    	

    }



	$( ".resultadoBusca" ).on( "click", "li", function() {
	  //alert('clicado');
	  	page = 'perfil';

    	idBuscar = $(this).find('.user_id').val();
    	otherurl = otherfotos.replace('${user_id}',idBuscar);
    	$('.resultadoBusca').hide('slow');

		carregarFotos(otherurl,true);
		loadUser(api+'/users/'+idBuscar+'?access_token='+token);


		//https://api.instagram.com/v1/users/{user-id}/?access_token=ACCESS-TOKEN

	});

	/*function addPost(post){
		var html = '<div class="post col md-3">'+
					'<a href="${link}">'+
						'<figure>'+
							'<img class="responsive" src="${linkImagem}" alt="">'+
						'</figure>'+
					'</a>'+
					'<div class="caption">'+
						'<p> <i class="fa fa-heart"></i> ${likes} <br />'+
						'<i class="fa fa-facebook-official"></i><span class="fb-share-button" data-href="${compartilhar}" data-layout="link"></span>'+
					'</p>'+
				'</div>';
		html = html.replace('${linkImagem}',post['images']['standard_resolution']['url']);
		//html = html.replace('${caption}',post['caption']['text']);
		html = html.replace('${link}',post['link']);
		html = html.replace('${compartilhar}',post['link']);
		html = html.replace('${likes}',post['likes']['count']);
		$('#photos').append(html);


		(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); js.id = id;
	  js.src = "//connect.facebook.net/pt_BR/sdk.js#xfbml=1&version=v2.5&appId=272021399674737";
	  fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
	}*/



	function addPost(post){
		var html = '<div class="post col md-3 fadeInUp animated wow">'+
					'<a href="${link}">'+
						'<figure>'+
							'<img class="responsive" src="${linkImagem}" alt="">'+
						'</figure>'+
					'</a>'+
					'<div class="caption">'+
						'<p> <i class="fa fa-heart"></i> ${likes} <br />'+
						'<i class="fa fa-facebook-official"></i> <a class="fb-share" href="http://www.facebook.com/sharer/sharer.php?s=100&p[url]=${compartilharLink}&p[images][0]=${compartilharImagem}&p[title]=${compartilharTitle}&p[summary]=${compartilharDescricao}"> Compartilhar </a>'+
					'</p>'+
				'</div>';
		html = html.replace('${linkImagem}',post['images']['standard_resolution']['url']);
		html = html.replace('${link}',post['link']);
		html = html.replace('${compartilharLink}',post['link']);
		
		html = html.replace('${compartilharImagem}',post['images']['standard_resolution']['url']);
		html = html.replace('${likes}',post['likes']['count']);
		$('#photos').append(html);
	}
	

	function renderEmptyPosts(){
		$('#photos').append('<div class="row"> <h1 style="font-weight:300;text-align:center;"> <i class="fa fa-exclamation-circle" style="color:red;"></i> Este usuário não possui nenhuma postagem!</h1> </row>');
	}

	$(window).scroll(function() {
	   if($(window).scrollTop() + $(window).height() == $(document).height()) {
	   		
	   		if(page === 'feed'){
	     	 carregarFeed($('#next').val(),false);
	   		}
	     	else if (page === 'perfil'){
	     		carregarFotos($('#next').val(),false);
	     	}
	     		console.log('NEXT:'+next);
	     		console.log(page);
	   }
	});





})