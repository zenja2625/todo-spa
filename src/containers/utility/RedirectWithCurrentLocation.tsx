import { FC } from 'react'
import { Redirect, useLocation, useRouteMatch } from 'react-router'

type RedirectWithCurrentLocationProps = {
    to: string
}

export const RedirectWithCurrentLocation: FC<RedirectWithCurrentLocationProps> = ({ to }) => {
    const { pathname } = useLocation<{ from: string } | undefined>()

    return <Redirect to={{ pathname: to, state: { from: pathname } }} />
}
