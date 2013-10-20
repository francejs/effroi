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
// Double-clicking
mouse.dblclick(); // Returns true if dispatched
```

#### Tactile
```js
var tactile = effroi.tactile;
// Scrolling with the tactile display
tactile.scroll(x, y); // Returns true if scrolled false otherwise
tactile.scrollTo(element); // Returns true if scrolled
// Performing a touch
tactile.touch(); // Returns true if dispatched
// Double-touching
tactile.dbltouch(); // Returns true if dispatched
```

#### Keyboard
Under development.

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
