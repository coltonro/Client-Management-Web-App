import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { NavbarSearch } from './components/SearchClients/nav';
import HomePage from './components/homePage';
import PastSurveys from './components/PastSurveys/pastSurveys';
import NewSurvey from './components/NewSurvey/newSurvey';
import Properties from './components/Properties/properties';
import EditClient from './components/EditClient/editClient';
import LoginPage from './components/loginPage';
import { ClientContext } from './components/clientContext';
import PdfViewer from './components/NewSurvey/pdfReportGenerator/pdfViewer';

const App = () => {
  
  const [client, setClient] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const cookieValue = 'GoldenCheek200';

  // check if user has a current login cookie in their browser
  useEffect(() => {
    const value = ('; '+document.cookie).split(`; login=`).pop().split(';')[0];
    if(value === cookieValue) {setLoggedIn(true)} else {setLoggedIn(false)}
  }, [])

  const homePage = loggedIn ? <HomePage /> : <LoginPage setLoggedIn={setLoggedIn} />;
  const pastSurveys = loggedIn ? <PastSurveys /> : <LoginPage setLoggedIn={setLoggedIn} />;
  const newSurvey = loggedIn ? <NewSurvey /> : <LoginPage setLoggedIn={setLoggedIn} />;
  const propeties = loggedIn ? <Properties /> : <LoginPage setLoggedIn={setLoggedIn} />;
  const editClient = loggedIn ? <EditClient /> : <LoginPage setLoggedIn={setLoggedIn} />;
  const pdfViewer = loggedIn ? <PdfViewer /> : <LoginPage setLoggedIn={setLoggedIn} />;

    return (
      <div className="app">
        <ClientContext.Provider value={{ client, setClient }}>
          <NavbarSearch loggedIn={loggedIn}/>
          <div className="rightComponents">
            <Routes>
              <Route exact path="/" element={homePage} >
                <Route path='/:clientIdParam' element={homePage} />
              </Route>
              <Route path="/past-surveys" element={pastSurveys} >
                <Route path='/past-surveys/:clientIdParam' element={pastSurveys} />
              </Route>
              <Route path="/new-survey/:reportIdParam" element={newSurvey} />
              <Route path="/properties" element={propeties} >
                <Route path="/properties/:clientIdParam" element={propeties} />
              </Route>
              <Route path="/edit-client/:clientIdParam" element={editClient} />
              <Route path="/view-report/" element={pdfViewer}>
                <Route path="/view-report/:reportIdParam" element={pdfViewer} />
              </Route>
            </Routes>
          </div>
        </ClientContext.Provider>
      </div>
    )
}

export default App