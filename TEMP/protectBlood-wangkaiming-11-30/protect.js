/**
 * Created by lenovo on 2016/11/29.
 */

var HelloWorldLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.loadLoadingBar();
        var size = cc.winSize;

        /*var cell = new dropBlood(res.Xue_png);
         this.addChild(cell);
        var to1 = cc.ProgressTo.create(5, 100);  //定义好经历的时间和百分比
        var to2 = cc.ProgressTo.create(8, 100);

        var left = cc.ProgressTimer.create(cc.Sprite.create("res/xue.png"));
        left.setType(cc.PROGRESS_TIMER_TYPE_RADIAL); //设置进度的类型为扇形
        left.setPosition(cc.p(size.width/4, size.height / 2));
        this.addChild(left);
        left.runAction(to1); //执行动作*/

        return true;
    },
    loadLoadingBar:function () {
        var node = new ccui.LoadingBar();
        this.addChild(node);
        node.loadTexture("res/xue.png");
        node.setDirection(ccui.LoadingBar.TYPE_LEFT);//设置方向
        node.setPercent(100);//设置百分比
        node.setPosition(cc.winSize.width/2,cc.winSize.height/2);
    }

});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

