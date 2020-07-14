import React, {useState} from 'react';

const Form = () => {
    const defaultState = {
        name: '',
        email: '',
        password: '',
        terms: false,
    }

    const [user, setUser] = useState(defaultState);

    const handleChange = event => {
        const value =
        event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setUser({
            ...user,
            [event.target.name]: value
        });
    }

    const handleSubmit = event => {
        event.preventDefault();
        console.log('submitted');
        setUser(defaultState);
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor='name'>
                Name:
                <input type='text' name='name' value={user.name} onChange={handleChange} errors='' />
            </label>
            <label htmlFor='name'>
                Email:
                <input type='text' name='email' value={user.email} onChange={handleChange} errors='' />
            </label>
            <label htmlFor='name'>
                Password:
                <input type='text' name='password' value={user.password} onChange={handleChange} errors='' />
            </label>
            <label htmlFor='terms'>
                Terms of Service
                <input name='terms' type='checkbox' onChange={handleChange} />
            </label>
            <button disabled=''>Submit</button>
        </form>
    )
}

export default Form;