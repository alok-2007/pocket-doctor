import { useContext } from "react";
import { LanguageContext } from "./LanguageContext";
import { PatientContext } from "./PatientContext";
import { ProblemContext } from "./ProblemContext";
import { useState, useEffect } from "react";
import "./Home.css";
import ReactMarkdown from 'react-markdown';

export const Home = () => {
    const { language } = useContext(LanguageContext);
    const { age, isMale, mediHistory, pastAudioURL } = useContext(PatientContext);
    const { problemAudioURL, problem, images } = useContext(ProblemContext);
    const [cureRespons, setCureResponse] = useState("");
    const [gotRes, setGotRes] = useState(false);

    useEffect(() => {
        cure()
    }, []);
    
    const cure = async () => {
        setGotRes(false)
    try {
        const formData = new FormData();
        formData.append("age", age);
        formData.append("isMale", isMale);
        formData.append("problem", problem);

        if (mediHistory) formData.append("mediHistory", mediHistory);
        if (pastAudioURL) formData.append("pastAudioURL", pastAudioURL);
        if (problemAudioURL) formData.append("problemAudioURL", problemAudioURL);
        if (images) formData.append("images", images);

        const res = await fetch("http://localhost:5000/get_cure", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            setGotRes(true)
            throw new Error("Network response was not ok");
        } 

        const data = await res.json();
        setGotRes(true)
        setCureResponse(data)
        return
    } catch (err) {
        setGotRes(true)
        console.error("Error fetching cure:", err);
        return null;
    }
};


    return (
        <div className="home-container">
            <div className="home-header">
                <h1>{language === "English" ? "Pocket Doctor": "पॉकेट डॉक्टर"}</h1>
            </div>
            <div className="disclaimer">
                <p>{language === "English" ? "⚠️ Disclaimer" : "⚠️ अस्वीकरण"}</p>
                <p>{language === "English" 
                    ? "This service gives only quick guidance for minor health issues and first aid. It is not for emergencies—please contact a doctor or hospital if urgent."
                    : "यह सेवा केवल मामूली स्वास्थ्य समस्याओं और प्राथमिक उपचार के लिए त्वरित मार्गदर्शन प्रदान करती है। यह आपातकालीन स्थिति के लिए नहीं है - यदि आवश्यक हो तो कृपया डॉक्टर या अस्पताल से संपर्क करें।"}</p>   
            </div>
            <div className="home-patient-info">
                <p><strong>{language === "English" ? "Gender:" : "लिंग:"}</strong> {isMale === null ? "-" : isMale ? (language === "English" ? "Male" : "पुरुष") : (language === "English" ? "Female" : "महिला")}</p>
                <p><strong>{language === "English" ? "Age:" : "आयु:"}</strong> {age || "-"}</p>
            </div>
            
            <div className="response-container">
                <h2 className="response-container-header">{language === "English" ? "Advice" : "सलाह"}</h2>
                {!gotRes && (
                    <div className="spinner"></div>
                )}
                {cureRespons && (
                    <div className="Markdown">
                        <ReactMarkdown>{cureRespons}</ReactMarkdown>
                    </div>
                )}
            </div>

        </div>
    );
};