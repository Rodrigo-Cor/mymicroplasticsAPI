const { send, get3Element } = require("../globalFunctions");
const { parseStringPromise } = require("xml2js");
const axios = require("axios");
const apiKey = process.env.KEY;

module.exports = async function GetIDArticles(context, req) {
    // Definir la URL base de la API de PubMed
    const baseUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";

    //Solo para debugger
    //const apiKey = "445f5e20db09bea235c4eb9b04c2e43d6d09";
    //const searchTerm = "Microplastics biodegradation by biofloc-producing bacteria: An inventive biofloc technology approach"
    //const typeRequest = 1;
    //const articlesNum = 3;

    // Definir los parámetros de búsqueda
    const searchTerm = req.body && req.body.searchTerm
    const typeRequest = req.body && req.body.typeRequest
    const articlesNum = req.body && req.body.articlesNum

    // Definir la URL de la petición
    let searchUrl = `${baseUrl}esearch.fcgi?db=pubmed&api_key=${apiKey}&term=${searchTerm}&free_full_text=yes`;
    try {
        if (typeRequest === 1)
            searchUrl = `${baseUrl}esearch.fcgi?db=pubmed&api_key=${apiKey}&term=${searchTerm}[Title/Abstract]`;
        const response = await axios.get(searchUrl);
        const json = await parseStringPromise((response.data), { mergeAttrs: true });
        const ids = json["eSearchResult"]["IdList"][0]["Id"];

        const articles = get3Element(ids, articlesNum)
        const articlesData = []

        for (id of articles) {
            const articleUrl = `${baseUrl}efetch.fcgi?db=pubmed&id=${id}&api_key=${apiKey}&retmode=xml`;
            const responseDataArticles = await axios.get(articleUrl);
            const jsonDataArticles = await parseStringPromise(responseDataArticles.data, { mergeAttrs: true });
            articlesData.push({
                title: jsonDataArticles["PubmedArticleSet"]["PubmedArticle"][0]["MedlineCitation"][0]["Article"][0]["ArticleTitle"][0],
                author: jsonDataArticles["PubmedArticleSet"]["PubmedArticle"][0]["MedlineCitation"][0]["Article"][0]["AuthorList"][0]["Author"].map((author) => author["LastName"][0] + " " + author["Initials"][0]).join(", "),
                link: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
            });
        }
        context.res = {
            // status: 200, /* Defaults to 200 
            body: articlesData
        };
    } catch (error) {
        //return send(404, "Error en la obtención de los ID's");
        context.res = {
            status: 404,
            body: "Error en la conexión al API"
        }
    }
};