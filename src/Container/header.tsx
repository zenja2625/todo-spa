import { AppBar, MenuItem, MenuList, Toolbar, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import '../App.css'
import { authApp, loguotApp } from '../store/acountReducer'
import { ApplicationState } from '../store/types'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
    }),
);

interface MenuItemValue {
    isAuth: boolean,
    value: string,
    link: string,
    event?: () => void
}

export const SiteHeader = () => {
    const classes = useStyles();
    const account = useSelector(((state: ApplicationState) => state.account))

    const dispatch = useDispatch()


    let location = useLocation();


    const StyledMenuItem = withStyles({
        root: {
            padding: '0',
        }
    })(MenuItem);

    let menuList: MenuItemValue[] = [
        {
            isAuth: false,
            value: 'Login',
            link: '/login',
        },
        {
            isAuth: false,
            value: 'Register',
            link: '/register'
        },
        {
            isAuth: true,
            value: 'Logout',
            link: '/login',
            event: () => dispatch(loguotApp())
        },
    ]

    const menuListItems = menuList.filter(x => x.isAuth === account.isAuth)
        .map((item, i) => {
            return (
                <StyledMenuItem
                    key={i}
                    selected={item.link === location.pathname ? true : false}>
                    <Link
                        to={item.link}
                        className='link'
                        onClick={item.event}>
                        <span>{item.value}</span>
                    </Link>
                </StyledMenuItem>
            )
        })


    return (
        <div className={classes.root}>
            <AppBar position='static'>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        <Link to='/' className='link link_log'>My To Do</Link>
                    </Typography>
                    <div style={{'margin': '16px'}}>{account.name}</div>
                    <MenuList disablePadding={true} className='horiz-menu'>
                        {menuListItems}
                    </MenuList>
                </Toolbar>
            </AppBar>

        </div>
    );
}
