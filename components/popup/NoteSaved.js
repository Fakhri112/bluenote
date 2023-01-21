import { useEffect, useState } from 'react'
import { Transition } from 'react-transition-group'
import style from '../style/notepad.module.css'

const TIMEOUT = 300

const transitionPopUp = {
    entering: {
        top: '0',
        // zIndex: 20,
        opacity: 0,
        // transform: 'translateY(-40px)',
    },
    entered: {
        top: '3.5vh',
        // zIndex: 20,
        opacity: 1,
        // transform: 'translateY(0px)',
        transition: `all ${300}ms`,
    },
    exiting: {
        // zIndex: 100,
        opacity: 1,
        top: '3.5vh',
    },
    exited: {
        // zIndex: 100,
        opacity: 0,
        top: '0',
        // transform: 'translateY(-20px)',
        transition: `all ${TIMEOUT}ms`
    }
}

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
                        ...transitionPopUp[state],
                    }} className={style.saved}>
                        <p>{saveStatus}</p>
                    </div>
                )}
            </Transition>

        </div>
    )
}
