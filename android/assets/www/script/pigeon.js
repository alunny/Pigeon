var direct_messages_url = "http://www.twitter.com/direct_messages.json"
var friends_timeline_url = "http://www.twitter.com/statuses/friends_timeline.json";
var tweet_post_url = "http://www.twitter.com/statuses/update.json";
var tweet_search_url = "http://search.twitter.com/search.json";
var tweet_response = "";

// Global Data Store
x$.data = {};

x$(window).load(function() {
	x$("#tweet_link").click(function() {
		var twt = document.getElementById("tweet_content").value;
		post_tweet(twt,x$.data.m_user,x$.data.m_pass,"#content");
		return false;
	});

	x$("#search_link").click(search_function);
	x$("#search_form").on("submit",search_function);

	x$("#login_link").click(login_function);
	x$("#login_form").on("submit",login_function);

	x$("#menu_local").click(function() {
		load_local_tweets("#local_results");
		show_panel("#local_content");
		return false;
	});

	x$("#menu_dms").click(function() {
		load_dms("#dm_content",x$.data.m_user,x$.data.m_pass);
		show_panel("#dm_content");
		return false;
	});

	x$("#menu_search").click(function() {
		x$(".panel").css({display:'none'});
		x$("#search_form").setStyle("display", "block");
		return false;
	});

	x$("#menu_friends").click(function() {
		load_tweets("#content",x$.data.m_user,x$.data.m_pass);
		show_panel("#content");
		return false;
	});

	x$("#menu_logout").click(function() {
		x$("#content").html(" ");
		x$(".panel").css({display:'none'});
		x$("#login_screen").setStyle("display", "block");
		document.getElementById('user_field').value = "";
		document.getElementById('pass_field').value = "";
		show_panel("#login_screen");
	});
});

var load_dms = function(container_id,user,passw) {
	x$(container_id).xhr(direct_messages_url,
						 { callback: function () { render_dms(container_id,this.responseText); },
			headers: [{name:"Authorization",
						value: "Basic " + btoa(user + ":" + passw)}]
		});
}

var render_dms = function(container_id,new_tweets) {
	var tweetstream = eval(new_tweets);
	var i=0;
	for (i=0; i<tweetstream.length; i++) {
		x$(container_id).html("bottom",
							  format_tweet({
										   profile_image:tweetstream[i].sender.profile_image_url,
										   user_name:tweetstream[i].sender.name,
										   tweet_text:tweetstream[i].text
										   }));
	}
}

var load_tweets = function(container_id,user,passw) {
	x$("#login_screen").setStyle("display","none");
	
	x$(container_id).xhr(friends_timeline_url,
						 { callback: function () { render_tweets(container_id, this.responseText); },
			headers: [{name:"Authorization",
						value: "Basic " + btoa(user + ":" + passw)}]
		});
}

var render_tweets = function(container_id, new_tweets) {
	var tweetstream = eval(new_tweets);
	var i=0;
	for (i=0; i<tweetstream.length; i++) {
		x$(container_id).html("bottom",
							  format_tweet({
										   profile_image:tweetstream[i].user.profile_image_url,
										   user_name:tweetstream[i].user.name,
										   tweet_text:tweetstream[i].text
										   }));
	}
}

var format_tweet = function(options) {
	var tweetstring = "<div class=\"tweet\"\n<img src=\"{PROFILE_IMAGE}\" />\n<p class=\"user_name\">{USER_NAME}</p>\n		<p class=\"tweet_text\">{TWEET_TEXT}</p>\n</div>";
	tweetstring = tweetstring.replace("{PROFILE_IMAGE}",options.profile_image);
	tweetstring = tweetstring.replace("{USER_NAME}",options.user_name);
	tweetstring = tweetstring.replace("{TWEET_TEXT}",options.tweet_text);
	return tweetstring;
}

var post_tweet = function(status,user,passw,container_id) {
 	var params = "status=" + encodeURIComponent(status);
 	x$(container_id).xhr(tweet_post_url,
						 { callback: function() { render_new_tweet(this.responseText); },
			headers: [{name:"Authorization",
	 						value: "Basic " + btoa(user + ":" + passw)},
			//			{name:"Content-Length",
			//				value: "" + params.length},
						{name:"Content-Type",
							value:"application/x-www-form-urlencoded"},
						{name:"Connection",
							value: "close"}],
 			method: "post",
 			data: params
	});
	navigator.notification.beep(2);
}

var render_new_tweet = function(new_tweet) {
	console.log(new_tweet);
	try {
		tweet_response = eval("[" + new_tweet + "]");
	} catch (e) {
		alert(e);
	}
	x$("#content").html("top",
						format_tweet({
									 profile_image:tweet_response[0].user.profile_image_url,
									 user_name:tweet_response[0].user.name,
									 tweet_text:tweet_response[0].text
									 }))
}

var show_panel = function(identifier) {
	x$(".twt_panel").css({display:'none'});
	x$(identifier).css({display:'block'});
}

var load_local_tweets = function(container_id) {
	var suc = function(p) {
		var params = "geocode=" + encodeURIComponent(p.latitude + "," + p.longitude + ",25km");
		var query_url = tweet_search_url + "?" + params;
		x$(container_id).xhr(query_url,
			{ callback: function() {
				var tweetstream = eval("[" + this.responseText + "]")[0].results;
				x$.data.new_tweets = tweetstream;
				setTimeout("display_search_tweets(x$.data.new_tweets,'"+container_id+"')",10);
			},
				method: "get"
			});
	};
	var fail = function(){
		alert("failed");
	};
	navigator.geolocation.getCurrentPosition(suc,fail);
}

var search_tweets = function(container_id, search_query) {
	var params = "q=" + encodeURIComponent(search_query);
	var query_url = tweet_search_url + "?" + params;
	x$(container_id).xhr(query_url,
		{ callback: function() {
				var tweetstream = eval("[" + this.responseText + "]")[0].results;
				x$.data.new_tweets = tweetstream;
				display_search_tweets(x$.data.new_tweets,container_id);
			},
				method: "get"
			});
}

var display_search_tweets = function(tweetstream,container_id) {
	x$(container_id + " div").remove();
	var i=0;
	for (i=0; i<tweetstream.length; i++) {
		var div_c = format_tweet({profile_image:tweetstream[i].profile_image_url,
			user_name:tweetstream[i].from_user,tweet_text:tweetstream[i].text });
		x$(container_id).html("bottom",div_c);
	}
}

var login_function = function(e) {		
	document.getElementById('user_field').blur(); 
	document.getElementById('pass_field').blur(); 
	
	x$.data.m_user = x$("#user_field").elements[0].value;
	x$.data.m_pass = x$("#pass_field").elements[0].value;
	
//	sql.post("user",x$.data.m_user);
//	sql.post("password",x$.data.m_pass);
	
	load_tweets("#content",x$.data.m_user,x$.data.m_pass);
	show_panel("#content"); // failing?
	x$(".panel").css({display:'none'}); // failing?
	x$("#post_new_tweet").css({display:"block"});
	e.preventDefault();
}

var search_function = function(e) {
	document.getElementById('query').blur();
	
	var search_query = document.getElementById('query').value;
	x$("#search_term").html(search_query);
	search_tweets("#search_results",search_query);
	show_panel("#search_panel");
	
	e.preventDefault();
}