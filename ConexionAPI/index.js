import axios from 'axios';

const apiKey = process.env.KEY;

export default async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    // Definir la URL base de la API de PubMed
    const baseUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"

    // Definir los parámetros de búsqueda
    const searchTerm = "color psychology"
    const searchUrl = `${baseUrl}esearch.fcgi?db=pubmed&api_key=${apiKey}&term=${searchTerm}&free_full_text=yes`
    
    const name = (req.query.name || (req.body && req.body.name));

    context.res = {
        body: searchUrl
    };
    const response = await axios.get();
    /*
    axios.get(searchUrl)
        .then((response) => {
            const responseMessage = response
            context.res = {
                body: responseMessage
            };
        })
        .catch((error) => {
            context.res = {
                status: 400,
                body: error
            };
        });
    */
}