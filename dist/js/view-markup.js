/*!
    * View markup v1.2.0
    * Plugin that makes it easy for developers to view and copy the html needed for a component.
    *
    * Copyright 2021-2022 Marshall Crosby
    * https://marshallcrosby.com
*/

// Cache view markup elements immediately.
const viewMarkupEl = document.querySelectorAll('[data-view-markup]');

(function () {
    "use strict"

    // -----------------------------------------------------------------------------
    // Setup outer div and modal btn (with options)
    // -----------------------------------------------------------------------------
   
    let srcready = new Event('src-is-ready');
    let pageSrc = null;
    let request = makeHttpObject();
    
    request.open('GET', '/', true);
    request.send(null);
    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            pageSrc = request.responseText;
            document.dispatchEvent(srcready);
        }
    }

    // Get page src
    function makeHttpObject() {
        if ('XMLHttpRequest' in window) {
            return new XMLHttpRequest();
        } else if ('ActiveXObject' in window) {
            return new ActiveXObject('Msxml2.XMLHTTP');
        }
    }

    document.addEventListener('src-is-ready', function () {
        if (viewMarkupEl.length > 0) {
            
            let elHtmlInitial = [];
            let elHtmlStripped = [];
            let elAmount = 0;
            let options;

            // Declare base modal element right away to add some data attributes to
            let modalEl = document.createElement('div');

            let markupContentHtmlString = `<div class="view-markup__content"><div class="view-markup__header"><div class="view-markup__nav"><button class="view-markup__prev-btn view-markup--fancy-hover" aria-label="Previous" type="button"><svg aria-hidden="true" x="0px" y="0px" width="8.5px" height="14.1px" viewBox="0 0 8.5 14.1" style="enable-background:new 0 0 8.5 14.1;"><polygon class="sty0" points="0,7.1 7.1,14.1 8.5,12.7 2.8,7.1 8.5,1.4 7.1,0 0,7.1 0,7.1 "/></svg></button> <button class="view-markup__next-btn view-markup--fancy-hover" aria-label="Next" type="button"><svg aria-hidden="true" x="0px" y="0px" width="8.5px" height="14.1px" viewBox="0 0 8.5 14.1" style="enable-background:new 0 0 8.5 14.1;"><polygon class="sty0" points="8.5,7.1 1.4,0 0,1.4 5.7,7.1 0,12.7 1.4,14.1 8.5,7.1 8.5,7.1 "/></svg></button></div><div class="view-markup__title" id="viewMarkupModalTitle"></div><button class="view-markup__close-btn view-markup--fancy-hover" aria-label="Close" type="button"><svg aria-hidden="true" x="0px" y="0px" width="15.6px" height="15.6px" viewBox="0 0 15.6 15.6" style="enable-background:new 0 0 15.6 15.6;"><g><rect x="6.8" y="-2.2" transform="matrix(0.7071 0.7071 -0.7071 0.7071 7.7782 -3.2218)" class="sty0" width="2" height="20"/><rect x="6.8" y="-2.2" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -3.2218 7.7782)" class="sty0" width="2" height="20"/></g></svg></button></div><div class="view-markup__body"><div class="view-markup__controls"><button class="view-markup__copy-btn view-markup--fancy-hover" type="button">Copy</button><div class="view-markup__settings"><button class="view-markup__settings-btn view-markup--fancy-hover" id="viewMarkupModalSettingsBtn" aria-label="Settings" type="button" aria-expanded="false"><svg x="0px" y="0px" width="3px" height="15px" viewBox="0 0 3 15" style="enable-background:new 0 0 3 15;"><g><circle class="sty0" cx="1.5" cy="1.5" r="1.5"/><circle class="sty0" cx="1.5" cy="7.5" r="1.5"/><circle class="sty0" cx="1.5" cy="13.5" r="1.5"/></g></svg></button><div class="view-markup__settings-dropdown" aria-labelledby="viewMarkupModalSettingsBtn"><form class="view-markup__tab-set view-markup__settings-item" aria-labelledby="viewMarkupSettingsHeadingIndent"><span id="viewMarkupSettingsHeadingIndent" aria-hidden="true">Indent:</span><fieldset class="view-markup__switch"><legend class="view-markup__switch-label">Indent:</legend><input class="view-markup__indent-2" type="radio" id="viewMarkupModalIndent2" name="tabspaces"> <label for="viewMarkupModalIndent2">2</label> <input class="view-markup__indent-4" type="radio" id="viewMarkupModalIndent4" name="tabspaces"> <label for="viewMarkupModalIndent4">4</label><div class="view-markup__switch-face"></div></fieldset></form><form class="view-markup__size-set view-markup__settings-item" aria-labelledby="viewMarkupSettingsHeadingModalSize"><span id="viewMarkupSettingsHeadingModalSize" aria-hidden="true">Modal size:</span><fieldset class="view-markup__switch"><legend class="view-markup__switch-label">Modal size:</legend><input class="view-markup__size-medium" type="radio" id="viewMarkupModalSizeMedium" name="modalsize"> <label for="viewMarkupModalSizeMedium">md</label> <input class="view-markup__size-large" type="radio" id="viewMarkupModalSizeLarge" name="modalsize"> <label for="viewMarkupModalSizeLarge">lg</label><div class="view-markup__switch-face"></div></fieldset></form><form class="view-markup__theme-set view-markup__settings-item" aria-labelledby="viewMarkupSettingsHeadingTheme"><span id="viewMarkupSettingsHeadingTheme" aria-hidden="true">Theme:</span><fieldset class="view-markup__switch"><legend class="view-markup__switch-label">Theme:</legend><input class="view-markup__theme-dark" type="radio" id="viewMarkupModalThemeDark" name="themecolor"> <label for="viewMarkupModalThemeDark"><span class="view-markup-sr-only">Dark</span> <svg class="view-markup__switch-moon" x="0px" y="0px" width="7.6px" height="9.5px" viewBox="0 0 7.6 9.5" style="enable-background:new 0 0 7.6 9.5;"><path class="sty0" d="M3.3,5.5C2.5,3.5,3.2,1.3,4.8,0C4.2,0,3.6,0.1,3,0.3C0.6,1.3-0.6,4,0.3,6.5c1,2.4,3.7,3.6,6.1,2.7 C6.9,9,7.3,8.7,7.6,8.5C5.8,8.4,4,7.3,3.3,5.5z"/></svg></label> <input class="view-markup__theme-light" type="radio" id="viewMarkupModalThemeLight" name="themecolor"> <label for="viewMarkupModalThemeLight"><span class="view-markup-sr-only">Light</span> <svg class="view-markup__switch-sun" x="0px" y="0px" width="14px" height="14px" viewBox="0 0 14 14" style="enable-background:new 0 0 14 14;"><g><path class="sty0" d="M7.5,2.5V0h-1v2.5c0.2,0,0.3-0.1,0.5-0.1S7.3,2.5,7.5,2.5z"/><path class="sty0" d="M6.5,11.4V14h1v-2.5c-0.2,0-0.3,0.1-0.5,0.1S6.6,11.4,6.5,11.4z"/><path class="sty0" d="M10.5,4.2l1.8-1.8l-0.7-0.7L9.8,3.5C10,3.7,10.3,3.9,10.5,4.2z"/><path class="sty0" d="M3.5,9.8l-1.8,1.8l0.7,0.7l1.8-1.8C3.9,10.3,3.7,10,3.5,9.8z"/><path class="sty0" d="M11.4,7.5H14v-1h-2.5c0,0.2,0.1,0.3,0.1,0.5S11.4,7.3,11.4,7.5z"/><path class="sty0" d="M2.5,6.5H0v1h2.5c0-0.2-0.1-0.3-0.1-0.5S2.5,6.6,2.5,6.5z"/><path class="sty0" d="M4.2,3.5L2.4,1.7L1.7,2.4l1.8,1.8C3.7,3.9,3.9,3.7,4.2,3.5z"/><path class="sty0" d="M9.8,10.5l1.8,1.8l0.7-0.7l-1.8-1.8C10.3,10,10,10.3,9.8,10.5z"/><circle class="sty0" cx="7" cy="7" r="3.5"/></g></svg></label><div class="view-markup__switch-face"></div></fieldset></form><div class="view-markup__settings-item"><label class="view-markup__settings-label" for="viewMarkupSettingsFontSize">Font size (px):</label> <input class="view-markup__font-size" id="viewMarkupSettingsFontSize" type="number"></div></div></div></div><div class="view-markup__main" id="viewMarkupModalHtml"><div class="view-markup__tabs" role="tablist"><button class="view-markup__tabs-button view-markup__tabs-button--html view-markup--fancy-hover" id="viewMarkupModalHtmlTab" type="button" role="tab" aria-selected="true">HTML</button> <button class="view-markup__tabs-button view-markup__tabs-button--js view-markup--fancy-hover" id="viewMarkupModalJsTab" type="button" role="tab" aria-selected="false">JS</button><div class="view-markup__tabs-indicator" aria-hidden="true"></div></div><label class="view-markup-sr-only" for="viewMarkupModalHiddenTextArea" aria-hidden="true">Copied</label> <textarea class="view-markup__hidden-textarea" id="viewMarkupModalHiddenTextArea" aria-hidden="true"></textarea><pre class="view-markup__pre" id="viewMarkupModalPreTag">
                <code class="view-markup__code view-markup__code--html html" id="viewMarkupHtmlCodeTag"></code>
                <code class="view-markup__code view-markup__code--js html" id="viewMarkupJsCodeTag"></code>
            </pre></div></div></div>`;

            viewMarkupEl.forEach(function (item, index) {
                
                // Cache all viewable markup elements               
                elHtmlInitial[index] = (index === 0 && viewMarkupEl[0].tagName.toLowerCase() === 'html') ?
                    pageSrc.toString() :
                    viewMarkupEl[index].outerHTML.toString();

                // Remove the view markup specific data attributes
                if (!leaveAttr(viewMarkupEl[index])) {
                    elHtmlStripped[index] = elHtmlInitial[index].replace(/data-view-markup="[^\"]*"/g, '').replace(/data-view-markup/g, '');
                }

                // Remove class
                if (suppressClass(viewMarkupEl[index])) {
                    var sRegExInput = new RegExp(suppressClass(viewMarkupEl[index]), 'g');
                    elHtmlStripped[index] = elHtmlInitial[index].replace(sRegExInput, '');
                }
                
                // Create modal button
                let modalBtn = document.createElement('button');
                modalBtn.classList.add('view-markup__modal-btn');
                modalBtn.setAttribute('type', 'button');
                modalBtn.innerHTML = '<span class="view-markup__modal-btn-text">View markup</span>';
                    
                // if <html> or <body> do things a bit differently
                if (viewMarkupEl[index].nodeName.toLowerCase()  === 'body' || viewMarkupEl[index].nodeName.toLowerCase()  === 'html') {
                    let wrapperDivBody = document.createElement('div');
                    wrapperDivBody.classList.add('view-markup');
                    wrapperDivBody.classList.add('view-markup--body');
                    document.body.prepend(wrapperDivBody);
                    wrapperDivBody.appendChild(modalBtn);
                } else {
                    
                    // Wrap in div
                    let markupWrapperDiv = document.createElement('div');
                    markupWrapperDiv.classList.add('view-markup');
                    markupWrapperDiv.innerHTML = '<div class="view-markup__highlight"></div>';
                    wrapElement(viewMarkupEl[index], markupWrapperDiv);
                    markupWrapperDiv.prepend(modalBtn);
                }
                
                options = {
                    title: null,
                    btnX: null,
                    btnY: null,
                    btnZ: null,
                    btnPos: null,
                    btnAppendTo: null,
                    btnPrependTo: null,
                    btnColor: null,
                    scriptSelector: null,
                    backdropRgb: null,
                    renderInPage: null,
                    marginBottom: null,
                    marginTop: null,
                    modalNav: null
                };
                    
                // Apply some options to toggle if available
                let currentElement = viewMarkupEl[index];
                if (currentElement.getAttribute('data-view-markup') !== '') {
                    let semiColonSplit = viewMarkupEl[index].getAttribute('data-view-markup').split(';');
                    
                    // Assign option values if any
                    semiColonSplit.forEach(function (item, index) {
                        if (semiColonSplit[index].split('title:')[1] !== undefined) {
                            options.title = parseOption(semiColonSplit[index], 'title');
                        }

                        if (semiColonSplit[index].split('btn-x:')[1] !== undefined) {
                            options.btnX = parseOption(semiColonSplit[index], 'btn-x');
                        }
                        
                        if (semiColonSplit[index].split('btn-y:')[1] !== undefined) {
                            options.btnY = parseOption(semiColonSplit[index], 'btn-y');
                        }
                        
                        if (semiColonSplit[index].split('btn-z:')[1] !== undefined) {
                            options.btnZ = parseOption(semiColonSplit[index], 'btn-z');
                        }
                        
                        if (semiColonSplit[index].split('btn-pos:')[1] !== undefined) {
                            options.btnPos = parseOption(semiColonSplit[index], 'btn-pos');
                        }
                        
                        if (semiColonSplit[index].split('btn-append-to:')[1] !== undefined) {
                            options.btnAppendTo = parseOption(semiColonSplit[index], 'btn-append-to');
                        }
                        
                        if (semiColonSplit[index].split('btn-prepend-to:')[1] !== undefined) {
                            options.btnPrependTo = parseOption(semiColonSplit[index], 'btn-prepend-to');
                        }
                        
                        if (semiColonSplit[index].split('btn-color:')[1] !== undefined) {
                            options.btnColor = parseOption(semiColonSplit[index], 'btn-color');
                        }
                        
                        if (semiColonSplit[index].split('associated-script:')[1] !== undefined) {
                            options.scriptSelector = parseOption(semiColonSplit[index], 'associated-script');
                        }
                        
                        if (semiColonSplit[index].split('backdrop-rgb:')[1] !== undefined) {
                            options.backdropRgb = parseOption(semiColonSplit[index], 'backdrop-rgb');
                        }
                        
                        if (semiColonSplit[index].split('render-in-page:')[1] !== undefined) {
                            options.renderInPage = parseOption(semiColonSplit[index], 'render-in-page');
                            currentElement.setAttribute('data-view-markup-render-in-page', '');
                        }
                        
                        if (semiColonSplit[index].split('margin-bottom:')[1] !== undefined) {
                            options.marginBottom = parseOption(semiColonSplit[index], 'margin-bottom');
                        }
                        
                        if (semiColonSplit[index].split('margin-top:')[1] !== undefined) {
                            options.marginTop = parseOption(semiColonSplit[index], 'margin-top');
                        }
                        
                        if (semiColonSplit[index].split('modal-nav:')[1] !== undefined) {
                            options.modalNav = parseOption(semiColonSplit[index], 'modal-nav');
                        }
                    });          
                                        
                    // Setup title attribute to be used later
                    if (options.title) {
                        modalBtn.setAttribute('data-view-markup-title', options.title);
                    }

                    // Btn x postion set
                    // if (options.btnX && options.btnX === 'right') {
                    //     modalBtn.style.left = 'auto';
                    //     modalBtn.style.right = '0';
                    // } else if (options.btnX && options.btnX === 'center') {
                    //     modalBtn.style.left = 'calc(50% - ' + (modalBtn.offsetWidth / 2) + 'px)';
                    // } else if (options.btnX) {
                    //     modalBtn.style.left = options.btnX;
                    // }

                    // Btn x postion set
                    if (options.btnX) {
                        modalBtn.style.transform = 'translateX(' + options.btnX + ')';
                    }

                    // Btn y postion set
                    if (options.btnY) {
                        modalBtn.style.transform = 'translateY(' + options.btnY + ')';
                    }

                    // Btn both positions
                    if (options.btnX && options.btnY) {
                        modalBtn.style.transform = 'translateX(' + options.btnX + ') translateY(' + options.btnY + ')';
                    }

                    // Btn z-index
                    if (options.btnZ) {
                        modalBtn.style.zIndex = options.btnZ;
                    }

                    // Btn position
                    if (options.btnPos) {
                        modalBtn.style.position = options.btnPos;
                    }
                    
                    // TODO: Btn color
                    if (options.btnColor) {
                        modalBtn.style.backgroundColor = options.btnColor;
                    }

                    // Append to selector
                    if (options.btnAppendTo) {
                        elBtnParent = document.querySelector(options.btnAppendTo);
                        elBtnParent.appendChild(modalBtn);
                    }

                    // Prepend to selector
                    if (options.btnPrependTo) {
                        elBtnParent = document.querySelector(options.btnPrependTo);
                        elBtnParent.prepend(modalBtn);
                    }
                    
                    // Script selector
                    if (options.scriptSelector) {
                        modalBtn.setAttribute('data-view-markup-script-selector', options.scriptSelector);
                    }
                    
                    // Backdrop rgba
                    if (options.backdropRgb) {
                        modalBtn.setAttribute('data-view-markup-backdrop-rgb', options.backdropRgb);
                    }
                    
                    // In page rendering
                    if (options.renderInPage) {
                        modalBtn.setAttribute('data-view-markup-in-page', 'true');
                    }
                    
                    // Modal navigation
                    if (options.modalNav === 'true') {
                        modalBtn.setAttribute('data-view-markup-modal-nav', 'true');
                    }
                    
                    // Bottom margin for in page view
                    if (options.marginBottom) {
                        item.closest('.view-markup').style.marginBottom = options.marginBottom;
                    }
                    
                    // Top margin for in page view
                    if (options.marginTop) {
                        item.closest('.view-markup').style.marginTop = options.marginTop;
                    }
                }   
            });


            // Check for preserve-attribute option
            function leaveAttr(el) {
                let optionPreserveAttr = null;
                
                if (el.getAttribute('data-view-markup').split(';')) {
                    let semiColonSplit = el.getAttribute('data-view-markup').split(';');
                    
                    if (semiColonSplit[0].split('preserve-attribute:')[1] !== undefined) {
                        optionPreserveAttr = semiColonSplit[0].split('preserve-attribute:')[1].trim();
                    }
                            
                    if (optionPreserveAttr === 'true') {
                        return true;
                    } else {
                        return false;
                    }    
                }
            }
            
            function suppressClass(el) {
                let optionSuppressClass = null;
                
                if (el.getAttribute('data-view-markup').split(';')) {
                    let semiColonSplit = el.getAttribute('data-view-markup').split(';');
                    
                    if (semiColonSplit[0].split('suppress-class:')[1] !== undefined) {
                        optionSuppressClass = semiColonSplit[0].split('suppress-class:')[1].trim();
                        return optionSuppressClass;
                    } else {
                        return false;
                    }
                }
            }

            // Spit out option value
            function parseOption(splitOn, optionString) {
                return splitOn.split(optionString + ':')[1].trim();
            }





            // -----------------------------------------------------------------------------
            // Custom styles added via js
            // -----------------------------------------------------------------------------

            // Create style tag to dump styles into for the markup modal
            let textStyle = document.createElement('style');
            textStyle.setAttribute('id', 'viewMarkupStyle');

            // Import compressed styles as a string
            let textStyleString = `.view-markup-sr-only,.view-markup__content .view-markup__hidden-textarea,.view-markup__content .view-markup__switch [type=radio],.view-markup__content .view-markup__switch-label,.view-markup__modal-btn-text{position:absolute;overflow:hidden;clip:rect(0,0,0,0);width:1px;height:1px;margin:-1px;padding:0;white-space:nowrap;border:0}:root{--vm-color-primary:#1e2127;--vm-color-text:#e0e0e0;--vm-color-ui-controls:#343944;--vm-color-radio-background:#131519;--vm-color-switch-face:#3f4652;--vm-color-html-primary:#e06c75;--vm-color-js-primary:#e6c07b;--vm-color-border-common:rgba(0, 0, 0, 0.23);--vm-color-moon:lightyellow;--vm-color-sun:gold;--vm-color-block-highlight:#ff0000;--vm-height-modal-header:50px;--vm-spacing-outer-modal:15px;--vm-spacing-common:18px;--vm-size-touch-common:30px;--vm-ff-primary:Helvetica Neue,Helvetica,Arial,sans-serif;--vm-ff-code:Menlo,Consolas,DejaVu Sans Mono,monospace;--vm-ease-common:cubic-bezier(0.19, 1, 0.22, 1);--vm-modal-z:1000000000000;--vm-border-radius-common:12px}:root.js-view-markup-theme-light{--vm-color-primary:#fcfcfc;--vm-color-text:#333;--vm-color-ui-controls:#ededed;--vm-color-radio-background:#e8e8e8;--vm-color-switch-face:#fcfcfc;--vm-color-html-primary:#e45649;--vm-color-js-primary:#deac50;--vm-color-border-common:rgba(0, 0, 0, 0.05);--vm-color-moon:#333;--vm-color-sun:#333}.view-markup-sr-only{color:#000;background-color:#fff}.js-view-markup-modal-showing{overflow:hidden;height:100vh;scroll-behavior:smooth}.js-view-markup-modal-showing .view-markup__modal-btn:focus{z-index:var(--vm-modal-z)!important;-webkit-animation:modal-btn-bounce .3s .3s ease;animation:modal-btn-bounce .3s .3s ease}@-webkit-keyframes modal-btn-bounce{50%{margin-top:-5px}}@keyframes modal-btn-bounce{50%{margin-top:-5px}}.view-markup{position:relative}.view-markup-dynamic-nav{position:static;height:1px;width:1px;overflow:visible}button.view-markup__modal-btn{position:absolute;z-index:100;top:5px;left:5px;margin:0;display:flex;overflow:hidden;align-items:center;justify-content:center;width:2.1875em;height:1.5625em;padding:0;cursor:pointer;transition:left .2s ease,top .2s ease;letter-spacing:normal;opacity:.8;border:0;border-radius:3px;background:var(--vm-color-primary);box-shadow:1px 1px 4px rgba(0,0,0,.2);font-family:var(--vm-ff-code)!important;font-size:13px}button.view-markup__modal-btn:after{margin-top:2px;content:"</>";color:var(--vm-color-html-primary);font-size:62%;font-weight:700}button.view-markup__modal-btn:before{position:absolute;top:3px;left:0;width:100%;height:4px;content:"..";text-align:left;text-indent:3px;color:var(--vm-color-text);font-size:40%;line-height:0}button.view-markup__modal-btn:focus,button.view-markup__modal-btn:hover{opacity:1}button.view-markup__modal-btn:focus+.view-markup__highlight:nth-child(2),button.view-markup__modal-btn:hover+.view-markup__highlight:nth-child(2){position:absolute;z-index:99;top:0;left:0;width:100%;height:100%;content:"";pointer-events:none;border:3px solid rgba(255,0,0,.1);background-color:rgba(255,0,0,.05)}.view-markup-modal{position:fixed;z-index:var(--vm-modal-z);top:0;left:0;display:none;overflow:hidden;width:100%;height:100%;outline:0;background-color:rgba(30,33,39,.3);font-family:var(--vm-ff-code);line-height:normal}.view-markup-modal *{margin:0;padding:0;border:0;border-radius:0}.view-markup-modal:focus{outline:0}.view-markup-modal *{box-sizing:border-box;-webkit-font-smoothing:auto;-moz-osx-font-smoothing:auto}.view-markup-modal.view-markup-modal--showing{display:block;overflow-x:hidden;overflow-y:auto}.view-markup-modal .view-markup-modal__dialog{position:relative;display:flex;align-items:center;width:auto;max-width:900px;min-height:calc(100% - var(--vm-spacing-outer-modal) * 2);margin:15px auto;padding:0 15px;transition:max-width .5s var(--vm-ease-common),opacity 90ms linear,filter 90ms linear;pointer-events:none}.view-markup-modal .view-markup__content{border-radius:var(--vm-border-radius-common);box-shadow:0 19px 38px rgba(0,0,0,.4)}.view-markup-modal .view-markup__code{height:490px}.js-view-markup-size-large .view-markup-modal .view-markup-modal__dialog{max-width:100%}.js-view-markup-size-large .view-markup-modal .view-markup__code{width:100%;height:calc(100vh - (40px + var(--vm-height-modal-header) + 1px));max-height:calc(100vh - (40px + var(--vm-height-modal-header) + 1px))}.view-markup__content{position:relative;display:flex;overflow:hidden;flex-direction:column;width:100%;pointer-events:auto;outline:0;background-color:var(--vm-color-primary);background-clip:padding-box;font-size:13px;font-weight:500}.view-markup__content *{-webkit-font-smoothing:auto;-moz-osx-font-smoothing:auto}.view-markup__content .view-markup__header{position:relative;display:flex;align-items:center;flex-direction:row;height:var(--vm-height-modal-header);padding:5px var(--vm-spacing-common) 5px var(--vm-spacing-common);color:var(--vm-color-text);border-bottom:1px solid var(--vm-color-border-common)}.view-markup__content .view-markup__header:after{position:absolute;z-index:1;top:0;right:0;width:75px;height:100%;content:"";pointer-events:none;background:linear-gradient(90deg,rgba(30,33,39,0) 0,#1e2127 32%)}.view-markup__content .view-markup__title{position:relative;z-index:0;overflow:hidden;padding-right:40px;white-space:nowrap;letter-spacing:.5px;font-family:var(--vm-ff-primary);font-size:1.16666em;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:antialiased}.view-markup__content .view-markup__nav{position:relative;z-index:2;display:flex;margin-right:8px;margin-left:-8px}.view-markup__content .view-markup__close-btn,.view-markup__content .view-markup__next-btn,.view-markup__content .view-markup__prev-btn,.view-markup__content .view-markup__settings-btn{display:inline-flex;align-items:center;justify-content:center;width:var(--vm-size-touch-common);min-width:var(--vm-size-touch-common);height:var(--vm-size-touch-common);padding:0;cursor:pointer;text-align:center;color:var(--vm-color-text);border:0;border-radius:60px;background-color:transparent;line-height:0;margin-top:0;margin-bottom:0}.view-markup__content .view-markup__close-btn svg,.view-markup__content .view-markup__next-btn svg,.view-markup__content .view-markup__prev-btn svg,.view-markup__content .view-markup__settings-btn svg{position:relative;width:auto;height:1em;pointer-events:none;font-size:1em}.view-markup__content .view-markup__close-btn:focus,.view-markup__content .view-markup__close-btn:hover,.view-markup__content .view-markup__close-btn[aria-expanded=true],.view-markup__content .view-markup__next-btn:focus,.view-markup__content .view-markup__next-btn:hover,.view-markup__content .view-markup__next-btn[aria-expanded=true],.view-markup__content .view-markup__prev-btn:focus,.view-markup__content .view-markup__prev-btn:hover,.view-markup__content .view-markup__prev-btn[aria-expanded=true],.view-markup__content .view-markup__settings-btn:focus,.view-markup__content .view-markup__settings-btn:hover,.view-markup__content .view-markup__settings-btn[aria-expanded=true]{opacity:.8;background-color:var(--vm-color-ui-controls)}.view-markup__content .view-markup__prev-btn svg{right:.125em}.view-markup__content .view-markup__prev-btn .sty0{fill:var(--vm-color-text)}.view-markup__content .view-markup__next-btn{margin:0}.view-markup__content .view-markup__next-btn svg{left:.125em}.view-markup__content .view-markup__next-btn .sty0{fill:var(--vm-color-text)}.view-markup__content .view-markup__close-btn{position:relative;z-index:2;margin-right:-5px;margin-left:2px}.view-markup__content .view-markup__close-btn .sty0{fill:var(--vm-color-text)}.view-markup__content .view-markup__title+.view-markup__close-btn{margin-left:auto}.view-markup__content .view-markup__controls{position:absolute;z-index:1;top:8px;right:10px;display:flex;margin-left:auto;padding:2px 0 2px 2px;color:var(--vm-color-text);border-radius:100px;background-color:var(--vm-color-primary);font-size:1em}.view-markup__content .view-markup__copy-btn{position:relative;z-index:2;flex:0 0 auto;max-width:none;height:var(--vm-size-touch-common);margin-right:0;padding:6px 12px;cursor:pointer;text-align:center;letter-spacing:.5px;text-transform:none;color:var(--vm-color-text);border:0;border-radius:100px;background-color:var(--vm-color-ui-controls);font-family:var(--vm-ff-primary);font-size:.92em;font-weight:400;line-height:normal;margin-top:0;margin-bottom:0}.view-markup__content .view-markup__copy-btn:disabled{opacity:.5}.view-markup__content .view-markup__copy-btn:focus,.view-markup__content .view-markup__copy-btn:hover{opacity:.8;color:inherit}.view-markup__content .view-markup__settings-btn svg{height:auto}.view-markup__content .view-markup__settings-btn .sty0{fill:var(--vm-color-text)}.view-markup__content .view-markup__settings{position:relative;z-index:5;margin-right:2px;margin-left:2px}.view-markup__content .view-markup__settings-dropdown{position:absolute;top:75%;right:5%;display:none;width:160px;letter-spacing:.5px;border-radius:var(--vm-border-radius-common);background:var(--vm-color-primary);box-shadow:2px 2px 10px rgba(0,0,0,.65);font-family:var(--vm-ff-primary);font-weight:400}.view-markup__content .view-markup__settings-dropdown.view-markup__settings-dropdown--showing{display:block}.view-markup__content .view-markup__settings-item{display:flex;align-items:center;justify-content:center;padding:6px 10px;font-size:.92em}.view-markup__content .view-markup__settings-item:last-child{border:0}.view-markup__content .view-markup__settings-label{color:inherit;font-size:inherit;font-weight:inherit;font-style:inherit}.view-markup__content .view-markup__switch-face{position:absolute;z-index:0;left:2px;overflow:hidden;width:var(--vm-size-touch-common);height:var(--vm-size-touch-common);transition:all .3s var(--vm-ease-common)}.view-markup__content .view-markup__switch-face:after{position:absolute;z-index:0;top:0;left:0;width:100%;height:100%;content:"";border-radius:60px;background:var(--vm-color-switch-face)}.view-markup__content .view-markup__switch{position:relative;display:flex;align-items:center;flex-direction:row;justify-content:center;box-sizing:content-box;width:calc(var(--vm-size-touch-common) * 2);height:var(--vm-size-touch-common);margin-top:0;margin-right:0;margin-left:auto;padding:2px;border:0 none!important;border-radius:60px;background-color:var(--vm-color-radio-background)}.view-markup__content .view-markup__switch:focus,.view-markup__content .view-markup__switch:hover{opacity:.8}.view-markup__content .view-markup__switch label{position:static;z-index:1;top:0;display:flex;align-items:center;justify-content:center;box-sizing:border-box;width:var(--vm-size-touch-common);height:var(--vm-size-touch-common);margin:0;margin-bottom:0;padding:0;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:var(--vm-color-text);font-family:var(--vm-ff-code);font-size:1em;font-weight:400;line-height:0;-webkit-touch-callout:none}.view-markup__content .view-markup__switch label:before{position:absolute;top:0;left:0;width:calc(var(--vm-size-touch-common) * 2.2);height:100%;content:""}.view-markup__content .view-markup__switch label:first-of-type{margin-right:auto}.view-markup__content .view-markup__switch label:last-of-type{margin-left:auto}.view-markup__content .view-markup__switch .sty0{fill:var(--vm-color-text)}.view-markup__content .view-markup__switch [type=radio]:focus~.view-markup__switch-face:after{background-color:#4a5261}.view-markup__content .view-markup__switch [type=radio]:checked+label{pointer-events:none}.view-markup__content .view-markup__switch [type=radio]:last-of-type:checked~.view-markup__switch-face{left:calc(100% - 32px)}.view-markup__content .view-markup__switch-moon{transform:rotate(13deg)}.view-markup__content .view-markup__switch-moon .sty0{fill:var(--vm-color-moon)}.view-markup__content .view-markup__switch-sun{transform:rotate(13deg)}.view-markup__content .view-markup__switch-sun .sty0{fill:var(--vm-color-sun)}.view-markup__content input.view-markup__font-size{flex:0 0 40px;padding:0;line-height:normal;max-width:40px;height:var(--vm-size-touch-common);margin-bottom:0;margin-left:auto;text-align:center;text-indent:0;color:var(--vm-color-text);border:0;border-radius:4px;background-color:var(--vm-color-radio-background);font-family:var(--vm-ff-code);font-size:1em}.view-markup__content input.view-markup__font-size::-webkit-inner-spin-button{-webkit-appearance:none}.view-markup__content input.view-markup__font-size:active,.view-markup__content input.view-markup__font-size:focus,.view-markup__content input.view-markup__font-size:hover{background-color:var(--vm-color-radio-background)}.view-markup__content .view-markup__main{flex:0 0 100%;min-width:100%;padding:0}.view-markup__content .view-markup__body{display:flex;flex-direction:row;position:relative}.view-markup__content .view-markup__pre{position:relative;display:flex;margin:0;padding:0;border:0;border-radius:0;background-color:transparent;font-size:1em}.view-markup__content .view-markup__pre:after,.view-markup__content .view-markup__pre:before{position:absolute;top:0;right:0;width:var(--vm-spacing-common);height:100%;content:"";pointer-events:none;background:0 0;background:linear-gradient(90deg,rgba(30,33,39,0) 0,rgba(30,33,39,.8) 50%)}.view-markup__content .view-markup__pre:after{top:auto;bottom:0;width:100%;height:var(--vm-spacing-common);background:linear-gradient(180deg,rgba(30,33,39,0) 0,rgba(30,33,39,.8) 50%)}.view-markup__content .view-markup__code{overflow-y:auto;width:100%;min-height:190px;max-height:490px;padding:var(--vm-spacing-common);transition:width .5s var(--vm-ease-common),height .5s var(--vm-ease-common),max-height .5s var(--vm-ease-common);white-space:pre;letter-spacing:normal;border:0;border-radius:0;outline:0!important;background-color:var(--vm-color-primary);font-family:Menlo,Consolas,"DejaVu Sans Mono",monospace;font-size:1em;line-height:1.45;scrollbar-color:rgba(255,255,255,.75) transparent;scrollbar-width:thin}.view-markup__content .view-markup__code::-webkit-scrollbar-corner{background-color:transparent}.view-markup__content .view-markup__code::-webkit-scrollbar{width:5px;height:5px}.view-markup__content .view-markup__code::-webkit-scrollbar-track{background-color:transparent}.view-markup__content .view-markup__code::-webkit-scrollbar-thumb{outline:0;background-color:rgba(255,255,255,.75)}.view-markup__content .view-markup__tabs{position:absolute;z-index:1;top:8px;left:10px;display:none;align-items:center;flex-direction:row;justify-content:center;box-sizing:content-box;height:43px;height:var(--vm-size-touch-common);margin-right:auto;margin-left:0;padding:2px;border-radius:60px;background-color:var(--vm-color-primary);background-color:var(--vm-color-radio-background)}.view-markup__content .view-markup__tabs-button{height:30px;padding-right:15px;padding-left:15px;cursor:pointer;color:var(--vm-color-text);border:0;border-radius:60px;background-color:var(--vm-color-ui-controls);font-size:.92em}.view-markup__content .view-markup__tabs-button:hover{opacity:.8;background-color:#252830}.view-markup__content .view-markup__code--js{display:none}.view-markup__content.view-markup-modal--has-js .view-markup__code{padding-top:50px}.view-markup__content.view-markup-modal--has-js .view-markup__tabs-button--html{pointer-events:none}.view-markup__content.view-markup-modal--has-js .view-markup__tabs-button--js{margin-left:2px;background-color:#252830}.view-markup__content.view-markup-modal--has-js .view-markup__tabs{display:inline-flex}.view-markup__content.view-markup--js-tab-showing .view-markup__tabs-button--html{pointer-events:initial;background-color:#252830}.view-markup__content.view-markup--js-tab-showing .view-markup__tabs-button--js{pointer-events:none;background-color:var(--vm-color-ui-controls)}.view-markup__content.view-markup--js-tab-showing .view-markup__code--html{display:none}.view-markup__content.view-markup--js-tab-showing .view-markup__code--js{display:block}.view-markup__in-page-view{margin-top:var(--vm-spacing-common);margin-bottom:var(--vm-spacing-common)}.js-view-markup-theme-light .view-markup__modal-btn{border:1px solid #ccc}.js-view-markup-theme-light .view-markup-modal .view-markup__content{border:0}.js-view-markup-theme-light .view-markup__header:after{background:linear-gradient(90deg,rgba(252,252,252,0) 0,#fcfcfc 25%)}.js-view-markup-theme-light .view-markup__settings-dropdown{box-shadow:2px 2px 10px rgba(0,0,0,.1)}.js-view-markup-theme-light .view-markup__tabs-button{background-color:#fff}.js-view-markup-theme-light .view-markup__tabs-button:hover{opacity:.8;background-color:#e6e6e6}.js-view-markup-theme-light .view-markup-modal--has-js .view-markup__tabs-button--js{background-color:#f2f2f2}.js-view-markup-theme-light .view-markup--js-tab-showing .view-markup__tabs-button--html{background-color:#f2f2f2}.js-view-markup-theme-light .view-markup--js-tab-showing .view-markup__tabs-button--js{background-color:#fff}.js-view-markup-theme-light .view-markup__pre:after,.js-view-markup-theme-light .view-markup__pre:before{background:linear-gradient(90deg,rgba(252,252,252,0) 0,rgba(252,252,252,.8) 50%)}.js-view-markup-theme-light .view-markup__pre:after{background:linear-gradient(180deg,rgba(252,252,252,0) 0,rgba(252,252,252,.8) 50%)}.js-view-markup-theme-light .view-markup__code{scrollbar-color:rgba(51,51,51,.75) transparent}.js-view-markup-theme-light .view-markup__code::-webkit-scrollbar-thumb{outline:0;background-color:rgba(51,51,51,.75)}.js-view-markup-theme-light .view-markup__switch:focus,.js-view-markup-theme-light .view-markup__switch:hover{opacity:.8}.js-view-markup-theme-light .view-markup__switch [type=radio]:focus~.view-markup__switch-face:after{background-color:#fff}.js-view-markup-theme-light .view-markup--fancy-hover:before{background-color:rgba(0,0,0,.1)}.view-markup__in-page-view,.view-markup__modal-btn{visibility:hidden}.js-view-markup-ready .view-markup__in-page-view,.js-view-markup-ready .view-markup__modal-btn{visibility:visible}
`;

            // Apply in page styles to style tag
            textStyle.textContent = textStyleString;

            // Add in page styles to head
            document.head.appendChild(textStyle);





            // -----------------------------------------------------------------------------
            // Load external libraries
            // -----------------------------------------------------------------------------

            // TODO: import these through npm packages

            // Highlight css and js CDN. Project repo: https://github.com/highlightjs/highlight.js/
            let highlightVersionNumb = {
                css: '10.7.2',
                js: '11.3.1'
            }
            let themeCssDarkUrl = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/' + highlightVersionNumb.css + '/styles/atom-one-dark.min.css';
            let themeCssLightUrl = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/' + highlightVersionNumb.css + '/styles/github.min.css';

            let highlightCssUrl = (localStorage.getItem('checkedThemeColor') === null || localStorage.getItem('checkedThemeColor') === 'dark') ? themeCssDarkUrl : themeCssLightUrl;
            let highlightScriptUrl = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/' + highlightVersionNumb.js + '/highlight.min.js';

            // Beautify HTML CDN. Project repo: https://github.com/beautifier/beautifier.io
            let beautifyVersionNumb = '1.14.0';
            let beautifyScriptUrl = 'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/' + beautifyVersionNumb + '/beautify-html.min.js';

            // HTML2Canvas CDN
            let html2CanvasVersionNumb = '1.4.1';
            let html2CanvasScriptUrl = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/' + html2CanvasVersionNumb + '/html2canvas.min.js';

            // Load highlight js/css external assets
            loadExternalCss(highlightCssUrl);

            // Initalize everything after getting beautify-html script
            loadExternalJs(beautifyScriptUrl, loadFinalJS);
            
            // loadExternalJs(html2CanvasScriptUrl);

            function loadFinalJS() {
                loadExternalJs(highlightScriptUrl, viewMarkupInitialize);
            }

            function loadExternalJs(scriptSrc, callback) {
                let head = document.getElementsByTagName('head')[0];
                let script = document.createElement('script');
                
                script.src = scriptSrc;
                
                head.appendChild(script);
                script.onload = callback;
            }

            // Run after getting beautify-html/highlight.io external assets
            function loadExternalCss(url, callback) {
                let head = document.getElementsByTagName('head')[0];
                let link = document.createElement('link');
                    
                link.id = 'highlightJsCss';
                link.rel = 'stylesheet';
                link.href = url;
                
                link.onreadystatechange = callback;
                link.onload = callback;
                head.appendChild(link);
            }





            // -----------------------------------------------------------------------------
            // Render modal
            // -----------------------------------------------------------------------------
                
            // Setup modal outer div and attributes
            modalEl.classList.add('view-markup-modal');
            modalEl.setAttribute('id', 'viewMarkupModal');
            modalEl.setAttribute('aria-labelledby', 'viewMarkupModalTitle');
            modalEl.setAttribute('aria-modal', true);
            modalEl.setAttribute('role', 'dialog');
            modalEl.setAttribute('tabindex', '-1');

            // Create modal dialog div
            let modalDialog = document.createElement('div');

            // Insert modal dialog element into outer modal element
            modalDialog.classList.add('view-markup-modal__dialog');
            modalEl.appendChild(modalDialog);

            // Add the rest of the html string into modal dialog
            modalDialog.innerHTML = markupContentHtmlString;
            document.body.appendChild(modalEl);

            // Set in page element
            let wrapperEl = document.querySelectorAll('.view-markup');
            wrapperEl.forEach(function (item) {
                if (item.querySelector('[data-view-markup-in-page]')) {
                    let inPageBlock = document.createElement('div');
                    inPageBlock.classList.add('view-markup__in-page-view');
                    item.appendChild(inPageBlock);
                    inPageBlock.innerHTML = markupContentHtmlString;
                }
            });

            // Assign in page unique ids and adjust aria-lablledby to match
            let inPageContent = document.querySelectorAll('.view-markup__in-page-view .view-markup__content');
            let inPageHeader = document.querySelectorAll('.view-markup__in-page-view .view-markup__header');
            let modalSetSize = document.querySelectorAll('.view-markup__size-set');

            inPageContent.forEach(function (item, index) {
                inPageHeader[index].remove();
                modalSetSize[index].remove();
                
                let allID = item.querySelectorAll('[id]');
                let allFor = item.querySelectorAll('[for]');
                let allAriaLabelledBy = item.querySelectorAll('[aria-labelledby]');

                // Unique id
                for (let x = 0; x < allID.length; x++) {
                    allID[x].id = allID[x].id + '-' + index;
                }
                
                // Unique for
                for (let y = 0; y < allFor.length; y++) {
                    let currentFor = allFor[y].getAttribute('for');
                    allFor[y].setAttribute('for', currentFor + '-' + index);
                }

                // Unique aria-labelledby
                for (let z = 0; z < allAriaLabelledBy.length; z++) {
                    let currentAriaLabelledBy = allAriaLabelledBy[z].getAttribute('aria-labelledby');
                    allAriaLabelledBy[z].setAttribute('aria-labelledby', currentAriaLabelledBy + '-' + index);
                }
            });

            // When external assets are loaded run this
            function readyAdjustments() {
                wrapperEl.forEach(function (item, index) {
                    
                    // Tidy js
                    if (item.querySelector('[data-view-markup-in-page]') && item.querySelector('[data-view-markup-script-selector]')) {
                        let inPageCodeJsBlock = item.querySelector('.view-markup__code--js');
                        let scriptSelector = item.querySelector('[data-view-markup-script-selector]').getAttribute('data-view-markup-script-selector');
                        let scriptElement = document.querySelector(scriptSelector);
                        let jsToTidy = scriptElement.outerHTML.toString().replace(/ id=".*"/g, '');
                        
                        let tidyJS = html_beautify(jsToTidy, {
                            indent_size: getCachedSpaceTab(),
                            space_in_empty_paren: true
                        });
                        
                        inPageCodeJsBlock.textContent = tidyJS;
                        hljs.highlightElement(inPageCodeJsBlock);
                        
                        if (inPageCodeJsBlock.textContent !== '') {
                            inPageCodeJsBlock.closest('.view-markup__content').classList.add('view-markup-modal--has-js');
                        }
                    }
                    
                    // Tidy html
                    if (item.querySelector('[data-view-markup-in-page]')) {
                        let inPageCodeHtmlBlock = item.querySelector('.view-markup__code--html');
                        let tidyHTML = html_beautify(elHtmlStripped[index], {
                            indent_size: getCachedSpaceTab(),
                            space_in_empty_paren: true
                        });
                        
                        inPageCodeHtmlBlock.textContent = tidyHTML;
                        hljs.highlightElement(inPageCodeHtmlBlock);
                        
                        // Remove uneeded modal button
                        item.querySelector('[data-view-markup-in-page]').remove();
                    }
                });
                
                // Ready to initialize modal navigation
                modalNavigation();
                
                // Add ready class on body
                document.documentElement.classList.add('js-view-markup-ready');
            }




            // -----------------------------------------------------------------------------
            // Cache rendered elements
            // -----------------------------------------------------------------------------

            let modalContent = document.querySelectorAll('.view-markup__content');
            let modalCloseBtn = document.querySelectorAll('.view-markup__close-btn');
            let copyBtn = document.querySelectorAll('.view-markup__copy-btn');
            let settingsBtn = document.querySelectorAll('.view-markup__settings-btn');
            let settingsDropdown = document.querySelectorAll('.view-markup__settings-dropdown');
            let textArea = document.querySelectorAll('.view-markup__hidden-textarea');
            let preEl = document.querySelectorAll('.view-markup__pre');
            let htmlCodeEl = document.querySelectorAll('.view-markup__code--html');
            let jsCodeEl = document.querySelectorAll('.view-markup__code--js');
            let radio2Spaces = document.querySelectorAll('.view-markup__indent-2');
            let radio4Spaces = document.querySelectorAll('.view-markup__indent-4');
            let themeDark = document.querySelectorAll('.view-markup__theme-dark');
            let themeLight = document.querySelectorAll('.view-markup__theme-light');
            let fontSize = document.querySelectorAll('.view-markup__font-size');
            let htmlTab = document.querySelectorAll('.view-markup__tabs-button--html');
            let jsTab = document.querySelectorAll('.view-markup__tabs-button--js');
            let inPageCodeBlock = document.querySelectorAll('.view-markup-in-page');

            // Modal specific elements
            let modalCodeHtmlEL = document.querySelector('.view-markup-modal .view-markup__code--html');
            let modalContentEl = document.querySelector('.view-markup-modal .view-markup__content');
            let modalTitleEl = document.querySelector('.view-markup-modal .view-markup__title');
            let modalSizeMedium = document.querySelectorAll('.view-markup__size-medium');
            let modalSizeLarge = document.querySelectorAll('.view-markup__size-large');
            let modalCodeJsEL = document.querySelectorAll('.view-markup-modal .view-markup__code--js');








            // -----------------------------------------------------------------------------
            // Setup cached settings
            // -----------------------------------------------------------------------------

            // Select cached tabspaces radio
            if (localStorage.getItem('checkedSpaceTab') === null || localStorage.getItem('checkedSpaceTab') === '4' ) {
                radio4Spaces.forEach(function (item) {
                    item.checked = true;
                });
            } else {
                radio2Spaces.forEach(function (item) {
                    item.checked = true;
                });
            }


            // Select cached theme radio
            if (localStorage.getItem('checkedThemeColor') === null || localStorage.getItem('checkedThemeColor') === 'dark') {
                themeDark.forEach(function (item) {
                    item.checked = true;
                });
            } else {
                themeLight.forEach(function (item) {
                    item.checked = true;
                });
                document.documentElement.classList.add('js-view-markup-theme-light');
            }


            // Select cached modal size radio
            if (localStorage.getItem('checkedModalSize') === null || localStorage.getItem('checkedModalSize') === 'medium' ) {
                modalSizeMedium.forEach(function (item) {
                    item.checked = true;
                });
            } else {
                modalSizeLarge.forEach(function (item) {
                    item.checked = true;
                });
                document.body.classList.add('js-view-markup-size-large');
            } 


            // Get cached font-size
            if (localStorage.getItem('fontSizevalue') === null ) {
                fontSize.forEach(function (item) {
                    item.value = '13';
                });
            } else {
                let currentValue = localStorage.getItem('fontSizevalue');
                
                fontSize.forEach(function (item) {
                    item.value = localStorage.getItem('fontSizevalue');
                });

                preEl.forEach(function (item, index) {
                    item.style.fontSize = currentValue + 'px';
                });
            }

            // Font code font size
            fontSize.forEach(function (item, index) {
                item.addEventListener('change', function () {
                    let currentValue = item.value;
                    
                    localStorage.setItem('fontSizevalue', currentValue);

                    fontSize.forEach(function (item, index) {
                        item.value = currentValue
                    });

                    preEl.forEach(function (item, index) {
                        item.style.fontSize = currentValue + 'px';
                    });
                });
            });




            // -----------------------------------------------------------------------------
            // Modal and code controls
            // -----------------------------------------------------------------------------

            // Copy button
            copyBtn.forEach(function (item, index) {
                item.addEventListener('click', function () {
                    let currentShowingCode;
                    let closestElement = item.closest('.view-markup__content');
                    let currentCode = closestElement.querySelectorAll('.view-markup__code');
                            
                    for (let i = 0; i < currentCode.length; i++) {
                        if (currentCode[i].offsetWidth > 0 && currentCode[i].offsetHeight > 0) {
                            currentShowingCode = currentCode[i];
                        }
                    }
                            
                    applyTidyCodeToTextArea(currentShowingCode.textContent, getCachedSpaceTab(), index);
                    
                    applyCopyBtnState('disabled');

                    navigator.clipboard.writeText(textArea[index].value);
                });
            });

            // Tabspaces (2) radio change event listeners
            radio2Spaces.forEach(function (item, index) {
                item.addEventListener('change', function () {
                    if (this.checked === true) {
                        
                        // Remember tab checked radio
                        localStorage.setItem('checkedSpaceTab', 2);
                        
                        radio4Spaces.forEach(function (item, index) {
                            item.checked = false;
                        });
                        
                        radio2Spaces.forEach(function (item, index) {
                            item.checked = true;
                        });
                        
                        // Set to 2 tabs
                        htmlCodeEl.forEach(function (item) {
                            applyCleanHtml(item.textContent, 4, null, item);
                        });
                        
                        // Apply clean js
                        applyCleanJs(2, null, true, jsCodeEl);
                                                
                        // Set copy button state
                        applyCopyBtnState('enabled');
                        
                        this.focus();
                    }
                });
            });

            // Tabspaces (4) radio change event listeners
            radio4Spaces.forEach(function (item, index) {
                item.addEventListener('change', function () {
                    if (this.checked === true) {
                        
                        // Remember tab checked radio
                        localStorage.setItem('checkedSpaceTab', 4);
                        
                        radio2Spaces.forEach(function (item, index) {
                            item.checked = false;
                        });
                        
                        radio4Spaces.forEach(function (item, index) {
                            item.checked = true;
                        });
                        
                        // Set to 4 tabs
                        htmlCodeEl.forEach(function (item) {
                            applyCleanHtml(item.textContent, 4, null, item);
                        });
                        
                        // Apply clean js
                        applyCleanJs(4, null, true, jsCodeEl);
                        
                        // Set copy button state
                        applyCopyBtnState('enabled');
                        
                        this.focus();
                    }
                });
            });


            // Dark theme radio change event listeners
            themeDark.forEach(function (item) {
                item.addEventListener('change', function () {
                    if (this.checked === true) {
                        
                        themeLight.forEach(function (item, index) {
                            item.checked = false;
                        });
                        
                        themeDark.forEach(function (item, index) {
                            item.checked = true;
                        });
                        
                        // Remember tab checked radio
                        localStorage.setItem('checkedThemeColor', 'dark');
                        document.documentElement.classList.remove('js-view-markup-theme-light');
                        document.getElementById('highlightJsCss').href = themeCssDarkUrl;
                    }
                });
            });

            // Light theme radio change event listeners
            themeLight.forEach(function (item) {
                item.addEventListener('change', function () {
                    if (this.checked === true) {
                        
                        themeDark.forEach(function (item, index) {
                            item.checked = false;
                        });
                        
                        themeLight.forEach(function (item, index) {
                            item.checked = true;
                        });
                        
                        // Remember tab checked radio
                        localStorage.setItem('checkedThemeColor', 'light');
                        document.documentElement.classList.add('js-view-markup-theme-light');
                        document.getElementById('highlightJsCss').href = themeCssLightUrl;
                    }
                });
            });

            // Medium modal size radio change event listeners
            modalSizeMedium.forEach(function (item) {
                item.addEventListener('change', function () {
                    if (this.checked === true) {
                        
                        modalSizeLarge.forEach(function (item, index) {
                            item.checked = false;
                        });
                        
                        modalSizeMedium.forEach(function (item, index) {
                            item.checked = true;
                        });
                        
                        // Remember tab checked radio
                        localStorage.setItem('checkedModalSize', 'medium');
                        document.body.classList.remove('js-view-markup-size-large');
                    }
                });
            });

            // Large modal size radio change event listeners
            modalSizeLarge.forEach(function (item) {
                item.addEventListener('change', function () {
                    if (this.checked === true) {
                        
                        modalSizeMedium.forEach(function (item, index) {
                            item.checked = false;
                        });
                        
                        modalSizeLarge.forEach(function (item, index) {
                            item.checked = true;
                        });
                        
                        // Remember tab checked radio
                        localStorage.setItem('checkedModalSize', 'large');
                        document.body.classList.add('js-view-markup-size-large');
                    }
                });
            });





            // -----------------------------------------------------------------------------
            // HTML/JS tab toggling
            // -----------------------------------------------------------------------------

            htmlTab.forEach(function (item, index) {
                item.addEventListener('click', function () {
                    applyCopyBtnState('enabled');
                    this.closest('.view-markup__content').classList.remove('view-markup--js-tab-showing');
                });
            });

            jsTab.forEach(function (item, index) {
                item.addEventListener('click', function () {
                    applyCopyBtnState('enabled');
                    this.closest('.view-markup__content').classList.add('view-markup--js-tab-showing');
                });
            });







            // -----------------------------------------------------------------------------
            // Exiting the modal
            // -----------------------------------------------------------------------------

            // Hide modal by clicking outside of it
            modalEl.addEventListener('mousedown', function (event) {
                let isClickInside = false;
                
                modalContent.forEach(function (item) {
                    if ( item.contains(event.target) ) {
                        isClickInside = true;
                    }
                });
                
                if (!isClickInside && this.classList.contains('view-markup-modal--showing')) {
                    modalHide();
                }
            });

            // Hide modal with close and cancel button click
            modalCloseBtn.forEach(function (item) {
                item.addEventListener('click', function () {
                    modalHide();
                });
            });

            // Hide modal with esc key
            modalEl.addEventListener('keydown', function (e) {
                let key = e.key;

                if (key === 'Escape' && document.documentElement.classList.contains('js-view-markup-modal-showing')) {
                    modalHide();
                }
            });





            // -----------------------------------------------------------------------------
            // Settings dropdown functionality
            // -----------------------------------------------------------------------------

            let optionDropdownClass = 'view-markup__settings-dropdown--showing';

            // Settings dropdown
            settingsBtn.forEach(function (item, index) {
                item.addEventListener('click', function () {
                    let ariaExpandedAttr = this.getAttribute('aria-expanded');

                    this.setAttribute('aria-expanded', (ariaExpandedAttr === 'true') ? 'false' : 'true');
                    settingsDropdown[index].classList.toggle(optionDropdownClass);
                });
            });

            // Hide settings dropdown by clicking outside of it
            document.addEventListener('mousedown', function (event) {
                settingsDropdown.forEach(function (item, index) {
                    let isClickInside = item.contains(event.target);

                    if (
                        !event.target.classList.contains('view-markup__settings-btn') &&
                        item.classList.contains(optionDropdownClass) &&
                        !isClickInside
                    ) {
                        settingsBtn[index].setAttribute('aria-expanded', false);
                        item.classList.remove(optionDropdownClass);
                    }
                });
            });

            // Focus out of dropdown
            // settingsDropdown.addEventListener('focusout', function (event) {
            //     settingsBtn.setAttribute('aria-expanded', false);
            //     settingsDropdown.classList.remove(optionDropdownClass);
            // });





            // -----------------------------------------------------------------------------
            // Functions
            // -----------------------------------------------------------------------------

            // Function properly assigns untouched DOM html modal
            function viewMarkupInitialize() {
                elHtmlStripped.forEach(function (item, index) {
                    
                    // Assign modal button to correct html to view
                    let modalParent = viewMarkupEl[index].closest('.view-markup') || viewMarkupEl[index];
                    let modalBtnEL = modalParent.querySelector('.view-markup__modal-btn');

                    // Crack open the modal with the correct html in view
                    modalMapping(item, 2, modalBtnEL, null);
                });
                
                readyAdjustments();
            }

            // Cleanup and highlight markup
            function applyCleanHtml(html, spaces, btnEl, codeEl) {
                let tidyHTML = html_beautify(html, { indent_size: getCachedSpaceTab(), space_in_empty_paren: true });
                    
                codeEl.textContent = tidyHTML;
                
                hljs.highlightElement(codeEl);
            }

            // Cleanup and highlight associated js
            function applyCleanJs(spaces, btnEl, setTabSpaces, jsCodeEl) {    
                for (let i = 0; i < jsCodeEl.length; i++) {
                    if (jsCodeEl[i] !== undefined) {
                        let jsToTidy;
                                
                        if (setTabSpaces) {
                            jsToTidy = jsCodeEl[i].textContent;
                        } else if (btnEl !== null && btnEl.hasAttribute('data-view-markup-script-selector')) {
                            let scriptElement = document.querySelector(btnEl.getAttribute('data-view-markup-script-selector'));
                            jsToTidy = scriptElement.outerHTML.toString().replace(/ id=".*"/g, '');
                        }
                                
                        jsCodeEl[i].textContent = '';
                        
                        let tidyJs = html_beautify(jsToTidy, { indent_size: getCachedSpaceTab(), space_in_empty_paren: true });
                        
                        jsCodeEl[i].textContent = tidyJs;
                        
                        hljs.highlightElement(jsCodeEl[i]);
                    }
                }
            }

            // Return cached space/tab amount
            function getCachedSpaceTab() {
                let checkedSpacesRadio;
                if (localStorage.getItem('checkedSpaceTab') === null) {
                    checkedSpacesRadio = (radio2Spaces[0].checked === true) ? 2 : 4;
                } else {
                    checkedSpacesRadio = localStorage.getItem('checkedSpaceTab');
                }
                return checkedSpacesRadio;
            }

            // Populate hidden textarea with tidy html/js for copy button
            function applyTidyCodeToTextArea(code, spaceTabRadio, index) {
                let tidyCode = html_beautify(code, { indent_size: spaceTabRadio, space_in_empty_paren: true });
                textArea[index].textContent = tidyCode;
                return;
            }

            // Function that gets html, beautifies it, and displays it in a modal
            let currentViewMarkupIndex;
            function modalMapping(html, spaces, btnEl) {    
                btnEl.addEventListener('click', function () {        
                    
                    // Current modal button index (used for modal navigation)
                    currentViewMarkupIndex = this.getAttribute('data-view-markup-nav-index');
                    
                    // screenShotDomElement(viewMarkupEl[currentViewMarkupIndex]);

                    // Clean html
                    applyCleanHtml(html, spaces, this, modalCodeHtmlEL);
                    
                    // Clean js
                    applyCleanJs(spaces, this, null, modalCodeJsEL);

                    modalContentEl.classList.remove('view-markup--js-tab-showing');
                    
                    jsCodeEl.forEach(function (item) {
                        if (item.textContent !== '') {
                            modalContentEl.classList.add('view-markup-modal--has-js');
                        } else {
                            modalContentEl.classList.remove('view-markup-modal--has-js');
                        }
                    });
                    
                    modalShow();
                    
                    applyCopyBtnState('enabled');

                    // Add option title to modal title if there is one
                    if (btnEl.hasAttribute('data-view-markup-title')) {
                        let cleanTitle = btnEl.getAttribute('data-view-markup-title').replace(/^'(.*)'$/, '$1');
                        modalTitleEl.textContent = cleanTitle;
                    } else {
                        modalTitleEl.textContent = 'Viewing markup';
                    }
                    
                    // Add option backdrop rgb to modal back
                    if (btnEl.hasAttribute('data-view-markup-backdrop-rgb')) {
                        modalEl.style.backgroundColor = 'rgba(' + options.backdropRgb + ', .7)';
                    } else {
                        modalEl.style.backgroundColor = '';
                    }
                });
            }

            // Apply copy button state
            function applyCopyBtnState(state) {
                let clickedButton = document.querySelectorAll('.view-markup__copy-btn:focus');
                if (state === 'disabled') {
                    clickedButton.forEach(function (item) {
                        item.textContent = 'Copied';
                        item.setAttribute('disabled', 'disabled');
                    });
                } else if (state === 'enabled') {
                    copyBtn.forEach(function (item) {
                        item.textContent = 'Copy';
                        item.removeAttribute('disabled');
                    });
                }
            }

            // Wrap in tag
            function wrapElement(el, wrapper) {
                el.parentNode.insertBefore(wrapper, el);
                wrapper.appendChild(el);
            }

            // Insert after
            function insertAfter(newNode, existingNode) {
                existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
            }

            // Show modal
            let focusedElementBeforeModal;
            function modalShow() {
                document.documentElement.classList.add('js-view-markup-modal-showing');
                modalEl.classList.add('view-markup-modal--showing');
                
                // Save current focus
                focusedElementBeforeModal = document.activeElement;

                // Listen for and trap the keyboard
                modalEl.addEventListener('keydown', trapTabKey);
                
                // Find all focusable children
                let focusableElementsString =
                    'a[href],' +
                    'area[href],' +
                    'input,' +
                    'select:not([disabled]),' +
                    'textarea:not([tabindex="-1"]),' +
                    'button:not([disabled]),' +
                    'iframe,' +
                    'object,' +
                    'embed,' +
                    '[tabindex="0"],' +
                    '[contenteditable]';
                    
                let focusableElements = modalEl.querySelectorAll(focusableElementsString);
                
                // Convert NodeList to Array
                focusableElements = Array.prototype.slice.call(focusableElements);

                let firstTabStop = focusableElements[0];
                let lastTabStop = focusableElements[focusableElements.length - 1];
                
                // Set initial focus on the modal
                modalEl.focus();
                
                function trapTabKey(e) {
                    
                    // Check for TAB key press
                    if (e.keyCode === 9) {

                        // SHIFT + TAB
                        if (e.shiftKey) {
                            if (document.activeElement === firstTabStop) {
                                e.preventDefault();
                                lastTabStop.focus();
                            }

                        // TAB
                        } else {
                            if (document.activeElement === lastTabStop) {
                                e.preventDefault();
                                firstTabStop.focus();
                            }
                        }
                    }
                }
            }

            // Hide modal
            function modalHide() {
                document.documentElement.classList.remove('js-view-markup-modal-showing');
                modalEl.classList.remove('view-markup-modal--showing');
                applyCopyBtnState('enabled');
                focusedElementBeforemodalEl.focus();
            }

            // Go to previous/next view markup element
            function modalNavigate(el, direction) {
                let mapToModalBtnIndex;
                
                if (direction === 'prev') {
                    mapToModalBtnIndex = (parseInt(currentViewMarkupIndex) === 0) ? parseInt(elAmount) - 1 : parseInt(currentViewMarkupIndex) - 1;
                } else if (direction === 'next') {
                    mapToModalBtnIndex = (parseInt(currentViewMarkupIndex) === parseInt(elAmount) - 1) ? 0 : parseInt(currentViewMarkupIndex) + 1;
                }
                    
                let mapToModalBtnSelector = '[data-view-markup-nav-index="' + mapToModalBtnIndex + '"]';
                let mapToModalBtn = document.querySelector(mapToModalBtnSelector.toString());
                
                document.documentElement.classList.add('js-view-markup-modal-showing--navigating');
                
                mapToModalBtn.click();
                mapToModalBtn.focus();
                
                setTimeout(function () {
                    document.documentElement.classList.remove('js-view-markup-modal-showing--navigating');
                }, 300);
            }

            // Modal navigation arrows
            function modalNavigation() {    
                
                // Add index to modal buttons for navigation
                let modalNavEl = document.querySelector('.view-markup__nav');
                let modalBtn = document.querySelectorAll('.view-markup__modal-btn');
                
                elAmount = modalBtn.length;
                
                modalBtn.forEach(function (item, index) {
                    item.setAttribute('data-view-markup-nav-index', index);
                });
                
                if (elAmount > 1) {

                    // Modal previous button
                    let modalPrevBtn = modalEl.querySelector('.view-markup__prev-btn');

                    // Modal next button
                    let modalNextBtn = modalEl.querySelector('.view-markup__next-btn');
                    
                    // Modal previous button click
                    modalPrevBtn.addEventListener('click', function () {
                        modalNavigate(this, 'prev');
                    });

                    // Modal next button click
                    modalNextBtn.addEventListener('click', function () {
                        modalNavigate(this, 'next');
                    });  
                } else {

                    // Remove modal nav if only 1 item
                    modalNavEl.remove();
                }
                
                if (modalNav === null) {
                
                    // Remove modal nav if no setting is found
                    modalNavEl.remove();
                }
            }




            
            /* -----------------------------------------------------------------------------
                EXPIREMENTAL WIP: prototype floating the buttons over the page instead of
                wrapping each element in a div and then positioning it inside that div. Not
                a fan of how much it currently modifies the DOM to get the modal button next
                to the associated element correctly

                TODOS:
                ✓ Allow for dynamic button positioning
                • Add "Skip to view markup modal navigation" skip link
                • Add visual focus indicator to modal button when focus in the background
                when using modal navigation.
                ✓ Set smooth scrolling on the html,body when modal is active
                • Enhance preserve attribute functionality a bit. (allow for top and inner)
            ----------------------------------------------------------------------------- */

            // Render image of view-markup element
            function screenShotDomElement(el) {
                html2canvas(el).then(function(canvas) {
                    document.body.appendChild(canvas);
                });
            }

            // Unwrap function
            function unwrap(wrapper) {
                let docFrag = document.createDocumentFragment();
                
                while (wrapper.firstChild) {
                    let child = wrapper.removeChild(wrapper.firstChild);
                    docFrag.appendChild(child);
                }

                wrapper.parentNode.replaceChild(docFrag, wrapper);
            }

            // Debounce function (throttle window resize)
            function debounce(func) {
                let timer;

                return (event) => {
                    if (timer) {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(func, 1000, event);
                };
            }

            // Get query params if any
            let scriptLinkage = document.getElementById('view-markup-js');
            let modalNav = null;
            let dynamicPos = null;
            let dynamicPosZIndex = null;

            if (scriptLinkage) {
                let urlParam = new URLSearchParams(scriptLinkage.getAttribute('src').split('?')[1]);
                modalNav = urlParam.get('modal-nav');
                dynamicPos = urlParam.get('dynamic-pos');
                dynamicPosZIndex = urlParam.get('z-index');

                // If dynamic position query param is set, do some stuff
                if (dynamicPos !== null) {
                    window.addEventListener('load', () => {
                    
                        // Create new div that will contain all modal buttons
                        let floatingButtonHolder = document.createElement('div');
                        floatingButtonHolder.classList.add('view-markup-dynamic-nav');
                        
                        if (dynamicPosZIndex !== null) {
                            floatingButtonHolder.style.zIndex = dynamicPosZIndex.toString();
                        }
                        
                        document.body.appendChild(floatingButtonHolder);
                
                        // Cache elements with modals
                        let withmodalEl = document.querySelectorAll('[data-view-markup]:not([data-view-markup-render-in-page])');
                        
                        // Re-cache remaining buttons
                        let floatingModalBtn = document.querySelectorAll('.view-markup__modal-btn');
                        
                        // Dynamically position modal button next to associated element
                        function positionModalBtns(load) {
                            
                            // Add inline css to position button at the top left of the element
                            withmodalEl.forEach( (item, i) => {
                                let btnElement = floatingModalBtn[i];
                
                                btnElement.style.top = (item.getBoundingClientRect().top + window.scrollY) + 'px';
                                btnElement.style.left = item.getBoundingClientRect().left + 'px';
                
                                if (load === 'load') {
                                    floatingButtonHolder.appendChild(btnElement);
                                }
                            });
                        }
                        
                        // Remove un-needed highlight divs
                        let highlightElement = document.querySelectorAll('.view-markup__highlight');
                        highlightElement.forEach( (item) => {
                            item.remove();
                        });
                
                        // Unwrap view-markup div
                        wrapperEl.forEach( (item) => {
                            unwrap(item);
                        });
                        
                        // Position buttons on load
                        positionModalBtns('load');
                        
                        // Position buttons after resize
                        window.addEventListener('resize', debounce( () => {
                            positionModalBtns();
                        }));
                    });
                }
            }
        }
    });
})();
//# sourceMappingURL=view-markup.js.map