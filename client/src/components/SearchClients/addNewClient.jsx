import { useContext, useState } from 'react';
import { ClientContext } from '../clientContext';
import { useNavigate } from 'react-router-dom';
import { fetchUrl } from '../../fetchUrl';
import { Modal, TextInput, Button } from '@mantine/core'
import './addNewClient.css'

function AddNewClient({ opened, setOpened }) {
    const { client, setClient } = useContext(ClientContext);
    const [value, setValue] = useState('');
    const navigate = useNavigate();

    const submitNewClient = () => {
        if (value.length) {
            fetch(`${fetchUrl}/addNewClient`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'post',
                body: JSON.stringify({
                    clientName: value,
                })
            })
                .then(res => res.json())
                .then(data => {
                    setClient({
                        "ClientId": data.newClientId[0].ClientId,
                        "Name": [
                            data.newClientId[0].Name,
                            ""
                        ],
                        "PropertyName": "",
                        "PropertyId": data.newPropertyId[0].newPropertyId,
                        "Acreage": 0
                    })
                    setOpened(false)
                })
                .then(navigate('/properties'))
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title="Create a New Client"
            id='newClientModal'
        >
            <TextInput
                placeholder="Client Legal Name"
                value={value}
                onChange={(event) => setValue(event.currentTarget.value)}
            />
            <Button id='submitNewClientButton' onClick={submitNewClient}>
                Submit
            </Button>
        </Modal>
    )
}

export default AddNewClient;