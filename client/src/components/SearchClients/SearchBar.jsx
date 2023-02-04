import { useState, useContext, useEffect, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group, Text, Autocomplete } from '@mantine/core';
import { ClientContext } from '../clientContext';
import { fetchUrl } from '../../fetchUrl';
import './nav.css';

function SearchBar({ loggedIn }) {

  const [searchText, setSearchText] = useState('');
  const [clientData, setClientData] = useState([]);
  const { client, setClient } = useContext(ClientContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      const securityCheckValue = "allowFetch";
      fetch(`${fetchUrl}/clients`, {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          securityCheck: securityCheckValue // simple way to prevent client from accessing data by manupulating the browser url
        })
      })
        .then(response => response.json())
        .then(data => {
          setClientData(data)
        })
    }
  }, [loggedIn])

  const submitHandler = (e) => {
    setSearchText('');
    setClient(e);
    navigate('/past-surveys')
  }

  const AutoCompleteItem = forwardRef(
    ({ ClientId, Name, PropertyName, Acreage, ...others }, ref) => (
      <div ref={ref} {...others}>
        <Group noWrap>
          <div>
            <Text>{`${Name[0]}`}</Text>
            <Text size="xs" color="dimmed">
              {PropertyName}
            </Text>
            <div className='countyAndAcres'>
              <Text size="xs" color="dimmed">
                {`${Name[1]} Co.`}
              </Text>
              <Text size="xs" color="dimmed" className='acres'>
                {`${Math.floor(Acreage)} ac.`}
              </Text>
            </div>
          </div>
        </Group>
      </div>
    )
  );

  return (
    <Autocomplete
      id='searchBar'
      placeholder="Search Clients"
      value={searchText}
      onChange={setSearchText}
      itemComponent={AutoCompleteItem}
      data={(searchText.length >= 2) ? clientData : []}
      filter={(value, item) =>
        item.PropertyName !== null ? item.Name[0].toLowerCase().includes(value.toLowerCase().trim())
          || item.PropertyName.toLowerCase().includes(value.toLowerCase().trim()) : item.Name[0].toLowerCase().includes(value.toLowerCase().trim())
      }
      onItemSubmit={(e) => submitHandler(e)}
    />
  );
}

export default SearchBar