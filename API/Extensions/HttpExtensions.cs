using System.Text.Json;
using API.Helpers;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, PaginationHeader header)
        {
            var jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
            response.Headers.Append("Pagination", JsonSerializer.Serialize(header, jsonOptions));

            // will have to do something to explicitly allow CORS policy here too, otherwise the client
            // will not be allowed to access the header information.
            response.Headers.Append("Access-Control-Expose-Headers", "Pagination");
        }
    }
}