import { Grid } from '@material-ui/core';
import React, { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addToDo, checkToDo, deleteToDo } from '../store/todoReducer';
import { ApplicationState } from '../store/types';
import { Categories } from './Categories'
import { Todos } from './Todos';

export const Main: FC = () => {
    return (
        <Grid container>
            <Grid item xs={4}><Categories /></Grid>
            <Grid item xs={8}><Todos /></Grid>
        </Grid>
    )
}