import { FC } from "react"

type TodoListProps = {
    categoryId: number
}

export const TodosList: FC<TodoListProps> = ({ categoryId }) => {


    return (
        <div>Todos List</div>
    )
}