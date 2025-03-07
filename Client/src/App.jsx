import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import React from "react";
import LandingPage from "./component/LandingPage";
import { QueryClient, QueryClientProvider } from "react-query";

import Student_Login from "./component/Student_Login";
import Student_Logout from "./component/Student_Logout";
import Student_SharedLayout from "./component/Student_SharedLayout";
import Student_Homepage from "./component/Student_Homepage";
import Student_Profile from "./component/Student_Profile";
import Student_Modules from "./component/Student_Modules";
import Student_Module_Lecture from "./component/Student_Module_Lecture";
import Student_Module_Review from "./component/Student_Module_Review";
import Student_Assessment from "./component/Student_Assessment";
import Student_AssessmentMenu from "./component/Student_AssesmentMenu";
import Student_LearningGroup from "./component/Student_LearningGroup";
import Student_Game from "./component/Student_Game";

import TokenTransfer from "./component/TokenTransfer";

import Teacher_Navbar from "./component/Teacher_Navbar";
import TeacherLogin from "./component/TeacherLogin";
import Teacher_Logout from "./component/Teacher_Logout";
import TeacherSignUp from "./component/TeacherSignUp";
import TeacherHomepage from "./component/TeacherHomepage";
import Teacher_Send_Email from "./component/Teacher_Send_Email";
import Teacher_Enter_Code from "./component/Teacher_Enter_Code";
import Teacher_Reset_Password from "./component/Teacher_Reset_Password";
import Teacher_PasswordReset_Success from "./component/Teacher_PasswordReset_Success";
import Teacher_AccountManagement from "./component/Teacher_AccountManagement";
import Teacher_SharedLayout from "./component/Teacher_SharedLayout";
import Teacher_EditStudent from "./component/Teacher_EditStudent";

import AdminSignin from "./component/AdminSignin";
import Teacher_Add_Student from "./component/Teacher_Add_Student";
import NotFound from "./component/NotFound";
import Teacher_CreateAssessment from "./component/Teacher_CreateAssessment";
import TeacherAssessments from "./component/Teacher_Assessments";
import Teacher_EditAssessment from "./component/Teacher_EditAssessment";
import Student_LearningGroupAssessment from "./component/Student_LearningGroupAssessment";
import Teacher_CustomAssessmentAnalysis from "./component/Teacher_CustomAssessmentAnalysis";
import Teacher_LearningGroup from "./component/Teacher_LearningGroup";
import Teacher_LearningGroupStudent from "./component/Teacher_LearningGroupStudent";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Wrap the entire application with QueryClientProvider */}
      <>
        <BrowserRouter>
          <Routes>
            {/* Set LandingPage as the root route */}
            <Route path="/" element={<LandingPage />} />

            {/* TokenTransfer */}
            <Route path="/setToken" element={<TokenTransfer />} />

            {/* Student Routes */}
            <Route path="/student/login" element={<Student_Login />} />
            <Route path="/student" element={<Student_SharedLayout />}>
              <Route index element={<Student_Homepage />} />
              <Route path="profile" element={<Student_Profile />} />
              <Route path="modules" element={<Student_Modules />} />
              <Route path="module/:moduleNumber/lecture" element={<Student_Module_Lecture />} />
              <Route path="module/:moduleNumber/review" element={<Student_Module_Review />} />
              <Route path="module/:moduleNumber/game" element={<Student_Game />} />
              <Route path="module/:moduleNumber/assessment" element={<Student_Assessment />} />
              <Route path="assessments" element={<Student_AssessmentMenu />} />
              <Route path="learning-group" element={<Student_LearningGroup />} />
              <Route path="learning-group/:assessmentId" element={<Student_LearningGroupAssessment />} />
              <Route path="logout" element={<Student_Logout />} />
            </Route>

            {/* Teacher Routes */}
            <Route path="/teacher/login" element={<TeacherLogin />} />
            <Route path="/teacher/signUp" element={<TeacherSignUp />} />
            <Route path="/teacher/send-email" element={<Teacher_Send_Email />} />
            <Route path="/teacher/enter-code" element={<Teacher_Enter_Code />} />
            <Route path="/teacher/reset-password" element={<Teacher_Reset_Password />} />
            <Route path="/teacher/password-reset-success" element={<Teacher_PasswordReset_Success />} />

            <Route path="/teacher" element={<Teacher_SharedLayout />}>
              <Route index element={<TeacherHomepage />} />
              <Route path="navbar" element={<Teacher_Navbar />} />
              <Route path="accounts" element={<Teacher_AccountManagement />} />
              <Route path="accounts/create" element={<Teacher_Add_Student />} />
              <Route path="accounts/:accountId" element={<Teacher_EditStudent />} />
              <Route path="logout" element={<Teacher_Logout />} />
              <Route path="assessments" element={<TeacherAssessments />} />
              <Route path="assessments/create" element={<Teacher_CreateAssessment />} />
              <Route path="assessments/:assessmendId/analysis" element={<Teacher_CustomAssessmentAnalysis />} />
              <Route path="assessments/:assessmentId" element={<Teacher_EditAssessment />} />
              <Route path="learning-group" element={<Teacher_LearningGroup />} />
              <Route path="learning-group/:username" element={<Teacher_LearningGroupStudent />} />
            </Route>

            {/* Admin Route */}
            <Route path="/AdminSignin" element={<AdminSignin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </>
    </QueryClientProvider>
  );
}

export default App;
