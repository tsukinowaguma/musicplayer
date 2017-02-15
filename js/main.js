var ispaused=true ;

function PlayMusic () {
	var playBtt = document.getElementsByClassName("control")[0];
	var music = document.getElementById("music");
	music.volume=0.2;
	var musicplayer = document.getElementsByClassName("musicplayer")[0];
	var musicName = document.createElement("h3");
	var musicName_text = document.createTextNode(music.getAttribute("src").split("\/")[1].split(".mp3")[0]);
	musicName.appendChild(musicName_text);
	musicplayer.appendChild(musicName);
	document.title =musicName.firstChild.nodeValue;
	playBtt.onclick=function(){
		PlayControl(this);
	};
}

function PlayControl (whichBtt) {  
	var music = document.getElementById("music");
	var musicprocess = document.getElementsByClassName("musicprocess")[0];
	var musicpic = document.getElementsByClassName("musicpic")[0];
	if (music.paused) {
		music.play();

	}else{

		music.pause();

	}
}

function prepareChose(){
	var alltime =document.getElementById("alltime");
	var playBtt = document.getElementsByClassName("control")[0];
	var classmenu =document.getElementsByClassName("classmenu")[0];
	var songs =document.getElementsByClassName("item");
	var music = document.getElementById("music");
	var musicName =document.getElementsByTagName("h3")[0];
	var highlight_list =document.getElementsByClassName("highlight");
	var musicprocess = document.getElementsByClassName("musicprocess")[0];
	var musicpic =document.getElementsByClassName("musicpic")[0];
	var highlight_links;
	music.onplaying = function(){
		ispaused =false;
		playBtt.setAttribute("src", "image/pause.png");
		musicprocess.setAttribute("class","musicprocess rotate");
		musicpic.setAttribute("class", "musicpic rotate");
	}
	music.onpause =function(){
		ispaused=true;
		playBtt.setAttribute("src", "image/play.png");
		musicprocess.setAttribute("class","musicprocess rotate pause");
		musicpic.setAttribute("class", "musicpic rotate pause");
	}

	for (var i = 0; i < songs.length; i++) {
		songs[i].onclick = function(){
			music.setAttribute("src", this.getAttribute("links"));
		}
	}
	music.onerror=function(){	//错误发生时
		if(music.error.code == 4){
			alert("链接失效，返回当前曲目");
			music.setAttribute("src",highlight_links);
			ispaused=false;
		}
	}
	music.onloadstart = function(){		//当曲目改变时
			if(ispaused){
				music.setAttribute("autoplay", "false");
				music.pause();
				musicprocess.setAttribute("class", "musicprocess rotate pause");
				musicpic.setAttribute("class", "musicpic rotate pause");
				playBtt.setAttribute("src", "image/play.png");
			}else {
				music.setAttribute("autoplay", "true");
				musicprocess.setAttribute("class", "musicprocess rotate");
				musicpic.setAttribute("class", "musicpic rotate");
				playBtt.setAttribute("src", "image/pause.png");
			}
			if (highlight_list){		//取消列表所有item高亮选中状态
				highlight_links=highlight_list[0].getAttribute("links");	//记录上一首歌方便错误时返回
				highlight_list[0].setAttribute("class","item");
			}
			for (var  j = 0; j <= songs.length; j++) {	//添加正在播放歌曲高亮选择状态 使播放器图片 名字变化
				var mic_src = songs[j].getAttribute("links");
				if( mic_src == music.getAttribute("src")){
					songs[j].setAttribute("class", "item highlight");
					var img =songs[j].getElementsByTagName("img")[0];
					musicpic.setAttribute("src", img.getAttribute("src"));
					var listMusicName = songs[j].getElementsByClassName("songtitle")[0];
					var listMusicName_text =listMusicName.lastChild.nodeValue;
					musicName.lastChild.nodeValue = listMusicName_text ;
					document.title =listMusicName_text;		//页面标签题目改掉
					break;
				}
			}
		}
	}
	music.ondurationchange =function(){		//duration变换时
			alltime.firstChild.nodeValue = timeTrans(music.duration);
}
	



function addLoadEvent (func) {                         //用于onload加载多个函数
	var oldonload = window.onload;						//用法有addLoadEvent(firstFunction);
	if(typeof window.onload != 'function'){				//addLoadEvent(secondFunction);
		window.onload= func;
	}else {
		window.onload =function(){
			oldonload();
			func();
		}
	}

}

function processMove(){		//设置进度条和当前音乐时间随着时间变化而变化
	var music =document.getElementById("music");
	var current=document.getElementById("current");
	var music_time = timeTrans(music.currentTime);		//将currenttime转换为00:00形式
	current.firstChild.nodeValue = music_time;
	var music_process = document.getElementById("bar");
	var process_width = music.currentTime/music.duration *100 ;		
	music_process.setAttribute("style", "width:"+ process_width + "%;")
	var music_src = music.getAttribute("src");
}

function processPrepare(){
	var music =document.getElementById("music");
	var interval = setInterval(processMove,500);
	music.onplay =function(){
		interval = setInterval(processMove,500);
	}
	music.onended = function(){
		music.currentTime =0;
		var btt = document.getElementsByClassName("control")[0];
		var musicprocess = document.getElementsByClassName("musicprocess")[0];
		var musicpic = document.getElementsByClassName("musicpic")[0];
		music.pause();
		ispaused = true;
		clearInterval(interval);
	}

}


function processClick(){		//点击进度条时跳转
	var music= document.getElementById("music");
	var music_process = document.getElementById("MusicProgress");
	var bar = document.getElementById("bar");
	music_process.onclick = function(e){
		var el =e.clientX - getOffset(this)[0];		
		var current_pct = el/music_process.offsetWidth ;
		music.currentTime =current_pct* music.duration;		//根据进度条的百分比调整此时音乐时间
		
	}
}



function timeTrans(value){		//将秒数转换为00:00的形式(超过一个小时的音频会有bug)
	var sec = Math.floor(value)%60 ;
	var min = Math.floor(Math.floor(value)/60) ;
	if(sec < 10) sec = "0"+sec ;
	if(min < 10) min = "0"+min ;
	var result = min +":" + sec ;
	return result;
 }

 function getOffset(obj)   //获取任意元素的offsetLeft/offsetTop值(摘抄) 
{  
    var arr=[]  ;
    var offsetL=0  ;
    var offsetT=0  ;
    while(obj!=window.document.body&&obj!=null)  
    {  
        offsetL+=obj.offsetLeft  ;
        offsetT+=obj.offsetTop  ;
        obj=obj.offsetParent  ;
    }  
    arr.push(offsetL,offsetT)  ;
    return arr ; 
}  



function getList(){	//菜单左右切换 
	var leftBtt = document.getElementById("leftbtt");
	var rightBtt = document.getElementById("rightbtt");
	var listmenu = document.getElementById("listmenu");
	var asides = document.getElementsByTagName("aside");
	var asides_lenth = (asides.length-1)* 100;  //总长度
	var final_right;
	const showpositon =document.querySelector("#show");
	let playing =document.querySelector(".highlight");
	let playlist = playing.parentNode.parentNode;
	var listmove = function (whichside){
			let right = parseInt(listmenu.getAttribute("style").split(":")[1].split("%")[0]);	//此时绝对定位的right值
			if(right%100 == 0){
				if(whichside=="left"){	//只有right为100的整数时才设置最终最终right防止连续点击动画错乱
					final_right =right - 100;
				}else if (whichside =="right") {
					final_right =right + 100;
				}						
			}	
			var time1 = setInterval(function(){			//设置延迟动画 每30ms执行一次
				if (whichside=="left") {
					dist = Math.ceil((right-final_right)/5);	
					right -=dist;					//造成先快后慢
				}else if (whichside=="right") {
					dist = Math.ceil((final_right-right)/5);
					right +=dist;
				}
				listmenu.setAttribute("style", "right:"+right +"%;");	//设置每30ms此时的菜单位置
				if (right==final_right) {			//如果到达最终位置停止动画
					clearInterval(time1);			
				}
				if(whichside == "left"){
					if(final_right  !== 0){			//当最终位置不为0时 使左右键存在
						rightBtt.style.display ="inline-block";
						leftBtt.style.display = "inline-block";
					}else {
						leftBtt.style.display = "none";
					}
				}else  if(whichside == "right"){
					if(final_right !== asides_lenth){
						leftBtt.style.display ="inline-block";
						rightBtt.style.display = "inline-block";
					}else {
						rightBtt.style.display = 'none';
					}
				}
			}, 30);
		}
	leftBtt.onclick = function(){		//点击菜单向左按钮
			listmove("left");
	}
	rightBtt.onclick = function(){	//点击菜单向右
			listmove("right");
	}
	showpositon.onclick = function(){		//显示当前歌曲所在的菜单位置
		let playing =document.querySelector(".highlight");
		let playlist = playing.parentNode;
		let rights = parseInt(listmenu.getAttribute("style").split(":")[1].split("%")[0]);
		let final_rights;
		if (!playing || !playlist) return;
		for (let i = 0; i < asides.length; i++) {
			if (asides[i]==playlist) {
				final_rights = i*100;
				if(rights > final_rights){
					let time2 = setInterval(function(){
						dist = Math.ceil((rights-final_rights)/5);	
						rights -=dist;					//造成先快后慢
						listmenu.setAttribute("style", "right:"+rights +"%;");
						if (rights ==final_rights) {			//如果到达最终位置停止动画
							clearInterval(time2);			
						}
					},30);
					if(final_rights  !== 0){			//当最终位置不为0时 使左右键存在
						rightBtt.style.display ="inline-block";
						leftBtt.style.display = "inline-block";
					}else {
						leftBtt.style.display = "none";
						rightBtt.style.display ="inline-block";
					}
				}else if(rights < final_rights){
					let time2 = setInterval(function(){
						dist = Math.ceil((final_rights-rights)/5);	
						rights +=dist;					//造成先快后慢
						listmenu.setAttribute("style", "right:"+rights +"%;");
						if (rights==final_rights) {			//如果到达最终位置停止动画
							clearInterval(time2);			
						}
					},30);
					if(final_rights  !== asides_lenth){			//当最终位置不为0时 使左右键存在
						rightBtt.style.display ="inline-block";
						leftBtt.style.display = "inline-block";
					}else {
						leftBtt.style.display = "inline-block";
						rightBtt.style.display ="none";
					}
				}else {
					return;
				}
			}
		}
	}
}


function voiceControl(){		//音量控制
	const voicebar = document.querySelector("#voicebar");
	const VoiceProgress = document.querySelector("#VoiceProgress");
	const music =document.querySelector("#music");
	const voiceico = document.querySelector("#voiceico");
	const volicon =document.querySelector(`#volicon`);
	let voice_pct =music.volume;		//用于记录音乐音量
	VoiceProgress.onclick = function(e){
		let el = e.clientX - getOffset(this)[0];
		voice_pct = el/VoiceProgress.offsetWidth ;
		music.volume =voice_pct;
		voicebar.setAttribute("style", "width:"+ voice_pct*100 +"%;");
	};
	voiceico.onclick = function(){
		if (music.volume == 0) {
			if (voice_pct == 0) {
				music.volume =0.2;
			}else {
				music.volume = voice_pct;
			}
		}else {
			music.volume =0;
		}
	};
	music.onvolumechange = function(){
		voicebar.setAttribute("style", "width:"+ music.volume*100 +"%;");
		document.querySelector("#volume").lastChild.nodeValue =Math.ceil(music.volume *100) +"";
		if (music.volume <= 1 && music.volume > 0.5) {
			volicon.setAttribute("class","fa fa-volume-up" );
		}else if (music.volume <= 0.5&& music.volume> 0) {
			volicon.setAttribute("class","fa fa-volume-down" );
		}else {
			volicon.setAttribute("class","fa fa-volume-off" );
		}
	}
}

function songtrans(){
	const next = document.querySelector("#next");
	const back = document.querySelector("#back");
	let items = document.querySelectorAll(".item");
	next.onclick = () => {
		for (let i = 0; i < items.length; i++) {
			if (items[i].getAttribute("class").indexOf("highlight") != -1) {
				if(i != items.length-1){
					music.setAttribute("src", items[i+1].getAttribute("links"));
				}else {
					alert("没有音乐了");
				}
			}
		}
	}
	back.onclick = () =>{
		for (let i = 0; i < items.length; i++) {
			if (items[i].getAttribute("class").indexOf("highlight") != -1) {
				if(i != 0){
					music.setAttribute("src", items[i-1].getAttribute("links"));
				}else {
					alert("没有音乐了");
				}
			}
		}
	}
}

function modeChange(){			//音乐模式
	const  modes =document.querySelectorAll(".mode");
	const  once = document.querySelector("#once"); 
	const  once_cycle = document.querySelector("#once-cycle"); 
	const  list_play = document.querySelector("#list-play"); 
	const  list_cycle = document.querySelector("#list-cycle"); 
	const btt = document.querySelector("#control");
	const musicprocess = document.querySelector(".musicprocess");
	const musicpic = document.querySelector(".musicpic");
	const items =document.querySelectorAll(".item");
	once.onclick = function(){
		if (this.getAttribute("class").indexOf("light") == -1) {
			for (var i = 0; i < modes.length; i++) {
				modes[i].setAttribute("class", "mode");
			}
			this.setAttribute("class", "mode light");
			music.onended = function(){
				music.currentTime =0;
				musicprocess.setAttribute("class", "musicprocess rotate pause");
				musicpic.setAttribute("class", "musicpic rotate pause");
				btt.setAttribute("src", "image/play.png");
			}
		}else {
			return;
		}
	}
	once_cycle.onclick = function(){
		if (this.getAttribute("class").indexOf("light") == -1) {
			for (var i = 0; i < modes.length; i++) {
				modes[i].setAttribute("class", "mode");
			}
			this.setAttribute("class", "mode light");
			music.onended = function(){
				music.currentTime = 0;
				music.play();
			}
		}else {
			return;
		}
	}
	list_play.onclick = function(){
		if (this.getAttribute("class").indexOf("light") == -1) {
			for (let i = 0; i < modes.length; i++) {
				modes[i].setAttribute("class", "mode");
			}
			this.setAttribute("class", "mode light");
			music.onended = function(){
				for(let i=0 ; i<items.length ;i++){
					if (items[i].getAttribute("class").indexOf("highlight")!=-1) {
						if (i+1 != items.length) {
							music.setAttribute("src", items[i+1].getAttribute("links"));
							ispaused =false;
						}else {
							alert("列表播放完了");
							music.setAttribute("src", items[0].getAttribute("links"));
							ispaused =true;
						}
					}
				}
				
			}
		}			
	}
	list_cycle.onclick = function(){
		if (this.getAttribute("class").indexOf("light") == -1) {
			for (let i = 0; i < modes.length; i++) {
				modes[i].setAttribute("class", "mode");
			}
			this.setAttribute("class", "mode light");
			music.onended = function(){
				for(let i=0 ; i<items.length ;i++){
					if (items[i].getAttribute("class").indexOf("highlight")!=-1) {
						if (i+1 != items.length) {
							music.setAttribute("src", items[i+1].getAttribute("links"));
							ispaused = false;
						}else {
							music.setAttribute("src", items[0].getAttribute("links"));
							ispaused = false;
						}
					}
				
				}
				
			}
		}			
	}
}



addLoadEvent(PlayMusic);
addLoadEvent(prepareChose);
addLoadEvent(processPrepare);
addLoadEvent(processClick);
addLoadEvent(getList);
addLoadEvent(voiceControl);
addLoadEvent(songtrans);
addLoadEvent(modeChange);
