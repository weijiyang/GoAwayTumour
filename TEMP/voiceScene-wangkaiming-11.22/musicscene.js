/**
 * Created by lenovo on 2016/11/22.
 */

var MusicLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;

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
        this.addChild(bg);
        //音效设置
        var musicLabel1 = new cc.LabelTTF("音乐:", "Arial", 30);
        musicLabel1.enableStroke(cc.color.GREEN,2);
        musicLabel1.x = size.width*0.40;
        musicLabel1.y = size.height*0.58;
        this.addChild(musicLabel1, 5);

        var musicLabel2 = new cc.LabelTTF("音效:", "Arial", 30);
        musicLabel2.enableStroke(cc.color.GREEN,2);
        musicLabel2.x = size.width*0.40;
        musicLabel2.y = size.height*0.46;
        this.addChild(musicLabel2, 5);


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
        this.addChild(menu);

        return true;
    }
});

var MusicScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MusicLayer();
        this.addChild(layer);
    }
});

