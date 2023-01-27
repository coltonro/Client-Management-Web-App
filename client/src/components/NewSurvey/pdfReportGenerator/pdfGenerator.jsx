import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Document, Page, Text, Image, View, StyleSheet } from '@react-pdf/renderer';
import ReportTable from './reportTable';
import Plateau_Logo from '../../../images/Plateau_Logo.jpeg';
import {
  breedingSurvey,
  summerSurvey,
  fallSurvey,
  winterSurvey,
  springSecondParagraph,
  summerSecondParagraph,
  fallWinterSecondParagraph,
  thirdParagraph
} from './stringTemplates';
import { fetchUrl } from '../../../fetchUrl';
import StartAndEndTime from './startAndEndTime';

const PDFReport = () => {

  // const { reportIdParam } = useParams();
  const [reportData, setReportData] = useState(null);
  const [birdSpeciesList, setBirdSpeciesList] = useState([]);

  // either pull data from a previously completed survey, or use newly generated survey id from newSurvey.jsx within the submitData function (actually generated on the server postController.js file).
  const surveyId = localStorage.pastSurveyId ? JSON.parse(localStorage.getItem("pastSurveyId")) : JSON.parse(localStorage.getItem("newSurveyId"));

  useEffect(() => {
    fetch(`${fetchUrl}/gatherReportData`, {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        surveyId: surveyId
      })
    })
      .then(response => response.json())
      .then(data => {
        setReportData(data)
      })
    localStorage.removeItem("pastSurveyId");

  }, []);

  const surveyInfo = reportData ? reportData.surveyInfo : null;
  const stationsInfo = reportData ? reportData.stationsInfo[0] : null;
  const birdsInfo = reportData ? reportData.birdsInfo[0] : null;

  const birder = surveyInfo ? surveyInfo[0][0].Birder : "";
  const observers = surveyInfo ? surveyInfo[0][0].Observers : "";
  const season = surveyInfo ? surveyInfo[0][0].Season : "";
  const year = surveyInfo ? surveyInfo[0][0].Year : null;
  const acreage = surveyInfo ? surveyInfo[0][0].Acreage : null;
  const propertyName = surveyInfo ? surveyInfo[0][0].PropertyName : "";
  const clientName = surveyInfo ? surveyInfo[0][0].Name[0] : "";
  const countyName = surveyInfo ? surveyInfo[0][0].Name[1] : "";

  const times = StartAndEndTime(stationsInfo ? stationsInfo : []) // imported function from startAndEndTime.jsx
  const startTime = times[0];
  const endTime = times[1];

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      marginTop: 40,
      paddingBottom: 75,
      fontFamily: 'Times-Roman'
    },
    header: {
      flexDirection: 'row',
      marginBottom: 25,
      width: "90%",
      marginLeft: 35,
    },
    titleText: {
      fontSize: 18,
      fontWeight: 900,
      marginTop: 50,
      marginLeft: 16,
      fontFamily: 'Times-Bold'
    },
    topRightCorner: {
      fontSize: 14,
      width: 150,
      marginTop: 35,
      marginLeft: 20
    },
    section: {
      marginTop: 5,
      paddingBottom: 15,
      paddingLeft: 25,
      width: "95%",
      fontSize: 14
    },
    stationNumber: {
      flexDirection: 'row',
      paddingLeft: 25,
      fontSize: 14,
      fontFamily: 'Times-Bold'
    },
    latLong: {
      fontSize: 12,
      fontFamily: 'Times-Italic',
      paddingLeft: 25,
      paddingTop: 5
    },
    surveyConditions: {
      flexDirection: 'row',
      fontSize: 12,
      fontFamily: 'Times-Roman',
      paddingLeft: 25
    },
    tableTitle: {
      textAlign: 'center',
      width: '100%',
      fontSize: 16,
      marginBottom: 10
    },
  });

  const event = (stationsInfo && stationsInfo.length) ? new Date(`${stationsInfo[0].SurveyDate}`.slice(0, -8)) : "";
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const dateSurveyed = event !== "" ? event.toLocaleDateString(undefined, options) : "";

  const pdfTitle = () => {
    if(season === "Spring") return "Breeding Bird Survey Report"
    if(season === "Summer") return "Summer Bird Survey Report"
    if(season === "Fall") return "Fall Songbird Survey Report"
    return `Winter Bird Survey Report` 
  }

  const seasonalText = () => {
    const property = propertyName ? propertyName : ""
    const county = countyName ? countyName : ""
    const date = stationsInfo ? dateSurveyed : ""
    const surveyor = birder ? birder : ""
    const acres = acreage ? acreage : ""
    const start = startTime ? startTime : ""
    const end = endTime ? endTime : ""
    const numOfStations = stationsInfo ? (stationsInfo.length).toString() : ""

    // the first paragraph on the PDF report is unique to each season. The following return statements detemine which paragraph is printed.
    if (season === "Spring") return breedingSurvey(propertyName, countyName, dateSurveyed, birder, acreage, numOfStations, startTime, endTime)
    if (season === "Summer") return summerSurvey(property, county, date, surveyor, acres, numOfStations, start, end)
    if (season === "Fall") return fallSurvey(property, county, date, surveyor, acres, numOfStations, start, end)
    if (season === "Winter") return winterSurvey(property, county, date, surveyor, acres, numOfStations, start, end)
  }

  const secondParagraph = (propertyName) => {
    if (season === 'Spring') return springSecondParagraph(propertyName)
    if (season === 'Summer') return summerSecondParagraph(propertyName)
    return fallWinterSecondParagraph
  }

  // order station data by station number (otherwise large properties with many stations will list station 10 first instead of station 1 first)
  const orderedStations = stationsInfo ? stationsInfo.sort(function (a, b) {
    const keyA = a.StationNumber;
    const keyB = b.StationNumber;
    // Compare the 2 dates
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  }) : [];

  const stationDescriptions = !stationsInfo ? [] : orderedStations.map((station, i) => {
    const toLocale = new Date(station.SurveyTime).toLocaleString('en-US', { timeZone: 'Atlantic/Canary' })
    const adjustForTimeZone = new Date(toLocale).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    const windDirection = station.WindDirection === 'N/A' ? '' : station.WindDirection
    return (
      <View wrap={false}>
        <Text style={styles.stationNumber}>
          {`Station ${station.StationNumber}`}
        </Text>
        <Text style={styles.latLong}>{`${station.Latitude}, ${station.Longitude}`}</Text>
        <Text style={styles.surveyConditions}>
          {`${adjustForTimeZone}    ${station.Temperature}°F    ${station.Sky}    Wind: ${station.WindSpeed} ${windDirection}`}
        </Text>
        <Text style={styles.section}>{station.Description}</Text>
      </View>
    )
  });

  if (reportData) { // if data has already been fetched from server, load page
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* PDF header */}
          <View style={styles.header}>
            <Image src={Plateau_Logo} style={{ width: "125px", height: "125px" }} />
            <Text style={styles.titleText}>{pdfTitle()}</Text>
            <View style={styles.topRightCorner}>
              <Text style={{ fontFamily: 'Times-Bold' }}>{propertyName}</Text>
              <Text>{clientName ? clientName : ""}</Text>
              <Text>{dateSurveyed}</Text>
              <Text>Surveyor: {birder ? birder : ""}</Text>
              <Text>{observers && observers !== "null" ? `Observers: ${observers}` : ""}</Text>
            </View>
          </View>
          {/* summary paragraphs */}
          <View style={styles.section}>
            <Text style={styles.section}>
              {seasonalText()}
            </Text>
            <Text style={styles.section}>{secondParagraph(propertyName ? propertyName : "")}</Text>
            <Text style={styles.section}>{thirdParagraph}</Text>
          </View>
          {/* station descriptions & weather conditions */}
          <View style={styles.section}>
            {stationDescriptions}
          </View>
        </Page>
        {/* Table of Bird Species */}
        <Page style={styles.page} >
          <View style={styles.section}>
            <Text style={styles.tableTitle} >Summary of Survey Results</Text>
            <ReportTable
              birdsInfo={birdsInfo ? birdsInfo : [{ "key": "value" }]} // "key" "value" just a temporary placeholder
              birdSpeciesList={birdSpeciesList ? birdSpeciesList : []}
            />
          </View>
        </Page>
      </Document>
    )
  } else { return '' } // else return empty string if data is not yet fetched from server
};

export default PDFReport;