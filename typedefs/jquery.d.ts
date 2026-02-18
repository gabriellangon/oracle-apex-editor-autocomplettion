/**
 * jQuery Type Definitions (Slim, for APEX Monaco Autocomplete)
 * Provides autocomplete for jQuery used in Oracle APEX.
 * Covers: selectors, DOM manipulation, events, Ajax, effects, utilities.
 */

interface JQueryEventObject extends Event {
    data: any;
    delegateTarget: Element;
    currentTarget: Element;
    relatedTarget: Element;
    result: any;
    which: number;
    namespace: string;
    pageX: number;
    pageY: number;
    isDefaultPrevented(): boolean;
    isPropagationStopped(): boolean;
    isImmediatePropagationStopped(): boolean;
    preventDefault(): void;
    stopPropagation(): void;
    stopImmediatePropagation(): void;
}

interface JQueryPromise<T> {
    then<U>(
        onFulfill?: (value: T) => U | JQueryPromise<U>,
        onReject?: (...reasons: any[]) => any
    ): JQueryPromise<U>;
    done(...callbacks: Array<(value: T) => any>): JQueryPromise<T>;
    fail(...callbacks: Array<(...reasons: any[]) => any>): JQueryPromise<T>;
    always(...callbacks: Array<() => any>): JQueryPromise<T>;
    progress(...callbacks: Array<(...args: any[]) => any>): JQueryPromise<T>;
}

interface JQueryDeferred<T> extends JQueryPromise<T> {
    resolve(value?: T): JQueryDeferred<T>;
    reject(...args: any[]): JQueryDeferred<T>;
    notify(...args: any[]): JQueryDeferred<T>;
    promise(): JQueryPromise<T>;
}

interface JQueryAjaxSettings {
    url?: string;
    type?: string;
    method?: string;
    data?: any;
    dataType?: string;
    contentType?: string | boolean;
    async?: boolean;
    cache?: boolean;
    timeout?: number;
    headers?: { [key: string]: string };
    beforeSend?: (jqXHR: JQueryXHR, settings: JQueryAjaxSettings) => void | boolean;
    success?: (data: any, textStatus: string, jqXHR: JQueryXHR) => void;
    error?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => void;
    complete?: (jqXHR: JQueryXHR, textStatus: string) => void;
    processData?: boolean;
    traditional?: boolean;
    crossDomain?: boolean;
    global?: boolean;
}

interface JQueryXHR extends JQueryPromise<any> {
    status: number;
    statusText: string;
    readyState: number;
    responseText: string;
    responseJSON: any;
    responseXML: Document;
    abort(statusText?: string): void;
    getAllResponseHeaders(): string;
    getResponseHeader(header: string): string | null;
    setRequestHeader(name: string, value: string): void;
    overrideMimeType(mimeType: string): void;
    statusCode(map: { [code: number]: () => void }): JQueryXHR;
}

interface JQuery {
    // ── Core ─────────────────────────────────
    length: number;
    [index: number]: HTMLElement;

    /** Execute a function for each matched element. */
    each(callback: (index: number, element: HTMLElement) => void | boolean): JQuery;
    /** Return a new jQuery object with elements filtered by a selector or function. */
    filter(selector: string | ((index: number, element: HTMLElement) => boolean)): JQuery;
    /** Get the descendants of each element, filtered by a selector. */
    find(selector: string): JQuery;
    /** Return the first matched element. */
    first(): JQuery;
    /** Return the last matched element. */
    last(): JQuery;
    /** Check if any matched element matches the selector. */
    is(selector: string): boolean;
    /** Check if the collection has elements matching the selector. */
    has(selector: string | HTMLElement): JQuery;
    /** Reduce to the element at the given index. */
    eq(index: number): JQuery;
    /** Get the index of a matched element. */
    index(selector?: string | HTMLElement | JQuery): number;
    /** Get the underlying DOM element at the given index. */
    get(index: number): HTMLElement;
    /** Get all underlying DOM elements as an array. */
    get(): HTMLElement[];
    /** Convert to an array of DOM elements. */
    toArray(): HTMLElement[];
    /** Add elements to the matched set. */
    add(selector: string | HTMLElement | JQuery): JQuery;
    /** End the most recent filtering operation. */
    end(): JQuery;
    /** Return a new jQuery object from a subset of matched elements. */
    slice(start: number, end?: number): JQuery;
    /** Map each element to a new value. */
    map(callback: (index: number, element: HTMLElement) => any): JQuery;
    /** Reduce to elements NOT matching the selector. */
    not(selector: string | HTMLElement | JQuery | ((index: number, element: HTMLElement) => boolean)): JQuery;

    // ── Traversal ────────────────────────────
    /** Get the parent of each element. */
    parent(selector?: string): JQuery;
    /** Get the ancestors of each element, optionally filtered by a selector. */
    parents(selector?: string): JQuery;
    /** Get the ancestors up to (but not including) the element matched by the selector. */
    parentsUntil(selector?: string, filter?: string): JQuery;
    /** Get the children of each element, optionally filtered by a selector. */
    children(selector?: string): JQuery;
    /** Get the siblings of each element. */
    siblings(selector?: string): JQuery;
    /** Get the immediately following sibling. */
    next(selector?: string): JQuery;
    /** Get all following siblings. */
    nextAll(selector?: string): JQuery;
    /** Get the immediately preceding sibling. */
    prev(selector?: string): JQuery;
    /** Get all preceding siblings. */
    prevAll(selector?: string): JQuery;
    /** Get the closest ancestor matching a selector. */
    closest(selector: string, context?: HTMLElement): JQuery;
    /** Get all descendant text nodes and elements. */
    contents(): JQuery;

    // ── Manipulation ─────────────────────────
    /** Get or set the inner HTML of the first matched element. */
    html(): string;
    html(htmlString: string): JQuery;
    /** Get or set the text content of all matched elements. */
    text(): string;
    text(text: string | number | boolean): JQuery;
    /** Get or set the value of form elements. */
    val(): string | number | string[] | undefined;
    val(value: string | number | string[]): JQuery;
    /** Get or set an attribute. */
    attr(name: string): string | undefined;
    attr(name: string, value: string | number | null): JQuery;
    attr(attributes: { [key: string]: string | number | null }): JQuery;
    /** Remove an attribute. */
    removeAttr(name: string): JQuery;
    /** Get or set a property. */
    prop(name: string): any;
    prop(name: string, value: any): JQuery;
    prop(properties: { [key: string]: any }): JQuery;
    /** Remove a property. */
    removeProp(name: string): JQuery;
    /** Get or set a data attribute. */
    data(key: string): any;
    data(key: string, value: any): JQuery;
    data(): { [key: string]: any };
    /** Remove a data attribute. */
    removeData(name?: string | string[]): JQuery;
    /** Insert content at the end of each matched element. */
    append(...content: Array<string | HTMLElement | JQuery>): JQuery;
    /** Insert content at the beginning of each matched element. */
    prepend(...content: Array<string | HTMLElement | JQuery>): JQuery;
    /** Insert content after each matched element. */
    after(...content: Array<string | HTMLElement | JQuery>): JQuery;
    /** Insert content before each matched element. */
    before(...content: Array<string | HTMLElement | JQuery>): JQuery;
    /** Insert the matched elements at the end of the target. */
    appendTo(target: string | HTMLElement | JQuery): JQuery;
    /** Insert the matched elements at the beginning of the target. */
    prependTo(target: string | HTMLElement | JQuery): JQuery;
    /** Insert matched elements after the target. */
    insertAfter(target: string | HTMLElement | JQuery): JQuery;
    /** Insert matched elements before the target. */
    insertBefore(target: string | HTMLElement | JQuery): JQuery;
    /** Wrap each element in a structure. */
    wrap(wrappingElement: string | HTMLElement | JQuery | ((index: number) => string)): JQuery;
    /** Wrap the inner contents of each element. */
    wrapInner(wrappingElement: string | HTMLElement | JQuery | ((index: number) => string)): JQuery;
    /** Wrap all matched elements in a single structure. */
    wrapAll(wrappingElement: string | HTMLElement | JQuery): JQuery;
    /** Remove the parents of matched elements, keeping the element itself. */
    unwrap(selector?: string): JQuery;
    /** Remove matched elements from the DOM. */
    remove(selector?: string): JQuery;
    /** Detach matched elements (keeps data and events). */
    detach(selector?: string): JQuery;
    /** Remove all child nodes from matched elements. */
    empty(): JQuery;
    /** Create a deep copy of matched elements. */
    clone(withDataAndEvents?: boolean, deepWithDataAndEvents?: boolean): JQuery;
    /** Replace each matched element with the provided content. */
    replaceWith(newContent: string | HTMLElement | JQuery | (() => string | HTMLElement | JQuery)): JQuery;
    /** Replace the target with the matched elements. */
    replaceAll(target: string | HTMLElement | JQuery): JQuery;

    // ── CSS & Dimensions ─────────────────────
    /** Get or set CSS properties. */
    css(propertyName: string): string;
    css(propertyName: string, value: string | number): JQuery;
    css(properties: { [key: string]: string | number }): JQuery;
    /** Add one or more CSS classes. */
    addClass(className: string | ((index: number, currentClass: string) => string)): JQuery;
    /** Remove one or more CSS classes. */
    removeClass(className?: string | ((index: number, currentClass: string) => string)): JQuery;
    /** Toggle one or more CSS classes. */
    toggleClass(className: string | ((index: number, currentClass: string, state: boolean) => string), state?: boolean): JQuery;
    /** Check if any element has the given class. */
    hasClass(className: string): boolean;
    /** Get the width of the first element. */
    width(): number;
    width(value: number | string): JQuery;
    /** Get the height of the first element. */
    height(): number;
    height(value: number | string): JQuery;
    /** Get the inner width (includes padding). */
    innerWidth(): number;
    /** Get the inner height (includes padding). */
    innerHeight(): number;
    /** Get the outer width (includes padding and border, optionally margin). */
    outerWidth(includeMargin?: boolean): number;
    /** Get the outer height (includes padding and border, optionally margin). */
    outerHeight(includeMargin?: boolean): number;
    /** Get or set the scroll left offset. */
    scrollLeft(): number;
    scrollLeft(value: number): JQuery;
    /** Get or set the scroll top offset. */
    scrollTop(): number;
    scrollTop(value: number): JQuery;
    /** Get the current coordinates of the first element relative to the document. */
    offset(): { top: number; left: number };
    offset(coordinates: { top: number; left: number }): JQuery;
    /** Get the current coordinates of the first element relative to the offset parent. */
    position(): { top: number; left: number };

    // ── Events ───────────────────────────────
    /** Attach an event handler. */
    on(events: string, handler: (event: JQueryEventObject, ...args: any[]) => void): JQuery;
    on(events: string, selector: string, handler: (event: JQueryEventObject, ...args: any[]) => void): JQuery;
    on(events: string, selector: string, data: any, handler: (event: JQueryEventObject, ...args: any[]) => void): JQuery;
    on(events: { [event: string]: (event: JQueryEventObject, ...args: any[]) => void }, selector?: string): JQuery;
    /** Remove an event handler. */
    off(events?: string, handler?: (event: JQueryEventObject) => void): JQuery;
    off(events: string, selector: string, handler?: (event: JQueryEventObject) => void): JQuery;
    /** Attach a handler that fires at most once. */
    one(events: string, handler: (event: JQueryEventObject, ...args: any[]) => void): JQuery;
    one(events: string, selector: string, handler: (event: JQueryEventObject, ...args: any[]) => void): JQuery;
    /** Trigger an event on matched elements. */
    trigger(eventType: string | JQueryEventObject, extraParameters?: any): JQuery;
    /** Trigger handlers without firing the native event. */
    triggerHandler(eventType: string, extraParameters?: any): any;
    /** Shorthand event methods. */
    click(handler?: (event: JQueryEventObject) => void): JQuery;
    dblclick(handler?: (event: JQueryEventObject) => void): JQuery;
    mousedown(handler?: (event: JQueryEventObject) => void): JQuery;
    mouseup(handler?: (event: JQueryEventObject) => void): JQuery;
    mousemove(handler?: (event: JQueryEventObject) => void): JQuery;
    mouseenter(handler?: (event: JQueryEventObject) => void): JQuery;
    mouseleave(handler?: (event: JQueryEventObject) => void): JQuery;
    mouseover(handler?: (event: JQueryEventObject) => void): JQuery;
    mouseout(handler?: (event: JQueryEventObject) => void): JQuery;
    hover(handlerIn: (event: JQueryEventObject) => void, handlerOut?: (event: JQueryEventObject) => void): JQuery;
    keydown(handler?: (event: JQueryEventObject) => void): JQuery;
    keyup(handler?: (event: JQueryEventObject) => void): JQuery;
    keypress(handler?: (event: JQueryEventObject) => void): JQuery;
    focus(handler?: (event: JQueryEventObject) => void): JQuery;
    blur(handler?: (event: JQueryEventObject) => void): JQuery;
    change(handler?: (event: JQueryEventObject) => void): JQuery;
    submit(handler?: (event: JQueryEventObject) => void): JQuery;
    scroll(handler?: (event: JQueryEventObject) => void): JQuery;
    resize(handler?: (event: JQueryEventObject) => void): JQuery;
    select(handler?: (event: JQueryEventObject) => void): JQuery;

    // ── Effects / Animation ──────────────────
    /** Show matched elements. */
    show(duration?: number | string, complete?: () => void): JQuery;
    /** Hide matched elements. */
    hide(duration?: number | string, complete?: () => void): JQuery;
    /** Toggle visibility of matched elements. */
    toggle(duration?: number | string, complete?: () => void): JQuery;
    toggle(showOrHide: boolean): JQuery;
    /** Fade in matched elements. */
    fadeIn(duration?: number | string, complete?: () => void): JQuery;
    /** Fade out matched elements. */
    fadeOut(duration?: number | string, complete?: () => void): JQuery;
    /** Fade to a specific opacity. */
    fadeTo(duration: number | string, opacity: number, complete?: () => void): JQuery;
    /** Toggle fading. */
    fadeToggle(duration?: number | string, easing?: string, complete?: () => void): JQuery;
    /** Slide down matched elements. */
    slideDown(duration?: number | string, complete?: () => void): JQuery;
    /** Slide up matched elements. */
    slideUp(duration?: number | string, complete?: () => void): JQuery;
    /** Toggle sliding. */
    slideToggle(duration?: number | string, complete?: () => void): JQuery;
    /** Perform a custom animation. */
    animate(properties: { [key: string]: any }, duration?: number | string, easing?: string, complete?: () => void): JQuery;
    animate(properties: { [key: string]: any }, options: { duration?: number | string; easing?: string; complete?: () => void; queue?: boolean | string; step?: (now: number, fx: any) => void }): JQuery;
    /** Stop running animations. */
    stop(clearQueue?: boolean, jumpToEnd?: boolean): JQuery;
    /** Set a timer to delay subsequent actions in the queue. */
    delay(duration: number, queueName?: string): JQuery;
    /** Execute the next function in the queue. */
    dequeue(queueName?: string): JQuery;
    /** Show or manipulate the queue of functions on matched elements. */
    queue(queueName?: string): any[];
    queue(queueName: string, newQueue: any[]): JQuery;
    queue(callback: (next: () => void) => void): JQuery;
    /** Clear the queue. */
    clearQueue(queueName?: string): JQuery;
    /** Return a promise resolved when all animations on matched elements complete. */
    promise(type?: string, target?: any): JQueryPromise<JQuery>;

    // ── Utilities on jQuery object ───────────
    /** Serialize form elements into a query string. */
    serialize(): string;
    /** Serialize form elements as an array of name/value objects. */
    serializeArray(): Array<{ name: string; value: string }>;
}

interface JQueryStatic {
    /** Select elements by CSS selector. */
    (selector: string, context?: HTMLElement | Document | JQuery): JQuery;
    /** Wrap a DOM element or array of elements. */
    (element: HTMLElement | HTMLElement[] | Document | Window): JQuery;
    /** Create elements from an HTML string. */
    (html: string): JQuery;
    /** Execute a function when the DOM is ready. */
    (callback: () => void): JQuery;

    // ── Ajax ─────────────────────────────────
    /** Perform an asynchronous HTTP request. */
    ajax(settings: JQueryAjaxSettings): JQueryXHR;
    ajax(url: string, settings?: JQueryAjaxSettings): JQueryXHR;
    /** Load data from the server using GET. */
    get(url: string, data?: any, success?: (data: any, textStatus: string, jqXHR: JQueryXHR) => void, dataType?: string): JQueryXHR;
    /** Load JSON using GET. */
    getJSON(url: string, data?: any, success?: (data: any, textStatus: string, jqXHR: JQueryXHR) => void): JQueryXHR;
    /** Load a script using GET. */
    getScript(url: string, success?: (script: string, textStatus: string, jqXHR: JQueryXHR) => void): JQueryXHR;
    /** Send data to the server using POST. */
    post(url: string, data?: any, success?: (data: any, textStatus: string, jqXHR: JQueryXHR) => void, dataType?: string): JQueryXHR;
    /** Set default Ajax settings. */
    ajaxSetup(options: JQueryAjaxSettings): void;
    /** Serialize an array of form elements or an object into a URL-encoded string. */
    param(obj: any, traditional?: boolean): string;

    // ── Utilities ────────────────────────────
    /** Merge the contents of two or more objects. */
    extend(target: any, ...objects: any[]): any;
    extend(deep: boolean, target: any, ...objects: any[]): any;
    /** Check if a value is an array. */
    isArray(obj: any): obj is any[];
    /** Check if an object is a function. */
    isFunction(obj: any): obj is Function;
    /** Check if an object is a plain object (created by {} or new Object). */
    isPlainObject(obj: any): boolean;
    /** Check if an object is empty. */
    isEmptyObject(obj: any): boolean;
    /** Check if a value is numeric. */
    isNumeric(value: any): boolean;
    /** Check if an object is window. */
    isWindow(obj: any): boolean;
    /** Determine the type of an object. */
    type(obj: any): string;
    /** Iterate over an array or object. */
    each<T>(collection: T[] | { [key: string]: T }, callback: (indexOrKey: number | string, value: T) => void | boolean): any;
    /** Translate items of an array or object to a new array. */
    map<T, U>(array: T[], callback: (value: T, index: number) => U): U[];
    /** Search for a value in an array. */
    inArray<T>(value: T, array: T[], fromIndex?: number): number;
    /** Merge the contents of two arrays. */
    merge<T>(first: T[], second: T[]): T[];
    /** Search for an element in an array and return an array of matches. */
    grep<T>(array: T[], callback: (element: T, index: number) => boolean, invert?: boolean): T[];
    /** Remove whitespace from the beginning and end of a string. */
    trim(str: string): string;
    /** Convert a dashed string to camelCase. */
    camelCase(str: string): string;
    /** No-operation function. */
    noop(): void;
    /** Return a function that always returns the same value. */
    proxy(fn: Function, context: any): Function;
    proxy(context: any, name: string): Function;
    /** Parse a JSON string. */
    parseJSON(json: string): any;
    /** Parse an XML string. */
    parseXML(data: string): XMLDocument;
    /** Parse an HTML string into DOM nodes. */
    parseHTML(data: string, context?: Document, keepScripts?: boolean): HTMLElement[];
    /** Check if a DOM node contains another. */
    contains(container: HTMLElement, contained: HTMLElement): boolean;
    /** Return an array of unique elements. */
    unique(array: HTMLElement[]): HTMLElement[];
    /** Execute callbacks when all passed Deferreds resolve. */
    when<T>(...deferreds: Array<JQueryPromise<T> | T>): JQueryPromise<T>;
    /** Create a Deferred object. */
    Deferred<T>(beforeStart?: (deferred: JQueryDeferred<T>) => void): JQueryDeferred<T>;
    /** Add a callback to run when all DOM is ready. */
    holdReady(hold: boolean): void;

    // ── Data ─────────────────────────────────
    /** Store or retrieve data on a DOM element. */
    data(element: HTMLElement, key: string, value?: any): any;
    /** Remove data from a DOM element. */
    removeData(element: HTMLElement, name?: string): void;
    /** Check if an element has data. */
    hasData(element: HTMLElement): boolean;
}

/** The jQuery function. Use this to select and manipulate DOM elements. */
declare var $: JQueryStatic;
/** The jQuery function (full name). */
declare var jQuery: JQueryStatic;
