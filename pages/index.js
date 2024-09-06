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
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center justify-center shadow-xl border-2 border-orange-100 w-1/4 h-auto px-10 py-16 rounded-md bg-slate-50">
        <h2 className="text-2xl font-bold font-mono mb-6">Register here...</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input 
            type="text" 
            placeholder="Enter your name" 
            className="border-2 border-orange-200 font-mono w-full mb-5 p-3 rounded-md" 
            onChange={handleChange}
            value={name}
            name="name"
            required
          />
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="border-2 border-orange-200 font-mono w-full mb-5 p-3 rounded-md" 
            onChange={handleChange}
            value={email}
            name="email"
            required
          />
          <button 
            type="submit"
            className="font-mono bg-orange-300 rounded-md p-2 w-full text-gray-700 mb-3"
          >Register</button>

          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onChange={(value) => handleCaptchaKeyChange(value)}
          />
        </form>
      </div>
    </div>
  );
}
