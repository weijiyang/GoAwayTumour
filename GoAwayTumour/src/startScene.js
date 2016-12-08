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
        var startItem = new cc.MenuItemImage(res.startbtn,res.startbtn2,function () {
            //王凯名 添加了音效判断2016/12/8
            EffectEngine.playEffect(res.Select);
            //进入选关页面接口
            cc.director.runScene(new LevelScene());
        }, this);
        var menu1 = new cc.Menu(startItem);
        menu1.y = size.height * 0.2;
        this.addChild(menu1);

        //关于我们
        var aboutUsItem = new cc.MenuItemImage( res.aboutusbtn, res.aboutusbtn2, function () {
            //王凯名 添加了音效判断2016/12/8
            EffectEngine.playEffect(res.Select);
            //显示弹窗。function为回调函数，弹窗完全展示后回调
            this.pus.show(this.pus, function(){
                console.log('关于我们弹窗打开了');
            });
        }, this );
/*        aboutUsItem.x = cc.winSize.width * 0.83;
        aboutUsItem.y = cc.winSize.height * 0.95;*/
        var menu2 = new cc.Menu(aboutUsItem);
        menu2.x = startbg.width*0.95;
        menu2.y = startbg.height * 0.9;
        startbg.addChild(menu2);

        return true;
    },
    initTc : function()
    {
        var size = cc.winSize;
        //1、创建一个layer用于存放弹窗，layer的宽和高等于弹窗图片的大小
        var layer = new cc.LayerColor(cc.color(0,0,0,0), 750, 427);
        // layer.x = 400 - (layer.width/2);
        // layer.y = 640 - (layer.height/2);
        /*		//2、创建弹窗图片
         var tc = new cc.Sprite('res/tc.png');
         tc.x = layer.width / 2;
         tc.y = layer.height / 2;
         layer.addChild(tc);

         //3、弹窗的按钮
         var bnt = new cc.MenuItemImage( 'res/bnt.png', 'res/bnt.png', function () {

         //关闭弹窗。function为回调函数，弹窗完全关闭后回调
         this.pus.hidden(this.pus, function(){
         console.log('弹窗关闭了');
         });

         }, this );
         bnt.x = layer.width / 2;
         bnt.y = 45;
         var menu = new cc.Menu(bnt);
         menu.x = 0;
         menu.y = 0;
         layer.addChild(menu); */
        var bg = new cc.Sprite(res.About_png);
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        bg.setScale(1.0);
        bg.setAnchorPoint(0.5,0.5);
        layer.addChild(bg);

        var title = new cc.LabelTTF("《滚蛋吧！肿瘤君》","Arial","10");
        title.x = size.width*0.5;
        title.y = size.height*0.7;
        title.setScale(1.5);
        title.setFontFillColor(cc.color.BLACK);
        title.setFontSize(30);
        title.enableStroke(cc.color.GREEN,2);
        layer.addChild(title);

        var leader = new cc.LabelTTF("项目经理：魏继阳","Arial","10");
        leader.x = size.width *0.5;
        leader.y = size.height*0.57;
        leader.setScale(1.0);
        leader.setFontFillColor(cc.color.BLACK);
        leader.setFontSize(30);
        leader.enableStroke(cc.color.GREEN,2);
        layer.addChild(leader);

        var member = new cc.LabelTTF("开发人员：崔迎春，郑蕊，曹阳，王凯名，张东杰","Arial","10");
        member.x = size.width*0.5;
        member.y = size.height*0.48;
        member.setScale(1.0);
        member.setFontFillColor(cc.color.BLACK);
        member.setFontSize(30);
        member.enableStroke(cc.color.GREEN,2);
        layer.addChild(member);

        var version = new cc.LabelTTF("版本号：V1.0.0","Arial","10");
        version.x = size.width*0.5;
        version.y = size.height*0.4;
        version.setScale(1.0);
        version.setFontFillColor(cc.color.BLACK);
        version.setFontSize(30);
        version.enableStroke(cc.color.GREEN,2);
        layer.addChild(version);

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
//获取音效设置 王凯名
var EffectEngine = function(){};
EffectEngine.playEffect = function(url){
    if (cc.sys.localStorage.getItem("isEffectOn") == "YES") {
        cc.audioEngine.playEffect(url);
        cc.log("1");
    }
};