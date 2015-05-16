'use strict';

require('codemirror/mode/javascript/javascript');
var codeMirror = require('codemirror/lib/codemirror');
var _ = require('underscore');
var codeChecker = require('./asyncCodeChecker');

var addCodeMirror = function() {
  // Replace the text area with a codemirror editor
  var editor = codeMirror.fromTextArea($('#editor')[0], {
    mode:  'javascript',
    lineNumbers: true
  });
  // mirror the code mirror changes to the original text area
  editor.on('change', function() { 
    editor.save();
    $('#editor').change();
  });
};

// get the rules from the proper data attributes
var getRules = function() {
  var results = [];
  $('.rules Span').each(function() {
    results.push($(this).data('rule'));
  });
  return results;
};

var markRule = function(result, rule) {
  var $span = $('.rules span[data-rule="' + rule + '"]');
  if (result){
    $span.removeClass('label-default label-warning');
    $span.addClass('label-success');
  } else {
    $span.removeClass('label-success');
    $span.addClass('label-warning');
  }
};

$(function() {
  var rules = getRules();
  codeChecker.registerRuleMarker(markRule);
  addCodeMirror();
  $('#editor').change(_.debounce(function() {
    var code = $('#editor').val();
    _.each(rules, function(rule) {
      codeChecker.checkRule(code, rule);
    });
  }, 100));
});
