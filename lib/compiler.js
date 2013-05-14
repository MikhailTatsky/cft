// Generated by CoffeeScript 1.6.2
(function() {
  var CoffeeScript, compile, indent, preprocess;

  CoffeeScript = require("coffee-script");

  preprocess = require("./preprocessor").preprocess;

  indent = require("./util").indent;

  exports.compile = compile = function(source) {
    var script;

    script = CoffeeScript.compile(preprocess(source), {
      bare: true
    });
    return "function(__obj) {\n  var __sanitize = function(value) {\n    if (value && value.cftSafe) {\n      return value;\n    } else if (value != null) {\n      return __escape(value);\n    } else {\n      return \"\";\n    }\n  }, __escape = function(value) {\n    return (\"\" + value).replace(/&/g, \"&amp;\")\n                       .replace(/</g, \"&lt;\")\n                       .replace(/>/g, \"&gt;\")\n                       .replace(/\x22/g, \"&quot;\");\n  }, __createFragment = function(value, element) {\n    element || (element = document.createElement('div'));\n    var range = document.createRange();\n    range.setStart(element, 0);\n    range.collapse(false);\n    return range.createContextualFragment(value);\n  };\n\n  return (function() {\n  " + (indent(script, 4)) + "\n  }).call(__obj);\n}";
  };

}).call(this);