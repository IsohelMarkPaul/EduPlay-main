import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactModal from "react-modal";
import textToSpeechIcon from "../assets/texttospeech.svg";
import axios from "axios";

function StudentAssessment() {
  const { moduleNumber } = useParams();
  const userId = localStorage.getItem("userId");
  const gradeLevel = localStorage.getItem("gradeLevel");
  const [data, setData] = useState();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState(-1);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isViewingScore, setIsViewingScore] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const init = async () => {
      let res = await axios.get(`${import.meta.env.VITE_API}student/assessment-record?studentId=${userId}&moduleNumber=${moduleNumber}&gradeLevel=${gradeLevel}`);
      if (res.data.request.length >= 1) localStorage.setItem(`g${gradeLevel}-m${moduleNumber}-answers`, JSON.stringify(res.data.request[0].answers))
      const userAnswersFromLocalStorage = localStorage.getItem(`g${gradeLevel}-m${moduleNumber}-answers`);
      res = await fetch(`/modules/grade${gradeLevel}/module${moduleNumber}/assessment.json`);
      const data = await res.json();
      setData(data);
      setIsLoading(false);
      if (!userAnswersFromLocalStorage) localStorage.setItem(`g${gradeLevel}-m${moduleNumber}-answers`, JSON.stringify(new Array(data.questions.length).fill(-1)));
      else {
        const temp = JSON.parse(userAnswersFromLocalStorage);
        console.log(temp)
        if (!temp.includes(-1)) {
          setIsViewingScore(true);
          setHasAnswered(true);
          setCurrentAnswer(temp[0]);
          const correctAns = data?.questions.map((i) => i.correctAnswer);
          setScore(computeScore(temp, correctAns));
        } else setCurrentQuestion(temp.indexOf(-1));
      }
    };
    init();
  }, []);

  const handleTTSClick = () => {
    if (speechSynthesis.speaking) return;
    let test = data?.questions[currentQuestion].question + "\n";
    for (let i = 0; i < data?.questions[currentQuestion].choices.length - 1; i++) test += data?.questions[currentQuestion].choices[i] + "?, ";
    test += "or " + data?.questions[currentQuestion].choices[data?.questions[currentQuestion].choices.length - 1];
    let utterance = new SpeechSynthesisUtterance(test);
    speechSynthesis.speak(utterance);
  };

  const handleSubmit = () => {
    if (currentAnswer === -1) return alert("Select your answer before submitting.");
    const temp = JSON.parse(localStorage.getItem(`g${gradeLevel}-m${moduleNumber}-answers`));
    temp[temp.indexOf(-1)] = currentAnswer;
    localStorage.setItem(`g${gradeLevel}-m${moduleNumber}-answers`, JSON.stringify(temp));
    setHasAnswered(true);
    const correctAns = data?.questions.map((i) => i.correctAnswer);
    setScore(computeScore(temp, correctAns));
  };

  const handleNext = async () => {
    if (currentQuestion + 1 < data?.questions.length) {
      setCurrentQuestion((i) => i + 1);
      setCurrentAnswer(-1);
      setHasAnswered(false);
    } else setIsSubmitModalOpen(true);
  };

  const handleSubmitQuiz = async () => {
    const answers = JSON.parse(localStorage.getItem(`g${gradeLevel}-m${moduleNumber}-answers`));
    const res = await axios.post(`${import.meta.env.VITE_API}student/assessment-record`, { moduleNumber, userId, answers });
    setResult(res.data);
    setIsCompleteModalOpen(true);
    setIsViewingScore(true);
    setCurrentQuestion(0);
    setCurrentAnswer(JSON.parse(localStorage.getItem(`g${gradeLevel}-m${moduleNumber}-answers`))[0]);
    setIsSubmitModalOpen(false);
  };

  const computeScore = (userAns, correctAns) => {
    let score = 0;
    for (let i = 0; i < userAns.length; i++) if (userAns[i] === correctAns[i]) score++;
    return score;
  };

  const goToQuestion = (i) => {
    setCurrentQuestion(i);
    setCurrentAnswer(JSON.parse(localStorage.getItem(`g${gradeLevel}-m${moduleNumber}-answers`))[i]);
  };

  const isAnswerCorrect = (ind) => data?.questions[currentQuestion].correctAnswer === currentAnswer && ind === currentAnswer;
  const isAnswerWrong = (ind) => ind === currentAnswer;
  const isTheCorrectAnswer = (ind) => ind === data?.questions[currentQuestion].correctAnswer;

  const getBadge = () => {
    const percentage = result?.score / result?.total;
    let badge = "";
    if (percentage === 1) badge = "Gold";
    else if (percentage >= 0.7) badge = "Silver";
    else if (percentage >= 0.4) badge = "Bronze";
    return `/public/badges/Grade ${gradeLevel}/G${gradeLevel}M${moduleNumber} ${badge}.png`;
  };

  return (
    <>
      <div className="bg-[#fff5be] flex flex-col items-center m-4 mb-6 p-8 gap-6 rounded-2xl flex-grow">
        <div className="flex flex-row justify-between w-full text-5xl font-semibold font-sourceSans3 items-center my-2">
          <h3 className="me-auto">{data?.title || ""}</h3>
          {isViewingScore && <div className=""> {`Score: ${score}/${data?.questions.length}`}</div>}
        </div>
        <hr className="bg-black h-1 w-full" />

        <div className="flex flex-col bg-[#ffbc5c] w-full rounded-3xl p-10 my-auto gap-4" style={{ maxWidth: "1024px" }}>
          {!isLoading && (
            <>
              <div className="flex flex-row justify-between">
                <h2 className="text-3xl font-semibold font-sourceSans3">Question</h2>
                <img className="cursor-pointer" onClick={handleTTSClick} src={textToSpeechIcon} alt="textToSpeechIcon" style={{ maxHeight: "40px" }} />
              </div>
              <h3 className="text-4xl font-semibold font-sourceSans3">{`${currentQuestion + 1}. ${data?.questions[currentQuestion].question}`}</h3>
              <div className="flex flex-col gap-3">
                {data?.questions[currentQuestion].choices.map((choice, ind) => (
                  <div
                    className={`flex flex-row items-center gap-4 px-6 py-3 rounded-full shadow-md ${hasAnswered ? "" : "hover:shadow-xl hover:brightness-95"} ${
                      hasAnswered ? (isAnswerCorrect(ind) || isTheCorrectAnswer(ind) ? "bg-green-400" : isAnswerWrong(ind) ? "bg-red-400" : "bg-white") : ind === currentAnswer ? "bg-neutral-200" : "bg-white"
                    } ${hasAnswered ? "" : "cursor-pointer"}`}
                    onClick={() => !hasAnswered && setCurrentAnswer(ind)}
                    key={ind}>
                    <input type="radio" id={ind} checked={ind === currentAnswer} className={hasAnswered ? "" : "cursor-pointer"} readOnly />
                    <label className={`text-2xl font-bold flex-grow ${hasAnswered ? "" : "cursor-pointer"}`} htmlFor={ind}>
                      {choice}
                    </label>
                    {hasAnswered &&
                      (isAnswerCorrect(ind) ? (
                        <div className="font-sourceSans3 font-semibold text-lg">Your Answer (Correct)</div>
                      ) : isAnswerWrong(ind) ? (
                        <div className="font-sourceSans3 font-semibold text-lg">Your Answer (Wrong)</div>
                      ) : isTheCorrectAnswer(ind) ? (
                        <div className="font-sourceSans3 font-semibold text-lg">The Correct Answer</div>
                      ) : (
                        <></>
                      ))}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        {isViewingScore ? (
          <div className="flex flex-row justify-between w-full text-white font-sourceSans3 font-semibold text-2xl" style={{ maxWidth: "1024px" }}>
            {currentQuestion != 0 && (
              <button className="me-auto bg-[#282424] px-10 py-2 rounded-full hover:brightness-90 shadow-md" onClick={() => goToQuestion(currentQuestion - 1)}>
                PREVIOUS
              </button>
            )}
            {currentQuestion + 1 != data?.questions.length && (
              <button className="ms-auto bg-[#282424] px-10 py-2 rounded-full hover:brightness-90 shadow-md" onClick={() => goToQuestion(currentQuestion + 1)}>
                NEXT
              </button>
            )}
          </div>
        ) : hasAnswered ? (
          <button className="bg-[#282424] rounded-full px-10 py-2 text-3xl shadow-md text-white font-bold font-sourceSans3 hover:brightness-90" onClick={handleNext}>
            NEXT
          </button>
        ) : (
          <button className="bg-[#08a454] rounded-full px-10 py-2 text-3xl shadow-md text-white font-bold font-sourceSans3 hover:brightness-90" onClick={handleSubmit}>
            SUBMIT
          </button>
        )}
      </div>
      <ReactModal
        appElement={document.getElementById("root")}
        isOpen={isSubmitModalOpen}
        shouldCloseOnEsc={true}
        style={{ content: { backgroundColor: "#d8ec8c", border: "0", borderRadius: "2rem", maxWidth: "540px", width: "fit-content", height: "fit-content", top: "50%", left: "50%", transform: "translate(-50%, -50%)" } }}>
        <div className="flex flex-col justify-center items-center gap-8 font-sourceSans3 text-3xl font-semibold p-8">
          <div className="text-center">Are you sure you want to submit the quiz?</div>
          <div className="flex flex-row justify-center gap-4">
            <button className="bg-red-500 text-white px-10 py-2 rounded-full shadow-md hover:brightness-90" onClick={() => setIsSubmitModalOpen(false)}>
              CANCEL
            </button>
            <button className="bg-[#08a454] text-white px-10 py-2 rounded-full shadow-md hover:brightness-90" onClick={handleSubmitQuiz}>
              SUBMIT
            </button>
          </div>
        </div>
      </ReactModal>

      <ReactModal
        appElement={document.getElementById("root")}
        isOpen={isCompleteModalOpen}
        shouldCloseOnEsc={true}
        style={{ content: { backgroundColor: "#d8ec8c", border: "0", borderRadius: "2rem", maxWidth: "620px", width: "fit-content", height: "fit-content", top: "50%", left: "50%", transform: "translate(-50%, -50%)" } }}>
        <div className="flex flex-col justify-center items-center gap-2 font-sourceSans3 text-2xl font-semibold p-8">
          <div className="text-center text-4xl">{`Assessment ${moduleNumber}`}</div>
          {result?.score / result?.total >= 0.4 && (
            <>
              <div className="text-center">
                {`Congratulations!`}
                <br />
                {`You received a  badge on ${data?.title}`}
              </div>
              <img src={getBadge()} style={{ height: "200px" }} />
            </>
          )}
          <div className="text-center my-2">{result?.recommendation}</div>
          <div className="flex flex-row justify-center gap-4">
            <button className="bg-green-500 text-white px-10 py-2 rounded-full shadow-md hover:brightness-90" onClick={() => setIsCompleteModalOpen(false)}>
              OK
            </button>
          </div>
        </div>
      </ReactModal>
    </>
  );
}

export default StudentAssessment;
