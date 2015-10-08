$(document).ready(function(){
	var pathname = window.location.pathname; // Returns path only
	var url      = window.location.href;     // Returns full URL

	var token = url.split('=')[1];

	cliend_id = '73cac3debac843d48323c7055bfc12e2';
	api = 'https://api.instagram.com/v1';


	//		users/self/feed?access_token=ACCESS-TOKEN
	

	myfeed = api+'/users/self/feed?access_token='+token;

	$.get(myfeed,function(data){
		console.log(data);
	})
	alert(myfeed)




})