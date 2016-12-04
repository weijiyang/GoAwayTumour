/**
 * Created by 张东杰 on 2016/11/29.
 */
var Move = cc.Sprite.extend({
    tiledMap:null,
    arr :[],
    sort:[],
    temparray:[],
    begin:0,
    end:0,
    nowPosition:0,
    blood : 0, //现有血量
    allBlood : 100, //总血量
    timer : null,
    size:null,
    ctor:function (fileName, rect, rotated) {
        this._super(fileName, rect, rotated);
        this.size = rect;
        var size = cc.winSize;
        //this.fullBlood(0);
        this.clearArray();
        this.schedule(this.moveToNextRoad,0.5);


        return true;
    },
    fullBlood:function (blood) {
        //进度条(也是需要动作的)
        var timer = new cc.ProgressTimer(res.blood);
        timer.x = this.size.width/2;
        timer.y = this.size.height/2;
        timer.type = cc.ProgressTimer.TYPE_BAR;//进度条的形式(由里向外)
        timer.midPoint = cc.p(0,0);//中间点
        timer.barChangeRate = cc.p(1,0);//改变率，指方向（x，y）
        this.timer = timer;
        this.blood = blood;
        this.addChild(timer);
        //可变
        var per = (blood / this.allBlood)*100;
        var timerAction = cc.progressFromTo(2.0,100,per);//2秒内，百分比到另一个百分比
        timer.runAction(timerAction);
    },
    clearArray:function () {
        this.arr = [];
        this.sort = [];
        this.temparray = [];
    },
    //移动到路径的下一个点
    moveToNextRoad:function () {
        var nextPosition = this.getNextPosition();
        this.runAction(cc.moveTo(0.5,cc.p(nextPosition.x,nextPosition.y)));
    },
    moveToNextRoad_fast:function () {
        var nextPosition = this.getNextPosition_fast();
        this.runAction(cc.moveTo(0.25,cc.p(nextPosition.x,nextPosition.y)));
    },
    moveToNextRoad_slow:function () {
        var nextPosition = this.getNextPosition_slow();
        this.runAction(cc.moveTo(100,cc.p(nextPosition.x,nextPosition.y)));
    },
    //获取下一个点的坐标
    getNextPosition:function () {
        this.nowPosition++;
        if(this.nowPosition==this.arr.length-1){
            this.unschedule(this.moveToNextRoad);
        }
        return this.arr[this.nowPosition];

    },
    getNextPosition_fast:function () {
        this.nowPosition++;
        if(this.nowPosition==this.arr.length-1){
            this.unschedule(this.moveToNextRoad_fast);
        }
        return this.arr[this.nowPosition];

    },
    getNextPosition_slow:function () {
        this.nowPosition++;
        if(this.nowPosition==this.arr.length-1){
            this.unschedule(this.moveToNextRoad_slow);
        }
        return this.arr[this.nowPosition];

    },
    //遍历瓦片地图，获取类型为"road"的像素坐标，放入数组中
    getArray:function(tileMap,arr){
        var bgLayer = tileMap.getLayer("bg");
        var tileGID =null;
        var properties =null;
        var mapSize = tileMap.getMapSize();
        for(var i = 0; i<mapSize.width;i++){
            for(var j=0; j<mapSize.height;j++){
                tileGID=bgLayer.getTileGIDAt(cc.p(i,j));
                properties=tileMap.getPropertiesForGID(tileGID);
                if(properties.type=="road"){
                    var pixPosition = bgLayer.getPositionAt(cc.p(i,j));
                    this.arr.push(pixPosition);
                }
            }
        }
    },
    // 将需要调换位置的点进行坐标转换
    getLength:function (arr){//参数为该数组
        for(var i=0;i<arr.length-1;i++){
            if(arr[i]['x']!=arr[i+1]['x']){
                if(arr[i]['y']!=arr[i+1]['y']){
                    this.sort.push(i);
                }
            }
        }
    },
    // 计算须要有多少数组进行重新排序
    times:function (sort){
        var length=sort.length/2;
        for(var i=0;i<length;i++){
            this.begin=sort[i*2]+1;
            this.end=sort[i*2+1];
            if(this.temparray.length>2){
                this.temparray=[];
            }
            this.getNew(this.begin,this.end);
        }
    },
    //获取到更新后的数组
    getNew:function (begin,end){//参数为 数组  起始  终点位置
        for(var i=end;i>=begin;i--){
            this.temparray.push(this.arr[i]);
        }
        for(var i=begin,j=0;i<=end;i++,j++){
            this.arr[i]=this.temparray[j];
        }
    },
    // 打印二位数组
    showArray:function (arr){
        for(var i in arr){
            cc.log(arr[i]['x']+"," +arr[i]['y'] );
        }
    }
});
