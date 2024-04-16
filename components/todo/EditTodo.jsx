import React, { useRef, useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Transition, TransitionGroup } from "react-transition-group";
import style from "../style/notepad.module.css";
import TextareaAutosize from "react-textarea-autosize";
const TIMEOUT = 300;

const editModeDeleteTransition = {
	exiting: {
		transition: `opacity ${TIMEOUT}ms, transform ${TIMEOUT}ms, margin-bottom ${TIMEOUT}ms`,
		marginBottom: "-67px",
		opacity: 0,
		transform: `translateY(-50px)`,
	},
};

const EditTodo = (props) => {
	const todoRef = useRef([]);
	const nodeRef = useRef();

	const sortDNDTodo = (result) => {
		if (!result.destination) return;
		const items = Array.from(props.todoData);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);
		props.updateData(items); //settododata(items)
	};

	const editTodoList = (event, id) => {
		const textValue = event.target.value;
		const items = Array.from(props.todoData);
		for (const obj of items) {
			if (obj.id == id) {
				obj.todo = textValue;
				break;
			}
		}
		props.updateData(items);
	};

	const deleteTodoList = (id) => {
		const items = Array.from(props.todoData);
		const find_item = items.findIndex((data) => data.id == id);
		items.splice(find_item, 1);
		props.updateData(items);
	};

	const addTodoBottom = () => {
		const items = Array.from(props.todoData);
		const itemsCount = items.length;
		items.push({
			todo: "",
			checked: false,
			id: `${crypto.randomUUID()}`,
		});
		props.updateData(items);
		setTimeout(() => {
			todoRef.current[itemsCount].focus();
		}, 100);
	};

	useEffect(() => {
		console.log("2323");
		if (props.titleFocus || props.todoData.length == 0) return;
		setTimeout(() => {
			todoRef.current[0].focus();
		}, 100);
	}, [props.triggerFocus]);

	useEffect(() => {
		if (props.indexFocus) {
			setTimeout(() => {
				todoRef.current[props.indexFocus].focus();
			}, 100);
		}
	}, [props.indexFocus]);

	// useEffect(() => {
	//     console.log(props.indexFocus)
	// })

	return (
		<div>
			<DragDropContext onDragEnd={sortDNDTodo}>
				<Droppable droppableId="hello">
					{(provided) => (
						<div
							className={style.todo}
							{...provided.droppableProps}
							ref={provided.innerRef}>
							<TransitionGroup className="todo-list">
								{props.todoData.map((data, index) => (
									<Transition key={data.id} timeout={TIMEOUT}>
										{(status) => (
											<Draggable
												key={data.id}
												draggableId={`${data.id}`}
												index={index}
												disableInteractiveElementBlocking={true}>
												{(provided) => (
													<div
														style={{
															...editModeDeleteTransition[status],
														}}>
														<div
															key={data.id}
															{...provided.draggableProps}
															ref={provided.innerRef}
															className={style.editTodoList}>
															<div>
																<button {...provided.dragHandleProps}>
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		viewBox="40 20 140 140">
																		<circle cx="60" cy="60" r="9" />
																		<circle cx="90" cy="60" r="9" />
																		<circle cx="120" cy="60" r="9" />
																		<circle cx="60" cy="90" r="9" />
																		<circle cx="90" cy="90" r="9" />
																		<circle cx="120" cy="90" r="9" />
																		<circle cx="60" cy="120" r="9" />
																		<circle cx="90" cy="120" r="9" />
																		<circle cx="120" cy="120" r="9" />
																	</svg>
																</button>
																<TextareaAutosize
																	className={`${style.editTodo}`}
																	defaultValue={data.todo}
																	onChange={() => editTodoList(event, data.id)}
																	ref={(el) => (todoRef.current[index] = el)}
																	id={`${index}`}
																	onBlur={() =>
																		((index == 0 && data.todo == "") ||
																			(index == props.todoData.length - 1 &&
																				data.todo == "")) &&
																		deleteTodoList(data.id)
																	}
																/>
																<button onClick={() => deleteTodoList(data.id)}>
																	<svg
																		fill="#FA5252"
																		xmlns="http://www.w3.org/2000/svg"
																		viewBox="0 0 50 50"
																		width="100px"
																		height="30px">
																		<path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" />
																	</svg>
																</button>
															</div>
															<hr />
														</div>
													</div>
												)}
											</Draggable>
										)}
									</Transition>
								))}
								{provided.placeholder}
							</TransitionGroup>
							<a className={style.addTodo} onClick={addTodoBottom}>
								+ Add Item
							</a>
						</div>
					)}
				</Droppable>
			</DragDropContext>
		</div>
	);
};

export default EditTodo;
