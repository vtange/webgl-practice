function Shroom(model,arrAllShrooms){
    this.m = model;
    this.all = arrAllShrooms;
    this.id = null;
    this.killed = null;
    this.isVisible = null;
    this.position = null;
}

Shroom.prototype.kill = function() {
    var shroom = this.m;
    shroom.dispose();
    this.all = this.all.filter(function(shroom){
        return shroom.id !== this.id;
    })
}