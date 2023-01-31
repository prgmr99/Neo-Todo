import { useEffect } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import DraggableCard from "./DraggableCard";
import styled from "styled-components";
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState, useRecoilValue } from "recoil";

interface IForm {
  toDo: string;
}
interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
}
interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}
const Container = styled.div``;
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
const Wrapper = styled.div`
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

function Board({ toDos, boardId }: IBoardProps) {
  const setTodos = useSetRecoilState(toDoState);
  const getTodos = useRecoilValue(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newTodo = {
      id: Date.now(),
      text: toDo,
    };
    setTodos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newTodo],
      };
    });
    localStorage.setItem(`${boardId}`, JSON.stringify(getTodos[boardId]));
    setValue("toDo", "");
  };
  useEffect(() => {
    localStorage.setItem(`${boardId}`, JSON.stringify(getTodos[boardId]));
  }, [toDos]);
  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <Input
          {...register("toDo", { required: true })}
          type="text"
          placeholder={`"${boardId}" 추가하기`}
        />
      </Form>
      <Droppable droppableId={boardId}>
        {(magic, info) => (
          <Area
            isDraggingOver={info.isDraggingOver}
            isDraggingFromThis={Boolean(info.draggingFromThisWith)}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DraggableCard
                key={toDo.id}
                index={index}
                toDoId={toDo.id}
                toDoText={toDo.text}
              />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default Board;
