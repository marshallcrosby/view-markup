/*!
    * View markup v1.6.5
    * Plugin that makes it easy for developers to view and copy the html needed for a component.
    *
    * Copyright 2021-2022 Marshall Crosby
    * https://marshallcrosby.com
*/

// -----------------------------------------------------------------------------
// Custom styles added via js
// -----------------------------------------------------------------------------

// Create style tag to dump styles into for the markup modal
const textStyle = document.createElement('style');
textStyle.setAttribute('id', 'viewMarkupStyle');

// Import compressed styles as a string
const textStyleString = `//=inject view-markup.css`;

// Apply in page styles to style tag
textStyle.textContent = textStyleString;

// Add in page styles to head
document.head.appendChild(textStyle);

const viewMarkup = function() {
    
    // Cache elements
    const viewMarkupEl = document.querySelectorAll('[data-view-markup]');
    
    // Get query params if any
    const scriptLinkage = document.getElementById('view-markup-js') || document.querySelector('script[src*=view-markup]');
    const param = {
        modalNav: null,
        dynamicPos: null,
        dynamicPosZIndex: null,
        excludeAttribute: null,
        dragModal: null
    }

    if (scriptLinkage) {
        const urlParam = new URLSearchParams(scriptLinkage.getAttribute('src').split('?')[1]);
        param.modalNav = urlParam.get('modal-nav');
        param.dynamicPos = urlParam.get('dynamic-position');
        param.dynamicPosZIndex = urlParam.get('z-index');
        param.excludeAttribute = urlParam.get('exclude-attribute');
        param.dragModal = urlParam.get('drag-modal');
    }

    const srcReady = new Event('ViewMarkupSrcIsReady');
    const request = makeHttpObject();
    let pageSrc = null;
    
    request.open('GET', window.location.href, true);
    request.send(null);
    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            pageSrc = request.responseText;
            document.dispatchEvent(srcReady);
        }
    }

    // Get original page src
    function makeHttpObject() {
        if ('XMLHttpRequest' in window) {
            return new XMLHttpRequest();
        } else if ('ActiveXObject' in window) {
            return new ActiveXObject('Msxml2.XMLHTTP');
        }
    }
    
    // Convert src string to HTML
    function stringToHTML(str) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(str, 'text/html');
        return doc;
    }

    // Remove multiple attributes
    function removeAttributes(element, attributes) {
        attributes.forEach(function (attribute) {
            element.removeAttribute(attribute);
        });
    }

    Element.prototype.setAttributes = function (attrs) {
        for(let key in attrs) {
            this.setAttribute(key, attrs[key]);
        }
    };

    document.addEventListener('ViewMarkupSrcIsReady', function () {
        const srcPageHTML = stringToHTML(pageSrc);
        const srcViewMarkupEl = srcPageHTML.querySelectorAll('[data-view-markup]');
                    
        if (viewMarkupEl.length > 0) {
            let elHtmlInitial = [];
            let elHtmlClean = [];
            let elAmount = 0;
            let options;
            const markupContentHtmlString = `//=inject _view-markup-modal.html`;

            viewMarkupEl.forEach(function (item, index) {

                // Globally remove specified param attribute(s) from url param
                if (param.excludeAttribute !== null) {
                    const excludeAttributeArr = param.excludeAttribute.split(',');
                    removeAttributes(srcViewMarkupEl[index], excludeAttributeArr);
                }
                
                // Remove specific attribute(s) based on option
                excludeAttr(srcViewMarkupEl[index]);
                
                // Cache all viewable markup elements               
                elHtmlInitial[index] = (index === 0 && viewMarkupEl[0].tagName.toLowerCase() === 'html') ?
                    pageSrc :
                    srcViewMarkupEl[index].outerHTML;

                // Remove the view markup specific data attributes
                if (!preserveViewMarkupAttr(viewMarkupEl[index])) {
                    elHtmlClean[index] = elHtmlInitial[index].replace(/data-view-markup="[^\"]*"/g, '').replace(/^data-view-markup$/g, '');
                } else {
                    elHtmlClean[index] = elHtmlInitial[index];
                }
                
                // Create modal button
                let modalBtn = document.createElement('div');
                modalBtn.classList.add('view-markup__modal-btn');
                modalBtn.setAttributes({
                    'role': 'button',
                    'tabindex': '0'
                })
                modalBtn.innerHTML = '<span class="view-markup__modal-btn-text">View markup</span>';
                    
                // if <html> or <body> do things a bit differently
                if (viewMarkupEl[index].nodeName.toLowerCase()  === 'body' || viewMarkupEl[index].nodeName.toLowerCase()  === 'html') {
                    const wrapperDivBody = document.createElement('div');
                    wrapperDivBody.classList.add('view-markup', 'view-markup--body');
                    document.body.prepend(wrapperDivBody);
                    wrapperDivBody.appendChild(modalBtn);
                } else {
                    
                    // Wrap in div
                    const markupWrapperDiv = document.createElement('div');
                    markupWrapperDiv.classList.add('view-markup');
                    markupWrapperDiv.innerHTML = '<div class="view-markup__highlight"></div>';
                    wrapElement(viewMarkupEl[index], markupWrapperDiv);
                    markupWrapperDiv.prepend(modalBtn);
                }

                // Apply some options to toggle if available
                const optionsParams = convertToParamString(viewMarkupEl[index].getAttribute('data-view-markup'));
                
                options = {
                    title: optionsParams.get('title'),
                    btnX: optionsParams.get('btn-x'),
                    btnY: optionsParams.get('btn-y'),
                    btnZ: optionsParams.get('btn-z'),
                    btnPos: optionsParams.get('btn-pos'),
                    btnAppendTo: optionsParams.get('btn-append-to'),
                    btnPrependTo: optionsParams.get('btn-prepend-to'),
                    btnColor: optionsParams.get('btn-color'),
                    scriptSelector: optionsParams.get('script-selector'),
                    backdropRgb: optionsParams.get('backdrop-rgb'),
                    renderInPage: optionsParams.get('render-in-page'),
                    marginBottom: optionsParams.get('margin-bottom'),
                    marginTop: optionsParams.get('margin-top')
                };
                                        
                // Setup title attribute to be used later
                if (options.title) {
                    modalBtn.setAttribute('data-view-markup-title', options.title);
                }

                // Btn x position set
                if (options.btnX) {
                    modalBtn.style.transform = 'translateX(' + options.btnX + ')';
                }

                // Btn y position set
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
                    item.setAttribute('data-view-markup-render-in-page', '');
                }
                                        
                // Bottom margin for in page view
                if (options.marginBottom) {
                    item.closest('.view-markup').style.marginBottom = options.marginBottom;
                }
                
                // Top margin for in page view
                if (options.marginTop) {
                    item.closest('.view-markup').style.marginTop = options.marginTop;
                }
            });


            // Check for preserve-attribute option
            function preserveViewMarkupAttr(el) {                   
                const optionsParams = convertToParamString(el.getAttribute('data-view-markup'));
                const optionPreserveAttr = optionsParams.get('preserve-attribute');
                
                if (optionPreserveAttr !== null) {
                    return true;
                } else {
                    return false;
                }
            }
            
            // Remove attributes on a specific element
            function excludeAttr(el) {                   
                const optionExclude = convertToParamString(el.getAttribute('data-view-markup')).get('exclude-attribute');
                
                if (optionExclude !== null) {
                    const optionExcludeArr = optionExclude.split(/,\s|,/);
                    
                    optionExcludeArr.forEach(function (attribute) {
                        el.removeAttribute(attribute);
                    });
                    
                    return el;
                }
            }
            





            // -----------------------------------------------------------------------------
            // Load external libraries
            // -----------------------------------------------------------------------------

            // TODO: import these through npm packages

            // Highlight css and js CDN. Project repo: https://github.com/highlightjs/highlight.js/
            const highlightVersionNumb = {
                css: '10.7.2',
                js: '11.3.1'
            }
            const themeCssDarkUrl = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/' + highlightVersionNumb.css + '/styles/atom-one-dark.min.css';
            const themeCssLightUrl = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/' + highlightVersionNumb.css + '/styles/github.min.css';

            const highlightCssUrl = (localStorage.getItem('checkedThemeColor') === null || localStorage.getItem('checkedThemeColor') === 'dark') ? themeCssDarkUrl : themeCssLightUrl;
            const highlightScriptUrl = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/' + highlightVersionNumb.js + '/highlight.min.js';

            // Beautify HTML CDN. Project repo: https://github.com/beautifier/beautifier.io
            const beautifyVersionNumb = '1.14.0';
            const beautifyScriptUrl = 'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/' + beautifyVersionNumb + '/beautify-html.min.js';

            // Load highlight js/css external assets
            loadExternalCss(highlightCssUrl);

            // Initialize everything after getting beautify-html script
            loadExternalJs(beautifyScriptUrl, loadFinalJS);
            
            function loadFinalJS() {
                loadExternalJs(highlightScriptUrl, viewMarkupInitialize);
            }

            function loadExternalJs(scriptSrc, callback) {
                const head = document.getElementsByTagName('head')[0];
                const script = document.createElement('script');
                
                script.src = scriptSrc;
                
                head.appendChild(script);
                script.onload = callback;
            }

            // Run after getting beautify-html/highlight.io external assets
            function loadExternalCss(url, callback) {
                const head = document.getElementsByTagName('head')[0];
                const link = document.createElement('link');
                    
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
            const modalEl = document.createElement('div');
            modalEl.classList.add('view-markup-modal');
            
            modalEl.setAttributes({
                'id': 'viewMarkupModal',
                'aria-labelledby': 'viewMarkupModalTitle',
                'aria-modal': 'true',
                'role': 'dialog',
                'tabindex': '-1',
            });

            // Create modal dialog div
            const modalDialog = document.createElement('div');

            // Insert modal dialog element into outer modal element
            modalDialog.classList.add('view-markup-modal__dialog');
            modalEl.appendChild(modalDialog);

            // Add the rest of the html string into modal dialog
            modalDialog.innerHTML = markupContentHtmlString;
            document.body.appendChild(modalEl);

            // Set in page element
            const wrapperEl = document.querySelectorAll('.view-markup');
            wrapperEl.forEach(function (item) {
                if (item.querySelector('[data-view-markup-in-page]')) {
                    const inPageBlock = document.createElement('div');
                    inPageBlock.classList.add('view-markup__in-page-view');
                    item.appendChild(inPageBlock);
                    inPageBlock.innerHTML = markupContentHtmlString;
                }
            });

            // Assign in page unique ids and adjust aria-lablledby to match
            const inPageContent = document.querySelectorAll('.view-markup__in-page-view .view-markup__content');
            const inPageHeader = document.querySelectorAll('.view-markup__in-page-view .view-markup__header');
            const modalSetSize = document.querySelectorAll('.view-markup__size-set');

            inPageContent.forEach(function (item, index) {
                inPageHeader[index].remove();
                modalSetSize[index].remove();
                
                const allID = item.querySelectorAll('[id]');
                const allFor = item.querySelectorAll('[for]');
                const allAriaLabelledBy = item.querySelectorAll('[aria-labelledby]');

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
                        const inPageCodeJsBlock = item.querySelector('.view-markup__code--js');
                        const scriptSelector = item.querySelector('[data-view-markup-script-selector]').getAttribute('data-view-markup-script-selector');
                        const scriptElement = document.querySelector(scriptSelector);
                        const jsToTidy = scriptElement.outerHTML.toString().replace(/ id=".*"/g, '');
                        
                        const tidyJS = html_beautify(jsToTidy, {
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
                        const inPageCodeHtmlBlock = item.querySelector('.view-markup__code--html');
                        const tidyHTML = html_beautify(elHtmlClean[index], {
                            indent_size: getCachedSpaceTab(),
                            space_in_empty_paren: true
                        });
                        
                        inPageCodeHtmlBlock.textContent = tidyHTML;
                        hljs.highlightElement(inPageCodeHtmlBlock);
                    }
                });
                
                // Ready to initialize modal navigation
                modalNavigation();
                
                // Add ready class on body
                document.documentElement.classList.add('js-view-markup-ready');

                const vmReadyEvent = new Event('ViewMarkupReady');
                window.dispatchEvent(vmReadyEvent);
            }




            // -----------------------------------------------------------------------------
            // Cache rendered elements
            // -----------------------------------------------------------------------------

            const modalContent = document.querySelectorAll('.view-markup__content');
            const modalCloseBtn = document.querySelectorAll('.view-markup__close-btn');
            const copyBtn = document.querySelectorAll('.view-markup__copy-btn');
            const settingsBtn = document.querySelectorAll('.view-markup__settings-btn');
            const settingsDropdown = document.querySelectorAll('.view-markup__settings-dropdown');
            const textArea = document.querySelectorAll('.view-markup__hidden-textarea');
            const preEl = document.querySelectorAll('.view-markup__pre');
            const htmlCodeEl = document.querySelectorAll('.view-markup__code--html');
            const jsCodeEl = document.querySelectorAll('.view-markup__code--js');
            const radio2Spaces = document.querySelectorAll('.view-markup__indent-2');
            const radio4Spaces = document.querySelectorAll('.view-markup__indent-4');
            const themeDark = document.querySelectorAll('.view-markup__theme-dark');
            const themeLight = document.querySelectorAll('.view-markup__theme-light');
            const fontSize = document.querySelectorAll('.view-markup__font-size');
            const htmlTab = document.querySelectorAll('.view-markup__tabs-button--html');
            const jsTab = document.querySelectorAll('.view-markup__tabs-button--js');

            // Modal specific elements
            const modalCodeHtmlEL = document.querySelector('.view-markup-modal .view-markup__code--html');
            const modalContentEl = document.querySelector('.view-markup-modal .view-markup__content');
            const modalTitleEl = document.querySelector('.view-markup-modal .view-markup__title');
            const modalSizeMedium = document.querySelectorAll('.view-markup__size-medium');
            const modalSizeLarge = document.querySelectorAll('.view-markup__size-large');
            const modalCodeJsEL = document.querySelectorAll('.view-markup-modal .view-markup__code--js');





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
            if (localStorage.getItem('fontSizeValue') === null ) {
                fontSize.forEach(function (item) {
                    item.value = '12';
                });
            } else {
                const currentValue = localStorage.getItem('fontSizeValue');
                
                fontSize.forEach(function (item) {
                    item.value = localStorage.getItem('fontSizeValue');
                });

                preEl.forEach(function (item, index) {
                    item.style.fontSize = currentValue + 'px';
                });
            }

            
            // Font code font size
            fontSize.forEach(function (item, index) {
                item.addEventListener('change', function () {
                    const currentValue = item.value;
                    
                    localStorage.setItem('fontSizeValue', currentValue);

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
                    const closestElement = item.closest('.view-markup__content');
                    const currentCode = closestElement.querySelectorAll('.view-markup__code');
                            
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
                        
                        modalSizeLarge.forEach(function (item) {
                            item.checked = false;
                        });
                        
                        modalSizeMedium.forEach(function (item) {
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
                        
                        modalSizeMedium.forEach(function (item) {
                            item.checked = false;
                        });
                        
                        modalSizeLarge.forEach(function (item) {
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

            htmlTab.forEach(function (item) {
                item.addEventListener('click', function () {
                    item.parentNode.querySelector('.view-markup__tabs-button--js').setAttribute('aria-selected', 'false');
                    item.setAttribute('aria-selected', 'true');
                    applyCopyBtnState('enabled');
                    this.closest('.view-markup__content').classList.remove('view-markup--js-tab-showing');
                });
            });

            jsTab.forEach(function (item) {
                item.addEventListener('click', function () {
                    item.parentNode.querySelector('.view-markup__tabs-button--html').setAttribute('aria-selected', 'false');
                    item.setAttribute('aria-selected', 'true');
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
            modalEl.addEventListener('keydown', function (event) {
                if (event.key === 'Escape' && document.documentElement.classList.contains('js-view-markup-modal-showing')) {
                    modalHide();
                }
            });





            // -----------------------------------------------------------------------------
            // Settings dropdown functionality
            // -----------------------------------------------------------------------------

            const optionDropdownClass = 'view-markup__settings-dropdown--showing';

            // Settings dropdown
            settingsBtn.forEach(function (item, index) {
                item.addEventListener('click', function () {
                    const ariaExpandedAttr = this.getAttribute('aria-expanded');

                    this.setAttribute('aria-expanded', (ariaExpandedAttr === 'true') ? 'false' : 'true');
                    settingsDropdown[index].classList.toggle(optionDropdownClass);
                });
            });

            // Hide settings dropdown by clicking outside of it
            document.addEventListener('mousedown', function (event) {
                settingsDropdown.forEach(function (item, index) {
                    const isClickInside = item.contains(event.target);

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





            // -----------------------------------------------------------------------------
            // Functions
            // -----------------------------------------------------------------------------

            // Function properly assigns untouched DOM html modal
            function viewMarkupInitialize() {
                elHtmlClean.forEach(function (item, index) {
                    
                    // Assign modal button to correct html to view
                    const modalParent = viewMarkupEl[index].closest('.view-markup') || viewMarkupEl[index];
                    const modalBtnEL = modalParent.querySelector('.view-markup__modal-btn');

                    // Crack open the modal with the correct html in view
                    modalMapping(item, 2, modalBtnEL, null);
                });
                
                readyAdjustments();
            }

            // Cleanup and highlight markup
            function applyCleanHtml(html, spaces, btnEl, codeEl) {
                const tidyHTML = html_beautify(html, { indent_size: getCachedSpaceTab(), space_in_empty_paren: true });
                    
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
                        
                        const tidyJs = html_beautify(jsToTidy, { indent_size: getCachedSpaceTab(), space_in_empty_paren: true });
                        
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
                const tidyCode = html_beautify(code, { indent_size: spaceTabRadio, space_in_empty_paren: true });
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
                        const cleanTitle = btnEl.getAttribute('data-view-markup-title').replace(/^'(.*)'$/, '$1');
                        modalTitleEl.textContent = cleanTitle;
                    } else {
                        modalTitleEl.textContent = 'Viewing markup';
                    }
                    
                    // Add option backdrop rgb to modal back
                    if (btnEl.hasAttribute('data-view-markup-backdrop-rgb')) {
                        const rgbaVal = `rgba(${btnEl.getAttribute('data-view-markup-backdrop-rgb')}, .7)`;
                        modalEl.style.backgroundColor = rgbaVal;
                    } else {
                        modalEl.style.backgroundColor = '';
                    }
                });
            }

            // Apply copy button state
            function applyCopyBtnState(state) {
                const clickedButton = document.querySelectorAll('.view-markup__copy-btn:focus');
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
                let focusableElementsString =`
                    a[href],
                    area[href],
                    input,
                    select:not([disabled]),
                    textarea:not([tabindex="-1"]),
                    button:not([disabled]),
                    iframe,
                    object,
                    embed,
                    [tabindex="0"],
                    [contenteditable],
                    [role="button"]
                `;
                    
                let focusableElements = modalEl.querySelectorAll(focusableElementsString);
                
                // Convert NodeList to Array
                focusableElements = Array.prototype.slice.call(focusableElements);

                const firstTabStop = focusableElements[0];
                const lastTabStop = focusableElements[focusableElements.length - 1];
                
                // Set initial focus on the modal
                modalEl.focus();
                
                function trapTabKey(event) {
                    
                    // Check for TAB key press
                    if (event.keyCode === 9) {

                        // SHIFT + TAB
                        if (event.shiftKey) {
                            if (document.activeElement === firstTabStop) {
                                event.preventDefault();
                                lastTabStop.focus();
                            }

                        // TAB
                        } else {
                            if (document.activeElement === lastTabStop) {
                                event.preventDefault();
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
                focusedElementBeforeModal.focus();
            }

            // Go to previous/next view markup element
            function modalNavigate(el, direction) {
                let mapToModalBtnIndex;
                
                if (direction === 'prev') {
                    mapToModalBtnIndex = (parseInt(currentViewMarkupIndex) === 0) ? parseInt(elAmount) - 1 : parseInt(currentViewMarkupIndex) - 1;
                } else if (direction === 'next') {
                    mapToModalBtnIndex = (parseInt(currentViewMarkupIndex) === parseInt(elAmount) - 1) ? 0 : parseInt(currentViewMarkupIndex) + 1;
                }
                    
                const mapToModalBtnSelector = '[data-view-markup-nav-index="' + mapToModalBtnIndex + '"]';
                const mapToModalBtn = document.querySelector(mapToModalBtnSelector.toString());
                
                document.documentElement.classList.add('js-view-markup-modal-showing--navigating');
                
                mapToModalBtn.click();
                mapToModalBtn.focus();
                
                // Show corresponding tab if contained in one
                if (mapToModalBtn.closest('.view-markup-tabs__panel')) {
                    const tabParent = mapToModalBtn.closest('[data-view-markup-tabs]');
                    const tablistPanelId = mapToModalBtn.closest('.view-markup-tabs__panel').id;
                    
                    tabParent
                        .querySelector(`[aria-controls="${tablistPanelId}"]`)
                        .click();
                }
                
                setTimeout(function () {
                    document.documentElement.classList.remove('js-view-markup-modal-showing--navigating');
                }, 300);
            }

            // Modal navigation arrows
            function modalNavigation() {    
                
                // Add index to modal buttons for navigation
                const modalNavEl = document.querySelector('.view-markup__nav');
                const modalBtn = document.querySelectorAll('.view-markup__modal-btn');
                
                elAmount = modalBtn.length;
                
                modalBtn.forEach(function (item, index) {
                    item.setAttribute('data-view-markup-nav-index', index);
                });
                
                if (elAmount > 1) {

                    // Modal previous button
                    const modalPrevBtn = modalEl.querySelector('.view-markup__prev-btn');

                    // Modal next button
                    const modalNextBtn = modalEl.querySelector('.view-markup__next-btn');
                    
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
                
                if (param.modalNav === null) {
                
                    // Remove modal nav if no setting is found
                    modalNavEl.remove();
                }
            }



            // If dynamic position query param is set, do some stuff
            if (param.dynamicPos !== null) {
                window.addEventListener('ViewMarkupReady', () => {
                
                    // Create new div that will contain all modal buttons
                    const floatingButtonHolder = document.createElement('div');
                    floatingButtonHolder.classList.add('view-markup-dynamic-nav');
                    
                    if (param.dynamicPosZIndex !== null) {
                        floatingButtonHolder.style.zIndex = param.dynamicPosZIndex.toString();
                    }
                    
                    document.body.appendChild(floatingButtonHolder);
            
                    // Cache elements with modals
                    const withModalEl = document.querySelectorAll('[data-view-markup]:not([data-view-markup-render-in-page])');
                    
                    // Re-cache remaining buttons
                    const floatingModalBtn = document.querySelectorAll('.view-markup__modal-btn');
                    
                    // Dynamically position modal button next to associated element
                    function positionModalBtns(load) {
                        
                        // Add inline css to position button at the top left of the element
                        withModalEl.forEach( (item, i) => {
                            const btnElement = floatingModalBtn[i];
            
                            btnElement.style.top = (item.getBoundingClientRect().top + window.scrollY) + 'px';
                            btnElement.style.left = item.getBoundingClientRect().left + 'px';
            
                            if (load === 'load') {
                                floatingButtonHolder.appendChild(btnElement);
                            }
                        });
                    }
                    
                    // Remove un-needed highlight divs
                    const highlightElement = document.querySelectorAll('.view-markup__highlight');
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
                }, false);
            }


            // Make div with role=button act like an actual button for a11y reasons
            document.querySelectorAll('div[role="button"]').forEach((item) => {
                item.addEventListener('keydown', function (event) {
                    if (event.key === 'Enter' || event.code === 'Space') {
                        event.preventDefault();
                        this.click();
                    }
                });
            });
                




            
            /* -----------------------------------------------------------------------------
                EXPERIMENTAL WIP: prototype floating the buttons over the page instead of
                wrapping each element in a div and then positioning it inside that div. Not
                a fan of how much it currently modifies the DOM to get the modal button next
                to the associated element correctly

                TODOS:
                ✓ Allow for dynamic button positioning
                • Add "Skip to view markup modal navigation" skip link
                ✓ Add visual focus indicator to modal button when focus in the background
                when using modal navigation.
                ✓ Set smooth scrolling on the html,body when modal is active
                • Enhance preserve attribute functionality a bit. (allow for top and inner)
                ✓ Add tab view
            ----------------------------------------------------------------------------- */

            // Unwrap function
            function unwrap(wrapper) {
                const docFrag = document.createDocumentFragment();
                
                while (wrapper.firstChild) {
                    const child = wrapper.removeChild(wrapper.firstChild);
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





            // -----------------------------------------------------------------------------
            // Create tabs view of view markup elements inside a container
            // Based off https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tab_role
            // -----------------------------------------------------------------------------

            const viewMarkupTabsParent = document.querySelectorAll('[data-view-markup-tabs]');
    
            viewMarkupTabsParent.forEach((parent) => {
                parent.classList.add('view-markup-tabs');
                
                // Create tab nav element
                const tabNav = document.createElement('div');
                tabNav.classList.add('view-markup-tabs__nav');
                tabNav.setAttributes({
                    'role': 'tablist',
                    'aria-label': 'View markup tabs'
                });
                parent.prepend(tabNav);

                // Create tabs list element
                const tabsList = document.createElement('div');
                tabsList.classList.add('view-markup-tabs__tabs-list', 'view-markup-styled-scrollbar');
                tabNav.prepend(tabsList);
                
                // Create tab nav item element(s)
                const tabButton = document.createElement('div');
                tabButton.classList.add('view-markup-tabs__tab-button');
                
                // Get title(s) if any
                const vmEntry = parent.querySelectorAll('[data-view-markup]');
                
                // Setup tab list entry
                vmEntry.forEach((entry, index) => {
                    const tabButtonEntry = tabButton.cloneNode();
                    const entryTitleText = convertToParamString(entry.getAttribute('data-view-markup')).get('title');
                    const entryTitle = (entryTitleText !== null) ? entryTitleText : 'Tab Item ' + (index + 1);
                    const uniqueID = renderID(entryTitle);
                    
                    tabButtonEntry.setAttributes({
                        'aria-selected': (index === 0) ? 'true' : 'false',
                        'role': 'tab',
                        'tabindex': (index === 0) ? '0' : '-1',
                        'aria-controls': uniqueID,
                        'id': uniqueID + 'TabItem'
                    });

                    tabButtonEntry.innerHTML = entryTitle;
                    tabsList.appendChild(tabButtonEntry);
                });

                // Setup tab panel areas
                const vmPanel = parent.querySelectorAll('.view-markup');
                const tabButtonElement = parent.querySelectorAll('.view-markup-tabs__tab-button');
                
                vmPanel.forEach((panel, index) => {
                    panel.classList.add('view-markup-tabs__panel');
                    panel.setAttributes({
                        'role': 'tabpanel',
                        'tabindex': '0',
                        'aria-labelledby': tabButtonElement[index].getAttribute('id'),
                        'id': tabButtonElement[index].getAttribute('aria-controls')
                    });

                    if (index > 0) {
                        panel.setAttribute('hidden', 'true');
                    }
                });

                const tabs = parent.querySelectorAll('[role="tab"]');
                const tabList = parent.querySelector('[role="tablist"]');

                // Add a click event handler to each tab
                tabs.forEach((tab) => {
                    tab.addEventListener('click', changeTabs);
                });
                
                // Enable arrow navigation between tabs in the tab list
                let tabFocus = 0;
                
                tabList.addEventListener('keydown', (event) => {
                    
                    // Move right
                    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                        tabs[tabFocus].setAttribute('tabindex', '-1');
                        
                        if (event.key === 'ArrowRight') {
                            tabFocus++;
                            
                            // If we're at the end, go to the start
                            if (tabFocus >= tabs.length) {
                                tabFocus = 0;
                            }
                        
                        // Move left
                        } else if (event.key === 'ArrowLeft') {
                            tabFocus--;
                            
                            // If we're at the start, move to the end
                            if (tabFocus < 0) {
                                tabFocus = tabs.length - 1;
                            }
                        }

                        tabs[tabFocus].setAttribute('tabindex', '0');
                        tabs[tabFocus].focus();
                    }

                    if (event.key === 'Enter' || event.code === 'Space') {
                        event.preventDefault();
                        event.target.click();
                    }
                });

                // Create tab title and max-width option
                const tabslistParam = convertToParamString(parent.getAttribute('data-view-markup-tabs'));
                const tabsParams = {
                    title: tabslistParam.get('title'),
                    maxWidth: tabslistParam.get('max-width'),
                    background: tabslistParam.get('background'),
                    pillView: tabslistParam.get('pill-view'),
                    paddingX: tabslistParam.get('padding-x'),
                    class: tabslistParam.get('class'),
                    modalBtn: tabslistParam.get('modal-btn')
                }

                if (tabsParams.title !== null) {
                    const tabsTitle = document.createElement('div');
                    tabsTitle.classList.add('view-markup-tabs__title');
                    tabsTitle.innerHTML = tabsParams.title;
                    tabNav.prepend(tabsTitle);
                }

                if (tabsParams.maxWidth !== null) {
                    Object.assign(tabNav.style,{
                        maxWidth: tabsParams.maxWidth,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    });
                }
                
                if (tabsParams.paddingX !== null) {
                    Object.assign(tabNav.style,{
                        paddingLeft: tabsParams.paddingX,
                        paddingRight: tabsParams.paddingX,
                    });
                }

                if (tabsParams.background === 'false') {
                    parent.classList.add('view-markup-tabs--bg-none');
                }
                
                if (tabsParams.pillView !== null) {
                    parent.classList.add('view-markup-tabs--pill-view');
                }

                if (tabsParams.class !== null) {
                    const classes = tabsParams.class.replace(/,\s|,/g, ' ').split(' ');
                    classes.forEach((classItem) => {
                        tabNav.classList.add(classItem);
                    });
                }

                if (tabsParams.modalBtn !== null) {
                    parent.classList.add('view-markup-tabs--show-modal-btn');

                    // Create view markup button which controls the visible tab panel element
                    const tabViewModalBtnSep = document.createElement('span');
                    tabViewModalBtnSep.classList.add('view-markup-tabs__sep');
                    tabNav.appendChild(tabViewModalBtnSep);

                    const tabViewModalBtn = document.createElement('div');
                    tabViewModalBtn.classList.add('view-markup-tabs__modal-btn');
                    tabViewModalBtn.innerHTML = '<span class="view-markup__modal-btn-text">View markup</span>';
                    tabViewModalBtn.setAttributes({
                        'role': 'button',
                        'tabindex': '0'
                    });
                    tabNav.appendChild(tabViewModalBtn);
    
                    tabViewModalBtn.addEventListener('click', function () {
                        parent.querySelector('.view-markup-tabs__panel:not([hidden]) .view-markup__modal-btn').click();
                    });
    
                    tabViewModalBtn.addEventListener('keydown', function (event) {
                        if (event.key === 'Enter' || event.code === 'Space') {
                            parent.querySelector('.view-markup-tabs__panel:not([hidden]) .view-markup__modal-btn').click();
                        }
                    });
                }
            });

            // Display and scrollto tablist item if hash is available
            const urlHash = window.location.hash;
            if (urlHash !== '') {
                const urlIDElement = document.querySelector(`${urlHash}`);
                if (urlIDElement && urlIDElement.closest('[data-view-markup-tabs]')) {
                    const associatedTab = document.querySelector('[aria-controls="' + urlHash.replace('#', '') +'"]')
                    
                    // Click associated tab
                    associatedTab.click();

                    // Scroll into view
                    associatedTab.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }

            function changeTabs(event) {
                const target = event.target;
                const parent = target.closest('.view-markup-tabs__nav');
                const grandparent = parent.closest('.view-markup-tabs');

                // Remove all current selected tabs
                parent
                    .querySelectorAll('[aria-selected="true"]')
                    .forEach((tab) => tab.setAttribute('aria-selected', 'false'));

                // Set this tab as selected
                target.setAttribute('aria-selected', 'true');

                // Hide all tab panels
                grandparent
                    .querySelectorAll('[role="tabpanel"]')
                    .forEach((panel) => panel.setAttribute('hidden', true));

                // Show the selected panel
                grandparent.parentNode
                    .querySelector(`#${target.getAttribute('aria-controls')}`)
                    .removeAttribute('hidden');

                event.target.focus();
            }

            function camelize(str) {
                return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
                if (+match === 0) return "";
                    return index === 0 ? match.toLowerCase() : match.toUpperCase();
                });
            }

            function renderID(str) {
                return camelize(str.replace(/[^a-z0-9]/gi, ' '));
            }

            function convertToParamString(str) {
                const stringCleanup = str.replace(/;\s|;/g, '&').replace(/:\s|:/g, '=');
                const optionParam = new URLSearchParams(stringCleanup);
                return optionParam;
            }






            // -----------------------------------------------------------------------------
            // Draggable modal
            // -----------------------------------------------------------------------------

            if (param.dragModal !== null) {
                Element.prototype.dragElement = function (dragTarget) {
                    const el = this;
                    el.style.position = 'absolute';
                    
                    let position = {
                        one: 0,
                        two: 0,
                        three: 0,
                        four: 0
                    };
                    
                    if (el.querySelector(dragTarget)) {
                        
                        // If present, the header is where you move the DIV from:
                        el.querySelector(dragTarget).onmousedown = dragOnMouseDown;
                    } else {
                        
                        // Otherwise, move the DIV from anywhere inside the DIV:
                        el.onmousedown = dragOnMouseDown;
                    }
    
                    function dragOnMouseDown(event) {
                        event = event || window.event;
                        event.preventDefault();
                        
                        // Get the mouse cursor position at startup:
                        position.three = event.clientX;
                        position.four = event.clientY;
                        document.onmouseup = endDragElement;
                        
                        // Call a function whenever the cursor moves:
                        document.onmousemove = elementDrag;
                    }
    
                    function elementDrag(event) {
                        event = event || window.event;
                        event.preventDefault();
                        
                        // Calculate the new cursor position:
                        position.one = position.three - event.clientX;
                        position.two = position.four - event.clientY;
                        position.three = event.clientX;
                        position.four = event.clientY;
                        
                        // Set the element's new position:
                        el.style.top = `${(el.offsetTop - position.two)}px`;
                        el.style.left = `${(el.offsetLeft - position.one)}px`;
                    }
    
                    function endDragElement() {
                        
                        // Stop moving when mouse button is released:
                        document.onmouseup = null;
                        document.onmousemove = null;
                    }
                }
                
                const modalContentDragEl = document.querySelector('.view-markup-modal .view-markup__content');
                modalContentDragEl.dragElement('.view-markup__header');
            }
        }
    });
}

window.addEventListener('DOMContentLoaded', viewMarkup);