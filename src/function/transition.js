export const transitionRemove = () => {
    const transitionRemove = {
        entering: {
            transform: 'translateX(40px)',
            opacity: 0
        },
        entered: {
            transform: 'translateX(0px)',
            opacity: 1,
            transition: `opacity ${300}ms, transform ${300}ms`,
        },
        exiting: {
            transition: `opacity ${300}ms, transform ${300}ms, margin-bottom ${300}ms`,
            marginBottom: '-27vh',
            opacity: 0,
            transform: `translateY(-50px)`,
        },
        exited: {
            opacity: 0
        }
    }
    return transitionRemove
}

export const transitonSave = () => {
    const transitionPopUp = {
        entering: {
            top: '0',
            opacity: 0,
        },
        entered: {
            top: '3.5vh',
            opacity: 1,
            transition: `all ${300}ms`,
        },
        exiting: {
            opacity: 1,
            top: '3.5vh',
        },
        exited: {
            opacity: 0,
            top: '0',
            transition: `all ${300}ms`
        }
    }
    return transitionPopUp
}