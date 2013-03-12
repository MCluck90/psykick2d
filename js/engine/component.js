// Create the namespace which other base Component will attach to
Psykick.Components = {};

/**
 * The most basic component which all components should inherit from.
 * Each new Component should be given a unique name
 *
 * @constructor
 */
Psykick.Component = function() {
    this.Name = "Component";
};