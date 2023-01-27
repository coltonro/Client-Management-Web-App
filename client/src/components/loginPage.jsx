import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput } from '@mantine/core';
import '../../style.css';

const LoginPage = ({ setLoggedIn }) => {
    const [input, setInput] = useState('');
    const password = 'GoldenCheek200';
    const navigate = useNavigate();

    const setCookie = () => {
        const date = new Date();
        const daysUntilExpires = 30;
        date.setTime(date.getTime() + (daysUntilExpires * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = `login = ${password}; ${expires}; path=/`;
    }

    const checkPassword = (e) => {
        e.preventDefault();
        if (input === password) {
            setLoggedIn(true);
            setCookie();
            navigate("/");
        }
        setInput('');
    }

    return (
        <>
            <form
                className='loginForm'
                onSubmit={(e) => checkPassword(e)}>
                <TextInput
                    placeholder="Enter Password"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
            </form>
        </>
    )
}

export default LoginPage