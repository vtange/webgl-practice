function Controller()
{
}

Controller.prototype.handleKeyboardInput = function(evt){
    var letter = String.fromCharCode(evt.keyCode);
    letter = letter.toLowerCase();
    //run
    if(this.controls && letter)
        return this.controls[letter]();
}

