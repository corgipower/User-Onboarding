import React, {useState, useEffect} from 'react';
import * as yup from 'yup';
import axios from 'axios';

const Form = () => {
    const defaultState = {
        name: '',
        email: '',
        password: '',
        terms: 0,
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
        console.log('VCevent', event);//checkbox value is correct true/false
        console.log('VCuser', user);//checkbox value is incorrect true/0

        yup.reach(formSchema, event.target.name)
            .validate(event.target.value)
            .then(valid => {
                console.log('valid', valid);//no log statement when box is checked
                setErrors({...errors, [event.target.name]: ''})})
            .catch(error => {
                console.log('error', error); //logs when box is checked
                setErrors({...errors, [event.target.name]: error.errors[0]})});

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
        console.log('HCtargetValue', targetValue); //checkbox value correct true/false
        console.log('HCuser', user);//checkbox value incorrect true/0
        validateChange(event);
    }

    const handleSubmit = event => {
        event.preventDefault();
        axios
            .post('https://reqres.in/api/users', user)
            .then(res => {
                console.log(errors);
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
                    {errors.name.length > 0 ? <p data-cy='name-err'>{errors.name}</p> : ''} 
                </label>
                <label htmlFor='email'>
                    Email:
                    <input type='text' name='email' value={user.email} onChange={handleChange} errors={errors} />
                    {errors.email.length > 0 ? <p data-cy='email-err'>{errors.email}</p> : ''} 
                </label>
                <label htmlFor='password'>
                    Password:
                    <input type='text' name='password' value={user.password} onChange={handleChange} errors={errors} />
                    {errors.password.length > 0 ? <p data-cy='pw-err'>{errors.password}</p> : ''} 
                </label>
                <label htmlFor='terms'>
                    Terms of Service
                    <input name='terms' type='checkbox' value={user.terms} onChange={handleChange} errors={errors} checked={user.terms} />
                    {errors.terms.length > 0 ? <p data-cy='terms-err'>{errors.terms}</p> : null}
                </label>
                <button data-cy='submit' disabled={disableButton}>Submit</button>
                {users.map(u => 
                    <p key={u.id}>{u.name} {u.email}</p>
                )}
            </form>
        </div>
    )
}

export default Form;