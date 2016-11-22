
var TumourDetailLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;


        return true;
    }
});

var TumourDetailScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new TumourDetailLayer();
        this.addChild(layer);
    }
});

