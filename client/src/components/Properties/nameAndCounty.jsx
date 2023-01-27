import { Autocomplete, TextInput } from '@mantine/core';
import { IconPencil, IconCircleCheck, IconCircleX } from '@tabler/icons';
import './nameAndCounty.css';

const allTexasCounties = [
    "Anderson",
    "Andrews",
    "Angelina",
    "Aransas",
    "Archer",
    "Armstrong",
    "Atascosa",
    "Austin",
    "Bailey",
    "Bandera",
    "Bastrop",
    "Baylor",
    "Bee",
    "Bell",
    "Bexar",
    "Blanco",
    "Borden",
    "Bosque",
    "Bowie",
    "Brazoria",
    "Brazos",
    "Brewster",
    "Briscoe",
    "Brooks",
    "Brown",
    "Burleson",
    "Burnet",
    "Caldwell",
    "Calhoun",
    "Callahan",
    "Cameron",
    "Camp",
    "Carson",
    "Cass",
    "Castro",
    "Chambers",
    "Cherokee",
    "Childress",
    "Clay",
    "Cochran",
    "Coke",
    "Coleman",
    "Collin",
    "Collingsworth",
    "Colorado",
    "Comal",
    "Comanche",
    "Concho",
    "Cooke",
    "Coryell",
    "Cottle",
    "Crane",
    "Crockett",
    "Crosby",
    "Culberson",
    "Dallam",
    "Dallas",
    "Dawson",
    "Deaf",
    "Delta",
    "Denton",
    "DeWitt",
    "Dickens",
    "Dimmit",
    "Donley",
    "Duval",
    "Eastland",
    "Ector",
    "Edwards",
    "El",
    "Ellis",
    "Erath",
    "Falls",
    "Fannin",
    "Fayette",
    "Fisher",
    "Floyd",
    "Foard",
    "Fort",
    "Franklin",
    "Freestone",
    "Frio",
    "Gaines",
    "Galveston",
    "Garza",
    "Gillespie",
    "Glasscock",
    "Goliad",
    "Gonzales",
    "Gray",
    "Grayson",
    "Gregg",
    "Grimes",
    "Guadalupe",
    "Hale",
    "Hall",
    "Hamilton",
    "Hansford",
    "Hardeman",
    "Hardin",
    "Harris",
    "Harrison",
    "Hartley",
    "Haskell",
    "Hays",
    "Hemphill",
    "Henderson",
    "Hidalgo",
    "Hill",
    "Hockley",
    "Hood",
    "Hopkins",
    "Houston",
    "Howard",
    "Hudspeth",
    "Hunt",
    "Hutchinson",
    "Irion",
    "Jack",
    "Jackson",
    "Jasper",
    "Jeff",
    "Jefferson",
    "Jim",
    "Jim",
    "Johnson",
    "Jones",
    "Karnes",
    "Kaufman",
    "Kendall",
    "Kenedy",
    "Kent",
    "Kerr",
    "Kimble",
    "King",
    "Kinney",
    "Kleberg",
    "Knox",
    "La",
    "Lamar",
    "Lamb",
    "Lampasas",
    "Lavaca",
    "Lee",
    "Leon",
    "Liberty",
    "Limestone",
    "Lipscomb",
    "Live",
    "Llano",
    "Loving",
    "Lubbock",
    "Lynn",
    "Madison",
    "Marion",
    "Martin",
    "Mason",
    "Matagorda",
    "Maverick",
    "McCulloch",
    "McLennan",
    "McMullen",
    "Medina",
    "Menard",
    "Midland",
    "Milam",
    "Mills",
    "Mitchell",
    "Montague",
    "Montgomery",
    "Moore",
    "Morris",
    "Motley",
    "Nacogdoches",
    "Navarro",
    "Newton",
    "Nolan",
    "Nueces",
    "Ochiltree",
    "Oldham",
    "Orange",
    "Palo",
    "Panola",
    "Parker",
    "Parmer",
    "Pecos",
    "Polk",
    "Potter",
    "Presidio",
    "Rains",
    "Randall",
    "Reagan",
    "Real",
    "Red",
    "Reeves",
    "Refugio",
    "Roberts",
    "Robertson",
    "Rockwall",
    "Runnels",
    "Rusk",
    "Sabine",
    "San",
    "San",
    "San",
    "San",
    "Schleicher",
    "Scurry",
    "Shackelford",
    "Shelby",
    "Sherman",
    "Smith",
    "Somervell",
    "Starr",
    "Stephens",
    "Sterling",
    "Stonewall",
    "Sutton",
    "Swisher",
    "Tarrant",
    "Taylor",
    "Terrell",
    "Terry",
    "Throckmorton",
    "Titus",
    "Tom",
    "Travis",
    "Trinity",
    "Tyler",
    "Upshur",
    "Upton",
    "Uvalde",
    "Val",
    "Van",
    "Victoria",
    "Walker",
    "Waller",
    "Ward",
    "Washington",
    "Webb",
    "Wharton",
    "Wheeler",
    "Wichita",
    "Wilbarger",
    "Willacy",
    "Williamson",
    "Wilson",
    "Winkler",
    "Wise",
    "Wood",
    "Yoakum",
    "Young",
    "Zapata",
    "Zavala"
];

function NameAndCounty({
    pencilIcon,
    setPencilIcon,
    propertyName,
    setPropertyName,
    acreage,
    setAcreage,
    primaryCounty,
    setPrimaryCounty,
    secondaryCounty,
    setSecondaryCounty,
    handleEditClick,
    cancelEdits,
    setCancelEdits,
    justAddedNewProperty
}) {

    const primaryCountyHandler = (input) => {
        if (!pencilIcon) {
            input.length ? setPrimaryCounty(input) : setPrimaryCounty('');
        }
    };

    const secondaryCountyHandler = (input) => {
        if (!pencilIcon) {
            input.length ? setSecondaryCounty(input) : setSecondaryCounty('');
        }
    };

    const handlePropertyName = (e) => {
        const value = e.target.value;
        if (!pencilIcon) {
            setPropertyName(value);

        }
    };

    const allowedCharacters = [
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
        null //null allows the backspace key to be included
    ];

    const handleAcres = (e) => {
        const value = e.target.value;
        const inputtedCharacter = e.nativeEvent.data;
        if (!pencilIcon) {
            if (allowedCharacters.includes(inputtedCharacter)) {
                setAcreage(value);
            }
        }
    };

    const pencilClick = () => {
        if (!justAddedNewProperty) {
            handleEditClick() // defined in individualProperty.jsx
        } else {
            alert('You must save changes to the new property before editing others.')
        }
    }

    const handleXClick = () => {
        setPencilIcon(!pencilIcon);
        setCancelEdits(!cancelEdits);
    }

    return (
        <div className='nameAndCounty'>
            <p className='propertyNameLabel'>Property Name</p>
            <div className='editIcon'>
                <TextInput
                    className='propertyNameText'
                    placeholder=""
                    value={propertyName}
                    onChange={(e) => handlePropertyName(e)}
                />
                {pencilIcon ?
                    <>
                        <span data-tooltip="Edit Property" data-flow="top">
                            <IconPencil
                                size={30}
                                className='latLongEdit '
                                onClick={() => pencilClick()}
                            />
                            </span>
                    </>
                    :
                    <>
                    <span data-tooltip="Save" data-flow="top">
                            <IconCircleCheck
                                size={30}
                                className='latLongEdit'
                                color='green'
                                onClick={() => handleEditClick()}
                                setCancelEdits={setCancelEdits}
                            />
                            </span>
                            <span data-tooltip="Cancel" data-flow="top">
                            <IconCircleX
                                size={30}
                                className='latLongEdit'
                                color='darkred'
                                onClick={(e) => handleXClick()}
                            />
                            </span>
                    </>}
            </div>
            <div className='countySelect'>
                <TextInput
                    className='propertyNameText'
                    label='Acres'
                    placeholder="acres"
                    value={acreage}
                    onChange={(e) => handleAcres(e)}
                />
                <Autocomplete
                    label="Primary County"
                    placeholder={primaryCounty ? primaryCounty : 'Select a County'}
                    value={primaryCounty}
                    onChange={(input) => primaryCountyHandler(input)}
                    data={!pencilIcon ? allTexasCounties : []}
                />
                <Autocomplete
                    label="Secondary County"
                    placeholder={secondaryCounty ? secondaryCounty : 'None'}
                    value={secondaryCounty ? secondaryCounty : ''}
                    onChange={(input) => secondaryCountyHandler(input)}
                    data={!pencilIcon ? allTexasCounties : []}
                />
            </div>
        </div>
    );
}

export default NameAndCounty