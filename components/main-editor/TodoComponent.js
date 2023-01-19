import React, { useState, useEffect, useRef } from 'react'
import { resetServerContext } from 'react-beautiful-dnd'
import Todo from '../todo/Todo';
import style from '../style/notepad.module.css'
import color from '../style/colornote.module.css'
import LeftButton from '../navigation/LeftButton'
import RightButton from '../navigation/RightButton'
import { db } from '../../src/config/firebase.config'
import { useDataContext } from '../../src/hook/StateContext'
import { NoteSaved } from '../../components/popup/NoteSaved'
import { useRouter } from 'next/router'
import { getColor, sessionGet, sessionSet } from '../../src/function/lib'
import EditTodo from '../todo/EditTodo';
import NavTodo from '../todo/NavTodo'
import { Timestamp, addDoc, collection, updateDoc, doc, deleteDoc } from 'firebase/firestore'

const TodoComponent = (props) => {
    const [clearButton, SetClearButton] = useState(<div></div>)
    const [inputTitle, SetInputTitle] = useState("Hello World")
    const [notepadColor, SetNotepadColor] = useState({
        new_color: color['yellow_notepad'],
        old_color: color['yellow_notepad']
    })
    const [todoData, SetTodoData] = useState([])
    const [editMode, SetEditMode] = useState(false)
    const [saveTodo, SetSaveTodo] = useState(false)
    const [todoID, SetTodoID] = useState()
    const [indexFocus, SetIndexFocus] = useState(0)
    const [emptyNote, SetEmptyNote] = useState()
    const [savePopUp, setSavePopUp] = useState({
        saved: false,
        saving: false,
        moving: false,
        success: false,
    })
    const [dateTodo, SetDateTodo] = useState({
        date_modified: null,
        date_created: null
    })
    const [restore, SetRestore] = useState({
        unarchive: false,
        untrash: false,
    })
    const [backsave, SetBacksave] = useState(false)
    const [triggerTop, SetTriggerTop] = useState()
    const [tgrTodoData, SetTgrTodoData] = useState()
    const [archiveConfirm, SetArchiveConfirm] = useState()
    const [trashConfirm, SetTrashConfirm] = useState()
    const { userData, DataContext, SetDataContext } = useDataContext()
    const isMounted = useRef(false);
    const titleRef = useRef()
    const route = useRouter()
    const allChecked = todoData.filter(data => data.checked == false).length
    resetServerContext()

    const titleFocus = () => {

        if (inputTitle.length !== 0 && document.activeElement === titleRef.current) {
            titleRef.current.className = (`${style.input_title}`);
            return SetClearButton(
                <button className={style.clear_button} onMouseDown={clearTitle}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                        <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z" />
                    </svg>
                </button>
            )
        }
        return SetClearButton(<div></div>)
    }

    const clearTitle = (e) => {
        e.preventDefault()
        SetInputTitle("")
        return titleRef.current.focus();
    }


    const titleUnfocus = () => {
        titleRef.current.className = strikeTitle()
        SetClearButton(
            <div></div>
        )
    }

    const strikeTitle = () => {
        if (!editMode) {
            if (allChecked == 0 && todoData.length > 0) {
                return (`${style.title_strikethrough}  ${style.input_title}`)
            }
        }
        return style.input_title
    }

    const handleSave = async () => {
        if (!saveTodo || (inputTitle.length == 0 && todoData.length == 0)) return SetSaveTodo(false)
        setSavePopUp({ ...savePopUp, saving: true })

        await addDoc(collection(db, "todos"), {
            uid: userData.user.uid,
            type: "todo",
            title: inputTitle,
            content: todoData,
            color: getColor(notepadColor.new_color),
            date_created: Timestamp.now(),
            date_modified: Timestamp.now()
        })
            .then((res) => {
                setSavePopUp({ saved: true, saving: false })
                SetTodoID(res.id)
            })
        SetNotepadColor({ ...notepadColor, old_color: notepadColor.new_color })
        return SetSaveTodo(false)
    }


    const handleUpdate = async () => {
        if (!saveTodo || (inputTitle.length == 0 && todoData.length == 0)) return SetSaveTodo(false)
        setSavePopUp({ ...savePopUp, saving: true })
        let todoEdit = doc(db, 'todos', todoID)
        await updateDoc(todoEdit, {
            uid: userData.user.uid,
            type: "todo",
            title: inputTitle,
            content: todoData,
            color: getColor(notepadColor.new_color),
            date_modified: Timestamp.now()
        })
            .then(() => {
                setSavePopUp({ saved: true, saving: false })
            }).catch((e) => {
                console.log(e)
            })
        SetNotepadColor({ ...notepadColor, old_color: notepadColor.new_color })
        return SetSaveTodo(false)
    }


    const handleArchiveTrash = async (collectionDB, originCollection) => {
        setSavePopUp({ ...savePopUp, moving: true })
        const payload = {
            uid: userData.user.uid,
            type: "todo",
            title: inputTitle,
            content: todoData,
            color: getColor(notepadColor.new_color),
            date_created: (!todoID) ? Timestamp.now() : dateTodo.date_created,
            date_modified: Timestamp.now()
        }

        await addDoc(collection(db, collectionDB), payload)
            .then((res) => {
                setSavePopUp({ ...savePopUp, success: true, moving: false })
            })
            .catch((error) => {
                console.log(error)
            })

        if (todoID) return await deleteDoc(doc(db, originCollection, todoID));
        return
    }


    useEffect(() => {
        titleFocus()
        if (!todoID) handleSave()
        else handleUpdate()
    }, [inputTitle, userData, saveTodo])



    useEffect(() => {
        (inputTitle.length == 0 && todoData.length == 0) ?
            SetEmptyNote(true) : SetEmptyNote(false)
        if (archiveConfirm) { handleArchiveTrash('archives', 'todos') }
        if (trashConfirm) { handleArchiveTrash('trashes', 'todos') }
        if (restore.unarchive) { handleArchiveTrash('todos', 'archives') }
        if (restore.untrash) { handleArchiveTrash('todos', 'trashes') }
        return () => {
            SetArchiveConfirm(false)
            SetTrashConfirm(false)
        }
    }, [todoData, inputTitle, archiveConfirm, trashConfirm, restore])


    useEffect(() => {
        if (props.title) {
            SetTodoID(props.todoID)
            SetTodoData(props.content)
            SetNotepadColor({
                new_color: color[props.color + '_notepad'],
                old_color: color[props.color + '_notepad']
            })
            SetInputTitle(props.title)
            SetDateTodo({
                date_created: props.date_created,
                date_modified: props.date_modified
            })
            isMounted.current = false
            SetEditMode(false)
        }
    }, [])



    useEffect(() => {
        if (isMounted.current) {
            if (editMode) return
            if (notepadColor.new_color !== notepadColor.old_color || tgrTodoData >= 0)
                return SetBacksave(true)
        } else {
            if (!props.todoID && !todoID) return
            isMounted.current = true;
        }
    }, [tgrTodoData, props.todoID, notepadColor, savePopUp])


    useEffect(() => {
        let timer
        if (savePopUp.saved) {
            if (backsave) {
                timer = setTimeout(() => {
                    setSavePopUp({ ...savePopUp, saved: false })
                    SetBacksave(false)
                    route.back()
                }, 1000)
                return () => clearTimeout(timer);
            }
            timer = setTimeout(() => {
                setSavePopUp({ ...savePopUp, saved: false })
            }, 4000)
            return () => clearTimeout(timer);
        }
        if (savePopUp.success) {

            if (props.isArchive || props.isTrash) {
                let archive = sessionGet('Context_hook').archive_data
                sessionSet('Context_hook', { archive_data: archive, removeData: todoID })
                return route.back()
            }

            timer = setTimeout(() => {
                setSavePopUp({ ...savePopUp, success: false })
                route.back()
            }, 2000)
            return () => clearTimeout(timer);
        }
    }, [savePopUp])




    return (
        <div>
            <main className={style.note_panel}>
                <LeftButton status={editMode}
                    backsave={backsave}
                    checkicon={(val) => { SetEditMode(val), SetBacksave(false) }}
                    saveNote={props => SetSaveTodo(props)}
                />
                <section className={`${style.notepad} ${notepadColor.new_color}`}>
                    {(savePopUp.saved) ? < NoteSaved status={"Saved"} /> : null}
                    {(savePopUp.saving) ? < NoteSaved status={"Saving"} /> : null}
                    {(savePopUp.moving) ? < NoteSaved status={"Moving"} /> : null}
                    {(savePopUp.success && !props.isArchive) ? < NoteSaved status={"Success"} /> : null}
                    <div className={style.note_title}
                    >
                        <input type="text"
                            className={
                                strikeTitle()
                            }
                            onFocus={() => {
                                titleFocus(),
                                    SetEditMode(true)
                            }}
                            onBlur={titleUnfocus}
                            ref={titleRef}
                            name="title"
                            onChange={e => SetInputTitle(e.target.value)}
                            value={inputTitle}
                            maxLength="40"
                        />
                        {clearButton}
                    </div>
                    <NavTodo changeEditMode={value => SetEditMode(value)}
                        todoData={todoData}
                        updateData={data => SetTodoData(data)}
                        triggerTop={prop => SetTriggerTop(prop)}
                        tgrTodoData={prop => SetTgrTodoData(prop)}
                    />
                    {
                        (editMode) ? <EditTodo updateData={data => SetTodoData(data)}
                            todoData={todoData}
                            triggerTop={triggerTop}
                            indexFocus={indexFocus}
                            updateIndex={index => SetIndexFocus(index)}
                        />
                            : <Todo
                                todoData={todoData}
                                updateData={(data) =>
                                    SetTodoData(data)
                                }
                                tgrTodoData={prop => SetTgrTodoData(prop)}
                                editMode={value =>
                                    SetEditMode(value)
                                }
                                indexData={index =>
                                    SetIndexFocus(index)
                                }
                            />
                    }
                </section>
                <RightButton
                    currentColor={notepadColor.new_color}
                    changeBg={Bg => SetNotepadColor({ ...notepadColor, new_color: Bg })}
                    emptyNote={emptyNote}
                    emptyNoteDialog={props => SetEmptyNote(props)}
                    archiveConf={conf => SetArchiveConfirm(conf)}
                    trashConf={conf => SetTrashConfirm(conf)}
                    isArchive={props.isArchive}
                    isTrash={props.isTrash}
                    unarchive={conf => SetRestore({ ...restore, unarchive: conf })}
                    untrash={conf => SetRestore({ ...restore, untrash: conf })}
                />

            </main>
        </div >
    )
}

export default TodoComponent