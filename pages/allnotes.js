import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import style from '../components/style/allnotes.module.css'
import color from '../components/style/colornote.module.css'
import { useDataContext } from '../src/hook/StateContext'
import { getContentChecklist, sessionGet, sessionSet } from '../src/function/lib'
import { Transition, TransitionGroup } from 'react-transition-group'
import Image from "next/image"
import { transitionRemove } from '../src/function/transition'
import Head from 'next/head'
const axios = require('axios');

const allnotes = () => {
    const [allnotes, SetAllNotes] = useState([])
    const { userData } = useDataContext()
    const [sortlistActive, SetSortlistActive] = useState()

    const fetchNotes = async () => {
        if (userData) {
            const responseNotes = await axios.post('/api/fetchdatas?type=notes', {
                uid: userData.user.uid
            })
            const responseTodos = await axios.post('/api/fetchdatas?type=todos', {
                uid: userData.user.uid
            })
            let dataCombined = responseTodos.data.concat(responseNotes.data)
            dataCombined.sort((a, b) => {
                return b['date_modified'].seconds - a['date_modified'].seconds

            })
            sessionSet('Context_hook', { allnotes_data: dataCombined })
            return SetAllNotes(dataCombined)
        }
    }

    const searchFilter = (text) => {
        let getDataSession = sessionGet('Context_hook')
        let notesCopy = getDataSession?.allnotes_data,
            searchText = text.toLowerCase()

        let filtered = notesCopy.filter((item) =>
            item.title.toString().toLowerCase().includes(searchText) ||
            (Array.isArray(item.content) && getContentChecklist(item.content).toLowerCase().includes(searchText)) ||
            (!Array.isArray(item.content) && item.content.toLowerCase().includes(searchText))
        )
        if (text == '') return SetAllNotes([...getDataSession?.allnotes_data])
        return SetAllNotes([...filtered])
    }

    useEffect(() => {
        let allnotes_copy = allnotes
        let a = sessionGet('Context_hook')
        setTimeout(() => {

            if (a?.hasOwnProperty('removeData')) {
                let remove = allnotes_copy.filter(data => data.id !== a.removeData)
                if (allnotes.length !== remove.length) {
                    console.log(remove)
                    SetAllNotes([...remove])
                }
                if (a.allnotes_data.length !== 0) {
                    return sessionSet('Context_hook', { allnotes_data: remove })
                }
            }
        }, 700);
    }, [allnotes])

    useEffect(() => {
        let a = sessionGet('Context_hook')
        if (a?.hasOwnProperty('removeData')) {
            return SetAllNotes(a.allnotes_data)
        }
        fetchNotes()

    }, [userData])

    useEffect(() => {
        let notesCopy = allnotes
        if (!sessionGet('Context_hook')?.removeData) SetAllNotes([])
        if (allnotes.length !== 0) {
            notesCopy.sort((a, b) => {
                let ta = a.title.toLowerCase(),
                    tb = b.title.toLowerCase(),
                    ca = a.color.toLowerCase(),
                    cb = b.color.toLowerCase()

                if (sortlistActive == 'title') {
                    if (ta < tb) return -1;
                    if (ta > tb) return 1;
                }
                else if (sortlistActive == 'color') {
                    if (ca < cb) return 1;
                    if (ca > cb) return -1;
                }
                else {
                    return b[sortlistActive].seconds - a[sortlistActive].seconds
                }

            })
            setTimeout(() => {
                return SetAllNotes([...notesCopy])
            }, 20);
        }

    }, [sortlistActive])

    return (
        <div>
            <Head>
                <title>Notes</title>
            </Head>
            <header>
                <section className={style.menu}>
                    <div className={style.back}>
                        <Link href="/">
                            <a>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    {/*! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. */}
                                    <path d="M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM384 288H205.3l49.38 49.38c12.5 12.5 12.5 32.75 0 45.25s-32.75 12.5-45.25 0L105.4 278.6C97.4 270.7 96 260.9 96 256c0-4.883 1.391-14.66 9.398-22.65l103.1-103.1c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L205.3 224H384c17.69 0 32 14.33 32 32S401.7 288 384 288z" />
                                </svg>
                            </a>
                        </Link>
                    </div>
                    <h1 className="menu_title">Notes</h1>
                    <div className={style.dropdown}>
                        <button
                            className="btn btn-secondary btn-sm dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton1"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Sort
                        </button>
                        <ul className="dropdown-menu">
                            <li>
                                <a className={`dropdown-item ${sortlistActive == 'color' ? 'active' : ""}`} onClick={() => { SetSortlistActive('color') }}>
                                    By Color
                                </a>
                            </li>
                            <li>
                                <a className={`dropdown-item ${sortlistActive == 'date_modified' ? 'active' : ""}`} onClick={() => { SetSortlistActive('date_modified') }}>
                                    By Modified Time
                                </a>
                            </li>
                            <li>
                                <a className={`dropdown-item  ${sortlistActive == 'date_created' ? 'active' : ""}`} onClick={() => SetSortlistActive('date_created')}>
                                    By Created Time
                                </a>
                            </li>
                            <li>
                                <a className={`dropdown-item  ${sortlistActive == 'title' ? 'active' : ""}`} onClick={() => SetSortlistActive('title')}>
                                    Alphabetically
                                </a>
                            </li>
                        </ul>
                    </div>
                    <input type="text" className="search ps-2" placeholder="Search" onChange={(e) => searchFilter(e.target.value)} />
                </section>
                <section className="dropdown">
                    <button
                        className="btn btn-sm"
                        type="button"
                        id="dropdownMenuButton1"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM256 368C269.3 368 280 357.3 280 344V280H344C357.3 280 368 269.3 368 256C368 242.7 357.3 232 344 232H280V168C280 154.7 269.3 144 256 144C242.7 144 232 154.7 232 168V232H168C154.7 232 144 242.7 144 256C144 269.3 154.7 280 168 280H232V344C232 357.3 242.7 368 256 368z" />
                        </svg>
                    </button>
                    <ul className={`${style.add_new} dropdown-menu`}>
                        <Link passHref href="/note">
                            <li className="dropdown-item">
                                Text
                            </li>
                        </Link>
                        <Link passHref href="/checklist">
                            <li className="dropdown-item">
                                Checklist
                            </li>
                        </Link>
                    </ul>
                </section>
            </header>
            <main className={style.notes_section}>
                <TransitionGroup className={style.all_notes}>
                    {allnotes.map((data, index) => (
                        <Transition key={data.id} timeout={400}>
                            {state => (
                                (data.type == 'note') ?
                                    <Link href={`/note/${data.id}`}  >
                                        <div
                                            id={data.id}
                                            style={{
                                                ...transitionRemove()[state],
                                            }} className={style.note + " " + color[data.color]}>
                                            <div className={style.note_title}>
                                                <p>{data.title}</p>
                                            </div>
                                            <p className={style.note_preview}>
                                                {data.content}
                                            </p>
                                        </div>
                                    </Link> :
                                    <Link href={`/todo/${data.id}`}  >
                                        <div
                                            id={data.id}
                                            style={{
                                                ...transitionRemove()[state],
                                            }} className={style.note + " " + color[data.color]}>
                                            <div className={`${style.note_title} d-flex justify-content-between`}>
                                                <p>{data.title}</p>
                                                <Image src={'/note-assets/check-icon.png'}
                                                    width={20}
                                                    height={20}
                                                ></Image>
                                            </div>
                                            {data.content.map((list, index) => (
                                                (list.checked) ?
                                                    <p key={index} className={style.note_preview} style={{ color: '#525252' }}>
                                                        <del>{list.todo}</del>
                                                    </p>
                                                    : <p key={index} className={style.note_preview}>
                                                        {list.todo}
                                                    </p>
                                            ))}
                                        </div>
                                    </Link>
                            )}
                        </Transition>
                    ))
                    }
                </TransitionGroup>
            </main>


        </div >
    )
}

export default allnotes