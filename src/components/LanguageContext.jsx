import { createContext, useEffect, useState} from "react";
import Cookies from "js-cookie";
import "./LanguageContext.css"

export const LanguageContext = createContext();

export const LanguageProvider = ({children}) => {
    const [language, setLanguage] = useState(null);

    useEffect(() => {
        const savedLang = Cookies.get("selectedLanguage");
        if (savedLang) setLanguage(savedLang);
    },[])

    if (!language) {
        const handleClick = (e) => {
            setLanguage(e.target.value)
            Cookies.set("selectedLanguage", e.target.value, {expires: 30, path:"/"});
        }
        return (
            <div className="select-language">
                <div className="header">
                    <h1>Pocket Doctor</h1>
                </div>
                
                <h2>Select Your Preferred Language</h2>
                <div className="language-buttons">
                    
                    <button className="lng-btn" onClick={handleClick} value="English">English</button>
                    <button className="lng-btn" onClick={handleClick} value="Hindi">हिन्दी</button>
                </div>
            </div>
        )
    }

    const changeLanguage = (lang) => {
        setLanguage(lang)
        Cookies.set("selectedLanguage", lang, {expires: 30, path:"/"});
    }
    return (
        <LanguageContext.Provider value={{language, changeLanguage}}>
            {children}
        </LanguageContext.Provider>
    )
}