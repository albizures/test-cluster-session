var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (var i = 0; i < 10; i++) {
    cluster.fork();
  }
  console.log(numCPUs);

  cluster.on('exit', function(worker, code, signal) {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    console.log('Starting a new worker');
    setTimeout(function () {
      cluster.fork();
    }, 3000);
  });
} else {
  require('./server.js');
}
