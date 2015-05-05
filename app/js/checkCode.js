'use strict';
var codeTests = require('./codeTests');
/* global onmessage:true, postMessage */

onmessage = function(msg) { // expecting [code, rule]
  var code = msg.data[0];
  var rule = msg.data[1];
  var result;
  if (rule[0] === '!') {
    result = codeTests.shouldNotContain(code, rule.slice(1));
  } else {
    result = codeTests.shouldHaveStructure(code, rule);
  }
  postMessage([result, rule]);
};
