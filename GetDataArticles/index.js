const { parseStringPromise } = require("xml2js");
const axios = require("axios");

const GetIDArticles = require("../GetIDArticles/index");
const send = require("../globalFunctions");

const apiKey = process.env.KEY;


module.exports = async function (context, req) {
    //console.log(GetIDArticles())
    const { status, body } = await GetIDArticles();
    //Falta definir cuando exista 404 pero luego lo haré

    // Definir la URL base de la API de PubMed
    const baseUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";
    //Solo para debugger
    //const apiKey = "445f5e20db09bea235c4eb9b04c2e43d6d09";
    let articlesData = []
    try {
        for (id of body) {
            const articleUrl = `${baseUrl}efetch.fcgi?db=pubmed&id=${id}&api_key=${apiKey}&retmode=xml`;
            const responseDataArticles = await axios.get(articleUrl);
            const jsonDataArticles = await parseStringPromise(responseDataArticles.data, { mergeAttrs: true });
            articlesData.push({
                title: jsonDataArticles["PubmedArticleSet"]["PubmedArticle"][0]["MedlineCitation"][0]["Article"][0]["ArticleTitle"][0],
                author: jsonDataArticles["PubmedArticleSet"]["PubmedArticle"][0]["MedlineCitation"][0]["Article"][0]["AuthorList"][0]["Author"].map((author) => author["LastName"][0] + " " + author["Initials"][0]).join(", "),
                link: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
            });
            context.res = {
                // status: 200, /* Defaults to 200 
                body: articlesData
            };
        }
    } catch (error) {
        context.res = {
            // status: 200, /* Defaults to 200 
            status: 400,
            body: "Error"
        };
    }
    //console.log(typeof(body))
    //const responseMessage = "Status: " + status+ "Body: " + body
}