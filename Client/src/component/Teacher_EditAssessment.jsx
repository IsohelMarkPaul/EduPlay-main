import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Accordion from "./Accordion";
import ReactModal from "react-modal";
import "../styles/Teacher_EditAssessment.css";
import axios from "axios";

function Teacher_EditAssessment() {
  const navigate = useNavigate();
  const { assessmentId } = useParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSaveAssessmentModal, setShowSaveAssessmentModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [assessment, setAssessment] = useState();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API}teacher/getAssessment/${assessmentId}`)
      .then((res) => setAssessment(res.data.assessment))
      .catch((err) => alert(err.message));
  }, []);

  const handleSaveAssessment = () => {
    setShowSaveAssessmentModal(false);
    axios.patch(`${import.meta.env.VITE_API}teacher/updateAssessment/${assessmentId}`, assessment).catch((err) => alert(err.message));
    navigate("/teacher/assessments");
  };

  const showEditQuestion = (ind) => (e) => {
    e.stopPropagation();
    setShowEditModal(true);
    setCurrentQuestion(ind);
  };

  const showDelete = (ind) => (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
    setCurrentQuestion(ind);
  };

  const handleSave = (question) => {
    const temp = { ...assessment };
    temp.questions[currentQuestion] = question;
    setAssessment(temp);
    setShowEditModal(false);
  };

  const handleAddQuestion = (question) => {
    if (question.question === "") return alert("Please enter a question.");
    if (question.choices.length < 2 || question.choices[0] === "" || question.choices[1] === "") return alert("Please enter at least 2 choices.");
    if (question.correctAnswer < 0 || question.correctAnswer > question.choices.length - 1) return alert("Please check the correct answer");
    const temp = { ...assessment };
    temp.questions = [...temp.questions, question];
    setAssessment(temp);
    setShowAddModal(false);
  };

  const handleDeleteQuestion = (ind) => {
    const temp = { ...assessment };
    temp.questions.splice(ind, 1);
    setAssessment(temp);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="flex flex-col flex-grow gap-4 p-4">
        <div className="bg-[#08a454] rounded-full shadow-md px-10 py-3 text-4xl font-bold font-sourceSans3">CUSTOM ASSESSMENTS</div>
        <div className="flex flex-col bg-[#a8d4a4] flex-grow gap-4 rounded-3xl p-5 font-bold">
          <div className="flex flex-row justify-end gap-2">
            <button className="bg-[#282424] rounded-full shadow-md px-8 py-2 text-white text-2xl font-bold hover:brightness-90" onClick={() => setShowAddModal(true)}>
              ADD QUESTION
            </button>
            <button className="bg-[#282424] rounded-full shadow-md px-8 py-2 text-white text-2xl font-bold hover:brightness-90" onClick={() => setShowSaveAssessmentModal(true)}>
              SAVE ASSESSMENT
            </button>
          </div>

          <div className="flex flex-col gap-4 m-4">
            {assessment?.questions.map((i, ind) => (
              <Accordion key={ind}>
                <Accordion.Title>
                  <div className="flex flex-row flex-grow justify-between items-center px-6">
                    <h4 className="text-4xl font-bold font-sourceSans3">{`Question ${ind + 1}`}</h4>
                    <div className="flex flex-row gap-2 text-white font-bold">
                      <button className="bg-[#08a454] rounded-full shadow-md px-8 py-2" onClick={showEditQuestion(ind)}>
                        EDIT
                      </button>
                      <button className="bg-[#d00c24] rounded-full shadow-md px-8 py-2" onClick={showDelete(ind)}>
                        DELETE
                      </button>
                    </div>
                  </div>
                </Accordion.Title>
                <Accordion.Content>
                  <div className="flex flex-col gap-4 font-sourceSans3 ">
                    <div className="text-3xl ms-8 font-bold">{i.question}</div>
                    <div className="flex flex-col text-2xl ms-16">
                      {i.choices.map((c, indc) => (
                        <div className={indc === i.correctAnswer ? "font-bold" : "font-normal"} key={indc}>{`${String.fromCharCode(97 + indc)}. ${c}`}</div>
                      ))}
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion>
            ))}
          </div>
        </div>
      </div>
      <AddModal show={showAddModal} onHide={() => setShowAddModal(false)} onSave={handleAddQuestion} />
      <EditModal show={showEditModal} onHide={() => setShowEditModal(false)} onSave={handleSave} question={assessment?.questions[currentQuestion]} />
      <DeleteModal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} onSave={handleDeleteQuestion} />
      <SaveAssessmentModal show={showSaveAssessmentModal} onHide={() => setShowSaveAssessmentModal(false)} onSave={handleSaveAssessment} />
    </>
  );
}

export default Teacher_EditAssessment;

function AddModal({ show, onHide, onSave }) {
  const [questionInput, setQuestionInput] = useState("");
  const [choices, setChoices] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(-1);

  useEffect(() => {
    setQuestionInput("");
    setChoices(["", ""]);
    setCorrectAnswer(-1);
  }, [show]);

  const editChoice = (ind, choice) => {
    const temp = [...choices];
    temp[ind] = choice;
    setChoices(temp);
  };

  if (!show) return;

  return (
    <ReactModal
      appElement={document.getElementById("root")}
      isOpen={show}
      shouldCloseOnEsc={true}
      style={{ content: { backgroundColor: "#FFFFFF", border: "5px solid black", borderRadius: "2rem", maxWidth: "720px", width: "100%", height: "fit-content", top: "50%", left: "50%", transform: "translate(-50%, -50%)" } }}>
      <div className="flex flex-col justify-center gap-8 font-sourceSans3 font-semibold p-6">
        <div className="text-center text-3xl">ADD QUESTION</div>
        <div className="flex flex-row items-center gap-2 text-2xl">
          <label htmlFor="question">Question:</label>
          <input className="flex-grow px-4 py-1 rounded-full border-2 border-black" type="text" id="question" placeholder="Question" value={questionInput} onChange={(e) => setQuestionInput(e.target.value)} />
        </div>
        <div className="flex flex-row gap-3">
          <div className="text-2xl">Choices:</div>
          <div className="flex flex-col gap-3 flex-grow">
            {choices.map((choice, ind) => (
              <div className="flex flex-row gap-2 items-center" key={ind}>
                <input className="flex-grow text-2xl rounded-full px-5 py-1 border-2 border-black" type="text" value={choice} onChange={(e) => editChoice(ind, e.target.value)} placeholder="Choice" />
                <input type="checkbox" checked={ind === correctAnswer} onChange={() => setCorrectAnswer(ind)} />
              </div>
            ))}
            <button className="flex-grow text-2xl text-white bg-[#08a454] rounded-full shadow-md py-2 me-12" onClick={() => setChoices([...choices, ""])}>
              + Add a choice
            </button>
          </div>
        </div>
        <div className="flex flex-row justify-end gap-2 text-white">
          <button className="text-2xl bg-[#d00c24] rounded-full shadow-md px-6 py-2 hover:brightness-95" onClick={onHide}>
            CANCEL
          </button>
          <button className="text-2xl bg-[#08a454] rounded-full shadow-md px-6 py-2 hover:brightness-95" onClick={() => onSave({ question: questionInput, choices, correctAnswer })}>
            ADD
          </button>
        </div>
      </div>
    </ReactModal>
  );
}

function EditModal({ show, onHide, onSave, question }) {
  const [questionInput, setQuestionInput] = useState("");
  const [choices, setChoices] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(-1);

  useEffect(() => {
    if (question) {
      setQuestionInput(question.question);
      setChoices(question.choices);
      setCorrectAnswer(question.correctAnswer);
    }
  }, [question]);

  const editChoice = (ind, choice) => {
    const temp = [...choices];
    temp[ind] = choice;
    setChoices(temp);
  };

  if (!show) return;

  return (
    <ReactModal
      appElement={document.getElementById("root")}
      isOpen={show}
      shouldCloseOnEsc={true}
      style={{ content: { backgroundColor: "#FFFFFF", border: "5px solid black", borderRadius: "2rem", maxWidth: "720px", width: "100%", height: "fit-content", top: "50%", left: "50%", transform: "translate(-50%, -50%)" } }}>
      <div className="flex flex-col justify-center gap-8 font-sourceSans3 font-semibold p-6">
        <div className="text-center text-3xl">EDIT QUESTION</div>
        <div className="flex flex-row items-center gap-2 text-2xl">
          <label htmlFor="question">Question:</label>
          <input className="flex-grow px-4 py-1 rounded-full border-2 border-black" type="text" id="question" value={questionInput} onChange={(e) => setQuestionInput(e.target.value)} />
        </div>
        <div className="flex flex-row gap-3">
          <div className="text-2xl">Choices:</div>
          <div className="flex flex-col gap-3 flex-grow">
            {choices.map((choice, ind) => (
              <div className="flex flex-row gap-2 items-center" key={ind}>
                <input className="flex-grow text-2xl rounded-full px-5 py-1 border-2 border-black" type="text" value={choice} onChange={(e) => editChoice(ind, e.target.value)} />
                <input type="checkbox" checked={ind === correctAnswer} onChange={() => setCorrectAnswer(ind)} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-row justify-end gap-2 text-white">
          <button className="text-2xl bg-[#d00c24] rounded-full shadow-md px-6 py-2 hover:brightness-95" onClick={onHide}>
            CANCEL
          </button>
          <button className="text-2xl bg-[#08a454] rounded-full shadow-md px-6 py-2 hover:brightness-95" onClick={() => onSave({ question: questionInput, choices, correctAnswer })}>
            SAVE
          </button>
        </div>
      </div>
    </ReactModal>
  );
}

function DeleteModal({ show, onHide, onSave }) {
  if (!show) return;
  return (
    <ReactModal
      appElement={document.getElementById("root")}
      isOpen={show}
      shouldCloseOnEsc={true}
      style={{ content: { backgroundColor: "#FFFFFF", border: "5px solid black", borderRadius: "2rem", maxWidth: "720px", width: "100%", height: "fit-content", top: "50%", left: "50%", transform: "translate(-50%, -50%)" } }}>
      <div className="flex flex-col justify-center gap-8 font-sourceSans3 font-semibold p-6">
        <h2 className="text-3xl text-center">DELETE QUESTION</h2>
        <div className="text-2xl">
          Reminder: <br />
          Upon clicking proceed, all information provided under the question will be deleted.
        </div>
        <div className="flex flex-row justify-end gap-2 text-white">
          <button className="text-2xl bg-[#d00c24] rounded-full shadow-md px-6 py-2 hover:brightness-95" onClick={onHide}>
            CANCEL
          </button>
          <button className="text-2xl bg-[#08a454] rounded-full shadow-md px-6 py-2 hover:brightness-95" onClick={onSave}>
            PROCEED
          </button>
        </div>
      </div>
    </ReactModal>
  );
}

function SaveAssessmentModal({ show, onHide, onSave }) {
  if (!show) return;
  return (
    <ReactModal
      appElement={document.getElementById("root")}
      isOpen={show}
      shouldCloseOnEsc={true}
      style={{ content: { backgroundColor: "#FFFFFF", border: "5px solid black", borderRadius: "2rem", maxWidth: "720px", width: "100%", height: "fit-content", top: "50%", left: "50%", transform: "translate(-50%, -50%)" } }}>
      <div className="flex flex-col justify-center gap-8 font-sourceSans3 font-semibold p-6">
        <h2 className="text-3xl text-center">SAVE ASSESSMENT</h2>
        <div className="text-2xl">
          Reminders: <br />
          1. Upon clicking save, you will not be able to make any changes. <br />
          2. Please make sure all questions were properly created and no question was added without any questions/answer.
        </div>
        <div className="flex flex-row justify-end gap-2 text-white">
          <button className="text-2xl bg-[#d00c24] rounded-full shadow-md px-6 py-2 hover:brightness-95" onClick={onHide}>
            CANCEL
          </button>
          <button className="text-2xl bg-[#08a454] rounded-full shadow-md px-6 py-2 hover:brightness-95" onClick={onSave}>
            SAVE
          </button>
        </div>
      </div>
    </ReactModal>
  );
}
