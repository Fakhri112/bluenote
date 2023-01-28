import React, { useState, useEffect, useRef } from 'react'
import { resetServerContext } from 'react-beautiful-dnd'
import Todo from '../todo/Todo';
import style from '../style/notepad.module.css'
import color from '../style/colornote.module.css'
import LeftButton from '../navigation/LeftButton'
import RightButton from '../navigation/RightButton'
import { useDataContext } from '../../src/hook/StateContext'
import { NoteSaved } from '../../components/popup/NoteSaved'
import { useRouter } from 'next/router'
import { getColor, sessionGet, sessionSet } from '../../src/function/lib'
import EditTodo from '../todo/EditTodo';
import NavTodo from '../todo/NavTodo'
import Head from 'next/head';
import { Timestamp } from 'firebase/firestore'
const axios = require('axios')

const TodoComponent = (props) => {
    const [clearButton, SetClearButton] = useState(null)
    const [inputTitle, SetInputTitle] = useState("")
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
    const [triggerFocus, SetTriggerFocus] = useState()
    const [tgrTodoData, SetTgrTodoData] = useState()
    const [archiveConfirm, SetArchiveConfirm] = useState()
    const [trashConfirm, SetTrashConfirm] = useState()
    const [deletePerm, SetDeletePerm] = useState()
    const { userData } = useDataContext()
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
        return SetClearButton(null)
    }

    const clearTitle = (e) => {
        e.preventDefault()
        SetInputTitle("")
        return titleRef.current.focus();
    }


    const titleUnfocus = () => {
        titleRef.current.className = strikeTitle()
        SetIndexFocus(0)
        SetClearButton(null)
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

        try {
            const timeNow = Timestamp.now()
            const send = await axios.post('/api/sendnote?type=todos', {
                uid: userData.user.uid,
                type: "todo",
                title: inputTitle,
                content: todoData,
                color: getColor(notepadColor.new_color),
                date_created: timeNow,
                date_modified: timeNow
            })

            if (send.data.status == 200) {
                SetDateTodo({ ...dateTodo, date_created: timeNow })
                setSavePopUp({ ...savePopUp, saved: true, saving: false })
                SetTodoID(send.data.id)
                SetNotepadColor({ ...notepadColor, old_color: notepadColor.new_color })
                return SetSaveTodo(false)
            }
        } catch (error) {
            console.log(error)
        }
    }


    const handleUpdate = async () => {
        if (!saveTodo || (inputTitle.length == 0 && todoData.length == 0)) return SetSaveTodo(false)
        setSavePopUp({ ...savePopUp, saving: true })
        let collectionName = (props.isArchive) ? 'archives' : 'todos'
        let payload = {
            uid: userData.user.uid,
            type: "todo",
            title: inputTitle,
            content: todoData,
            color: getColor(notepadColor.new_color),
            date_modified: Timestamp.now(),
            date_created: dateTodo.date_created,
        }
        try {
            const send = await axios.put(`/api/sendnote?type=${collectionName}&id=${todoID}`, payload)
            if (send.data.status == 200) {
                setSavePopUp({ ...savePopUp, saved: true, saving: false })
                SetNotepadColor({ ...notepadColor, old_color: notepadColor.new_color })
                return SetSaveTodo(false)
            }
        } catch (error) {
            console.log(error)
        }
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
        try {
            const send = await axios.post(`/api/sendnote?type=${collectionDB}`, payload)
            if (send.data.status == 200) {
                setSavePopUp({ ...savePopUp, success: true, moving: false })
                if (todoID) return axios.delete(`/api/sendnote?type=${originCollection}`, { data: { id: todoID } })
                return
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeletePermanent = async () => {
        if (!todoID) return
        setSavePopUp({ ...savePopUp, moving: true })
        try {
            await axios.delete(`/api/sendnote?type=trashes`, { data: { id: todoID } })
            return setSavePopUp({ ...savePopUp, success: true, moving: false })
        } catch (error) {
            console.log(error)
        }
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
        if (deletePerm) { handleDeletePermanent() }
    }, [todoData, inputTitle, archiveConfirm, trashConfirm, restore, deletePerm])


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

            if (props.isArchive) {
                let archive = sessionGet('Context_hook').archive_data
                sessionSet('Context_hook', { archive_data: archive, removeData: todoID })
                return route.back()
            }
            if (props.isTrash) {
                let trash = sessionGet('Context_hook').trash_data
                sessionSet('Context_hook', { trash_data: trash, removeData: todoID })
                return route.back()
            }
            if (sessionGet('Context_hook')?.allnotes_data) {
                let allnotes = sessionGet('Context_hook').allnotes_data
                sessionSet('Context_hook', { allnotes_data: allnotes, removeData: todoID })
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
            <Head>
                <title>{(props.title) ? props.title : 'Checklist'}</title>
            </Head>
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
                            autoFocus={(Object.keys(props).length === 0) ? true : false}
                            className={
                                strikeTitle()
                            }
                            readOnly={(props.isTrash) ? true : false}
                            onFocus={() => {
                                (props.isTrash) ? null : titleFocus(),
                                    (props.isTrash) ? null : SetEditMode(true)
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
                    <NavTodo
                        isTrash={props.isTrash}
                        changeEditMode={value => SetEditMode(value)}
                        todoData={todoData}
                        triggerFocus={prop => SetTriggerFocus(prop)}
                        tgrTodoData={prop => SetTgrTodoData(prop)}
                        updateData={data => SetTodoData([...data])}
                    />
                    {
                        (editMode && !props.isTrash) ?
                            <EditTodo updateData={data => SetTodoData(data)}
                                todoData={todoData}
                                triggerFocus={triggerFocus}
                                indexFocus={indexFocus}
                                titleFocus={clearButton}
                                updateIndex={index => SetIndexFocus(index)}
                            />
                            : <Todo
                                isTrash={props.isTrash}
                                todoData={todoData}
                                updateData={(data) =>
                                    SetTodoData(data)
                                }
                                tgrTodoData={prop => SetTgrTodoData(prop)}
                                editMode={value =>
                                    (props.isTrash) ? true : SetEditMode(value)
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
                    deletePerm={conf => SetDeletePerm(conf)}
                />

            </main>
        </div >
    )
}

export default TodoComponent