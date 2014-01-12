livedemo
========

Turn highlighted HTML, CSS and JavaScript `<code>` snippets into live demos.

Initially written for [this blog post][svg-use-post].

Use it
------
1. Add a comment that contains the text `enable javascript` as the first,
   unindented line in code that you want to demo.

2. Highlight code in your HTML page with something like
   [*redcarpet*][redcarpet] or [*Pygments*][pygments] (both available in
[*Jekyll*][jekyll]) or [*Prism*][prism].

3. Download and include the script somewhere in your HTML page: `<script
   src="livedemo.min.js"></script>` (after Prisim if you're using it).

---

HTML
----
Code elements matching the `HTMLSelector` and whose first `textNode`'s
`textContent` match the `HTMLFlag` RegExp will be demo'd.

```xml
<!-- enable javascript to view a demo -->
<svg id="demo-svg" viewBox="0 -50 400 100">
    <polygon points="80 -40, 120 40, 40 40" fill="#29e" />
    <rect height="80" width="80" y="-40" x="160" fill="#4e4" />
    <circle cx="320" cy="0" r="40" fill="#f40" />
</svg>
```

`<!-- enable javascript to view a demo -->` will be noticed by *livedemo*. The
comment is removed and the remaining content is inserted into the document
beside the code element's parent's parent by default.

If for example the HTML on the page is

```html
<div>
    <pre>
        <code class="language-html">
            ... the generated highlighted code ...
        </code>
    <pre>
</div>
```

then the textContent of the `<code>` will be inserted after the `</div>` within
a new `div.live-demo` element.

This makes it convenient for *Jekyll* sites using *redcarpet* or *Pygments*.


CSS
---
The text of code elements that match the `CSSSelector` and have `firstChild`ren
that match the `CSSFlag` RegExp will be added to `document.head` in `<script>`
tags.

```css
/* enable javascript to vew demo */
#demo-svg {
    width: 100%;
    height: 25%;
}
```


JavaScript
----------
Elements that match the `JSSelector` and whose `firstChild`'s `textContent`
matches the `JSFlag` RegExp will have their text executed.

```javascript
// please enable javascript
var demoSvg = document.getElementById('demo-svg');

demoSvg.addEventListener('click', function (event) {
    alert('click on <' + event.target.nodeName + '>');
});
```

```javascript
/* enable javascript */
var colors = ['white', 'black'];

setInterval(function () {
    demoSvg.style.backgroundColor = colors[0];

    colors = [colors[1], colors[0]];
}, 3000);
```

Both scripts above will be executed and the flag comments will be removed form
the `<code>` blocks.

JavaScript code is executed after HTML and CSS is inserted into the document.
If the execution of a code block throws an error, the element and error are
logged to the console.

Configuration
---------------
The properties of the object `window.liveDemoSettings` are used to change
settings for *livedemo* if they are set before the `DOMContentLoaded` event
occurs and calls `window.liveDemo`. The properties are:

 - `HTMLSelector`, `JSSelector`, `CSSSelector`: Elements matching these CSS
   selectors will be checked for HTMLFlag, CSSFlag and JSFlag respectively. The
default values are:
   - HTML:
     `'code.language-xml,code.language-html,code.language-markup,code.xml,code.html'`
   - CSS : `'code.language-css,code.css'`
   - JS  :`'code.language-javascript,code.javascript'`

 - `HTMLFlag`, `CSSFlag`, `JSFlag`: If the `textContent`s of the
   `firstChild`ren of the elements matching the respective selectors passes a
test for this RegExp, they are processed as HTML, CSS or JavaScript. The
default values are:
   - HTML: `/^<!--.*enable javascript.*-->/`
   - CSS : `/^\/\*.*enable javascript.*\*\//`
   - JS  : `/^\/\/.*enable javascript.*|^\/\*.*enable javascript.*\*\//`

 - `codeElementDepth`: How much lower in the DOM tree the `<code>` elements are
   than the level you want demo HTML `div.live-demo`s to be inserted. Default
is `2` as explained in the "HTML" section of this document.

 - `insertPosition`: The position to insert `div.live-demo`s relative to the
   element that is `codeElementDepth` levels up from the `<code>` element. The
default value is `'afterend'`. See [Element.insertAdjacentHTML][mdn-insert-adj]
for other values.

License
-------
[MIT][mit]

[redcarpet]: https://github.com/vmg/redcarpet "The safe Markdown parser, reloaded"
[pygments]: http://pygments.org "Python syntax highlighter"
[jekyll]: http://jekyllrb.com "Simple, blog-aware, static sites"
[prism]: http://prismjs.com "A lightweight, extensible syntax highlighter"
[svg-use-post]: http://taye.me/blog/svg/a-guide-to-svg-use-elements/ "A guide to SVG <use> elements"
[mdn-insert-adj]: https://developer.mozilla.org/en-US/docs/Web/API/Element.insertAdjacentHTML#Visualization_of_position_names "Visualization of position names"
[mit]: http://taye.mit-license.org/ "copy of the MIT license"
