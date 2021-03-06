// =========================================================================================
//  CRM Entity: Contact
//  This is a generated file, generated by XrmSdk.TSEntityClassGenerator, 
//  developed by Peder Moeller Wagner, ProActive (http://en.proactive.dk)
//  ProActive is a Microsoft Gold Partner, and one of the leading MS CRM partners in Denmark
//
//  Project: https://github.com/pederwagner/XrmSdkWebAPI
// =========================================================================================

"use strict";

module XrmSdk.ContactOptionSetValues {

    export var AccountRoleCodeValues: any = {
        Decision_Maker: 1,
        Employee: 2,
        Influencer: 3
    }

    export var Address1_AddressTypeCodeValues: any = {
        Bill_To: 1,
        Ship_To: 2,
        Primary: 3,
        Other: 4
    }

    export var Address1_FreightTermsCodeValues: any = {
        FOB: 1,
        No_Charge: 2
    }

    export var Address1_ShippingMethodCodeValues: any = {
        Airborne: 1,
        DHL: 2,
        FedEx: 3,
        UPS: 4,
        Postal_Mail: 5,
        Full_Load: 6,
        Will_Call: 7
    }

    export var Address2_AddressTypeCodeValues: any = {
        Default_Value: 1
    }

    export var Address2_FreightTermsCodeValues: any = {
        Default_Value: 1
    }

    export var Address2_ShippingMethodCodeValues: any = {
        Default_Value: 1
    }

    export var Address3_AddressTypeCodeValues: any = {
        Default_Value: 1
    }

    export var Address3_FreightTermsCodeValues: any = {
        Default_Value: 1
    }

    export var Address3_ShippingMethodCodeValues: any = {
        Default_Value: 1
    }

    export var CustomerSizeCodeValues: any = {
        Default_Value: 1
    }

    export var CustomerTypeCodeValues: any = {
        Default_Value: 1
    }

    export var EducationCodeValues: any = {
        Default_Value: 1
    }

    export var FamilyStatusCodeValues: any = {
        Single: 1,
        Married: 2,
        Divorced: 3,
        Widowed: 4
    }

    export var GenderCodeValues: any = {
        Male: 1,
        Female: 2
    }

    export var HasChildrenCodeValues: any = {
        Default_Value: 1
    }

    export var LeadSourceCodeValues: any = {
        Default_Value: 1
    }

    export var PaymentTermsCodeValues: any = {
        Net_30: 1,
        _2Pct_10_Net_30: 2,
        Net_45: 3,
        Net_60: 4
    }

    export var PreferredAppointmentDayCodeValues: any = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6
    }

    export var PreferredAppointmentTimeCodeValues: any = {
        Morning: 1,
        Afternoon: 2,
        Evening: 3
    }

    export var PreferredContactMethodCodeValues: any = {
        Any: 1,
        Email: 2,
        Phone: 3,
        Fax: 4,
        Mail: 5
    }

    export var ShippingMethodCodeValues: any = {
        Default_Value: 1
    }

    export var TerritoryCodeValues: any = {
        Default_Value: 1
    }

    export var pa_CaseAccessLevelValues: any = {
        Contact: 953830001,
        Account: 953830002
    }

    export var pa_DemoEventtrackValues: any = {
        _1: 500000000,
        _2: 500000001,
        _3: 500000002,
        _4: 500000003,
        _5: 500000004
    }

}

module XrmSdk {

    export class Contact implements Entity {
        [index: string]: any;
        public static get ODataType(): string { return "Microsoft.Dynamics.CRM.contact"; }
        public static get EntityDataSetName(): string { return "contacts"; }
        public static get EntityLogicalName(): string { return "contact"; }

        // Attributes
        _accountid_value: string = undefined;
        accountrolecode: number = undefined;
        address1_addressid: string = undefined;
        address1_addresstypecode: number = undefined;
        address1_city: string = undefined;
        address1_composite: string = undefined;
        address1_country: string = undefined;
        address1_county: string = undefined;
        address1_fax: string = undefined;
        address1_freighttermscode: number = undefined;
        address1_latitude: number = undefined;
        address1_line1: string = undefined;
        address1_line2: string = undefined;
        address1_line3: string = undefined;
        address1_longitude: number = undefined;
        address1_name: string = undefined;
        address1_postalcode: string = undefined;
        address1_postofficebox: string = undefined;
        address1_primarycontactname: string = undefined;
        address1_shippingmethodcode: number = undefined;
        address1_stateorprovince: string = undefined;
        address1_telephone1: string = undefined;
        address1_telephone2: string = undefined;
        address1_telephone3: string = undefined;
        address1_upszone: string = undefined;
        address1_utcoffset: number = undefined;
        address2_addressid: string = undefined;
        address2_addresstypecode: number = undefined;
        address2_city: string = undefined;
        address2_composite: string = undefined;
        address2_country: string = undefined;
        address2_county: string = undefined;
        address2_fax: string = undefined;
        address2_freighttermscode: number = undefined;
        address2_latitude: number = undefined;
        address2_line1: string = undefined;
        address2_line2: string = undefined;
        address2_line3: string = undefined;
        address2_longitude: number = undefined;
        address2_name: string = undefined;
        address2_postalcode: string = undefined;
        address2_postofficebox: string = undefined;
        address2_primarycontactname: string = undefined;
        address2_shippingmethodcode: number = undefined;
        address2_stateorprovince: string = undefined;
        address2_telephone1: string = undefined;
        address2_telephone2: string = undefined;
        address2_telephone3: string = undefined;
        address2_upszone: string = undefined;
        address2_utcoffset: number = undefined;
        address3_addressid: string = undefined;
        address3_addresstypecode: number = undefined;
        address3_city: string = undefined;
        address3_composite: string = undefined;
        address3_country: string = undefined;
        address3_county: string = undefined;
        address3_fax: string = undefined;
        address3_freighttermscode: number = undefined;
        address3_latitude: number = undefined;
        address3_line1: string = undefined;
        address3_line2: string = undefined;
        address3_line3: string = undefined;
        address3_longitude: number = undefined;
        address3_name: string = undefined;
        address3_postalcode: string = undefined;
        address3_postofficebox: string = undefined;
        address3_primarycontactname: string = undefined;
        address3_shippingmethodcode: number = undefined;
        address3_stateorprovince: string = undefined;
        address3_telephone1: string = undefined;
        address3_telephone2: string = undefined;
        address3_telephone3: string = undefined;
        address3_upszone: string = undefined;
        address3_utcoffset: number = undefined;
        aging30: number = undefined;
        aging30_base: number = undefined;
        aging60: number = undefined;
        aging60_base: number = undefined;
        aging90: number = undefined;
        aging90_base: number = undefined;
        anniversary: Date = undefined;
        annualincome: number = undefined;
        annualincome_base: number = undefined;
        assistantname: string = undefined;
        assistantphone: string = undefined;
        birthdate: Date = undefined;
        business2: string = undefined;
        callback: string = undefined;
        cdi_age: number = undefined;
        cdi_allowtextmessages: boolean = undefined;
        cdi_facebook: string = undefined;
        cdi_gender: boolean = undefined;
        cdi_grade: string = undefined;
        cdi_identifiedon: Date = undefined;
        cdi_image: string = undefined;
        cdi_ip: string = undefined;
        cdi_latitude: string = undefined;
        cdi_linkedin: string = undefined;
        cdi_longitude: string = undefined;
        cdi_partitionkey: string = undefined;
        cdi_rowkey: string = undefined;
        cdi_score: number = undefined;
        cdi_social: string = undefined;
        cdi_totalscore: number = undefined;
        cdi_twitter: string = undefined;
        cdi_visitorkey: string = undefined;
        childrensnames: string = undefined;
        company: string = undefined;
        contactid: string = undefined;
        public set_createdby(id: string) {
            this["createdby@odata.bind"] = `/systemusers(${id})`;
        }
        _createdbyexternalparty_value: string = undefined;
        _createdby_value: string = undefined;
        createdon: Date = undefined;
        public set_createdonbehalfby(id: string) {
            this["createdonbehalfby@odata.bind"] = `/systemusers(${id})`;
        }
        _createdonbehalfby_value: string = undefined;
        creditlimit: number = undefined;
        creditlimit_base: number = undefined;
        creditonhold: boolean = undefined;
        customersizecode: number = undefined;
        customertypecode: number = undefined;
        public set_defaultpricelevelid(id: string) {
            this["defaultpricelevelid@odata.bind"] = `/pricelevels(${id})`;
        }
        _defaultpricelevelid_value: string = undefined;
        department: string = undefined;
        description: string = undefined;
        donotbulkemail: boolean = undefined;
        donotbulkpostalmail: boolean = undefined;
        donotemail: boolean = undefined;
        donotfax: boolean = undefined;
        donotphone: boolean = undefined;
        donotpostalmail: boolean = undefined;
        donotsendmm: boolean = undefined;
        educationcode: number = undefined;
        emailaddress1: string = undefined;
        emailaddress2: string = undefined;
        emailaddress3: string = undefined;
        employeeid: string = undefined;
        entityimage: string = undefined;
        entityimageid: string = undefined;
        entityimage_timestamp: number = undefined;
        entityimage_url: string = undefined;
        exchangerate: number = undefined;
        externaluseridentifier: string = undefined;
        familystatuscode: number = undefined;
        fax: string = undefined;
        firstname: string = undefined;
        ftpsiteurl: string = undefined;
        fullname: string = undefined;
        gendercode: number = undefined;
        governmentid: string = undefined;
        haschildrencode: number = undefined;
        home2: string = undefined;
        importsequencenumber: number = undefined;
        isbackofficecustomer: boolean = undefined;
        jobtitle: string = undefined;
        lasso_id: string = undefined;
        lastname: string = undefined;
        lastonholdtime: Date = undefined;
        lastusedincampaign: Date = undefined;
        leadsourcecode: number = undefined;
        managername: string = undefined;
        managerphone: string = undefined;
        public set_masterid(id: string) {
            this["masterid@odata.bind"] = `/contacts(${id})`;
        }
        _masterid_value: string = undefined;
        merged: boolean = undefined;
        middlename: string = undefined;
        mobilephone: string = undefined;
        public set_modifiedby(id: string) {
            this["modifiedby@odata.bind"] = `/systemusers(${id})`;
        }
        _modifiedbyexternalparty_value: string = undefined;
        _modifiedby_value: string = undefined;
        modifiedon: Date = undefined;
        public set_modifiedonbehalfby(id: string) {
            this["modifiedonbehalfby@odata.bind"] = `/systemusers(${id})`;
        }
        _modifiedonbehalfby_value: string = undefined;
        msdyncrm_microsoftdynamicsmarketingpublishtag: string = undefined;
        nickname: string = undefined;
        numberofchildren: number = undefined;
        onholdtime: number = undefined;
        public set_originatingleadid(id: string) {
            this["originatingleadid@odata.bind"] = `/leads(${id})`;
        }
        _originatingleadid_value: string = undefined;
        overriddencreatedon: Date = undefined;
        public set_ownerid(id: string) {
            this["ownerid@odata.bind"] = `/principals(${id})`;
        }
        _ownerid_value: string = undefined;
        public set_owningbusinessunit(id: string) {
            this["owningbusinessunit@odata.bind"] = `/businessunits(${id})`;
        }
        _owningbusinessunit_value: string = undefined;
        public set_owningteam(id: string) {
            this["owningteam@odata.bind"] = `/teams(${id})`;
        }
        _owningteam_value: string = undefined;
        public set_owninguser(id: string) {
            this["owninguser@odata.bind"] = `/systemusers(${id})`;
        }
        _owninguser_value: string = undefined;
        pa_accountnamefromsignup: string = undefined;
        pa_caseaccesslevel: number = undefined;
        pa_democompanyname: string = undefined;
        pa_demoemail: string = undefined;
        pa_demoeventcode: string = undefined;
        pa_demoeventtrack: number = undefined;
        pa_demofirstname: string = undefined;
        pa_demofood: string = undefined;
        pa_demolastname: string = undefined;
        pa_demopersonalmeeting: boolean = undefined;
        pa_eventaddress: string = undefined;
        pa_eventcity: string = undefined;
        pa_eventend: Date = undefined;
        pa_eventlocation: string = undefined;
        pa_eventname: string = undefined;
        pa_eventstart: Date = undefined;
        pa_eventzippostalcode: string = undefined;
        pa_formid: string = undefined;
        pager: string = undefined;
        pa_isallowedcasecreation: boolean = undefined;
        pa_mossusername: string = undefined;
        pa_newsletter: boolean = undefined;
        _parentcontactid_value: string = undefined;
        public set_parentcustomerid_account(id: string) {
            this["parentcustomerid_account@odata.bind"] = `/accounts(${id})`;
        }
        public set_parentcustomerid_contact(id: string) {
            this["parentcustomerid_contact@odata.bind"] = `/contacts(${id})`;
        }
        _parentcustomerid_value: string = undefined;
        participatesinworkflow: boolean = undefined;
        pa_testmetadata: string = undefined;
        pa_webformaccount: string = undefined;
        pa_webformfirstname: string = undefined;
        pa_webformlastname: string = undefined;
        pa_webformmessage: string = undefined;
        pa_webformtelephone: string = undefined;
        pa_welcomemailsend: boolean = undefined;
        paymenttermscode: number = undefined;
        preferredappointmentdaycode: number = undefined;
        preferredappointmenttimecode: number = undefined;
        preferredcontactmethodcode: number = undefined;
        public set_preferredequipmentid(id: string) {
            this["preferredequipmentid@odata.bind"] = `/equipments(${id})`;
        }
        _preferredequipmentid_value: string = undefined;
        public set_preferredserviceid(id: string) {
            this["preferredserviceid@odata.bind"] = `/services(${id})`;
        }
        _preferredserviceid_value: string = undefined;
        public set_preferredsystemuserid(id: string) {
            this["preferredsystemuserid@odata.bind"] = `/systemusers(${id})`;
        }
        _preferredsystemuserid_value: string = undefined;
        processid: string = undefined;
        salutation: string = undefined;
        shippingmethodcode: number = undefined;
        public set_sla_contact_sla(id: string) {
            this["sla_contact_sla@odata.bind"] = `/slas(${id})`;
        }
        _slaid_value: string = undefined;
        public set_slainvokedid_contact_sla(id: string) {
            this["slainvokedid_contact_sla@odata.bind"] = `/slas(${id})`;
        }
        _slainvokedid_value: string = undefined;
        spousesname: string = undefined;
        stageid: string = undefined;
        statecode: number = undefined;
        statuscode: number = undefined;
        subscriptionid: string = undefined;
        suffix: string = undefined;
        telephone1: string = undefined;
        telephone2: string = undefined;
        telephone3: string = undefined;
        territorycode: number = undefined;
        timezoneruleversionnumber: number = undefined;
        public set_transactioncurrencyid(id: string) {
            this["transactioncurrencyid@odata.bind"] = `/transactioncurrencys(${id})`;
        }
        _transactioncurrencyid_value: string = undefined;
        traversedpath: string = undefined;
        utcconversiontimezonecode: number = undefined;
        versionnumber: number = undefined;
        websiteurl: string = undefined;
        yomifirstname: string = undefined;
        yomifullname: string = undefined;
        yomilastname: string = undefined;
        yomimiddlename: string = undefined;


        public static castFromEntity(entity: Entity): Contact {
            var sdkEntity = new Contact();
            for (var attribute in entity) {
                if (entity.hasOwnProperty(attribute)) {
                    sdkEntity[attribute] = entity[attribute];
                }
            }
            return sdkEntity;
        }
    }
}
