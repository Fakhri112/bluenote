import Image from "next/image"
import {
    getAuth,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
} from "firebase/auth"
import fb_btn from '../../public/login-assets/fb_btn.jpg'
import google_btn from '../../public/login-assets/google_btn.png'
import colornote from '../../public/login-assets/colornote.png'
import style from '../style/authpage.module.css'
import { useEffect } from "react"
import { useRouter } from "next/router"


const Authpage = () => {
    const auth = getAuth()
    const router = useRouter()
    const googleProv = new GoogleAuthProvider()
    const fbProv = new FacebookAuthProvider()

    const signGoogle = () => {
        signInWithPopup(auth, googleProv)
            .then((response) => {
                localStorage.setItem("logged_user", JSON.stringify(response))
                router.reload()
            })
            .catch((e) => {
                console.log(e)
            })
    }

    const signFB = () => {
        signInWithPopup(auth, fbProv)
            .then((response) => {
                localStorage.setItem("logged_user", JSON.stringify(response))
                router.reload()
            })
            .catch((e) => {
                console.log(e)
            })
    }

    useEffect(() => {
        document.body.style.backgroundColor = "rgb(" + 209 + "," + 255 + "," + 243 + ")";
    }, [])


    return (
        <div className={style.main}>
            <div className={style.brand}>
                <h1>BlueNote</h1>
                <Image src={colornote}
                    alt="Picture of the author"
                    width={650}
                    height={300}
                >
                </Image>
            </div>
            <div className={style.button_group}>
                <button onClick={signFB}><Image
                    src={fb_btn}
                    width={300}
                    height={60}
                ></Image></button>
                <button onClick={signGoogle}><Image src={google_btn}></Image></button>
            </div>

        </div >
    )
}

export default Authpage