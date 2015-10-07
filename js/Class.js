// Dependency of this library:
// ECMAScript 5: use the es5-shim in older browsers
// https://github.com/rauschma/class-js

var Class = {

	//---------- Inheritance API
	
	/**
	 */
	extend: function (properties, stat) {

		var superProto = this.prototype || Class;
		var proto = Object.create(superProto);
		// This method will be attached to many constructor functions
		// => must refer to "Class" via its global name (and not via "this")
		var hasConstructor = Class.copyOwnTo(properties, proto);

		// Set up the constructor
		var constr = properties.constructor;
		constr.prototype = proto;
		constr.super = superProto;
		constr.extend = this.extend; // inherit class method

		// Adding "static" methods and properties
		for (var name in stat) {
			constr[name] = stat[name];
		}

		return constr;
	},

	/**
	 */
	copyOwnTo: function(source, target) {
		var constructorFound = false;
		Object.getOwnPropertyNames(source).forEach(function(propName) {
			if("constructor" === propName) {
				constructorFound = true;
			}
			Object.defineProperty(target, propName, Object.getOwnPropertyDescriptor(source, propName));
		});

		if(! constructorFound) {
		   throw new Error("You must define a method 'constructor'");
		}
	}
};
