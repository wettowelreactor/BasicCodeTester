# BasicCodeTester
##Basic functionality for testing student code.

### Code tests offers the following three functions:

A whitelist of specific functionality. For example, the ability to say 
"This program MUST use a 'for loop' and a 'variable declaration'."

Accepts 
  String - the string to parse
  String - a sting representing a MDN Parse API type 
 
Returns 
  Bool - true if the type is present in the syntax tree
function shouldContain(string, type)

A blacklist of specific functionality. For example, the ability to say 
"This program MUST NOT use a 'while loop' or an 'if statement'."
 
Accepts a sting representing a MDN Parse API type 
  String - the string to parse
  String - a sting representing a MDN Parse API type 
  
Returns 
  Bool - false if the type is present in the syntax tree
function shouldNotContain(string, type)

Determine the rough structure of the program. For example, 
"There should be a 'for loop' and inside of it there should be an 'if statement'."

Accepts 
  String- the string to parse
  Sting - a specially formated sting of MDN Parse API types
 
type1>type2 type2 is inside of type1
E.X. "There should be a 'for loop' and inside of it there should be an 'if statement'."
E.X. ForStatement>IfStatement

Returns Bool - true if the specified structure is present
function shouldHaveStructure(string, structure)

### An example implementation is also provided
To run the example server up the static folder
