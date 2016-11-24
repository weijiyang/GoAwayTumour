
var LevelLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;
        //添加背景图片
        var bg = new cc.Sprite(res.stage_map_0);
        bg.setAnchorPoint(cc.p(0,0));
        this.addChild(bg,0);
        //添加左上角按钮
        var tool_leftbg = new cc.Sprite(res.stagemap_toolbar_leftbg);
        /*tool_leftbg.setAnchorPoint(cc.p(0,1));
         tool_leftbg.x = size.width*0;
         tool_leftbg.y = size.height*1;*/
        tool_leftbg.x = bg.width*0.17;
        tool_leftbg.y = bg.height*0.78;
        this.addChild(tool_leftbg,1);
        var tool_rightbg = new cc.Sprite(res.stagemap_toolbar_rightbg);
        /*tool_rightbg.setAnchorPoint(cc.p(1,1));
         tool_rightbg.x = size.width*1;
         tool_rightbg.y = size.height*1;*/
        tool_rightbg.x = bg.width*0.87;
        tool_rightbg.y = bg.height*0.77;
        this.addChild(tool_rightbg,1);
        //添加按钮
        var homeItem = new cc.MenuItemImage(res.stagemap_toolbar_home,"",function(){
            cc.log("返回主页");
            cc.director.runScene(new StartScene());
        },this);
        var homeMenu = new cc.Menu(homeItem);
        homeMenu.x = size.width*0.056;
        homeMenu.y = size.height*0.93;
        this.addChild(homeMenu,2);
        var storeItem = new cc.MenuItemImage(res.stagemap_toolbar_shop,"",function(){
            cc.log("进入商店");
        },this);
        var storeMenu = new cc.Menu(storeItem);
        storeMenu.x = size.width*0.161;
        storeMenu.y = size.height*0.93;
        this.addChild(storeMenu,2);
        var picItem = new cc.MenuItemImage(res.stagemap_toolbar_leaderboard,"",function(){
            // cc.log("排行榜/图鉴");
            cc.director.runScene(new IntroductionScene());
        },this);
        var picMenu = new cc.Menu(picItem);
        picMenu.x = size.width*0.266;
        picMenu.y = size.height*0.93;
        this.addChild(picMenu,2);
        var starItem = new cc.MenuItemImage(res.stagemap_toolbar_timer_normal,"",function(){
            cc.log("体力");
        },this);
        var starMenu = new cc.Menu(starItem);
        starMenu.x = size.width*0.56;
        starMenu.y = size.height*0.96;
        this.addChild(starMenu,2);


        //1
        var Sprite1 = new myChoose(res.stagepoint_adv);
        Sprite1.x = size.width*0.15;
        Sprite1.y = size.height*0.63;
        Sprite1.id = 1;
        this.addChild(Sprite1);
        //2
        var Sprite1 = new myChoose(res.stagepoint_adv);
        Sprite1.x = size.width*0.28;
        Sprite1.y = size.height*0.44;
        Sprite1.id = 2;
        this.addChild(Sprite1);
        //3
        var Sprite1 = new myChoose(res.stagepoint_adv);
        Sprite1.x = size.width*0.17;
        Sprite1.y = size.height*0.14;
        Sprite1.id = 3;
        this.addChild(Sprite1);
        //4
        var Sprite1 = new myChoose(res.stagepoint_adv);
        Sprite1.x = size.width*0.35;
        Sprite1.y = size.height*0.04;
        Sprite1.id = 4;
        this.addChild(Sprite1);
        //5
        var Sprite1 = new myChoose(res.stagepoint_adv);
        Sprite1.x = size.width*0.52;
        Sprite1.y = size.height*0.18;
        Sprite1.id = 5;
        this.addChild(Sprite1);
        //6
        var Sprite1 = new myChoose(res.stagepoint_adv);
        Sprite1.x = size.width*0.51;
        Sprite1.y = size.height*0.54;
        Sprite1.id = 6;
        this.addChild(Sprite1);
        //7
        var Sprite1 = new myChoose(res.stagepoint_adv);
        Sprite1.x = size.width*0.67;
        Sprite1.y = size.height*0.70;
        Sprite1.id = 7;
        this.addChild(Sprite1);
        //8
        var Sprite1 = new myChoose(res.stagepoint_adv);
        Sprite1.x = size.width*0.88;
        Sprite1.y = size.height*0.53;
        Sprite1.id = 8;
        this.addChild(Sprite1);
        //9
        var Sprite1 = new myChoose(res.stagepoint_adv);
        Sprite1.x = size.width*0.62;
        Sprite1.y = size.height*0.40;
        Sprite1.id = 9;
        this.addChild(Sprite1);
        //10
        var Sprite1 = new myChoose(res.stagepoint_adv);
        Sprite1.x = size.width*0.86;
        Sprite1.y = size.height*0.10;
        Sprite1.id = 10;
        this.addChild(Sprite1);

        return true;
    }
});

var LevelScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new LevelLayer();
        this.addChild(layer);
    }
});

