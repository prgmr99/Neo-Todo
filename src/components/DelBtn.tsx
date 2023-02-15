import styled from "styled-components";
import { useRecoilState, useRecoilValue } from "recoil";
import { toDoState } from "../atoms";

interface ButtonProps {
  index: number;
  toDoId: number;
  boardId: number;
}
const Span = styled.span`
  padding: 0px 8px;
`;

const DelBtn = (props: ButtonProps) => {
  const [toDos, settoDos] = useRecoilState(toDoState);
  const onClick = () => {
    settoDos((prev) => {
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
  };
  return (
    <Span onClick={onClick} {...props}>
      ❌
    </Span>
  );
};

export default DelBtn;

// atom 값 중 boardId를 불러와야 해!!!
// id랑 index는 아는데 어느 board인지는 앞에 두 개만 보고는 알 수 없어!
// atom을 쓰지 않고 props로도 해결 가능할 수는 있어 그런데 복잡해지니까 쉽게 가자구 props drilling은 이야다...
// 근데 배열
