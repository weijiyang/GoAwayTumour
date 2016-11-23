/**
 * Created by 张东杰 on 2016/11/21.
 */

var AboutLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;

        var bg = new cc.Sprite(res.About_png);
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        bg.setScale(1.0);
        bg.setAnchorPoint(0.5,0.5);
        this.addChild(bg);

        var title = new cc.LabelTTF("《滚蛋吧！肿瘤君》","Arial","10");
        title.x = size.width*0.5;
        title.y = size.height*0.7;
        title.setScale(1.5);
        title.setFontFillColor(cc.color.BLACK);
        title.setFontSize(30);
        title.enableStroke(cc.color.GREEN,2);
        this.addChild(title);

        var leader = new cc.LabelTTF("项目经理：魏继阳","Arial","10");
        leader.x = size.width *0.5;
        leader.y = size.height*0.57;
        leader.setScale(1.0);
        leader.setFontFillColor(cc.color.BLACK);
        leader.setFontSize(30);
        leader.enableStroke(cc.color.GREEN,2);
        this.addChild(leader);

        var member = new cc.LabelTTF("开发人员：崔迎春，郑蕊，曹阳，王凯名，张东杰","Arial","10");
        member.x = size.width*0.5;
        member.y = size.height*0.48;
        member.setScale(1.0);
        member.setFontFillColor(cc.color.BLACK);
        member.setFontSize(30);
        member.enableStroke(cc.color.GREEN,2);
        this.addChild(member);

        var version = new cc.LabelTTF("版本号：V1.0.0","Arial","10");
        version.x = size.width*0.5;
        version.y = size.height*0.4;
        version.setScale(1.0);
        version.setFontFillColor(cc.color.BLACK);
        version.setFontSize(30);
        version.enableStroke(cc.color.GREEN,2);
        this.addChild(version);

        return true;
    }
});

var AboutScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new AboutLayer();
        this.addChild(layer);
    }
});

