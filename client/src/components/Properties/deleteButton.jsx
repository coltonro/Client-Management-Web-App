import './deleteButton.css';

// station delete button is only ever used to edit a newly created property, before it is submitted to the database. Once it's in the database, stations cannot be deleted because this action could prevent surveys from past years accessing necessary data.

const DeleteButton = ({ stations, setStations, index, stationIndex, stationNumber, setStationNumber, latitude, setLatitude, longitude, setLongitude, stationDescription, setStationDescription, setCancelEdits, pencilIcon, properties, justAddedNewProperty }) => {

    const currentPropertyId = properties[index] ? properties[index].PropertyId : null;

    const handleDelete = () => {
        const copyStations = stations;
        const copyStationNums = stationNumber;
        const copyLat = latitude;
        const copyLong = longitude;
        const copyStationDescription = stationDescription;

        copyStations[stationIndex].StationNumber = stationIndex + 1;
        setStations(copyStations);

        copyStationNums.pop();
        setStationNumber(copyStationNums);


        copyLat.splice(stationIndex, 1);
        setLatitude(copyLat);

        copyLong.splice(stationIndex, 1);
        setLongitude(copyLong);

        copyStationDescription.splice(stationIndex, 1)
        setStationDescription(copyStationDescription);

        setStations(
            copyStations.filter((station, i) => {
                // remove object that has current stationIndex
                return station.StationNumber != stationIndex + 1;
            }),
        );
    };

    return (
        <>
            <div position="center">
                <button
                    // if this property in the properties array has the same propertyId as the last in the array (which is where a newly added property is first placed), AND justAddedNewProperty is currently true, then show the station delete button.
                    className={currentPropertyId === properties[properties.length - 1].PropertyId && justAddedNewProperty && !pencilIcon ? 'deleteButton' : 'invisible'}
                    index={index}
                    onClick={() => handleDelete()}
                    >X</button>
            </div>
        </>
    )
}

// parent component is stations.js
export default DeleteButton