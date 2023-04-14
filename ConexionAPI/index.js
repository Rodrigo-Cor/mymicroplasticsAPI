import {axios} from 'axios'
import {parseStringPromise} from 'xml2js'

module.exports = async function (context, req) {
    // Definir la URL base de la API de PubMed
    const baseUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"

    // Definir los parámetros de búsqueda
    const searchTerm = "color psychology"
    const apiKey = "Holaa"
    const searchUrl = `${baseUrl}esearch.fcgi?db=pubmed&api_key=${apiKey}&term=${searchTerm}&free_full_text=yes`
    context.log('JavaScript HTTP trigger function processed a request.');

    //const name = (req.query.name || (req.body && req.body.name));
    const responseMessage =  "Hello, " +  + ". This HTTP triggered function executed successfully."
    + "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response." + searchUrl;
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    }; 
}