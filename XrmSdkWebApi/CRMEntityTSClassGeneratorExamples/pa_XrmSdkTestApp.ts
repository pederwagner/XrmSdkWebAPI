/// <reference path="$FilePath$/../lib/angular/angular.d.ts" />
/// <reference path="$FilePath$/../lib/XrmSdk.Contact.ts" />
/// <reference path="$FilePath$/../../XrmSdk.WebAPI/XrmSdk.Interfaces.d.ts" />
/// <reference path="$FilePath$/../../XrmSdk.WebAPI/XrmSdk.WebAPI.ts" />

module XrmServiceToolkitTestApp {
    "use strict";

    import attributeNames = XrmSdk.ContactAttributeNames;

    interface IDefaultScope extends ng.IScope {
        vm: DefaultCtrl;
    }

    interface IMaritalStatusOption {
        name: string;
        value: number;
    }

    class DefaultCtrl {
        

        // Controller constructor
        constructor(private $scope: IDefaultScope) {
            $scope.vm = this;

            // Populate list of OptionSet
            this.maritalsStatusOptions = new Array();
            for (var propertyName in XrmSdk.ContactOptionSetValues.FamilyStatusCodeValues) {
                if (XrmSdk.ContactOptionSetValues.FamilyStatusCodeValues.hasOwnProperty(propertyName)) {
                    this.maritalsStatusOptions.push({ name: propertyName.replace("_", " "), value: XrmSdk.ContactOptionSetValues.FamilyStatusCodeValues[propertyName] });
                }
            }
        }

        // Search parameters
        searchFirstName: string;
        searchLastName: string;

        // "Enum" for holding OptionSetValues
        maritalsStatusOptions: IMaritalStatusOption[];

        // Contact info fields
        id: string;
        firstname: string;
        lastname: string;
        maritalstatus: IMaritalStatusOption;

        test: string = "Hej";

        search() {
            var self = this;
            this.id = null;
            this.firstname = null;
            this.lastname = null;
            this.maritalstatus = null;

            // Example of using generated attributes to create filter for querying CRM
            var options = "$filter="
                + "startswith(" + attributeNames.FirstName + ", 'TEST_" + this.searchFirstName + "')"
                + " and startswith(" + attributeNames.LastName + ", 'TEST_" + this.searchLastName + "')";

            XrmSdk.WebAPI.queryEntitySet(XrmSdk.Contact.EntityDataSetName, options, false, 1,
                (data) => {
                    if (data.value.length > 0) {
                        var firstResult = XrmSdk.Contact.castFromEntity(data.value[0]);
                        this.id = firstResult.contactid;
                        this.firstname = firstResult.firstname.substring(5);
                        this.lastname = firstResult.lastname.substring(5);

                        if (firstResult.familystatuscode != null) {
                            this.maritalsStatusOptions.forEach(option => {
                                if (option.value === firstResult.familystatuscode) {
                                    this.maritalstatus = option;
                                }
                            });
                        }
                        self.$scope.$apply();
                    }
                }, (error) => {
                    var temp = error;
                },
                null,
                true);
        }

        create() {
            var self = this;
            var newContact = new XrmSdk.Contact();
            newContact.firstname = "TEST_" + this.firstname;
            newContact.lastname = "TEST_" + this.lastname;

            if (this.maritalstatus != null) {
                newContact.familystatuscode = this.maritalstatus.value;
            }

            XrmSdk.WebAPI.create(XrmSdk.Contact.EntityDataSetName, newContact, null, true).then((success) => {
                // Example of casting return object to generated type
                var tempUri = success;
                var webApiUrl = XrmSdk.WebAPI.getWebAPIPath();
                this.id = success.substring(webApiUrl.length + XrmSdk.Contact.EntityDataSetName.length + 1, tempUri.length -1);
                self.$scope.$apply();
                alert("created");
            });
        }

        update() {
            var contactUpdate = new XrmSdk.Contact();
            contactUpdate.firstname = "TEST_" + this.firstname;
            contactUpdate.lastname = "TEST_" + this.lastname;

            if (this.maritalstatus != null) {
                contactUpdate.familystatuscode = this.maritalstatus.value;
            }

            XrmSdk.WebAPI.update(XrmSdk.Contact.EntityDataSetName, this.id, contactUpdate, null, true)
                .then(() => {
                    alert("Updated!");
                }).catch((error: Error) => {
                    alert(error.message);
                });
        }
    }




    var xrmSdkTestModule = angular.module('xrmSdkTestModule', [])
        .controller('defaultCtrl', ['$scope', DefaultCtrl]);
}
