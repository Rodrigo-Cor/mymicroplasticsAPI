const {get3Element} = require('../globalFunctions');
const {parseStringPromise} = require('xml2js');
const {get} = require('axios');

module.exports = async function GetIDArticles(context, req) {
  const apiKey = process.env.KEY;
  console.log('La conexion se esta haciendo');
  // Definir la URL base de la API de PubMed
  const baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';

  // Definir los parámetros de búsqueda
  const searchTerm = req.body && req.body.searchTerm;
  const articlesNum = parseInt(req.body && req.body.articlesNum);

  // Definir la URL de la petición
  const searchUrl = `${baseUrl}esearch.fcgi?db=pubmed&api_key=${apiKey}&term=${searchTerm}&free_full_text=yes`;
  try {
    const response = await get(searchUrl);
    const json = await parseStringPromise((response.data), {mergeAttrs: true});
    const ids = json['eSearchResult']['IdList'][0]['Id'];

    const articles = get3Element(ids, articlesNum);
    const articlesData = [];

    for (id of articles) {
      const articleUrl = `${baseUrl}efetch.fcgi?db=pubmed&id=${id}&api_key=${apiKey}&retmode=xml`;
      const responseDataArticles = await get(articleUrl);
      const jsonDataArticles = await parseStringPromise(responseDataArticles.data, {mergeAttrs: true});
      articlesData.push({
        title: jsonDataArticles['PubmedArticleSet']['PubmedArticle'][0]['MedlineCitation'][0]['Article'][0]['ArticleTitle'][0],
        author: jsonDataArticles['PubmedArticleSet']['PubmedArticle'][0]['MedlineCitation'][0]['Article'][0]['AuthorList'][0]['Author'].map((author) => author['LastName'][0] + ' ' + author['Initials'][0]).join(', '),
        link: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
      });
    }
    context.res = {
      headers: {
        'Content-Type': 'application/json',
      },
      // status: 200, /* Defaults to 200
      body: articlesData,
    };
  } catch (error) {
    // return send(404, "Error en la obtención de los ID's");
    context.res = {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({message: 'Error en la obtención de las referencias. Intentalo más tarde'}),
    };
  }
};
