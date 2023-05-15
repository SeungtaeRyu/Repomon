"use client";

import { requestMatchResult } from "@/api/repoBattle";
import Spinner from "@/components/Spinner";
import { BattleResultResponseDataType, ScriptType } from "@/types/repoBattle";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import styles from "./page.module.scss";
import Loader from "@/components/threeLoader";
import HpBar from "@/components/HpBar";
import Image from "next/image";
import Lottie from "react-lottie-player";
import lottieJson from "public/static/lotties/battle.json";
import Panpare from "public/static/lotties/panpare.json";
import GhostOne from "public/static/lotties/ghost1.json";
import * as THREE from "three";
import { Html, OrbitControls } from "@react-three/drei";
import { BattleLogType } from "@/types/repoBattle";
import SoundOff from "@/components/UI/SoundOff";
import SoundOn from "@/components/UI/SoundOn";
import Modal from "react-modal";
import { useRouter } from "next/navigation";
import Grass from "../Grass";

const Page = ({ params }: { params: { repoId: string; oppoId: string } }) => {
  const [loadData, setLoadData] = useState<boolean>(false);
  const [matchData, setMatchData] = useState<BattleResultResponseDataType>();
  const [opHp, setopHp] = useState<number | undefined>(
    matchData?.data.defenseRepo.hp
  );
  const firstMyHp: number | undefined = matchData?.data.attackRepo.hp;
  const firstOpHp: number | undefined = matchData?.data.defenseRepo.hp;
  const [myHp, setmyHp] = useState<number | undefined>(
    matchData?.data.attackRepo.hp
  );
  const router = useRouter();

  // 데이터 로드
  let oppoId = parseInt(params.oppoId);
  let myId = parseInt(params.repoId);

  function getMatchResult(op: number, my: number) {
    // oppo - my
    return requestMatchResult(oppoId, myId);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getMatchResult(
          parseInt(params.oppoId),
          parseInt(params.repoId)
        );
        const data = response.data;
        setMatchData(data);
        setopHp(data?.data.defenseRepo.hp);
        setmyHp(data?.data.attackRepo.hp);
        setLoadData(true);
        console.log("매치 정보", data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  // 새로고침 방지
  const preventClose = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "";
  };

  useEffect(() => {
    (() => {
      window.addEventListener("beforeunload", preventClose);
    })();

    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };
  }, []);

  // 내 레포몬 출력
  const Model = (props: { url: string }) => {
    const filename = props.url.slice(props.url.lastIndexOf("/") + 1);
    const num = filename.slice(-5, filename.length - 4);
    const str = num.toString();
    const getModelLevel = (str: string): number[] => {
      switch (str) {
        case "2":
          return [4, 4, 4];
        case "3":
          return [3, 3, 3];
        default:
          return [6, 6, 6];
      }
    };
    const getModelPosition = (str: string): number[] => {
      switch (str) {
        case "2":
          return [-4, -3, 0];
        case "3":
          return [-4, -4, 0];
        default:
          return [-4, -4, 0];
      }
    };
    const [scaleState, setScaleState] = useState<number[]>(getModelLevel(str));
    const [positionState, setPositionState] = useState<number[]>(
      getModelPosition(str)
    );
    const gltf = useLoader(GLTFLoader, props.url + `?id=${myId}` ?? "");
    console.log(gltf.animations);
    let mixer: THREE.AnimationMixer | undefined;
    if (gltf.animations.length) {
      mixer = new THREE.AnimationMixer(gltf.scene);
      mixer.timeScale = 1;
      if (isMyAttack) {
        const action = mixer.clipAction(gltf.animations[11]);
        action.setLoop(THREE.LoopOnce, 1);
        mixer.timeScale = 0.5;
        action.play();
      } else if (isMyHurt) {
        const action = mixer.clipAction(gltf.animations[3]);
        action.setLoop(THREE.LoopOnce, 0);
        action.clampWhenFinished = true;
        mixer.timeScale = 1;
        action.play();
      } else if (isMyAvoid) {
        const action = mixer.clipAction(gltf.animations[15]);
        action.setLoop(THREE.LoopOnce, 0);
        action.clampWhenFinished = true;
        mixer.timeScale = 1;
        action.play();
      } else {
        const action = mixer.clipAction(gltf.animations[8]);
        action.play();
        action.clampWhenFinished = true;
      }
    }

    useFrame((state, delta) => {
      mixer?.update(delta);
    });

    return (
      <primitive
        object={gltf.scene}
        scale={scaleState}
        position={positionState}
        rotation={[0, 15, 0]}
      />
    );
  };

  // 상대 레포몬 출력
  const SecondModel = (props: { url: string }) => {
    const filename = props.url.slice(props.url.lastIndexOf("/") + 1);
    const num = filename.slice(-5, filename.length - 4);
    const str = num.toString();
    const getModelLevel = (str: string): number[] => {
      switch (str) {
        case "2":
          return [2.5, 2.5, 2.5];
        case "3":
          return [2.5, 2.5, 2.5];
        default:
          return [2.5, 2.5, 2.5];
      }
    };
    const getModelPosition = (str: string): number[] => {
      switch (str) {
        case "2":
          return [5, 0, 0];
        case "3":
          return [5, -0.5, 0];
        default:
          return [5, 0, 0];
      }
    };
    const [scaleState, setScaleState] = useState<number[]>(getModelLevel(str));
    const [positionState, setPositionState] = useState<number[]>(
      getModelPosition(str)
    );
    const gltf = useLoader(GLTFLoader, props.url + `?id=${oppoId}` ?? "");

    let mixer: THREE.AnimationMixer | undefined;
    let action: THREE.AnimationAction | undefined;

    if (gltf.animations.length) {
      mixer = new THREE.AnimationMixer(gltf.scene);
      mixer.timeScale = 1;

      if (isOpAttack) {
        action = mixer.clipAction(gltf.animations[11]);
        action.setLoop(THREE.LoopOnce, 1);
        mixer.timeScale = 0.5;
        action.play();
      } else if (isOpHurt) {
        const action = mixer.clipAction(gltf.animations[3]);
        action.setLoop(THREE.LoopOnce, 0);
        action.clampWhenFinished = true;
        mixer.timeScale = 1;
        action.play();
      } else if (isOpAvoid) {
        const action = mixer.clipAction(gltf.animations[15]);
        action.setLoop(THREE.LoopOnce, 0);
        action.clampWhenFinished = true;
        mixer.timeScale = 1;
        action.play();
      } else {
        const action = mixer.clipAction(gltf.animations[8]);
        action.play();
        action.clampWhenFinished = true;
      }
    }

    useFrame((state, delta) => {
      mixer?.update(delta);
    });

    return (
      <primitive
        object={gltf.scene}
        scale={scaleState}
        position={positionState}
        rotation={[0, 5, 0]}
      />
    );
  };

  const customStyles: Modal.Styles = {
    content: {
      zIndex: 99999,
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "650px",
      height: "300px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
  };

  const EndModal = () => {
    return (
      <Html style={{ position: "relative", zIndex: 999 }}>
        {modalIsOpen && (
          <div>
            <Modal
              isOpen={modalIsOpen}
              onAfterOpen={afterOpenModal}
              onRequestClose={closeModal}
              style={customStyles}
              contentLabel=""
              shouldCloseOnOverlayClick={false}
            >
              <div>
                <p
                  style={{
                    fontSize: "1.5em",
                    textAlign: "center",
                    fontWeight: "700",
                  }}
                >
                  게임 종료
                </p>
                <div style={{ display: "flex" }}>
                  <Lottie
                    loop={true}
                    animationData={matchData?.data.isWin ? Panpare : GhostOne}
                    play
                    style={{
                      position: "absolute",
                      width: matchData?.data.isWin ? "5em" : "7em",
                      height: matchData?.data.isWin ? "5em" : "7em",
                      left: "2em",
                      top: "5.5em",
                    }}
                  />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <p
                      style={{
                        fontSize: "2.5em",
                        textAlign: "center",
                        fontWeight: "700",
                        color: matchData?.data.isWin ? "#1dbabf" : "red",
                      }}
                    >
                      {matchData?.data.isWin
                        ? `승리했습니다!`
                        : "패배했습니다..."}
                    </p>
                    <p
                      style={{
                        fontSize: "1.5em",
                        textAlign: "center",
                        fontWeight: "700",
                        marginTop: "1em",
                      }}
                    >
                      Rating: {matchData?.data.attackRepo.rating}
                      {matchData?.data.isWin
                        ? `(+${matchData?.data.attackPoint})`
                        : `(${matchData?.data.attackPoint})`}
                    </p>
                  </div>
                  <Lottie
                    loop={true}
                    animationData={matchData?.data.isWin ? Panpare : GhostOne}
                    play
                    style={{
                      position: "absolute",
                      width: matchData?.data.isWin ? "5em" : "7em",
                      height: matchData?.data.isWin ? "5em" : "7em",
                      right: "2em",
                      top: "5.5em",
                      transform: "scaleX(-1)",
                    }}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  router.back();
                }}
                style={{ fontWeight: "600", marginTop: "2em", width: "auto" }}
              >
                <p id={styles.backTo}>유저 페이지로</p>
              </button>
            </Modal>
          </div>
        )}
      </Html>
    );
  };
  const MyUI = () => {
    return (
      <Html style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: "70px",
            left: "10px",
            width: "550px",
            height: "150px",
            fontSize: "24px",
            color: "black",
            backgroundColor: "white",
            border: "10px double black",
            padding: "20px",
            fontFamily: "NeoDunggeunmo",
            zIndex: 10,
          }}
        >
          내 레포명: {matchData?.data.attackRepo.repomonNickname} <br />
          HP :{myHp && Math.ceil(myHp) < 0 ? 0 : myHp && Math.ceil(myHp)} /{" "}
          {firstMyHp}
          <HpBar
            HP={Number(myHp)}
            maxHP={Number(matchData?.data.attackRepo.hp)}
          />
        </div>
      </Html>
    );
  };
  const OpUI = () => {
    return (
      <Html style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            bottom: "70px",
            right: "10px",
            width: "550px",
            height: "150px",
            fontSize: "24px",
            color: "black",
            backgroundColor: "white",
            border: "10px double black",
            padding: "20px",
            fontFamily: "NeoDunggeunmo",
            zIndex: 10,
          }}
        >
          상대 레포명: {matchData?.data.defenseRepo.repomonNickname} <br />
          HP : {opHp && Math.ceil(opHp)} / {firstOpHp}
          <HpBar
            HP={Number(opHp)}
            maxHP={Number(matchData?.data.defenseRepo.hp)}
          />
        </div>
      </Html>
    );
  };

  // audio control
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;

    const playAudio = () => {
      audio?.play();
      document.removeEventListener("click", playAudio);
      document.removeEventListener("keydown", playAudio);
    };

    document.addEventListener("click", playAudio);
    document.addEventListener("keydown", playAudio);
  }, []);

  const [soundOn, setSoundOn] = useState<boolean>(true);

  // 초기화면
  const gameWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameWrapper.current) {
      gameWrapper.current.style.opacity = "0";
      gameWrapper.current.style.transition = "all 2s ease-in-out";
    }
    setTimeout(() => {
      if (gameWrapper.current) {
        gameWrapper.current.style.opacity = "1";
        gameWrapper.current.style.zIndex = "0";
      }
    }, 2600);
  }, []);

  const [isAnimationFinished, setIsAnimationFinished] = useState(false);
  const playerRef = useRef<any>(null);

  const handleAnimationComplete = () => {
    setIsAnimationFinished(true);
  };

  // 배틀 게임 로직
  const [currentIndex, setCurrentIndex] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [currentLog, setCurrentLog] = useState<string>("");
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const [isMyAttack, setIsMyAttack] = useState<boolean>(false);
  const [isOpAttack, setIsOpAttack] = useState<boolean>(false);
  const [isMyHurt, setIsMyHurt] = useState<boolean>(false);
  const [isOpHurt, setIsOpHurt] = useState<boolean>(false);
  const [isMyAvoid, setIsMyAvoid] = useState<boolean>(false);
  const [isOpAvoid, setIsOpAvoid] = useState<boolean>(false);
  const initialState: ScriptType[] =
    matchData?.data?.battleLog?.map((log: BattleLogType) => ({
      turn: `${log.turn}번째 턴!`,
      attackerScript: `${matchData.data.battleLog[currentIndex].attack_log}`,
      defenderScript: `${matchData.data.battleLog[currentIndex].defense_log}`,
      damageScript: log.damage === 0 ? `워후...빨랐다...` : `(체력 감소)`,
    })) ?? [];
  const currentScript = initialState[currentIndex];

  useEffect(() => {
    if (currentScript) {
      if (logIndex === 0) {
        setCurrentLog(currentScript.turn);
      } else if (logIndex === 1) {
        setCurrentLog(currentScript.attackerScript);
        if (matchData?.data.battleLog[currentIndex].attacker === myId) {
          setIsMyAttack(true);
        } else if (
          matchData?.data.battleLog[currentIndex].attacker === oppoId
        ) {
          setIsOpAttack(true);
        }
      } else if (logIndex === 2) {
        setCurrentLog(currentScript.defenderScript);
        if (matchData?.data.battleLog[currentIndex].defender === oppoId) {
          if (opHp && matchData) {
            if (
              matchData.data.battleLog[currentIndex].defense_log.includes(
                "회피"
              )
            ) {
              setIsOpAvoid(true);
            } else {
              setIsOpHurt(true);
            }
          }
        } else if (matchData?.data.battleLog[currentIndex].defender === myId) {
          {
            if (
              matchData.data.battleLog[currentIndex].defense_log.includes(
                "회피"
              )
            ) {
              setIsMyAvoid(true);
            } else {
              setIsMyHurt(true);
            }
          }
        }
      } else if (logIndex === 3) {
        setCurrentLog(currentScript.damageScript);
        if (matchData?.data.battleLog[currentIndex].defender === oppoId) {
          // 상대 HP 깎기
          if (opHp && matchData) {
            setopHp(opHp - matchData.data.battleLog[currentIndex].damage);
            if (opHp - matchData.data.battleLog[currentIndex].damage <= 0)
              setIsOpen(true);
          }
          setLogIndex(-1);
        } else if (matchData?.data.battleLog[currentIndex].defender === myId) {
          // 내 HP 깎기
          if (myHp && matchData) {
            setmyHp(myHp - matchData.data.battleLog[currentIndex].damage);
            if (myHp - matchData.data.battleLog[currentIndex].damage <= 0) {
              setIsOpen(true);
            }
          }
          setLogIndex(-1);
        }
      }
    }
  }, [logIndex, currentScript]);

  function handleNext() {
    if ((logIndex + 1) % 4 == 0) {
      if (currentIndex !== 9) setCurrentIndex(currentIndex + 1);
      else {
        setIsOpen(true);
        return;
      }
    }
    setLogIndex((logIndex + 1) % 4);
    // 애니메이션 클릭시 IDLE 상태로 다시 초기화
    setIsMyAttack(false);
    setIsMyHurt(false);
    setIsMyAvoid(false);
    setIsOpAttack(false);
    setIsOpHurt(false);
    setIsOpAvoid(false);
  }
  console.log("스크립트 데이터 확인: ", initialState);
  // 종료 모달

  const afterOpenModal = () => {};

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    Modal.setAppElement("#pageContainer");
  }, []);

  return (
    <div id="pageContainer">
      {soundOn && (
        <audio ref={audioRef} src="/static/sound/battle.mp3" autoPlay />
      )}

      <div className={styles.pageContainer}>
        {!isAnimationFinished && (
          <Lottie
            ref={playerRef}
            loop={false}
            animationData={lottieJson}
            play
            onComplete={handleAnimationComplete}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
        )}
        <>
          {loadData && (
            <div className={styles.gameWrapper} ref={gameWrapper}>
              <div className={styles.gameBox}>
                <div
                  onClick={() => setSoundOn(!soundOn)}
                  style={{
                    cursor: "pointer",
                    marginLeft: "2em",
                    position: "absolute",
                    zIndex: 9999,
                    top: "1em",
                    right: "2em",
                  }}
                >
                  {soundOn ? <SoundOn /> : <SoundOff />}
                </div>
                <Canvas
                  style={{
                    position: "relative",
                    zIndex: 10,
                  }}
                >
                  <Suspense fallback={<Loader />}>
                    <ambientLight intensity={0.5} />
                    <directionalLight
                      color="white"
                      position={[5, 0, 5]}
                      intensity={0.6}
                    />
                    <Model
                      url={
                        matchData?.data.attackRepo.repomon.repomonUrl.includes(
                          "Egg"
                        )
                          ? `https://repomon.s3.ap-northeast-2.amazonaws.com/models/Egg.glb`
                          : matchData?.data.attackRepo.repomon.repomonUrl || ""
                      }
                    />
                    <SecondModel
                      url={
                        matchData?.data.defenseRepo.repomon.repomonUrl.includes(
                          "Egg"
                        )
                          ? `https://repomon.s3.ap-northeast-2.amazonaws.com/models/Egg.glb`
                          : matchData?.data.defenseRepo.repomon.repomonUrl || ""
                      }
                    />
                    {/* <ShadowCircle /> */}
                    <Grass />
                    <MyUI />
                    <OpUI />
                    <EndModal />
                  </Suspense>
                </Canvas>
              </div>
              <div className={styles.gameLogBox} onClick={handleNext}>
                <div
                  style={{
                    overflowY: "auto",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      overflow: "hidden",
                    }}
                  >
                    <p>{currentLog}</p>
                    <p
                      id={styles.triangle}
                      style={{
                        fontSize: "0.7em",
                        marginLeft: "1em",
                      }}
                    >
                      ▼
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default Page;