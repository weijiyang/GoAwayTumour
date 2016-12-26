/**
 * Created by 张东杰 on 2016/12/7.
 */
var EffectNode_two = cc.Sprite.extend({
    sprite1:null,
    ctor : function (fileName, rect, rotated) {
        this._super(fileName, rect, rotated);
    },
    loadAction:function () {
        this.stopAllActions();
        this.setScale(0.1);
        this.setOpacity(255);
        var time = 0.6;

        var delay = cc.delayTime(time * 1.2);
        var fadeOut = cc.fadeOut(time * 1).easing(cc.easeExponentialOut());
        var delayOut = cc.sequence(delay, fadeOut);
        this.runAction(delayOut);

        var scaleTo12 = cc.scaleTo(time, 1.5);
        var blink = cc.blink(1.5,100);
        var seq = cc.sequence(scaleTo12, blink);
        this.runAction(seq);
    }
});


