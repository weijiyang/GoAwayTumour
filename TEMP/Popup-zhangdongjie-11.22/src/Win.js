/**
 * Created by 张东杰 on 2016/11/21.
 */
var WinLayer = cc.Layer.extend({
    sprite:null,
    stars:[],
    ctor:function () {
        this._super();
        var size = cc.winSize;

        //胜利背景图
        var bg = new cc.Sprite(res.Win_png);
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        bg.setScale(1.2);
        bg.setAnchorPoint(0.5,0.5);
        this.addChild(bg);

        //星星
        for(var i=0;i<3;i++){
            this.stars[i] = new cc.Sprite("res/star"+(i+1)+".png");
            this.stars[i].x = size.width*(0.1*i+0.4);
            this.stars[i].y = size.height*(0.6);
            this.stars[i].setScale(1.2);
            this.addChild(this.stars[i]);
        }

        //重新选关按钮
        var selectItem = new cc.MenuItemImage(res.SelectNormal_png,res.SelectSelected_png, function () {
            cc.log("跳转到选关界面");
        }, this);

        //继续游戏按钮
        var continueItem = new cc.MenuItemImage(res.ContinueNormal_png,res.ContinueSelected_png, function () {
            cc.log("跳转到下一关界面");
        }, this);

        var menu = new cc.Menu(selectItem, continueItem);
        menu.y = size.height *0.3;
        menu.x = size.width *0.5;
        continueItem.setScale(1.0);
        selectItem.setScale(1.0);
        menu.alignItemsHorizontallyWithPadding(50);
        this.addChild(menu);

        return true;
    }
});

var WinScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new WinLayer();
        this.addChild(layer);
    }
});

