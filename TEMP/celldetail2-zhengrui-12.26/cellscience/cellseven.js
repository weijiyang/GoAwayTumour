/**
 * Created by DELL on 2016/12/4.
 */
/**
 * Created by DELL on 2016/12/4.
 */


var CellsevenLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;
        //图鉴背景图层
        var pokedexbg = new cc.Sprite(res.cellsciencebg7);
        pokedexbg.x=size.width*0.5;
        pokedexbg.y=size.height*0.5;
        //pokedexbg.setAnchorPoint(0,0);
        this.addChild(pokedexbg);

        //返回按钮
        var press= new cc.MenuItemImage(res.pressed, res.pressed2, function () {
            //王凯名 添加了音效判断2016/12/8
            EffectEngine.playEffect(res.Select);
            //详情介绍接口
            // cc.log("显示详情");
            cc.director.runScene(new CellDetailScene());
        }, this);
        press.x = pokedexbg.width*0.1;
        press.y = pokedexbg.height*0.93;
        var menu0 = new cc.Menu(press);
        menu0.x = 0;
        menu0.y = 0;
        pokedexbg.addChild(menu0);

        return true;
    }
});

var CellsevenScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new CellsevenLayer();
        this.addChild(layer);
    }
});


