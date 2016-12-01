
var HelloWorldLayer = cc.Layer.extend({
    tiledMap:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;

        this.loadTiledMap();
        //实例化一个新的精灵对象
        var newSprite = new Move(res.abc_png);
        newSprite.getArray(this.tiledMap,this.arr);
        var tileSize = this.tiledMap.getTileSize();
        var objectGroup = this.tiledMap.getObjectGroup("object");
        var player = objectGroup.getObject("player");
        newSprite.setAnchorPoint(cc.p(0,0));
        newSprite.x =player.x;
        newSprite.y =player.y;
        this.addChild(newSprite);

        newSprite.getLength(newSprite.arr);
        newSprite.times(newSprite.sort);

        return true;
    },
    //加载瓦片地图
    loadTiledMap : function(){
        var tileMap = new cc.TMXTiledMap(res.Level_tmx);
        this.tiledMap=tileMap;
        this.addChild(tileMap);
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

