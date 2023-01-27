import { dbQueryPROD, dbQueryDEV } from './database.js';

const patchController = {};

// to switch from development to production and back, simply reassign const dbQuery (to either dbQueryDEV or dbQueryPROD)
const dbQuery = dbQueryDEV;

// updates a client's property info (property name, acerage, county)
patchController.clientProperty = async (req, res, next) => {
  const { PropertyId, PropertyName, Acreage } = req.body;
  console.log('PropertyId: ', PropertyId)
  console.log('PropertyNAme: ', PropertyName)

  // in case the property name contains an apostrophe, replace it with two single quotes so SQL SERVER doesn't throw and error, and store the apostrophe in the database propertly.
  const handleApostrophes = PropertyName.replace("'", "''");

  try {
    const primaryCountyName = `SELECT a.CountyId FROM Geography.Counties a JOIN Geography.Properties b ON a.CountyId = b.PrimaryCountyId WHERE b.PropertyId = ${PropertyId};`

    const primary = await dbQuery(primaryCountyName);
    const primaryId = primary.recordset[0].CountyId;

    const secondaryCountyName = await dbQuery(`SELECT a.CountyId FROM Geography.Counties a JOIN Geography.Properties b ON a.CountyId = b.SecondaryCountyId WHERE b.PropertyId = ${PropertyId};`)

    const secondary = await dbQuery(secondaryCountyName);
    const secondaryIf = secondary.recordsets.length ? secondary.recordset[0].CountyId : null;

    const updatePropertyName = `UPDATE Geography.Properties SET PropertyName = '${handleApostrophes}', Acreage = ${Acreage}, PrimaryCountyId = ${primaryId}, SecondaryCountyId = ${secondaryIf} WHERE PropertyId = ${PropertyId}`;

    await dbQuery(updatePropertyName);
  }
  catch (error) {
    console.log('clientProperty error', error);
  }

  next();
}

// update individual stations within a property (station number, latitude/longitude, description)
patchController.updatePropertyStations = async (req, res, next) => {
  const { Stations, NumOfStationsChanged } = req.body;

  if (!NumOfStationsChanged) { // if number of station was unchanged, and only existing values need to be updated 

    try {
      Stations.map(async (station) => {
        const { StationId, StationNumber, Latitude, Longitude, Description } = station;

        // a single quotation mark within a string (an apostrophe) will cause SQL SERVER to throw an error, because it thinks the string ended prematurely. Replacing it with two single quotation marks is syntax that SQL SERVER understands as an apostrophe, thus properly storing apostrophes in the database without error.
        const handleApostrophes = Description.replace("'", "''");

        const updatePropertyStation = `UPDATE Geography.Stations SET StationNumber = ${StationNumber}, Latitude = ${Latitude}, Longitude = ${Longitude}, Description = '${handleApostrophes}' WHERE StationId = ${StationId};`;

        await dbQuery(updatePropertyStation);
      })

      // get updated values to return to client
      const selectUpdatedStations = `SELECT * FROM Geography.Stations WHERE PropertyId = ${Stations[0].PropertyId} ORDER BY StationNumber;`
      const updatedStations = await dbQuery(selectUpdatedStations);
      res.locals = updatedStations.recordset;
    }
    catch (error) {
      console.log('clientProperty error', error);
    }

  } else { // else if stations were added or deleted

    try {
      const propertyId = Stations[0].PropertyId;
      console.log('stations added/deleted')
      console.log('stations.length: ', Stations.length)
      console.log('Stations[0].PropertyId: ', Stations[0].PropertyId)

      const deletePreviousStationValues = `DELETE FROM Geography.Stations WHERE PropertyId = ${propertyId};`
      await dbQuery(deletePreviousStationValues);
      console.log('delete stations complete')

      Stations.map(async (station) => {
        const handleApostrophes = station.Description.replace("'", "''");

        const insertStation = `INSERT INTO Geography.Stations (PropertyId, StationNumber, Latitude, Longitude, Description) VALUES (${propertyId}, ${station.StationNumber}, ${station.Latitude}, ${station.Longitude}, '${handleApostrophes}');`

        dbQuery(insertStation);
      })

      // get updated values to return to client
      const selectUpdatedStations = `SELECT * FROM Geography.Stations WHERE PropertyId = ${propertyId} ORDER BY StationNumber;`
      const updatedStations = await dbQuery(selectUpdatedStations);
      res.locals = updatedStations.recordset;
    }
    catch (error) {
      console.log('clientProperty error', error);
    }
  }

  next();
}

patchController.insertNewProperty = async (req, res, next) => {
  const { ClientId, PropertyName, Acreage, PrimaryCounty, SecondaryCounty, Stations } = req.body;

  const handleApostrophes = PropertyName.replace("'", "''");
  const primaryCounty = `SELECT CountyId FROM Geography.Counties WHERE Name = '${PrimaryCounty}';`
  const secondaryCounty = `SELECT CountyId FROM Geography.Counties WHERE Name = '${SecondaryCounty}';`

  // insert a new property into Geography.Properties table
  try {
    const primaryCountyId = await dbQuery(primaryCounty);
    const secondaryCountyId = await dbQuery(secondaryCounty);
    const ifSecondaryCounty = secondaryCountyId.recordset.length ? secondaryCountyId.recordset[0].CountyId : null;

    const insertNewProperty = `INSERT INTO Geography.Properties (ClientId, PropertyName, Acreage, PrimaryCountyId, SecondaryCountyId) VALUES (${ClientId}, '${handleApostrophes}', ${Acreage}, ${primaryCountyId.recordset[0].CountyId}, ${ifSecondaryCounty});`;

    //const selectNewProperty = 'SELECT Top 1 a.PropertyId, a.PropertyName, a.ClientId, a.Acreage, b.Name, c.Name FROM Geography.Properties a JOIN Geography.Counties b ON a.PrimaryCountyId = b.CountyId LEFT JOIN Geography.Counties c ON a.SecondaryCountyId = c.CountyId ORDER BY a.PropertyId DESC;';

    const newPropertyId = `SELECT TOP 1 PropertyId FROM Geography.Properties WHERE ClientId = ${ClientId} ORDER BY PropertyId DESC;`;

    await dbQuery(insertNewProperty);
    const newPropId = await dbQuery(newPropertyId);


    // insert new survey stations into Geography.Stations at the new property
    await Stations.map(async station => {
      const insertStationsQuery = `INSERT INTO Geography.Stations (PropertyId, StationNumber, Latitude, Longitude, Description) VALUES (${newPropId.recordset[0].PropertyId}, ${station.StationNumber}, ${station.Latitude}, ${station.Longitude}, '${station.Description}');`

      await dbQuery(insertStationsQuery);
    }).then(async () => {
      const stationsQuery = `SELECT * FROM Geography.Stations WHERE PropertyId = ${newPropId.recordset[0].PropertyId} ORDER BY StationNumber;`
      const newStationValues = await dbQuery(stationsQuery);
      res.locals = newStationValues.recordset;
      console.log('res.locals: ', res.locals)
    }
    )
  }
  catch (error) {
    console.log(error);
  }
  next();
};

// update client name of an existing client
patchController.editClientName = async (req, res, next) => {
  const { clientName, clientId } = req.body;
  const handleApostrophes = clientName.replace("'", "''");
  console.log('client: ', clientName, 'clientId: ', clientId);

  try {
    const updateName = `UPDATE Account.Clients SET Name = '${handleApostrophes}' WHERE clientId = ${clientId};`
    const selectNewName = `SELECT Name FROM Account.Clients WHERE ClientId = ${clientId};`

    await dbQuery(updateName)
    const newName = await dbQuery(selectNewName)
    res.locals = newName.recordset[0].Name
    console.log('res.locals: ', res.locals)
  }
  catch (error) {
    console.log(error);
  }
  next();
};

export default patchController;