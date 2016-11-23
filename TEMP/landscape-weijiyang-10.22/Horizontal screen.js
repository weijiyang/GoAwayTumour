var HorizontalScreenLayer = cc.Layer.extend({
    sprite:null,
    ttf:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;
        var background=new cc.LayerColor(cc.color.RED);
        var ttf=new cc.LabelTTF("我要是横屏效果！");
        ttf.x=size.width/2;
        ttf.y=size.height/2;
        ttf.setFontSize(100);
        ttf.setFontFillColor(cc.color.WHITE);
        this.addChild(background);
        this.ttf=ttf;
        this.addChild(this.ttf);



        // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "setPortraitOrientation", "()V");
        // //通知android改成竖屏
        // jsb.reflection.callStaticMethod(className, methodName, "(Ljava/lang/String;)V", str);
        // var size = cc.view.getFrameSize();
        // cc.view.setFrameSize(size.height, size.width);
        // //更改分辨率成竖屏的分辨率
        // cc.view.setDesignResolutionSize(720, 1280, cc.ResolutionPolicy.SHOW_ALL);
        
        
        
        
        
        
        //
        // cc.log(window.orientation);
        // window.addEventListener("orientationchange", function(event){
        //     if ( window.orientation == 180 || window.orientation == 0 )
        //     {
        //         alert("竖屏");
        //     }
        //     if( window.orientation == 90 || window.orientation == -90 )
        //     {
        //         alert("横屏");
        //     }
        // });
        //



        return true;
    }
});

var HorizontalScreenScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HorizontalScreenLayer();
        this.addChild(layer);
    }
});

