import { useState } from 'react'
import { createCategoryThunk, deleteCategoryThunk, selectCategory, updateCategoryThunk } from '../slices/categoriesSlice'
import { useAppDispatch, useAppSelector } from '../store'
import { CategoryForm } from './tools/CategoryForm'


export const Categories = () => {
    const [canDelete, setCanDelete] = useState(false)
    const dispatch = useAppDispatch()
    const {categories, selectedCategoryId} = useAppSelector(state => ({...state.categories}))

    const categoryItem = categories.map(item => (
        <option key={item.id} onClick={() => dispatch(selectCategory(item.id))} id={item.id.toString()}>
            {item.name}
        </option>
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
        dispatch(updateCategoryThunk({ id: selectedCategoryId, name: value }))
    }

    return (
        <div>
             Category
             <div>
                <select size={categories.length}>
                    {categoryItem}
                </select>
             </div>
             <CategoryForm method={Create} buttonValue='Create'/>
             <CategoryForm method={Update} textValue={categories.find(x => x.id === selectedCategoryId)?.name} buttonValue='Update'/>
             <input type="button" value="Delete" onClick={Delete}/>
             <input type="checkbox" checked={canDelete} onChange={e => setCanDelete(e.target.checked)}/>
        </div>
    )
}