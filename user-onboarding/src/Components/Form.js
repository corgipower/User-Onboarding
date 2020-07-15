import React, {useState, useEffect} from 'react';
import * as yup from 'yup';
import axios from 'axios';

const Form = () => {
    const defaultState = {
        name: '',
        email: '',
        password: '',
        terms: false,
    }

    const [user, setUser] = useState(defaultState);
    const [errors, setErrors] = useState({...defaultState, terms: ''});
    const [disableButton, setDisableButton] = useState(true);
    const [users, setUsers] = useState([]);

    let formSchema = yup.object().shape({
        name: yup.string().required('We need your name'),
        email: yup.string().required('Please give us your email address').email('Your email address must be valid'),
        password: yup.string().required('You need a password').min(8, 'Passwords must be at least 8 characters'),
        terms: yup.boolean().required('You have to accept our terms').oneOf([true], 'You have to accept our terms'),
    });

    const validateChange = event => {
        event.persist();

        yup.reach(formSchema, event.target.name)
            .validate(event.target.value)
            .then(valid => setErrors({...errors, [event.target.name]: ''}))
            .catch(error => setErrors({...errors, [event.target.name]: error.errors[0]}));

        if(event.target.value.length === 0) {
            setErrors({...errors, [event.target.name]: `${event.target.name} is required`});
        }
    };

    useEffect(() => {
        formSchema.isValid(user).then(valid => setDisableButton(!valid));
    }, [formSchema, user])

    const handleChange = event => {
        const targetValue =
        event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setUser({
            ...user,
            [event.target.name]: targetValue
        });
        validateChange(event);
    }

    const handleSubmit = event => {
        event.preventDefault();
        axios
            .post('https://reqres.in/api/users', user)
            .then(res => {
                console.log(res);
                setUsers([
                    ...users,
                    res.data
                ]);
            })
            .catch(err => console.log('error', err));
        setUser(defaultState);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor='name'>
                    Name:
                    <input type='text' name='name' value={user.name} onChange={handleChange} errors={errors} />
                    {errors.name.length > 0 ? <p>{errors.name}</p> : ''} 
                </label>
                <label htmlFor='email'>
                    Email:
                    <input type='text' name='email' value={user.email} onChange={handleChange} errors={errors} />
                    {errors.email.length > 0 ? <p>{errors.email}</p> : ''} 
                </label>
                <label htmlFor='password'>
                    Password:
                    <input type='text' name='password' value={user.password} onChange={handleChange} errors={errors} />
                    {errors.password.length > 0 ? <p>{errors.password}</p> : ''} 
                </label>
                <label htmlFor='terms'>
                    Terms of Service
                    <input name='terms' type='checkbox' value={user.terms} onChange={handleChange} errors={errors} defaultChecked={false} />
                    {errors.terms > 0 ? <p>{errors.terms}</p> : null}
                </label>
                <button disabled={disableButton}>Submit</button>
                {users.map(u => 
                    <p key={u.id}>{u.name} {u.email}</p>
                )}
            </form>
        </div>
    )
}

export default Form;