(function(){var _$=function(q){q=q||document;return this.find(q)};_$.extend=function(obj){var original=this.prototype;var extended=obj;for(var key in (extended||{})){original[key]=extended[key]}return original};_$.prototype={elements:[],find:function(q){var ele=[];var qlen=q.length;for(var i=0;i<qlen;i++){if(typeof q[i]=="string"){var list=document.querySelectorAll(q[i]);var size=list.length;for(var j=0;j<size;j++){ele.push(list[j])}}else{if(q[i] instanceof Array){for(var x=0;x<q[i].length;x++){var list=document.querySelectorAll(q[i][x]);var size=list.length;for(var j=0;j<size;j++){ele.push(list[j])}}}else{ele.push(q[i])}}}this.elements=this.elements.concat(this.reduce(ele));return this},reduce:function(el,b){var a=[],i,l=el.length;for(i=0;i<l;i++){if(a.indexOf(el[i],0,b)<0){a.push(el[i])}}return a},removex:function(array,from,to){var rest=array.slice((to||from)+1||array.length);array.length=from<0?array.length+from:from;return array.push.apply(array,rest)},has:function(q){var t=[];this.each(function(el){x$(q).each(function(hel){if(hel==el){t.push(el)}})});this.elements=t;return this},not:function(q){var list=this.elements;for(var i=0;i<list.length;i++){x$(q).each(function(hel){if(list[i]==hel){this.elements=this.removex(list,list.indexOf(list[i]))}})}return this},add:function(q){this.find([q]);this.elements=this.reduce(this.elements);return this},first:function(){return this.elements[0]},each:function(fn){for(var i=0,len=this.elements.length;i<len;++i){fn.call(this,this.elements[i])}return this}};var Dom={inner:function(html){return this.html("inner",html)},outer:function(html){return this.html("outer",html)},top:function(html){return this.html("top",html)},bottom:function(html){return this.html("bottom",html)},remove:function(){return this.html("remove")},html:function(location,html){var getTag=function(el){if(el.firstChild==null){switch(el.tagName){case"UL":return"LI";break;case"DL":return"DT";break;case"TR":return"TD";break;default:return el.tagName}}return el.firstChild.tagName};var wrap=function(xhtml,tag){var attributes={};var re=/^<([A-Z][A-Z0-9]*)([^>]*)>(.*)<\/\1>/i;if(re.test(xhtml)){result=re.exec(xhtml);tag=result[1];if(result[2]!=""){var attrList=result[2].split(/([A-Z]*\s*=\s*['|"][A-Z0-9:;#\s]*['|"])/i);for(var i=0;i<attrList.length;i++){var attr=attrList[i].replace(/^\s*|\s*$/g,"");if(attr!=""&&attr!=" "){var node=attr.split("=");attributes[node[0]];attributes[node[0]]=node[1].replace(/(["']?)/g,"")}}}xhtml=result[3]}var element=document.createElement(tag);for(var x in attributes){var a=document.createAttribute(x);a.nodeValue=attributes[x];element.setAttributeNode(a)}element.innerHTML=xhtml;return element};this.clean();if(arguments.length==1&&arguments[0]!="remove"){html=location;location="inner"}this.each(function(el){switch(location){case"inner":if(typeof html=="string"){el.innerHTML=html;var list=el.getElementsByTagName("SCRIPT");var len=list.length;for(var i=0;i<len;i++){eval(list[i].text)}}else{el.innerHTML="";el.appendChild(html)}break;case"outer":if(typeof html=="string"){html=wrap(html,getTag(el))}el.parentNode.replaceChild(html,el);break;case"top":if(typeof html=="string"){html=wrap(html,getTag(el))}el.insertBefore(html,el.firstChild);break;case"bottom":if(typeof html=="string"){html=wrap(html,getTag(el))}el.insertBefore(html,null);break;case"remove":var parent=el.parentNode;parent.removeChild(el);break}});return this},clean:function(){var ns=/\S/;this.each(function(el){var d=el,n=d.firstChild,ni=-1;while(n){var nx=n.nextSibling;if(n.nodeType==3&&!ns.test(n.nodeValue)){d.removeChild(n)}else{n.nodeIndex=++ni}n=nx}});return this}};var Event={click:function(fn){return this.on("click",fn)},load:function(fn){return this.on("load",fn)},touchstart:function(fn){return this.on("touchstart",fn)},touchmove:function(fn){return this.on("touchmove",fn)},touchend:function(fn){return this.on("touchend",fn)},touchcancel:function(fn){return this.on("touchcancel",fn)},gesturestart:function(fn){return this.on("gesturestart",fn)},gesturechange:function(fn){return this.on("gesturechange",fn)},gestureend:function(fn){return this.on("gestureend",fn)},orientationchange:function(fn){return this.on("orientationchange",fn)},on:function(type,fn){var listen=function(el){if(window.addEventListener){el.addEventListener(type,fn,false)}};this.each(function(el){listen(el)});return this}};var Style={setStyle:function(prop,val){this.each(function(el){el.style[prop]=val});return this},getStyle:function(prop,callback){var gs=function(el,p){return document.defaultView.getComputedStyle(el,"").getPropertyValue(p)};if(callback==undefined){return gs(this.first(),prop)}this.each(function(el){callback(gs(el,prop))});return this},addClass:function(className){var that=this;var hasClass=function(el,className){var re=that.getClassRegEx(className);return re.test(el.className)};this.each(function(el){if(hasClass(el,className)==false){el.className+=" "+className}});return this},removeClass:function(className){if(className==undefined){this.each(function(el){el.className=""})}else{var re=this.getClassRegEx(className);this.each(function(el){el.className=el.className.replace(re," ")})}return this},css:function(o){var that=this;this.each(function(el){for(var prop in o){that.setStyle(prop,o[prop])}});return this||that},reClassNameCache:{},getClassRegEx:function(className){var re=this.reClassNameCache[className];if(!re){re=new RegExp("(?:^|\\s+)"+className+"(?:\\s+|$)");this.reClassNameCache[className]=re}return re}};var Fx={tween:function(options){if(options instanceof Array){for(var i=0;i<options.length;i++){this.animationStack.push(options[i])}}else{if(options instanceof Object){this.animationStack.push(options)}}this.start();return this},animationStack:[],start:function(){var t=0;for(var i=0;i<this.animationStack.length;i++){var options=this.animationStack[i];var duration=options.duration==undefined?0.5:options.duration;setTimeout(function(s,o){s.animate(o)},t*1000*duration,this,options);t+=duration}return this},animate:function(options){var that=this;var opt_after=options.after;var easing=(options.easing==undefined)?"ease-in":options.easing;var before=(options.before==undefined)?function(){}:options.before;var after=(opt_after==undefined)?function(){}:function(){opt_after.apply(that)};var duration=(options.duration==undefined)?0.5:options.duration;var translate=options.by;var rotate=options.rotate;options.easing=options.rotate=options.by=options.before=options.after=options.duration=undefined;before.apply(before.arguments);this.setStyle("-webkit-transition","all "+duration+"s "+easing);this.each(function(el){for(var prop in options){that.setStyle(prop,options[prop])}if(translate){that.setStyle("-webkit-transform",that.translateOp(translate[0],translate[1]))}});setTimeout(function(){that.setStyle("-webkit-transition","none")},duration*1000);setTimeout(function(){that.setStyle("-webkit-transform","none")},duration*1000);setTimeout(after,duration*1000);return this||that},translateOp:function(xPixels,yPixels){return"translate("+xPixels+"px, "+yPixels+"px)"},rotateOp:function(axis,degree){return"rotate"+axis+"("+degree+"deg)"}};var Xhr={xhr:function(url,options){if(options==undefined){var options={}}var that=this;var req=new XMLHttpRequest();var method=options.method||"get";var async=options.async||false;var params=options.data||null;req.open(method,url,async);if(options.headers){var i=0;for(i=0;i<options.headers.length;i++){req.setRequestHeader(options.headers[i].name,options.headers[i].value)}}req.onload=(options.callback!=null)?options.callback:function(){that.html(this.responseText)};req.send(params);return this},xhrjson:function(url,options){if(options==undefined){return this}var that=this;var cb=options.callback;if(typeof cb!="function"){cb=function(x){return x}}var callback=function(){var o=eval("("+this.responseText+")");for(var prop in o){x$(options.map[prop]).html(cb(o[prop]))}};options.callback=callback;this.xhr(url,options);return this}};var libs=[Dom,Event,Style,Fx,Xhr];for(var i=0,size=libs.length;i<size;i++){_$.extend(libs[i])}var xui=window.x$=function(){return new _$(arguments)}})();