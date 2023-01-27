import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ClientContext } from './clientContext';
import { fetchUrl } from '../fetchUrl';
import chickadee from '../images/chickadee.png';

const HomePage = () => {
  const { client, setClient } = useContext(ClientContext)
  const { clientIdParam } = useParams();

  useEffect(() => {
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

  return (
    <div>
      <header id="pageTitle">
        <h1>{client && client.Name ? client.Name[0] : 'Search for a Client' }</h1>
        </header>
        <div className='birdImgDiv'>
        <img src={chickadee} id='birdImage'/>
        </div>
    </div>
  )
}

export default HomePage