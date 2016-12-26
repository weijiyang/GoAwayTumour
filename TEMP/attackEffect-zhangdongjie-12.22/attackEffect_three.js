/**
 * Created by 张东杰 on 2016/12/7.
 */
var EffectNode = cc.Sprite.extend({
    ctor : function (fileName, rect, rotated) {
        this._super(fileName, rect, rotated);
    },
    loadAction : function(){
        this.stopAllActions();
        this.setScale(0.1);
        this.setOpacity(255);
        var time = 0.6;

        var delay = cc.delayTime(time * 0.6);
        var fadeOut = cc.fadeOut(time * 0.5).easing(cc.easeExponentialOut());
        var delayOut = cc.sequence(delay, fadeOut);
        this.runAction(delayOut);

        //var callback = cc.callFunc(this.loadAction.bind(this), this);
        var scaleTo12 = cc.scaleTo(time, 1);
        var delayCall = cc.delayTime(1);
        var seq = cc.sequence(scaleTo12, delayCall);
        this.runAction(seq);
    }
});

