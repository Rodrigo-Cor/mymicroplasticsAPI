const { parseStringPromise } = require("xml2js");
const axios = require('axios');
const apiKey = process.env.KEY;

module.exports = async function (context, req) {
    // Definir la URL base de la API de PubMed
    const baseUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";

    // Definir los parámetros de búsqueda
    const searchTerm = "psychology";
    
    const searchUrl = `${baseUrl}esearch.fcgi?db=pubmed&api_key=${apiKey}&term=${searchTerm}&free_full_text=yes`;
    context.log('JavaScript HTTP trigger function processed a request.');
    const name = (req.query.name || (req.body && req.body.name));
    /*
    const responseMessage =  "Hello, " + name + ". This HTTP triggered function executed successfully."
    + "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response." + searchUrl;
*/
    try {
        const response = await axios.get(searchUrl);
        //const data = await type(response.text());
        //const json = await parseStringPromise(data, { mergeAttrs: true });
        context.res = {
            // status: 200, /* Defaults to 200 */
            status:200,
            body: typeof(response)
        };
    } catch (error) {
        context.res = {
            status: 400,
            body: error
        }
    }
};