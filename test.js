angular.module("App", [])
    .controller("MainController", function ($scope,Processor) {

        $scope.world = ", please check console...";

        var pr = Processor.get("DataProcessor");

        pr.do('createLongArr',100)
            .then(function(res){
                return pr.do('sum',res.data)
            })
            .then(function(response){
                console.log(response);
            });


    })
    .factory("ProcessorFactory",function($q){

        function Processor(worker){
            this.worker = worker;
            this.taskId = 0;
            this.attachListener();
            this.promiseMap = {};
        }

        Processor.prototype.createNewTask = function(){
            this.taskId++;
            return this.taskId;
        };

        Processor.prototype.attachListener = function(){
            var self = this;
            this.worker.onmessage = function(inpSrc){
                var inp = inpSrc.data;
                var command = inp[0];
                var data = inp[1];
                var taskId = inp[2];
                self.promiseMap[taskId].resolve({
                    command:command,
                    data:data
                });
            };
        };

        Processor.prototype.do = function(methodName,data){
            var taskId = this.createNewTask();
            var defer = $q.defer();
            this.promiseMap[taskId] = defer;
            this.worker.postMessage([methodName,(data||null),taskId]);
            return defer.promise;
        };

        Processor.prototype.destroy = function(){
            this.worker.terminate();
        };


        return {
          createProcessor:function(worker){
              return new Processor(worker);
          }
        }

    })
    .service("Processor",function($q,ProcessorFactory){

        this.get = function(processingType){
            var worker = new Worker(processingType+".js");
            return ProcessorFactory.createProcessor(worker);
        }

    });