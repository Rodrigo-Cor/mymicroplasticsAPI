const { parseStringPromise } = require("xml2js");
const axios = require("axios");
//const apiKey = process.env.KEY;

module.exports = async function (context, req) {
    // Definir la URL base de la API de PubMed
    const baseUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";

    //Solo para debugger
    const apiKey = "445f5e20db09bea235c4eb9b04c2e43d6d09";

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
        const json = await parseStringPromise((response.data), { mergeAttrs: true });
        const ids = json["eSearchResult"]["IdList"][0]["Id"];
        let num = Math.floor(Math.random()*(ids.length));
        let articles = [];
        for (let j = 0; j < 3; j++) {
            articles.push(ids[num]);
            num++;
            if (num >= ids.length)
                num = 0;    
        }
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: articles
        };
    } catch (error) {
        context.res = {
            status: 400,
            body: "Error en la conexión al API"
        }
    }
};