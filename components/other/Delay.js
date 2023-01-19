import { useEffect, useState } from "react";

export default function Delay({ children }) {
    const [show, setShow] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setShow(true)
        }, 100);
    })

    return (
        <>
            {show && (children)}
        </>
    )

}