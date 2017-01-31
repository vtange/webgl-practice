function Shroom(model,arrAllShrooms){
    this.m = model;
    this.all = arrAllShrooms;
    this.killed = null;
}

Shroom.prototype.kill = function() {
    var shroom = this.m;
    shroom.dispose();
    this.all = this.all.filter(function(shroom){
        return shroom.id !== this.id;
    })
}