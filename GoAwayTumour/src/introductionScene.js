
var IntroductionLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;


        return true;
    }
});

var IntroductionScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new IntroductionLayer();
        this.addChild(layer);
    }
});

