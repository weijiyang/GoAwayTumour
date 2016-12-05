//掉血demo-----进度条的变化

var dropBloodLayer = cc.Layer.extend({
    sprite:null,
    timer:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;
        var drop = new cc.Sprite(res.dropBlood);

        //进度条(也是需要动作的)
        var timer = new cc.ProgressTimer(drop);
        timer.x = size.width/2;
        timer.y = size.height/2;
        timer.type = cc.ProgressTimer.TYPE_BAR;//进度条的形式(由里向外)
        timer.midPoint = cc.p(0,0);//中间点
        timer.barChangeRate = cc.p(1,0);//改变率，指方向（x，y）
        this.timer = timer;
        // this.blood = blood;
        this.addChild(timer);
        //可变
        // var per = (blood / allBlood)*100;
        var timerAction = cc.progressFromTo(2.0,100,50);//2秒内，百分比到另一个百分比
        timer.runAction(timerAction);
    }
});

var dropBloodScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new dropBloodLayer();
        this.addChild(layer);
    }
});