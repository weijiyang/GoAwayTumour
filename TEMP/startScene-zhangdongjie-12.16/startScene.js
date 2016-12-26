/**
 * Created by 郑蕊 on 2016/11/21.
 */
var StartLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;
        DTHIS = this;    //DTHIS在此处类似于that

        this.initTc();
        //王凯名 添加了music判断2016/12/12
        EffectEngine2.playMusic(res.BgMusic);
        //开始页面背景
        var startbg = new cc.Sprite(res.startbg);
        startbg.x=size.width*0.5;
        startbg.y=size.height*0.5;
        this.addChild(startbg);

        //游戏名称
        var gamename = new cc.Sprite(res.name_png);
        gamename.x=size.width*0.5;
        gamename.y=size.height*0.6;
        this.addChild(gamename);

        //开始游戏按钮
        var startItem = new cc.MenuItemImage(res.startbtn,res.startbtn2,function () {
            //王凯名 添加了音效判断2016/12/12
            EffectEngine.playEffect(res.Select);
            //进入选关页面接口
            cc.director.runScene(new LevelScene());
        }, this);
        var menu1 = new cc.Menu(startItem);
        menu1.y = size.height * 0.2;
        this.addChild(menu1);

        //关于我们
        var aboutUsItem = new cc.MenuItemImage( res.aboutusbtn, res.aboutusbtn2, function () {
            //王凯名 添加了音效判断2016/12/12
            EffectEngine.playEffect(res.Select);
            //显示弹窗。function为回调函数，弹窗完全展示后回调
            this.pus.show(this.pus, function(){
                console.log('关于我们弹窗打开了');
            });
        }, this );
        var menu2 = new cc.Menu(aboutUsItem);
        menu2.x = startbg.width*0.90;
        menu2.y = startbg.height * 0.88;
        startbg.addChild(menu2);

        return true;
    },
    initTc : function()
    {
        var size = cc.winSize;
        //1、创建一个layer用于存放弹窗，layer的宽和高等于弹窗图片的大小
        var layer = new cc.LayerColor(cc.color(0,0,0,0), 750, 427);

        var bg = new cc.Sprite(res.About_png);
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        bg.setScale(1.0);
        bg.setAnchorPoint(0.5,0.5);
        layer.addChild(bg);

        /*4、创建Popups对象。参数意义分别为 ：
         层
         弹窗一开始是否为可见，默认为true
         点击遮罩层的时候是否关闭弹窗，默认为false。若为true，则存放弹窗的layer必须设置宽高
         */
        this.pus = new Popups(layer, false, true);
        this.addChild(this.pus);
    },
});

var StartScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new StartLayer();
        this.addChild(layer);
    }
});

//获取音效、音乐设置 王凯名12.12
var EffectEngine = function(){};
EffectEngine.playEffect = function(url){
    if (cc.sys.localStorage.getItem("isEffectOn") == "YES") {
        cc.audioEngine.playEffect(url);
    }
};
var EffectEngine2 = function(){};
EffectEngine2.playMusic = function (url) {
    if (cc.sys.localStorage.getItem("isMusicOn") == "YES") {
        cc.audioEngine.playMusic(url);
    }
};