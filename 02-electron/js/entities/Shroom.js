function Shroom(model){
    this.m = model;
    this.killed = null;
}

Shroom.prototype.kill = function() {
    var shroom = this.m;
    shroom.dispose();
}