import ToggleButton from './toggleButton';
import './stationToggle.css';

function StationToggle({ stations, surveyData, setSurveyData, surveyId, setSurveyId, pastSurveySpecies, setBirdSpeciesList, setNewlyGeneratedSurveyId, dbStationTimeBegan }) {

  const produceStationToggles = () => {
    const map = stations.map((station, i) => {
      return (
        <ToggleButton
          num={i + 1}
          key={`toggleButton-${i}`}
          surveyData={surveyData}
          setSurveyData={setSurveyData}
          surveyId={surveyId}
          pastSurveySpecies={pastSurveySpecies}
          setSurveyId={setSurveyId}
          setBirdSpeciesList={setBirdSpeciesList}
          setNewlyGeneratedSurveyId={setNewlyGeneratedSurveyId}
          dbStationTimeBegan={dbStationTimeBegan}
        />
      )
    })
    return map;
  }

  return (
    <div className='surveyStationToggle'>
      {produceStationToggles()}
    </div>
  );
}


export default StationToggle