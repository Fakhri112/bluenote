import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";
import header from "../components/style/allnotes.module.css";
import color from "../components/style/colornote.module.css";
import style from "../components/style/trash.module.css";
import { useDataContext } from "../src/hook/StateContext";
import { Transition, TransitionGroup } from "react-transition-group";
import { sessionGet, sessionSet } from "../src/function/lib";
import ModalDialog from "../components/popup/ModalDialog";
import { NoteSaved } from "../components/popup/NoteSaved";
import { transitionRemove } from "../src/function/transition";
import Head from "next/head";
const axios = require("axios");

const Trash = () => {
	const [allnotes, SetAllNotes] = useState([]);
	const [deleteAll, SetDeleteAll] = useState();
	const { userData } = useDataContext();
	const [savePopUp, setSavePopUp] = useState({
		deleting: false,
		deleted: false,
	});
	const [confEmpty, SetConfEmpty] = useState();

	const fetchNotes = async () => {
		if (userData) {
			const response = await axios.post("/api/fetchdatas?type=trashes", {
				uid: userData.user.uid,
			});
			sessionSet("Context_hook", { trash_data: response.data });
			return SetAllNotes(response.data);
		}
	};
	const bulkDelete = async () => {
		const payload = {
			current_uid: userData.user.uid,
			all_trash: JSON.stringify(allnotes),
		};
		const deleteData = await axios.delete("api/bulkdelete", { data: payload });
		if (deleteData.data.status == 200) {
			sessionSet("Context_hook", {});
			setSavePopUp({ deleted: true, deleting: false });
			return SetAllNotes([]);
		}
	};

	useEffect(() => {
		SetDeleteAll(false);
		if (!confEmpty) return;
		if (allnotes.length == 0) return;
		setSavePopUp({ ...savePopUp, deleting: true });
		try {
			bulkDelete();
		} catch (error) {
			console.log(error);
		}
	}, [confEmpty]);

	useEffect(() => {
		let a = sessionGet("Context_hook");
		if (a?.hasOwnProperty("removeData")) {
			return SetAllNotes(a.trash_data);
		}
		fetchNotes();
	}, [userData]);

	useEffect(() => {
		let allnotes_copy = allnotes;
		let a = sessionGet("Context_hook");
		setTimeout(() => {
			if (a?.hasOwnProperty("removeData")) {
				let remove = allnotes_copy.filter((data) => data.id !== a.removeData);
				if (allnotes.length !== remove.length) {
					SetAllNotes([...remove]);
				}
				if (a.trash_data.length !== 0) {
					return sessionSet("Context_hook", { trash_data: remove });
				}
			}
		}, 700);
	}, [allnotes]);

	useEffect(() => {
		let timer;
		if (savePopUp.deleted) {
			timer = setTimeout(() => {
				setSavePopUp({ ...savePopUp, deleted: false });
			}, 2800);
			return () => clearTimeout(timer);
		}
	}, [savePopUp]);

	return (
		<div>
			<Head>
				<title>Trash</title>
			</Head>
			<ModalDialog
				show={deleteAll}
				closeDialog={(status) => SetDeleteAll(status)}
				header={"Empty Trash Can"}
				body={"Are you sure you want to delete all notes in the trash can?"}
				confirm={"emptyTrash"}
				emptyTrash={(bool) => SetConfEmpty(bool)}
			/>
			<header>
				<section className={header.menu}>
					<div className={header.back}>
						<Link href="/">
							<a>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
									<path d="M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM384 288H205.3l49.38 49.38c12.5 12.5 12.5 32.75 0 45.25s-32.75 12.5-45.25 0L105.4 278.6C97.4 270.7 96 260.9 96 256c0-4.883 1.391-14.66 9.398-22.65l103.1-103.1c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L205.3 224H384c17.69 0 32 14.33 32 32S401.7 288 384 288z" />
								</svg>
							</a>
						</Link>
					</div>
					<h1 className="menu_title">Trash Can</h1>
				</section>
				{savePopUp.deleting ? <NoteSaved status={"Deleting"} /> : null}
				{savePopUp.deleted ? <NoteSaved status={"Deleted"} /> : null}
				<section className={style.delete_all_notes}>
					<a
						onClick={() => {
							SetDeleteAll(true);
						}}>
						<p>Empty Trash Can</p>
					</a>
				</section>
			</header>
			<main className={style.notes_section}>
				<div>
					<TransitionGroup className={style.all_notes}>
						{allnotes.map((data, index) => (
							<Transition key={data.id} timeout={400}>
								{(state) =>
									data.type == "note" ? (
										<Link href={`/trash/${data.id}`}>
											<div
												id={data.id}
												style={{
													...transitionRemove()[state],
												}}
												className={style.note + " " + color[data.color]}>
												<div
													className={`${style.note_title} d-flex justify-content-between`}>
													<p>{data.title}</p>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 448 512">
														<path d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z" />
													</svg>
												</div>
												<p className={style.note_preview}>{data.content}</p>
											</div>
										</Link>
									) : (
										<Link href={`/trash/${data.id}`}>
											<div
												id={data.id}
												style={{
													...transitionRemove()[state],
												}}
												className={style.note + " " + color[data.color]}>
												<div
													className={`${style.note_title} d-flex justify-content-between`}>
													<p>{data.title}</p>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 448 512">
														<path d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z" />
													</svg>
												</div>
												{data.content.map((list, index) =>
													list.checked ? (
														<p
															key={index}
															className={style.note_preview}
															style={{ color: "#525252" }}>
															<del>{list.todo}</del>
														</p>
													) : (
														<p key={index} className={style.note_preview}>
															{list.todo}
														</p>
													),
												)}
											</div>
										</Link>
									)
								}
							</Transition>
						))}
					</TransitionGroup>
				</div>
			</main>
		</div>
	);
};

export default Trash;
