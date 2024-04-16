import React, { useState } from 'react'
import style from '../style/notepad.module.css'


const NavTodo = (props) => {

    const [trigger, SetTrigger] = useState(0)


    const addTodoTop = () => {
        if (props.isTrash) return
        SetTrigger(trigger + 1)
        if (!props.editMode) {
            props.changeEditMode(true)
        }
        const items = Array.from(props.todoData)
        items.unshift({
            todo: "",
            checked: false,
            id: `${crypto.randomUUID()}`
        })

        props.updateData(items)
        return props.triggerFocus(trigger)
    }

    const sortTodo = (status) => {
        if (props.isTrash) return
        SetTrigger(trigger + 1)
        const items = Array.from(props.todoData)
        if (status) {
            items.sort((a, b) => {
                return b['checked'] - a['checked']

            })
            return props.updateData(items)
        }
        items.sort((a, b) => {
            let ta = a.todo.toLowerCase(),
                tb = b.todo.toLowerCase()
            if (ta < tb) return -1;
            if (ta > tb) return 1;
        })
        return props.updateData(items)
    }

    const deleteCheckedItems = () => {
        if (props.isTrash) return
        const items = Array.from(props.todoData)
        const result = items.filter((data) => data.checked == false)
        props.updateData(result)
    }

    const itemsSelection = (option) => {
        if (props.isTrash) return
        SetTrigger(trigger + 1)
        const items = Array.from(props.todoData)
        for (const obj of items) {
            if (option == "check") {
                obj.checked = true;
            }
            else if (option == "uncheck") {
                obj.checked = false;
            }
        }
        // props.tgrTodoData(trigger + 1)
        return props.updateData(items)
    }


    return (
        <div className={style.navTodo}>
            <a className={style.addTodo} onClick={addTodoTop}>
                + Add Item
            </a>
            <div className={style.dropdownNavTodo}>
                <a
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    Sort ▿
                </a>
                <ul className='dropdown-menu dropdown-menu-end'>
                    <li onClick={() => sortTodo(true)}><a >Sort by status</a></li>
                    <li onClick={() => sortTodo(false)}><a >Sort alphabetically</a></li>
                </ul>
                <a
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    Items ({props.todoData.filter(data => data.checked == true).length}) ▿
                </a>
                <ul className='dropdown-menu dropdown-menu-end'>
                    <li onClick={() => itemsSelection("check")}><a>Check all items</a></li>
                    <li onClick={() => itemsSelection("uncheck")}><a>Uncheck all items</a></li>
                    <li onClick={deleteCheckedItems}><a>Remove all checked items</a></li>
                </ul>

            </div>
        </div>
    )
}

export default NavTodo