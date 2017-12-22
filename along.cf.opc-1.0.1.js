/*	╭═══════════════════════════════════════════════════════════════════════════════════════════╮
	║       AUTHOR BY Along 2017.11.24                                							║
	║                                                                              				║
	║    	QQ:1792108796  GITHUB:github.com/alongithub  BLOG:www.alongside.cn   				║
	║		_____________________________________________________________________________		║
	║																							║
	║		使用方式:          								 									║
	║		1、html部分写一个容器，给id	,给宽高					                    			║
	║		2、容器里添加至少两张图片	<img />	<img />…… 										║
	║		3、html底部引入 along.cf.opc-1.0.1.js												║
	║		4、在引入的js之后写script，内容为两步												║
	║			4.1、var 变量名 = new Along(json);  严格区分大小写								║
	║				1)、参数json的格式为   {'id':'你的容器的id值','time':你想设置的轮播时间}	║
	║				2)、参数json中time属性可以不给，默认5秒 {'id':'你的容器的id值'}				║
	║			4.2、变量名.init();																║
	║		5、最后一步，你需要检查自己的html整个文档中是否存在<style>标签，如果没有，在<body>	║
	║			之前添加一个空的<style></style>													║
	║		_____________________________________________________________________________   	║
	║																							║
	║		举个栗子:      																		║
	║		<style></style>																		║
	║		<body>																				║
	║			<div id="along" style="height: 500px;width:500px;">								║
	║				<img src="images/1.jpg">													║
	║				<img src="images/2.jpg">													║
	║			</div>																			║
	║		</body>																				║
	║		<script src = "js/along.cf.opc-1.0.1.js"></script>									║
	║		<script>																			║
	║			var along = new Along({"id":"along2"});											║
	║			along.init()																	║
	║		</script>																			║
	╰═══════════════════════════════════════════════════════════════════════════════════════════╯
*/



function  Along(options){
	options = options || {};
    this.options ={
        id : options.id || '',
        time : options.time || '5000'
    }
}
Along.prototype = {
	init:function(){
		this.box = document.getElementById(this.options.id);
		this.index = 0;
		if(!this.box){
			console.log("请传入正确的id,格式为 var objName = new Along({'id':'along'[,'time':3000]})");
			return;
		}
		this.width = this.box.offsetWidth;
		this.height = this.box.offsetHeight;
		this.imgs = this.box.getElementsByTagName('img');
		this.length = this.imgs.length;
		this.alongStyle();
		this.imgAuto();
		this.addBtns();
		this.mousein();
		this.mouseout();
	},
	imgAuto:function(){
		this.timer = setInterval(function(){
			this.changeImg(this.index+1);
		}.bind(this),this.options.time)
	},
	alongStyle:function(){
		this.box.style.cssText += "position:relative;";
		for(var i = 0;i<this.length;i++)
		{	
			this.imgs[i].style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;opacity:0;transition:0.3s;";
			if (i==0) {this.imgs[i].style.opacity = 1;}
		}
		document.styleSheets[0].insertRule('.along_btn{display: inline-block;height: 5px;width:5px;margin: 0 5px;background: rgba(0,0,0,0.8);color: #fff;line-height: 25px;font-size: 12px;border: 1px solid #fff;border-radius: 50%;cursor: pointer;}',0);
	},
	changeImg:function(index){
		this.imgs[this.index].style.opacity = 0;
		this.btns[this.index].style.cssText = '';
		if(index==this.length) index=0;
		this.index = index;
		this.imgs[this.index].style.opacity = 1;
		this.btns[this.index].style.cssText = 'background: #fff;transform: scale(1.1);';
	},
	addBtns:function(){
		this.box.str = '<p style= "position: absolute;bottom: 0;left: 0;width:100%;text-align: center;">';
		for(var i = 0;i<this.imgs.length;i++)
		{
			this.box.str += '<span class="along_btn"></span>';
		}
		this.box.str += '</p>';
		this.box.innerHTML += this.box.str;
		this.btns = this.box.getElementsByTagName('span');
		this.btns[0].style.cssText = "background: #fff;transform: scale(1.1);";
		var that = this;
		for(var i = 0;i<this.imgs.length;i++){
			this.btns[i].onclick = (function(a){
				return function(){
					that.box.index = a;
					that.changeImg(a);
				}
			})(i);
		}
	},
	mousein:function(){
		var that = this;
		this.box.onmouseover = function(){
			clearInterval(that.timer);
		}
	},
	mouseout:function(){
		var that = this;
		this.box.onmouseout = function(){
			that.imgAuto();
		}
	}
}

