import { dbQueryPROD, dbQueryDEV } from './database.js';

const getController = {};

// to switch between development and production, simply reassign this const (either dbQueryDEV or dbQueryPROD):
const dbQuery = dbQueryDEV;

// populates client search
// getController.clients = async (req, res, next) => {

//   // this query gets all clients that have just one property (the large majority) AND clients with multiple properties. 
//   //If multiple properties exist, only the most recently created one is returned (the one with the greatest PropertyId). This prevents each property from showing in SearchBar.jsx component, and instead only shows one property per client in the searchbar no matter what.
//   const text = 'SELECT a.ClientId, a.Name, b.PropertyName, b.PropertyId, b.Acreage, c.Name FROM Account.Clients AS a INNER JOIN Geography.Properties b ON a.ClientId = b.ClientId LEFT JOIN Geography.Counties c ON b.PrimaryCountyId = c.CountyId WHERE NOT EXISTS (SELECT 1 FROM Geography.Properties b2 WHERE b2.ClientId = b.ClientId AND (b2.PropertyId > b.PropertyId)) ORDER BY b.PropertyId DESC;'

//   try {
//     const clients = await dbQuery(text);
//     res.locals = clients.recordset;
//   }
//   catch (error) {
//     console.log(error);
//   }
//   next();
// };

getController.birdTaxonomyList = async (req, res, next) => {

  const text = 'SELECT BirdId, CommonName, Code, FederalStatus FROM Biology.Birds;'

  try {
    const list = await dbQuery(text);
    res.locals = list.recordset;
  }
  catch (error) {
    console.log(error);
  }
  next();
}

getController.generateNewReportId = async (req, res, next) => {

  const text = 'SELECT TOP 1 * FROM Account.Surveys ORDER BY SurveyId DESC;'

  try {
    const report = await dbQuery(text);
    const { SurveyId } = report.recordset[0];
    const newSurveyId = SurveyId + 1;
    res.locals = newSurveyId;
  }
  catch (error) {
    console.log(error);
  }
  next();
}

getController.newPropertyId = async (req, res, next) => {

  const text = 'SELECT TOP 1 * FROM Geography.Properties ORDER BY PropertyId DESC;'

  try {
    const report = await dbQuery(text);
    const { PropertyId } = report.recordset[0];
    const newPropertyId = PropertyId + 1;
    res.locals = newPropertyId;
    console.log('PropertyId: ', PropertyId)
    console.log('newPropertyId: ', newPropertyId)
  }
  catch (error) {
    console.log(error);
  }
  next();
}

export default getController;