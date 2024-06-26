import React, { useEffect, useRef, useState } from "react";
import style from "../style/notepad.module.css";
import color from "../style/colornote.module.css";
import { getColor } from "../../src/function/lib";
import ModalDialog from "../popup/ModalDialog";

const colorsCollection = [
	"red",
	"green",
	"black",
	"orange",
	"blue",
	"grey",
	"yellow",
	"purple",
	"white",
];

const RightButton = (props) => {
	const [statusColor, SetStatusColor] = useState(color["yellow_option"]);
	const [show, setShow] = useState(false);
	const [emptyNote, SetEmptyNote] = useState();
	const [toArchive, SetToArchive] = useState();
	const [toTrash, SetToTrash] = useState();
	const [trash, SetTrash] = useState({
		restore: false,
		delete_perm: false,
	});
	const colorOptionRef = useRef();

	useEffect(() => {
		SetStatusColor(color[getColor(props.currentColor) + "_option"]);
		SetEmptyNote(props.emptyNote);
		if (toTrash || toArchive || trash.restore || trash.delete_perm)
			return setShow(true);
	}, [toArchive, toTrash, props.currentColor, trash]);

	useEffect(() => {
		if (show == true) return;
		setTimeout(() => {
			SetToTrash(false);
			SetToArchive(false);
			SetTrash({ restore: false, delete_perm: false });
		}, 300);
	}, [show]);

	return (
		<>
			{emptyNote ? (
				<ModalDialog
					show={show}
					closeDialog={(status) => setShow(status)}
					header={"Alert"}
					body={"Unable to move the empty note"}
					emptyNote={emptyNote}
				/>
			) : toArchive ? (
				<ModalDialog
					show={show}
					closeDialog={(status) => setShow(status)}
					header={"Archive"}
					body={"Are you sure you want to archive the note?"}
					confirm={"archiveConf"}
					archiveConf={(bool) => props.archiveConf(bool)}
				/>
			) : toTrash ? (
				<ModalDialog
					show={show}
					closeDialog={(status) => setShow(status)}
					header={"Delete"}
					body={"Are you sure you want to send the note to trash can?"}
					confirm={"trashConf"}
					trashConf={(bool) => props.trashConf(bool)}
				/>
			) : trash.restore ? (
				<ModalDialog
					show={show}
					closeDialog={(status) => setShow(status)}
					header={"Restore"}
					body={"Do you want to restore note?"}
					confirm={"untrash"}
					untrash={(bool) => props.untrash(bool)}
				/>
			) : trash.delete_perm ? (
				<ModalDialog
					show={show}
					closeDialog={(status) => setShow(status)}
					header={"Delete Permanently"}
					body={"Are you sure you want to delete the note permanently?"}
					confirm={"deletePerm"}
					deletePerm={(bool) => props.deletePerm(bool)}
				/>
			) : null}
			<section className={`${style.option} ${style.left_right_column}`}>
				{props.isTrash ? (
					<>
						<button
							onMouseDown={() => {
								SetTrash({ ...trash, restore: true });
							}}
							className={style.deleteBtn_restore}>
							Restore
						</button>
						<button
							onMouseDown={() => {
								SetTrash({ ...trash, delete_perm: true });
							}}
							className={style.deleteBtn_deletePerm}>
							Delete Permanently
						</button>
					</>
				) : (
					<div className={style.color_option}>
						<button
							className={`btn btn-sm ${statusColor}`}
							type="button"
							data-bs-toggle="dropdown"
							aria-expanded="false"></button>
						<div
							ref={colorOptionRef}
							className={`${style.container_color_option} dropdown-menu dropdown-menu-end`}>
							<ul className={`${style.flex_menu}`}>
								{colorsCollection.map((data, index) => (
									<li key={index}>
										<button
											className={color[data + "_option"]}
											onMouseDown={() => {
												SetStatusColor(color[data + "_option"]),
													colorOptionRef.current.classList.remove("show"),
													props.changeBg(color[data + "_notepad"]);
											}}></button>
									</li>
								))}
							</ul>
						</div>
						<p>Color</p>
					</div>
				)}
				{props.isArchive ? (
					<>
						<div className={style.archive_trash}>
							<button
								onMouseDown={() => {
									props.unarchive(true);
								}}>
								<div className={style.unarchive}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										version="1.0"
										viewBox="0 0 273.000000 214.000000">
										<g
											transform="translate(9,190.000000) scale(0.100000,-0.100000)"
											fill="#000000">
											<path d="M491 1860 c-80 -17 -154 -82 -180 -159 -16 -48 -16 -1288 0 -1342 17 -55 65 -108 123 -135 l51 -24 770 0 770 0 52 24 c58 27 107 85 123 148 7 25 10 221 8 561 l-3 522 -28 47 c-30 52 -73 88 -127 108 -25 10 -132 15 -380 19 -398 7 -356 -4 -485 122 -117 114 -114 113 -405 116 -135 1 -265 -2 -289 -7z m961 -748 c155 -154 158 -159 158 -200 0 -56 -33 -92 -86 -92 -31 0 -46 9 -104 65 -83 81 -80 88 -80 -163 0 -181 0 -183 -25 -207 -32 -33 -84 -33 -122 -1 l-28 24 -3 207 -3 207 -69 -66 c-59 -57 -73 -66 -105 -66 -49 0 -95 44 -95 91 0 30 18 52 163 196 216 217 188 216 399 5z" />
										</g>
									</svg>
								</div>
							</button>
							<p>Unarchive</p>
						</div>
						<div className={style.archive_trash}>
							<button
								onMouseDown={() => {
									SetToTrash(true);
								}}>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
									<path d="M160 400C160 408.8 152.8 416 144 416C135.2 416 128 408.8 128 400V192C128 183.2 135.2 176 144 176C152.8 176 160 183.2 160 192V400zM240 400C240 408.8 232.8 416 224 416C215.2 416 208 408.8 208 400V192C208 183.2 215.2 176 224 176C232.8 176 240 183.2 240 192V400zM320 400C320 408.8 312.8 416 304 416C295.2 416 288 408.8 288 400V192C288 183.2 295.2 176 304 176C312.8 176 320 183.2 320 192V400zM317.5 24.94L354.2 80H424C437.3 80 448 90.75 448 104C448 117.3 437.3 128 424 128H416V432C416 476.2 380.2 512 336 512H112C67.82 512 32 476.2 32 432V128H24C10.75 128 0 117.3 0 104C0 90.75 10.75 80 24 80H93.82L130.5 24.94C140.9 9.357 158.4 0 177.1 0H270.9C289.6 0 307.1 9.358 317.5 24.94H317.5zM151.5 80H296.5L277.5 51.56C276 49.34 273.5 48 270.9 48H177.1C174.5 48 171.1 49.34 170.5 51.56L151.5 80zM80 432C80 449.7 94.33 464 112 464H336C353.7 464 368 449.7 368 432V128H80V432z" />
								</svg>
							</button>
							<p>Trash</p>
						</div>
					</>
				) : !props.isArchive && !props.isTrash ? (
					<>
						<div className={style.archive_trash}>
							<button
								onMouseDown={() => {
									SetToArchive(true);
								}}>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
									<path d="M147.8 192H480V144C480 117.5 458.5 96 432 96h-160l-64-64h-160C21.49 32 0 53.49 0 80v328.4l90.54-181.1C101.4 205.6 123.4 192 147.8 192zM543.1 224H147.8C135.7 224 124.6 230.8 119.2 241.7L0 480h447.1c12.12 0 23.2-6.852 28.62-17.69l96-192C583.2 249 567.7 224 543.1 224z" />
								</svg>
							</button>
							<p>Archive</p>
						</div>

						<div className={style.archive_trash}>
							<button
								onMouseDown={() => {
									SetToTrash(true);
								}}>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
									<path d="M160 400C160 408.8 152.8 416 144 416C135.2 416 128 408.8 128 400V192C128 183.2 135.2 176 144 176C152.8 176 160 183.2 160 192V400zM240 400C240 408.8 232.8 416 224 416C215.2 416 208 408.8 208 400V192C208 183.2 215.2 176 224 176C232.8 176 240 183.2 240 192V400zM320 400C320 408.8 312.8 416 304 416C295.2 416 288 408.8 288 400V192C288 183.2 295.2 176 304 176C312.8 176 320 183.2 320 192V400zM317.5 24.94L354.2 80H424C437.3 80 448 90.75 448 104C448 117.3 437.3 128 424 128H416V432C416 476.2 380.2 512 336 512H112C67.82 512 32 476.2 32 432V128H24C10.75 128 0 117.3 0 104C0 90.75 10.75 80 24 80H93.82L130.5 24.94C140.9 9.357 158.4 0 177.1 0H270.9C289.6 0 307.1 9.358 317.5 24.94H317.5zM151.5 80H296.5L277.5 51.56C276 49.34 273.5 48 270.9 48H177.1C174.5 48 171.1 49.34 170.5 51.56L151.5 80zM80 432C80 449.7 94.33 464 112 464H336C353.7 464 368 449.7 368 432V128H80V432z" />
								</svg>
							</button>
							<p>Trash</p>
						</div>
					</>
				) : null}
			</section>
		</>
	);
};

export default RightButton;
