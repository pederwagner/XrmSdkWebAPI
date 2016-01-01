// ===================================================================================
//  This file is ported and extended from the Microsoft Dynamics CRM SDK code samples.
//
//  Copyright (C) Peder Møller Wagner, ProActive.  All rights reserved.
//
//  Typescript Target Version: 1.4
// ===================================================================================
/// <reference path="XrmSdk.Interfaces.d.ts" />
/// <reference path="es6-promise.d.ts"/>
// NB: IE 11 does not support Promises. To use with IE 11 and earlier, reference https://github.com/jakearchibald/es6-promise
"use strict";
var XrmSdk;
(function (XrmSdk) {
    var WebAPI;
    (function (WebAPI) {
        function create(entitySetName, entity, callerId, async) {
            var _this = this;
            /// <summary>Create a new entity</summary>
            /// <param name="entitySetName" type="String">The name of the entity set for the entity you want to create.</param>
            /// <param name="entity" type="Object">An object with the properties for the entity you want to create.</param>       
            /// <param name="successCallback" type="Function">The function to call when the entity is created. The Uri of the created entity is passed to this function.</param>
            /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
            /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
            /// <param name="async" type="Boolean">If 'true', the request will be performed asynchronously, otherwise synchronously</param>
            if (!XrmSdk.WebAPI.isString(entitySetName)) {
                throw new Error("XrmSdk.WebAPI.create entitySetName parameter must be a string.");
            }
            if (XrmSdk.WebAPI.isNullOrUndefined(entity)) {
                throw new Error("XrmSdk.WebAPI.create entity parameter must not be null or undefined.");
            }
            if (!XrmSdk.WebAPI.isAcceptableCallerId(callerId)) {
                throw new Error("XrmSdk.WebAPI.create callerId parameter must be a string or null.");
            }
            if (!XrmSdk.WebAPI.isBoolean(async)) {
                throw new Error("XrmSdk.WebAPI.create async parameter must be a boolean.");
            }
            var req = new XMLHttpRequest();
            req.open("POST", encodeURI(this.getWebAPIPath() + entitySetName), async);
            req.setRequestHeader("Accept", "application/json");
            if (callerId) {
                req.setRequestHeader("MSCRMCallerID", callerId);
            }
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            if (async) {
                return new Promise(function (resolve, reject) {
                    req.onreadystatechange = function () {
                        if (this.readyState == 4 /* complete */) {
                            req.onreadystatechange = null;
                            if (this.status == 204) {
                                resolve(this.getResponseHeader("OData-EntityId"));
                            }
                            else {
                                reject(XrmSdk.WebAPI.errorHandler(this));
                            }
                        }
                    };
                    req.send(JSON.stringify(entity));
                });
            }
            else {
                var deferred = new Promise(function (resolve, reject) {
                    req.send(JSON.stringify(entity));
                    if (req.status == 204) {
                        resolve(req.getResponseHeader("OData-EntityId"));
                    }
                    else {
                        reject(_this.errorHandler(_this));
                    }
                });
                return deferred;
            }
        }
        WebAPI.create = create;
        function retrieve(uri, properties, navigationproperties, successCallback, errorCallback, includeFormattedValues, eTag, unmodifiedCallback, callerId, async) {
            /// <summary>Retrieve an entity</summary>
            /// <param name="uri" type="String">The Uri for the entity you want to retrieve</param>
            /// <param name="properties" type="Array">An array of strings representing the entity properties you want to retrieve.</param>
            /// <param name="navigationproperties" type="String">An array of strings representing the navigation properties and any system query options you want to retrieve.</param>
            /// <param name="successCallback" type="Function">The function to call when the entity is retrieved. The entity data will be passed to this function.</param>
            /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
            /// <param name="includeFormattedValues" type="Boolean" optional="true">Whether you want to return formatted values.</param>
            /// <param name="eTag" type="String" optional="true">When provided and the entity has not been modified since the eTag value was retrieved, the unmodifiedCallback will be called.</param>
            /// <param name="unmodifiedCallback" type="Function" optional="true">The function to call when the entity has not been modified since last retrieved based on the eTag value. No entity data will be passed to this function.</param>
            /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
            /// <param name="async" type="Boolean">If 'true', the request will be performed asynchronously, otherwise synchronously</param>
            if (!this.isString(uri)) {
                throw new Error("XrmSdk.WebAPI.retrieve uri parameter must be a string.");
            }
            if (!this.isStringArrayOrNull(properties)) {
                throw new Error("XrmSdk.WebAPI.retrieve properties parameter must be an array of strings or null.");
            }
            if (!this.isStringArrayOrNull(navigationproperties)) {
                throw new Error("XrmSdk.WebAPI.retrieve navigationproperties parameter must be an array of strings or null.");
            }
            if (!this.isFunctionOrNull(successCallback)) {
                throw new Error("XrmSdk.WebAPI.retrieve successCallback parameter must be a function or null.");
            }
            if (!this.isFunctionOrNull(errorCallback)) {
                throw new Error("XrmSdk.WebAPI.retrieve errorCallback parameter must be a function or null.");
            }
            if (!this.isBooleanOrNullOrUndefined(includeFormattedValues)) {
                throw new Error("XrmSdk.WebAPI.retrieve includeFormattedValues parameter must be a boolean, null, or undefined.");
            }
            if (!this.isStringOrNullOrUndefined(eTag)) {
                throw new Error("XrmSdk.WebAPI.retrieve eTag parameter must be a string, null or undefined.");
            }
            if (!this.isFunctionOrNullOrUndefined(unmodifiedCallback)) {
                throw new Error("XrmSdk.WebAPI.retrieve unmodifiedCallback parameter must be a function, null or undefined.");
            }
            if (!this.isAcceptableCallerId(callerId)) {
                throw new Error("XrmSdk.WebAPI.retrieve callerId parameter must be a string null or undefined.");
            }
            if (!this.isBoolean(async)) {
                throw new Error("XrmSdk.WebAPI.retrieve async parameter must be a boolean.");
            }
            if (properties || navigationproperties) {
                uri += "?";
            }
            if (properties) {
                uri += "$select=" + properties.join();
            }
            if (navigationproperties) {
                if (properties) {
                    uri += "&$expand=" + navigationproperties.join();
                }
                else {
                    uri += "$expand=" + navigationproperties.join();
                }
            }
            var req = new XMLHttpRequest();
            req.open("GET", encodeURI(uri), async);
            req.setRequestHeader("Accept", "application/json");
            if (callerId) {
                req.setRequestHeader("MSCRMCallerID", callerId);
            }
            if (eTag) {
                req.setRequestHeader("If-None-Match", eTag);
            }
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            if (includeFormattedValues) {
                req.setRequestHeader("Prefer", "odata.include-annotations=\"mscrm.formattedvalue\"");
            }
            if (async) {
                req.onreadystatechange = function () {
                    if (this.readyState == 4 /* complete */) {
                        req.onreadystatechange = null;
                        switch (this.status) {
                            case 200:
                                if (successCallback)
                                    successCallback(JSON.parse(this.response, this.dateReviver));
                                break;
                            case 304:
                                if (this.isFunction(unmodifiedCallback))
                                    unmodifiedCallback();
                                break;
                            default:
                                if (errorCallback)
                                    errorCallback(this.errorHandler(this));
                                break;
                        }
                    }
                };
                req.send();
            }
            else {
                req.send();
                switch (req.status) {
                    case 200:
                        if (successCallback)
                            successCallback(JSON.parse(req.response, this.dateReviver));
                        break;
                    case 304:
                        if (this.isFunction(unmodifiedCallback))
                            unmodifiedCallback();
                        break;
                    default:
                        if (errorCallback)
                            errorCallback(this.errorHandler(this));
                        break;
                }
            }
        }
        WebAPI.retrieve = retrieve;
        function retrievePropertyValue(uri, propertyName, successCallback, errorCallback, callerId, async) {
            /// <summary>Retrieve the value of an entity property</summary>
            /// <param name="uri" type="String">The Uri for the entity with the property you want to retrieve</param>
            /// <param name="propertyName" type="String">A string representing the entity property you want to retrieve.</param>
            /// <param name="successCallback" type="Function">The function to call when the entity is retrieved. The property value will be passed to this function.</param>
            /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
            /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
            /// <param name="async" type="Boolean">If 'true', the request will be performed asynchronously, otherwise synchronously</param>
            if (!this.isString(uri)) {
                throw new Error("XrmSdk.WebAPI.retrieveProperty uri parameter must be a string.");
            }
            if (!this.isString(propertyName)) {
                throw new Error("XrmSdk.WebAPI.retrieveProperty propertyName parameter must be a string.");
            }
            if (!this.isFunctionOrNull(successCallback)) {
                throw new Error("XrmSdk.WebAPI.retrieveProperty successCallback parameter must be a function or null.");
            }
            if (!this.isFunctionOrNull(errorCallback)) {
                throw new Error("XrmSdk.WebAPI.retrieveProperty errorCallback parameter must be a function or null.");
            }
            if (!this.isAcceptableCallerId(callerId)) {
                throw new Error("XrmSdk.WebAPI.retrieveProperty callerId parameter must be a string or null.");
            }
            if (!this.isBoolean(async)) {
                throw new Error("XrmSdk.WebAPI.retrieveProperty async parameter must be a boolean.");
            }
            var req = new XMLHttpRequest();
            req.open("GET", encodeURI(uri + "/" + propertyName), async);
            req.setRequestHeader("Accept", "application/json");
            if (callerId) {
                req.setRequestHeader("MSCRMCallerID", callerId);
            }
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            if (async) {
                req.onreadystatechange = function () {
                    if (this.readyState == 4 /* complete */) {
                        req.onreadystatechange = null;
                        switch (this.status) {
                            case 200:
                                if (successCallback)
                                    successCallback(JSON.parse(this.response, this.dateReviver).value);
                                break;
                            case 204:
                                if (successCallback)
                                    successCallback(null);
                                break;
                            default:
                                if (errorCallback)
                                    errorCallback(this.errorHandler(this));
                                break;
                        }
                    }
                };
                req.send();
            }
            else {
                req.send();
                switch (req.status) {
                    case 200:
                        if (successCallback)
                            successCallback(JSON.parse(req.response, this.dateReviver).value);
                        break;
                    case 204:
                        if (successCallback)
                            successCallback(null);
                        break;
                    default:
                        if (errorCallback)
                            errorCallback(this.errorHandler(this));
                        break;
                }
            }
        }
        WebAPI.retrievePropertyValue = retrievePropertyValue;
        function update(uri, updatedEntity, successCallback, errorCallback, callerId, async) {
            /// <summary>Update an entity</summary>
            /// <param name="uri" type="String">The Uri for the entity you want to update</param>
            /// <param name="updatedEntity" type="Object">An object that contains updated properties for the entity.</param>
            /// <param name="successCallback" type="Function">The function to call when the entity is updated.</param>
            /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
            /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
            /// <param name="async" type="Boolean">If 'true', the request will be performed asynchronously, otherwise synchronously</param>
            if (!XrmSdk.WebAPI.isString(uri)) {
                throw new Error("XrmSdk.WebAPI.update uri parameter must be a string.");
            }
            if (XrmSdk.WebAPI.isNullOrUndefined(updatedEntity)) {
                throw new Error("XrmSdk.WebAPI.update updatedEntity parameter must not be null or undefined.");
            }
            if (!XrmSdk.WebAPI.isFunctionOrNull(successCallback)) {
                throw new Error("XrmSdk.WebAPI.update successCallback parameter must be a function or null.");
            }
            if (!XrmSdk.WebAPI.isFunctionOrNull(errorCallback)) {
                throw new Error("XrmSdk.WebAPI.update errorCallback parameter must be a function or null.");
            }
            if (!XrmSdk.WebAPI.isAcceptableCallerId(callerId)) {
                throw new Error("XrmSdk.WebAPI.update callerId parameter must be a string or null.");
            }
            if (!XrmSdk.WebAPI.isBoolean(async)) {
                throw new Error("XrmSdk.WebAPI.update async parameter must be a boolean.");
            }
            var req = new XMLHttpRequest();
            req.open("PATCH", encodeURI(uri), async);
            req.setRequestHeader("Accept", "application/json");
            if (callerId) {
                req.setRequestHeader("MSCRMCallerID", callerId);
            }
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            if (async) {
                req.onreadystatechange = function () {
                    if (this.readyState == 4 /* complete */) {
                        req.onreadystatechange = null;
                        if (this.status == 204) {
                            if (successCallback)
                                successCallback();
                        }
                        else {
                            if (errorCallback)
                                errorCallback(this.errorHandler(this));
                        }
                    }
                };
                req.send(JSON.stringify(updatedEntity));
            }
            else {
                req.send(JSON.stringify(updatedEntity));
                if (req.status === 200) {
                    successCallback();
                }
                else {
                    errorCallback(this.errorHandler(this));
                }
            }
        }
        WebAPI.update = update;
        function updatePropertyValue(uri, propertyName, value, successCallback, errorCallback, callerId, async) {
            /// <summary>Update an entity property</summary>
            /// <param name="uri" type="String">The Uri for the entity with the property you want to update</param>
            /// <param name="updatedEntity" type="Object">An object that contains updated properties for the entity.</param>
            /// <param name="successCallback" type="Function">The function to call when the entity property value is updated. The property value will be passed to this function.</param>
            /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
            /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
            /// <param name="async" type="Boolean">If 'true', the request will be performed asynchronously, otherwise synchronously</param>
            if (!this.isString(uri)) {
                throw new Error("XrmSdk.WebAPI.updateProperty uri parameter must be a string.");
            }
            if (!this.isString(propertyName)) {
                throw new Error("XrmSdk.WebAPI.updateProperty propertyName parameter must be a string.");
            }
            if (this.isNullOrUndefined(value)) {
                throw new Error("XrmSdk.WebAPI.updateProperty value parameter must not be null or undefined.");
            }
            if (!this.isFunctionOrNull(successCallback)) {
                throw new Error("XrmSdk.WebAPI.updateProperty successCallback parameter must be a function or null.");
            }
            if (!this.isFunctionOrNull(errorCallback)) {
                throw new Error("XrmSdk.WebAPI.updateProperty errorCallback parameter must be a function or null.");
            }
            if (!this.isAcceptableCallerId(callerId)) {
                throw new Error("XrmSdk.WebAPI.updateProperty callerId parameter must be a string or null.");
            }
            if (!this.isBoolean(async)) {
                throw new Error("XrmSdk.WebAPI.updateProperty async parameter must be a boolean.");
            }
            var req = new XMLHttpRequest();
            req.open("PUT", encodeURI(uri + "/" + propertyName), async);
            req.setRequestHeader("Accept", "application/json");
            if (callerId) {
                req.setRequestHeader("MSCRMCallerID", callerId);
            }
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            var updateObject = {};
            updateObject.value = value;
            if (async) {
                req.onreadystatechange = function () {
                    if (this.readyState == 4 /* complete */) {
                        req.onreadystatechange = null;
                        if (this.status == 204) {
                            if (successCallback)
                                successCallback();
                        }
                        else {
                            if (errorCallback)
                                errorCallback(this.errorHandler(this));
                        }
                    }
                };
                req.send(JSON.stringify(updateObject));
            }
            else {
                req.send(JSON.stringify(updateObject));
                if (req.status == 204) {
                    if (successCallback)
                        successCallback();
                }
                else {
                    if (errorCallback)
                        errorCallback(this.errorHandler(this));
                }
            }
        }
        WebAPI.updatePropertyValue = updatePropertyValue;
        function upsert(uri, entity, preventCreate, preventUpdate, successCallback, errorCallback, callerId, async) {
            /// <summary>Upsert an entity</summary>
            /// <param name="uri" type="String">The Uri for the entity you want to create or update</param>
            /// <param name="entity" type="Object">An object that contains updated properties for the entity.</param>
            /// <param name="preventCreate" type="Boolean">Whether you want to prevent creating a new entity.</param>
            /// <param name="preventUpdate" type="Boolean">Whether you want to prevent updating an existing entity.</param>
            /// <param name="successCallback" type="Function">The function to call when the operation is performed</param>
            /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
            /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
            /// <param name="async" type="Boolean">If 'true', the request will be performed asynchronously, otherwise synchronously</param>
            if (!this.isString(uri)) {
                throw new Error("XrmSdk.WebAPI.upsert uri parameter must be a string.");
            }
            if (this.isNullOrUndefined(entity)) {
                throw new Error("XrmSdk.WebAPI.upsert updatedEntity parameter must not be null or undefined.");
            }
            if (!this.isBooleanOrNull(preventCreate)) {
                throw new Error("XrmSdk.WebAPI.upsert preventCreate parameter must be boolean or null.");
            }
            if (!this.isBooleanOrNull(preventUpdate)) {
                throw new Error("XrmSdk.WebAPI.upsert preventUpdate parameter must be boolean or null.");
            }
            if (!this.isFunctionOrNull(successCallback)) {
                throw new Error("XrmSdk.WebAPI.upsert successCallback parameter must be a function or null.");
            }
            if (!this.isFunctionOrNull(errorCallback)) {
                throw new Error("XrmSdk.WebAPI.upsert errorCallback parameter must be a function or null.");
            }
            if (!this.isAcceptableCallerId(callerId)) {
                throw new Error("XrmSdk.WebAPI.upsert callerId parameter must be a string or null.");
            }
            if (!this.isBoolean(async)) {
                throw new Error("XrmSdk.WebAPI.upsert async parameter must be a boolean.");
            }
            if (!(preventCreate && preventUpdate)) {
                var req = new XMLHttpRequest();
                req.open("PATCH", encodeURI(uri), async);
                req.setRequestHeader("Accept", "application/json");
                if (callerId) {
                    req.setRequestHeader("MSCRMCallerID", callerId);
                }
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                if (preventCreate) {
                    req.setRequestHeader("If-Match", "*");
                }
                if (preventUpdate) {
                    req.setRequestHeader("If-None-Match", "*");
                }
                req.setRequestHeader("OData-MaxVersion", "4.0");
                req.setRequestHeader("OData-Version", "4.0");
                if (async) {
                    req.onreadystatechange = function () {
                        if (this.readyState == 4 /* complete */) {
                            req.onreadystatechange = null;
                            switch (this.status) {
                                case 204:
                                    if (successCallback)
                                        successCallback(this.getResponseHeader("OData-EntityId"));
                                    break;
                                case 412:
                                    if (preventUpdate) {
                                        if (successCallback)
                                            successCallback(); //Update prevented
                                    }
                                    else {
                                        if (errorCallback)
                                            errorCallback(this.errorHandler(this));
                                    }
                                    break;
                                case 404:
                                    if (preventCreate) {
                                        if (successCallback)
                                            successCallback(); //Create prevented
                                    }
                                    else {
                                        if (errorCallback)
                                            errorCallback(this.errorHandler(this));
                                    }
                                    break;
                                default:
                                    if (errorCallback)
                                        errorCallback(this.errorHandler(this));
                                    break;
                            }
                        }
                    };
                    req.send(JSON.stringify(entity));
                }
                else {
                    req.send(JSON.stringify(entity));
                    switch (req.status) {
                        case 204:
                            if (successCallback)
                                successCallback(req.getResponseHeader("OData-EntityId"));
                            break;
                        case 412:
                            if (preventUpdate) {
                                if (successCallback)
                                    successCallback(); //Update prevented
                            }
                            else {
                                if (errorCallback)
                                    errorCallback(this.errorHandler(this));
                            }
                            break;
                        case 404:
                            if (preventCreate) {
                                if (successCallback)
                                    successCallback(); //Create prevented
                            }
                            else {
                                if (errorCallback)
                                    errorCallback(this.errorHandler(this));
                            }
                            break;
                        default:
                            if (errorCallback)
                                errorCallback(this.errorHandler(this));
                            break;
                    }
                }
            }
            else {
                console.log("XrmSdk.WebAPI.upsert performed no action because both preventCreate and preventUpdate parameters were true.");
            }
        }
        WebAPI.upsert = upsert;
        //delete is a JavaScript keyword and should not be used as a method name
        function del(uri, successCallback, errorCallback, callerId, async) {
            /// <summary>Delete an entity</summary>
            /// <param name="uri" type="String">The Uri for the entity you want to delete</param>        
            /// <param name="successCallback" type="Function">The function to call when the entity is deleted.</param>
            /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
            /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
            /// <param name="async" type="Boolean">If 'true', the request will be performed asynchronously, otherwise synchronously</param>
            if (!this.isString(uri)) {
                throw new Error("XrmSdk.WebAPI.del uri parameter must be a string.");
            }
            if (!this.isFunctionOrNull(successCallback)) {
                throw new Error("XrmSdk.WebAPI.del successCallback parameter must be a function or null.");
            }
            if (!this.isFunctionOrNull(errorCallback)) {
                throw new Error("XrmSdk.WebAPI.del errorCallback parameter must be a function or null.");
            }
            if (!this.isAcceptableCallerId(callerId)) {
                throw new Error("XrmSdk.WebAPI.del callerId parameter must be a string or null.");
            }
            if (!this.isBoolean(async)) {
                throw new Error("XrmSdk.WebAPI.del async parameter must be a boolean.");
            }
            var req = new XMLHttpRequest();
            req.open("DELETE", encodeURI(uri), async);
            req.setRequestHeader("Accept", "application/json");
            if (callerId) {
                req.setRequestHeader("MSCRMCallerID", callerId);
            }
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            if (async) {
                req.onreadystatechange = function () {
                    if (this.readyState == 4 /* complete */) {
                        req.onreadystatechange = null;
                        if (this.status == 204) {
                            if (successCallback)
                                successCallback();
                        }
                        else {
                            if (errorCallback)
                                errorCallback(this.errorHandler(this));
                        }
                    }
                };
                req.send();
            }
            else {
                req.send();
                if (req.status == 204) {
                    if (successCallback)
                        successCallback();
                }
                else {
                    if (errorCallback)
                        errorCallback(this.errorHandler(this));
                }
            }
        }
        WebAPI.del = del;
        function deletePropertyValue(uri, propertyName, successCallback, errorCallback, callerId, async) {
            /// <summary>Delete an entity property value</summary>
            /// <param name="uri" type="String">The Uri for the entity you want to update</param>
            /// <param name="propertyName" type="String">The name of the property value you want to delete</param>        
            /// <param name="successCallback" type="Function">The function to call when the entity property is deleted.</param>
            /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
            /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
            /// <param name="async" type="Boolean">If 'true', the request will be performed asynchronously, otherwise synchronously</param>
            if (!this.isString(uri)) {
                throw new Error("XrmSdk.WebAPI.deletePropertyValue uri parameter must be a string.");
            }
            if (!this.isString(propertyName)) {
                throw new Error("XrmSdk.WebAPI.deletePropertyValue propertyName parameter must be a string.");
            }
            if (!this.isFunctionOrNull(successCallback)) {
                throw new Error("XrmSdk.WebAPI.deletePropertyValue successCallback parameter must be a function or null.");
            }
            if (!this.isFunctionOrNull(errorCallback)) {
                throw new Error("XrmSdk.WebAPI.deletePropertyValue errorCallback parameter must be a function or null.");
            }
            if (!this.isAcceptableCallerId(callerId)) {
                throw new Error("XrmSdk.WebAPI.deletePropertyValue callerId parameter must be a string or null.");
            }
            if (!this.isBoolean(async)) {
                throw new Error("XrmSdk.WebAPI.deletePropertyValue async parameter must be a boolean.");
            }
            var req = new XMLHttpRequest();
            req.open("DELETE", encodeURI(uri + "/" + propertyName), async);
            req.setRequestHeader("Accept", "application/json");
            if (callerId) {
                req.setRequestHeader("MSCRMCallerID", callerId);
            }
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            if (async) {
                req.onreadystatechange = function () {
                    if (this.readyState == 4 /* complete */) {
                        req.onreadystatechange = null;
                        if (this.status == 204) {
                            if (successCallback)
                                successCallback();
                        }
                        else {
                            if (errorCallback)
                                errorCallback(this.errorHandler(this));
                        }
                    }
                };
                req.send();
            }
            else {
                req.send();
                if (req.status == 204) {
                    if (successCallback)
                        successCallback();
                }
                else {
                    if (errorCallback)
                        errorCallback(this.errorHandler(this));
                }
            }
        }
        WebAPI.deletePropertyValue = deletePropertyValue;
        function associate(parentUri, navigationPropertyName, childUri, successCallback, errorCallback, callerId, async) {
            /// <summary>Associate an entity</summary>
            /// <param name="parentUri" type="String">The Uri for the entity you want to associate another entity to.</param>
            /// <param name="navigationPropertyName" type="String">The name of the navigation property you want to use to associate the entities.</param>
            /// <param name="childUri" type="String">The Uri for the entity you want to associate with the parent entity.</param>        
            /// <param name="successCallback" type="Function">The function to call when the entities are associated.</param>
            /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
            /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
            /// <param name="async" type="Boolean">If 'true', the request will be performed asynchronously, otherwise synchronously</param>
            if (!this.isString(parentUri)) {
                throw new Error("XrmSdk.WebAPI.associate parentUri parameter must be a string.");
            }
            if (!this.isString(navigationPropertyName)) {
                throw new Error("XrmSdk.WebAPI.associate navigationPropertyName parameter must be a string.");
            }
            if (!this.isString(childUri)) {
                throw new Error("XrmSdk.WebAPI.associate childUri parameter must be a string.");
            }
            if (!this.isFunctionOrNull(successCallback)) {
                throw new Error("XrmSdk.WebAPI.associate successCallback parameter must be a function or null.");
            }
            if (!this.isFunctionOrNull(errorCallback)) {
                throw new Error("XrmSdk.WebAPI.associate errorCallback parameter must be a function or null.");
            }
            if (!this.isAcceptableCallerId(callerId)) {
                throw new Error("XrmSdk.WebAPI.associate callerId parameter must be a string or null.");
            }
            if (!this.isBoolean(async)) {
                throw new Error("XrmSdk.WebAPI.associate async parameter must be a boolean.");
            }
            var req = new XMLHttpRequest();
            req.open("POST", encodeURI(parentUri + "/" + navigationPropertyName + "/$ref"), async);
            req.setRequestHeader("Accept", "application/json");
            if (callerId) {
                req.setRequestHeader("MSCRMCallerID", callerId);
            }
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            var rel = {};
            rel["@odata.id"] = childUri;
            if (async) {
                req.onreadystatechange = function () {
                    if (this.readyState == 4 /* complete */) {
                        req.onreadystatechange = null;
                        if (this.status == 204) {
                            if (successCallback)
                                successCallback();
                        }
                        else {
                            if (errorCallback)
                                errorCallback(this.errorHandler(this));
                        }
                    }
                };
                req.send(JSON.stringify(rel));
            }
            else {
                req.send(JSON.stringify(rel));
                if (req.status == 204) {
                    if (successCallback)
                        successCallback();
                }
                else {
                    if (errorCallback)
                        errorCallback(this.errorHandler(this));
                }
            }
        }
        WebAPI.associate = associate;
        function disassociate(parentUri, navigationPropertyName, childUri, successCallback, errorCallback, callerId, async) {
            /// <summary>Disassociate an entity</summary>
            /// <param name="parentUri" type="String">The Uri for the parent entity.</param>
            /// <param name="navigationPropertyName" type="String">The name of the collection navigation property you want to use to disassociate the entities.</param>
            /// <param name="childUri" type="String">The Uri for the entity you want to disassociate with the parent entity.</param>
            /// <param name="successCallback" type="Function">The function to call when the entities are disassociated.</param>
            /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
            /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
            /// <param name="async" type="Boolean">If 'true', the request will be performed asynchronously, otherwise synchronously</param>
            if (!this.isString(parentUri)) {
                throw new Error("XrmSdk.WebAPI.disassociate parentUri parameter must be a string.");
            }
            if (!this.isString(navigationPropertyName)) {
                throw new Error("XrmSdk.WebAPI.disassociate navigationPropertyName parameter must be a string.");
            }
            if (!this.isString(childUri)) {
                throw new Error("XrmSdk.WebAPI.disassociate childUri parameter must be a string.");
            }
            if (!this.isFunctionOrNull(successCallback)) {
                throw new Error("XrmSdk.WebAPI.disassociate successCallback parameter must be a function or null.");
            }
            if (!this.isFunctionOrNull(errorCallback)) {
                throw new Error("XrmSdk.WebAPI.disassociate errorCallback parameter must be a function or null.");
            }
            if (!this.isAcceptableCallerId(callerId)) {
                throw new Error("XrmSdk.WebAPI.disassociate callerId parameter must be a string or null.");
            }
            if (!this.isBoolean(async)) {
                throw new Error("XrmSdk.WebAPI.disassociate async parameter must be a boolean.");
            }
            var req = new XMLHttpRequest();
            req.open("DELETE", encodeURI(parentUri + "/" + navigationPropertyName + "/$ref?$id=" + childUri), async);
            req.setRequestHeader("Accept", "application/json");
            if (callerId) {
                req.setRequestHeader("MSCRMCallerID", callerId);
            }
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            if (async) {
                req.onreadystatechange = function () {
                    if (this.readyState == 4 /* complete */) {
                        req.onreadystatechange = null;
                        if (this.status == 204) {
                            if (successCallback)
                                successCallback();
                        }
                        else {
                            if (errorCallback)
                                errorCallback(this.errorHandler(this));
                        }
                    }
                };
                req.send();
            }
            else {
                req.send();
                if (req.status == 204) {
                    if (successCallback)
                        successCallback();
                }
                else {
                    if (errorCallback)
                        errorCallback(this.errorHandler(this));
                }
            }
        }
        WebAPI.disassociate = disassociate;
        function removeReference(entityUri, navigationPropertyName, successCallback, errorCallback, callerId, async) {
            /// <summary>Remove the value of a single-valued navigation property</summary>
            /// <param name="entityUri" type="String">The Uri for the entity.</param>
            /// <param name="navigationPropertyName" type="String">The name of the navigation property you want to use to disassociate the entities.</param>            
            /// <param name="successCallback" type="Function">The function to call when the entities are disassociated.</param>
            /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
            /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
            /// <param name="async" type="Boolean">If 'true', the request will be performed asynchronously, otherwise synchronously</param>
            if (!this.isString(entityUri)) {
                throw new Error("XrmSdk.WebAPI.removeReference entityUri parameter must be a string.");
            }
            if (!this.isString(navigationPropertyName)) {
                throw new Error("XrmSdk.WebAPI.removeReference navigationPropertyName parameter must be a string.");
            }
            if (!this.isFunctionOrNull(successCallback)) {
                throw new Error("XrmSdk.WebAPI.removeReference successCallback parameter must be a function or null.");
            }
            if (!this.isFunctionOrNull(errorCallback)) {
                throw new Error("XrmSdk.WebAPI.removeReference errorCallback parameter must be a function or null.");
            }
            if (!this.isAcceptableCallerId(callerId)) {
                throw new Error("XrmSdk.WebAPI.removeReference callerId parameter must be a string or null.");
            }
            if (!this.isBoolean(async)) {
                throw new Error("XrmSdk.WebAPI.removeReference async parameter must be a boolean.");
            }
            var req = new XMLHttpRequest();
            req.open("DELETE", encodeURI(entityUri + "/" + navigationPropertyName + "/$ref"), async);
            req.setRequestHeader("Accept", "application/json");
            if (callerId) {
                req.setRequestHeader("MSCRMCallerID", callerId);
            }
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            if (async) {
                req.onreadystatechange = function () {
                    if (this.readyState == 4 /* complete */) {
                        req.onreadystatechange = null;
                        if (this.status == 204) {
                            if (successCallback)
                                successCallback();
                        }
                        else {
                            if (errorCallback)
                                errorCallback(this.errorHandler(this));
                        }
                    }
                };
                req.send();
            }
            else {
                req.send();
                if (req.status == 204) {
                    if (successCallback)
                        successCallback();
                }
                else {
                    if (errorCallback)
                        errorCallback(this.errorHandler(this));
                }
            }
        }
        WebAPI.removeReference = removeReference;
        function addReference(entityUri, navigationPropertyName, referencedEntityUri, successCallback, errorCallback, callerId, async) {
            /// <summary>Set the value of a single-valued navigation property</summary>
            /// <param name="entityUri" type="String">The Uri for the entity.</param>
            /// <param name="navigationPropertyName" type="String">The name of the navigation property you want to use to associate the entities.</param>     
            /// <param name="referencedEntityUri" type="String">The Uri for the entity you want to associate with the child entity.</param>
            /// <param name="successCallback" type="Function">The function to call when the entities are disassociated.</param>
            /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
            /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
            /// <param name="async" type="Boolean">If 'true', the request will be performed asynchronously, otherwise synchronously</param>
            if (!this.isString(entityUri)) {
                throw new Error("XrmSdk.WebAPI.addReference entityUri parameter must be a string.");
            }
            if (!this.isString(navigationPropertyName)) {
                throw new Error("XrmSdk.WebAPI.addReference navigationPropertyName parameter must be a string.");
            }
            if (!this.isString(referencedEntityUri)) {
                throw new Error("XrmSdk.WebAPI.addReference referencedEntityUri parameter must be a string.");
            }
            if (!this.isFunctionOrNull(successCallback)) {
                throw new Error("XrmSdk.WebAPI.addReference successCallback parameter must be a function or null.");
            }
            if (!this.isFunctionOrNull(errorCallback)) {
                throw new Error("XrmSdk.WebAPI.addReference errorCallback parameter must be a function or null.");
            }
            if (!this.isAcceptableCallerId(callerId)) {
                throw new Error("XrmSdk.WebAPI.addReference callerId parameter must be a string or null.");
            }
            if (!this.isBoolean(async)) {
                throw new Error("XrmSdk.WebAPI.addReference async parameter must be a boolean.");
            }
            var req = new XMLHttpRequest();
            req.open("PUT", encodeURI(entityUri + "/" + navigationPropertyName + "/$ref?", async));
            req.setRequestHeader("Accept", "application/json");
            if (callerId) {
                req.setRequestHeader("MSCRMCallerID", callerId);
            }
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            var rel = {};
            rel["@odata.id"] = referencedEntityUri;
            if (async) {
                req.onreadystatechange = function () {
                    if (this.readyState == 4 /* complete */) {
                        req.onreadystatechange = null;
                        if (this.status == 204) {
                            if (successCallback)
                                successCallback();
                        }
                        else {
                            if (errorCallback)
                                errorCallback(this.errorHandler(this));
                        }
                    }
                };
                req.send(JSON.stringify(rel));
            }
            else {
                req.send(JSON.stringify(rel));
                if (req.status == 204) {
                    if (successCallback)
                        successCallback();
                }
                else {
                    if (errorCallback)
                        errorCallback(this.errorHandler(this));
                }
            }
        }
        WebAPI.addReference = addReference;
        function invokeBoundFunction(entitySetName, functionName, successCallback, errorCallback, callerId, async) {
            /// <summary>Invoke a bound function</summary>
            /// <param name="entitySetName" type="String">The logical collection name for the entity that the function is bound to.</param>
            /// <param name="functionName" type="String">The name of the bound function you want to invoke</param>        
            /// <param name="successCallback" type="Function">The function to call when the function is invoked. The results of the bound function will be passed to this function.</param>
            /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
            /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
            /// <param name="async" type="Boolean">If 'true', the request will be performed asynchronously, otherwise synchronously</param>
            if (this.isNullOrUndefined(entitySetName)) {
                throw new Error("XrmSdk.WebAPI.invokeBoundFunction entitySetName parameter must not be null or undefined.");
            }
            if (this.isNullOrUndefined(functionName)) {
                throw new Error("XrmSdk.WebAPI.invokeBoundFunction functionName parameter must not be null or undefined.");
            }
            if (!this.isFunctionOrNull(successCallback)) {
                throw new Error("XrmSdk.WebAPI.invokeBoundFunction successCallback parameter must be a function or null.");
            }
            if (!this.isFunctionOrNull(errorCallback)) {
                throw new Error("XrmSdk.WebAPI.invokeBoundFunction errorCallback parameter must be a function or null.");
            }
            if (!this.isAcceptableCallerId(callerId)) {
                throw new Error("XrmSdk.WebAPI.invokeBoundFunction callerId parameter must be a string or null.");
            }
            if (!this.isBoolean(async)) {
                throw new Error("XrmSdk.WebAPI.invokeBoundFunction async parameter must be a boolean.");
            }
            var UriPath = this.getWebAPIPath() + entitySetName + "/" + functionName + "()";
            var req = new XMLHttpRequest();
            req.open("GET", encodeURI(UriPath), async);
            req.setRequestHeader("Accept", "application/json");
            if (callerId) {
                req.setRequestHeader("MSCRMCallerID", callerId);
            }
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            if (async) {
                req.onreadystatechange = function () {
                    if (this.readyState == 4 /* complete */) {
                        req.onreadystatechange = null;
                        if (this.status == 200) {
                            if (successCallback)
                                successCallback(JSON.parse(this.response, this.dateReviver).value);
                        }
                        else {
                            if (errorCallback)
                                errorCallback(this.errorHandler(this));
                        }
                    }
                };
                req.send();
            }
            else {
                req.send();
                if (req.status == 200) {
                    if (successCallback)
                        successCallback(JSON.parse(req.response, this.dateReviver).value);
                }
                else {
                    if (errorCallback)
                        errorCallback(this.errorHandler(this));
                }
            }
        }
        WebAPI.invokeBoundFunction = invokeBoundFunction;
        function invokeUnboundFunction(functionName, parameters, successCallback, errorCallback, callerId, async) {
            /// <summary>Invoke an unbound function</summary>
            /// <param name="functionName" type="String">The name of the unbound function you want to invoke</param>
            /// <param name="parameters" type="Array">An array of strings representing the parameters to pass to the unbound function</param>
            /// <param name="successCallback" type="Function">The function to call when the function is invoked. The results of the unbound function will be passed to this function.</param>
            /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
            /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
            /// <param name="async" type="Boolean">If 'true', the request will be performed asynchronously, otherwise synchronously</param>
            if (this.isNullOrUndefined(functionName)) {
                throw new Error("XrmSdk.WebAPI.invokeUnboundFunction functionName parameter must not be null or undefined.");
            }
            if (!this.isStringArrayOrNull(parameters)) {
                throw new Error("XrmSdk.WebAPI.retrieve parameters parameter must be an array of strings or null.");
            }
            if (!this.isFunctionOrNull(successCallback)) {
                throw new Error("XrmSdk.WebAPI.invokeUnboundFunction successCallback parameter must be a function or null.");
            }
            if (!this.isFunctionOrNull(errorCallback)) {
                throw new Error("XrmSdk.WebAPI.invokeUnboundFunction errorCallback parameter must be a function or null.");
            }
            if (!this.isAcceptableCallerId(callerId)) {
                throw new Error("XrmSdk.WebAPI.invokeUnboundFunction callerId parameter must be a string or null.");
            }
            if (!this.isBoolean(async)) {
                throw new Error("XrmSdk.WebAPI.invokeUnboundFunction async parameter must be a boolean.");
            }
            var UriPath = this.getWebAPIPath() + functionName;
            var parameterNames = [];
            var parameterAliasValues = [];
            var parameterNumber = 1;
            if (parameters) {
                parameters.forEach(function (param) {
                    var keyValue = param.split("=");
                    var name = keyValue[0];
                    var value = keyValue[1];
                    parameterNames.push(name + "=" + "@p" + parameterNumber.toString());
                    parameterAliasValues.push("@p" + parameterNumber.toString() + "=" + value);
                    parameterNumber++;
                });
                UriPath = UriPath + "(" + parameterNames.join(",") + ")?" + parameterAliasValues.join("&");
            }
            else {
                UriPath = UriPath + "()";
            }
            var req = new XMLHttpRequest();
            req.open("GET", encodeURI(UriPath), async);
            req.setRequestHeader("Accept", "application/json");
            if (callerId) {
                req.setRequestHeader("MSCRMCallerID", callerId);
            }
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            if (async) {
                req.onreadystatechange = function () {
                    if (this.readyState == 4 /* complete */) {
                        req.onreadystatechange = null;
                        if (this.status == 200) {
                            if (successCallback)
                                successCallback(JSON.parse(this.response, this.dateReviver));
                        }
                        else {
                            if (errorCallback)
                                errorCallback(this.errorHandler(this));
                        }
                    }
                };
                req.send();
            }
            else {
                req.send();
                if (req.status == 200) {
                    if (successCallback)
                        successCallback(JSON.parse(req.response, this.dateReviver));
                }
                else {
                    if (errorCallback)
                        errorCallback(this.errorHandler(this));
                }
            }
        }
        WebAPI.invokeUnboundFunction = invokeUnboundFunction;
        function invokeUnboundAction(actionName, parameterObj, successCallback, errorCallback, callerId, async) {
            /// <summary>Invoke an unbound action</summary>
            /// <param name="actionName" type="String">The name of the unbound action you want to invoke.</param>
            /// <param name="parameterObj" type="Object">An object that defines parameters expected by the action</param>        
            /// <param name="successCallback" type="Function">The function to call when the action is invoked. The results of the action will be passed to this function.</param>
            /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
            /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
            /// <param name="async" type="Boolean">If 'true', the request will be performed asynchronously, otherwise synchronously</param>
            if (!this.isString(actionName)) {
                throw new Error("XrmSdk.WebAPI.invokeUnboundAction actionName parameter must be a string.");
            }
            if (this.isUndefined(parameterObj)) {
                throw new Error("XrmSdk.WebAPI.invokeUnboundAction parameterObj parameter must not be undefined.");
            }
            if (!this.isFunctionOrNull(successCallback)) {
                throw new Error("XrmSdk.WebAPI.invokeUnboundAction successCallback parameter must be a function or null.");
            }
            if (!this.isFunctionOrNull(errorCallback)) {
                throw new Error("XrmSdk.WebAPI.invokeUnboundAction errorCallback parameter must be a function or null.");
            }
            if (!this.isAcceptableCallerId(callerId)) {
                throw new Error("XrmSdk.WebAPI.invokeUnboundAction callerId parameter must be a string or null.");
            }
            if (!this.isBoolean(async)) {
                throw new Error("XrmSdk.WebAPI.invokeUnboundAction async parameter must be a boolean.");
            }
            var req = new XMLHttpRequest();
            req.open("POST", encodeURI(this.getWebAPIPath() + actionName), async);
            req.setRequestHeader("Accept", "application/json");
            if (callerId) {
                req.setRequestHeader("MSCRMCallerID", callerId);
            }
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            if (async) {
                req.onreadystatechange = function () {
                    if (this.readyState == 4 /* complete */) {
                        req.onreadystatechange = null;
                        if (this.status == 200 || this.status == 201 || this.status == 204) {
                            if (successCallback)
                                switch (this.status) {
                                    case 200:
                                        //When the Action returns a value
                                        successCallback(JSON.parse(this.response, this.dateReviver));
                                        break;
                                    case 201:
                                    case 204:
                                        //When the Action does not return a value
                                        successCallback();
                                        break;
                                    default:
                                        //Should not happen
                                        break;
                                }
                        }
                        else {
                            if (errorCallback)
                                errorCallback(this.errorHandler(this));
                        }
                    }
                };
                if (parameterObj) {
                    req.send(JSON.stringify(parameterObj));
                }
                else {
                    req.send();
                }
            }
            else {
                if (parameterObj) {
                    req.send(JSON.stringify(parameterObj));
                }
                else {
                    req.send();
                }
                switch (req.status) {
                    case 200:
                        //When the Action returns a value
                        successCallback(JSON.parse(req.response, this.dateReviver));
                        break;
                    case 201:
                    case 204:
                        //When the Action does not return a value
                        successCallback();
                        break;
                    default:
                        //Should not happen
                        break;
                }
            }
        }
        WebAPI.invokeUnboundAction = invokeUnboundAction;
        function queryEntitySet(entitySetName, query, includeFormattedValues, maxPageSize, successCallback, errorCallback, callerId, async) {
            /// <summary>Retrieve multiple entities</summary>
            /// <param name="entitySetName" type="String">The logical collection name for the type of entity you want to retrieve.</param>
            /// <param name="query" type="String">The system query parameters you want to apply.</param> 
            /// <param name="includeFormattedValues" type="Boolean">Whether you want to have formatted values included in the results</param> 
            /// <param name="maxPageSize" type="Number">A number that limits the number of entities to be retrieved in the query.</param> 
            /// <param name="successCallback" type="Function">The function to call when the entities are returned. The results of the query will be passed to this function.</param>
            /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
            /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
            /// <param name="async" type="Boolean">If 'true', the request will be performed asynchronously, otherwise synchronously</param>
            if (!this.isString(entitySetName)) {
                throw new Error("XrmSdk.WebAPI.queryEntitySet entitySetName parameter must be a string.");
            }
            if (!this.isStringOrNull(query)) {
                throw new Error("XrmSdk.WebAPI.queryEntitySet query parameter must be a string or null.");
            }
            if (!this.isBooleanOrNull(includeFormattedValues)) {
                throw new Error("XrmSdk.WebAPI.queryEntitySet includeFormattedValues parameter must be a boolean or null.");
            }
            if (!this.isNumberOrNull(maxPageSize)) {
                throw new Error("XrmSdk.WebAPI.queryEntitySet maxPageSize parameter must be a number or null.");
            }
            if (!this.isFunctionOrNull(successCallback)) {
                throw new Error("XrmSdk.WebAPI.queryEntitySet successCallback parameter must be a function or null.");
            }
            if (!this.isFunctionOrNull(errorCallback)) {
                throw new Error("XrmSdk.WebAPI.queryEntitySet errorCallback parameter must be a function or null.");
            }
            if (!this.isAcceptableCallerId(callerId)) {
                throw new Error("XrmSdk.WebAPI.queryEntitySet callerId parameter must be a string or null.");
            }
            if (!this.isBoolean(async)) {
                throw new Error("XrmSdk.WebAPI.queryEntitySet async parameter must be a boolean.");
            }
            var url = this.getWebAPIPath() + entitySetName;
            if (!this.isNull(query)) {
                url = url + "?" + query;
            }
            var req = new XMLHttpRequest();
            req.open("GET", encodeURI(url), async);
            req.setRequestHeader("Accept", "application/json");
            if (callerId) {
                req.setRequestHeader("MSCRMCallerID", callerId);
            }
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            if (includeFormattedValues && maxPageSize) {
                req.setRequestHeader("Prefer", "odata.include-annotations=\"mscrm.formattedvalue\",odata.maxpagesize=" + maxPageSize);
            }
            else {
                if (includeFormattedValues) {
                    req.setRequestHeader("Prefer", "odata.include-annotations=\"mscrm.formattedvalue\"");
                }
                if (maxPageSize) {
                    req.setRequestHeader("Prefer", "odata.maxpagesize=" + maxPageSize);
                }
            }
            if (async) {
                req.onreadystatechange = function () {
                    if (this.readyState == 4 /* complete */) {
                        req.onreadystatechange = null;
                        if (this.status == 200) {
                            if (successCallback)
                                successCallback(JSON.parse(this.response, this.dateReviver));
                        }
                        else {
                            if (errorCallback)
                                errorCallback(this.errorHandler(this));
                        }
                    }
                };
                req.send();
            }
            else {
                req.send();
                if (req.status == 200) {
                    if (successCallback)
                        successCallback(JSON.parse(req.response, this.dateReviver));
                }
                else {
                    if (errorCallback)
                        errorCallback(this.errorHandler(this));
                }
            }
        }
        WebAPI.queryEntitySet = queryEntitySet;
        function getNextPage(query, includeFormattedValues, maxPageSize, successCallback, errorCallback, callerId, async) {
            /// <summary>Return the next page of a retrieve multiple query when there are additional pages.</summary>
            /// <param name="query" type="String">The value of the @odata.nextLink property for the results of a queryEntitySet query when there are more pages.</param>
            /// <param name="includeFormattedValues" type="Boolean">Whether you want to have formatted values included in the results</param> 
            /// <param name="maxPageSize" type="Number">A number that limits the number of entities to be retrieved in the query.</param> 
            /// <param name="successCallback" type="Function">The function to call when the entities are returned. The results of the query will be passed to this function.</param>
            /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
            /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
            /// <param name="async" type="Boolean">If 'true', the request will be performed asynchronously, otherwise synchronously</param>
            if (!this.isStringOrNull(query)) {
                throw new Error("XrmSdk.WebAPI.getNextPage query parameter must be a string or null.");
            }
            if (!this.isBooleanOrNull(includeFormattedValues)) {
                throw new Error("XrmSdk.WebAPI.getNextPage includeFormattedValues parameter must be a boolean or null.");
            }
            if (!this.isNumberOrNull(maxPageSize)) {
                throw new Error("XrmSdk.WebAPI.getNextPage maxPageSize parameter must be a number or null.");
            }
            if (!this.isFunctionOrNull(successCallback)) {
                throw new Error("XrmSdk.WebAPI.getNextPage successCallback parameter must be a function or null.");
            }
            if (!this.isFunctionOrNull(errorCallback)) {
                throw new Error("XrmSdk.WebAPI.getNextPage errorCallback parameter must be a function or null.");
            }
            if (!this.isAcceptableCallerId(callerId)) {
                throw new Error("XrmSdk.WebAPI.getNextPage callerId parameter must be a string or null.");
            }
            if (!this.isBoolean(async)) {
                throw new Error("XrmSdk.WebAPI.getNextPage async parameter must be a boolean.");
            }
            var req = new XMLHttpRequest();
            //Not encoding the URI because it came from the system
            req.open("GET", query, async);
            req.setRequestHeader("Accept", "application/json");
            if (callerId) {
                req.setRequestHeader("MSCRMCallerID", callerId);
            }
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            if (includeFormattedValues) {
                req.setRequestHeader("Prefer", "odata.include-annotations=\"mscrm.formattedvalue\"");
            }
            if (maxPageSize) {
                req.setRequestHeader("Prefer", "odata.maxpagesize=" + maxPageSize);
            }
            if (async) {
                req.onreadystatechange = function () {
                    if (this.readyState == 4 /* complete */) {
                        req.onreadystatechange = null;
                        if (this.status == 200) {
                            if (successCallback)
                                successCallback(JSON.parse(this.response, this.dateReviver));
                        }
                        else {
                            if (errorCallback)
                                errorCallback(this.errorHandler(this));
                        }
                    }
                };
                req.send();
            }
            else {
                req.send();
                if (req.status == 200) {
                    if (successCallback)
                        successCallback(JSON.parse(req.response, this.dateReviver));
                }
                else {
                    if (errorCallback)
                        errorCallback(this.errorHandler(this));
                }
            }
        }
        WebAPI.getNextPage = getNextPage;
        function executeBatch(payload, batchId, successCallback, errorCallback, callerId, async) {
            /// <summary>Execute several operations at once</summary>
            /// <param name="payload" type="String">A string describing the operations to perform in the batch</param>  
            /// <param name="batchId" type="String">A string containing the Id used for the batch</param>   
            /// <param name="successCallback" type="Function">The function to call when the actions are completed. The results of the operation will be passed to this function.</param>
            /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
            /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
            /// <param name="async" type="Boolean">If 'true', the request will be performed asynchronously, otherwise synchronously</param>
            if (!this.isString(payload)) {
                throw new Error("XrmSdk.WebAPI.executeBatch payload parameter must be a string.");
            }
            if (!this.isString(batchId)) {
                throw new Error("XrmSdk.WebAPI.executeBatch batchId parameter must be a string.");
            }
            if (!this.isFunctionOrNull(successCallback)) {
                throw new Error("XrmSdk.WebAPI.executeBatch successCallback parameter must be a function or null.");
            }
            if (!this.isFunctionOrNull(errorCallback)) {
                throw new Error("XrmSdk.WebAPI.executeBatch errorCallback parameter must be a function or null.");
            }
            if (!this.isAcceptableCallerId(callerId)) {
                throw new Error("XrmSdk.WebAPI.executeBatch callerId parameter must be a string or null.");
            }
            if (!this.isBoolean(async)) {
                throw new Error("XrmSdk.WebAPI.executeBatch async parameter must be a boolean.");
            }
            var req = new XMLHttpRequest();
            req.open("POST", encodeURI(this.getWebAPIPath() + "$batch"), async);
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "multipart/mixed;boundary=batch_" + batchId);
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            if (async) {
                req.onreadystatechange = function () {
                    if (this.readyState == 4 /* complete */) {
                        req.onreadystatechange = null;
                        if (this.status == 200) {
                            if (successCallback) {
                                successCallback(this.response);
                            }
                        }
                        else {
                            if (errorCallback)
                                errorCallback(this.errorHandler(this));
                        }
                    }
                };
                req.send(payload);
            }
            else {
                req.send(payload);
                if (req.status == 200) {
                    if (successCallback) {
                        successCallback(req.response);
                    }
                }
                else {
                    if (errorCallback)
                        errorCallback(this.errorHandler(this));
                }
            }
        }
        WebAPI.executeBatch = executeBatch;
        function getEntityList(successCallback, errorCallback, async) {
            /// <summary>Retrieve an array of entities available from the service</summary>
            /// <param name="successCallback" type="Function">The function to call when the results are returned. The results of the operation will be passed to this function.</param>
            /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
            /// <param name="async" type="Boolean">If 'true', the request will be performed asynchronously, otherwise synchronously</param>
            if (!this.isFunctionOrNull(successCallback)) {
                throw new Error("XrmSdk.WebAPI.getEntityList successCallback parameter must be a function or null.");
            }
            if (!this.isFunctionOrNull(errorCallback)) {
                throw new Error("XrmSdk.WebAPI.getEntityList errorCallback parameter must be a function or null.");
            }
            if (!this.isBoolean(async)) {
                throw new Error("XrmSdk.WebAPI.getEntityList async parameter must be a boolean.");
            }
            var req = new XMLHttpRequest();
            req.open("GET", encodeURI(this.getWebAPIPath()), async);
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            if (async) {
                req.onreadystatechange = function () {
                    if (this.readyState == 4 /* complete */) {
                        req.onreadystatechange = null;
                        if (this.status == 200) {
                            if (successCallback)
                                successCallback(JSON.parse(this.response).value);
                        }
                        else {
                            if (errorCallback)
                                errorCallback(this.errorHandler(this));
                        }
                    }
                };
                req.send();
            }
            else {
                req.send();
                if (req.status == 200) {
                    if (successCallback)
                        successCallback(JSON.parse(req.response).value);
                }
                else {
                    if (errorCallback)
                        errorCallback(this.errorHandler(this));
                }
            }
        }
        WebAPI.getEntityList = getEntityList;
        //A helper for generating a unique changelist value for execute batch
        function getRandomId() {
            /// <summary>Generates a random set of 10 characters to use when defining a changelist with XrmSdk.WebAPI.executeBatch</summary>
            return this.getId();
        }
        WebAPI.getRandomId = getRandomId;
        //Internal supporting functions
        function dateReviver(key, value) {
            var a;
            if (typeof value === 'string') {
                a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                if (a) {
                    return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
                }
            }
            return value;
        }
        WebAPI.dateReviver = dateReviver;
        function getContext() {
            if (typeof GetGlobalContext != "undefined") {
                return GetGlobalContext();
            }
            else {
                if (typeof Xrm != "undefined") {
                    return Xrm.Page.context;
                }
                else {
                    throw new Error("Context is not available.");
                }
            }
        }
        WebAPI.getContext = getContext;
        function getClientUrl() {
            return this.getContext().getClientUrl();
        }
        WebAPI.getClientUrl = getClientUrl;
        function getWebAPIPath() {
            return this.getClientUrl() + "/api/data/v8.0/";
        }
        WebAPI.getWebAPIPath = getWebAPIPath;
        function getId(idLength) {
            if (this.isNullOrUndefined(idLength))
                idLength = 10;
            if (this.isNumber(idLength)) {
                if (idLength > 30) {
                    throw new Error("Length must be less than 30.");
                }
            }
            else {
                throw new Error("Length must be a number.");
            }
            var returnValue = "";
            var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < idLength; i++)
                returnValue += characters.charAt(Math.floor(Math.random() * characters.length));
            return returnValue;
        }
        WebAPI.getId = getId;
        //Internal validation functions
        function isFunctionOrNullOrUndefined(obj) {
            if (this.isNullOrUndefined(obj)) {
                return true;
            }
            if (this.isFunction(obj)) {
                return true;
            }
            return false;
        }
        WebAPI.isFunctionOrNullOrUndefined = isFunctionOrNullOrUndefined;
        function isFunctionOrNull(obj) {
            if (this.isNull(obj)) {
                return true;
            }
            if (this.isFunction(obj)) {
                return true;
            }
            return false;
        }
        WebAPI.isFunctionOrNull = isFunctionOrNull;
        function isFunction(obj) {
            if (typeof obj === "function") {
                return true;
            }
            return false;
        }
        WebAPI.isFunction = isFunction;
        function isString(obj) {
            if (typeof obj === "string") {
                return true;
            }
            return false;
        }
        WebAPI.isString = isString;
        function isNumberOrNull(obj) {
            if (this.isNull(obj)) {
                return true;
            }
            if (this.isNumber(obj)) {
                return true;
            }
            return false;
        }
        WebAPI.isNumberOrNull = isNumberOrNull;
        function isNumber(obj) {
            if (typeof obj === "number") {
                return true;
            }
            return false;
        }
        WebAPI.isNumber = isNumber;
        function isNull(obj) {
            if (obj === null) {
                return true;
            }
            return false;
        }
        WebAPI.isNull = isNull;
        function isStringOrNullOrUndefined(obj) {
            if (this.isStringOrNull(obj)) {
                return true;
            }
            if (this.isUndefined(obj)) {
                return true;
            }
            return false;
        }
        WebAPI.isStringOrNullOrUndefined = isStringOrNullOrUndefined;
        function isStringOrNull(obj) {
            if (this.isNull(obj)) {
                return true;
            }
            if (this.isString(obj)) {
                return true;
            }
            return false;
        }
        WebAPI.isStringOrNull = isStringOrNull;
        function isStringArrayOrNull(obj) {
            if (this.isNull(obj)) {
                return true;
            }
            return this.isStringArray(obj);
        }
        WebAPI.isStringArrayOrNull = isStringArrayOrNull;
        function isStringArray(obj) {
            if (this.isArray(obj)) {
                obj.forEach(function (item) {
                    if (!this.isString(item)) {
                        return false;
                    }
                });
                return true;
            }
            return false;
        }
        WebAPI.isStringArray = isStringArray;
        function isAcceptableCallerId(obj) {
            if (this.isString(obj))
                return true;
            if (this.isNullOrUndefined(obj)) {
                obj = false;
                return true;
            }
            return false;
        }
        WebAPI.isAcceptableCallerId = isAcceptableCallerId;
        function isArray(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }
        WebAPI.isArray = isArray;
        function isBooleanOrNullOrUndefined(obj) {
            if (this.isBooleanOrNull(obj)) {
                return true;
            }
            if (this.isUndefined(obj)) {
                return true;
            }
            return false;
        }
        WebAPI.isBooleanOrNullOrUndefined = isBooleanOrNullOrUndefined;
        function isBooleanOrNull(obj) {
            if (this.isNull(obj)) {
                return true;
            }
            if (this.isBoolean(obj)) {
                return true;
            }
            return false;
        }
        WebAPI.isBooleanOrNull = isBooleanOrNull;
        function isBoolean(obj) {
            if (typeof obj === "boolean") {
                return true;
            }
            return false;
        }
        WebAPI.isBoolean = isBoolean;
        function isNullOrUndefined(obj) {
            if (this.isNull(obj) || this.isUndefined(obj)) {
                return true;
            }
            return false;
        }
        WebAPI.isNullOrUndefined = isNullOrUndefined;
        function isUndefined(obj) {
            if (typeof obj === "undefined") {
                return true;
            }
            return false;
        }
        WebAPI.isUndefined = isUndefined;
        // This function is called when an error callback parses the JSON response
        // It is a public function because the error callback occurs within the onreadystatechange 
        // event handler and an internal function would not be in scope.
        function errorHandler(resp) {
            switch (resp.status) {
                case 503:
                    return new Error(resp.statusText + " Status Code:" + resp.status + " The Web API Preview is not enabled.");
                default:
                    return new Error("Status Code:" + resp.status + " " + this.parseError(resp));
            }
        }
        WebAPI.errorHandler = errorHandler;
        // During the web API preview some errors will have an error property or a Message Property.
        // This function parses the message from either
        function parseError(resp) {
            var errorObj = JSON.parse(resp.response);
            if (!this.isNullOrUndefined(errorObj.error)) {
                return errorObj.error.message;
            }
            if (!this.isNullOrUndefined(errorObj.Message)) {
                return errorObj.Message;
            }
            return "Unexpected Error";
        }
        WebAPI.parseError = parseError;
    })(WebAPI = XrmSdk.WebAPI || (XrmSdk.WebAPI = {}));
})(XrmSdk || (XrmSdk = {}));
//# sourceMappingURL=XrmSdk.WebAPI.js.map