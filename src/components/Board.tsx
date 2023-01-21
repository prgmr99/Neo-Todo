import { Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import DraggableCard from "./DraggableCard";
import styled from "styled-components";
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";

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

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
        props.isDraggingOver ? "#dfe6e9" : props.isDraggingFromThis ? "#b2bec3" : "#636e72"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;
const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;
const Wrapper = styled.div`
  padding: 10px 0px;
  background-color: ${props => props.theme.boardColor};
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  width: 220px;
  overflow: hidden;
`;
const Form = styled.form`
    width:100%;
    
`;

function Board({toDos, boardId}:IBoardProps) {
    const setTodos = useSetRecoilState(toDoState);
    const { register, setValue, handleSubmit } = useForm<IForm>();
    const onValid = ({toDo}:IForm) => {
        const newTodo = {
            id: Date.now(),
            text: toDo,
        };
        setTodos(allBoards => {
            return {
                ...allBoards,
                [boardId]: [
                    ...allBoards[boardId],
                    newTodo
                ]
            }
        })
        setValue("toDo", "");
    };
    return (
        <Wrapper>
            <Title>{boardId}</Title>
            <Form onSubmit={handleSubmit(onValid)}>
                <input {...register("toDo", {required: true})} type="text" placeholder={`Add task on ${boardId}`}/>
            </Form>
            <Droppable droppableId={boardId}>{(magic, info) =>
                <Area isDraggingOver={info.isDraggingOver}
                    isDraggingFromThis={Boolean(info.draggingFromThisWith)}
                    ref={magic.innerRef} {...magic.droppableProps}>
                    {toDos.map((toDo, index) => (
                        <DraggableCard key={toDo.id} index={index} toDoId={toDo.id} toDoText={toDo.text}/>
                    ))}
                    {magic.placeholder}
                </Area>}
            </Droppable>
        </Wrapper>
    );
}

export default Board;