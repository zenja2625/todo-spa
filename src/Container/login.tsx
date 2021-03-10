import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { authApp } from '../store/acountReducer'
import { ApplicationState } from '../store/types'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { FormikErrors, useFormik } from 'formik'
import { Link as RLink } from 'react-router-dom'


const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    main: {
        alignSelf: 'center',
        marginTop: '-64px',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
        submit: {
        margin: theme.spacing(3, 0, 2),
    },
}))

interface AuthFormValue {
    username: string,
    password: string
}

export const Login = () => {
    const dispatch = useDispatch()
    const isAuth = useSelector(((state: ApplicationState) => 
                    state.account.isAuth))
    const classes = useStyles();
    
    const authForm = useFormik<AuthFormValue>({
        initialValues: {
            username: '',
            password: ''
        },
        initialTouched: {
            username: false,
            password: false,
        },
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
            dispatch(authApp('Zenja'))
        },
        validate: (values: AuthFormValue) => {
            let errors: FormikErrors<AuthFormValue> = {  }

            if (!values.username)
                errors.username = 'Required'
            if (!values.password)
                errors.password = 'Required'
            else if (values.password.length < 5)
                errors.password = 'length < 5'

            return errors
        }
    })
    
    if (isAuth) {
        return (
            <Redirect to='/'/>
        )
    }

    return (
        <Container className={classes.main} maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                <form className={classes.form} noValidate
                        onSubmit={authForm.handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        onChange={authForm.handleChange}
                        value={authForm.values.username}
                        onBlur={authForm.handleBlur}
                        error={authForm.touched.username && !!authForm.errors.username}
                        helperText={authForm.touched.username && authForm.errors.username}
                        required
                        fullWidth
                        id="username"
                        label="Логин"
                        name="username"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        onChange={authForm.handleChange}
                        value={authForm.values.password}
                        onBlur={authForm.handleBlur}
                        error={authForm.touched.password && !!authForm.errors.password}
                        helperText={authForm.touched.password && authForm.errors.password}
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In 
                    </Button>
                    <Grid container>
                        <Grid item xs={12}>
                            <Link component={RLink} to='/register'>
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    )    

}