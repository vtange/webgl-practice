function Controller()
{
}

Controller.prototype.handleKeyboardInput = function(evt){
    //run
    if(typeof this.controls[evt.code] == "function")
        return this.controls[evt.code]();
    else{
        console.log(evt.code);
    }
}

