/**
 * Created by 张东杰 on 2016/12/25.
 */
/*王凯名 添加了music判断2016/12/12*/
var LevelLayer2 = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;
        ls=cc.sys.localStorage;
        this.initsetTc();
        //添加背景图片
        var bg = new cc.Sprite(res.stage_map_0);
        bg.setAnchorPoint(cc.p(0.5,0.5));
        bg.x = size.width*0.5;
        bg.y = size.height*0.5;
        this.addChild(bg,0);
        //添加左上角按钮
        var tool_leftbg = new cc.Sprite(res.stagemap_toolbar_leftbg);
        tool_leftbg.setAnchorPoint(0,0);
        tool_leftbg.x = bg.width*0.001;
        tool_leftbg.y = bg.height*0.846;
        bg.addChild(tool_leftbg,1);

        //右边
        var tool_rightbg = new cc.Sprite(res.stagemap_toolbar_rightbg);
        tool_rightbg.x = bg.width*0.865;
        tool_rightbg.y = bg.height*0.92;
        bg.addChild(tool_rightbg,1);
        //添加按钮
        var homeItem = new cc.MenuItemImage(res.stagemap_toolbar_home,res.stagemap_toolbar_home2,function(){
            // 王凯名 添加了音效判断2016/12/12
            if (ls.getItem("isEffectOn") == "YES") {
                cc.audioEngine.playEffect(res.Select);
            }
            cc.director.runScene(new StartScene());
        },this);
        var homeMenu = new cc.Menu(homeItem);
        homeMenu.x = tool_leftbg.width*0.18;
        homeMenu.y = tool_leftbg.height*0.56;
        tool_leftbg.addChild(homeMenu,2);
        var storeItem = new cc.MenuItemImage(res.stagemap_toolbar_shop,res.stagemap_toolbar_shop2,function(){

            // 王凯名 添加了音效判断2016/12/12
            if (ls.getItem("isEffectOn") == "YES") {
                cc.audioEngine.playEffect(res.Select);
            }
            cc.log("进入商店");
        },this);
        var storeMenu = new cc.Menu(storeItem);
        storeMenu.x = tool_leftbg.width*0.475;
        storeMenu.y = tool_leftbg.height*0.56;
        tool_leftbg.addChild(storeMenu,2);
        var picItem = new cc.MenuItemImage(res.stagemap_toolbar_leaderboard,res.stagemap_toolbar_leaderboard2,function(){
            cc.log("排行榜/图鉴");

            // 王凯名 添加了音效判断2016/12/12
            if (ls.getItem("isEffectOn") == "YES") {
                cc.audioEngine.playEffect(res.Select);
            }
            cc.director.runScene(new IntroductionScene());
        },this);
        var picMenu = new cc.Menu(picItem);
        picMenu.x = tool_leftbg.width*0.77;
        picMenu.y = tool_leftbg.height*0.56;
        tool_leftbg.addChild(picMenu,2);

        var settingItem = new cc.MenuItemImage(res.stagepoint_chance,res.stagepoint_chance2,function(){
            // cc.log("设置");

            // 王凯名 添加了音效判断2016/12/12
            if (ls.getItem("isEffectOn") == "YES") {
                cc.audioEngine.playEffect(res.Select);
            }
            this.pus.show(this.pus, function(){
                // console.log('弹窗打开了');
            });
        },this);
        var settingMenu = new cc.Menu(settingItem);
        settingMenu.x = tool_rightbg.width*0.79;
        settingMenu.y = tool_rightbg.height*0.6;
        tool_rightbg.addChild(settingMenu,2);

        var protectLabel = new cc.LabelBMFont("152",res.number_fnt);
        protectLabel.setScale(0.8);
        protectLabel.x  = 130;
        protectLabel.y = 60;
        tool_rightbg.addChild(protectLabel);

        var tishiItem = new cc.MenuItemImage(res.jt1,res.jt1,function(){
            cc.director.runScene(new cc.TransitionSlideInL(0.5,new LevelScene()));
        },this);
        var tishiMenu = new cc.Menu(tishiItem);
        tishiMenu.x = cc.winSize.width*0.05;
        tishiMenu.y = cc.winSize.height*0.45;
        this.addChild(tishiMenu);
        var moveLeft = cc.moveTo(1.0,tishiMenu.x+20,tishiMenu.y);
        var moveRight = cc.moveTo(1.0,tishiMenu.x-20,tishiMenu.y);
        tishiMenu.runAction(cc.repeatForever(cc.sequence(moveLeft, moveRight)));
        //1
        var Sprite1 = new cc.Sprite(res.stagepoint_adv04);
        Sprite1.x = size.width*0.25;
        Sprite1.y = size.height*0.45;
        Sprite1.tag = 1;
        this.addChild(Sprite1);

        //2
        var Sprite2 = new cc.Sprite(res.stagepoint_adv04);
        Sprite2.x = size.width*0.55;
        Sprite2.y = size.height*0.45;
        Sprite2.tag = 2;
        this.addChild(Sprite2);

        //3
        var Sprite3 = new cc.Sprite(res.stagepoint_adv04);
        Sprite3.x = size.width*0.85;
        Sprite3.y = size.height*0.45;
        Sprite3.tag = 3;
        this.addChild(Sprite3);

        //4

        return true;
    },
    initsetTc : function()
    {
        var size = cc.winSize;
        //1、创建一个layer用于存放弹窗，layer的宽和高等于弹窗图片的大小
        var layer = new cc.LayerColor(cc.color(0,0,0,0), 750, 427);
        var ls = cc.sys.localStorage;
        if (ls.getItem("isMusicOn") == null) {
            ls.setItem("isMusicOn", "YES");
            ls.setItem("isEffectOn", "YES");
        }

        //背景框
        var bg = new cc.Sprite(res.Mainscene_png);
        bg.x = cc.winSize.width/2;
        bg.y = cc.winSize.height/2;
        layer.addChild(bg);

        //音乐开关
        var onItem = new cc.MenuItemImage(res.Music3_png, res.Music3_png, function () {
        }, this);
        var offItem = new cc.MenuItemImage(res.Music4_png, res.Music4_png, function () {
        }, this);
        var toggleMenuItem = new cc.MenuItemToggle(onItem, offItem, function () {
            if(toggleMenuItem.getSelectedIndex() == 0){//代表现在关着，点击，判断取值，音乐播放
                ls.setItem("isMusicOn","YES");
                cc.audioEngine.playMusic(res.BgMusic, true);
            }else{//代表现在开着，点击，判断取值，音乐暂停
                ls.setItem("isMusicOn","NO");
                cc.audioEngine.stopMusic();
            }
        }, this);

        //音效开关
        var onItem2 = new cc.MenuItemImage(res.Music1_png, res.Music1_png, function () {
        }, this);
        var offItem2 = new cc.MenuItemImage(res.Music2_png, res.Music2_png, function () {
        }, this);

        var toggleMenuItem2 = new cc.MenuItemToggle(onItem2, offItem2, function () {
            ls.setItem("isEffectOn", toggleMenuItem2.getSelectedIndex() == 0 ? "YES" : "NO");
            if (ls.getItem("isEffectOn") == "YES") {
                cc.audioEngine.playEffect(res.Select);
            }
        }, this);

        if (ls.getItem("isEffectOn") == "YES") {
            toggleMenuItem2.setSelectedIndex(0);
            cc.audioEngine.playEffect(res.Select);
        } else {
            toggleMenuItem2.setSelectedIndex(1);
        }

        //菜单
        toggleMenuItem.x = size.width*0.57;
        toggleMenuItem.y = size.height*0.53;

        toggleMenuItem2.x = size.width*0.57;
        toggleMenuItem2.y = size.height*0.38;

        var menu = new cc.Menu(toggleMenuItem,toggleMenuItem2);
        menu.x = 0;
        menu.y = 0;
        layer.addChild(menu);

        /*4、创建Popups对象。参数意义分别为 ：
         层
         弹窗一开始是否为可见，默认为true
         点击遮罩层的时候是否关闭弹窗，默认为false。若为true，则存放弹窗的layer必须设置宽高
         */
        this.pus = new Popups(layer, false, true);
        this.addChild(this.pus);
        return ls.getItem("isEffectOn");
    }
});

var LevelScene2= cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new LevelLayer2();
        this.addChild(layer);
    }
});

