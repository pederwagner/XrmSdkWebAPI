using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Metadata;
using Microsoft.Xrm.Sdk.Metadata.Query;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Tooling.Connector;
using Microsoft.OData.Edm;
using Microsoft.OData.Edm.Csdl;
using Microsoft.OData.Edm.Validation;

namespace XrmSdk.TSEntityClassGenerator
{
    class Program
    {

        #region static properties

        private static readonly String[] ExcludedEntities =
            {
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

        #endregion

        static void Main(string[] args)
        {
            var _languageCode = 1033;

            CrmServiceClient connection = new CrmServiceClient(ConfigurationManager.ConnectionStrings["crm"].ConnectionString);
            var service = (IOrganizationService)connection.OrganizationWebProxyClient ?? (IOrganizationService)connection.OrganizationServiceProxy;
            var entities = new EntityMetadataCollection();
            entities = GetEntityMetadata(service);

            RunAsync(entities);
        }

        private static async void RunAsync(EntityMetadataCollection entities)
        {
            var webApiClient = new WebApiClient();
            var webApiMetadata = await webApiClient.GetWebApiMetadata();

            IEdmModel metadataModel;
            IEnumerable<EdmError> errors;
            bool parseSuccess = EdmxReader.TryParse(XmlReader.Create(new StringReader(webApiMetadata)), out metadataModel, out errors);

            if (parseSuccess)
            {
                var edmSchemaElements = metadataModel.SchemaElements.Where(se =>
                    se.SchemaElementKind == EdmSchemaElementKind.TypeDefinition &&
                    ExcludedEntities.All(ee => ee.ToLowerInvariant() != se.Name.ToLowerInvariant()));

                foreach (IEdmSchemaElement schemaElement in edmSchemaElements)
                {
                    var entity = entities.FirstOrDefault(e => e.LogicalName == schemaElement.Name);
                    if (entity != null)
                    {
                        WriteEntityTsFile(schemaElement as IEdmEntityType, entity);
                    }
                }
            }
            Console.WriteLine("Done!");
        }

        private static EntityMetadataCollection GetEntityMetadata(IOrganizationService service)
        {
            //To reduce the number of classes generated to those which are most useful,
            // the following entities will be excluded. If necessary, you can comment out
            // items from this array so that class files will be generated for the entity

            MetadataFilterExpression EntityFilter = new MetadataFilterExpression(LogicalOperator.And);
            // No classes for intersect entities
            EntityFilter.Conditions.Add(new MetadataConditionExpression("IsIntersect", MetadataConditionOperator.Equals, false));
            // Do not retrieve excluded entities
            EntityFilter.Conditions.Add(new MetadataConditionExpression("SchemaName", MetadataConditionOperator.NotIn,
                ExcludedEntities));


            //A properties expression to limit the properties to be included with entities
            MetadataPropertiesExpression EntityProperties = new MetadataPropertiesExpression()
            {
                AllProperties = false
            };
            EntityProperties.PropertyNames.AddRange(new string[]
            {
                "Attributes",
                "Description",
                "DisplayName",
                "OneToManyRelationships",
                "SchemaName"
            });


            MetadataConditionExpression[] attributesToReturn = new MetadataConditionExpression[]
            {
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
            return entities;
        }


        protected static void WriteEntityTsFile(IEdmEntityType entity, EntityMetadata entityMetadata)
        {

            String schemaName = entityMetadata.SchemaName;

            String fileName = Path.GetFullPath("..\\..\\TSClassFiles\\XrmSdk." + schemaName + ".ts");

            using (StreamWriter sw = new StreamWriter(fileName))
            {
                var propertyList = entity.DeclaredProperties.ToList();
                propertyList.Sort(ComparePropertyByName);

                var optionSetAttributes = entityMetadata.Attributes.Where(a => a.IsValidForRead != null && a.IsValidForRead.Value && a.AttributeTypeName.Value == "PicklistType").ToList();
                optionSetAttributes.Sort(CompareAttributeBySchemaName);

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

                sw.WriteLine("");

                sw.WriteLine("module XrmSdk.{0}OptionSetValues {{", schemaName);

                foreach (var attribute in optionSetAttributes)
                {
                    sw.WriteLine("");
                    sw.WriteLine("    export var {0}Values: any = {{", attribute.SchemaName);
                    var optionsetAttr = (PicklistAttributeMetadata)attribute;
                    var propertyNames = new List<string>();
                    for (int index = 0; index < optionsetAttr.OptionSet.Options.Count; index++)
                    {
                        OptionMetadata option = optionsetAttr.OptionSet.Options[index];
                        var comma = index == optionsetAttr.OptionSet.Options.Count - 1 ? "" : ",";

                        // Remove unvalid characters
                        var formattedPropertyName = FormatPropertyName(option.Label.UserLocalizedLabel.Label);

                        // Make sure the enum option name is unique
                        int firstCharNumValue = 0;
                        if (string.IsNullOrEmpty(formattedPropertyName))
                        {
                            formattedPropertyName = $"option_{index}_value_{option.Value}";
                        }
                        else if (int.TryParse(formattedPropertyName.Substring(0, 1), out firstCharNumValue))
                        {
                            formattedPropertyName = "_" + formattedPropertyName;
                        }
                        if (propertyNames.Contains(formattedPropertyName))
                        {
                            formattedPropertyName = $"{formattedPropertyName}_{option.Value}";
                        }
                        propertyNames.Add(formattedPropertyName);

                        sw.WriteLine("        {0}: {1}{2}", formattedPropertyName, option.Value, comma);
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
                sw.WriteLine("        public static get ODataType(): string {{ return \"{0}.{1}\"; }}", entity.Namespace, entity.Name);
                sw.WriteLine("        public static get EntityDataSetName(): string {{ return \"{0}s\"; }}", entity.Name);
                sw.WriteLine("        public static get EntityLogicalName(): string {{ return \"{0}\"; }}", entity.Name);
                sw.WriteLine("");

                sw.WriteLine("        // Attributes");
                foreach (IEdmProperty property in propertyList)
                {
                    if (property.PropertyKind == EdmPropertyKind.Structural)
                    {
                        switch (property.Type.FullName())
                        {
                            case "Edm.Boolean":
                                sw.WriteLine("        {0}: boolean = undefined;", property.Name);
                                break;
                            case "Edm.DateTimeOffset":
                                sw.WriteLine("        {0}: Date = undefined;", property.Name);
                                break;
                            case "Edm.Decimal":
                            case "Edm.Double":
                            case "Edm.Int64":
                            case "Edm.Int32":
                                sw.WriteLine("        {0}: number = undefined;", property.Name);
                                break;
                            case "Edm.String":
                            case "Edm.Binary":
                            case "Edm.Guid":
                                sw.WriteLine("        {0}: string = undefined;", property.Name);
                                break;
                            case "Microsoft.Dynamics.CRM.BooleanManagedProperty":
                                break;
                            default:
                                Console.WriteLine("Unexpected attribute. AttributeTypeName.Value: {0} {1}", property.Name, property.Type.FullName());
                                break;
                        }
                    }
                    else if (property.PropertyKind == EdmPropertyKind.Navigation)
                    {
                        var navProp = property as IEdmNavigationProperty;
                        if (navProp?.ReferentialConstraint != null)
                        {
                            var relatedType = navProp.Type.FullName();
                            var dependentProp = navProp.ReferentialConstraint.PropertyPairs.First().DependentProperty;

                            if (relatedType.StartsWith("Microsoft.Dynamics.CRM.")) {
                                relatedType = relatedType.Replace("Microsoft.Dynamics.CRM.", "");
                                sw.WriteLine("        public set_{0}(id: string) {{", property.Name);
                                sw.WriteLine("            this[\"{0}@odata.bind\"] = `/{1}s(\"${{id}}\")`;", property.Name, relatedType);
                                sw.WriteLine("            this[\"{0}\"] = id;", dependentProp.Name);
                                sw.WriteLine("        }");
                            }
                        }
                    }
                }
                
                sw.WriteLine("");
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
            // Replacement strings
            var formatted = inputName
                .Replace(" ", "_")
                .Replace("æ", "ae")
                .Replace("Æ", "Ae")
                .Replace("ø", "oe")
                .Replace("Ø", "Oe")
                .Replace("å", "aa")
                .Replace("Å", "Aa")
                .Replace("%", "Pct")
                .Replace("&", "And");

            // Remove accents etc.
            var tempBytes = Encoding.GetEncoding("ISO-8859-8").GetBytes(formatted);
            string asciiStr = Encoding.UTF8.GetString(tempBytes);

            // Remove everything except letters, numbers and underscore
            var regexPattern = "[^a-zA-Z0-9_]";
            var formattedString = System.Text.RegularExpressions.Regex.Replace(asciiStr, regexPattern, "");
            return formattedString;
        }

        protected static int ComparePropertyByName(IEdmProperty x, IEdmProperty y)
        {
            return String.Compare(x.Name.Replace("_", ""), y.Name.Replace("_", ""), StringComparison.Ordinal);
        }

        protected static int CompareAttributeBySchemaName(AttributeMetadata x, AttributeMetadata y)
        {
            return String.Compare(x.SchemaName, y.SchemaName, StringComparison.Ordinal);
        }
    }
}
