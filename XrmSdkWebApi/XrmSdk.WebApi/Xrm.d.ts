declare var Xrm: Xrm;
declare var ExecutionObj: ExecutionContext;
declare var GetGlobalContext: GetGlobalContext;

interface GetGlobalContext {
    (): Context;
}

interface Xrm {
    Page: Page;
    Utility: Utility;
}

interface Utility {
    openEntityForm(name: string, id?: string, parameters?: Object): Object; //Opens an entity form.
    openWebResource(webResourceName: string, webResourceData?: string, width?: number, height?: number): Window; //Opens an HTML web resource.
}

interface Page {
    context: Context;
    data: data;
    ui: ui;
    getAttribute(): Attribute[]; // Returns one or more controls depending on the arguments passed. 
    getAttribute(argument: string): Attribute; // Returns The control where the name matches the argument
    getAttribute(argument: number): Attribute; // Returns The control where the index matches the number
    getAttribute(argument: AttributeFunctionCallback): Attribute[]; // Return Value The tab where the index matches the number
    getControl(): Attribute[]; // Returns one or more controls depending on the arguments passed. 
    getControl(argument: string): Control; // Returns The control where the name matches the argument
    getControl(argument: number): Control; // Returns The control where the index matches the number
    getControl(argument: AttributeFunctionCallback): Attribute[]; // Return Value The tab where the index matches the number
}

interface ui {
    close(): void; // Closes the form.
    getCurrentControl(): Object; //  Returns the control object that currently has focus on the form.
    getFormType(): number;  // Indicates the form context for the record.
    getViewPortHeight(): number; // Returns the height of the viewport in pixels. 
    getViewPortWidth(): number; //  Returns the width of the viewport in pixels. 
    refreshRibbon(): void; // Causes the ribbon to re-evaluate data that controls what is displayed in it.
    controls: ControlsCollection<Control>;
    navigation: Navigation;
    formSelector: FormSelector;
    tabs: TabsCollection;
}
interface FormSelector {
    items: ControlsCollection<FormSelectorItem>;
    getCurrentItem(): FormSelectorItem; // Returns a reference to the form currently being shown.

}

interface FormSelectorItem {
    getId(): string; // Returns the GUID ID of the roleForm.
    getLabel(): string; // Returns the label of the roleForm.
    navigate(): void; // Opens the specified roleForm.
}

interface Navigation {
    items: NavigationItemCollection;
}

interface TabsCollection {
    forEach(argument: TabFunctionCallback): void; // Applies the action contained within a delegate function. 
    get(): Attribute[]; // Return Value All the tabs.
    get(argument: string): Tab; // Return Value The tab where the name matches the argument.
    get(argument: number): Tab; // Return Value The tab where the index matches the number
    get(argument: TabFunctionCallback): Attribute[]; // Return Value The tab where the index matches the number
    getLength(): number; // Returns the number of tabs  in the collection
}

interface TabFunctionCallback {
    (tab: Tab, index: number): any;
}

interface SectionFunctionCallback {
    (section: Section, index: number): any;
}

interface ControlFunctionCallback {
    (control: Control, index: number): any;
}

interface AttributeFunctionCallback {
    (attribute: Attribute, index: number): any;
}
interface Tab {
    getDisplayState();
    getLabel(): string;
    getParent();
    getVisible();
    setDisplayState();
    setFocus();
    setLabel();
    setVisible(isVisible: boolean);
    sections: TabSections;
}
interface Section {
    getLabel(): string;
    getName(): string;
    getParent(): Object;
    getVisible(): boolean;
    setLabel(arg: string): void; //Sets the label for the section.
    setVisible(arg: boolean): void; //Sets a value that indicates whether the section is visible.
    controls: ControlsCollection<Control>;

}
interface TabSections {
    forEach(argument: SectionFunctionCallback); // Applies the action contained within a delegate function. 
    get(): Attribute[]; // Returns one or more controls depending on the arguments passed. 
    get(argument: string): Section; // Returns The control where the name matches the argument
    get(argument: number): Section; // Returns The control where the index matches the number
    get(argument: AttributeFunctionCallback): Attribute[]; // Return Value The tab where the index matches the number
    getLength(): number; // Returns the number of controls in the collection
}
interface ControlArray<T> {
    [index: number]: T;
    [index: string]: T;
    (index: string): T;
    (index: number): T;
}
interface ControlsCollection<T> {
    forEach(argument: ControlFunctionCallback): void; // Applies the action contained within a delegate function.    
    get(): ControlArray<T>; // Returns one or more controls depending on the arguments passed. 
    get(argument: string): T; // Returns The control where the name matches the argument
    get(argument: Number): T; // Returns The control where the index matches the number
    get(argument: AttributeFunctionCallback): ControlArray<T>; // Return Value The tab where the index matches the number
    getLength(): number; // Returns the number of controls in the collection
}

interface NavigationArray {
    [index: number]: NavigationItem;
    [index: string]: NavigationItem;
    (index: string): NavigationItem;
    (index: number): NavigationItem;
}
interface NavigationItemCollection {
    forEach(argument: TabFunctionCallback): void; // Applies the action contained within a delegate function.    
    get(): NavigationArray; // Returns one or more controls depending on the arguments passed. 
    get(argument: string): NavigationItem; // Returns The control where the name matches the argument
    get(argument: number): NavigationItem; // Returns The control where the index matches the number
    get(argument: AttributeFunctionCallback): NavigationArray; // Return Value The tab where the index matches the number
    getLength(): number; // Returns the number of controls in the collection
}

interface Context {
    getAuthenticationHeader(): string; //Deprecated. Returns the encoded SOAP header necessary to use Microsoft Dynamics CRM web service calls using JScript. 
    getCurrentTheme(): string; //  Returns a string representing the current Microsoft Office Outlook theme chosen by the user.
    getOrgLcid(): Number;  /// Returns the LCID value that represents the Microsoft Dynamics CRM Language Pack that is the base language for the organization.
    getOrgUniqueName(): string; /// Returns the unique text value of the organizations name.
    getQueryStringParameters(): Attribute[];  /// Returns an array of key value pairs representing the query string arguments that were passed to the page.
    getServerUrl(): string;  /// DEPRECATED after RU 12 Returns the base server URL. When a user is working offline with Microsoft Dynamics CRM for Microsoft Office Outlook, the URL is to the local Microsoft Dynamics CRM Web services.
    getClientUrl(): string;  /// Returns the base URL that was used to access the application This method is new in Microsoft Dynamics CRM 2011 Update Rollup 12 and the Microsoft Dynamics CRM December 2012 Service Update
    getUserId(): string; // Returns the GUID value of the SystemUser.id value for the current user.
    getUserLcid(): Number; // Returns the LCID value that represents the Microsoft Dynamics CRM Language Pack that is the user selected as their preferred language.
    getUserRoles(): Attribute[]; // Returns an array of strings representing the GUID values of each of the security roles that the user is associated with.
    isOutlookClient(): boolean; // Returns a Boolean value indicating if the user is using Microsoft Dynamics CRM for Microsoft Office Outlook.
    isOutlookOnline(): boolean; /// Returns a Boolean value indicating whether the user is connected to the Microsoft Dynamics CRM server while using Microsoft Dynamics CRM for Microsoft Office Outlook with Offline Access. When this function returns false, the user is not connected to the server. The user is interacting with an instance of Microsoft Dynamics CRM running on the local computer.
    prependOrgName(sPath: string): string; // Prepends the organization name to the specified path.
}
interface data {
    entity: Entity;
}
interface Entity {
    attributes: AttributeCollection;
    addOnSave(ev: any): void;  // Sets a function to be called when the record is saved.    
    getDataXml(): string;  //  Returns a string representing the xml that will be sent to the server when the record is saved.
    getEntityName(): string;  // Returns a string representing the logical name of the entity for the record.
    getId(): string;  // Returns a string representing the GUID id value for the record.
    getIsDirty(): boolean;  // Returns a Boolean value that indicates if any fields in the form have been modified.
    removeOnSave();  // Removes a function from the OnSave event hander.
    save(): void;  // Saves the record. This method has three possible parameters.
    save(param: string): void;  // Saves the record. This method has three possible parameters. "" , "saveandclose" and "saveandnew"
}
interface AttributeCollection {
    length: number;
    item(index: number): Attribute;
    forEach(argument: AttributeFunctionCallback): void; // Applies the action contained within a delegate function.    
    get(): Attribute[]; // Returns one or more controls depending on the arguments passed. 
    get(argument: string): Attribute; // Returns The control where the name matches the argument
    get(argument: number): Attribute; // Returns The control where the index matches the number
    get(argument: AttributeFunctionCallback): Attribute[]; // Return Value The tab where the index matches the number
    getLength(): number; // Returns the number of controls in the collection
}

interface Attribute {
    addOnChange(ev: any): void;
    fireOnChange(): void;
    getAttributeType(): string;
    getFormat(): string;
    getInitialValue(): number;
    getIsDirty(): boolean;
    getMax(): number;
    getMaxLength(): number;
    getMin(): number;
    getName(): string;
    getOption(value: string): Object; // review
    getOption(value: number): Object; // review
    getOptions(): Attribute[];
    getParent(): Entity;
    getPrecision(): number;
    getRequiredLevel(): string;
    getSelectedOption(): Option; // review
    getSubmitMode(): string;
    getText(): string;
    getUserPrivilege(): UserPrivilege; // review
    getValue(): any;
    removeOnChange(ev: any): void;
    setRequiredLevel(requirementLevel: string): void;
    setSubmitMode(SubmitMode: string): void; // review
    setValue(value: any);
}
interface UserPrivilege {
    canRead: boolean;
    canUpdate: boolean;
    canCreate: boolean;
}

interface Lookup {
    Name: string;
    Id: string;
    EntityType: string;
}

interface ExecutionContext {
    getContext(): Context; //  Returns the Xrm.Page.context object.
    getDepth(): number; //  Returns a value that indicates the order in which this handler is executed. 
    getEventArgs(): SaveEventArgs; //  Returns an object with methods to manage the Save event.
    getEventSource(): Attribute; //  Returns a reference to the object that the event occurred on.
    getSharedVariable(key: string): Object; // Retrieves a variable set using setSharedVariable.
    setSharedVariable(key: string, value: Object); // Sets the value of a variable to be used by a handler after the current handler completes.
}

interface SaveEventArgs {
    getSaveMode(): number; //   Returns a value indicating how the save event was initiated by the user.
    isDefaultPrevented(): boolean; //   Returns a value indicating whether the save event has been canceled because the preventDefault method was used in this event handler or a previous event handler.
    preventDefault(): void; //  Cancels the save operation, but all remaining handlers for the event will still be executed.
}

interface Option {
    text: string;
    value: string;
}

interface Control {
    addCustomView(viewId: string, entityName: string, viewDisplayName: string, fetchXml: string, layoutXml: string, isDefault: boolean): void; //Adds a new view for the lookup dialog.
    addOption(option: Object, index?: number): void;  // Adds an option to an Option set control.
    clearOptions(): void; //  Clears all options from an Option Set control.
    getAttribute(): Attribute[]; //  Returns the attribute that the control is bound to.
    getControlType(): string; //  Returns a value that categorizes controls.
    getData(): string; //  Returns the value of the data query string parameter passed to a Silverlight Web resource. 
    getDefaultView(): string; //  Returns the ID value of the default lookup dialog view.
    getDisabled(): boolean; // Returns a value that indicates whether the control is disabled.
    getLabel(): string; //  Returns the label for the control
    getName(): string; //  Returns the name assigned to the control.
    getParent(): Object; //  Returns a reference to the section object that contains the control.
    getSrc(): string; //  Returns the current URL being displayed in an IFRAME.
    getInitialUrl(): string; //  Returns the default URL that an IFrame control is configured to display.
    getObject(): Object; //  Returns the object in the form representing an IFrame or Web resource.
    getVisible(): boolean; //  Returns a value that indicates whether the control is currently visible.
    refresh(): void; //  Refreshes the data displayed in a Sub-Grid
    removeOption(value: number): void; //  Removes an option from an Option Set control.
    setData(value: string): void; //  Sets the value of the data query string parameter passed to a Silverlight Web resource.
    setDefaultView(viewGuid: string): void; //  Sets the default view for the lookup control dialog.
    setDisabled(value: boolean): void; //  Sets a value that indicates whether the control is disabled.
    setFocus(): void; //  Sets the focus on the control.
    setLabel(label: string): void; //  Sets the label for the control.
    setSrc(value: string): void; //  Sets the URL to be displayed in an IFrame.
    setVisible(value: boolean): void; //  Sets a value that indicates whether the control is visible.
}

interface NavigationItem {
    getId(): string; //  Returns the name of the item. 
    getLabel(): string; //  Returns the label for the item
    getVisible(): boolean; //  Returns a value that indicates whether the item is currently visible.
    setFocus(): void; //  Sets the focus on the item.
    setLabel(label: string): void; //  Sets the label for the item.
    setVisible(value: boolean): void; //  Sets a value that indicates whether the item is visible.
}