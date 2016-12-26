//肿瘤的子类
var subMonster = Monster.extend({
    data : {
        blood : 100,
        attack : 1,//攻击被保护对象的消耗值
        speed : 3,
    },
   /* blood : 100,
    speed : 3,
    attack : 1,*/
    // fileNamePrefix : "B1",
    ctor:function(fileName,data){
        this._super(fileName);
        /*this.data = data;
        this.speed = data.speed;
        this.blood = data.blood;*/
    }
});