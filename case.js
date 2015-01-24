var types = {
        dash: require("case-dash"),
        snake: require("case-snake"),
        camel: require("case-camel")
    },
    methods = ["parse", "stringify", "is"];

function concat(a, b) {
    return a.concat(b);
}

function isMethod(key) {
    return (key in this) && typeof(this[key]) === "function";
}

function isType(type) {
    return types[type].is(this);
}

module.exports = {
    addCase: function(name, obj) {
        name = String(name);

        if(typeof(obj) !== "object") {
            throw new Error("Can only add new cases of type object");
        }

        if(!methods.every(isMethod, obj)) {
            throw new Error("Added cases must have the methods " + methods);
        }

        types[name] = obj;
    },
    identify: function(val) {
        var types = this.identifyAll(val);

        if(types.length) {
            return types[0];
        }
        return undefined;
    },
    identifyAll: function(val) {
        var ret = [];

        if(typeof(val) === "undefined" || val === null) {
            return ret;
        }

        val = String(val);

        return Object.keys(types).filter(isType, val);
    },
    parseAs: function(val, type) {
        if(!(type in types)) {
            throw new Error("Unknown case: " + type);
        }

        return types[type].parse(val);
    },
    parse: function(val) {
        var type;

        if(typeof(val) === "undefined" || val === null) {
            return [];
        }

        val = String(val);
        type = this.identify(val);
        if(typeof(type) === "undefined") {
            return val;
        }
        return this.parseAs(val, type);
    },
    parseAll: function(val) {
        var ret = [],
            self = this;

        if(typeof(val) === "undefined" || val === null) {
            return [];
        }

        ret.push(String(val));

        this.identifyAll(val).forEach(function(type) {
            ret = ret.map(function(str) {
                return self.parseAs(str, type);
            }).reduce(concat, []);
        });

        return ret;
    },
    stringify: function(val, type) {
        if(!(type in types)) {
            throw new Error("Unknown case: " + type);
        }

        return types[type].stringify(val);
    },
    convert: function(val, fromType, toType) {
        var parsed;

        if(arguments.length < 3) {
            toType = fromType;
            fromType = undefined;
        }

        if(typeof(fromType) === "undefined") {
            parsed = this.parseAll(val);
        } else {
            parsed = this.parseAs(val, fromType);
        }

        return this.stringify(parsed, toType);
    }
};
