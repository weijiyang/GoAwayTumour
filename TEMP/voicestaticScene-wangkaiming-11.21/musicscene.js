/**
 * Created by lenovo on 2016/11/21.
 */

var MusicLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;

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

        //音乐开关按钮
        var onItem = new cc.Sprite(res.Music3_png);
        onItem.x = cc.winSize.width*0.54;
        onItem.y = cc.winSize.height*0.59;
        //bg.setScale(2);
        this.addChild(onItem);
        //音效开关按钮
        var onItem2 = new cc.Sprite(res.Music1_png);
        onItem2.x = cc.winSize.width*0.54;
        onItem2.y = cc.winSize.height*0.46;
        //bg.setScale(2);
        this.addChild(onItem2);


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

