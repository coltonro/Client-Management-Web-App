import { useContext, useState, useEffect } from 'react';
import { ClientContext } from '../clientContext';
import { Input, Button, Loader } from '@mantine/core';
import { fetchUrl } from '../../fetchUrl';
import './editClient.css'

function EditClient() {
  const { client, setClient } = useContext(ClientContext);
  const [formText, setFormText] = useState(client.Name[0]);
  const [currentlyUpdating, setCurrentlyUpdating] = useState(false)

  useEffect(() => {
    // updates component when client name is changed to reflect the new client name
  }, [client])

  const submitForm = (e) => {
    e.preventDefault();
    setCurrentlyUpdating(true)

    fetch(`${fetchUrl}/editClientName`, {
      method: "PATCH",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clientName: formText,
        clientId: client.ClientId
      })
    })
      .then(res => res.json())
      .then(data => {
        const copyClient = client
        copyClient.Name[0] = data;
        setClient(copyClient)
        setCurrentlyUpdating(false)
      })

  }

  return (
    <div className='clientName'>
      <h1>Edit Client Name</h1>
      <h3>{client && client.Name ? client.Name[0] : ''}</h3>

      <form 
        className='editClientForm'
        onSubmit={(e) => submitForm(e)}>
        <Input
          className='editClientNameInput'
          size="md"
          value={formText}
          onChange={e => setFormText(e.target.value)}
        />
        <Button id='submitNewClientButton' onClick={(e) => submitForm(e)}>
          {currentlyUpdating ? <Loader size='sm' color='#2d862f' /> : 'Update Name'}
        </Button>
      </form>

    </div>
  )
}

export default EditClient