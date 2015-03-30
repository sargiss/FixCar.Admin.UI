Array.prototype.any = function (filter) {
    for (var i = 0; i < this.length; i++) {
        if (filter(this[i]))
            return true;
    }
    return false;
};