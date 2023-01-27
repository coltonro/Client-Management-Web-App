import { useEffect, useState } from 'react';
import { Button, Collapse } from '@mantine/core';
import Stations from './stations';
import NameAndCounty from './nameAndCounty';
import { fetchUrl } from '../../fetchUrl';
import './properties.css';
import '../../../style.css';

const IndividualProperty = ({ properties, client, index, justAddedNewProperty, setJustAddedNewProperty, newPropertyId }) => {

    const [opened, setOpened] = useState(false);
    const [pencilIcon, setPencilIcon] = useState(justAddedNewProperty ? false : true);
    const [propertyName, setPropertyName] = useState((properties[index].PropertyName ? properties[index].PropertyName : ""));
    const [acreage, setAcreage] = useState(properties[index].Acreage ? properties[index].Acreage : 0);
    const [primaryCounty, setPrimaryCounty] = useState(client.Name[1] ? client.Name[1] : '');
    const [secondaryCounty, setSecondaryCounty] = useState(client.Name[2]);
    const [stations, setStations] = useState([]);
    const [stationNumber, setStationNumber] = useState([]);
    const [latitude, setLatitude] = useState([]);
    const [longitude, setLongitude] = useState([]);
    const [stationDescription, setStationDescription] = useState([]);
    const [originalNumberOfStations, setOriginalNumberOfStations] = useState(null);
    const [cancelEdits, setCancelEdits] = useState(false);

    useEffect(() => {
        // if only one property exists, show collapsable data in opened state for end user's convenience
        if (properties.length === 1) { setOpened(true) };
        // if this is a newly added (but unsaved) property, show in opened state
        if (justAddedNewProperty ) { setOpened(true) }
        // if adding a new property, copy all station values into the new property to save user from manually copy/pasting them into the new property, else fetch station values for current/already existing property
        const fetchValue = justAddedNewProperty ? properties[0].PropertyId : properties[index].PropertyId;
        if (pencilIcon) { // if the user toggles off editing by clicking the red circle 'x' button, then the pencilIcon reappears, which causes property values to be re-fetched from database (in other words, unsaved user edits are erased and reset to database values)

            // if this is NOT the last property in properties array (i.e. - NOT the newly added property)
            if (properties[index].PropertyId !== properties[properties.length - 1].PropertyId || properties.length === 1) {

                // fetch('http://localhost:8080/clientProperties', {
                fetch(`${fetchUrl}/clientProperties`, {
                    method: "post",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        clientId: properties[index].ClientId
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        setPropertyName(data[index].PropertyName)
                        setAcreage(data[index].Acreage)
                        setPrimaryCounty(data[index].Name[0])
                        setSecondaryCounty(data[index].Name[1])
                    })
                // fetch data for each station (station number, latitude, longitude, descritpion)
                // fetch('http://localhost:8080/stations', {
                fetch(`${fetchUrl}/stations`, {
                    method: "post",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        PropertyId: fetchValue
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        const stationNums = data.map((station) => {
                            return station.StationNumber;
                        })
                        setStationNumber(stationNums);

                        const latitudes = data.map((station) => {
                            return station.Latitude
                        });
                        setLatitude(latitudes)

                        const longitudes = data.map((station) => {
                            return station.Longitude
                        });
                        setLongitude(longitudes)

                        const stationDescs = data.map((station) => {
                            return station.Description
                        });
                        setStationDescription(stationDescs)

                        setStations(data);
                        setOriginalNumberOfStations(stationNums.length)
                    })
                // if this is the last property in the properties array (which is where newly added properties are first placed), set justAddedNewProperty to false so that adding additional properties will continue to behave predictably.
                // if (properties[index].PropertyId === properties[properties.length - 1].PropertyId) {
                //     setJustAddedNewProperty(false);
            }
        }
    }, [cancelEdits]);

    // fetches stations data for canceling edits or copying to a new property
    useEffect(() => {
        // if only one property exists, show collapsable toggle in opened state for end user's convenience

        // if adding a new property, copy all station values into the new property to save user from manually copy/pasting them into the new property, else fetch station values for current/already existing property
        const fetchValue = justAddedNewProperty ? properties[0].PropertyId : properties[index].PropertyId;

        // fetch data for each station (station number, latitude, longitude, descritpion)
        // fetch('http://localhost:8080/stations', {
        fetch(`${fetchUrl}/stations`, {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                PropertyId: fetchValue
            })
        })
            .then(res => res.json())
            .then(data => {
                const stationNums = data.map((station) => {
                    return station.StationNumber;
                })
                setStationNumber(stationNums);

                const latitudes = data.map((station) => {
                    return station.Latitude
                });
                setLatitude(latitudes)

                const longitudes = data.map((station) => {
                    return station.Longitude
                });
                setLongitude(longitudes)

                const stationDescs = data.map((station) => {
                    return station.Description
                });
                setStationDescription(stationDescs)

                setStations(data);
                setOriginalNumberOfStations(stationNums.length)
            })

        // if (properties[index].PropertyId === properties[properties.length - 1].PropertyId) {
        //     setJustAddedNewProperty(false);
        // }
    }, [client])

    // enables editing for all input fields by clicking on the pencil icon (in nameAndCounty.js).
    const handleEditClick = () => {

        setPencilIcon(!pencilIcon) // this hides the pencilIcon button, and shows the green cirlce check and red 'x' button (in nameAndCounty.jsx within the return statement)

        // if green circle check is clicked, submit values to update database
        const secondCounty = secondaryCounty ? secondaryCounty : '';
        if (!pencilIcon) { // if green circle check is clicked, submit values to update database
            
            if (justAddedNewProperty) { // if this is a brand new property
                fetch(`${fetchUrl}/insertNewProperty`, {
                    method: "PATCH",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify({
                        ClientId: client.ClientId,
                        PropertyName: propertyName,
                        Acreage: acreage,
                        PrimaryCounty: primaryCounty,
                        SecondaryCounty: secondCounty,
                        Stations: stations
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        const stationNums = data.map((station) => {
                            return station.StationNumber;
                        })
                        setStationNumber(stationNums);

                        const latitudes = data.map((station) => {
                            return station.Latitude
                        });
                        setLatitude(latitudes)

                        const longitudes = data.map((station) => {
                            return station.Longitude
                        });
                        setLongitude(longitudes)

                        const stationDescs = data.map((station) => {
                            return station.Description
                        });
                        setStationDescription(stationDescs)
                        setStations(data);
                    })

            } else { // else if this is an already existing property
                fetch(`${fetchUrl}/clientProperty`, {
                    method: "PATCH",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify({
                        PropertyId: properties[index].PropertyId,
                        PropertyName: propertyName,
                        Acreage: acreage,
                        PrimaryCounty: primaryCounty,
                        SecondaryCounty: secondCounty
                    })
                })
                    .then(response => console.log('clientProperty api response: ', response.status));

                // determine if the number of survey stations changed (if any were added or deleted)
                const numberOfStationsChanged = (stations.length == originalNumberOfStations) ? false : true;

                fetch(`${fetchUrl}/updatePropertyStations`, {
                    method: "PATCH",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        Stations: stations,
                        NumOfStationsChanged: numberOfStationsChanged, // boolean
                        NewPropertyId: newPropertyId, // used to determine if this is a new or existing property
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        const stationNums = data.map((station) => {
                            return station.StationNumber;
                        })
                        setStationNumber(stationNums);

                        const latitudes = data.map((station) => {
                            return station.Latitude
                        });
                        setLatitude(latitudes)

                        const longitudes = data.map((station) => {
                            return station.Longitude
                        });
                        setLongitude(longitudes)

                        const stationDescs = data.map((station) => {
                            return station.Description
                        });
                        setStationDescription(stationDescs)

                        setStations(data);
                    })
            }
        }

        setJustAddedNewProperty(false)
    };
    
    return (
        <>
            <Button className='viewStationsButton'
                onClick={() => setOpened((o) => !o)}>
                <div className='clientName'>
                    {(!opened) ?
                        `${propertyName}`
                        : '^'
                    }
                </div>
                <div className='buttonDetails'>
                    <div className='primaryCounty'>
                        {(!opened) ?
                            ((primaryCounty.length) ? `${primaryCounty} Co.`
                                : '') : ''
                        }
                    </div>
                    <div className='acreage'>
                        {(!opened) ?
                            `${Math.floor(acreage)} ac.`
                            : ''
                        }
                    </div>
                </div>
            </Button>
            <div className='collapseOpen'>
                <Collapse in={opened}>
                    {<NameAndCounty
                        pencilIcon={pencilIcon}
                        setPencilIcon={setPencilIcon}
                        stations={stations}
                        propertyName={propertyName}
                        setPropertyName={setPropertyName}
                        acreage={acreage}
                        setAcreage={setAcreage}
                        primaryCounty={primaryCounty}
                        setPrimaryCounty={setPrimaryCounty}
                        secondaryCounty={secondaryCounty}
                        setSecondaryCounty={setSecondaryCounty}
                        handleEditClick={handleEditClick}
                        cancelEdits={cancelEdits}
                        setCancelEdits={setCancelEdits}
                        index={index}
                        properties={properties}
                        justAddedNewProperty={justAddedNewProperty}
                    />}
                    {<Stations
                        pencilIcon={pencilIcon}
                        stations={stations}
                        setStations={setStations}
                        stationNumber={stationNumber}
                        setStationNumber={setStationNumber}
                        latitude={latitude}
                        setLatitude={setLatitude}
                        longitude={longitude}
                        setLongitude={setLongitude}
                        stationDescription={stationDescription}
                        setStationDescription={setStationDescription}
                        cancelEdits={cancelEdits}
                        setCancelEdits={setCancelEdits}
                        client={client}
                        index={index}
                        properties={properties}
                        justAddedNewProperty={justAddedNewProperty}
                        setJustAddedNewProperty={setJustAddedNewProperty}
                    />}
                </Collapse>
            </div>
        </>
    )
}

export default IndividualProperty
