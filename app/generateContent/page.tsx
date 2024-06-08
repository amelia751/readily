// "use client";

// import { useState } from 'react';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';

// const TestGenerate = () => {
//   const [prompt, setPrompt] = useState<string>('');
//   const [response, setResponse] = useState<string | null>(null);

//   const handleGenerate = async () => {
//     try {
//       const res = await fetch('/api/generateContent', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ prompt }),
//       });
//       const data = await res.json();
//       setResponse(data.text);
//     } catch (error) {
//       console.error(error);
//       setResponse('An error occurred while generating content.');
//     }
//   };

//   return (
//     <div className="p-4">
//       <input
//         type="text"
//         value={prompt}
//         onChange={(e) => setPrompt(e.target.value)}
//         placeholder="Enter your prompt"
//         className="mb-4 p-2 border border-gray-300 rounded"
//       />
//       <button
//         onClick={handleGenerate}
//         className="bg-blue-500 text-white p-2 rounded"
//       >
//         Generate Content
//       </button>
//       {response && (
//         <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-md prose">
//           <ReactMarkdown remarkPlugins={[remarkGfm]}>
//             {response}
//           </ReactMarkdown>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TestGenerate;


// "use client"

// import { useState } from 'react';

// const TestGenerate = () => {
//   const [prompt, setPrompt] = useState<string>('');
//   const [response, setResponse] = useState<string | null>(null);

//   const handleGenerate = async () => {
//     try {
//       const res = await fetch('/api/generateContent', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ prompt }),
//       });
//       const data = await res.json();
//       setResponse(data.text);
//     } catch (error) {
//       console.error(error);
//       setResponse('An error occurred while generating content.');
//     }
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={prompt}
//         onChange={(e) => setPrompt(e.target.value)}
//         placeholder="Enter your prompt"
//       />
//       <button onClick={handleGenerate}>Generate Content</button>
//       {response && <p>Response: {response}</p>}
//     </div>
//   );
// };

// export default TestGenerate;



// "use client";

// import { useState } from 'react';
// import { Button} from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// const TestGenerate = () => {
//   const [prompt, setPrompt] = useState<string>('');
//   const [module, setModule] = useState<any | null>(null);
//   const [error, setError] = useState<string>('');

//   const handleGenerate = async () => {
//     try {
//       const res = await fetch('/api/generateContent', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ prompt }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setModule(data);
//       } else {
//         setError(data.error || 'An error occurred while generating content.');
//       }
//     } catch (error) {
//       console.error(error);
//       setError('An error occurred while generating content.');
//     }
//   };

//   return (
//     <div>
//       <Input
//         type="text"
//         value={prompt}
//         onChange={(e) => setPrompt(e.target.value)}
//         placeholder="Enter your prompt"
//       />
//       <Button onClick={handleGenerate}>Generate Content</Button>
//       {error && <p className="text-red-600">{error}</p>}
//       {module && (
//         <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold">{module.moduleName}</h2>
//           <p><strong>Type:</strong> {module.moduleType}</p>
//           <p><strong>Objective:</strong> {module.moduleObjective}</p>
//           <p><strong>Content:</strong> {module.moduleContent}</p>
//           <p><strong>Resources:</strong> {module.moduleResources}</p>
//           <p><strong>Criteria:</strong> {module.moduleCriteria}</p>
//           <p><strong>Score:</strong> {module.moduleScore}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TestGenerate;



"use client";

import { useState } from 'react';
import { Button} from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; 

const TestGenerate = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [module, setModule] = useState<any | null>(null);
  const [error, setError] = useState<string>('');

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
      if (res.ok) {
        setModule(data);
      } else {
        setError(data.error || 'An error occurred while generating content.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while generating content.');
    }
  };

  return (
    <div className="p-4">
      <Input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
        className="mb-4"
      />
      <Button onClick={handleGenerate}>Generate Content</Button>
      {error && <p className="text-red-600 mt-4">{error}</p>}
      {module && (
        <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-md whitespace-pre-wrap">
          <h2 className="text-xl font-semibold">{module.moduleName}</h2>
          <p><strong>Type:</strong> {module.moduleType}</p>
          <p><strong>Objective:</strong> {module.moduleObjective}</p>
          <p><strong>Content:</strong> 
            <ReactMarkdown className="whitespace-normal prose prose-sm sm:prose" remarkPlugins={[remarkGfm]}>
              {module.moduleContent}
            </ReactMarkdown>
          </p>
          <p><strong>Resources:</strong> 
            <ReactMarkdown className="whitespace-normal prose prose-sm sm:prose lg:prose-base" remarkPlugins={[remarkGfm]}>
              {module.moduleResources}
            </ReactMarkdown>
          </p>
          <p><strong>Criteria:</strong> 
            <ReactMarkdown className="whitespace-normal prose prose-sm sm:prose lg:prose-base" remarkPlugins={[remarkGfm]}>
              {module.moduleCriteria}
            </ReactMarkdown>
          </p>
          <p><strong>Score:</strong> {module.moduleScore}</p>
        </div>
      )}
    </div>
  );
};

export default TestGenerate;
