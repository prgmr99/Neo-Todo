import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Swal from "sweetalert2/dist/sweetalert2.js";

import { Droppable, DraggableProvided } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { toDoState, IBoard } from "../../atoms";

import Card from "../Card/Card";

interface IContainer {
  clientHeight: number;
}
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
  min-height: 55vh;
  max-height: 70vh;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  width: 270px;
  margin: 0px 100px;
  margin-left: -70px;
  margin-top: 20px;
  justify-content: flex-start;
  box-shadow: 2px 2px 4px #888888;
  &.hovering {
    box-shadow: 0 0.6rem 1.2rem rgba(0, 0, 0, 0.75);
  }
`;
const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? props.theme.cardEnterColor
      : props.isDraggingFromThis
      ? props.theme.cardExitColor
      : props.theme.innerBoardColor};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  margin-left: 50px;
  font-size: 20px;
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
  font-size: 15px;
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

const FixBtn = styled.button`
  float: right;
  border: none;
  width: 25px;
  height: 25px;
  border-radius: 5px;
  background-color: transparent;
  cursor: pointer;
  outline: none;
  text-align: center;
  font-size: 21px;
  margin-top: 4px;
  color: white;
  text-shadow: 1px 1px #888888;
  &:hover {
    text-shadow: 3px 3px #888888;
    font-size: 22px;
    transition: color 0.3s ease-in-out;
    color: #ff6b81;
  }
`;

const DelBtn = styled.button`
  float: right;
  border: none;
  width: 25px;
  height: 25px;
  border-radius: 5px;
  background-color: transparent;
  cursor: pointer;
  outline: none;
  text-align: center;
  margin-left: 5px;
  font-size: 20px;
  color: white;
  text-shadow: 1px 1px #888888;
  &:hover {
    text-shadow: 3px 3px #888888;
    font-size: 22px;
    transition: color 0.3s ease-in-out;
    color: #ff6b81;
  }
`;

function Board({ board, parentProvided, isHovering }: IBoardProps) {
  const setTodo = useSetRecoilState(toDoState);
  const [height, setHeight] = useState(0);
  const [inputDisable, setInputDisable] = useState(false);
  const containerRef = useRef<IContainer>();
  //const getTodos = useRecoilValue(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onDelBtn = () => {
    setTodo((prev) => {
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
    setTodo((prev) => {
      const toDosCopy = [...prev];
      const boardIndex = prev.findIndex((b) => b.id === board.id);
      const boardCopy = { ...prev[boardIndex] };
      boardCopy.toDos = [...boardCopy.toDos, newTodo];
      toDosCopy.splice(boardIndex, 1, boardCopy);

      return toDosCopy;
    });
    setValue("toDo", "");
  };
  const onFixBtn = () => {
    (async () => {
      const { value: getName } = await Swal.fire({
        title: "새로운 이름을 입력해주세요.",
        text: "변경할 보드 이름",
        input: "text",
        inputPlaceholder: "이름을 입력해주세요.",
      });

      if (getName) {
        Swal.fire("Saved!");
      }
      if (getName === "") {
        return;
      }
      setTodo((prev) => {
        const boardsCopy = [...prev];
        const boardIndex = prev.findIndex((b) => b.id === board.id);
        const boardCopy = { ...prev[boardIndex] };
        boardCopy.title = getName;
        boardsCopy.splice(boardIndex, 1, boardCopy);
        return boardsCopy;
      });
    })();
  };
  useEffect(() => {
    if (containerRef.current?.clientHeight !== undefined) {
      setHeight(containerRef.current?.clientHeight);
    }
    if (height > 700) {
      setInputDisable(true);
    }
    if (height <= 500) {
      setInputDisable(false);
    }
  }, [containerRef.current?.clientHeight, height]);

  return (
    <Droppable droppableId={"board-" + board.id} type="BOARD">
      {(magic, info) => (
        <div ref={containerRef as any}>
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
              <DelBtn onClick={onDelBtn}>𝖷</DelBtn>
              <FixBtn onClick={onFixBtn}>⏎</FixBtn>
              <div>
                <Title>{board.title}</Title>
              </div>
              <Form onSubmit={handleSubmit(onValid)}>
                <Input
                  {...register("toDo", { required: true })}
                  type="text"
                  placeholder={`"${board.title}" 추가하기`}
                  disabled={inputDisable}
                  autoComplete="off"
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
                <Card
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
        </div>
      )}
    </Droppable>
  );
}

export default React.memo(Board);
