v0.7.0
======
* Added add/remove/safeRemove to `Layer`
* Added platformer example
* Added option to pick which component is used in `CollisionGrid`

v0.6.2
======
* Added option to pick which component is used in `QuadTree`
* Added option to safely remove entities from systems

v0.6.1
======
* Platformer system reports collisions
* Added option to load frames using `AssetManager` in `TilingSprite`
* Updated `Camera` to work with new organization

v0.6.0
======
* Fixed boundary bug in `CollisionGrid`
* Changed `QuadTree` to use `Rectangle` instead of `RectPhysicsBody`
* Changed `w` and `h` in rectangles to `width` and `height`
* Added sprite sheet preloading
* Added option to load frames or textures in `Sprite`
* Added ability to animate sprite sheets

v0.5.1
======
* Fixed reference to deprecated `Helpers` namespace in `Platformer`
* Added support for text

v0.5.0
======
* Added listeners for resize and blur events
* Added minimum FPS option for delta time
* Removed `Helpers` namespace

v0.4.5
======
* Fixed keyboard listeners to listen on `document` instead of the container
* Fixed bug causing shapes to be drawn away from their origin

v0.4.4
======
* Added ability to exclude modules from build
* Fixed reference to `Helper.defaults` in `Input`

v0.4.3
======
* Added `AssetManager`
* Added audio testing and loading
* Added image loading

v0.4.2
======
* Added `Circle` component
* Added system for drawing shapes
* Moved `Helpers` to `DataStructures` (deprecated)

v0.4.1
======
* Added mouse support
* Moved keyboard input to `Input` instead of `Helper` (deprecated)
* Added gamepad support

v0.4.0
======
* Moved to use [Pixi.js](http://www.pixijs.com/)
* Fixed `Layer` visibility
* Removed `Component` - components can be any object