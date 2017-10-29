function Controller()
{
    this.keyDownState = Object.create(null);
}

//warning, this will eventually be a hot mess since Game extends Controller (this.keyDownState can be overwritten by Game)

Controller.prototype.handleKeyDown = function(event){
    this.keyDownState[event.code] = true;
}

Controller.prototype.handleKeyUp = function(event){
    delete this.keyDownState[event.code];
}

Controller.prototype.getCurrValidControls = function(){
	return {
        /*
        "enter" : {priority:999,value:"show_menu"}

        */
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
    return ar1.slice().map(function(v,i){return v+ar2[i]});
}

Controller.prototype.playControllerState = function(){
    //get valid controls (moving + start / moving + a/b / nado)
    var aControls = this.getCurrValidControls();
    var mControls = this.getMovementKeyCodes();
    var toPlay = null;
    //glance at keydown'ed keys and play what needs to be played
    for(var actionKeyCode in aControls)
    {
        if(!toPlay || toPlay.priority < this.keyDownState[actionKeyCode].priority )
        {
            toPlay = this.keyDownState[actionKeyCode];
        }
    }

    if(toPlay)
    {
       return toPlay.value;
    }


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