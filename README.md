![Effroi.js](http://francejs.org/effroi/images/effroi.png)

[![Build Status](https://travis-ci.org/francejs/effroi.png?branch=master)](https://travis-ci.org/francejs/effroi)

A JavaScript event-simulation, device oriented library for UI testing.

## Device oriented ?

Effroi try to be the closest possible of the way your users use their input
 devices. To achieve this goal, effroi emulate real physical devices and fires
 every events a real device would fire for the same action.

By example, when a user want to click an element the following events sequence
 are fired:
- several mousewheel events to scroll to the element (if needed)
- several mouseout/mousemove/mouseover events to go over the element (if needed)
- mousedown/mouseup events
- a click event if none of the 2 previous events have been prevented

That's typically what effroi emulate for your UI tests. Effroi will also check
 for the feasibility of the requested action. If you try to click an element
 that is nor visible nor clickable, effroi will throw an error.

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
mouse.click(element); // Returns true if dispatched
// Right-clicking
mouse.rightclick(element); // Returns true if dispatched
// Double-clicking
mouse.dblclick(element); // Returns true if dispatched
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
