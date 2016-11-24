//2016-11-22写
var myChoose = cc.Sprite.extend({
    listener:null,
    ctor:function(fileName,id) {
        this._super(fileName);
        var size = cc.winSize;
        //事件监听器
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,//单点触碰
            swallowTouches: true,//是否向下继续触发事件
            onTouchBegan: function (touch, event) {
                var location = touch.getLocation();//获得点击的坐标
                var target = event.getCurrentTarget();//得到当前的对象(事件源)
                /*if (cc.rectContainsPoint(target.getBoundingBox(), location)) {
                    cc.log("点击到" + target.tag + "矩形");
                    return true;
                }*/

                //精确点击
                 var locationInView = target.convertToNodeSpace(location);
                 var targetSize = target.getBoundingBox();
                 var frame = cc.rect(0,0,targetSize.width,targetSize.height);
                 if(cc.rectContainsPoint(target.getBoundingBox(),location)){
                 cc.log("点击关卡");
                 return true;
                 }
                return false;//返回false时，后面不执行
            },
            onTouchMoved: function (touch, event) {
            },
            onTouchEnded: function (touch, event) {
                // cc.director.runScene(new ChooseScene());//进行跳转
               /* var target = event.getCurrentTarget();//得到当前的对象(事件源)
                var id = target.id;
                if(id == 1){<
                    cc.director.runScene(new FirstScene());
                }else if(id == 2){
                    cc.director.runScene(new SecondScene());
                }*/
            },
            onTouchCancelled: function (touch, event) {
            }
        });
        cc.eventManager.addListener(listener, this);//每创建一个对象就会添加一个监听器
        this.listener = listener;
        return true;
    },
    onExit:function(){
        this._super();
        cc.log("onExit调用 移除监听器");
        cc.eventManager.removeListener(this.listener);
    }
});