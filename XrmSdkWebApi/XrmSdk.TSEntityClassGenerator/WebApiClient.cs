using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Crm.Sdk.Samples.HelperCode;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Xrm.Sdk;
using Configuration = Microsoft.Crm.Sdk.Samples.HelperCode.Configuration;

namespace XrmSdk.TSEntityClassGenerator
{
    public class WebApiClient
    {
        private HttpClient httpClient; //Client to CRM server communication

        public string OrgUri { get; set; }

        public string AuthenticationProviderType { get; set; }

        public string Authority { get; set; }

        public string Version { get; set; }

        public string DomainName { get; set; }

        public string UserName { get; set; }

        public System.Security.SecureString Password { get; set; }

        public string FriendlyName { get; set; }

        public string ClientId { get; set; }

        public string AuthToken { get; set; }

        public string RedirectUrl { get; set; }

        public WebApiClient()
        {
            // http://www.inogic.com/blog/2016/03/programming-using-webapi-through-c-in-dynamics-crm-2016/
            ConnectToCRM(new[] {"crm"});
        }

        public async Task<string> GetWebApiMetadata()
        {
            try
            {
                HttpRequestMessage request;
                HttpResponseMessage response;

                var metadataUri = "$metadata";

                //Request formatted values be returned (in addition to standard unformatted values).
                response = await SendCrmRequestAsync(HttpMethod.Get, metadataUri, false);
                if (response.StatusCode == HttpStatusCode.OK) //200
                {
                    return response.Content.ToString();
                }
                else
                {
                    throw new CrmHttpResponseException(response.Content);
                }
            }
            catch (Exception e)
            {
                Console.Out.WriteLine("Could not authenticate with ADAL. Will attempt to read WebAPI metadata from file. Error Details: " + e.Message);

                var filename = ConfigurationManager.AppSettings["WebApiMetadataFilename"];

                var reader = File.OpenText(filename);
                return reader.ReadToEnd();
            }
        }


        /// <summary>
        /// Obtains the connection information from the application's configuration file,
        /// then uses this info to connect to the specified CRM service.
        /// </summary>
        /// <param name="args">Command line arguments</param>
        private void ConnectToCRM(String[] cmdargs)
        {
            //Create a helper object to read app.config for service URL and application 
            // registration settings.
            Configuration config = null;
            if (cmdargs.Length > 0)
                config = new FileConfiguration(cmdargs[0]);
            else
                config = new FileConfiguration(null);

            ClientId = config.ClientId;
            DomainName = config.Domain;
            OrgUri = config.ServiceUrl;
            UserName = config.Username;
            Password = config.Password;
            RedirectUrl = config.RedirectUrl;

            //Create a helper object to authenticate the user with this connection info.
            Authentication auth = new Authentication(config);


            //Next use a HttpClient object to connect to specified CRM Web service.
            httpClient = new HttpClient(auth.ClientHandler, true);
            //Define the Web API base address, the max period of execute time, the 
            // default OData version, and the default response payload format.
            httpClient.BaseAddress = new Uri(config.ServiceUrl + "api/data/v8.1/");
            httpClient.Timeout = new TimeSpan(0, 2, 0);
            httpClient.DefaultRequestHeaders.Add("OData-MaxVersion", "4.0");
            httpClient.DefaultRequestHeaders.Add("OData-Version", "4.0");
            httpClient.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
        }

        ///<summary> Sends an HTTP request to the current CRM service. </summary>
        ///<param name="method">The HTTP method to invoke</param>
        ///<param name="query">The HTTP query to execute (base URL is provided by client)</param>
        ///<param name="formatted">True to include formatted values in response; default is false.</param>
        ///<param name="maxPageSize">Number of records to display per output "page".</param>
        ///<returns>An HTTP response message</returns>
        private async Task<HttpResponseMessage> SendCrmRequestAsync(
                    HttpMethod method, string query, Boolean formatted = false, int maxPageSize = 10)
        {
            HttpRequestMessage request = new HttpRequestMessage(method, query);
            request.Headers.Add("Prefer", "odata.maxpagesize=" + maxPageSize.ToString());
            if (formatted)
                request.Headers.Add("Prefer",
                    "odata.include-annotations=OData.Community.Display.V1.FormattedValue");
            return await httpClient.SendAsync(request);
        }
    }
}
