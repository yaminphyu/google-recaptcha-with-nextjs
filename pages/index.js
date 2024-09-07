import React, { useRef, useState } from "react";
import Head from "next/head";
import ReCAPTCHA from 'react-google-recaptcha'

export default function Home() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);

  const recaptchaRef = useRef(null);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "name") {
      setName(value);
    }
  }

  const handleCaptchaKeyChange = (value) => {
    setCaptchaValue(value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          name, 
          email, 
          captchaValue 
        }),
      });

      if (response.ok) {
        window.location.href = '/profile';
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.log('Error submitting form :: ', error);
      alert("Something went wrong, please try again later...");
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Head>
        <title>Google ReCaptcha</title>
        <link rel="icon" href="/captcha.png" />
      </Head>
      <div className="wrapper">
        <h2>Register here...</h2>
        <form onSubmit={(e) => handleSubmit(e)} className="w-full">
          <input 
            type="text" 
            placeholder="Enter your name"  
            onChange={handleChange}
            value={name}
            name="name"
            required
          />
          <input 
            type="email" 
            placeholder="Enter your email" 
            onChange={handleChange}
            value={email}
            name="email"
            required
          />
          <button 
            type="submit"
          >
            Register
          </button>

          <div className="recaptcha">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              onChange={(value) => handleCaptchaKeyChange(value)}
              className="w-full sm:max-w-xs"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
