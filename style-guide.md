Psykick Style Guide
===================

The goal of this style guide is to make it appear as though one person wrote all of this code. This makes the code far more maintainable as time goes on.

General rule of thumb: run `grunt jshint` before any commits.

 - [Spacing](#spacing)
     - [Bad Examples](#bad-examples)
     - [Good Examples](#good-examples)
     - [Variable Declarations](#variable-declarations)
     - [For Loop Declarations](#for-loop-declarations)
     - [Objects](#objects)
     - [Arrays](#arrays)
     - [Function Calls](#function-calls)
     - [Function Definitions](#function-definitions)
     - [Multi-line Statements](#multi-line-statements)
     - [Chained Method Calls](#chained-method-calls)
 - [Equality](#equality)
 - [Type Checks](#type-checks)
 - [Comments](#comments)
 - [Documentation](#documentation)
 - [Quotes](#quotes)
 - [Semicolons](#semicolons)
 - [Switch Statements](#switch-statements)
 - [Naming Conventions](#naming-conventions)


----------

### Spacing

In general, aim for readability over brevity.

 - Indent using 4 spaces. This keeps it consistent regardless of editor.
 - Lines should not be longer than 80 characters.
 - `if`/`else`/`for`/`while`/`switch`/`try` always have braces and always go on multiple lines.
 - `else` cases (including `else if` are on the same line as the preceeding `}`.
 - Unary operators (e.g., `!`, `++`) should not have a space next to their operand.
 - If a `++` or `--` is being used on a separate line, indicate operation with `+= 1` or `-= 1`.
 - `,` and `;` should never be preceeded space.
 - `;` signifies the end of a line. Use it as such.
 - `:` after a property name must not be preceeded by space but may be followed by space to line up property definitions.
 - Ternary operators (e.g., `?`, `:`) must have a space on both sides.
 - No empty spaces inside empty constructs (e.g., `{}`, `[]`)
 - Only include spacing in array access if going more than 2 levels deep (but this should almost never be necessary).
 
#### Bad Examples

```javascript
// Bad
if(condition) doSomething() ;
while(! condition) count ++;
for(var i=0;i<100;i++) object[arr[arr2[i]]] = object[ arr[ i ] ]
```

#### Good Examples

```javascript
// Good
if (condition) {
    doSomething();
} else if (anotherCondition) {
    doAnotherThing();
} else {
    doLastPossibleThing();
}

while (!condition) {
    count += 1;
}

for (var i = 0; i < 100; i++) {
    object[ arr[ arr2[i] ] ] = object[arr[i]];
}
```

#### Variable Declarations

When at all possible, variables should be declared at the top of a function. This does not apply to iterators in `for` loops. Those can (and generally should) be declared within the loop declaration itself. Each variable declaration should go on a line of it's own unless it is undefined then it may be grouped in with other undefined variables.

```javascript
// Bad
var a = 'a';
var b = 'b';
var c;
var d;
c = doSomething();
d = doSomeThingElse(c);

// Good
var a = 'a',
    b = 'b',
    c, d;
    
c = doSomething();
d = doSomethingElse(c);
```

#### For Loop Declarations

Unless you intend to use the iterator number again then the counter should be declared within the `for` loop itself. Be sure to store the length of an array in a variable (also generally declared in the `for` loop) and use that as the comparison.

```javascript
// Bad
var items = getArrayOfItems(),
    i = 0;
    
for (var i = 0; i < items.length; i++) {
    doSomething(items[i]);
}

// Good
var items = getArrayOfItems();

for (var i = 0, len = items.length; i < len; i++) {
    doSomething(items[i]);
}

// Set length if item list name is long
var listOfThingsWithLongName = getArrayOfManyThings(),
    numOfThings = listOfThingsWithLongName.length;
    
for (var i = 0; i < numOfThings; i++) {
    doSomething(listOfThingsWithLongName[i]);
}

// Acceptable
var items = getArrayOfItems(),
    i;
    
for (i = 0, len = items.length; i < len; i++) {
    if (isCorrectItem(items[i])) {
        break;
    }
}

reportCorrectItemIndex(i);
```

#### Objects
Objects declarations can be made on a single line if they're short and single. When an object declaration does not fit on one line or the assignments are "complex" then each property must be on one line. Property names should only be quoted if they are reserved words or special characters.

```javascript
// Bad
var person = { name: 'Mike', 'address': '123 Jump Street', 
    occupation:'Bean counter' };
    
// Good
var person = {
    name: 'Mike',
    address: '123 Jump Street',
    occupation: 'Baller'
};

// Also acceptable if it helps clarify the meaning of the code
var person = {
    name:       'Mike',
    address:    '123 Jump Street',
    occupation: 'Baller'
};

// Works either way
var position = { x: 50, y: 100 };
// or
var position = {
    x: 50,
    y: 100
};
```

When in doubt, place it on multiple lines with one space between `:` and the declaration.

If you're declaring multiple objects (or arrays) at once then add an extra level of indentation to the property declarations.

```javascript
var mike = {
        name: 'Mike',
        address: '123 Jump Street',
        occupation: 'Baller'
    },
    jon = {
        name: 'Jon',
        address: '123 8 Mile Road',
        occupation: 'Hustler'
    };
```

#### Arrays

Arrays work much in the same way as objects. If the array is simple and short, it may be placed on one line but if it will not fit on one line, break it onto multiple lines.

```javascript
// Bad
var animals = ['cat', 'dog', 'horse', 'fish', 'wolverine', 'tiger', 'dragon'];

// Good
var animals = [
    'cat',
    'dog',
    'horse',
    'fish',
    'wolverine',
    'tiger',
    'dragon'
];

// Acceptable
var rgb = ['red', 'green', 'blue'];
```

#### Function Calls

The first `(` of a function call should always be directly beside the function itself. Multiple arguments should be separated by a `,` followed by a space.

```javascript
// Bad
doSomething ();
setColor(r ,g ,b);

// Good
doSomething();
setColor(r, g, b);
```

#### Function Definitions

In general, function expressions (e.g., `var someFunction = function() { ... };`) are preferred over function declarations (e.g., `function someFunction() { ... }`). Constructors will always be written as function expressions and will be preceeded by `var` regardless of any prior variable declarations. Function declarations should be used for explicitly private functions.

Any time a function is defined, there will be a space between the last `)` and the first `{` of the function body. Functions will always be on multiple lines unless explicitly used as an empty function. This applies to anonymous functions as well.

```javascript
// Bad
function Person(name) {
    this.name = name;
}

var someFunction = function(a){ console.log(a); };

var privateFunction = function() {
    doSomething();
};

doSomeAsyncWork(function(result) { console.log(result); });

// Good
var Person = function(name) {
    this.name = name;
};

var someFunction = function(a) {
    console.log(a);
};

function privateFunction() {
    doSomething();
}

doSomeAsyncWork(function(result) {
    console.log(result);
});

// Example of using an empty function
var doSomeAsyncWork = function(done) {
    done = done || function() {};
    asyncFunction(done);
};
```

#### Multi-line Statements

When a statement is too long to fit on one line, line breaks must occur after an operator. New line should align with previous line to show they belong together.

```javascript
// Bad
var address = streetNumber + ' ' + streetName + ', ' + city + ', ' + state + ' ' + zipCode;

// Good
var address = streetNumber + ' ' + streetName + ', ' +
              city + ', ' + state + ' ' + zipCode;
```

If a conditional is too long to fit on one line, it may be broken into multiple lines and indented one level deeper than the body.

```javascript
// Bad
if (firstCondition && secondCondition && thirdCondition && fourthCondition) {
    doSomething();
}

if (firstCondition && secondCondition &&
    thirdCondition && fourthCondition) {
    doSomething(); 
}

// Good
if (firstCondition && secondCondition &&
        thirdCondition && fourthCondition) {
    doSomething();
}
```

#### Chained Method Calls

Chained calls should generally be split on to multiple lines and must always be split if they do not fit on one line. Each successive line is indented an additional level, unless additional indentation provides more clarity.

```javascript
// Bad
firstFunction().secondFunction().thirdFunction().fourthFunction();
elements.addClass('psycho').children().html('Hey-yo').end().appendTo('body');

// Good
firstFunction()
    .secondFunction()
    .thirdFunction()
    .fourthFunction();
elements
    .addClass('psycho')
    .children()
        .html('Hey-yo')
    .end()
    .appendTo('body');
    
// Preferred (even if only one chain occurs)
object
    .first()
    .second();
```

### Equality

**Always** use strict equality checks (`===`). There's no good reason not to.

```javascript
// Bad
if (thingA == thingB) {
    doSomething();
}

// Good
if (thingA === thingB) {
    doSomething();
}
```

### Type Checks

 - String: `typeof object === 'string'`
 - Number: `typeof object === 'number'`
 - Boolean: `typeof object === 'boolean'`
 - Object: `typeof object === 'object'`
 - null: `object === null`
 - undefined: `object === undefined`
 
### Comments

Comments are always preceeded by a blank line, unless they're at the beginning of a function body. Comments start with a capital first letter but don't required a period unless there's multiple sentences. There must be a single space between the comment token and the comment text. Multi-line comments should have a `*` on each line.

```javascript
// Bad
doSomething();
// we need this thing later to do something else
var thing = getImportantThing();

/*
Here's a multi-line comment
*/

// Good
doSomething();

// We need this thing later to do something else
var thing = getImportantThing();

/*
 * Here's an actual multi-line comment.
 * As you see, it takes up multiple lines
 */
```

### Documentation

All functions (except for inline anonymous functions) should be documented using Google Closure Compiler syntax. This aids in code hinting and provides a clear declaration of parameters.

```javascript
// Bad
function getSomething() {
    // Do some stuff
    return stuff;
}

/**
 * Returns the sum of two numbers
 */
var sum = function(a, b) {
    return a + b;
};

// Good
/**
 * Gets some cool stuff
 *  @returns {CoolThing}
 */
function getSomething() {
    // Do some stuff
    return stuff;
}

/**
 * Returns the sum of two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 */
var sum = function(a, b) {
    return a + b;
};
```

### Quotes

Use single quotes.

```javascript
// Bad
var string = "Here's a string";

// Good
var string = 'Here\'s a string';
```

### Semicolons

If you don't use them then Douglas Crockford will break your fingers and take a dump on your computer.

### Switch Statements

Switch statements always go on multiple lines and `case`s are indented one level. Fall through is discouraged but can be used if there's a good reason for it. Always include a `default` block, even if all the cases have been covered.

```javascript
// Bad
switch (condition) {
case 'a':
    doStuff();
case 'b':
    doSomethingElse();
}

// Good
switch (condition) {
    case 'a':
        doStuff();
        break;
    case 'b':
        doSomethingElse();
        break;
    default:
        throw new Error('Was not expecting ' + condition);
}
```

### Naming Conventions

 - Local variables: Should be camelCase and relatively descriptive but not overboard.
     - Good: `var cubeComponent = entity.getComponent('Cube')`
     - Bad: `var cubeComponentForRedCube = redCubeEntity.getComponent('Cube')`
 - Iterators: Follow the typical `i`, `j`, `k` names.
 - Constructors: Named using PascalCase.
     - Good: `var RedCubeFactory = ...`
     - Bad: `var redCubeFactory = ...`
 - Constants: Written in all caps. Words are separated with an `_`
     - Good: `var NUMBER_OF_THINGS = 20`
     - Bad: `var NUMBEROFTHINGS = 20`
 - Function names: Describe the action being done. Generally, if a function returns a value, it's name begins with `get`. This isn't set in stone so use your best judgement.
     - Good: `function getAllTheThings() { ... }`
     - Bad: `function allTheThings() { return allTheThings; }`
 - Filenames: Should be all lowercase with words separated by a `-`. They should match the name of the Component or System which they describe.
     - Good: `my-new-and-shiny-component.js`
     - Bad: `MyNewAndShinyComponent.js`
