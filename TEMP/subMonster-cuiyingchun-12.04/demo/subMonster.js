var subLayer = cc.Layer.extend({
    sprites:[],
    ctor:function () {
        this._super();
        var size = cc.winSize;
        this.addChild(new cc.LayerColor(cc.color.WHITE));
        var sprites = new subMonster(res.B11);
        sprites.x = size.width * 0.5;
        sprites.y = size.height * 0.5;
        this.sprites = sprites;
        this.addChild(sprites);
        //动画（帧动画）
      /*  var animation = new cc.Animation();
         for(var j=0;j<3;j++){
         var frameName = res["B1"+j];
         animation.addSpriteFrameWithFile(frameName);
         }
         animation.setDelayPerUnit(1/8);//多少时间执行一帧,1秒超过24帧，就认为是动画
         animation.setRestoreOriginalFrame(true);//是否回到第一帧

         var run = cc.animate(animation);
         this.sprites.runAction(run.repeatForever());*/
        sprites.playRunAnimation("B1");
        sprites.dropBlood();
    }
});

var subScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new subLayer();
        this.addChild(layer);
    }
});