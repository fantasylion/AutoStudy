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
	if( itCanDoPageTurn() ) {
		var courseList = setInterval(function() {
			if ( $(".course_list li").length > 0 ) {
				clearInterval(courseList);
				autoPageTurn();
			}
		}, 500);
	}

	if( itCanDoAutoPlay() ) {
		var finishTime = 2 * 60 * 1000;
		autoPlay( finishTime );
	}
})();

function itCanDoAutoPlay() {
	console.log(window.location.href.indexOf("http://www.shgb.gov.cn/html/indexvideo.html#/beforevideo"));
	console.log(window.location.href);
	return window.location.href.indexOf("http://www.shgb.gov.cn/html/indexvideo.html#/beforevideo") >= 0;
}

function itCanDoPageTurn() {
	return window.location.href == 'http://www.shgb.gov.cn/html/indexfront.html#/main/study/record';
}

/**
 * 自动翻页
 */
function autoPageTurn() {
	var actDoIt = false;
	var actDoCounter = 0;
	var intervalCheck = setInterval(function(){	
		if ( $(".more .btn").attr("disabled") == "disabled"  ) {
			actDoCounter++;
		}

		if ( actDoCounter == 5 ) {
			actDoIt = true;
			clearInterval(intervalCheck);
		}
	}, 500);

	var interval = setInterval(function(){	
		if ( !actDoIt ) {
			$(".more .btn").click();
		} else {
			clearInterval(interval);
			console.log("startStudy");
			startStudy();
		}
	}, 300);

}

function LastUnread() {
	var _this = this;
	_this.currentObj   = undefined;
	_this.currentIndex = undefined;
	_this.duration = undefined;
	function init() {
		$(".course_list li").each(function(index, element) {
			updateInfo( index, $(element) );
		});
	}

	function updateInfo( index, element ) {
		if ( $(element.find("span")[4]).html().indexOf("100%") < 0 ) {
    		_this.currentObj   = element[0];
    		_this.currentIndex = index;
    		 
    		var dataStr = $(element.find("span")[2]).html();
    		var durations = /\d{2}:\d{2}:\d{2}/g.exec(dataStr)
    		_this.duration = durations[0];
    		return element;
	    }
	}
	init();

	_this.currentUnread = function() {
		return $(_this.currentObj);
	}

	_this.nextUnread = function() {
		var obj = updateInfo( _this.currentIndex+1, $(element).next() );
		while( !obj ) {
			obj = updateInfo( _this.currentIndex+1, $(element).next() );
		}
		return _this.currentObj;
	}

	return this;
}

/**
 * 开始学习视频
 */
function startStudy() {
	var lastUnread    = new LastUnread();
	var currentUnread = lastUnread.currentUnread();
	currentUnread.find(".btn").attr("target", "_blank")[0].click();
}

/**
 * 自动播放 <embed> 格式的视频
 */
function autoPlay( finishTime ) {
	var interval = setInterval(function(){
		if ( $("param[name='movie']").length > 0 && $("embed").length > 0 ) {
			try{
				$("param[name='movie']").val($("param[name='movie']").val()+"?autoplay=1&fs=1");
				$("embed").attr("src", $("embed").attr("src")+"?autoplay=1&fs=1" );
				console.log("set autoplay");
			} catch ( err ) {
				console.log(err);
				return;
			}
			console.log("clearInterval");
			clearInterval(interval);
			setTimeout(function() {
				console.log("do the finished");
			}, finishTime );	
		}
	}, 1000);
}
