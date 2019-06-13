"use strict";

var _inkdrop = require("inkdrop");
var React = _interopRequireWildcard(require("react"));
const { markdownRenderer } = require('inkdrop')
var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

class HexDump extends React.Component {
  constructor() {
    super()
    this.hexdump = new HexDumper
  }

  componentDidMount() {
    this.updateHexDump()
  }

  componentDidUpdate() {
    this.updateHexDump()
  }

  render() {
    return React.createElement("div", {
      classname: "markdown-hexdump",
      ref: el => this.div = el
    });
  }

  updateHexDump() {
    try {
      const sourceHex = this.props.children[0];
      this.hexdump.generate(this.div, sourceHex)

    } catch (err) {
      console.log("HexDump Error: "+err.message);
    }
  }
}

class HexDumper {
  constructor() {
    this.lineWidth = 16
    this.nonPrintableChar = '.'
    this.showAddress = true
    this.debug = false
    this.metaRegex = new RegExp(/{(?<color>#[a-fA-F0-9]*)?\s?,?\s?(?<comment>".*?")?\s?:?\s?(.*?)}/)
  }

  generate(element, hex) {
    var data = hex.replace(new RegExp(/\s/gm), "")
    var index = 0
    var byteCount = 0
    var lineByteCount = 0
    var hexBuffer = ''
    var stringBuffer = ''
    var lineCount = 0
    element.innerHTML = ''
    
    while (index < data.length) {
      // print address
      if (this.showAddress && lineByteCount == 0)
        hexBuffer += ((this.lineWidth * lineCount).toString(16)+': ').padStart(8, '0')

      // detect metadata
      var metadata = data.substring(index).match(this.metaRegex)
      console.log("regex match: "+metadata)
      // construct info to be printed in hex and ascii form
      var hexC = data[index] + data[index+1]
      hexBuffer += '<span id="hex-char-'+byteCount+'">' + hexC + '</span> '
      stringBuffer += '<span id="printable-char-'+byteCount+'">'+String.fromCharCode(parseInt(hexC, 16))+'</span>'

      // byte accounting
      index += 2
      byteCount++
      lineByteCount++

      // output the line
      if ((byteCount % this.lineWidth == 0) || index >= data.length) {
        var line = hexBuffer.padEnd(hexBuffer.length + (this.lineWidth - lineByteCount)*3) + "| " +
                   this.replace_non_ascii(stringBuffer).padEnd(stringBuffer.length + (this.lineWidth - lineByteCount)) + " |"
        if (this.debug)
          console.log(line)

        // append line to document
        element.innerHTML += line + "\n"

        // line accounting
        hexBuffer = ''
        stringBuffer = ''
        lineByteCount = 0
        lineCount++
      }
    }
    if (this.debug)
      console.log("HTML: "+element.innerHTML)
  };

  replace_non_ascii(str) {
    if ((str===null) || (str===''))
      return false;
    else
      str = str.toString();
    
    return str.replace(/[^\x20-\x7E]/g, this.nonPrintableChar);
  };
}

_defineProperty(HexDump, "propTypes", {
  children: _propTypes.default.node
});

module.exports = {
  activate() {
    markdownRenderer.remarkCodeComponents['hexdump'] = HexDump;
  },
  
  deactivate() {
    markdownRenderer.remarkCodeComponents.hexdump = null;
  }
}