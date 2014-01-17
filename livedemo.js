/**
 * livedemo 0.0.1
 *
 * Copyright (c) 2014 Taye Adeyemi <dev@taye.me>
 * Open source under the MIT License.
 * http://taye.mit-license.org
 */
document.addEventListener('DOMContentLoaded', this.liveDemo = function (event) {
    var settings = window.liveDemoSettings;

        settings.HTMLSelector = settings.HTMLSelector || 'code.language-xml,code.language-html,code.language-markup,code.xml,code.html';
        settings.CSSSelector  = settings.CSSSelector  || 'code.language-css,code.css';
        settings.JSSelector   = settings.JSSelector   || 'code.language-javascript,code.javascript';

        settings.HTMLFlag = settings.HTMLFlag || /^<!--.*enable javascript.*-->/;
        settings.CSSFlag  = settings.CSSFlag  || /^\/\*.*enable javascript.*\*\//;
        settings.JSFlag   = settings.JSFlag   || /^\/\/.*enable javascript.*|^\/\*.*enable javascript.*\*\//;

        settings.codeElementDepth = typeof settings.codeElementDepth === 'number'? settings.codeElementDepth: 2;
        settings.insertPosition   = settings.insertPosition || 'afterend';

    var xmlCodeBlocks = document.querySelectorAll(settings.HTMLSelector),
        cssCodeBlocks = document.querySelectorAll(settings.CSSSelector),
        jsCodeBlocks  = document.querySelectorAll(settings.JSSelector);

    // returns the element relative to which the HTML will be inserted
    // climbs up DOM tree from codeElement `codeElementDepth` times
    function getInsertElement (codeElement) {
        for (var i = 0; i < settings.codeElementDepth; i++) {
            codeElement = codeElement.parentNode;
        }
        return codeElement;
    }


    // get <code> elements with comments that match the XML/HTML flag
    xmlCodeBlocks = Array.prototype.filter.call(xmlCodeBlocks, function (element) {
        return settings.HTMLFlag.test(element.firstChild.textContent);
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
        getInsertElement(element).insertAdjacentHTML(
            settings.insertPosition,
            '<div class="live-demo">' + element.textContent + '</div>');
    });


    // get <code> elements with comments that match the CSS flag
    cssCodeBlocks = Array.prototype.filter.call(cssCodeBlocks, function (element) {
        return settings.CSSFlag.test(element.firstChild.textContent);
    });

    cssCodeBlocks.forEach(function (element) {
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
    jsCodeBlocks = Array.prototype.filter.call(jsCodeBlocks, function (element) {
        return settings.JSFlag.test(element.firstChild.textContent);
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
});

// create the settings object for possible convenience
this.liveDemoSettings = this.liveDemoSettings || {};
