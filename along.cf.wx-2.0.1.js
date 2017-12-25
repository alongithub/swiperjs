/*	along轮播插件,2017.12.14	*/
/*	轮播，可以是轮播图，视频，任意	*/
function  Alongcf(options){//构造器
	options = options || {};//参数列表
    this.options ={
        id : options.id || '',//容器id值,必须有
        dots : options.dots || false,//是否显示面板指示点,默认不显示
        dotColor : options.dotColor || 'rgba(0,0,0,0.3)',//指示点颜色,默认透明灰
        activeColor : options.activeColor || '#fff',//当前选中的指示点颜色,默认黑
        autoplay : options.autoplay || false,//是否自动轮播,默认否
        interval : options.interval || 5000,//轮播时间间隔,默认5000ms
        duration : options.duration || 500,//图片滑动时间,默认500ms
        circular : options.circular || false,//是否采用衔接滑动,默认否
        //vertical : options.vertical || false,//是否纵向切换,默认否
        holding : options.holding || false,//是否在鼠标滑过时清除自动轮播,默认否
        touchMove : options.touchMove || false,//是否开启拖拽,默认否
        siderBar : options.siderBar || false//是否添加左右切换按钮
    }
}
Alongcf.prototype = {
	init:function(){
		this.box = document.getElementById(this.options.id);//通过传入的id获取轮播容器
		if(!this.box){//如果id错误,控制台提示ID错误信息
			console.log("请传入正确的id,格式为 var objName = new Along({'id':'along'[,'time':3000]})");
			return;
		}
		this.createDom();//结构层创建DOM结构
		this.addStyle();//表现层添加节点样式
		/*行为层*/
		this.index = this.options.circular?1:0;//记录当前轮播的下标
		if(this.options.dots) this.addBtns();//是否添加面板点
		if(this.options.autoplay) this.imgAuto();//是否自动轮播
		if(this.options.holding) this.mouseInOut();//是否添加鼠标滑过事件
		if(this.options.touchMove) this.touchMove();//是否开启拖拽
		if(this.options.siderBar) this.siderBar();//是否添加左右切换按钮
		this.onoff = true;
	},
	
	createDom:function(){
		this.longBox = document.createElement('div');
		this.longBox.className = 'alongcf-wrapper';
		

		this.width = this.box.offsetWidth;//获取轮播容器宽度
		this.height = this.box.offsetHeight;//获取轮播容器高度
		this.imgs = this.box.getElementsByClassName('along-cf');//通过class获取每一个轮播元素
		this.length = this.imgs.length;//轮播元素个数
		//无缝衔接
		if(this.options.circular){

			this.imgBefore = this.imgs[0].outerHTML;
			this.imgAfter = this.imgs[this.length-1].outerHTML;
			this.longBox.innerHTML =this.imgAfter + this.box.innerHTML + this.imgBefore;
		}else{
			this.longBox.innerHTML = this.box.innerHTML;
		}

		this.windows = document.createElement('div');
		this.windows.className = 'alongcf-window';
		this.windows.appendChild(this.longBox);
		// this.imgs = none;
		this.box.innerHTML = '';
		this.box.appendChild(this.windows);
	},
	addStyle:function(){
		var alongcf_window = '#'+this.options.id+' .alongcf-window{position: relative;height: 100%;width: 100%;box-shadow: 0 0 5px #000;overflow: hidden;}';
		var alongcf_wrapper = '#'+this.options.id+' .alongcf-wrapper{position: absolute;width: '
							+100*(this.options.circular?this.length+2:this.length)+'%;height: 100%;left: -'
							+100*(this.options.circular?1:0)+'%;top: 0;transition: '+this.options.duration+'ms}';
		var along_cf = '#'+this.options.id+' .along-cf{width: '+1/(this.options.circular?this.length+2:this.length)*100+'%;height: 100%;float: left;}'
		document.styleSheets[0].insertRule(alongcf_window,0);
		document.styleSheets[0].insertRule(alongcf_wrapper,0);
		document.styleSheets[0].insertRule(along_cf,0);
		if(this.options.dots)
		{
			document.styleSheets[0].insertRule('#'+this.options.id+' .alongcf-btns{position: absolute;bottom: 0;left: 0;width:100%;text-align: center;}',0);
			document.styleSheets[0].insertRule('#'+this.options.id+' .alongcf-btn{display: inline-block;height: 5px;width:5px;margin: 0 5px;background: '+this.options.dotColor+';border: 1px solid #fff;border-radius: 50%;cursor: pointer;}',0);
			document.styleSheets[0].insertRule('#'+this.options.id+' .alongcf-btn-on{display: inline-block;height: 5px;width:5px;margin: 0 5px;background: '+this.options.activeColor+';border: 1px solid #fff;border-radius: 50%;cursor: pointer;transform:scale(1.1)}',0);
		}
	},
	changeImg:function(index){
		console.log('换图');
		if(this.options.circular){
			if(this.onoff){
				this.onoff = false;
				this.longBox.style.left=-index*100+'%';
				var that = this;
				setTimeout(function(){
					that.longBox.style.transition = '0s';
					if(index == that.length+1){
						index = 1;
					}
					if(index == 0){
						index = 4;
					}
					that.longBox.style.left = -index*100+"%";
					that.index = index;
					setTimeout(function(){
						that.longBox.style.transition = that.options.duration+'ms';
						that.onoff = true;
						if (that.options.dots) {
							that.changeBtn();
						}
						if (that.options.autoplay) that.imgAuto();
					},30)
				},500)
			}
		}else{
			if(index>=this.length) index=0;
			if(index<0) index = this.length-1;
			console.log('changeImg'+index)
			this.index = index;
			this.longBox.style.left=''+(-this.index*100)+'%';
			if (this.options.dots) {
				this.changeBtn();
			}
		}
	},
	imgAuto:function(){
		clearInterval(this.timer);
		this.timer = setInterval(function(){
			this.changeImg(this.index+1);
		}.bind(this),this.options.interval)
	},
	siderBar:function(){
		this.box.span = new Array();
		this.box.span[0] = document.createElement('span');
		this.box.span[0].className = 'alongcf-side-lt alongcf-side';
		this.box.span[0].innerHTML = '<';
		this.box.span[1] = document.createElement('span');
		this.box.span[1].className = 'alongcf-side-rt alongcf-side';
		this.box.span[1].innerHTML = '>';
		this.windows.appendChild(this.box.span[0]);
		this.windows.appendChild(this.box.span[1]);
		document.styleSheets[0].insertRule('#'+this.options.id+' .alongcf-side{position: absolute;height: 80px;width: 50px;line-height: 80px;background: rgba(0,0,0,0);top: 50%;text-align: center;font-size: 30px;color: #000;transform:  translateY(-50%);transition: 0.2s;cursor: pointer;font-family: "宋体";font-weight: 900;text-shadow:0 0 5px #fff}',0);
		document.styleSheets[0].insertRule('#'+this.options.id+' .alongcf-side:hover{background: rgba(0,0,0,0.3);color: #fff;}',0);
		document.styleSheets[0].insertRule('#'+this.options.id+' .alongcf-side-rt{right:2%;}',0);
		document.styleSheets[0].insertRule('#'+this.options.id+' .alongcf-side-lt{left:2%;}',0)
		this.box.span[0].onclick = function(){
			this.changeImg(this.index-1);
		}.bind(this);
		this.box.span[1].onclick = function(){
			this.changeImg(this.index+1);
		}.bind(this);
	},
	addBtns:function(){
		this.box.p = document.createElement('p');
		this.box.p.className = 'alongcf-btns';
		this.btns = new Array();
		for(var i = 0;i<this.length;i++)
		{
			this.btns[i] = document.createElement('span');
			if(i==0){
				this.btns[i].className = 'alongcf-btn-on';
			}else{
				this.btns[i].className = 'alongcf-btn';
			}
			this.box.p.appendChild(this.btns[i]);
		}
		this.windows.appendChild(this.box.p);
		var that = this;
		for(var i = 0;i<this.length;i++){
			this.btns[i].onclick = (function(a){
				return function(){
					console.log('按钮点击')
					if (that.options.autoplay) that.imgAuto();
					that.index =that.options.circular? a+1:a;
					that.changeImg(that.index);

					/*这块有点臃肿*/
					for(var i = 0;i<that.length;i++){
						that.btns[i].className = 'alongcf-btn';
					}
					that.btns[that.options.circular?that.index-1:that.index].className = 'alongcf-btn-on';
				}
			})(i);
		}
	},
	changeBtn:function(){
		for(var i = 0;i<this.length;i++){
			this.btns[i].className = 'alongcf-btn';
		}
		this.btns[this.options.circular?this.index-1:this.index].className = 'alongcf-btn-on';
	},
	mouseInOut:function(){
		var that = this;
		this.box.onmouseover = function(){
			clearInterval(that.timer);
		}
		this.box.onmouseout = function(){
			that.imgAuto();
		}
	},
	touchMove:function(){
		//禁止拖拽图片后新窗口打开的事件
		this.images = this.longBox.getElementsByTagName('img');
		for(var i = 0;i<this.images.length;i++){
			this.images[i].ondragstart=function (){return false;};
		}
		var that = this;
		var startX;
		var disX;
		var endX;
		this.box.onmousedown = function(e){
			console.log("touch事件")
			if(that.onoff){
				var e = e||event;
				startX = e.clientX;
				var disX = 0;

				console.log('down'+startX)
				that.box.onmousemove = function(e){
					var e = e||event;
					var endX = e.clientX;
					disX = endX - startX;
					if (Math.abs(disX)>10) {
						that.longBox.style.left = 'calc(-'+100*that.index+'% + '+disX+'px)'
						that.longBox.style.transition = '0s';
					}
				}
				that.box.onmouseup = function(e){
					var e = e||event;
					that.longBox.style.transition = that.options.duration+'ms';
					that.box.onmouseup = null;
					that.box.onmousemove = null;
					console.log('抬起');
					if(Math.abs(disX)>10){
						if(disX>(that.width/2)){
							that.changeImg(that.index-1);
						}
						else if (disX<(-that.width/2)&&Math.abs(disX)>20) {
							that.changeImg(that.index+1);
						}else{
							that.changeImg(that.index);
						}
					}
						
				}
			}
		}
		//添加手机端touch事件
		that.box.addEventListener("touchstart", function(e) {
		  	if (that.onoff) {
			  	var touches = e.touches[0];
			  	startX = 0;
			  	endX = 0;
			  	disX = 0;
			   	startX = touches.clientX;
		    
		  	}
		},false)
		that.box.addEventListener("touchmove", function(e) {
		    var touches = e.touches[0];
		    if(that.onoff){
			  	endX = touches.clientX;
			  	disX = endX - startX;
			  	if (Math.abs(disX)>10) {
					that.longBox.style.left = 'calc(-'+100*that.index+'% + '+disX+'px)'
					that.longBox.style.transition = '0s';
				}
			    //event.preventDefault();
		    }

		},false);
		that.box.addEventListener("touchend",function() {
			if(that.onoff){
				that.longBox.style.transition = that.options.duration+'ms';
				if(Math.abs(disX)>10){

					if(disX>(that.width/4)){
						that.changeImg(that.index-1);
					}
					else if (disX<(-that.width/4)&&Math.abs(disX)>20) {
						that.changeImg(that.index+1);
					}else{
						that.changeImg(that.index);
					}
				}
			}
		},false);
	}
}

