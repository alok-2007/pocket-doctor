import { createContext, useState, useContext } from "react";
import "./PatientContext.css";
import { LanguageContext } from "./LanguageContext";
import male from "./media/male.png";
import female from "./media/female.png";

export const PatientContext = createContext();

export const PatientProvider = ({children}) => {
    const [age, setAge] = useState(null);
    const [isMale, setIsMale] = useState(null);
    const [submit, setSubmit] = useState(false)
    const [notification, setNotification] = useState("");
    
    const {language, changeLanguage} = useContext(LanguageContext);


    const genderClick = (e) => {
        if (e.target.value === "male") {
            setIsMale(true)
        } else {
            setIsMale(false)
        }
    }

    const handleSubmit = () => {
    const trimmedAge = age ? age.trim() : "";
    if (trimmedAge) {
        if (!isNaN(trimmedAge) && Number(trimmedAge) > 0) {
            if (isMale !== null) {
                setSubmit(true);
                return;
            } else {
                setNotification(language === "English" ? "Please Select Gender!" : "कृपया लिंग चुनें!");
                return;
            }
        } else {
            if (isMale === null) {
                setNotification(language === "English" ? "Entered Age is invalid! Please Enter valid Age and Select Gender." : "आयु अमान्य है! कृपया वैध आयु दर्ज करें और लिंग चुनें।");
                return;
            }
            setNotification(language === "English" ? "Entered Age is invalid! Please Enter valid Age." : "आयु अमान्य है! कृपया वैध आयु दर्ज करें।");
            return;
        }
    } else {
        if (isMale === null) {
            setNotification(language === "English" ? "Please Enter Age and Select Gender." : "कृपया आयु और लिंग दर्ज करें।");
            return;
        }
        setNotification(language === "English" ? "Please Enter Age!" : "कृपया आयु दर्ज करें।");
        return;
    }
    };


    if (!submit) {
        return (
            <div className="patient-info">
                {notification && (
                    <div className="notification">{notification}</div>
                )}
                <div className="language-swtich">
                    <button onClick={() => changeLanguage(language === "English" ? "Hindi": "English")}>{language === "English" ? "भाषा हिंदी में बदलें": "Continue in English"}</button>
                </div>
                <div className="header">
                    <h1>{language === "English" ? "Pocket Doctor": "पॉकेट डॉक्टर"}</h1>
                </div>
                
                <input type="text" id="age" name="age" value={age} pattern="[0-9]{3}" onChange={(e) => setAge(e.target.value)} placeholder={language === "English" ? "Enter Your age:": "अपनी आयु दर्ज करें:"}/>
                <button
                    id="male"
                    className={`gender-btn ${isMale === null ? "" : isMale ? "selected" : ""}`}
                    onClick={genderClick}
                    value="male"
                >
                    <img src={male} width={60} alt="Male" />
                    <span>{language === "English" ? "Male" : "पुरुष"}</span>
                </button>

                <button
                    id="female"
                    className={`gender-btn ${isMale === null ? "" : !isMale ? "selected" : ""}`}
                    onClick={genderClick}
                    value="female"
                >
                <img src={female} width={60} alt="Female" />
                <span>{language === "English" ? "Female" : "महिला"}</span>
                </button>
                <button className="submit-btn" disabled={!age || isMale === null} onClick={handleSubmit}>
                    {language === "English" ? "Submit" : "सबमिट करें"}
                </button>
            </div>
        )
    }

    const changeAge = (A) => {
        setAge(A);
    }

    const changeGender = (G) => {
        if (G === "male") {
            setIsMale(true)
        } else {
            setIsMale(false)
        }
    }

    return (
        <PatientContext.Provider value={{age,isMale, changeAge, changeGender}}>
            {children}
        </PatientContext.Provider>
    )
}