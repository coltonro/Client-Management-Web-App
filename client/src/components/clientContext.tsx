import React, { createContext, Dispatch, SetStateAction, useState } from 'react';

type Props = {
    children: React.ReactNode;
};

interface clientObj {
    client: {
    ClientId: number | null,
    Name: string[] | null,
    PropertyName: string | null,
    PropertyId: number | null,
    Acreage: number | null,
    },
    setClient: Dispatch<SetStateAction<clientObj>>;
};

const initialContext: clientObj = {
    client: {
    "ClientId": null,
    "Name": [
        "",
        ""
    ],
    "PropertyName": "",
    "PropertyId": null,
    "Acreage": null,
},
    setClient: (): void => {},
};


const ClientContext = createContext<clientObj>(initialContext);

const ClientContextProvider = ({ children }: Props): JSX.Element => {
    const [client, setClient] = useState<clientObj>(initialContext);

    return (
        <ClientContext.Provider value={{ ...client, setClient }}>
            {children}
        </ClientContext.Provider>
    );
};

export { ClientContext, ClientContextProvider };