import { useEffect, useState } from 'react'
import { Transition } from 'react-transition-group'
import style from '../style/notepad.module.css'

const TIMEOUT = 300

const transitionPopUp = {
    entering: {
        zIndex: 20,
        opacity: 0,
        transform: 'translateY(-40px)',
    },
    entered: {
        zIndex: 20,
        opacity: 1,
        transform: 'translateY(0px)',
        transition: `opacity ${TIMEOUT}ms, transform ${300}ms`,
    },
    exiting: {
        zIndex: 100,
        opacity: 1
    },
    exited: {
        zIndex: 100,
        opacity: 0,
        transform: 'translateY(-20px)',
        transition: `opacity ${TIMEOUT}ms, transform ${TIMEOUT}ms`
    }
}

export const NoteSaved = (props) => {
    const [show, setShow] = useState(true)
    const [saveStatus, SetSaveStatus] = useState(props.status)

    useEffect(() => {
        if (true) {
            setTimeout(() => {
                setShow(false)
            }, 3000);
        }
    }, [])

    return (
        <div>
            <Transition in={show} timeout={0} appear={true}>
                {state => (
                    <div style={{
                        ...transitionPopUp[state],
                    }}>
                        <div className={style.saved}>
                            <p>{saveStatus}</p>
                        </div>
                    </div>
                )}
            </Transition>

        </div>
    )
}
