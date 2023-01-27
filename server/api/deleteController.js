import { dbQueryPROD, dbQueryDEV } from './database.js';

const deleteController = {};

// to switch from development to production , or prod to dev, simply reassign this const (to either dbQueryDEV or dbQueryPROD)
const dbQuery = dbQueryDEV;

deleteController.deleteSurvey = async (req, res, next) => { 
    
    const { surveyId } = req.body;
    console.log('**surveyId: ', surveyId)
    const geographyStationSurveyConditions = `DELETE FROM Geography.StationSurveyConditions WHERE SurveyId = ${surveyId};`
    const biologyObservations = `DELETE FROM Biology.Observations WHERE SurveyId = ${surveyId};`
    const accountSurveys = `DELETE FROM Account.Surveys WHERE SurveyId = ${surveyId};`

    try {
        await dbQuery(geographyStationSurveyConditions);
        await dbQuery(biologyObservations);
        await dbQuery(accountSurveys);
    }
    catch (error) {
        console.log('deleteSurvey Error: ', error)
    }
    next();
}

export default deleteController;