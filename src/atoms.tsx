import { atom } from "recoil";

export interface ITodo {
  id: number;
  text: string;
}
interface ITodoState {
  [key: string]: ITodo[];
}
export interface IBoard {
  id: number;
  text: string;
  toDos: ITodo[];
}

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
    if (savedValue !== null) {
      setSelf(JSON.parse(savedValue));
    }
    onSet((newValue: any, _: any, isReset: boolean) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const toDoState = atom<ITodoState>({
  key: "toDos",
  default: {
    "할 일": [],
    "하는 중": [],
    "다 했다!": [],
  },
  effects: [localStorageEffect("toDos")],
});
