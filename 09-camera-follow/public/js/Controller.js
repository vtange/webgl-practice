function Controller()
{
    this.keyDownState = Object.create(null);
}

//warning, this will eventually be a hot mess since Game extends Controller (this.keyDownState can be overwritten by Game)

Controller.prototype.handleKeyDown = function(event){
    var aControls = this.getCurrValidControls();
    var toPlay = null;
    //glance at keydown'ed keys and play what needs to be played
    for(var actionKeyCode in aControls)
    {
        if(!toPlay || toPlay.priority < aControls[actionKeyCode].priority )
        {
            toPlay = aControls[actionKeyCode];
        }
    }

    if(toPlay)
    {
        //play action key
        toPlay.fn();
    }
}

Controller.prototype.handleKeyUp = function(event){
    var toPlay;
    delete this.keyDownState[event.code];
    //check movement keys, end player character velocity towards directions that are stopped.
    //this.stopFn(event.code);
}

Controller.prototype.getCurrValidControls = function(){
	return {
        /*
        "enter" : {priority:999,value:"show_menu"}

        */
        "KeyB" : {priority:999,fn:function(){
            console.log("B");
        }}
    };
}

Controller.prototype.getMovementKeyCodes = function(){
    return {
        "ArrowUp":[0,1],
        "ArrowDown":[0,-1],
        "ArrowLeft":[-1,0],
        "ArrowRight":[1,0]
    };
}

Controller.prototype.combineMvmt = function(ar1,ar2)
{
    return ar1.map(function(v,i){return v+ar2[i]});
}

Controller.prototype.getMvmtState = function(){
    var mControls = this.getMovementKeyCodes();
    var toPlay = null;
    for(var mvmtKeyCode in mControls)
    {
        if(this.keyDownState[mvmtKeyCode])
        {
            if(!toPlay)
            {
                toPlay = mControls[mvmtKeyCode];
            }
            else
            {
                toPlay = this.combineMvmt(toPlay, mControls[mvmtKeyCode]);
            }
        }
    }

    return toPlay;
}