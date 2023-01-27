import express from 'express';
import cors from 'cors';
import getController from './api/getController.js';
import patchController from './api/patchController.js';
import postController from './api/postController.js';
import deleteController from './api/deleteController.js';
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(process.cwd()+"/client/dist"));

app.get('/', (req,res) => {
  res.sendFile(`${process.cwd()}/client/dist/index.html`);
});

// preventServerIdle is automatically requested by the frontend every 25 minutes
app.get('/preventServerIdle', (req,res) => {
  res.sendStatus(200);
  console.log('preventServerIdle')
});

app.post('/clients', postController.clients, (req, res) => {
  res.set('Access-Control-Allow-Origin', '*').json(res.locals);
  console.log('clients response sent');
});

app.get('/birdTaxonomyList', getController.birdTaxonomyList, (req, res) => {
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.set('Access-Control-Allow-Origin', '*').json(res.locals);
  console.log('birdTaxonomyList response sent');
});

app.get('/generateNewReportId', getController.generateNewReportId, (req, res) => {
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.set('Access-Control-Allow-Origin', '*').json(res.locals);
  console.log('generateNewReportId response sent');
});

app.get('/newPropertyId', getController.newPropertyId, (req, res) => {
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.set('Access-Control-Allow-Origin', '*').json(res.locals);
  console.log('newPropertyId response sent');
});

app.post('/pastSurveys', postController.pastSurveys, (req, res) => {
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.set('Access-Control-Allow-Origin', '*').json(res.locals);
  console.log('pastSurveys response sent');
});

// get stations at a ClientPropertyId
app.post('/stations', postController.stations, (req, res) => {
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.set('Access-Control-Allow-Origin', '*').json(res.locals);
  console.log('stations response sent');
});

// for generating the PDF Report
app.post('/gatherReportData', postController.gatherReportData, (req, res) => {
  res.setHeader('Cache-Control', 's-max-age=2, stale-while-revalidate');
  res.set('Access-Control-Allow-Origin', '*').json(res.locals);
  console.log('gather report data response sent');
});

// submit an all new bird survey
app.post('/submitBirdSurvey', postController.submitBirdSurvey, (req, res) => {
  res.setHeader('Cache-Control', 's-max-age=2, stale-while-revalidate');
  res.set('Access-Control-Allow-Origin', '*').json(res.locals);
  console.log('submitNewBirdSurvey response sent');
});

// add a brand new client
app.post('/addNewClient', postController.addNewClient, (req, res) => {
  res.setHeader('Cache-Control', 's-max-age=2, stale-while-revalidate');
  res.set('Access-Control-Allow-Origin', '*').json(res.locals);
  console.log('newClient response sent');
});

// used with react router to set client on frontend
app.post('/singleClient', postController.singleClient, (req, res) => {
  res.set('Access-Control-Allow-Origin', '*').json(res.locals);
  console.log('singleClient response sent');
});

// get all properties associated with a single
app.post('/clientProperties', postController.clientProperties, (req, res) => {
  res.setHeader('Cache-Control', 's-max-age=2, stale-while-revalidate');
  res.set('Access-Control-Allow-Origin', '*').json(res.locals);
  console.log('clientProperties response sent');
});

// update a client property (property name, acreage, county)
app.patch('/clientProperty', patchController.clientProperty, (req, res) => {
  res.set('Access-Control-Allow-Origin', '*').sendStatus(200);
  console.log('property patch request complete')
});

// updates survey stations at a propertyId
app.patch('/updatePropertyStations', patchController.updatePropertyStations, (req, res) => {
  res.set('Access-Control-Allow-Origin', '*').json(res.locals);
  console.log('updatePropertyStations request complete')
});

// updates survey stations at a propertyId
app.patch('/insertNewProperty', patchController.insertNewProperty, (req, res) => {
  res.set('Access-Control-Allow-Origin', '*').json(res.locals);
  console.log('insertNewProperty request complete')
});

// update the name of an existing client
app.patch('/editClientName', patchController.editClientName, (req, res) => {
  res.set('Access-Control-Allow-Origin', '*').json(res.locals);
  console.log('editClientName response sent');
});

// delete a past survey
app.delete('/deleteSurvey', deleteController.deleteSurvey, (req, res) => {
  res.set('Access-Control-Allow-Origin', '*').sendStatus(200);
  console.log('delete survey request complete')
});

// make sure this route is last on this file!! this is necessary for react router to work with client ids as a param within the url. without this route, a 404 may be returned. if this is listed elsewhere then other routes cannot be accessed.
app.get('*', (req,res) => {
  res.sendFile(`${process.cwd()}/client/dist/index.html`);
});

/**
 * 404 handler
 */
app.use('*', (req, res) => {
  res.status(404).send('404 Not Found');
});

// Global error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => { console.log(`Listening on port ${PORT}...`); });

export default app;