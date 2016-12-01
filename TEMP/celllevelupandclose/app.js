
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;

        // 创建瓦片地图
        var test = new cc.TMXTiledMap(res.Level_tmx);
        this.addChild(test);

        var mapSize = test.getMapSize();
        var tileSize = test.getTileSize();

        // 创建一个细胞精灵
        var cell = new MyCell(res.Cell);
        cell.x = size.width/2; // -150
        cell.y = size.height/2-50;
        this.addChild(cell);







        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

