TreeGenerator = function(scene, sd) {
    this.treeNumber = 50;
    this._trees = [];
    this.scene = scene;
    this.minSizeBranch = 15;
    this.maxSizeBranch = 20;

    this.minSizeTrunk = 10;
    this.maxSizeTrunk = 15;
    this.minRadius = 1;
    this.maxRadius = 5;

    this.sd = sd;

    this.generate();
};

TreeGenerator.prototype.generate = function() {

    this.clean();

    var randomNumber = function (min, max) {
        if (min == max) {
            return (min);
        }
        var random = Math.random();
        return ((random * (max - min)) + min);
    };

    var size,
        sizeTrunk, x, z, radius;

    for (var i = 0; i<this.treeNumber; i++) {
        size = randomNumber(this.minSizeBranch,this.maxSizeBranch);
        sizeTrunk = randomNumber(this.minSizeTrunk,this.maxSizeTrunk);
        radius = randomNumber(this.minRadius,this.maxRadius);
        x = randomNumber(-300, 300);
        z = randomNumber(-300, 300);

        var tree = new Tree(size, sizeTrunk, radius, this.scene, this.sd);
        tree.position.x = x;
        tree.position.z = z;
        this._trees.push(tree);
    }
};

TreeGenerator.prototype.clean = function() {
    this._trees.forEach(function(t) {
        t.dispose();
    });

    this._trees = [];
};