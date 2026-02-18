/**
 * Oracle APEX JavaScript API Type Definitions
 * Provides autocomplete for the apex.* namespace used in APEX applications.
 * Based on: https://docs.oracle.com/en/database/oracle/apex/24.2/aexjs/
 */

// ── apex.env ──────────────────────────────────

interface ApexEnv {
    /** The current username. */
    APP_USER: string;
    /** The application ID. */
    APP_ID: string;
    /** The current page ID. */
    APP_PAGE_ID: string;
    /** The session ID. */
    APP_SESSION: string;
    /** The relative path of the application static files. */
    APP_FILES: string;
    /** The relative path of the workspace static files. */
    WORKSPACE_FILES: string;
    /** The relative path of the files distributed with Oracle APEX. */
    APEX_FILES: string;
    /** The full version of the Oracle APEX instance. */
    APEX_VERSION: string;
    /** The base version of the Oracle APEX instance. */
    APEX_BASE_VERSION: string;
}

// ── apex.item interface ───────────────────────

interface ApexItemInterface {
    /** Get the current value of the item. */
    getValue(): string;
    /** Set the value of the item. */
    setValue(value: string, displayValue?: string, suppressChangeEvent?: boolean): void;
    /** Return the jQuery object for the item's element. */
    node: HTMLElement;
    /** Return the jQuery object for the item's element. */
    element: JQuery;
    /** Check if the item is empty. */
    isEmpty(): boolean;
    /** Check if the item value has changed. */
    isChanged(): boolean;
    /** Check if the item is disabled. */
    isDisabled(): boolean;
    /** Enable the item. */
    enable(): void;
    /** Disable the item. */
    disable(): void;
    /** Show the item. */
    show(showRow?: boolean): void;
    /** Hide the item. */
    hide(hideRow?: boolean): void;
    /** Set focus on the item. */
    setFocus(): void;
    /** Set a style on the item. */
    setStyle(propertyName: string, propertyValue: string): void;
    /** Get the display value. */
    displayValueFor(value?: string): string;
    /** Get the item's validity. */
    getValidity(): { valid: boolean };
    /** Get the validation message. */
    getValidationMessage(): string;
    /** Get the item id. */
    id: string;
    /** Add a CSS class to the item. */
    addCssClass(className: string): void;
    /** Remove a CSS class from the item. */
    removeCssClass(className: string): void;
    /** Reinitialize the item after DOM changes. */
    reinit(value?: string, displayValue?: string): void;
    /** Refresh the item. */
    refresh(): void;
    /** Set items required. */
    setRequired(required: boolean): void;
    /** Check if this item is required. */
    isRequired(): boolean;
}

// ── apex.region interface ─────────────────────

interface ApexRegionInterface {
    /** The region element jQuery object. */
    element: JQuery;
    /** The region's static ID or internal ID. */
    type: string;
    /** Refresh the region. */
    refresh(): void;
    /** Focus the region. */
    focus(): void;
    /** Get the widget associated with this region (e.g., Interactive Grid). */
    widget(): JQuery;
    /** Call a method on the region's widget. */
    call(method: string, ...args: any[]): any;
    /** Alternative region ID. */
    parentRegionId: string | null;
}

// ── apex.server ───────────────────────────────

interface ApexServerProcessOptions {
    /** Page items to send to the server. Either a comma-delimited string or a jQuery selector. */
    pageItems?: string | string[];
    /** Additional data to send in the request. */
    x01?: string;
    x02?: string;
    x03?: string;
    x04?: string;
    x05?: string;
    x06?: string;
    x07?: string;
    x08?: string;
    x09?: string;
    x10?: string;
    /** An array to pass via f01..f20 arrays. */
    f01?: string[];
    f02?: string[];
    /** Scalar value for the process. */
    scalar?: string;
    /** The data type expected from the server. */
    dataType?: string;
    /** Extra data to include in the request. */
    data?: any;
    /** If true, a wait indicator is shown. */
    loadingIndicator?: string | JQuery | ((pLoadingIndicator: JQuery) => (() => void));
    /** Position for the loading indicator. */
    loadingIndicatorPosition?: string;
    /** If true, the request is synchronous (deprecated). */
    async?: boolean;
    /** Whether to clear errors before making the request. */
    clear?: (() => void);
    /** Success callback. */
    success?: (data: any, textStatus?: string) => void;
    /** Error callback. */
    error?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => void;
    /** Target element for the refresh. */
    refreshObject?: string | JQuery;
    /** Additional data for the APEX AJAX call. */
    queue?: { name: string; action: string };
}

interface ApexServer {
    /**
     * Call an on-demand PL/SQL process (Application Process or AJAX Callback).
     * @param pName The process name.
     * @param pData Options including pageItems, x01..x10, etc.
     * @param pOptions Additional jQuery.ajax settings.
     * @returns A jQuery promise.
     */
    process(pName: string, pData?: ApexServerProcessOptions, pOptions?: JQueryAjaxSettings): JQueryPromise<any>;

    /**
     * Call a plug-in AJAX callback.
     * @param pAjaxIdentifier The plug-in's AJAX identifier.
     * @param pData Options including pageItems, x01..x10, etc.
     * @param pOptions Additional jQuery.ajax settings.
     * @returns A jQuery promise.
     */
    plugin(pAjaxIdentifier: string, pData?: ApexServerProcessOptions, pOptions?: JQueryAjaxSettings): JQueryPromise<any>;

    /**
     * Return a URL for the plug-in AJAX callback.
     * @param pAjaxIdentifier The plug-in's AJAX identifier.
     * @returns The URL string.
     */
    pluginUrl(pAjaxIdentifier: string): string;

    /**
     * Return the APEX AJAX URL for the current page.
     * @param pOptions URL options.
     * @returns The URL string.
     */
    url(pOptions?: { path?: string; regions?: string; pageItems?: string }): string;

    /**
     * Load a JavaScript file.
     * @param pOptions Object with path, requirejs, global properties.
     * @param callback Function to run after script loads.
     */
    loadScript(pOptions: { path: string; requirejs?: boolean; global?: string }, callback?: () => void): any;

    /**
     * Break a large string into chunks of 8000 chars.
     * @param text The string to chunk.
     * @returns The original string if < 8000 chars, or an array of chunks.
     */
    chunk(text: string): string | string[];
}

// ── apex.page ─────────────────────────────────

interface ApexPageSubmitOptions {
    /** The REQUEST value. */
    request?: string;
    /** An object of item names/values to set before submit. */
    set?: { [itemName: string]: string };
    /** If true, shows a wait spinner. */
    showWait?: boolean;
    /** If true, only submits if no errors. */
    submitIfEnter?: boolean;
    /** If true, ignores change check. */
    reloadOnSubmit?: string;
    /** If true, validates before submitting. */
    validate?: boolean;
}

interface ApexPage {
    /**
     * Submit the current page.
     * @param pOptions Submit options or a request string.
     */
    submit(pOptions?: string | ApexPageSubmitOptions): void;

    /**
     * Show a confirmation dialog then submit.
     * @param pMessage The confirmation message.
     * @param pOptions Submit options or a request string.
     */
    confirm(pMessage?: string, pOptions?: string | ApexPageSubmitOptions): void;

    /**
     * Validate the page.
     * @returns True if the page is valid.
     */
    validate(): boolean;

    /**
     * Check if the page has unsaved changes.
     * @returns True if changed.
     */
    isChanged(): boolean;

    /**
     * Set up a handler to warn on unsaved changes when leaving the page.
     */
    warnOnUnsavedChanges(): void;

    /**
     * Cancel the warn on unsaved changes behavior.
     */
    cancelWarnOnUnsavedChanges(): void;
}

// ── apex.navigation ───────────────────────────

interface ApexNavigationDialog {
    /**
     * Open a page as a modal dialog.
     * @param pUrl The URL to open.
     * @param pOptions Dialog options.
     * @param pCssClasses Additional CSS classes for the dialog.
     * @param pTriggeringElement The element that triggered the dialog.
     */
    (pUrl: string, pOptions?: { title?: string; height?: number; width?: number; maxWidth?: number; modal?: boolean; resizable?: boolean; draggable?: boolean; close?: () => void }, pCssClasses?: string, pTriggeringElement?: HTMLElement | JQuery): void;

    /**
     * Close the current dialog and optionally pass data back to parent.
     * @param pIsModal True if this is a modal dialog.
     * @param pItems Items to pass back.
     * @param pValues Values for those items.
     */
    close(pIsModal: boolean, pItems?: string[], pValues?: string[]): void;

    /**
     * Close the current dialog and cancel.
     * @param pIsModal True if this is a modal dialog.
     */
    cancel(pIsModal: boolean): void;
}

interface ApexNavigation {
    /**
     * Redirect to a URL.
     * @param pUrl The URL to redirect to.
     */
    redirect(pUrl: string): void;

    /**
     * Open a URL in a new window or popup dialog.
     * @param pUrl The URL to open.
     * @param pWindowName Name for the window.
     * @param pOptions Window features string (e.g., "width=800,height=600").
     */
    popup(pUrl: string, pWindowName?: string, pOptions?: string): Window | null;

    /**
     * Dialog management. Use as a function to open a dialog, or access sub-methods.
     */
    dialog: ApexNavigationDialog;

    /**
     * Open a URL in a new window/tab.
     * @param pTarget Target URL or page info.
     */
    openInNewWindow(pTarget: string): void;
}

// ── apex.util ─────────────────────────────────

interface ApexUtil {
    /**
     * Show a wait spinner.
     * @param pContainer The element to show the spinner in.
     * @param pOptions Spinner options.
     * @returns A function to remove the spinner.
     */
    showSpinner(pContainer?: string | HTMLElement | JQuery, pOptions?: { alert?: string; spinnerClass?: string; fixed?: boolean }): JQuery;

    /**
     * Get a URL for a page number.
     * @param pPageNumber The page number.
     * @returns The URL string.
     */
    getTopApex(): any;

    /**
     * Apply a template string, substituting placeholders with values.
     * @param pTemplate The template string with placeholders like #COLUMN_NAME#.
     * @param pOptions Object with substitution values.
     * @returns The substituted string.
     */
    applyTemplate(pTemplate: string, pOptions?: { defaultEscapeFilter?: string; placeholders?: { [key: string]: string | (() => string) }; directives?: { [key: string]: (params: string) => string }; extraSubstitutions?: { [key: string]: string }; includePageItems?: boolean }): string;

    /**
     * Escape HTML special characters (&, <, >, ", ').
     * @param pValue The string to escape.
     * @returns The escaped string.
     */
    escapeHTML(pValue: string): string;

    /**
     * Escape CSS selector special characters.
     * @param pValue The string to escape.
     * @returns The escaped string.
     */
    escapeCSS(pValue: string): string;

    /**
     * Escape characters for safe use inside an attribute selector.
     * @param pValue The string to escape.
     */
    escapeAttr(pValue: string): string;

    /**
     * Strip HTML tags from a string.
     * @param pValue The string containing HTML.
     * @returns The text content.
     */
    stripHTML(pValue: string): string;

    /**
     * Get a formatted file size string.
     * @param pBytes The size in bytes.
     * @returns Formatted string (e.g., "1.5 MB").
     */
    fileSize(pBytes: number): string;

    /**
     * Debounce a function.
     * @param pFunction The function to debounce.
     * @param pDelay The delay in milliseconds.
     * @returns The debounced function.
     */
    debounce(pFunction: Function, pDelay: number): Function;

    /**
     * Throttle a function.
     * @param pFunction The function to throttle.
     * @param pDelay The delay in milliseconds.
     * @returns The throttled function.
     */
    throttle(pFunction: Function, pDelay: number): Function;

    /**
     * Deep copy / clone an object.
     * @param pObject The object to clone.
     * @returns The cloned object.
     */
    toJSON(pObject: any): string;
}

// ── apex.message ──────────────────────────────

interface ApexMessage {
    /**
     * Show a page-level success message.
     * @param pMessage The message to show.
     */
    showPageSuccess(pMessage: string): void;

    /**
     * Show page-level errors.
     * @param pErrors An array of error objects or a single error string.
     */
    showErrors(pErrors: string | Array<{ type?: string; location?: string | string[]; pageItem?: string; message: string; unsafe?: boolean }>): void;

    /**
     * Clear all page-level messages.
     */
    clearErrors(): void;

    /**
     * Show an alert dialog.
     * @param pMessage The message for the alert.
     * @param pCallback Function called when the alert is dismissed.
     */
    alert(pMessage: string, pCallback?: () => void): void;

    /**
     * Show a confirm dialog.
     * @param pMessage The confirmation message.
     * @param pCallback Function called with the user's choice (true/false).
     */
    confirm(pMessage: string, pCallback: (ok: boolean) => void): void;
}

// ── apex.debug ────────────────────────────────

interface ApexDebug {
    /** Log a message at the default level. */
    message(pMessage: string, ...args: any[]): void;
    /** Log at info level. */
    info(pMessage: string, ...args: any[]): void;
    /** Log at warning level. */
    warn(pMessage: string, ...args: any[]): void;
    /** Log at error level. */
    error(pMessage: string, ...args: any[]): void;
    /** Log at trace level. */
    trace(pMessage: string, ...args: any[]): void;
    /** Log the entry of a function. */
    enter(pRoutineName: string, ...args: any[]): void;
    /** Enable debug mode. */
    enable(pLevel?: number): void;
    /** Disable debug mode. */
    disable(): void;
    /** The current debug level. */
    LOG_LEVEL: { OFF: number; ERROR: number; WARN: number; INFO: number; APP_TRACE: number; ENGINE_TRACE: number };
    /** Get the current debug level. */
    getLevel(): number;
    /** Set the debug level. */
    setLevel(pLevel: number): void;
}

// ── apex.lang ─────────────────────────────────

interface ApexLang {
    /**
     * Get a localized message by key.
     * @param pKey The message key.
     * @param args Substitution values for %0, %1, etc.
     * @returns The localized message string.
     */
    getMessage(pKey: string, ...args: string[]): string;

    /**
     * Add messages from a JSON object.
     * @param pMessages Object mapping keys to message strings.
     */
    addMessages(pMessages: { [key: string]: string }): void;

    /**
     * Format a message string with substitution parameters.
     * @param pPattern The message pattern with %0, %1 placeholders.
     * @param args The substitution values.
     * @returns The formatted string.
     */
    format(pPattern: string, ...args: string[]): string;

    /**
     * Format a message string but with HTML escaping.
     */
    formatMessage(pKey: string, ...args: string[]): string;

    /**
     * Format a message string, no HTML escaping.
     */
    formatMessageNoEscape(pKey: string, ...args: string[]): string;

    /**
     * Check if a message key exists.
     */
    hasMessage(pKey: string): boolean;
}

// ── apex.locale ───────────────────────────────

interface ApexLocale {
    /** Format a number according to the current locale. */
    formatNumber(pValue: number, pFormat?: string): string;
    /** Parse a locale-formatted number string. */
    toNumber(pValue: string): number;
    /** Format a date as a string using a format mask. */
    formatDate(pDate: Date, pFormat: string): string;
    /** Parse a date string according to a format mask. */
    toDate(pValue: string, pFormat: string): Date;
    /** Get the decimal separator. */
    getDecimalSeparator(): string;
    /** Get the group separator. */
    getGroupSeparator(): string;
    /** Get the currency symbol. */
    getCurrency(): string;
}

// ── apex.storage ──────────────────────────────

interface ApexScopedStorage {
    /** Get a value by key. */
    getItem(key: string): string | null;
    /** Set a value by key. */
    setItem(key: string, value: string): void;
    /** Remove a value by key. */
    removeItem(key: string): void;
}

interface ApexStorage {
    /** Get a scoped localStorage wrapper for the given prefix. */
    getScopedLocalStorage(pOptions: { prefix: string; useAppId?: boolean; usePageId?: boolean }): ApexScopedStorage;
    /** Get a scoped sessionStorage wrapper for the given prefix. */
    getScopedSessionStorage(pOptions: { prefix: string; useAppId?: boolean; usePageId?: boolean }): ApexScopedStorage;
    /** Check if local storage has items with the given prefix. */
    hasLocalStorageSupport(): boolean;
    /** Check if session storage is supported. */
    hasSessionStorageSupport(): boolean;
}

// ── apex.event ────────────────────────────────

interface ApexEvent {
    /** Trigger an event on the apex context. */
    trigger(pElement: string | HTMLElement | JQuery, pEvent: string, pData?: any): void;
}

// ── apex.da ───────────────────────────────────

interface ApexDa {
    /** Resume a Dynamic Action after waiting. */
    resume(pCallback: () => void, pSkip: boolean): void;
}

// ── apex.theme ────────────────────────────────

interface ApexTheme {
    /** Get the legacy template option value. */
    defaultTemplateOptions: string;
}

// ── apex.actions ──────────────────────────────

interface ApexAction {
    name: string;
    label?: string;
    action?: (event: Event, focusElement: HTMLElement) => boolean;
    href?: string;
    disabled?: boolean;
    hide?: boolean;
    icon?: string;
    iconType?: string;
    shortcut?: string;
    onLabel?: string;
    offLabel?: string;
    get?: boolean;
    set?: (value: any) => void;
    choices?: Array<{ label: string; value: string }>;
}

interface ApexActions {
    /** Add one or more action definitions. */
    add(pActions: ApexAction | ApexAction[]): void;
    /** Remove an action by name. */
    remove(pActionName: string): void;
    /** Look up an action by name. */
    lookup(pActionName: string): ApexAction | undefined;
    /** Update an action. */
    update(pActionName: string, pUpdate: Partial<ApexAction>): void;
    /** Invoke an action by name. */
    invoke(pActionName: string): boolean;
    /** Enable an action. */
    enable(pActionName: string): void;
    /** Disable an action. */
    disable(pActionName: string): void;
    /** Show an action. */
    show(pActionName: string): void;
    /** Hide an action. */
    hide(pActionName: string): void;
    /** List all actions. */
    list(): ApexAction[];
}

// ── apex (top-level namespace) ────────────────

interface ApexNamespace {
    /** Environment variables (APP_ID, APP_USER, etc.). */
    env: ApexEnv;
    /** The jQuery function used by APEX. */
    jQuery: JQueryStatic;
    /** The page context jQuery object. */
    gPageContext$: JQuery;
    /** Map of all item interfaces on the page. */
    items: { [itemName: string]: ApexItemInterface };
    /** Map of all region interfaces on the page. */
    regions: { [regionStaticId: string]: ApexRegionInterface };

    /**
     * Get the item interface for a page item.
     * @param pItemName The item name (e.g., "P1_NAME").
     * @returns The item interface.
     */
    item(pItemName: string | HTMLElement | JQuery): ApexItemInterface;

    /**
     * Get the region interface for a region.
     * @param pRegionId The region static ID.
     * @returns The region interface.
     */
    region(pRegionId: string): ApexRegionInterface;

    /**
     * Show a confirmation dialog and submit the page.
     */
    confirm(pMessage?: string, pOptions?: string | ApexPageSubmitOptions): void;

    /**
     * Submit the page.
     */
    submit(pOptions?: string | ApexPageSubmitOptions): void;

    /**
     * Check if the user has interacted with the page.
     * @returns True if the user has interacted.
     */
    userHasTouched(): boolean;

    /** Server-side communication (AJAX). */
    server: ApexServer;
    /** Page-level functions (submit, validate, etc.). */
    page: ApexPage;
    /** Navigation functions (redirect, popup, dialog). */
    navigation: ApexNavigation;
    /** Utility functions (escapeHTML, showSpinner, templates, etc.). */
    util: ApexUtil;
    /** Page message functions (success, errors, alerts). */
    message: ApexMessage;
    /** Debug/logging functions. */
    debug: ApexDebug;
    /** Localization (i18n) functions. */
    lang: ApexLang;
    /** Number and date formatting. */
    locale: ApexLocale;
    /** Local/session storage helpers. */
    storage: ApexStorage;
    /** Event utilities. */
    event: ApexEvent;
    /** Dynamic Action control. */
    da: ApexDa;
    /** Theme utilities. */
    theme: ApexTheme;
    /** Actions framework. */
    actions: ApexActions;
}

/** The top-level Oracle APEX JavaScript namespace. */
declare var apex: ApexNamespace;

// ── APEX legacy global functions ──────────────

/**
 * Get the value of a page item. Shorthand for apex.item(pItem).getValue().
 * @param pItem The item name or DOM node.
 * @returns The item value as a string.
 */
declare function $v(pItem: string | HTMLElement): string;

/**
 * Get the value of a page item, returning an array for multi-value items.
 * @param pItem The item name.
 * @returns The item value(s).
 */
declare function $v2(pItem: string | HTMLElement): string | string[];

/**
 * Set the value of a page item. Shorthand for apex.item(pItem).setValue(pValue).
 * @param pItem The item name or DOM node.
 * @param pValue The new value.
 * @param pDisplayValue Optional display value.
 * @param pSuppressChangeEvent If true, don't fire a change event.
 */
declare function $s(pItem: string | HTMLElement, pValue: string, pDisplayValue?: string, pSuppressChangeEvent?: boolean): void;

/**
 * Show a DOM element.
 * @param pItem The item name or DOM node.
 */
declare function $x_Show(pItem: string | HTMLElement): void;

/**
 * Hide a DOM element.
 * @param pItem The item name or DOM node.
 */
declare function $x_Hide(pItem: string | HTMLElement): void;

/**
 * Toggle the visibility of a DOM element.
 * @param pItem The item name or DOM node.
 */
declare function $x_Toggle(pItem: string | HTMLElement): void;

/**
 * Enable a page item.
 * @param pItem The item name or DOM node.
 */
declare function $x_Enable(pItem: string | HTMLElement): void;

/**
 * Disable a page item.
 * @param pItem The item name or DOM node.
 */
declare function $x_Disable(pItem: string | HTMLElement): void;

/**
 * Get a DOM element by ID.
 * @param pId The element ID.
 * @returns The DOM element or null.
 */
declare function $x(pId: string): HTMLElement | null;
