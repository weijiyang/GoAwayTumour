
var CellDetailLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;
        //图鉴背景图层
        var pokedexbg = new cc.Sprite(res.cellblackboard2_png);
        pokedexbg.x=size.width*0.5;
        pokedexbg.y=size.height*0.5;
        this.addChild(pokedexbg);

        //返回按钮
        var press= new cc.MenuItemImage(res.pressed, res.pressed2, function () {
            //王凯名 添加了音效判断2016/12/12
            EffectEngine.playEffect(res.Select);
            //详情介绍接口
            cc.director.runScene(new IntroductionScene());
        }, this);
        press.x = pokedexbg.width*0.1;
        press.y = pokedexbg.height*0.93;
        var menu0 = new cc.Menu(press);
        menu0.x = 0;
        menu0.y = 0;
        pokedexbg.addChild(menu0);


        //细胞展示框
        var celldisplay = new cc.Sprite(res.toumingaaa_png);
        celldisplay.setAnchorPoint(0,0);
        celldisplay.x=pokedexbg.width*0.06;
        celldisplay.y=pokedexbg.height*0.01;
        pokedexbg.addChild(celldisplay);


        //细胞详情显示框
        var celldisplay2 = new cc.Sprite(res.celldisplay2);
        celldisplay2.setAnchorPoint(0,0);
        celldisplay2.x=pokedexbg.width*0.625;
        celldisplay2.y=pokedexbg.height*0.05;
        pokedexbg.addChild(celldisplay2);

        //提示小手
        var tishi = new cc.Sprite(res.tishi_png);
        tishi.x = cc.winSize.width*0.90;
        tishi.y = cc.winSize.height*0.23;
        this.addChild(tishi);
        var mymoveup = cc.moveTo(1.0,tishi.x+20,tishi.y+20);
        var mymovedown = cc.moveTo(1.0,tishi.x-20,tishi.y-20);
        tishi.runAction(cc.repeatForever(cc.sequence(mymoveup, mymovedown)));

        //点击左边，在右边显示的细胞图片
        var cellone = new cc.Sprite(res.cell12);
        //放大
        cellone.setScale(1.4);
        cellone.setAnchorPoint(0,0);
        cellone.x=celldisplay2.width*0.27;
        cellone.y=celldisplay2.height*0.62;
        celldisplay2.addChild(cellone);

        //细胞文字描述背景图层
        var blackboard = new cc.Sprite(res.blackboard);
        blackboard.setAnchorPoint(0,0);
        blackboard.x=celldisplay2.width*0.032;
        blackboard.y=celldisplay2.height*0.023;
        celldisplay2.addChild(blackboard);

        //点击左边，右边显示细胞文字描述
        var title1 = new cc.LabelTTF("淋巴细胞");
        title1.setFontSize(size.width*0.038);
        title1.setFontFillColor(cc.color.BLACK);
        title1.x = blackboard  .width * 0.5;
        title1.y = blackboard .height*0.95;
        blackboard .addChild(title1);

        var title2 = new cc.LabelTTF("70");
        title2.setFontSize(size.width*0.03);
        title2.setFontFillColor(cc.color.BLACK);
        title2.x = blackboard .width * 0.65;
        title2.y =blackboard.height*0.73;
        blackboard.addChild(title2);

        var title3 = new cc.LabelTTF("40");
        title3.setFontSize(size.width*0.03);
        title3.setFontFillColor(cc.color.BLACK);
        title3.x = blackboard .width * 0.65;
        title3.y =blackboard.height*0.57;
        blackboard.addChild(title3);

        var title4 = new cc.LabelTTF("2");
        title4.setFontSize(size.width*0.03);
        title4.setFontFillColor(cc.color.BLACK);
        title4.x = blackboard .width * 0.65;
        title4.y =blackboard.height*0.40;
        blackboard.addChild(title4);

        var sciencerestart = new cc.MenuItemImage(res.science11,res.science12,function () {
            //王凯名 添加了音效判断2016/12/12
            EffectEngine.playEffect(res.Select);
            //返回初次场景
            cc.director.runScene(new CelloneScene());
        },this);
        sciencerestart.x=blackboard.width*0.5;
        sciencerestart.y=blackboard.height*0.15;
        var menu=new cc.Menu(sciencerestart);
        menu.x = 0;
        menu.y = 0;
        blackboard.addChild(menu);

        //细胞格子
        var cellgridItem1 = new cc.Sprite(res.touming1aaa_png);
        cellgridItem1.x = celldisplay.width*0.255;
        cellgridItem1.y = celldisplay.height * 0.88;
        celldisplay.addChild(cellgridItem1);

        var cellgridItem2 = new cc.Sprite(res.touming1aaa_png);
        cellgridItem2.x = celldisplay.width*0.57;
        cellgridItem2.y = celldisplay.height * 0.88;
        celldisplay.addChild(cellgridItem2);

        var cellgridItem3 = new cc.Sprite(res.touming1aaa_png);
        cellgridItem3.x = celldisplay.width*0.88;
        cellgridItem3.y = celldisplay.height * 0.88;
        celldisplay.addChild(cellgridItem3);

        var cellgridItem4 = new cc.Sprite(res.touming1aaa_png);
        cellgridItem4.x = celldisplay.width*0.255;
        cellgridItem4.y = celldisplay.height * 0.535;
        celldisplay.addChild(cellgridItem4);

        var cellgridItem5 = new cc.Sprite(res.touming1aaa_png);
        cellgridItem5.x = celldisplay.width*0.57;
        cellgridItem5.y = celldisplay.height * 0.535;
        celldisplay.addChild(cellgridItem5);

        var cellgridItem6 = new cc.Sprite(res.touming1aaa_png);
        cellgridItem6.x = celldisplay.width*0.88;
        cellgridItem6.y = celldisplay.height * 0.535;
        celldisplay.addChild(cellgridItem6);

        var cellgridItem7 = new cc.Sprite(res.touming1aaa_png);
        cellgridItem7.x = celldisplay.width*0.255;
        cellgridItem7.y = celldisplay.height * 0.2;
        celldisplay.addChild(cellgridItem7);

        //细胞种类
        //细胞1
        var cell1= new cc.MenuItemImage(res.cell12,res.cell1, function () {
            cellone.setTexture(res.cell12);
            title1.setString("淋巴细胞");
            title2.setString("70");
            title3.setString("40");
            title4.setString("2");

            //点我学习
            var sciencerestart = new cc.MenuItemImage(res.science11,res.science12,function () {
                //王凯名 添加了音效判断2016/12/12
                EffectEngine.playEffect(res.Select);
                //返回初次场景
                cc.director.runScene(new CelloneScene());
            },this);
            sciencerestart.x=blackboard.width*0.5;
            sciencerestart.y=blackboard.height*0.15;
            var menu=new cc.Menu(sciencerestart);
            menu.x = 0;
            menu.y = 0;
            blackboard.addChild(menu);

        }, this);
        cell1.x = cellgridItem1.width*0.5;
        cell1.y = cellgridItem1.height*0.5;
        var menu = new cc.Menu(cell1);
        menu.x = 0;
        menu.y = 0;
        cellgridItem1.addChild(menu);
        //细胞2
        var cell2= new cc.MenuItemImage(res.cell22, res.cell2, function () {
            cellone.setTexture(res.cell22);
            title1.setString("粒细胞");
            title2.setString("40");
            title3.setString("20");
            title4.setString("2");
            //点我学习
            var sciencerestart = new cc.MenuItemImage(res.science11,res.science12,function () {
                //王凯名 添加了音效判断2016/12/12
                EffectEngine.playEffect(res.Select);
                //返回初次场景
                cc.director.runScene(new CelltwoScene());
            },this);
            sciencerestart.x=blackboard.width*0.5;
            sciencerestart.y=blackboard.height*0.15;
            var menu=new cc.Menu(sciencerestart);
            menu.x = 0;
            menu.y = 0;
            blackboard.addChild(menu);


        }, this);
        cell2.x = cellgridItem2.width*0.5;
        cell2.y = cellgridItem2.height*0.5;
        var menu2 = new cc.Menu(cell2);
        menu2.x = 0;
        menu2.y = 0;
        cellgridItem2.addChild(menu2);
        //细胞3
        var cell3= new cc.MenuItemImage(res.cell32, res.cell3, function () {
            cellone.setTexture(res.cell32);
            title1.setString("红细胞");
            title2.setString("50");
            title3.setString("20");
            title4.setString("5");

            //点我学习
            var sciencerestart = new cc.MenuItemImage(res.science11,res.science12,function () {
                //王凯名 添加了音效判断2016/12/12
                EffectEngine.playEffect(res.Select);
                //返回初次场景
                cc.director.runScene(new CellthreeScene());
            },this);
            sciencerestart.x=blackboard.width*0.5;
            sciencerestart.y=blackboard.height*0.15;
            var menu=new cc.Menu(sciencerestart);
            menu.x = 0;
            menu.y = 0;
            blackboard.addChild(menu);

        }, this);
        cell3.x = cellgridItem3.width*0.5;
        cell3.y = cellgridItem3.height*0.5;
        var menu3 = new cc.Menu(cell3);
        menu3.x = 0;
        menu3.y = 0;
        cellgridItem3.addChild(menu3);
        //细胞4
        var cell4= new cc.MenuItemImage(res.cell42, res.cell4, function () {
            cellone.setTexture(res.cell42);
            title1.setString("吞噬细胞");
            title2.setString("00");
            title3.setString("90");
            title4.setString("1");

            //点我学习
            var sciencerestart = new cc.MenuItemImage(res.science11,res.science12,function () {
                //王凯名 添加了音效判断2016/12/12
                EffectEngine.playEffect(res.Select);
                //返回初次场景
                cc.director.runScene(new CellfourScene());
            },this);
            sciencerestart.x=blackboard.width*0.5;
            sciencerestart.y=blackboard.height*0.15;
            var menu=new cc.Menu(sciencerestart);
            menu.x = 0;
            menu.y = 0;
            blackboard.addChild(menu);
        }, this);
        cell4.x = cellgridItem4.width*0.5;
        cell4.y = cellgridItem4.height*0.5;
        var menu4 = new cc.Menu(cell4);
        menu4.x = 0;
        menu4.y = 0;
        cellgridItem4.addChild(menu4);
        //细胞5
        var cell5= new cc.MenuItemImage(res.cell52, res.cell5, function () {
            cellone.setTexture(res.cell52);
            title1.setString("NK细胞");
            title2.setString("50");
            title3.setString("30");
            title4.setString("4");

            //点我学习
            var sciencerestart = new cc.MenuItemImage(res.science11,res.science12,function () {
                //王凯名 添加了音效判断2016/12/12
                EffectEngine.playEffect(res.Select);
                //返回初次场景
                cc.director.runScene(new CellfiveScene());
            },this);
            sciencerestart.x=blackboard.width*0.5;
            sciencerestart.y=blackboard.height*0.15;
            var menu=new cc.Menu(sciencerestart);
            menu.x = 0;
            menu.y = 0;
            blackboard.addChild(menu);
        }, this);
        //菜单
        cell5.x = cellgridItem5.width*0.5;
        cell5.y = cellgridItem5.height*0.5;
        var menu5 = new cc.Menu(cell5);
        menu5.x = 0;
        menu5.y = 0;
        cellgridItem5.addChild(menu5);
        //细胞6
        var cell6= new cc.MenuItemImage(res.cell62, res.cell6, function () {
            cellone.setTexture(res.cell62);
            title1.setString("上皮细胞");
            title2.setString("30");
            title3.setString("30");
            title4.setString("3");

            //点我学习
            var sciencerestart = new cc.MenuItemImage(res.science11,res.science12,function () {
                //王凯名 添加了音效判断2016/12/12
                EffectEngine.playEffect(res.Select);
                //返回初次场景
                cc.director.runScene(new CellsixScene());
            },this);
            sciencerestart.x=blackboard.width*0.5;
            sciencerestart.y=blackboard.height*0.15;
            var menu=new cc.Menu(sciencerestart);
            menu.x = 0;
            menu.y = 0;
            blackboard.addChild(menu);
        }, this);
        //菜单
        cell6.x = cellgridItem6.width*0.5;
        cell6.y = cellgridItem6.height*0.5;
        var menu6 = new cc.Menu(cell6);
        menu6.x = 0;
        menu6.y = 0;
        cellgridItem6.addChild(menu6);
        //细胞7
        var cell7= new cc.MenuItemImage(res.cell72, res.cell7, function () {
            cellone.setTexture(res.cell72);
            title1.setString("浆细胞");
            title2.setString("60");
            title3.setString("10");
            title4.setString("3");

            //点我学习
            var sciencerestart = new cc.MenuItemImage(res.science11,res.science12,function () {
                //王凯名 添加了音效判断2016/12/12
                EffectEngine.playEffect(res.Select);
                //返回初次场景
                cc.director.runScene(new CellsevenScene());
            },this);
            sciencerestart.x=blackboard.width*0.5;
            sciencerestart.y=blackboard.height*0.15;
            var menu=new cc.Menu(sciencerestart);
            menu.x = 0;
            menu.y = 0;
            blackboard.addChild(menu);
        }, this);
        cell7.x = cellgridItem7.width*0.5;
        cell7.y = cellgridItem7.height*0.5;
        var menu7 = new cc.Menu(cell7);
        menu7.x = 0;
        menu7.y = 0;
        cellgridItem7.addChild(menu7);


        return true;
    }
});

var CellDetailScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new CellDetailLayer();
        this.addChild(layer);
    }
});

//获取音效设置 王凯名
var EffectEngine = function(){};
EffectEngine.playEffect = function(url){
    if (cc.sys.localStorage.getItem("isEffectOn") == "YES") {
        cc.audioEngine.playEffect(url);
    }
};