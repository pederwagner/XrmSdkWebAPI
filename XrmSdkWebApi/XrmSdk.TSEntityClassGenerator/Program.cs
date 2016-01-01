using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Metadata;
using Microsoft.Xrm.Sdk.Metadata.Query;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Tooling.Connector;

namespace CRMEntityTSClassGenerator
{
    class Program
    {
        static void Main(string[] args)
        {
            var _languageCode = 1033;

            CrmServiceClient connection = new CrmServiceClient(ConfigurationManager.ConnectionStrings["crm"].ConnectionString);
            var service = (IOrganizationService)connection.OrganizationWebProxyClient ?? (IOrganizationService)connection.OrganizationServiceProxy;


            //To reduce the number of classes generated to those which are most useful,
            // the following entities will be excluded. If necessary, you can comment out
            // items from this array so that class files will be generated for the entity
            String[] excludedEntities = {
                                  "ApplicationFile",
                                  "AsyncOperation",
                                  "AttributeMap",
                                  "AuthorizationServer",
                                  "BulkDeleteFailure",
                                  "BulkDeleteOperation",
                                  "BulkOperation",
                                  "BulkOperationLog",
                                  "BusinessProcessFlowInstance",
                                  "BusinessUnitMap",
                                  "BusinessUnitNewsArticle",
                                  "ChildIncidentCount",
                                  "ClientUpdate",
                                  "ColumnMapping",
                                  "Commitment",
                                  "ComplexControl",
                                  "ConvertRule",
                                  "ConvertRuleItem",
                                  "Dependency",
                                  "DependencyFeature",
                                  "DependencyNode",
                                  "DisplayString",
                                  "DisplayStringMap",
                                  "DocumentIndex",
                                  "DuplicateRecord",
                                  "DuplicateRule",
                                  "DuplicateRuleCondition",
                                  "EmailHash",
                                  "EmailSearch",
                                  "EmailServerProfile",
                                  "EntityMap",
                                  "ExchangeSyncIdMapping",
                                  "FieldPermission",
                                  "FieldSecurityProfile",
                                  "FilterTemplate",
                                  "FixedMonthlyFiscalCalendar",
                                  "ImageDescriptor",
                                  "Import",
                                  "ImportData",
                                  "ImportEntityMapping",
                                  "ImportFile",
                                  "ImportJob",
                                  "ImportLog",
                                  "ImportMap",
                                  "IntegrationStatus",
                                  "InternalAddress",
                                  "InterProcessLock",
                                  "InvalidDependency",
                                  "IsvConfig",
                                  "License",
                                  "LookUpMapping",
                                  "Mailbox",
                                  "MailboxStatistics",
                                  "MetadataDifference",
                                  "MultiEntitySearch",
                                  "MultiEntitySearchEntities",
                                  "Notification",
                                  "OrganizationStatistic",
                                  "OrganizationUI",
                                  "OwnerMapping",
                                  "PartnerApplication",
                                  "PickListMapping",
                                  "PluginAssembly",
                                  "PluginType",
                                  "PluginTypeStatistic",
                                  "PrincipalObjectAccess",
                                  "PrincipalObjectAccessReadSnapshot",
                                  "PrincipalObjectAttributeAccess",
                                  "Privilege",
                                  "PrivilegeObjectTypeCodes",
                                  "ProcessSession",
                                  "ProcessStage",
                                  "ProcessTrigger",
                                  "Publisher",
                                  "PublisherAddress",
                                  "RecordCountSnapshot",
                                  "RelationshipRole",
                                  "RelationshipRoleMap",
                                  "ReplicationBacklog",
                                  "Report",
                                  "ReportCategory",
                                  "ReportEntity",
                                  "ReportLink",
                                  "ReportVisibility",
                                  "RibbonCommand",
                                  "RibbonContextGroup",
                                  "RibbonCustomization",
                                  "RibbonDiff",
                                  "RibbonRule",
                                  "RibbonTabToCommandMap",
                                  "RoutingRule",
                                  "RoutingRuleItem",
                                  "SalesProcessInstance",
                                  "SdkMessage",
                                  "SdkMessageFilter",
                                  "SdkMessagePair",
                                  "SdkMessageProcessingStep",
                                  "SdkMessageProcessingStepImage",
                                  "SdkMessageProcessingStepSecureConfig",
                                  "SdkMessageRequest",
                                  "SdkMessageRequestField",
                                  "SdkMessageResponse",
                                  "SdkMessageResponseField",
                                  "ServiceEndpoint",
                                  "SiteMap",
                                  "SLA",
                                  "SLAItem",
                                  "Solution",
                                  "SolutionComponent",
                                  "SqlEncryptionAudit",
                                  "StatusMap",
                                  "StringMap",
                                  "Subscription",
                                  "SubscriptionClients",
                                  "SubscriptionSyncInfo",
                                  "SubscriptionTrackingDeletedObject",
                                  "SystemApplicationMetadata",
                                  "SystemForm",
                                  "SystemUserBusinessUnitEntityMap",
                                  "SystemUserPrincipals",
                                  "TraceAssociation",
                                  "TraceLog",
                                  "TraceRegarding",
                                  "TransformationMapping",
                                  "TransformationParameterMapping",
                                  "UnresolvedAddress",
                                  "UserApplicationMetadata",
                                  "UserEntityInstanceData",
                                  "UserEntityUISettings",
                                  "WebWizard",
                                  "WizardAccessPrivilege",
                                  "WizardPage",
                                  "WorkflowWaitSubscription"
                                 };
            MetadataFilterExpression EntityFilter = new MetadataFilterExpression(LogicalOperator.And);
            // No classes for intersect entities
            EntityFilter.Conditions.Add(new MetadataConditionExpression("IsIntersect", MetadataConditionOperator.Equals, false));
            // Do not retrieve excluded entities
            EntityFilter.Conditions.Add(new MetadataConditionExpression("SchemaName", MetadataConditionOperator.NotIn, excludedEntities));


            //A properties expression to limit the properties to be included with entities
            MetadataPropertiesExpression EntityProperties = new MetadataPropertiesExpression()
            {
                AllProperties = false
            };
            EntityProperties.PropertyNames.AddRange(new string[] {
                        "Attributes",
                        "Description",
                        "DisplayName",
                        "OneToManyRelationships",
                        "SchemaName" });


            MetadataConditionExpression[] attributesToReturn = new MetadataConditionExpression[] { 
                 //No virtual attributes
                 new MetadataConditionExpression("AttributeType", MetadataConditionOperator.NotEquals, AttributeTypeCode.Virtual),
                 // No child attributes
                 new MetadataConditionExpression("AttributeOf", MetadataConditionOperator.Equals, null)
                 };


            MetadataFilterExpression AttributeFilter = new MetadataFilterExpression(LogicalOperator.And);
            AttributeFilter.Conditions.AddRange(attributesToReturn);


            MetadataPropertiesExpression AttributeProperties = new MetadataPropertiesExpression() { AllProperties = false };
            AttributeProperties.PropertyNames.Add("AttributeTypeName");
            AttributeProperties.PropertyNames.Add("MaxLength");
            AttributeProperties.PropertyNames.Add("OptionSet");
            AttributeProperties.PropertyNames.Add("Description");
            AttributeProperties.PropertyNames.Add("DisplayName");
            AttributeProperties.PropertyNames.Add("RequiredLevel");
            AttributeProperties.PropertyNames.Add("SchemaName");
            AttributeProperties.PropertyNames.Add("Targets");
            AttributeProperties.PropertyNames.Add("IsValidForCreate");
            AttributeProperties.PropertyNames.Add("IsValidForRead");
            AttributeProperties.PropertyNames.Add("IsValidForUpdate");


            MetadataFilterExpression relationshipFilter = new MetadataFilterExpression(LogicalOperator.And);

            MetadataPropertiesExpression relationshipProperties = new MetadataPropertiesExpression() { AllProperties = false };
            relationshipProperties.PropertyNames.Add("SchemaName");
            relationshipProperties.PropertyNames.Add("ReferencingEntity");
            relationshipProperties.PropertyNames.Add("ReferencingAttribute");



            //A label query expression to limit the labels returned to only those for the user's preferred language
            LabelQueryExpression labelQuery = new LabelQueryExpression();
            //labelQuery.FilterLanguages.Add(_languageCode);


            //An entity query expression to combine the filter expressions and property expressions for the query.
            EntityQueryExpression entityQueryExpression = new EntityQueryExpression()
            {

                Criteria = EntityFilter,
                Properties = EntityProperties,
                AttributeQuery = new AttributeQueryExpression()
                {
                    Criteria = AttributeFilter,
                    Properties = AttributeProperties
                },
                RelationshipQuery = new RelationshipQueryExpression()
                {
                    Criteria = relationshipFilter,
                    Properties = relationshipProperties
                },
                LabelQuery = labelQuery

            };

            RetrieveMetadataChangesRequest rmdcr = new RetrieveMetadataChangesRequest()
            {
                Query = entityQueryExpression
            };
            RetrieveMetadataChangesResponse resp = (RetrieveMetadataChangesResponse)service.Execute(rmdcr);

            EntityMetadataCollection entities = resp.EntityMetadata;

            foreach (EntityMetadata entity in entities)
            {
                writeEntityTSFile(entity);
            }
            Console.WriteLine("Done!");
        }


        protected static void writeEntityTSFile(EntityMetadata entity)
        {

            String schemaName = entity.SchemaName;
            String fileName = Path.GetFullPath("..\\..\\TSClassFiles\\XrmSdk." + schemaName + ".ts");

            using (StreamWriter sw = new StreamWriter(fileName))
            {
                List<AttributeMetadata> attributeList = new List<AttributeMetadata>();
                foreach (AttributeMetadata att in entity.Attributes)
                {
                    attributeList.Add(att);
                }

                attributeList.Sort(CompareAttributeBySchemaName);

                sw.WriteLine("// =========================================================================================");
                sw.WriteLine("//  CRM Entity: {0}", schemaName);
                sw.WriteLine("//  This is a generated file, generated by XrmSdk.TSEntityClassGenerator, ");
                sw.WriteLine("//  developed by Peder Moeller Wagner, ProActive (http://en.proactive.dk)");
                sw.WriteLine("//  ProActive is a Microsoft Gold Partner, and one of the leading MS CRM partners in Denmark");
                sw.WriteLine("//");
                sw.WriteLine("//  Project: https://github.com/pederwagner/XrmSdkWebAPI");
                sw.WriteLine("// =========================================================================================");
                sw.WriteLine("");
                sw.WriteLine("/// <reference path=\"XrmSdk.Interfaces.d.ts\" />");
                sw.WriteLine("\"use strict\";");

                sw.WriteLine("module XrmSdk.{0}AttributeNames {{", schemaName);
                sw.WriteLine("");
                foreach (AttributeMetadata attribute in attributeList.Where(a => a.IsValidForRead != null && a.IsValidForRead.Value))
                {
                    sw.WriteLine("    export var {0}: string = \"{1}\";", attribute.SchemaName, attribute.LogicalName);
                }
                sw.WriteLine("}");
                sw.WriteLine("");

                sw.WriteLine("module XrmSdk.{0}OptionSetValues {{", schemaName);
                
                foreach (AttributeMetadata attribute in attributeList.Where(a => a.IsValidForRead != null && a.IsValidForRead.Value && a.AttributeTypeName.Value == "PicklistType"))
                {
                    sw.WriteLine("");
                    sw.WriteLine("    export var {0}Values: any = {{", attribute.SchemaName);
                    var optionsetAttr = (PicklistAttributeMetadata)attribute;
                    for (int index = 0; index < optionsetAttr.OptionSet.Options.Count; index++)
                    {
                        OptionMetadata option = optionsetAttr.OptionSet.Options[index];
                        var comma = index == optionsetAttr.OptionSet.Options.Count - 1 ? "" : ",";
                        sw.WriteLine("        {0}: {1}{2}", FormatPropertyName(option.Label.UserLocalizedLabel.Label), option.Value, comma);
                    }
                    sw.WriteLine("    }");
                }
                sw.WriteLine("");
                sw.WriteLine("}");
                sw.WriteLine("");



                sw.WriteLine("module XrmSdk {");
                sw.WriteLine("");



                sw.WriteLine("    export class {0} implements Entity {{", schemaName);
                sw.WriteLine("        [index: string]: any;");
                sw.WriteLine("        public static get ODataType(): string {{ return \"Microsoft.Dynamics.CRM.{0}\"; }}", entity.LogicalName);
                sw.WriteLine("        public static get EntityDataSetName(): string {{ return \"{0}s\"; }}", entity.LogicalName);
                sw.WriteLine("        public static get EntityLogicalName(): string {{ return \"{0}\"; }}", entity.LogicalName);
                sw.WriteLine("");


                foreach (AttributeMetadata attribute in attributeList.Where(a => a.IsValidForRead != null && a.IsValidForRead.Value))
                {

                    string AttributeType = "NotSupported";

                    switch (attribute.AttributeTypeName.Value)
                    {
                        case "BigIntType":
                            AttributeType = "Sdk.Long";
                            sw.WriteLine("        {0}: number = undefined;", attribute.LogicalName);
                            break;
                        case "BooleanType":
                            AttributeType = "Sdk.Boolean";
                            sw.WriteLine("        {0}: boolean = undefined;", attribute.LogicalName);
                            break;
                        case "CustomerType":
                        case "LookupType":
                        case "OwnerType":
                            AttributeType = "Sdk.Lookup";
                            sw.WriteLine("        _{0}_value: string = undefined;", attribute.LogicalName);
                            break;
                        case "DateTimeType":
                            AttributeType = "Sdk.DateTime";
                            sw.WriteLine("        {0}: Date = undefined;", attribute.LogicalName);
                            break;
                        case "DecimalType":
                            AttributeType = "Sdk.Decimal";
                            sw.WriteLine("        {0}: number = undefined;", attribute.LogicalName);
                            break;
                        case "DoubleType":
                            AttributeType = "Sdk.Double";
                            sw.WriteLine("        {0}: number = undefined;", attribute.LogicalName);
                            break;
                        case "IntegerType":
                            AttributeType = "Sdk.Int";
                            sw.WriteLine("        {0}: number = undefined;", attribute.LogicalName);
                            break;
                        case "ManagedPropertyType":
                            AttributeType = "Sdk.BooleanManagedProperty";
                            break;
                        case "MemoType":
                        case "StringType":
                            AttributeType = "Sdk.String";
                            sw.WriteLine("        {0}: string = undefined;", attribute.LogicalName);
                            break;
                        case "MoneyType":
                            AttributeType = "Sdk.Money";
                            sw.WriteLine("        {0}: number = undefined;", attribute.LogicalName);
                            break;
                        case "PartyListType":
                            AttributeType = "Sdk.PartyList";
                            break;
                        case "PicklistType":
                        case "StateType":
                        case "StatusType":
                            AttributeType = "Sdk.OptionSet";
                            sw.WriteLine("        {0}: number = undefined;", attribute.LogicalName);
                            break;
                        case "UniqueidentifierType":
                            AttributeType = "Sdk.Guid";
                            sw.WriteLine("        {0}: string = undefined;", attribute.LogicalName);
                            break;
                        case "CalendarRulesType":
                        case "EntityNameType":
                        case "VirtualType":
                            //NotSupported
                            break;
                        default:
                            Console.WriteLine("Unexpected attribute.AttributeTypeName.Value: {0}", attribute.AttributeTypeName.Value.ToString());
                            break;
                    }

                }

                sw.WriteLine("");
                sw.WriteLine("        public static castFromEntity(entity: Entity): {0} {{", schemaName);
                sw.WriteLine("            var sdkEntity = new {0}();", schemaName);
                sw.WriteLine("            for (var attribute in entity) {");
                sw.WriteLine("                if (entity.hasOwnProperty(attribute)) {");
                sw.WriteLine("                    sdkEntity[attribute] = entity[attribute];");
                sw.WriteLine("                }");
                sw.WriteLine("            }");
                sw.WriteLine("            return sdkEntity;");
                sw.WriteLine("        }");

                sw.WriteLine("    }");


                sw.WriteLine("}");
            }

        }

        protected static string FormatPropertyName(string inputName)
        {
            var formatted = inputName.Replace(" ", "_").Replace("æ", "ae").Replace("Æ", "Ae").
                Replace("ø", "oe").Replace("Ø", "Oe").Replace("å", "aa").Replace("Å", "Aa")
                .Replace(".", "").Replace(",", "").Replace(":", "").Replace(";", "").Replace("-", "_").Replace("+", "_");

            string invalidChars = System.Text.RegularExpressions.Regex.Escape(new string(System.IO.Path.GetInvalidFileNameChars()));
            string invalidRegStr = string.Format(@"([{0}]*\.+$)|([{0}]+)", invalidChars);

            return System.Text.RegularExpressions.Regex.Replace(formatted, invalidRegStr, "");
        }

        protected static int CompareAttributeBySchemaName(AttributeMetadata x, AttributeMetadata y)
        {
            return x.SchemaName.CompareTo(y.SchemaName);
        }
        protected static int CompareRelationshipBySchemaName(OneToManyRelationshipMetadata x, OneToManyRelationshipMetadata y)
        {
            return x.SchemaName.CompareTo(y.SchemaName);
        }

    }
}
