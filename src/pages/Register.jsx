import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState(""); // State to hold the password
  const [passwordError, setPasswordError] = useState(""); // State for password error
  const [email, setEmail] = useState(""); // State to hold the email
  const [emailError, setEmailError] = useState("");
  const [file, setFile] = useState(null); // State to hold the selected file
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const navigate = useNavigate();

  const handlePasswordBlur = () => {
    if (password.length < 6) {
      setPasswordError("Password should be at least 6 characters long.");
    } else {
      setPasswordError(""); // Clear error if valid
    }
  };
  const handleEmailBlur = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for email validation
    if (!emailPattern.test(email)) {
      setEmailError("Email should be in the format something@gmail.com");
    } else {
      setEmailError(""); // Clear error if valid
    }
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setErr(null); // Clear the error message when a file is selected
    setSuccessMessage("Image uploaded successfully!"); // Set success message
  };
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
    if (password.length < 6) {
      setErr("Password should be at least 6 characters long.");
      setLoading(false);
      return; // Stop the function if validation fails
    }
    if (!file) {
      setErr("Please upload an image.");
      setLoading(false);
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErr("Email should be in the format something@gmail.com");
      setLoading(false);
      return;
    }
    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
              
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch (err) {
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chatgram</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="display name" />
          <input
            required
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state
            onBlur={handleEmailBlur} // Check email format on blur
          />
          {emailError && <span style={{ color: "red" }}>{emailError}</span>} {/* Display email error */}
          <input
            required
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            onBlur={handlePasswordBlur} // Check password length on blur
          />
          {passwordError && <span style={{ color: "red" }}>{passwordError}</span>} {/* Display password error */}
          <input
            
            style={{ display: "none" }}
            type="file"
            id="file"
            onChange={handleFileChange} // Update file state on change
          />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button disabled={loading}>Sign up</button>
          {loading && "Uploading and compressing the image please wait..."}
          {err && <span style={{ color: "red" }}>{err}</span>}
          {successMessage && <span style={{ color: "green" }}>{successMessage}</span>} {/* Display success message */}
        </form>
        <p>
          You do have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
