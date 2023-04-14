// Importar la librería xml2js
const { parseStringPromise } = require("xml2js");

// Definir la URL base de la API de PubMed
const baseUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";

// Definir los parámetros de búsqueda
const searchTerm = "color psychology";
const apiKey = "f2c2e31223d057531eb683e1457dc6312307";
const searchUrl = `${baseUrl}esearch.fcgi?db=pubmed&api_key=${apiKey}&term=${searchTerm}&free_full_text=yes`;

// Hacer la petición con async/await
async function searchArticles() {
    try {
        // Hacer la petición GET con fetch() y esperar la respuesta
        const response = await fetch(searchUrl);
        const data = await response.text();

        // Parsear la respuesta de XML a JSON con xml2js
        const json = await parseStringPromise(data, { mergeAttrs: true });
        //console.log(json["eSearchResult"]["IdList"][0]["Id"].slice(0,5))
        // Obtener la lista de artículos
        const ids = json["eSearchResult"]["IdList"][0]["Id"].slice(0, 4);
        //console.log(json + "\n");

        // Hacer una petición para cada artículo y obtener su información
        const articles = [];
        for (const id of ids) {
            const articleUrl = `${baseUrl}efetch.fcgi?db=pubmed&id=${id}&api_key=${apiKey}&retmode=xml`;
            const articleResponse = await fetch(articleUrl);
            const articleData = await articleResponse.text();
            const articleJson = await parseStringPromise(articleData, { mergeAttrs: true });
            //console.log(articleJson["PubmedArticleSet"]["PubmedArticle"][0]["MedlineCitation"][0]["Article"][0]["ArticleTitle"][0])

            const article = {
                title: articleJson["PubmedArticleSet"]["PubmedArticle"][0]["MedlineCitation"][0]["Article"][0]["ArticleTitle"][0],
                author: articleJson["PubmedArticleSet"]["PubmedArticle"][0]["MedlineCitation"][0]["Article"][0]["AuthorList"][0]["Author"].map((author) => author["LastName"][0] + " " + author["Initials"][0]).join(", "),
                link: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
            };
            articles.push(article);
        }
        console.log(articles);
    } catch (error) {
        console.error(error);
    }
}


searchArticles();

