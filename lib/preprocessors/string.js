// Generated by CoffeeScript 1.6.2
(function() {
  var Preprocessor, Scanner, util;

  Scanner = require("../scanner");

  util = require("../util");

  module.exports = Preprocessor = (function() {
    Preprocessor.preprocess = function(source) {
      var preprocessor;

      preprocessor = new Preprocessor(source);
      return preprocessor.preprocess();
    };

    function Preprocessor(source) {
      this.source = source;
      this.output = "";
      this.level = 0;
      this.index = 0;
      this.captures = [];
      this.record("" + (this.outVar()) + " = []");
    }

    Preprocessor.prototype.preprocess = function() {
      var token, _i, _len, _ref, _ref1;

      _ref = Scanner.scanString(this.source);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        token = _ref[_i];
        if ((_ref1 = this[token.type]) != null) {
          _ref1.call(this, token);
        }
      }
      this.record("return " + (this.outVar()) + ".join('')");
      return this.output;
    };

    Preprocessor.prototype.outVar = function(index) {
      if (index == null) {
        index = this.index;
      }
      return "__out" + index;
    };

    Preprocessor.prototype.record = function(line) {
      this.output += util.repeat("  ", this.level);
      return this.output += line + "\n";
    };

    Preprocessor.prototype.append = function(string) {
      return this.record("" + (this.outVar()) + ".push " + string);
    };

    Preprocessor.prototype.indent = function() {
      return this.level++;
    };

    Preprocessor.prototype.dedent = function() {
      this.level--;
      if (this.level < 0) {
        return this.fail('Unexpected dedent');
      }
    };

    Preprocessor.prototype.traverseUp = function() {
      this.index--;
      if (this.index < 0) {
        return this.fail('Unexpected traverse');
      }
    };

    Preprocessor.prototype.traverseDown = function() {
      return this.index++;
    };

    Preprocessor.prototype.fail = function(msg) {
      throw new Error(msg);
    };

    Preprocessor.prototype.eco = function(token) {
      if (token.dedent) {
        this.dedent();
      }
      this["eco_" + token.tag].call(this, token);
      if (token.indent || token.directive) {
        this.indent();
      }
      if (token.directive) {
        this.captures.unshift(this.level);
        this.traverseDown();
        return this.record("" + (this.outVar()) + " = []");
      }
    };

    Preprocessor.prototype.eco_string = function(token) {
      var string;

      string = token.content;
      return this.append(util.inspectString(string));
    };

    Preprocessor.prototype.eco_end = function(token) {
      if (this.captures[0] === this.level) {
        this.captures.shift();
        this.record("" + (this.outVar()) + ".join('')");
        this.traverseUp();
      }
      return this.dedent();
    };

    Preprocessor.prototype.eco_leftLiteral = function(token) {
      return this.append(util.inspectString('<%'));
    };

    Preprocessor.prototype.eco_rightLiteral = function(token) {
      return this.append(util.inspectString('%>'));
    };

    Preprocessor.prototype.eco_expression = function(token) {
      return this.record(token.content + token.directive);
    };

    Preprocessor.prototype.eco_escapedContent = function(token) {
      if (token.directive) {
        return this.append("" + token.content + " __escape " + token.directive);
      } else {
        return this.append("__escape " + token.content);
      }
    };

    Preprocessor.prototype.eco_content = function(token) {
      return this.append(token.content + token.directive);
    };

    return Preprocessor;

  })();

}).call(this);