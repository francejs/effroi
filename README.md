![Effroi.js](http://francejs.org/effroi/images/effroi.png)

[![Build Status](https://travis-ci.org/francejs/effroi.png?branch=master)](https://travis-ci.org/francejs/effroi)

An event-simulation library for JavaScript testing.

## How to use

### Device API

The device API goal is to emulate a real device and fire every events usually
 fired for each action a device permit.

#### Mouse
```js
var mouse = effroi.mouse;
// Scrolling with the mouse
mouse.scroll(x, y); // Returns true if scrolled false otherwise
mouse.scrollTo(element); // Returns true if scrolled
// Moving the cursor
mouse.move(x, y);  // Returns true if dispatched
mouse.moveTo(element); // Returns true if dispatched
// Clicking
mouse.click(); // Returns true if dispatched
// Right-clicking
mouse.rightclick(); // Returns true if dispatched
// Double-clicking
mouse.dblclick(); // Returns true if dispatched
// Pasting with the mouse
mouse.paste(inputElement, 'content');
// Cutting with the mouse
mouse.cut(inputElement); // Returns the cutted content
```

#### Keyboard
```js
var kbd = effroi.keyboard;
// Tabbing with the keyboard
kbd.tab(); // Returns true if dispatched
// Focusing an element
kbd.focus(element); // Returns true if focus changed
// Hitting a key
kbd.hit('a'); // Returns true if dispatched
kbd.hit('b','c','d'); // Returns true if dispatched
// Combining keys
kbd.combine(this.CTRL, 'c'); // Returns true if dispatched
// Pasting with the keyboard
kbd.paste('content');
// Cutting with the keyboard
kbd.cut(); // Returns the cutted content
```

#### Tactile
```js
var tactile = effroi.tactile;
// Scrolling with the tactile display
tactile.scroll(x, y); // Returns true if scrolled false otherwise
tactile.scrollTo(element); // Returns true if scrolled
// Performing a touch
tactile.touch(); // Returns true if dispatched
```

#### Unified pointing device API (PointerEvents)
Under development.

## How to contribute

1. Clone this repo
2. npm install
3. To run the tests: 

```sh
grunt test
```
4. To build the lib: 

```sh
grunt dist
```
