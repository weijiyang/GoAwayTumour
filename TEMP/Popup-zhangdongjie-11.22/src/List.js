/**
 * Created by 张东杰 on 2016/11/21.
 */
var ListLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;

        //列表背景图
        var list = new cc.Sprite(res.List_png);
        list.x = cc.winSize.width / 2;
        list.y = cc.winSize.height / 2;
        list.setScale(1.2);
        list.setAnchorPoint(0.5,0.5);
        this.addChild(list);

        //重新选关
        var selectItem = new cc.MenuItemImage(res.SelectNormal_png,res.SelectSelected_png, function () {
            cc.log("跳转到选关界面");
        }, this);

        //继续游戏
        var continueItem = new cc.MenuItemImage(res.ContinueNormal_png,res.ContinueSelected_png, function () {
            cc.log("跳转到继续游戏界面");
        }, this);

        //重新开始
        var repeatItem = new cc.MenuItemImage(res.RepeatNormal_png,res.RepeatSelected_png, function () {
            cc.log("跳转到游戏开始界面");
        }, this);

        var menu = new cc.Menu(selectItem, continueItem,repeatItem);
        menu.y = size.height *0.45;
        menu.x = size.width *0.5 ;
        repeatItem.setScale(1.5);
        continueItem.setScale(1.5);
        selectItem.setScale(1.5);
        menu.alignItemsVerticallyWithPadding(40);
        this.addChild(menu);

        return true;
    }
});

var ListScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new ListLayer();
        this.addChild(layer);
    }
});

