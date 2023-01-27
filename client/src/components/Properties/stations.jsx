import { useContext } from 'react';
import { ClientContext } from '../clientContext';
import DeleteButton from './deleteButton';
import AddStation from './addStation'
import { TextInput, Textarea } from '@mantine/core';
import './properties.css';

function Stations({ pencilIcon, stations, setStations, latitude, setLatitude, longitude, setLongitude, stationDescription, setStationDescription, stationNumber, setStationNumber, cancelEdits, setCancelEdits, index, properties, justAddedNewProperty, setJustAddedNewProperty }) {

    const { client } = useContext(ClientContext);

    const allowedCharacters = [
        '',
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '.',
        '-',
        null // null allows the backspace key to be included
    ];

    const handleLatChange = (e, i) => {
        if (!pencilIcon) {
            const value = e.target.value;
            const inputtedCharacter = e.nativeEvent.data;
            if (allowedCharacters.includes(inputtedCharacter)) {
                if (value >= 0 || value == '') {
                    // update latitude for front end display
                    const copy = latitude;
                    copy[i] = value;
                    setLatitude([...copy]);
                    // update stations so it will submit to database w/updated data
                    const copyStations = stations;
                    const parsedValue = parseFloat(value);
                    copyStations[i].Latitude = parsedValue;
                    setStations([...copyStations]);
                }
            }
        }
    };

    const handleLongChange = (e, i) => {
        if (!pencilIcon) {
            const value = e.target.value;
            const inputtedCharacter = e.nativeEvent.data;
            if (allowedCharacters.includes(inputtedCharacter)) {
                if (value < 0 || value == '-' || value == '') {
                    // update longitude for front end display
                    const copy = longitude;
                    copy[i] = value;
                    setLongitude([...copy]);
                    // update stations so it will submit to database w/updated data
                    const copyStations = stations;
                    const parsedValue = parseFloat(value);
                    copyStations[i].Longitude = parsedValue;
                    setStations([...copyStations]);
                }
            }
        }
    };

    const stationDescHandler = (e, i) => {
        if (!pencilIcon) {
            // reflect updated data for the front end
            const value = e.target.value;
            const copy = stationDescription;
            copy[i] = value;
            setStationDescription([...copy]);
            // update stations to be used for database submission
            const stationsCopy = stations;
            stationsCopy[i].Description = value;
            setStations([...stationsCopy]);
        }
    };


    const renderStations = () => {
        // if (stations.length) {
        return stations.map((station, i) => {
            return <div className='mappedStation' key={`mappedStation-${i}`}>
                <strong className='station'>{`Station ${station.StationNumber}`}</strong>
                <div className='stationCoordinates'>
                    <form className='latForm'>
                        <TextInput
                            value={latitude[i]}
                            key={`lat-${i}`}
                            onChange={(e) => handleLatChange(e, i)}
                        />
                    </form>
                    <form className='longForm'>
                        <TextInput
                            value={longitude[i]}
                            key={`long-${i}`}
                            placeholder='Must be negative'
                            onChange={(e) => handleLongChange(e, i)}
                        />
                    </form>
                </div>
                <div className='ediTextWithDelete'>
                    <Textarea
                        className='textarea'
                        key={i}
                        value={stationDescription[i]}
                        onChange={(e) => stationDescHandler(e, i)}
                        placeholder="Habitat description"
                        minRows={1}
                        maxRows={5}
                    />
                    <DeleteButton
                        stations={stations}
                        setStations={setStations}
                        pencilIcon={pencilIcon}
                        stationNumber={stationNumber}
                        setStationNumber={setStationNumber}
                        latitude={latitude}
                        setLatitude={setLatitude}
                        longitude={longitude}
                        setLongitude={setLongitude}
                        stationDescription={stationDescription}
                        setStationDescription={setStationDescription}
                        properties={properties}
                        justAddedNewProperty={justAddedNewProperty}
                        stationIndex={i}
                        index={index} // index of this property in the properties array 
                    />
                </div>
            </div>
        })
    }


    return (
        <div className='stationsAndButton'>
            <div className='stations'>
                {renderStations()}
            </div>
            <AddStation
                pencilIcon={pencilIcon}
                stations={stations}
                setStations={setStations}
                client={client}
                stationNumber={stationNumber}
                setStationNumber={setStationNumber}
                latitude={latitude}
                setLatitude={setLatitude}
                longitude={longitude}
                setLongitude={setLongitude}
                stationDescription={stationDescription}
                setStationDescription={setStationDescription}
                index={index}
                properties={properties}
                justAddedNewProperty={justAddedNewProperty}
            />
        </div>
    );
}

// parent component is individualProperties.js
export default Stations;