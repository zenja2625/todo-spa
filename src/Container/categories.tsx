import { Button, Grid, IconButton, ListItemIcon, List, ListItem, makeStyles, Typography, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import React, { useState } from 'react'
import DeleteIcon from '@material-ui/icons/Delete';


const useStyles = makeStyles({
    root: {
        backgroundColor: 'gainsboro',
        minHeight: '100%'
    },
    deleteButton: {
        color: 'red',
        display: 'none'
    },
    secListItem: {
        visibility: "hidden"
    },
    listItem: {
        "&:hover $secListItem": {
            visibility: "inherit"
        },
        "&:hover $button": {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
        },
    },
    button: {
    }
});

export const Categories = () => {
    const classes = useStyles()

    const [selected, setSelected] = useState(1)
    const [hover, setHover] = useState(0)

    const array = [...Array(6 + 1)].slice(1)

    const categories = array.map((_, i) => {
        let iter = i + 1
        let selectedItem = selected === iter
        return (
            <ListItem
                key={iter}
                button
                classes={{
                    container: classes.listItem,
                    button: classes.button
                }}
                selected={selectedItem}
                onMouseOver={() => setHover(iter)}
                onMouseOut={() => setHover(0)}
                onClick={() => setSelected(iter)}>

                <ListItemText primary={'Category ' + iter} />
                <ListItemSecondaryAction className={classes.secListItem}>
                    <IconButton
                        className={undefined}
                        onMouseOver={() => setHover(iter)}
                        onMouseOut={() => setHover(0)}
                    >
                        <DeleteIcon />
                    </IconButton>

                </ListItemSecondaryAction>

            </ListItem>
        )
    })

    return (
        <div className={classes.root}>
            <Typography variant='h5'>
                Categories
            </Typography>

            <List>
                {categories}
            </List>
            <Typography variant='h5'>
                {hover.toString()}
            </Typography>
        </div>
    );
}
