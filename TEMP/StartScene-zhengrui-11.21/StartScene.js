/**
 * Created by 郑蕊 on 2016/11/21.
 */
var StartLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        var size = cc.winSize;
        //开始页面背景
        var startbg = new cc.Sprite(res.startbg);
        startbg.x=size.width*0.5;
        startbg.y=size.height*0.5;
        this.addChild(startbg);

        //滚蛋吧 肿瘤君！游戏名称
        var logo = new cc.LabelTTF("滚蛋吧 肿瘤君！");
        logo.setFontSize(size.width*0.05);
        logo.enableStroke(cc.color.GREEN, 5);
        logo.x = size.width * 0.5;
        logo.y = size.height * 0.7;
        this.addChild(logo);

        //开始游戏按钮
        var startItem = new cc.MenuItemImage(res.startbtn, function () {
            //进入选关页面接口
            this.director.runScene(new MainScene());
        }, this);
        var menu1 = new cc.Menu(startItem);
        menu1.y = size.height * 0.2;
        this.addChild(menu1);

        //关于我们按钮
        var aboutUsItem = new cc.MenuItemImage(res.aboutusbtn, function () {
            //弹出关于我们对话框
            this.director.runScene(new MainScene());
        }, this);
        var menu2 = new cc.Menu(aboutUsItem);
        menu2.x = size.width*0.8;
        menu2.y = size.height * 0.9;
        this.addChild(menu2);






        return true;
    }
});

var StartScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new StartLayer();
        this.addChild(layer);
    }
});
