 module.exports.areEqual = function(){
    var len = arguments.length;
    for (var i = 1; i< len; i++){
        if (arguments[i] == null || arguments[i] != arguments[i-1])
            return false;
    }
    return true;
}