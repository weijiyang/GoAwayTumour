var res = {
    HelloWorld_png : "res/HelloWorld.png",
    Level_png:"res/1.png",
    Level_tmx:"res/1.tmx",
    Level:"res/level.jpg",
    Level_up:"res/up.png",
    Level_close:"res/close.png",
    Cell:"res/cell.png",
    Level_up_down:"res/up_down.png",
    Level_close_down:"res/close_down.png"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
