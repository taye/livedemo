const $ = require('queryselectorall');

module.exports = function liveDemo (options) {
  options.HTMLSelector = options.HTMLSelector || 'code.language-xml,code.language-html,code.language-markup,code.xml,code.html';
  options.CSSSelector  = options.CSSSelector  || 'code.language-css,code.css';
  options.JSSelector   = options.JSSelector   || 'code.language-javascript,code.javascript';

  options.HTMLFlag = options.HTMLFlag || /^<!--.*enable javascript.*-->/;
  options.CSSFlag  = options.CSSFlag  || /^\/\*.*enable javascript.*\*\//;
  options.JSFlag   = options.JSFlag   || /^\/\/.*enable javascript.*|^\/\*.*enable javascript.*\*\//;

  options.codeElementDepth = typeof options.codeElementDepth === 'number'? options.codeElementDepth: 2;
  options.insertPosition   = options.insertPosition || 'afterend';

  const xmlCodeBlocks = $(options.HTMLSelector),
    cssCodeBlocks = $(options.CSSSelector),
    jsCodeBlocks  = $(options.JSSelector);

  // get <code> elements with comments that match the XML/HTML flag
  xmlCodeBlocks = xmlCodeBlocks.filter(element => {
    return options.HTMLFlag.test(element.firstChild.textContent);
  });

  xmlCodeBlocks.forEach(element => {
    // remove flag comment
    element.removeChild(element.firstChild);

    // remove leading blank line
    if (element.childNodes[0].nodeValue === '\n') {
      element.removeChild(element.childNodes[0]);
    }

    // insert code as HTML in a div.livedemo element
    // by default after the <code> element's parent's parent
    // e.g. code -> pre -> div.highlight *div.live-demo*
    getInsertElement(element).insertAdjacentHTML(
      options.insertPosition,
      `<div class="live-demo">${element.textContent}</div>`);
  });


  // get <code> elements with comments that match the CSS flag
  cssCodeBlocks = cssCodeBlocks.filter(element => {
    return options.CSSFlag.test(element.firstChild.textContent);
  });

  cssCodeBlocks.forEach(element => {
    // remove flag comment
    element.removeChild(element.firstChild);

    // remove leading blank line
    if (element.childNodes[0].nodeValue === '\n') {
      element.removeChild(element.childNodes[0]);
    }

    // insert code as a <style> in <head>
    document.head.insertAdjacentHTML(
      'beforeend',
      `<style>${element.textContent}</style>`);
  });


  // get <code> elements with comments that match the javascript flag
  jsCodeBlocks = jsCodeBlocks.filter(element => {
    return options.JSFlag.test(element.firstChild.textContent);
  });

  jsCodeBlocks.forEach(element => {
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
      console.log({ element, error });
    }
  });
}

// returns the element relative to which the HTML will be inserted
// climbs up DOM tree from codeElement `codeElementDepth` times
function getInsertElement (codeElement) {
  for (const i = 0; i < options.codeElementDepth; i++) {
    codeElement = codeElement.parentNode;
  }
  return codeElement;
}
