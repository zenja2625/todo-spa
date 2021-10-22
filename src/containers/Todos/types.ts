import { WindowScrollerChildProps } from 'react-virtualized';

export interface ITodosProps {
    categoryId: number
}

export interface ITodosListProps extends ITodosProps, WindowScrollerChildProps {

}