var world = new Psykick.World(document.getElementById('canvas'));

var component = new Psykick.Component();
component.Name = "Box";
component.X = 0;
component.Y = 100;
component.Width = 240;
component.Height = 480;
var entity = world.createEntity();
entity.addComponent(component);
var layer1 = world.createLayer();
layer1.addEntity(entity);
world.pushLayer(layer1);

console.log(world.getLayers());