"use client"

import { useState } from 'react';

const TestGenerate = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string | null>(null);

  const handleGenerate = async () => {
    try {
      const res = await fetch('/api/generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResponse(data.text);
    } catch (error) {
      console.error(error);
      setResponse('An error occurred while generating content.');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
      />
      <button onClick={handleGenerate}>Generate Content</button>
      {response && <p>Response: {response}</p>}
    </div>
  );
};

export default TestGenerate;
