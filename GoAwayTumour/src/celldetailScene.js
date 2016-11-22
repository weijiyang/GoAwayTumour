
var CellDetailLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;


        return true;
    }
});

var CellDetailScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new CellDetailLayer();
        this.addChild(layer);
    }
});

