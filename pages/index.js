import React, { useEffect, useState } from 'react'
import style from '../components/style/mainpage.module.css'
import color from '../components/style/colornote.module.css'
import Link from 'next/link'
import { getAuth, signOut } from '@firebase/auth'
import Authpage from '../components/login-page/Authpage'
import { useDataContext } from '../src/hook/StateContext'
import Delay from '../components/other/Delay'
import Image from "next/image"
const axios = require('axios');
const MAX_INDEX_NOTE = 9

const mainpage = () => {
    const [allnotes, SetAllNotes] = useState()
    const { userData } = useDataContext()
    const auth = getAuth()




    const logOut = () => {
        signOut(auth).then(() => {
            if (typeof window !== "undefined") {
                localStorage.removeItem("logged_user")
            }
        }).catch((error) => {
            console.log(error)
        });
    }


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
                return b['date_modified']._seconds - a['date_modified']._seconds

            })
            return SetAllNotes(dataCombined.slice(0, MAX_INDEX_NOTE))
        }
    }

    useEffect(() => {
        fetchNotes()
    }, [userData])

    return (
        <>
            {(!userData) ?
                <Delay>
                    <Authpage />
                </Delay> :
                <>
                    <header className={style.header_mainpage}>
                        <div className={style.title}>
                            <h1>BlueNote</h1>
                            <p>A ColorNote Replica App</p>
                        </div>
                        <div className={`${style.user} dropdown`}>
                            <button
                                type="button"
                                id="dropdownMenuButton1"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c39.77 0 72 32.24 72 72S295.8 272 256 272c-39.76 0-72-32.24-72-72S216.2 128 256 128zM256 448c-52.93 0-100.9-21.53-135.7-56.29C136.5 349.9 176.5 320 224 320h64c47.54 0 87.54 29.88 103.7 71.71C356.9 426.5 308.9 448 256 448z" />
                                </svg>
                            </button>
                            <ul className={`${style.dropdown} dropdown-menu`}>
                                <li className='d-flex px-3 align-items-center'>
                                    {
                                        (JSON.parse(localStorage.getItem("logged_user")).providerId.includes('facebook')) ?
                                            <svg className='me-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" />
                                            </svg>
                                            : (JSON.parse(localStorage.getItem("logged_user")).providerId.includes('google')) ?
                                                <svg className='me-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                                    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                                                </svg>
                                                : <></>

                                    }
                                    {(userData?.user) ? userData?.user?.displayName : <></>}
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <a onClick={logOut} className="dropdown-item" href="#">
                                        Sign Out
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </header>
                    <main className={style.main}>
                        <section className={style.add_note}>
                            <h2>Add Note</h2>
                            <Link href="/note">
                                <a>
                                    <div className={style.add_block}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">

                                            <path d="M0 64C0 28.65 28.65 0 64 0H224V128C224 145.7 238.3 160 256 160H384V198.6C310.1 219.5 256 287.4 256 368C256 427.1 285.1 479.3 329.7 511.3C326.6 511.7 323.3 512 320 512H64C28.65 512 0 483.3 0 448V64zM256 128V0L384 128H256zM288 368C288 288.5 352.5 224 432 224C511.5 224 576 288.5 576 368C576 447.5 511.5 512 432 512C352.5 512 288 447.5 288 368zM448 303.1C448 295.2 440.8 287.1 432 287.1C423.2 287.1 416 295.2 416 303.1V351.1H368C359.2 351.1 352 359.2 352 367.1C352 376.8 359.2 383.1 368 383.1H416V431.1C416 440.8 423.2 447.1 432 447.1C440.8 447.1 448 440.8 448 431.1V383.1H496C504.8 383.1 512 376.8 512 367.1C512 359.2 504.8 351.1 496 351.1H448V303.1z" />
                                        </svg>
                                        <p className={style.button_label}>Text</p>
                                    </div>
                                </a>
                            </Link>
                            <Link href="/checklist">
                                <a>
                                    <div className={style.add_block}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">

                                            <path d="M152.1 38.16C161.9 47.03 162.7 62.2 153.8 72.06L81.84 152.1C77.43 156.9 71.21 159.8 64.63 159.1C58.05 160.2 51.69 157.6 47.03 152.1L7.029 112.1C-2.343 103.6-2.343 88.4 7.029 79.03C16.4 69.66 31.6 69.66 40.97 79.03L63.08 101.1L118.2 39.94C127 30.09 142.2 29.29 152.1 38.16V38.16zM152.1 198.2C161.9 207 162.7 222.2 153.8 232.1L81.84 312.1C77.43 316.9 71.21 319.8 64.63 319.1C58.05 320.2 51.69 317.6 47.03 312.1L7.029 272.1C-2.343 263.6-2.343 248.4 7.029 239C16.4 229.7 31.6 229.7 40.97 239L63.08 261.1L118.2 199.9C127 190.1 142.2 189.3 152.1 198.2V198.2zM224 96C224 78.33 238.3 64 256 64H480C497.7 64 512 78.33 512 96C512 113.7 497.7 128 480 128H256C238.3 128 224 113.7 224 96V96zM224 256C224 238.3 238.3 224 256 224H480C497.7 224 512 238.3 512 256C512 273.7 497.7 288 480 288H256C238.3 288 224 273.7 224 256zM160 416C160 398.3 174.3 384 192 384H480C497.7 384 512 398.3 512 416C512 433.7 497.7 448 480 448H192C174.3 448 160 433.7 160 416zM0 416C0 389.5 21.49 368 48 368C74.51 368 96 389.5 96 416C96 442.5 74.51 464 48 464C21.49 464 0 442.5 0 416z" />
                                        </svg>
                                        <p className={style.button_label}>Checklist</p>
                                    </div>
                                </a>
                            </Link>
                        </section>
                        <section className={style.notes_section}>
                            <Link href="/allnotes">
                                <a>
                                    <h2>Notes &gt;</h2>
                                </a>
                            </Link>
                            <div className={style.all_note}>
                                {(allnotes) ? allnotes.map((data, index) => (
                                    (data.type == 'note') ?
                                        <Link href={`/note/${data.id}`} key={index}>
                                            <div className={style.notes + " " + color[data.color]}>
                                                <div className={style.note_title}>
                                                    <p>{data.title}</p>
                                                </div>
                                                <p className={style.note_preview}>
                                                    {data.content}
                                                </p>
                                            </div>
                                        </Link> :
                                        <Link href={`/todo/${data.id}`} key={index}>
                                            <div className={style.notes + " " + color[data.color]}>
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
                                )) : <></>
                                }
                            </div>
                        </section>
                        <section className={style.more}>
                            <h2>More</h2>
                            <Link href="/archive">
                                <a>
                                    <div className={style.more_block}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path d="M512 144v288c0 26.5-21.5 48-48 48h-416C21.5 480 0 458.5 0 432v-352C0 53.5 21.5 32 48 32h160l64 64h192C490.5 96 512 117.5 512 144z" />
                                        </svg>
                                        <p className={style.button_label}>Archive</p>
                                    </div>
                                </a>
                            </Link>
                            <Link href="/trash">
                                <a>
                                    <div className={style.more_block}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                            <path d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM31.1 128H416V448C416 483.3 387.3 512 352 512H95.1C60.65 512 31.1 483.3 31.1 448V128zM111.1 208V432C111.1 440.8 119.2 448 127.1 448C136.8 448 143.1 440.8 143.1 432V208C143.1 199.2 136.8 192 127.1 192C119.2 192 111.1 199.2 111.1 208zM207.1 208V432C207.1 440.8 215.2 448 223.1 448C232.8 448 240 440.8 240 432V208C240 199.2 232.8 192 223.1 192C215.2 192 207.1 199.2 207.1 208zM304 208V432C304 440.8 311.2 448 320 448C328.8 448 336 440.8 336 432V208C336 199.2 328.8 192 320 192C311.2 192 304 199.2 304 208z" />
                                        </svg>
                                        <p className={style.button_label}>Trash</p>
                                    </div>
                                </a>
                            </Link>
                        </section>
                    </main>
                </>

            }

        </>
    )
}





export default mainpage