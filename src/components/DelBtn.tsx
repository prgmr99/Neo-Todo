import styled from "styled-components";
import { useSetRecoilState } from "recoil";
import { isCheckedAtom, toDoState } from "../atoms";

interface ButtonProps {
  index: number;
  toDoId: number;
  boardId: number;
}
const Span = styled.span`
  padding: 0px 8px;
`;

const DelBtn = (props: ButtonProps) => {
  const setTodo = useSetRecoilState(toDoState);
  const setIsChecked = useSetRecoilState(isCheckedAtom);

  const onClick = () => {
    setTodo((prev) => {
      const toDosCopy = [...prev];
      const boardIndex = toDosCopy.findIndex(
        (board) => board.id === props.boardId
      );
      const boardCopy = { ...toDosCopy[boardIndex] };
      const listCopy = [...boardCopy.toDos];
      const toDoIndex = boardCopy.toDos.findIndex(
        (td) => td.id === props.toDoId
      );

      listCopy.splice(toDoIndex, 1);
      boardCopy.toDos = listCopy;
      toDosCopy.splice(boardIndex, 1, boardCopy);

      return toDosCopy;
    });
    setIsChecked((prev) => !prev);
  };

  return (
    <Span onClick={onClick} {...props}>
      ❌
    </Span>
  );
};

export default DelBtn;
