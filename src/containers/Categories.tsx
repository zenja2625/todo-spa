import { useState } from 'react'
import { createCategoryThunk, deleteCategoryThunk, selectCategory, updateCategoryThunk } from '../slices/categoriesSlice'
import { useAppDispatch, useAppSelector } from '../store'
import { CategoryForm } from './tools/CategoryForm'
import Title from 'antd/lib/typography/Title'
import { Menu } from 'antd'
import { useHistory, useParams } from 'react-router'

export const Categories = () => {
    const { push } = useHistory()
    const { categoryId } = useParams<{ categoryId?: string }>()


    const [canDelete, setCanDelete] = useState(false)
    const dispatch = useAppDispatch()
    const {categories, selectedCategoryId} = useAppSelector(state => ({...state.categories}))

    const categoryItem = categories.map(item => (
        <Menu.Item onClick={() => push(`/category/${item.id}`)} key={item.id}>
            {item.name}
        </Menu.Item>
    ))

    const Delete = () => {
        if (canDelete) {
            dispatch(deleteCategoryThunk(selectedCategoryId))
            setCanDelete(false)
        }
    }

    const Create = (value: string) => {
        dispatch(createCategoryThunk(value))
    }

    const Update = (value: string) => {
        const selectedCategoryId = categories.find(x => x.id.toString() === categoryId)?.id
        if (selectedCategoryId)
            dispatch(updateCategoryThunk({ id: selectedCategoryId, name: value }))
    }

    return (
        <div style={{ margin: '15px' }}>
             <Title level={4}>Категории</Title>
             <Menu selectedKeys={[ categoryId || '' ]}>
                {categoryItem}
             </Menu>
             <CategoryForm method={Create} buttonValue='Create'/>
             <CategoryForm method={Update} textValue={categories.find(x => x.id.toString() === categoryId)?.name} buttonValue='Update'/>
             <input type="button" value="Delete" onClick={Delete}/>
             <input type="checkbox" checked={canDelete} onChange={e => setCanDelete(e.target.checked)}/>

             <input type="button" onClick={() => push('/category/1')} value='Click'/>
        </div>
    )
}