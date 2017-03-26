function Character(model){
    this.m = model;
    this.killed = null;
}

Character.prototype.kill = function() {
    var char = this.m;
    char.dispose();
}