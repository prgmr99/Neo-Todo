import { atom } from "recoil";

export interface ITodo {
  id: number;
  text: string;
}
export interface IBoard {
  id: number;
  title: string;
  toDos: ITodo[];
}
const instanceOfToDo = (object: unknown): object is ITodo => {
  return (
    object !== null &&
    object !== undefined &&
    object.constructor === Object &&
    typeof (object as { id: unknown; text: unknown }).id === "number" &&
    typeof (object as { id: unknown; text: unknown }).text === "string"
  );
};

const instanceOfBoard = (object: unknown): object is IBoard => {
  return (
    object !== null &&
    object !== undefined &&
    object.constructor === Object &&
    typeof (object as { id: unknown; title: unknown; toDos: unknown }).id ===
      "number" &&
    typeof (object as { id: unknown; title: unknown; toDos: unknown }).title ===
      "string" &&
    Array.isArray(
      (object as { id: unknown; title: unknown; toDos: unknown }).toDos
    ) &&
    (object as { id: unknown; title: unknown; toDos: unknown[] }).toDos.every(
      (toDo) => instanceOfToDo(toDo)
    )
  );
};

const instanceOfBoards = (object: unknown): object is IBoard[] => {
  return (
    Array.isArray(object) && object.every((board) => instanceOfBoard(board))
  );
};
/**
 * localStorage에 저장하는데 useEffect와도 결합시켰다고 생각하면 된다.
 * Atom Effect의 기능
 * @param key toDoState의 atom 키
 * @returns 없음
 */
const localStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }: any) => {
    const savedValue = localStorage.getItem(key);

    if (savedValue !== null && savedValue !== undefined) {
      const json = (raw: string) => {
        try {
          return JSON.parse(raw);
        } catch (error) {
          return false;
        }
      };

      if (json(savedValue) && instanceOfBoards(json(savedValue))) {
        setSelf(json(savedValue));
      }
    }

    onSet((newValue: IBoard[]) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const toDoState = atom<IBoard[]>({
  key: "toDos",
  default: [
    {
      title: "To Do",
      id: 0,
      toDos: [],
    },
    {
      title: "Working",
      id: 1,
      toDos: [],
    },
    {
      title: "Done",
      id: 2,
      toDos: [],
    },
  ],
  effects: [localStorageEffect("toDos")],
});

export const trashState = atom({
  key: "trash",
  default: ["hello"],
});

export const isDarkAtom = atom({
  key: "isDarkMode",
  default: true,
});

export const isCheckedAtom = atom({
  key: "isChecked",
  default: false,
});
