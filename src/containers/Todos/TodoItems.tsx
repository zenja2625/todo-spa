import { getTodos } from '../../selectors/getTodos'
import { Tree } from '../../sortableTree/Components/Tree'
import { useAppSelector } from '../../store'
import { TodoItem } from './TodoItem'

export const TodoItems = () => {
    const todos = useAppSelector(getTodos)

    return (
        <Tree
            items={todos}
            depthIndent={40}
            maxDepth={5}
            onDragEnd={() => {}}
            renderItem={(item, listeners) => {
                return <TodoItem todo={item} listeners={listeners} />
            }}
        />
    )
}
