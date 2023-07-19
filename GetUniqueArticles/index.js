/* eslint-disable max-len */
const {parseStringPromise} = require('xml2js');
const axios = require('axios');

module.exports = async function GetIDArticles(context, req) {
  const apiKey = process.env.KEY;
  // Definir la URL base de la API de PubMed
  const baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';

  // Obtener los términos de búsqueda como un arreglo de cadenas
  const searchTerms = req.body && req.body.searchTerms;

  try {
    const articlesData = [];

    for (const searchTerm of searchTerms) {
      const searchUrl = `${baseUrl}esearch.fcgi?db=pubmed&api_key=${apiKey}&term=${searchTerm}[Title/Abstract]`;
      const response = await axios.get(searchUrl);
      const json = await parseStringPromise(response.data, {mergeAttrs: true});
      const id = json['eSearchResult']['IdList'][0]['Id'];
      const articleUrl = `${baseUrl}efetch.fcgi?db=pubmed&id=${id}&api_key=${apiKey}&retmode=xml`;
      const responseDataArticles = await axios.get(articleUrl);
      const jsonDataArticles = await parseStringPromise(responseDataArticles.data, {mergeAttrs: true});
      articlesData.push({
        title: jsonDataArticles['PubmedArticleSet']['PubmedArticle'][0]['MedlineCitation'][0]['Article'][0]['ArticleTitle'][0],
        author: jsonDataArticles['PubmedArticleSet']['PubmedArticle'][0]['MedlineCitation'][0]['Article'][0]['AuthorList'][0]['Author'].map((author) => author['LastName'][0] + ' ' + author['Initials'][0]).join(', '),
        link: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
      });
    }

    context.res = {
      // status: 200, /* Defaults to 200
      body: articlesData,
    };
  } catch (error) {
    // return send(404, "Error en la obtención de los ID's");
    context.res = {
      status: 404,
      body: 'Error en la conexión al API',
    };
  }
};
