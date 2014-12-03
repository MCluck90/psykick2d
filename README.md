# Psykick2D 

----------

Psykick2D is an HTML5 game engine built with performance and usability in mind. Rendering is lightning fast with [Pixi.js][1]. Psykick2D aims to help your code be easy to work with, highly performant, and easily modified for special needs.

----------

## Features

* Clean separation of concerns with an **Entity-Component** architecture
* Easily modified **camera** system
* Built in **collision detection** systems
* Pre-built platformer **physics** (more coming soon)
* Audio, images, and **sprite sheets** management
* Keyboard, mouse, and **gamepad** support
* Built in **animation**
* Can be used as a Node.js module or loaded directly into the browser
* Don't need everything? Use the **custom build** system to keep what you need

## Requirements

Psykick2D requires a modern browser. I develop it in Chrome but have also tested in Firefox without any issues. Attempt in IE at your own risk.

## Examples

All of the code and resources for the examples are in the `examples` folder.

* [Pong][2]
* [Dudley: The Dud Missile - Platformer][3]

## Getting Started

### Node.js

Just install it like you would any other module:
```bash
npm install psykick2d
```

### Browser

If you just want to drop it in your browser and go, use the pre-built version:
```bash
build/psykick2d.js
```

### Guides

For more information, check out the [Getting Started guides][8] or any 
one 
of the included [examples][4].

## How to Build

Building is just a simple grunt command: `grunt build`

## Bugs

If you find any bugs, please submit them to the [issue tracker][5].

## Contributing

If you like Psykick2D and would like to help I'd love to have you! Feel free to tackle any bugs in the [issue tracker][5] or [jump on the mailing list][6] and talk about what you want out of the engine, stuff that needs to be fixed, anything. My vision is to make this a game engine by developers, *for* developers.

## License

Psykick2D is licensed under the [MIT License][7].


  [1]: http://www.pixijs.com
  [2]: http://mcluck90.github.io/psykick2d/pong
  [3]: http://mcluck90.github.io/psykick2d/platformer
  [4]: https://github.com/MCluck90/psykick2d/tree/master/examples
  [5]: https://github.com/MCluck90/psykick2d/issues
  [6]: https://groups.google.com/forum/#!forum/psykick2d
  [7]: http://opensource.org/licenses/MIT
  [8]: http://mcluck90.github.io/psykick2d/guides/platformer
