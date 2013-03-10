Psykick.Entity = function(id) {
    this.ID = id;
    this.Components = {};
    this.Parent = null;
};

Psykick.Entity.prototype.setParentLayer = function(layer) {
    if (layer instanceof Psykick.Layer) {
        this.Parent = layer;
    } else {
        throw "Invalid Argument: 'layer' must be an instance of Psykick.Layer";
    }
};

Psykick.Entity.prototype.addComponent = function(component) {
    if (component instanceof Psykick.Component) {
        this.Components[component.Name] = component;
    }
};

Psykick.Entity.prototype.removeComponent = function(componentName) {
    if (componentName instanceof Psykick.Component) {
        componentName = componentName.Name;
    }

    delete this.Components[componentName];
};