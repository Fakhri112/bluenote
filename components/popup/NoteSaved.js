import { useEffect, useState } from 'react'
import { Transition } from 'react-transition-group'
import style from '../style/notepad.module.css'
import { transitonSave } from '../../src/function/transition'

export const NoteSaved = (props) => {
    const [show, setShow] = useState(true)
    const [saveStatus, SetSaveStatus] = useState(props.status)

    useEffect(() => {
        if (true) {
            setTimeout(() => {
                setShow(false)
            }, 2500);
        }
    }, [])

    return (
        <div>
            <Transition in={show} timeout={0} appear={true}>
                {state => (
                    <div style={{
                        ...transitonSave()[state],
                    }} className={style.saved}>
                        <p>{saveStatus}</p>
                    </div>
                )}
            </Transition>

        </div>
    )
}
