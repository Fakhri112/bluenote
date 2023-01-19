import React, { useState } from 'react'
import { TransitionGroup, Transition } from 'react-transition-group'
import style from '../style/notepad.module.css'
const TIMEOUT = 300;

const deleteTransition = {
    exiting: {
        transition: `opacity ${TIMEOUT}ms, transform ${TIMEOUT}ms, margin-bottom ${TIMEOUT}ms`,
        marginBottom: '-64px',
        opacity: 0,
        transform: `translateY(-50px)`,
    },
}

const Todo = (props) => {

    const [trigger, SetTrigger] = useState(0)

    const checkboxChange = (id, checked) => {
        SetTrigger(trigger + 1)
        const items = Array.from(props.todoData)
        for (const obj of items) {
            if (obj.id == id && !checked) {
                obj.checked = true;
                break;
            }
            else if (obj.id == id && checked) {
                obj.checked = false;
                break;
            }
        }
        props.tgrTodoData(trigger)
        return props.updateData(items)
    };


    return (
        <TransitionGroup in="true" className="todo-list">
            {
                props.todoData.map((data, index) => (
                    <Transition in={true} key={data.id} timeout={{ enter: TIMEOUT, exit: TIMEOUT }}>
                        {status => (
                            <div style={{
                                ...deleteTransition[status]
                            }} className={style.todoList} key={data.id}>
                                <input
                                    checked={data.checked}
                                    onChange={() => checkboxChange(data.id, data.checked)}
                                    className={style.checkbox}
                                    type="checkbox"
                                />
                                <label className={data.checked == true ? style.todoChecked : ""}
                                    id={data.id}
                                    onClick={() => {
                                        props.editMode(true)
                                        props.indexData(index)
                                    }
                                    }>
                                    {data.todo}
                                </label>
                                <hr />
                            </div>
                        )}
                    </Transition>
                ))
            }
        </TransitionGroup>
    )
}

export default Todo