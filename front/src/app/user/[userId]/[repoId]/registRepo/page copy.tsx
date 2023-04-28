"use client";
import { useState, useEffect, useRef } from "react";
import { NextPage } from "next";
import styles from "./page.module.scss";
import Image from "next/image";
import { PageProps, Todo } from "@/types/repoRegist";

const Page: NextPage<PageProps> = ({ params }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const dice = useRef<HTMLImageElement>(null);
  const diceShadow = useRef<HTMLDivElement>(null);

  // 부화알 이미지 경로 배열
  const images = [
    "/static/images/monEgg1.png",
    "/static/images/monEgg2.png",
    "/static/images/monEgg3.png",
  ];

  // 부화알 선택 state
  const handleSelect = (index: number) => {
    if (selected === index) {
      setSelected(null);
    } else {
      setSelected(index);
    }
  };
  const [numArr, setNumArr] = useState([0, 0, 0, 0, 0]);

  function generateRandomNumArr() {
    let sum = 0;
    const newArr = [];

    // 첫번째 요소는 1~10사이의 랜덤값으로 설정
    newArr.push(Math.floor(Math.random() * 10) + 1);

    // 나머지 요소는 1~10사이의 랜덤값으로 설정되며, 총합이 30이 되도록 함
    for (let i = 1; i < 5; i++) {
      const maxNum = 30 - sum - (5 - i);
      const randomNum = Math.floor(Math.random() * Math.min(maxNum, 10)) + 1;
      newArr.push(randomNum);
      sum += randomNum;
    }

    setNumArr(newArr);
  }
  // 주사위 클릭 시 실행
  const diceClick = () => {
    const audio = new Audio("/static/sound/Dice.mp3");
    const randomNumArr = numArr.map(() => Math.floor(Math.random() * 10) + 1);
    setNumArr(randomNumArr);
    generateRandomNumArr();

    if (dice.current && diceShadow.current) {
      dice.current.style.transform = `translate(-50%, -250%) rotate(720deg)`;
      dice.current.style.filter = `blur(0.1em)`;
      diceShadow.current.style.transform = "translate(-50%, -50%) scaleX(0.7)";

      setTimeout(() => {
        if (dice.current && diceShadow.current) {
          dice.current.style.transform =
            "translate(-50%, -50%) rotate(-1440deg)";
          dice.current.style.filter = `blur(0em)`;
          diceShadow.current.style.transform =
            "translate(-50%, -50%) scaleX(1)";
        }
        audio.play();
      }, 200);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // 컨벤션 리스트
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [input, setInput] = useState({ title: "", description: "" });
  const [addClicked, setAddClicked] = useState<boolean>(true);

  const handleAddTodo = (): void => {
    const newTodo: Todo = {
      id: todos.length + 1,
      title: title,
      description: description,
    };
    setTodos([...todos, newTodo]);
    setTitle("");
    setDescription("");
    setAddClicked(true);
  };

  const handleEditTodo = (
    id: number,
    title: string,
    description: string
  ): void => {
    const editedTodos: Todo[] = todos.map((todo) => {
      if (todo.id === id) {
        return {
          id: id,
          title: title,
          description: description,
        };
      } else {
        return todo;
      }
    });
    setTodos(editedTodos);
  };

  const handleDeleteTodo = (id: number): void => {
    const filteredTodos: Todo[] = todos.filter((todo) => todo.id !== id);
    setTodos(filteredTodos);
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInput((prevInput) => ({ ...prevInput, [name]: value }));
  };

  if (!mounted) return null;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageBox}>
        <div className={styles.monSelect}>
          <p style={{ color: "aliceblue", fontSize: "3rem" }}>함뽑아바라!</p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {images.map((src, index) => (
              <div
                key={index}
                className={`${styles.monFrame} ${
                  selected === index ? styles.selected : ""
                }`}
                onClick={() => handleSelect(index)}
              >
                <Image
                  src={src}
                  alt={`mon${index + 1}`}
                  width={500}
                  height={400}
                  className={styles.monEgg}
                />
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "5%",
          }}
        >
          <div className={styles.leftBox}>
            <p className={styles.commitTitle}>커밋 컨벤션 입력</p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {addClicked ? (
                <div
                  style={{
                    marginBottom: "5%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingInline: "3%",
                    fontSize: "0.8vw",
                  }}
                >
                  <label
                    style={{
                      color: "black",
                      marginInline: "3%",
                      width: "20%",
                    }}
                  >
                    <p style={{ color: "white" }}>커밋 메시지 컨벤션</p>
                    <input
                      type="text"
                      name="title"
                      className={styles.inputFields}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="커밋 컨벤션 입력"
                    />
                  </label>
                  <label
                    style={{
                      color: "black",
                      marginInline: "3%",
                      width: "70%",
                      marginTop: "0.6%",
                    }}
                  >
                    <p style={{ color: "white" }}>설명 </p>
                    <textarea
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={styles.inputFields}
                      style={{
                        color: "black",
                        width: "100%",
                      }}
                    />
                  </label>
                  <button
                    style={{
                      width: "10%",
                      height: "4em",
                      border: "1px solid white",
                    }}
                    onClick={handleAddTodo}
                    className={styles.buttonInput}
                  >
                    추가
                  </button>
                </div>
              ) : (
                <button onClick={() => setAddClicked(true)}>+</button>
              )}
              <div>
                <table className={styles.tableSytle}>
                  <thead>
                    <tr>
                      <th>컨벤션 명</th>
                      <th>설명</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {todos.map((todo) => (
                      <tr key={todo.id}>
                        <td>
                          <input
                            type="text"
                            value={todo.title}
                            onChange={(e) =>
                              handleEditTodo(todo.id, "title", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={todo.description}
                            onChange={(e) =>
                              handleEditTodo(
                                todo.id,
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <button onClick={() => handleDeleteTodo(todo.id)}>
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className={styles.rigthBox}></div>
        </div>
        <div style={{ display: "flex", marginBottom: "3%" }}>
          <button
            style={{
              width: "10em",
              height: "3em",
              fontSize: "1.2em",
              marginInline: "2%",
            }}
            className={styles.buttonAccept}
          >
            결 정
          </button>
          <button
            style={{
              width: "10em",
              height: "3em",
              fontSize: "1.2em",
              marginInline: "2%",
            }}
            className={styles.buttonDeny}
          >
            취 소
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;