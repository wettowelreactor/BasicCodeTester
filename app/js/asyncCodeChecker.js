'use strict';
/* global Worker:true */

var _ = require('underscore');
if (!Worker) {
  Worker = require('./worker'); // early ie worker shim
}

var AsyncCodeChecker = function() {
  this.webWorker = new Worker('assets/webWorker.js');
  this.ruleMarkers = [];
  this.webWorker.onmessage = _.bind(function(msg) {
    var result = msg.data[0];
    var rule = msg.data[1];
    _.each(this.ruleMarkers, function(ruleMarker) {
      ruleMarker(result, rule);
    });
  }, this);
};

AsyncCodeChecker.prototype.checkRule = function(code, rule) {
  this.webWorker.postMessage([code, rule]);
};

AsyncCodeChecker.prototype.registerRuleMarker = function(ruleMarker) {
  if (_.indexOf(this.ruleMarkers, ruleMarker) === -1) {
    this.ruleMarkers.push(ruleMarker);  
  }
};

AsyncCodeChecker.prototype.unregisterRuleMarker = function(ruleMarker) {
  var index = _.indexOf(this.ruleMarkers, ruleMarker);
  if (index !== -1) {
    this.ruleMarkers.splice(index, 1);  
  }
};

module.exports = new AsyncCodeChecker();
