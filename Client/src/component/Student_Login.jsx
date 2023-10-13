import React, { useState } from "react";
import logo from "../assets/logo.png";
import boygirl from "../assets/BoyAndGirl.png";
import { useFormik } from "formik";
import { studentSchema } from "../SchemaValidation";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Student_Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const setAuthHeader = (token) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const onSubmit = async (values, setSubmitting) => {
    try {
      const userAgent = navigator.userAgent;
      const apiUrl = "http://localhost:5000/api/v1/Student/login";

      const response = await axios.post(apiUrl, {
        username: values.username,
        password: values.password,
        userAgent: userAgent,
      });

      console.log("Response Data:", response.data.user.user);

      if (response.status === 200) {
        // Store the JWT token securely in sessionStorage
        const tokenStudent = response.data.user.user;
        sessionStorage.setItem("studentToken", tokenStudent);
        console.log("Token Student:", tokenStudent);
        setAuthHeader(tokenStudent);

        // Redirect to the student homepage
        navigate("/Student_Homepage");
      } else {
        // Display an error message to the user
        alert("Login failed. Invalid username or password.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred: " + error.message);
    } finally {
      setSubmitting(false); // Reset the form submission state
    }
  };

  const {
    values,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
    isSubmitting,
  } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: studentSchema,
    onSubmit: (values, { setSubmitting }) => onSubmit(values, setSubmitting),
  });

  return (
    <div className="flex items-center justify-center min-h-screen background">
      <main className="w-full md:w-[80%] lg:w-[70%] xl:w-[60%] m-4 text-center grid grid-cols-[35%_65%]">
        <div className="grid grid-rows-[40%_15%_35%] text-white bg-[#252525] bg-opacity-95">
          <div className="flex items-center justify-center">
            <img
              className="object-cover w-fit h-[90%] m-0"
              src={logo}
              alt="Logo"
            />
          </div>
          <div>
            <h1 className="text-6xl font-bold font-reemkufifont">EDUPLAY</h1>
          </div>
          <div className="flex items-center justify-center">
            <img
              className="object-cover w-fit h-[90%]"
              src={boygirl}
              alt="Logo"
            />
          </div>
        </div>
        <section className="bg-[#f7d538] opacity-95 flex flex-row justify-center">
          <div>
            <h2 className="mt-40 font-extrabold px-14 text-7xl font-expletus">
              Student Login
            </h2>
            <h1 className="font-extrabold mb-14 px-14 text-8xl font-expletus">
              Sign In
            </h1>
            <form onSubmit={handleSubmit}>
              <label htmlFor="username" className="block text-xl font-semibold mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                className={`w-[100%] rounded-full flex p-4 px-10 mt-2 text-4xl bg-black text-white border-2 placeholder-white font-kumbh ${
                  touched.username && errors.username ? "border-red-500 " : ""
                }`}
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />
              <label htmlFor="password" className="block text-xl font-semibold mt-4 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className={`w-[100%] justify-center flex items-center rounded-full px-10 border-2 p-4 text-4xl bg-black text-white placeholder-white font-kumbh ${
                    touched.password && errors.password ? "border-red-500 " : ""
                  }`}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                />
                <span
                  className="absolute top-2 right-2 cursor-pointer text-xl"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
              <div className="flex justify-between mt-4">
                <label className="block font-bold text-gray-500">
                  <input className="leading-tight" type="checkbox" />
                  <span className="ml-1 text-lg">Remember me</span>
                </label>
              </div>
              <button
                className="w-[80%] font-sourceSans3 text-center rounded-full p-4 mt-4 text-5xl bg-black shadow-lg hover:shadow-green-400 text-white placeholder-white font-bold transition duration-300 ease-in-out transform hover:scale-105"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Student_Login;
