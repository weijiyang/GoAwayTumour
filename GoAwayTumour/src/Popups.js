var Popups = cc.Layer.extend({

	listener : null,			//事件对象
	tcLayer : null,				//传进来的layer
	blackLayer : null,			//黑色遮罩
	flag : false,				//如果为真，则代弹窗被关闭掉
	touchbg_flag : false,		//如果为真，当点击黑色背景层的时候，弹窗会关掉. 默认为false
	isShow : true,				//弹窗一开始是否为可见,默认为true

	ctor : function(layer, isShow, touchbg_flag) 
	{

		this._super();

		//初始化属性
		this.setLocalZOrder(10000);
		if (typeof touchbg_flag != 'undefined') {
			this.touchbg_flag = touchbg_flag;
		}
		if (typeof isShow != 'undefined') {
			this.isShow = isShow;
		}
		this.visible = this.isShow;

		//
		this.tcLayer = layer;
		layer.setLocalZOrder(9999);
		this.addChild(layer);

		//
		this.initBlackLayer();
	},

	//初始化黑色遮罩
	initBlackLayer : function()
	{
		this.blackLayer = new cc.LayerColor(cc.color(0,0,0,120));
		if (this.isShow) 
		{
			this.show();
		}
		this.addChild(this.blackLayer);	
	},

	//添加事件,使弹窗下面的按钮无法被点击
	addListener : function(self)
	{
		this.listener = cc.EventListener.create({
		    event: cc.EventListener.TOUCH_ONE_BY_ONE,		
		    swallowTouches: true,           																			               
		    onTouchBegan: function (touch, event) 
		    {
		    	//如果touchbg_flag为真， 则代表点击黑色遮罩的时候，弹窗也会被关闭掉
		    	if (self.touchbg_flag) 
		    	{
		    		var x = self.tcLayer.x;
			    	var y = self.tcLayer.y;
			    	var w = self.tcLayer.width;
			    	var h = self.tcLayer.height;
			    	var tx = parseInt(touch.getLocation().x);
			    	var ty = parseInt(touch.getLocation().y);

			    	if ( tx >= x && tx <= x + w && ty >= y && ty <= y + h ) 
			    	{

			    	}
			    	else
			    	{
			    		self.flag = true;
			    		self.hidden(self);
			    	}
		    	}

		        return true;    									
		    },

		    onTouchEnded: function (touch, event) 
		    {	
		    	if (self.touchbg_flag && self.flag) 
		    	{
		    		 self.deleteListener();
		    		 self.flag = false;
		    	}
		    }
		});

		cc.eventManager.addListener(this.listener, this.blackLayer);
	},

	//删除事件
	deleteListener : function()
	{
		cc.eventManager.removeListener(this.listener);
	},

	//显示
	show : function(self, fun)
	{
		this.visible = true;

		var fadeIn = new cc.FadeTo(0.2, 120);
		this.blackLayer.runAction(fadeIn);

		this.tcLayer.scale = 0;
		var scaleTo = new cc.ScaleTo(0.4, 1).easing(cc.easeElasticOut(0.7)) ;
		var func = new cc.CallFunc(function(e){		

			 if (typeof fun != 'undefined') 
			 {
			 	 fun();
			 }
		}); 

		var seq = new cc.Sequence(scaleTo, func);
		this.tcLayer.runAction(seq);
		this.addListener(self);
	},

	//隐藏
	hidden : function(self, fun)
	{	
		var scaleTo = new cc.ScaleTo(0.4, 0).easing(cc.easeElasticOut(0.7)) ;
		var func = new cc.CallFunc(function(e){	

			 self.deleteListener();
			 self.visible = false;
			 if (typeof fun != 'undefined') 
			 {
			 	 fun();
			 }
		}); 

		var seq = new cc.Sequence(scaleTo, func);  
		this.tcLayer.runAction(seq);
		var fadeOut = new cc.FadeOut(0.2);
		this.blackLayer.runAction(fadeOut);
	}

});