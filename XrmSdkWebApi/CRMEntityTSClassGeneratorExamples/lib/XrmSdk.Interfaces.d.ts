declare module XrmSdk {

    /**
    * @interface
    */
    export interface Entity {
        [index: string]: any;
    }

    /**
    * @interface
    */
    export interface EntityCollection {
        value: [Entity];
    }

}