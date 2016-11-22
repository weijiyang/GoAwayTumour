
var LevelLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;


        return true;
    }
});

var LevelScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new LevelLayer();
        this.addChild(layer);
    }
});

