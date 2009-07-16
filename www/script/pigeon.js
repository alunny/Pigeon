var direct_messages_url = "http://www.twitter.com/direct_messages.json"
var friends_timeline_url = "http://www.twitter.com/statuses/friends_timeline.json";
var tweet_post_url = "http://www.twitter.com/statuses/update.json";
var tweet_search_url = "http://search.twitter.com/search.json";
var tweet_response = "";

var load_dms = function(container_id,user,passw) {
	x$(container_id).xhr(direct_messages_url,
		{ callback: function () {
			tweetstream = eval(this.responseText);
			var i=0;
			for (i=0; i<tweetstream.length; i++) {
				x$(container_id).html("bottom",
					format_tweet({
						profile_image:tweetstream[i].sender.profile_image_url,
						user_name:tweetstream[i].sender.name,
						tweet_text:tweetstream[i].text
					}));
				}
			},
			headers: [{name:"Authorization",
						value: "Basic " + btoa(user + ":" + passw)}]
		});
}

var load_tweets = function(container_id,user,passw) {
	x$("#login_screen").setStyle("display","none");
	
	x$(container_id).xhr(friends_timeline_url,
		{ callback: function () {
			tweetstream = eval(this.responseText);
			var i=0;
			for (i=0; i<tweetstream.length; i++) {
				x$(container_id).html("bottom",
					format_tweet({
						profile_image:tweetstream[i].user.profile_image_url,
						user_name:tweetstream[i].user.name,
						tweet_text:tweetstream[i].text
					}));
				}
			},
			headers: [{name:"Authorization",
						value: "Basic " + btoa(user + ":" + passw)}]
		});
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
 		{ callback: function() {
			try {
				tweet_response = eval("[" + this.responseText + "]");
			} catch (e) {
				alert(e);
			}
			x$("#content").html("top",
				format_tweet({
					profile_image:tweet_response[0].user.profile_image_url,
					user_name:tweet_response[0].user.name,
					tweet_text:tweet_response[0].text
			}))},
			headers: [{name:"Authorization",
	 						value: "Basic " + btoa(user + ":" + passw)},
						{name:"Content-Length",
							value: params.length},
						{name:"Content-type",
							value:"application/x-www-form-urlencoded"},
						{name:"Connection",
							value: "close"}],
 			method: "post",
 			data: params
	});
	navigator.notification.beep(2);
}

// onload
var wake_pigeon = function() {
	// check for user / pass
	// if there, load current tweets, logout
	// if not, display login screen
}

var show_panel = function(identifier) {
	x$(".twt_panel").css({display:'none'});
	x$(identifier).css({display:'block'});
}
