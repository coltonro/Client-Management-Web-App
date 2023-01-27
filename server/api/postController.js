import { dbQueryPROD, dbQueryDEV } from './database.js';

const postController = {};

// to switch from development to production and back, simply reassign this const (to either dbQueryDEV or dbQueryPROD)

const dbQuery = dbQueryDEV;

// populates client search
postController.clients = async (req, res, next) => {
  const { securityCheck } = req.body;

  if (securityCheck === 'allowFetch') {
    // this query gets all clients that have just one property (the large majority) AND clients with multiple properties. 
    //If multiple properties exist, only the most recently created one is returned (the one with the greatest PropertyId). This prevents each property from showing in SearchBar.jsx component, and instead only shows one property per client in the searchbar no matter what.
    const text = 'SELECT a.ClientId, a.Name, b.PropertyName, b.PropertyId, b.Acreage, c.Name FROM Account.Clients AS a INNER JOIN Geography.Properties b ON a.ClientId = b.ClientId LEFT JOIN Geography.Counties c ON b.PrimaryCountyId = c.CountyId WHERE NOT EXISTS (SELECT 1 FROM Geography.Properties b2 WHERE b2.ClientId = b.ClientId AND (b2.PropertyId > b.PropertyId)) ORDER BY b.PropertyId DESC;'

    try {
      const clients = await dbQuery(text);
      res.locals = clients.recordset;
    }
    catch (error) {
      console.log(error);
    }
  }
  next();
};

// get all past surveys at a specific ClientId
postController.pastSurveys = async (req, res, next) => {
  const { clientId } = req.body;

  const text = `SELECT a.Birder, a.Observers, a.PropertyId, a.Season, a.SurveyId, a.Year, b.ClientId FROM Account.Surveys a JOIN Geography.Properties b ON a.PropertyId = b.PropertyId WHERE b.ClientId = ${clientId} ORDER BY Year DESC;`

  try {
    const pastSurveys = await dbQuery(text);
    res.locals = pastSurveys.recordset;
  }
  catch (error) {
    console.log('clientProperty error', error);
  }
  next();
}

// get all survey stations at a specific PropertyId
postController.stations = async (req, res, next) => {

  const { PropertyId } = req.body;

  const text = `SELECT * FROM Geography.Stations WHERE PropertyId = ${PropertyId} ORDER BY StationNumber;`

  try {
    const stations = await dbQuery(text);
    res.locals = stations.recordset;
  }
  catch (error) {
    console.log(error);
  }
  next();
}

// get all data needed for a PDF report 
postController.gatherReportData = async (req, res, next) => {
  const { surveyId } = req.body;
  console.log('**gatherReportData surveyId: ', surveyId)

  const text1 = `SELECT a.Birder, a.Observers, a.Season, a.Year, b.Acreage, b.PropertyName, c.Name, d.Name
    FROM Account.Surveys a 
    JOIN Geography.Properties b ON a.PropertyId = b.PropertyId 
    LEFT JOIN Account.Clients c ON b.ClientId = c.ClientId 
    RIGHT JOIN Geography.Counties d ON b.PrimaryCountyID = d.CountyId
    WHERE a.SurveyId = ${surveyId};`;

  const text2 = `SELECT e.*, f.Sky, f.SurveyDate, f.SurveyTime, f.Temperature, f.WindDirection, f.WindSpeed 
    FROM Geography.Stations e 
    JOIN Geography.StationSurveyConditions f ON f.StationId = e.StationId
    WHERE f.SurveyId = ${surveyId}
    ORDER BY StationId;`;

  const text3 = `SELECT b.CommonName, a.Number, a.BirdId, a.StationId 
  FROM Biology.Observations a 
  JOIN Biology.Birds b ON a.BirdId = b.BirdId 
  WHERE a.SurveyId = ${surveyId} 
  ORDER BY StationId;`;

  try {
    const surveyInfo = await dbQuery(text1);
    const stationsInfo = await dbQuery(text2);
    const birdsInfo = await dbQuery(text3);

    res.locals.surveyInfo = surveyInfo.recordsets;
    res.locals.stationsInfo = stationsInfo.recordsets;
    res.locals.birdsInfo = birdsInfo.recordsets;
  }
  catch (error) {
    console.log('gatherReportData error', error);
  }
  console.log('res.locals.surveyInfo: ', res.locals.surveyInfo)
  next();
}

// handles both brand new surveys, and previous surveys that are being edited
postController.submitBirdSurvey = async (req, res, next) => {

  console.log('submitBirdSurvey REQ.BODY: ', req.body);
  const { pastSurveyId } = req.body; // will either be null or a number
  const { surveyData } = req.body;
  const { birder, observers, propertyId, surveyDate, stationData, incidental } = surveyData;
  const year = new Date(surveyDate).getFullYear();

  // determine which season the survey was conducted during
  const determineSeason = (surveyDate, year) => {
    const surveyDateObject = new Date(surveyDate)
    const spring = new Date(`${year}-03-15`);
    const summer = new Date(`${year}-07-01`);
    const fall = new Date(`${year}-09-15`);
    const winter = new Date(`${year}-11-15`);

    if (surveyDateObject >= spring && surveyDateObject < summer) {
      return "Spring"
    } else if (surveyDateObject >= summer && surveyDateObject < fall) {
      return "Summer"
    } else if (surveyDateObject >= fall && surveyDateObject < winter) {
      return "Fall"
    } else {
      return "Winter"
    }
  }

  if (!pastSurveyId) { // if this is a brand new survey being submitted

    try { // insert into Account.Surveys
      // if observers exists (not null), sumbit observers as a string. else, submit observers as is.
      const insertSurveyData = observers ?
        `INSERT INTO Account.Surveys (Birder, Observers, PropertyId, Season, Year, GeneratedId, Transport)
      VALUES ('${birder}', '${observers}', ${propertyId}, '${determineSeason(surveyDate, year)}', ${year}, 'walked', 'n/a');`
        :
        `INSERT INTO Account.Surveys (Birder, Observers, PropertyId, Season, Year, GeneratedId, Transport)
      VALUES ('${birder}', ${observers}, ${propertyId}, '${determineSeason(surveyDate, year)}', ${year}, 'walked', 'n/a');`;

      await dbQuery(insertSurveyData);
      console.log('Account.Surveys insert done!')
    }
    catch (error) {
      console.log('submitBirdSurvey error (Account.Surveys): ', error)
    }

    try { // insert into Geography.StationSurveyConditions
      // get new SurveyId that was autogenerated by the database
      const selectSurveyId = `SELECT SurveyId FROM Account.Surveys WHERE PropertyId = ${propertyId} AND year = ${year} ORDER BY SurveyId DESC;`

      const dbSurveyId = await dbQuery(selectSurveyId);
      console.log('dbSurveyID: ', dbSurveyId.recordset[0].SurveyId);
      const newSurveyId = dbSurveyId.recordset[0].SurveyId;

      stationData.map(async (station, i) => {
        console.log('stationData.map StationId: ', station);
        const insertStationConditions = `INSERT INTO Geography.StationSurveyConditions (StationId, SurveyId, SurveyDate, SurveyTime, Temperature, WindDirection, WindSpeed, Sky) VALUES (${station.StationId}, ${newSurveyId}, '${surveyDate}', '${station.SurveyTime}', ${station.Temperature}, '${station.WindDirection}', '${station.WindSpeed}', '${station.Sky}');`;

        await dbQuery(insertStationConditions);

      })
      console.log('Geography.StationSurveyConditions insert done!')
    }
    catch (error) {
      console.log('submitBirdSurvey error (Geography.StationSurveyConditions): ', error)
    }

    try { // insert into Biology.Observations
      // get new SurveyId that was autogenerated by the database
      const selectSurveyId = `SELECT TOP 1 SurveyId FROM Account.Surveys WHERE PropertyId = ${propertyId} AND year = ${year} ORDER BY SurveyId DESC;`
      const dbSurveyId = await dbQuery(selectSurveyId);
      const dbSurveyIdRecordset = dbSurveyId.recordset[0].SurveyId;

      // iterate through each stations's Species array, insert data into Biology.Observations

      for (let i = 0; i < stationData.length; i++) {
        stationData[i].Species.map(async (speciesObj) => {
          const insertBirdObservation = `INSERT INTO Biology.Observations (BirdId, Number, StationId, SurveyId, Year) VALUES (${speciesObj.BirdId}, ${speciesObj.Number}, ${stationData[i].StationId}, ${dbSurveyIdRecordset}, ${year});`

          await dbQuery(insertBirdObservation);
        }
        )
      }
      console.log('Biology.Observations insert done!')
    }
    catch (error) {
      console.log('submitBirdSurvey error (Biology.Observations): ', error)
    }


  } else {
    // if this is a previous survey that is being edited/updated
    try { // update Account.Surveys
      const updateSurveyData = `UPDATE Account.Surveys SET Birder = '${birder}', Observers = '${observers}', Season = '${determineSeason(surveyDate, year)}', Year = ${year} WHERE SurveyId = ${pastSurveyId};`

      await dbQuery(updateSurveyData);
      console.log('Account.Surveys update done!')
    }
    catch (error) {
      console.log('submitBirdSurvey update error (Account.Surveys): ', error)
    }

    try { // update Geography.StationSurveyConditions
      stationData.map(async (station) => {
        const updateStationConditions = `UPDATE Geography.StationSurveyConditions
        SET SurveyDate = '${surveyDate}', SurveyTime = '${station.SurveyTime}', Temperature = ${station.Temperature}, WindSpeed = '${station.WindSpeed}', WindDirection = '${station.WindDirection}', Sky = '${station.Sky}' 
        WHERE SurveyId = ${pastSurveyId} AND StationId = ${station.StationId};`

        await dbQuery(updateStationConditions);
      })
      console.log('Geography.StationSurveyConditions update done!')
    }
    catch (error) {
      console.log('submitBirdSurvey update error (Geography.StationSurveyConditions): ', error)
    }

    try { // update Biology.Observations

      // first delete all old observations in this survey so there's no need to track which station needs changed, or which observation was added/updated/deleted. Ineffecient, but quick to implement. Could definitely be refactored & improved in the future.
      const deletePreviousObservations = `DELETE FROM Biology.Observations WHERE SurveyId = ${pastSurveyId};`
      await dbQuery(deletePreviousObservations);
    }
    catch (error) {
      console.log('submitBirdSurvey update error (Biology.Observations): ', error)
    }
    try {
      // iterate through each stations's Species array, insert data in Biology.Observations
      for (let i = 0; i < stationData[0].length; i++) {
        console.log('**stationData[0][i]: ', stationData[0][i]);
        stationData[0][i].Species.map(async (speciesObj) => {
          const insertBirdObservation = `INSERT INTO Biology.Observations (BirdId, Number, StationId, SurveyId, Year) VALUES (${speciesObj.BirdId}, ${speciesObj.Number}, ${stationData[0][i].StationId}, ${pastSurveyId}, ${year});`

          await dbQuery(insertBirdObservation);
        })
      }

      console.log('Biology.Observations update done!')
    }
    catch (error) {
      console.log('submitBirdSurvey update error (Biology.Observations): ', error)
    }
  }

  next();
}

// adding a brand new client
postController.addNewClient = async (req, res, next) => {
  const { clientName } = req.body;

  // in case the property name contains an apostrophe, replace it with two single quotes so SQL SERVER doesn't throw an error (single quotes makes it think the query string has ended).
  const handleApostrophes = clientName.replace("'", "''");

  try {
    const insertNewClient = `INSERT INTO Account.Clients ([Name]) VALUES ('${handleApostrophes}');`

    // get the ClientId of the most recently created client that matches the requested name
    const clientId = `SELECT TOP 1 ClientId, [Name] FROM Account.Clients WHERE [Name] = '${clientName}' ORDER BY ClientId DESC;`;

    await dbQuery(insertNewClient);
    const newGeneratedClientId = await dbQuery(clientId);

    const insertNewProperty = `INSERT INTO Geography.Properties (ClientId) VALUES (${newGeneratedClientId.recordset[0].ClientId});`;
    const newPropId = `SELECT PropertyId FROM Geography.Properties WHERE ClientId = ${newGeneratedClientId.recordset[0].ClientId};`;

    await dbQuery(insertNewProperty)
    const newPropertyId = await dbQuery(newPropId)

    res.locals.newPropertyId = newPropertyId.recordset;
    res.locals.newClientId = newGeneratedClientId.recordset;
  }
  catch (err) {
    console.log('addNewClient error: ', err)
  }
  next();
}

// get all properties at a clientId (for individual Properties.jsx)
postController.clientProperties = async (req, res, next) => {
  const { clientId } = req.body;
  const text = `SELECT a.*, b.Name, c.Name FROM Geography.Properties a JOIN Geography.Counties b ON a.PrimaryCountyId = b.CountyId LEFT JOIN Geography.Counties c ON a.SecondaryCountyId = c.CountyId WHERE ClientId = ${clientId} ORDER BY PropertyID DESC;`;

  try {
    const clientProperties = await dbQuery(text);
    console.log('clientProperties: ', clientProperties)
    res.locals = clientProperties.recordsets[0];
  }
  catch (err) {
    console.log('clientProperties error: ', err)
  }

  next();
}

postController.singleClient = async (req, res, next) => {
  const { clientId } = req.body;

  const text = `SELECT a.ClientId, a.Name, b.PropertyName, b.PropertyId, b.Acreage, c.Name FROM Account.Clients a INNER JOIN Geography.Properties b ON a.ClientId = b.ClientId LEFT JOIN Geography.Counties c ON b.PrimaryCountyId = c.CountyId WHERE a.ClientId = ${clientId};`

  try {
    const clients = await dbQuery(text);
    res.locals = clients.recordset;
  }
  catch (error) {
    console.log(error);
  }
  next();
};

export default postController;