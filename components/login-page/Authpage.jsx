import Image from "next/image";
import {
	getAuth,
	GoogleAuthProvider,
	FacebookAuthProvider,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signInWithPopup,
	sendPasswordResetEmail,
} from "firebase/auth";
import style from "../style/authpage.module.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const Authpage = () => {
	const [showEmailPanel, SetShowEmailPanel] = useState();
	const [authType, SetAuthType] = useState({
		signIn: false,
		signUp: false,
		forgotPW: false,
	});
	const [userEmail, SetUserEmail] = useState();
	const [userPassword, SetUserPassword] = useState({
		pwd: "",
		re_pwd: "",
	});
	const auth = getAuth();
	const router = useRouter();
	const googleProv = new GoogleAuthProvider();
	const fbProv = new FacebookAuthProvider();

	const signGoogle = async () => {
		try {
			const user = await signInWithPopup(auth, googleProv);
			localStorage.setItem("logged_user", JSON.stringify(user));
			router.reload();
		} catch (error) {}
	};

	const signFB = async () => {
		try {
			const user = await signInWithPopup(auth, fbProv);
			localStorage.setItem("logged_user", JSON.stringify(user));
			router.reload();
		} catch (error) {}
	};

	const signUp = async () => {
		try {
			const user = await createUserWithEmailAndPassword(
				auth,
				userEmail,
				userPassword.pwd,
			);
			localStorage.setItem("logged_user", JSON.stringify(user));
			router.reload();
		} catch (error) {
			console.log(error);
		}
	};

	const signIn = async () => {
		try {
			const user = await signInWithEmailAndPassword(
				auth,
				userEmail,
				userPassword.pwd,
			);
			localStorage.setItem("logged_user", JSON.stringify(user));
			router.reload();
		} catch (error) {
			console.log(error);
		}
	};

	const forgotPW = async () => {
		try {
			const user = await sendPasswordResetEmail(auth, userEmail);
			alert("Password reset has successfully sent to your email");
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		document.body.style.backgroundColor =
			"rgb(" + 209 + "," + 255 + "," + 243 + ")";
	}, []);

	return (
		<div className={style.main}>
			<Modal
				show={showEmailPanel}
				onHide={() => {
					SetShowEmailPanel(false),
						SetAuthType({ signIn: false, signUp: false, forgotPW: false });
				}}>
				<Modal.Header closeButton>
					{authType.signIn ? (
						<Modal.Title>Log in to your account</Modal.Title>
					) : authType.forgotPW ? (
						<Modal.Title>Forgot Password</Modal.Title>
					) : (
						<Modal.Title>Create your account</Modal.Title>
					)}
				</Modal.Header>
				<Modal.Body>
					{authType.signIn ? (
						<div className={style.form_group}>
							<label htmlFor="email">Email</label>
							<input
								type="email"
								name=""
								id="email"
								onChange={(e) => {
									SetUserEmail(e.target.value);
								}}
							/>
							<label htmlFor="Password">Password</label>
							<input
								type="password"
								name=""
								id="Password"
								onChange={(e) => {
									SetUserPassword({ ...userPassword, pwd: e.target.value });
								}}
							/>
							<small>
								<a
									href="#"
									className={style.auth_link}
									onClick={() =>
										SetAuthType({ ...authType, signIn: false, forgotPW: true })
									}>
									Forgot Password
								</a>
							</small>
							<hr />
							<small>
								Dont have an account? &nbsp;
								<a
									className={style.auth_link}
									href="#"
									onClick={() =>
										SetAuthType({ ...authType, signIn: false, signUp: true })
									}>
									Sign Up
								</a>
							</small>
						</div>
					) : authType.forgotPW ? (
						<div className={style.form_group}>
							<label htmlFor="email">Email</label>
							<input
								type="email"
								name=""
								id="email"
								onChange={(e) => {
									SetUserEmail(e.target.value);
								}}
							/>
						</div>
					) : authType.signUp ? (
						<div className={style.form_group}>
							<label htmlFor="email">Email</label>
							<input
								type="email"
								name=""
								id="email"
								onChange={(e) => {
									SetUserEmail(e.target.value);
								}}
							/>
							<label htmlFor="Password">Password</label>
							<input
								type="password"
								name=""
								id="Password"
								onChange={(e) => {
									SetUserPassword({ ...userPassword, pwd: e.target.value });
								}}
							/>
							<label htmlFor="rePassword">Re-type Password</label>
							<input
								type="password"
								name=""
								id="rePassword"
								onChange={(e) => {
									SetUserPassword({ ...userPassword, re_pwd: e.target.value });
								}}
							/>
							<hr />
							<small>
								Already have an account? &nbsp;
								<a
									className={style.auth_link}
									href="#"
									onClick={() =>
										SetAuthType({ ...authType, signIn: true, signUp: false })
									}>
									Sign In
								</a>
							</small>
						</div>
					) : (
						<></>
					)}
				</Modal.Body>
				<Modal.Footer>
					{authType.signIn ? (
						<Button variant="primary" onClick={() => signIn()}>
							Sign-in
						</Button>
					) : authType.forgotPW ? (
						<Button variant="primary" onClick={() => forgotPW()}>
							Send Password
						</Button>
					) : (
						<Button variant="primary" onClick={() => signUp()}>
							Sign-Up
						</Button>
					)}
				</Modal.Footer>
			</Modal>
			<div className={style.brand}>
				<h1>BlueNote</h1>
				<Image
					src={"/login-assets/colornote.png"}
					alt="Picture of the author"
					width={650}
					height={300}></Image>
			</div>
			<div className={style.button_group}>
				<button onClick={signFB}>
					<Image
						src={"/login-assets/fb_btn.jpg"}
						width={300}
						height={65}></Image>
				</button>
				<button onClick={signGoogle}>
					<Image
						src={"/login-assets/google_btn.png"}
						width={300}
						height={70}></Image>
				</button>
			</div>
			<div className={`${style.button_group} mt-3`}>
				<button
					className={style.signInEmail}
					onClick={() => {
						SetShowEmailPanel(true), SetAuthType({ ...authType, signIn: true });
					}}>
					Sign-in with Email
				</button>
			</div>
		</div>
	);
};

export default Authpage;
