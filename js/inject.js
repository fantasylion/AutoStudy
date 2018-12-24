// 通过postMessage调用content-script
function invokeContentScript(code)
{
	window.postMessage({cmd: 'invoke', code: code}, '*');
}
// 发送普通消息到content-script
function sendMessageToContentScriptByPostMessage(data)
{
	window.postMessage({cmd: 'message', data: data}, '*');
}

// 通过DOM事件发送消息给content-script
(function() {
	// &hl=zh_TW&autoplay=1&fs=1&	
	if(window.location.href == 'http://www.shgb.gov.cn/html/indexfront.html#/main/study/record') {
		var interval = setInterval(function(){
			if ($(".course_list li").length < 55) {
				$(".more .btn").click();
			} else {
				$($(".course_list li")[55]).find(".btn")[0].click();
				clearInterval(interval);
			}
		}, 1000);
	}

	if(window.location.href.indexOf("http://www.shgb.gov.cn/html/indexvideo.html#/videoCourse/") >= 0) {
		var interval = setInterval(function(){
			if ( $("param[name='movie']").length <= 0 || $("embed") <= 0 ) {
				
			} else {
				$("param[name='movie']").val($("param[name='movie']").val()+"?autoplay=1&fs=1");
				$("embed").attr("src", $("embed").attr("src")+"?autoplay=1&fs=1" );
				clearInterval(interval);
			}
		}, 1000);
	}



	// var customEvent = document.createEvent('Event');
	// customEvent.initEvent('myCustomEvent', true, true);
	// // 通过事件发送消息给content-script
	// function sendMessageToContentScriptByEvent(data) {
	// 	data = data || '你好，我是injected-script!';
	// 	var hiddenDiv = document.getElementById('myCustomEventDiv');
	// 	hiddenDiv.innerText = data
	// 	hiddenDiv.dispatchEvent(customEvent);
	// }
	// window.sendMessageToContentScriptByEvent = sendMessageToContentScriptByEvent;
})();
