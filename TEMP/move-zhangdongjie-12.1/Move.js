/**
 * Created by 张东杰 on 2016/11/29.
 */
var MoveLayer = cc.Layer.extend({
    tiledMap:null,
    arr : [],  //坐标数组
    sort:[],
    monster:null,
    temparray:[],
    nowPosition:0,
    ctor:function () {
        this._super();
        var size = cc.winSize;

/*        var tileMap = new cc.TMXTiledMap(res.Level_tmx);
        this.tiledMap=tileMap;
        this.addChild(tileMap);

        var mapSize = tileMap.getMapSize();
        var tileSize = tileMap.getTileSize();

         var bgLayer = tileMap.getLayer("bg");

        var objectGroup = tileMap.getObjectGroup("object");

        var player = objectGroup.getObject("player");

        var sp = new cc.Sprite(res.abc_png);
        sp.setAnchorPoint(cc.p(0,1));
        sp.x =player.x;
        sp.y =player.y+tileSize.width;
        this.addChild(sp);*/

        //实验四
        // function moveAndCollide(movPos){
        //     var newPosition = cc.pAdd(sp.getPosition(),movPos);
        //     var tileX = Math.floor(newPosition.x/70);
        //     var tileY = Math.floor((size.height - newPosition.y)/70);
        //     //cc.log("tileX:"+tileX+"tileY:"+tileY);
        //
        //     var tileGID = bgLayer.getTileGIDAt(cc.p(tileX,tileY));
        //     //cc.log("tileGID:"+tileGID);
        //     var properties = tileMap.getPropertiesForGID(tileGID);
        //     if(properties == null){
        //         sp.setPosition(newPosition);
        //         return;
        //     }else if (properties.type == "road"){
        //         sp.setPosition(newPosition);
        //         return;
        //     }else if (properties.type == "block"||properties.type == "ground"){
        //         return;
        //     }else{
        //         sp.setPosition(newPosition);
        //     }
        // }
        //this.schedule(this.move,0.001);
        //this.schedule(this.enemyCallback,0.001);
/*        var listener = cc.EventListener.create({
            event:cc.EventListener.KEYBOARD,
            onKeyPressed:function(key,event){
                switch(key){
                    case cc.KEY.up:
                        moveAndCollide(cc.p(0,70));
                        break;
                    case cc.KEY.down:
                        moveAndCollide(cc.p(0,-70));
                        break;
                    case cc.KEY.left:
                        moveAndCollide(cc.p(-70,0));
                        break;
                    case cc.KEY.right:
                        moveAndCollide(cc.p(70,0));
                        break;
                    default:
                }
            }
        });
        cc.eventManager.addListener(listener,this);*/
        this.loadTiledMap();
        this.loadSprite();
        this.getArray();
        this.getLength(this.arr);
        this.times(this.arr,this.sort);
        //this.getNew();
        //this.showArray(this.arr);

        this.schedule(this.moveToNextRoad,0.5);

        return true;
    },
    moveToNextRoad:function () {
        var nextPosition = this.getNextPosition();
            this.monster.runAction(cc.moveTo(0.5,cc.p(nextPosition.x,nextPosition.y)));
    },
    getNextPosition:function () {
        this.nowPosition++;
        if(this.nowPosition==this.arr.length-1){
            this.unschedule(this.moveToNextRoad);
        }
        return this.arr[this.nowPosition];

    },
    loadTiledMap : function(){
        var tileMap = new cc.TMXTiledMap(res.Level_tmx);
        this.tiledMap=tileMap;
        this.addChild(tileMap);
    },
    loadSprite:function () {
        var tileSize = this.tiledMap.getTileSize();
        var objectGroup = this.tiledMap.getObjectGroup("object");

        var player = objectGroup.getObject("player");
        var sp = new cc.Sprite(res.abc_png);
        sp.setAnchorPoint(cc.p(0,0));
        sp.x =player.x;
        sp.y =player.y;
        //cc.log(player.y+"add");
        this.monster=sp;
        this.addChild(sp);
    },
    getArray:function(){
        var bgLayer = this.tiledMap.getLayer("bg");
        var tileGID =null;
        var properties =null;
        //var tileGID = bgLayer.getTileGIDAt(cc.p(i,j));
        //cc.log("tileGID:"+tileGID);
        //var properties = this.tiledMap.getPropertiesForGID(tileGID);
        var mapSize = this.tiledMap.getMapSize();
        for(var i = 0; i<mapSize.width;i++){
            for(var j=0; j<mapSize.height;j++){
                tileGID=bgLayer.getTileGIDAt(cc.p(i,j));
                //cc.log("tileGID:"+tileGID);
                properties=this.tiledMap.getPropertiesForGID(tileGID);
                // console.log(tileGID+properties.type);
                if(properties.type=="road"){
                    var pixPosition = bgLayer.getPositionAt(cc.p(i,j));
                    //cc.log(pixPosition);
                    this.arr.push(pixPosition);
                    //cc.log(this.arr);
                }
            }
        }
    },

// 因为这里sort[0]+1 和 sort[1]  即为须要调换位置的起始坐标
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
times:function (arr,sort){
    var length=sort.length/2;
    for(var i=0;i<length;i++){
        var begin=sort[i*2]+1;
        var end=sort[i*2+1];
        this.getNew(arr,begin,end);
    }
},
getNew:function (arr,begin,end){//参数为 数组  起始  终点位置
    for(var i=end;i>=begin;i--){

        this.temparray.push(arr[i]);
    }
    for(var i=begin,j=0;i<=end;i++,j++){
        arr[i]=this.temparray[j];
    }
},
// 打印二位数组
showArray:function (arr){
    for(var i in arr){
        cc.log(arr[i]['x']+"," +arr[i]['y'] );
    }
}


});

var MoveScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MoveLayer();
        this.addChild(layer);
    }
});