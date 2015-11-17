importScripts('baseWorker.js');

createLongArr = function(len,done){
    var arr = new Array(len);

    for(var i=0;i<arr.length;i++){
        arr[i] = i;
    }

    done(arr);
};

sum = function (arr, done) {
    var s = 0;

    for(var i=0;i<arr.length;i++){
        s +=arr[i];
    }

    done(s);
};












