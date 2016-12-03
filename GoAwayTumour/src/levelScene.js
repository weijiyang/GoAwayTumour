
var LevelLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;
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
        /*tool_leftbg.setAnchorPoint(cc.p(0,1));
         tool_leftbg.x = size.width*0;
         tool_leftbg.y = size.height*1;*/
        tool_leftbg.x = bg.width*0.001;
        tool_leftbg.y = bg.height*0.846;
        bg.addChild(tool_leftbg,1);

        //右边
        var tool_rightbg = new cc.Sprite(res.stagemap_toolbar_rightbg);
        /*tool_rightbg.setAnchorPoint(cc.p(1,1));
         tool_rightbg.x = size.width*1;
         tool_rightbg.y = size.height*1;*/
        tool_rightbg.x = bg.width*0.865;
        tool_rightbg.y = bg.height*0.92;
        bg.addChild(tool_rightbg,1);
        //添加按钮
        var homeItem = new cc.MenuItemImage(res.stagemap_toolbar_home,res.stagemap_toolbar_home2,function(){
            cc.log("返回主页");
            cc.director.runScene(new StartScene());
        },this);
        var homeMenu = new cc.Menu(homeItem);
        homeMenu.x = tool_leftbg.width*0.18;
        homeMenu.y = tool_leftbg.height*0.56;
        tool_leftbg.addChild(homeMenu,2);
        var storeItem = new cc.MenuItemImage(res.stagemap_toolbar_shop,res.stagemap_toolbar_shop2,function(){
            cc.log("进入商店");
        },this);
        var storeMenu = new cc.Menu(storeItem);
        storeMenu.x = tool_leftbg.width*0.475;
        storeMenu.y = tool_leftbg.height*0.56;
        tool_leftbg.addChild(storeMenu,2);
        var picItem = new cc.MenuItemImage(res.stagemap_toolbar_leaderboard,res.stagemap_toolbar_leaderboard2,function(){
            cc.log("排行榜/图鉴");
            cc.director.runScene(new IntroductionScene());
        },this);
        var picMenu = new cc.Menu(picItem);
        picMenu.x = tool_leftbg.width*0.77;
        picMenu.y = tool_leftbg.height*0.56;
        tool_leftbg.addChild(picMenu,2);
        var settingItem = new cc.MenuItemImage(res.stagepoint_chance,res.stagepoint_chance2,function(){
            // cc.log("设置");
            this.pus.show(this.pus, function(){
                console.log('弹窗打开了');
            });
        },this);
        var settingMenu = new cc.Menu(settingItem);
        settingMenu.x = tool_rightbg.width*0.86;
        settingMenu.y = tool_rightbg.height*0.76;
        tool_rightbg.addChild(settingMenu,2);


        //1
        var Sprite1 = new myChoose(res.stagepoint_adv);
        Sprite1.x = size.width*0.21;
        Sprite1.y = size.height*0.53;
        Sprite1.id = 1;
        this.addChild(Sprite1);
        //2
        var Sprite1 = new myChoose(res.stagepoint_adv);
        Sprite1.x = size.width*0.31;
        Sprite1.y = size.height*0.40;
        Sprite1.id = 2;
        this.addChild(Sprite1);
        //3
        var Sprite1 = new myChoose(res.stagepoint_adv);
        Sprite1.x = size.width*0.22;
        Sprite1.y = size.height*0.14;
        Sprite1.id = 3;
        this.addChild(Sprite1);
        //4
        var Sprite1 = new myChoose(res.stagepoint_adv);
        Sprite1.x = size.width*0.37;
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
        Sprite1.y = size.height*0.48;
        Sprite1.id = 6;
        this.addChild(Sprite1);
        //7
        var Sprite1 = new myChoose(res.stagepoint_adv);
        Sprite1.x = size.width*0.64;
        Sprite1.y = size.height*0.59;
        Sprite1.id = 7;
        this.addChild(Sprite1);
        //8
        var Sprite1 = new myChoose(res.stagepoint_adv);
        Sprite1.x = size.width*0.83;
        Sprite1.y = size.height*0.45;
        Sprite1.id = 8;
        this.addChild(Sprite1);
        //9
        var Sprite1 = new myChoose(res.stagepoint_adv);
        Sprite1.x = size.width*0.61;
        Sprite1.y = size.height*0.34;
        Sprite1.id = 9;
        this.addChild(Sprite1);
        //10
        var Sprite1 = new myChoose(res.stagepoint_adv);
        Sprite1.x = size.width*0.79;
        Sprite1.y = size.height*0.10;
        Sprite1.id = 10;
        this.addChild(Sprite1);
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
        //bg.setScale(2);
        layer.addChild(bg);
        //音效设置
        var musicLabel1 = new cc.LabelTTF("音乐:", "Arial", 30);
        musicLabel1.enableStroke(cc.color.GREEN,2);
        musicLabel1.setFontFillColor(cc.color.BLACK);
        musicLabel1.x = size.width*0.40;
        musicLabel1.y = size.height*0.58;
        layer.addChild(musicLabel1, 5);

        var musicLabel2 = new cc.LabelTTF("音效:", "Arial", 30);
        musicLabel2.enableStroke(cc.color.GREEN,2);
        musicLabel2.setFontFillColor(cc.color.BLACK);
        musicLabel2.x = size.width*0.40;
        musicLabel2.y = size.height*0.46;
        layer.addChild(musicLabel2, 5);

        /*    //静态音乐音效按钮
         var bg = new cc.Sprite(res.Music1_png);
         bg.x = cc.winSize.width*0.57;
         bg.y = cc.winSize.height*0.65;
         this.addChild(bg);

         var bg2 = new cc.Sprite(res.Music3_png);
         bg2.x = cc.winSize.width*0.57;
         bg2.y = cc.winSize.height*0.48;
         this.addChild(bg2);*/

        //音乐开关
        var onItem = new cc.MenuItemImage(res.Music3_png, res.Music3_png, function () {
        }, this);
        var offItem = new cc.MenuItemImage(res.Music4_png, res.Music4_png, function () {
        }, this);
        var toggleMenuItem = new cc.MenuItemToggle(onItem, offItem, function () {
            if(toggleMenuItem.getSelectedIndex() == 0){//代表现在关着，点击，判断取值，音乐播放
                ls.setItem("isMusicOn","YES");
                cc.audioEngine.playMusic(res.Bg_mp3, true);
            }else{//代表现在开着，点击，判断取值，音乐暂停
                ls.setItem("isMusicOn","NO");
                cc.audioEngine.stopMusic();
            }
        }, this);

        if (ls.getItem("isMusicOn") == "YES") {
            toggleMenuItem.setSelectedIndex(0);
            cc.audioEngine.playMusic(res.Bg_mp3, true);
        } else {
            toggleMenuItem.setSelectedIndex(1);
            cc.audioEngine.stopMusic();
        }

        //音效开关
        var onItem2 = new cc.MenuItemImage(res.Music1_png, res.Music1_png, function () {
        }, this);
        var offItem2 = new cc.MenuItemImage(res.Music2_png, res.Music2_png, function () {
        }, this);

        var toggleMenuItem2 = new cc.MenuItemToggle(onItem2, offItem2, function () {
            ls.setItem("isEffectOn", toggleMenuItem2.getSelectedIndex() == 0 ? "YES" : "NO");
            if (ls.getItem("isEffectOn") == "YES") {
                cc.audioEngine.playEffect(res.Click_mp3);
            }
        }, this);

        if (ls.getItem("isEffectOn") == "YES") {
            toggleMenuItem2.setSelectedIndex(0);
        } else {
            toggleMenuItem2.setSelectedIndex(1);
        }

        //菜单
        toggleMenuItem.x = size.width*0.54;
        toggleMenuItem.y = size.height*0.59;

        toggleMenuItem2.x = size.width*0.54;
        toggleMenuItem2.y = size.height*0.46;

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
    }
});

var LevelScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new LevelLayer();
        this.addChild(layer);
    }
});

