import './properties.css';

const AddStation = ({ stations, setStations, stationNumber, setStationNumber, latitude, setLatitude, longitude, setLongitude, stationDescription, setStationDescription, properties, index, justAddedNewProperty, pencilIcon }) => {

    const currentPropertyId = properties[index] ? properties[index].PropertyId : null;

    const addStation = () => {
        const copy = stations;
        const copyStatNum = stationNumber;
        setLatitude([...latitude, 0]);
        setLongitude([...longitude, 0]);
        setStationDescription([...stationDescription, '']);
        setStationNumber([...stationNumber, 
            copyStatNum.length > 0 ? copyStatNum.length + 1 : 1]);
        setStations([...copy,
        {
            "PropertyId": properties.PropertyId,
            "StationNumber": copy.length > 0 ? copyStatNum.length + 1 : 1,
            "Latitude": 0,
            "Longitude": 0,
            "Description": ""
        }]
        );
    };

    return (
        <button
            className={(currentPropertyId === properties[properties.length - 1].PropertyId && justAddedNewProperty && !pencilIcon) ? 'addStation' : 'invisible' }
            onClick={() => addStation()}>
            Add Station
        </button>
    )
}

// parent component is stations.js
export default AddStation