var $ = require('queryselectorall');

var defaults = {
  HTMLSelector: 'code.language-xml,code.language-html,code.language-markup,code.xml,code.html',
  CSSSelector : 'code.language-css,code.css',
  JSSelector  : 'code.language-javascript,code.javascript',

  HTMLFlag: /^<!--.*enable javascript.*-->/,
  CSSFlag : /^\/\*.*enable javascript.*\*\//,
  JSFlag  : /^\/\/.*enable javascript.*|^\/\*.*enable javascript.*\*\//,

  codeElementDepth: 2,
  insertPosition  : 'afterend',
};

module.exports = function liveDemo (options) {
  options.HTMLSelector = options.HTMLSelector || defaults.HTMLSelector;
  options.CSSSelector  = options.CSSSelector  || defaults.CSSSelector;
  options.JSSelector   = options.JSSelector   || defaults.JSSelector;

  options.HTMLFlag = options.HTMLFlag || defaults.HTMLFlag;
  options.CSSFlag  = options.CSSFlag  || defaults.CSSFlag;
  options.JSFlag   = options.JSFlag   || defaults.JSFlag;

  options.codeElementDepth = typeof options.codeElementDepth === 'number'? options.codeElementDepth: defaults.codeElementDepth;
  options.insertPosition   = options.insertPosition || defaults.insertPosition;

  var xmlCodeBlocks = $(options.HTMLSelector),
    cssCodeBlocks = $(options.CSSSelector),
    jsCodeBlocks  = $(options.JSSelector);

  // get <code> elements with comments that match the XML/HTML flag
  xmlCodeBlocks = xmlCodeBlocks.filter(function(element) {
    return options.HTMLFlag.test(element.firstChild.textContent);
  });

  xmlCodeBlocks.forEach(function (element) {
    // remove flag comment
    element.removeChild(element.firstChild);

    // remove leading blank line
    if (element.childNodes[0].nodeValue === '\n') {
      element.removeChild(element.childNodes[0]);
    }

    // insert code as HTML in a div.livedemo element
    // by default after the <code> element's parent's parent
    // e.g. code -> pre -> div.highlight *div.live-demo*
    getInsertElement(element, options.codeElementDepth).insertAdjacentHTML(
      options.insertPosition,
      '<div class="live-demo">' + element.textContent + '</div>');
  });


  // get <code> elements with comments that match the CSS flag
  cssCodeBlocks = cssCodeBlocks.filter(function(element) {
    return options.CSSFlag.test(element.firstChild.textContent);
  });

  cssCodeBlocks.forEach(function(element) {
    // remove flag comment
    element.removeChild(element.firstChild);

    // remove leading blank line
    if (element.childNodes[0].nodeValue === '\n') {
      element.removeChild(element.childNodes[0]);
    }

    // insert code as a <style> in <head>
    document.head.insertAdjacentHTML(
      'beforeend',
      '<style>' + element.textContent + '</style>');
  });


  // get <code> elements with comments that match the javascript flag
  jsCodeBlocks = jsCodeBlocks.filter(function(element) {
    return options.JSFlag.test(element.firstChild.textContent);
  });

  jsCodeBlocks.forEach(function (element) {
    // remove flag comment
    element.removeChild(element.firstChild);

    // remove leading blank line
    if (element.childNodes[0].nodeValue === '\n') {
      element.removeChild(element.childNodes[0]);
    }

    // Try to run code
    try {
      new Function(element.textContent)();
    } catch (error) {
      console.error('livedemo failed to execute a javascript code block');
      console.log({ element: element, error: error });
    }
  });
};

module.exports.options = defaults;

// returns the element relative to which the HTML will be inserted
// climbs up DOM tree from codeElement `codeElementDepth` times
function getInsertElement (codeElement, codeElementDepth) {
  for (var i = 0; i < codeElementDepth; i++) {
    codeElement = codeElement.parentNode;
  }
  return codeElement;
}
