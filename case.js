function concat(a, b) {
    return a.concat(b);
}

module.exports = {
    types: {
        dash: require("case-dash"),
        snake: require("case-snake"),
        camel: require("case-camel")
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

        if(val.indexOf("-") !== -1) {
            ret.push("dash");
        }
        if(val.indexOf("_") !== -1) {
            ret.push("snake");
        }
        if(/[A-Z][a-z]/.test(val)) {
            ret.push("camel");
        }
        return ret;
    },
    parseAs: function(val, type) {
        if(!(type in this.types)) {
            throw new Error("Unknown case: " + type);
        }

        return this.types[type].parse(val);
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
        if(!(type in this.types)) {
            throw new Error("Unknown case: " + type);
        }

        return this.types[type].stringify(val);
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
