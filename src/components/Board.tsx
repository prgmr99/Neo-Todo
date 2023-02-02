import { useEffect } from "react";
import React from "react";
import { Droppable, DraggableProvided } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import DraggableCard from "./DraggableCard";
import styled from "styled-components";
import { ITodo, toDoState, IBoard } from "../atoms";
import { useSetRecoilState, useRecoilValue } from "recoil";

interface IForm {
  toDo: string;
}
interface IBoardProps {
  board: IBoard;
  parentProvided: DraggableProvided;
  isHovering: boolean;
}
interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}
const Container = styled.div<{ isDraggingOver: boolean }>`
  padding: 20px 5px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 450px;
  display: flex;
  flex-direction: column;
  width: 250px;
  overflow: hidden;
  margin: 0px 100px;
  margin-left: -70px;
  justify-content: center;
`;
const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isDraggingFromThis
      ? "#b2bec3"
      : "#CBF1F5"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;
const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
  color: ${(props) => props.theme.textColor};
  &:hover {
    color: #f8a092;
    transition: color 0.3s ease-in-out;
  }
`;
const Form = styled.form`
  width: 100%;
`;
const Input = styled.input`
  width: 90%;
  background-color: #e7f6f2;
  border-radius: 5px;
  border: 0.3px solid #8ea7e9;
  display: block;
  margin: auto;
  padding: 7px 0px;
  padding-left: 10px;
  margin-bottom: 5px;
  box-shadow: 0px 0px 10px #ddd;
  &:hover {
    background-color: #ffeaa7;
    transition: background-color 0.3s ease-in-out;
    box-shadow: 0px 0px 8px #0984e3;
  }
`;

function Board({ board, parentProvided, isHovering }: IBoardProps) {
  const setTodos = useSetRecoilState(toDoState);
  //const getTodos = useRecoilValue(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onDelBtn = () => {
    setTodos((prev) => {
      const boardsCopy = [...prev];
      const boardIndex = prev.findIndex((b) => b.id === board.id);
      boardsCopy.splice(boardIndex, 1);
      return boardsCopy;
    });
  };
  const onValid = ({ toDo }: IForm) => {
    const newTodo = {
      id: Date.now(),
      text: toDo,
    };
    setTodos((prev) => {
      const toDosCopy = [...prev];
      const boardIndex = prev.findIndex((b) => b.id === board.id);
      const boardCopy = { ...prev[boardIndex] };

      boardCopy.toDos = [newTodo, ...boardCopy.toDos];
      toDosCopy.splice(boardIndex, 1, boardCopy);

      return toDosCopy;
    });
    setValue("toDo", "");
  };
  const onFixBtn = () => {
    const name = window.prompt("보드 이름을 입력해주세요!")?.trim();
    if (name !== null && name !== undefined) {
      if (name === "") {
        alert("이름을 입력해주세요!");
        return;
      }
      if (name === board.title) {
        alert("새로운 이름을 입력해주세요!");
        return;
      }
      setTodos((prev) => {
        const boardsCopy = [...prev];
        const boardIndex = prev.findIndex((b) => b.id === board.id);
        const boardCopy = { ...prev[boardIndex] };
        boardCopy.title = name;
        boardsCopy.splice(boardIndex, 1, boardCopy);
        return boardsCopy;
      });
    }
  };
  return (
    <Droppable droppableId={"board-" + board.id} type="BOARD">
      {(magic, info) => (
        <Container
          isDraggingOver={info.isDraggingOver}
          className={`${info.isDraggingOver ? "dragging" : ""} ${
            isHovering ? "hovering" : ""
          }`}
          ref={parentProvided.innerRef}
          {...parentProvided.draggableProps}
          {...parentProvided.dragHandleProps}
        >
          <div>
            <Title>{board.title}</Title>
            <button onClick={onDelBtn}>❌</button>
            <button onClick={onFixBtn}>📌</button>
            <Form onSubmit={handleSubmit(onValid)}>
              <Input
                {...register("toDo", { required: true })}
                type="text"
                placeholder={`"${board.title}" 추가하기`}
              />
            </Form>
          </div>
          <Area
            isDraggingOver={info.isDraggingOver}
            isDraggingFromThis={Boolean(info.draggingFromThisWith)}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            {board.toDos.map((toDo, index) => (
              <DraggableCard
                key={toDo.id}
                index={index}
                toDoId={toDo.id}
                toDo={toDo}
                boardId={board.id}
              />
            ))}
            {magic.placeholder}
          </Area>
        </Container>
      )}
    </Droppable>
  );
}

export default React.memo(Board);
