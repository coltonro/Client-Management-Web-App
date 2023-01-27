import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ClientContext } from '../clientContext';
import { Button } from '@mantine/core';
import IndividualProperty from './individualProperty';
import { fetchUrl } from '../../fetchUrl';
import './properties.css';
import '../../../style.css';

// fetch all properties associated with a client (if multiple), then pass each one to IndividualProperty.jsx as a prop

function Properties() {
    const { client, setClient } = useContext(ClientContext);
    const { clientIdParam } = useParams();
    const [properties, setProperties] = useState([]);
    const [newPropertyId, setNewPropertyId] = useState(null);
    const [justAddedNewProperty, setJustAddedNewProperty] = useState(false);

    useEffect(async () => {
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
                    setClient({ ...data[0] })
                })
        }
    }, [])

    useEffect(() => {
        if (client) {
            fetch(`${fetchUrl}/clientProperties`, {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    clientId: client.ClientId
                })
            })
                .then(res => res.json())
                .then(data => setProperties(data))
        }
    }, [client]);

    const addProperty = () => {
        if (!justAddedNewProperty) { // if the 'Add New Property' button has not already been clicked more than once

            fetch(`${fetchUrl}/newPropertyId`)
                .then(res => res.json())
                .then(data => {
                    setNewPropertyId(data)

                    const copyProperties = properties
                    const clientId = properties.length ? properties[0].ClientId : client.ClientId
                    const newPropertyAcreage = properties.length ? copyProperties[copyProperties.length - 1].Acreage : 0;
                    const newPropertyObject = {
                        "PropertyId": data,
                        "PropertyName": "",
                        "ClientId": clientId,
                        "Acreage": newPropertyAcreage,
                        "PrimaryCountyId": 0,
                        "SecondaryCountyId": 0
                    }
                    setProperties([...properties, newPropertyObject])

                    const copyClient = client;
                    copyClient.PropertyId = data;
                    setClient(copyClient)

                })
            setJustAddedNewProperty(true);



        } else { // prevents multiple new properties from being added at once
            alert('You must save your current new property before adding additional new properties.')
        }
    }

    return (
        <div className='clientName'>
            <h1>Properties</h1>
            <h2>{client ? client.Name[0] : ''}</h2>
            <div className='propertyButtons'>
                {properties.map((property, i) => {
                    return (
                        <IndividualProperty
                            properties={properties}
                            index={i}
                            client={client}
                            justAddedNewProperty={justAddedNewProperty}
                            setJustAddedNewProperty={setJustAddedNewProperty}
                            newPropertyId={newPropertyId}
                        />
                    )
                })}
            </div>
            <Button className='addPropertyButton'
                onClick={() => addProperty()}
            >
                Add Property
            </Button>
        </div>
    )
}

export default Properties