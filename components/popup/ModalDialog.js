import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const ModalDialog = (props) => {
    return (
        <Modal show={props.show} onHide={() => props.closeDialog(false)}>
            <Modal.Header closeButton>
                {props.header}
            </Modal.Header>
            <Modal.Body>{props.body}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => props.closeDialog(false)}>
                    Close
                </Button>
                {
                    (!props.emptyNote) ?
                        <Button variant="primary" onClick={() => { props[props.confirm](true), props.closeDialog(false) }}>
                            OK
                        </Button> : null
                }
            </Modal.Footer>
        </Modal>
    )
}

export default ModalDialog