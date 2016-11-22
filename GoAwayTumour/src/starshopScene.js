
var StarShopLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;


        return true;
    }
});

var StarShopScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new StarShopLayer();
        this.addChild(layer);
    }
});

