/* 2016-11-23   曹阳   创建 */
var MainLayer = cc.Layer.extend({
    pus : null,
    sprite:null,
    stars:[],
    ctor : function()
    {
        this._super();
        // this.addChild(new cc.LayerColor(cc.color(184,153,0)));
        // this.addChild(new cc.LayerColor(cc.color(184,153,0)));
        var backgoundimage = new cc.Sprite(res.BackgoundImage);
        backgoundimage.setRotation(180);
        backgoundimage.x = cc.winSize.width / 2;
        backgoundimage.y = cc.winSize.height / 2;
        this.addChild(backgoundimage);
        var size = cc.winSize;
        DTHIS = this;    //DTHIS在此处类似于that

        this.initTc();
        this.initoverTc();
        this.initwinTc();

        this.initBnt();
    },

    initBnt : function()
    {
        var pause = new cc.MenuItemImage( res.pause_0, res.pause_0, function () {
            //显示弹窗。function为回调函数，弹窗完全展示后回调
            this.pus.show(this.pus, function(){
                console.log('弹窗打开了');
            });

        }, this );
        pause.x = cc.winSize.width * 0.83;
        pause.y = cc.winSize.height * 0.95;
        // bnt.setScale(2);
        var set = new cc.MenuItemImage( res.menu_png, res.menu_png, function () {

            //显示弹窗。function为回调函数，弹窗完全展示后回调
            this.pus.show(this.pus, function(){
                console.log('弹窗打开了');
            });

        }, this );
        set.x = cc.winSize.width * 0.9;
        set.y = cc.winSize.height * 0.95;
        // bnt1.setScale(2);
        // var OverLabel = new cc.LabelTTF("游戏失败");
        // OverLabel.setFontSize(cc.winSize.width / 8);
        // OverLabel.setFontFillColor(cc.color.BLACK);
        // OverLabel.enableStroke(cc.color.YELLOW, 5);
        var over = new cc.MenuItemFont( "游戏失败", function () {

            //显示弹窗。function为回调函数，弹窗完全展示后回调
            this.overpus.show(this.overpus, function(){
                console.log('游戏失败了');
            });

        }, this );

        over.x = cc.winSize.width * 0.8;
        over.y = cc.winSize.height * 0.4;

        var win = new cc.MenuItemFont( "闯关成功", function () {

            //显示弹窗。function为回调函数，弹窗完全展示后回调
            this.winpus.show(this.winpus, function(){
                console.log('闯关成功了');
            });

        }, this );
        win.x = cc.winSize.width * 0.8;
        win.y = cc.winSize.height * 0.6;

        var menu = new cc.Menu(pause,set,over,win);
        menu.x = 0;
        menu.y = 0;
        // menu.setFontFillColor(cc.color.BLACK);
        this.addChild(menu);
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

        //列表背景图
        var list = new cc.Sprite(res.List_png);
        list.x = cc.winSize.width / 2;
        list.y = cc.winSize.height / 2;
        list.setScale(1.2);
        list.setAnchorPoint(0.5,0.5);
        layer.addChild(list);  //注意这里

        //重新选关
        var selectItem = new cc.MenuItemImage(res.SelectNormal_png,res.SelectSelected_png, function () {
            //关闭弹窗。function为回调函数，弹窗完全关闭后回调
            this.pus.hidden(this.pus, function(){
                // console.log('跳转到选关界面');
                cc.director.runScene(new LevelScene());
            });
        }, this);

        //继续游戏
        var continueItem = new cc.MenuItemImage(res.ContinueNormal_png,res.ContinueSelected_png, function () {
            this.pus.hidden(this.pus, function(){
                console.log('通过导演恢复场景');
                // cc.director.runScene(new LevelScene());
            });
        }, this);

        //重新开始
        var repeatItem = new cc.MenuItemImage(res.RepeatNormal_png,res.RepeatSelected_png, function () {
            this.pus.hidden(this.pus, function(){
                // console.log('跳转到游戏开始界面');
                cc.director.runScene(new MainScene());
            });
        }, this);

        var menu = new cc.Menu(selectItem, continueItem,repeatItem);
        menu.y = size.height * 0.45;
        menu.x = size.width *0.5 ;
        repeatItem.setScale(1.5);
        continueItem.setScale(1.5);
        selectItem.setScale(1.5);
        menu.alignItemsVerticallyWithPadding(40);
        layer.addChild(menu);

        /*4、创建Popups对象。参数意义分别为 ：
         层
         弹窗一开始是否为可见，默认为true
         点击遮罩层的时候是否关闭弹窗，默认为false。若为true，则存放弹窗的layer必须设置宽高
         */
        this.pus = new Popups(layer, false, false);
        this.addChild(this.pus);
    },

    initoverTc : function()
    {
        var size = cc.winSize;
        //1、创建一个layer用于存放弹窗，layer的宽和高等于弹窗图片的大小
        var layer = new cc.LayerColor(cc.color(0,0,0,0), 750, 427);
        //游戏失败背景
        var bg = new cc.Sprite(res.GameOver_png);
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        bg.setScale(1.2);
        bg.setAnchorPoint(0.5,0.5);
        layer.addChild(bg);

        //星星
        for(var i=0;i<3;i++){
            this.stars[i] = new cc.Sprite("res/mainScene/graystar"+(i+1)+".png");
            this.stars[i].x = size.width*(0.1*i+0.4);
            this.stars[i].y = size.height*(0.6);
            this.stars[i].setScale(1.2);
            layer.addChild(this.stars[i]);
        }

        //重新选关按钮
        var selectItem = new cc.MenuItemImage(res.SelectNormal_png,res.SelectSelected_png, function () {
            this.overpus.hidden(this.overpus, function(){
                // console.log('跳转到选关界面');
                cc.director.runScene(new LevelScene());
            });
        }, this);

        //重新开始按钮
        var repeatItem = new cc.MenuItemImage(res.RepeatNormal_png,res.RepeatSelected_png, function () {
            this.overpus.hidden(this.overpus, function(){
                console.log('跳转到游戏开始界面');
            });
        }, this);

        var menu = new cc.Menu(selectItem, repeatItem);
        menu.y = size.height *0.3;
        menu.x = size.width *0.48;
        repeatItem.setScale(1.0);
        selectItem.setScale(1.0);
        menu.alignItemsHorizontallyWithPadding(50);
        layer.addChild(menu);

        this.overpus = new Popups(layer, false, false);
        this.addChild(this.overpus);
    },
    initwinTc : function()
    {
        var size = cc.winSize;
        //1、创建一个layer用于存放弹窗，layer的宽和高等于弹窗图片的大小
        var layer = new cc.LayerColor(cc.color(0,0,0,0), 750, 427);
        //胜利背景图
        var bg = new cc.Sprite(res.Win_png);
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        bg.setScale(1.2);
        bg.setAnchorPoint(0.5,0.5);
        layer.addChild(bg);

        //星星
        for(var i=0;i<3;i++){
            this.stars[i] = new cc.Sprite("res/mainScene/star"+(i+1)+".png");
            this.stars[i].x = size.width*(0.1*i+0.4);
            this.stars[i].y = size.height*(0.6);
            this.stars[i].setScale(1.2);
            layer.addChild(this.stars[i]);
        }

        //重新选关按钮
        var selectItem = new cc.MenuItemImage(res.SelectNormal_png,res.SelectSelected_png, function () {
            this.winpus.hidden(this.winpus, function(){
                console.log('跳转到选关界面');
                cc.director.runScene(new LevelScene());
            });
        }, this);

        //继续游戏按钮
        var continueItem = new cc.MenuItemImage(res.ContinueNormal_png,res.ContinueSelected_png, function () {
            this.winpus.hidden(this.winpus, function(){
                console.log('跳转到下一关界面');
            });
        }, this);

        var menu = new cc.Menu(selectItem, continueItem);
        menu.y = size.height *0.3;
        menu.x = size.width *0.5;
        continueItem.setScale(1.0);
        selectItem.setScale(1.0);
        menu.alignItemsHorizontallyWithPadding(50);
        layer.addChild(menu);

        this.winpus = new Popups(layer, false, false);
        this.addChild(this.winpus);
    }

});

var MainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MainLayer();
        this.addChild(layer);
    }
});

