/**
 * Created by lenovo on 2016/11/23.
 */

var MusicLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;

        //音乐开关
        var onItem = new cc.MenuItemImage(res.XiBao3_png, res.XiBao32_png, function () {
        }, this);

        //菜单
        onItem.x = size.width*0.54;
        onItem.y = size.height*0.59;

        var menu = new cc.Menu(onItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu);

        return true;
    }
});

var CellScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new CellLayer();
        this.addChild(layer);
    }
});