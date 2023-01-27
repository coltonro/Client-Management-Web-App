import { useContext, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ClientContext } from '../clientContext';
import { fetchUrl } from '../../fetchUrl';
import { IconFileAnalytics, IconEdit } from '@tabler/icons';
import { Modal, Loader } from '@mantine/core';
import './pastSurveys.css';

function PastSurveys() {
  const { client, setClient } = useContext(ClientContext);
  const { clientIdParam } = useParams();
  const [surveys, setSurveys] = useState([]);
  const [modalOpened, setModalOpened] = useState(false);
  const [surveyIdForDelete, setSurveyIdForDelete] = useState(null);
  const [deletingSurvey, setDeletingSurvey] = useState(false);

  useEffect(() => {
    console.clear();
    if (!client && clientIdParam) {
         fetch(`${fetchUrl}/singleClient`, {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientId: clientIdParam
        })
      })
        .then(response => response.json())
        .then(data => {
          setClient({...data[0]})
        })
    }
  }, [])

  useEffect(() => {
    if(client) {
       fetch(`${fetchUrl}/pastSurveys`, {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clientId: client.ClientId
      })
    })
      .then(response => response.json())
      .then(data => {
        setSurveys([...data])
      })
    }
  }, [client, modalOpened])

  // abbreviateBirderName shortens birder's last name to an initial
  const abbreviateBirderName = (birderName) => {
    if (birderName) {
      const trimmedName = birderName.trim();
      const firstName = trimmedName.split(' ').slice(0, -1).join(' ');
      const lastName = trimmedName.split(' ').slice(-1).join(' ');
      const lastNameInitial = lastName.charAt(0);
      return `${firstName} ${lastNameInitial}.`
    } else {
      return '';
    }
  }

  const editingPreviousSurvey = (survey) => {
    localStorage.setItem('editingPastSurvey', true);
    localStorage.setItem('pastSurveyId', survey.SurveyId);
  }

  const viewReportButton = (survey) => {
    if (localStorage.pastSurveyId) { localStorage.removeItem('pastSurveyId') };
    localStorage.setItem('pastSurveyId', survey.SurveyId);
  };

  const openModal = (surveyId) => {
    setSurveyIdForDelete(surveyId);
    setModalOpened(true);
  }

  const closeModal = () => {
    setSurveyIdForDelete(null);
    setModalOpened(false)
  }

  const deleteSurvey = async (SurveyId) => {
    console.log('delete SurveyId: ', SurveyId)
    setDeletingSurvey(true)
    fetch(`${fetchUrl}/deleteSurvey`, {
      method: "DELETE",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        surveyId: SurveyId
      })
    })
      .then(() => {
        setModalOpened(false)
        setDeletingSurvey(false)
        console.log('.then complete ')
      })
  }

  const surveysWithReports = () => {
    return surveys.map((survey, i) => {
      return (
        <div className={i % 2 == 0 ? 'infoLineGreen' : 'infoLine'} key={`infoLine-${i}`}>
          <span className={'infoSpan year'}>{survey.Year}</span>
          <span className={'infoSpan season'}>{survey.Season}</span>
          <span className='infoSpan'>{abbreviateBirderName(survey.Birder)}</span>
          <span className='infoSpan'>
            <Link to={`/new-survey/${client.clientId}`}>
              <button
                className='reset-button'
                onClick={() => editingPreviousSurvey(survey)}>{<IconEdit size={30} />}</button>
            </Link>
          </span>
          <span className='infoSpan'>
            {survey.Year >= 2015 ?
              <Link to={`/view-report/${survey.SurveyId}`}>
                <button
                  className='reset-button'
                  onClick={() => viewReportButton(survey)}>{<IconFileAnalytics size={30} />}</button>
              </Link>
              : ''}
          </span>
          <span data-tooltip1="Delete Survey" data-flow="top">
          <button
            className='infoSpan surveyDeleteButton'
            onClick={() => openModal(survey.SurveyId)}
            width={'20px'}
          >X</button>
          </span>
      </div>
      )
    })
  };

  return (
    <div className='clientName'>
      <h1>Past Surveys</h1>
      <h2>{client && client.Name ? client.Name[0] : ''}</h2>
      <div className='tableTitles'>
        <h3 style={{"width" : "19"}}>Year</h3>
        <h3 style={{"width" : "19"}}>Season</h3>
        <h3 style={{"width" : "19"}}>Birder</h3>
        <h3 style={{"width" : "24"}}>Edit Survey</h3>
        <h3 style={{"width" : "19"}}>Report</h3>
        <h3 ></h3>
      </div>
      <div className='withReport'>
        {surveysWithReports()}
      </div>
      <Modal
        opened={modalOpened}
        onClose={() => closeModal()}
        title='Delete Survey?'
        className='deleteModal'
      >
        {'This action cannot be undone. All data for this indidivial survey will be lost.'}
        <div className='modalButtons'>
          <button
            className='modalbutton'
            onClick={(() => deleteSurvey(surveyIdForDelete))}>
            {deletingSurvey ? <Loader color="black" size="sm" /> : 'Delete'}
          </button>
          <button
            className='modalbutton'
            onClick={() => closeModal()}>
            Go Back
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default PastSurveys