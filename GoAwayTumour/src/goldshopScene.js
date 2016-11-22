
var GoldShopLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;


        return true;
    }
});

var GoldShopScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GoldShopLayer();
        this.addChild(layer);
    }
});

