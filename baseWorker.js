var self = this;

onmessage = function (inpSet) {
    var inp = inpSet.data;
    var command = inp[0];
    var data = inp[1];
    var taskId = inp[2];

    function done(data) {
        postMessage([command, data, taskId]);
    }

    self[command](data, done);
};


