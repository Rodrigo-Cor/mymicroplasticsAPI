import xml2js from "xml2js";
import axios from 'axios';

const apiKey = process.env.KEY;

export default async function (context, req) {
    // Definir la URL base de la API de PubMed
    const baseUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"

    // Definir los parámetros de búsqueda
    const searchTerm = "color psychology"
    const searchUrl = `${baseUrl}esearch.fcgi?db=pubmed&api_key=${apiKey}&term=${searchTerm}&free_full_text=yes`
    //context.log('JavaScript HTTP trigger function processed a request.');
    //const name = (req.query.name || (req.body && req.body.name));
    try {
        axios.get(searchUrl).then((response) => {
            const responseMessage = response.text()
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: responseMessage
            };
            
        })
        //const responseMessage =  "Hello, " + name + ". This HTTP triggered function executed successfully."
        
    } catch (error) {
        context.res = {
            status: 400,
            body: "Error en la respuesta del API"
        };
    }


}