'use strict';

var parser = require('esprima');
var _ = require('underscore');


// Parse a string and produce a syntax tree
// 
// Accepts
//   String - javascript text
//   
// Returns
//   Object - A syntax tree
var parse = function(string) {
  return parser.parse(string);
};

// Find a particular Type in a syntax tree
// 
// Accepts
//   Object - a syntax tree (or partial tree)
//   
// Returns
//   Array of objects. Each object is a subtree of the original syntax tree
var find = function(syntaxTree, type) {
  if (!_.isObject(syntaxTree)) {
    return [];
  }
  var results = [];
  if (syntaxTree.type === type) {
    results.push(syntaxTree);
  }
  results = _.reduce(syntaxTree, function(memo, subtree) {
    return memo.concat(find(subtree, type));
  }, results);

  return results;
};


// A whitelist of specific functionality. For example, the ability to say 
// "This program MUST use a 'for loop' and a 'variable declaration'."
//
// Accepts 
//   String - the string to parse
//   String - a sting representing a MDN Parse API type 
// 
// Returns 
//  Bool - true if the type is present in the syntax tree
module.exports.shouldContain = function(string, type) {
  return module.exports.shouldHaveStructure(string, type);
};

// A blacklist of specific functionality. For example, the ability to say 
// "This program MUST NOT use a 'while loop' or an 'if statement'."
// 
// Accepts a sting representing a MDN Parse API type 
//   String - the string to parse
//   String - a sting representing a MDN Parse API type 
//  
// Returns 
//   Bool - false if the type is present in the syntax tree
module.exports.shouldNotContain = function(string, type) {
  return !module.exports.shouldContain(string, type);
};

// Determine the rough structure of the program. For example, 
// "There should be a 'for loop' and inside of it there should be an 'if statement'."
//
// Accepts 
//   String- the string to parse
//   Sting - a specially formated sting of MDN Parse API types
// 
// type1>type2 type2 is inside of type1
// E.X. "There should be a 'for loop' and inside of it there should be an 'if statement'."
// E.X. ForStatement>IfStatement
// 
// Returns Bool - true if the specified structure is present
module.exports.shouldHaveStructure = function(string, structure) {
  var types = structure.split('>');
  var candidates;
  try {
    candidates = [parse(string)];
  } catch (error) {
    return false;
  }

  _.each(types, function(type) {
    var subCandidates = [];
    _.each(candidates, function(candidate) {
      subCandidates = subCandidates.concat(find(candidate, type));
    });
    candidates = subCandidates;
  });

  return candidates.length > 0;
};
