import React, { useState, useEffect, useRef } from "react";
import { Timestamp } from "firebase/firestore";
import style from "../style/notepad.module.css";
import color from "../style/colornote.module.css";
import LeftButton from "../navigation/LeftButton";
import RightButton from "../navigation/RightButton";
import { useDataContext } from "../../src/hook/StateContext";
import { NoteSaved } from "../popup/NoteSaved";
import { useRouter } from "next/router";
import {
	getColor,
	getCurrentDate,
	sessionGet,
	sessionSet,
} from "../../src/function/lib";
import Head from "next/head";
const axios = require("axios");

const NoteComponent = (props) => {
	const [clearButton, SetClearButton] = useState(<div></div>);
	const [inputTitle, SetInputTitle] = useState("");
	const [autoTitle, SetAutoTitle] = useState(true);
	const [content, SetContent] = useState("");
	const [notepadColor, SetNotepadColor] = useState({
		new_color: color["yellow_notepad"],
		old_color: color["yellow_notepad"],
	});
	const [leftButton, SetLeftButton] = useState();
	const [noteID, SetNoteID] = useState();
	const [save, SetSave] = useState();
	const [savePopUp, setSavePopUp] = useState({
		saved: false,
		saving: false,
		moving: false,
		success: false,
	});
	const [dateNote, SetDateNote] = useState({
		date_modified: null,
		date_created: null,
	});
	const [restore, SetRestore] = useState({
		unarchive: false,
		untrash: false,
	});
	const [deletePerm, SetDeletePerm] = useState();
	const [backsave, SetBacksave] = useState(false);
	const [archiveConfirm, SetArchiveConfirm] = useState();
	const [trashConfirm, SetTrashConfirm] = useState();
	const [emptyNote, SetEmptyNote] = useState();
	const { userData } = useDataContext();
	const route = useRouter();
	const isMounted = useRouter(false);
	const titleRef = useRef();
	const textareaRef = useRef();

	const inputFocus = () => {
		if (
			inputTitle.length !== 0 &&
			document.activeElement === titleRef.current
		) {
			return SetClearButton(
				<button className={style.clear_button} onMouseDown={clearInput}>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
						<path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z" />
					</svg>
				</button>,
			);
		}
		return SetClearButton(<div></div>);
	};

	const clearInput = (e) => {
		e.preventDefault();
		SetInputTitle("");
		return titleRef.current.focus();
	};

	const inputUnfocus = () => {
		SetClearButton(<div></div>);
	};

	const handleContent = (e) => {
		let value = e.target.value;
		SetContent(value);
		if (autoTitle) {
			if (value.length > 40) return SetInputTitle(value.substring(0, 40));
			return SetInputTitle(value);
		}
		return SetAutoTitle(false);
	};

	const handleSave = async () => {
		if (!save || (inputTitle.length == 0 && content.length == 0))
			return SetSave(false);
		if (inputTitle == "") return SetInputTitle(getCurrentDate());
		setSavePopUp({ ...savePopUp, saving: true });
		try {
			const timeNow = Timestamp.now();
			const send = await axios.post("/api/sendnote?type=notes", {
				uid: userData.user.uid,
				type: "note",
				title: inputTitle,
				content,
				color: getColor(notepadColor.new_color),
				date_created: timeNow,
				date_modified: timeNow,
			});

			if (send.data.status == 200) {
				SetDateNote({ ...dateNote, date_created: timeNow });
				setSavePopUp({ ...savePopUp, saved: true, saving: false });
				SetNoteID(send.data.id);
				SetNotepadColor({ ...notepadColor, old_color: notepadColor.new_color });
				return SetSave(false);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleUpdate = async () => {
		if (!save || (inputTitle.length == 0 && content.length == 0))
			return SetSave(false);
		if (inputTitle == "") return SetInputTitle(getCurrentDate());
		setSavePopUp({ ...savePopUp, saving: true });
		let collectionName = props.isArchive ? "archives" : "notes";
		let payload = {
			uid: userData.user.uid,
			type: "note",
			title: inputTitle,
			content,
			color: getColor(notepadColor.new_color),
			date_modified: Timestamp.now(),
			date_created: dateNote.date_created,
		};
		try {
			const send = await axios.put(
				`/api/sendnote?type=${collectionName}&id=${noteID}`,
				payload,
			);
			if (send.data.status == 200) {
				setSavePopUp({ ...savePopUp, saved: true, saving: false });
				SetNotepadColor({ ...notepadColor, old_color: notepadColor.new_color });
				return SetSave(false);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleArchiveTrash = async (collectionDB, originCollection) => {
		setSavePopUp({ ...savePopUp, moving: true });
		if (inputTitle == "") return SetInputTitle(getCurrentDate());
		const payload = {
			uid: userData.user.uid,
			type: "note",
			title: inputTitle,
			content,
			color: getColor(notepadColor.new_color),
			date_created: !noteID ? Timestamp.now() : dateNote.date_created,
			date_modified: Timestamp.now(),
		};
		try {
			const send = await axios.post(
				`/api/sendnote?type=${collectionDB}`,
				payload,
			);
			if (send.data.status == 200) {
				setSavePopUp({ ...savePopUp, success: true, moving: false });
				if (noteID)
					return axios.delete(`/api/sendnote?type=${originCollection}`, {
						data: { id: noteID },
					});
				return;
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleDeletePermanent = async () => {
		if (!noteID) return;
		setSavePopUp({ ...savePopUp, moving: true });
		try {
			await axios.delete(`/api/sendnote?type=trashes`, {
				data: { id: noteID },
			});
			return setSavePopUp({ ...savePopUp, success: true, moving: false });
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (!JSON.parse(localStorage.getItem("logged_user"))) route.push("/");
	}, []);

	useEffect(() => {
		if (props.title) {
			SetNoteID(props.noteID);
			SetContent(props.content);
			SetNotepadColor({
				new_color: color[props.color + "_notepad"],
				old_color: color[props.color + "_notepad"],
			});
			SetDateNote({
				date_created: props.date_created,
				date_modified: props.date_modified,
			});
			SetInputTitle(props.title);
			isMounted.current = false;
			SetLeftButton(false);
		}
	}, []);

	useEffect(() => {
		if (!noteID) handleSave();
		else handleUpdate();
		inputFocus();
	}, [inputTitle, userData, save, noteID]);

	useEffect(() => {
		inputTitle.length == 0 && content.length == 0
			? SetEmptyNote(true)
			: SetEmptyNote(false);
		if (archiveConfirm) {
			handleArchiveTrash("archives", "notes");
		}
		if (trashConfirm) {
			handleArchiveTrash("trashes", "notes");
		}
		if (restore.unarchive) {
			handleArchiveTrash("notes", "archives");
		}
		if (restore.untrash) {
			handleArchiveTrash("notes", "trashes");
		}
		if (deletePerm) {
			handleDeletePermanent();
		}
	}, [archiveConfirm, trashConfirm, inputTitle, content, restore, deletePerm]);

	useEffect(() => {
		let timer;
		if (savePopUp.saved) {
			if (backsave) {
				timer = setTimeout(() => {
					setSavePopUp({ ...savePopUp, saved: false });
					SetBacksave(false);
					route.back();
				}, 1000);
				return () => clearTimeout(timer);
			}
			timer = setTimeout(() => {
				setSavePopUp({ ...savePopUp, saved: false });
			}, 2000);
			return () => clearTimeout(timer);
		}
		if (savePopUp.success) {
			if (props.isArchive) {
				let archive = sessionGet("Context_hook").archive_data;
				sessionSet("Context_hook", {
					archive_data: archive,
					removeData: noteID,
				});
				return route.back();
			}
			if (props.isTrash) {
				let trash = sessionGet("Context_hook").trash_data;
				sessionSet("Context_hook", { trash_data: trash, removeData: noteID });
				return route.back();
			}
			if (sessionGet("Context_hook")?.allnotes_data) {
				let allnotes = sessionGet("Context_hook").allnotes_data;
				sessionSet("Context_hook", {
					allnotes_data: allnotes,
					removeData: noteID,
				});
				return route.back();
			}

			timer = setTimeout(() => {
				setSavePopUp({ ...savePopUp, success: false });
				route.back();
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, [savePopUp]);

	useEffect(() => {
		if (isMounted.current && !save) {
			if (leftButton || notepadColor.new_color == notepadColor.old_color)
				return;
			SetBacksave(true);
		} else {
			if (!props.noteID && !noteID) return;
			isMounted.current = true;
		}
	}, [notepadColor, savePopUp]);

	return (
		<div>
			{!userData ? null : (
				<>
					<Head>
						<title>{props.title ? props.title : "Note"}</title>
					</Head>
					<main className={style.note_panel}>
						<LeftButton
							status={leftButton}
							backsave={backsave}
							checkicon={(props) => {
								SetLeftButton(props), SetBacksave(false);
							}}
							saveNote={(props) => SetSave(props)}
						/>
						<section className={`${style.notepad} ${notepadColor.new_color}`}>
							{savePopUp.saved ? <NoteSaved status={"Saved"} /> : null}
							{savePopUp.saving ? <NoteSaved status={"Saving"} /> : null}
							{savePopUp.moving ? <NoteSaved status={"Moving"} /> : null}
							{savePopUp.success ? <NoteSaved status={"Success"} /> : null}
							<div className={style.note_title}>
								<input
									readOnly={props.isTrash ? true : false}
									type="text"
									className={style.input_title}
									onFocus={() => {
										props.isTrash ? null : inputFocus(),
											props.isTrash ? null : SetLeftButton(true),
											SetAutoTitle(false),
											SetBacksave(false);
									}}
									onBlur={inputUnfocus}
									ref={titleRef}
									name="title"
									onChange={(e) => SetInputTitle(e.target.value)}
									value={inputTitle}
									maxLength="40"
								/>
								{clearButton}
							</div>
							<textarea
								readOnly={props.isTrash ? true : false}
								ref={textareaRef}
								name="content"
								autoFocus={Object.keys(props).length === 0 ? true : false}
								onFocus={() => {
									props.isTrash ? null : SetLeftButton(true),
										SetBacksave(false);
								}}
								onChange={handleContent}
								onKeyPress={(e) => {
									if (e.key == "Enter") {
										return SetAutoTitle(false);
									}
								}}
								value={content}></textarea>
						</section>
						<RightButton
							currentColor={notepadColor.new_color}
							changeBg={(Bg) =>
								SetNotepadColor({ ...notepadColor, new_color: Bg })
							}
							emptyNote={emptyNote}
							emptyNoteDialog={(props) => SetEmptyNote(props)}
							archiveConf={(conf) => SetArchiveConfirm(conf)}
							trashConf={(conf) => SetTrashConfirm(conf)}
							isArchive={props.isArchive}
							isTrash={props.isTrash}
							unarchive={(conf) => SetRestore({ ...restore, unarchive: conf })}
							untrash={(conf) => SetRestore({ ...restore, untrash: conf })}
							deletePerm={(conf) => SetDeletePerm(conf)}
						/>
					</main>
				</>
			)}
		</div>
	);
};

export default NoteComponent;
