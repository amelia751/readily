"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoadingSpinner } from '@/components/ui/spinner';
import { FaPaperPlane } from "react-icons/fa";

interface Roadmap {
  mapName: string;
  keyAreas: KeyArea[];
}

interface KeyArea {
  areaID: string;
  chapters: Chapter[];
}

interface Chapter {
  chapterID: string;
  chapterObjective: string;
}

interface Message {
  type: 'bot' | 'user' | 'options' | 'input' | 'questionnaire' | 'prefilledQuestionnaire' | 'additionalInput';
  text?: string;
  questionIndex?: number;
}

const QuestionnaireComponent: React.FC = () => {
  const { mapID } = useParams();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [option, setOption] = useState<'describe' | 'questionnaire' | null>(null);
  const [description, setDescription] = useState('');
  const [objectives, setObjectives] = useState<string[]>([]);
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [additionalQuestions, setAdditionalQuestions] = useState<string[]>([]);
  const [additionalAnswers, setAdditionalAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [round, setRound] = useState(1);
  const [showTextarea, setShowTextarea] = useState(true);
  const [showAdditionalTextareas, setShowAdditionalTextareas] = useState(true);
  const [finalResultsRendered, setFinalResultsRendered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await fetch(`/api/roadmaps/${mapID}`);
        const data = await res.json();
        if (res.ok) {
          setRoadmap(data);
          setObjectives(data.keyAreas.flatMap((area: KeyArea) => area.chapters.flatMap((chapter: Chapter) => chapter.chapterObjective)));
          setMessages([
            { type: 'bot', text: `Hello, my name is Gemini! I'm happy to assist you on this roadmap ${data.mapName}.` },
            { type: 'bot', text: "To better assess you, let's do a questionnaire." },
            { type: 'options' }
          ]);
        } else {
          console.error('Error fetching roadmap:', data.message);
        }
      } catch (error) {
        console.error('Error fetching roadmap:', error);
      }
    };

    fetchRoadmap();
  }, [mapID]);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleOptionSelect = (selectedOption: 'describe' | 'questionnaire') => {
    if (option !== null) return;

    setOption(selectedOption);
    addMessage({ type: 'user', text: selectedOption === 'describe' ? 'Describe Symptoms' : 'Choose a Questionnaire' });

    if (selectedOption === 'describe') {
      addMessage({ type: 'bot', text: 'Please describe your symptoms.' });
      setShowTextarea(true);
      addMessage({ type: 'input' });
    } else {
      addMessage({ type: 'bot', text: 'Please evaluate the following statements on a scale from 1 to 5, with 5 indicating complete capability and 1 indicating complete incapability.' });
      addMessage({ type: 'questionnaire' });
    }
  };

  const handleChooseAgain = () => {
    setOption(null);
    setMessages((prevMessages) => prevMessages.slice(0, 3));
    setDescription('');
    setScores({});
    setAdditionalQuestions([]);
    setAdditionalAnswers([]);
    setRound(1);
    setShowTextarea(true);
    setShowAdditionalTextareas(true);
    setFinalResultsRendered(false);
  };

  const handleSymptomSubmit = async () => {
    setLoading(true);
    setShowTextarea(false);

    try {
      const res = await fetch('/api/generateScores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, objectives })
      });
      const data = await res.json();
      if (res.ok) {
        setLoading(false);
        addMessage({ type: 'user', text: description });

        if (data.questions && data.questions.length > 0 && round < 3) {
          setAdditionalQuestions(data.questions);
          setAdditionalAnswers((prevAnswers) => {
            const newAnswers = [...prevAnswers];
            for (let i = prevAnswers.length; i < data.questions.length; i++) {
              newAnswers.push('');
            }
            return newAnswers;
          });
          setRound(data.round || 1);
          setShowAdditionalTextareas(true);
          addMessage({ type: 'bot', text: 'I need more information to generate scores. Please answer the following questions:' });
          data.questions.forEach((question: string, index: number) => {
            addMessage({ type: 'bot', text: question });
            addMessage({ type: 'additionalInput', questionIndex: index });
          });
        } else {
          setScores(data.scores);
          addMessage({ type: 'bot', text: 'Here is my assessment of your situation. Please review and adjust the scores if needed.' });
          addMessage({ type: 'prefilledQuestionnaire' });
          setFinalResultsRendered(true);
        }
      } else {
        setLoading(false);
        console.error('Error generating scores:', data.message);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error generating scores:', error);
    }
  };

  const submitScores = async () => {
    setLoading(true);
    try {
      const chapterUpdates = roadmap!.keyAreas.flatMap((area: KeyArea) =>
        area.chapters.map(async (chapter: Chapter) => {
          const score = scores[chapter.chapterObjective];
          if (score !== undefined) {
            const res = await fetch(`/api/chapters/${mapID}/${area.areaID}/${chapter.chapterID}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ chapterScore: score })
            });
            return res.json();
          }
        })
      );

      await Promise.all(chapterUpdates);

      setLoading(false);
      addMessage({ type: 'bot', text: 'Your scores have been successfully updated.' });
    } catch (error) {
      setLoading(false);
      console.error('Error updating scores:', error);
      addMessage({ type: 'bot', text: 'There was an error updating your scores. Please try again.' });
    }
  };

  const handleQuestionnaireSubmit = async () => {
    await submitScores();
    const scoresMessage = objectives.map((objective) => `${objective}: ${scores[objective] || 0}`).join('\n');
    addMessage({ type: 'bot', text: `Here are your self-assessment scores:\n\n${scoresMessage}` });
    setFinalResultsRendered(true);
  };

  const handleFollowUpSubmit = async () => {
    setLoading(true);
    setShowAdditionalTextareas(false);

    try {
      const res = await fetch('/api/generateScores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, objectives, followUpAnswers: additionalAnswers, round })
      });
      const data = await res.json();
      if (res.ok) {
        setLoading(false);
        additionalAnswers.forEach((answer, index) => {
          addMessage({ type: 'user', text: answer });
        });

        if (data.questions && data.questions.length > 0 && round < 3) {
          setAdditionalQuestions(data.questions);
          setAdditionalAnswers((prevAnswers) => {
            const newAnswers = [...prevAnswers];
            for (let i = prevAnswers.length; i < data.questions.length; i++) {
              newAnswers.push('');
            }
            return newAnswers;
          });
          setRound(round + 1);
          setShowAdditionalTextareas(true);
          addMessage({ type: 'bot', text: 'I need more information to generate scores. Please answer the following questions:' });
          data.questions.forEach((question: string, index: number) => {
            addMessage({ type: 'bot', text: question });
            addMessage({ type: 'additionalInput', questionIndex: index });
          });
        } else {
          setScores(data.scores);
          addMessage({ type: 'bot', text: 'Here is my assessment of your situation. Please review and adjust the scores if needed.' });
          addMessage({ type: 'prefilledQuestionnaire' });
          setFinalResultsRendered(true);
        }
      } else {
        setLoading(false);
        console.error('Error generating scores:', data.message);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error generating scores:', error);
    }
  };

  const handleFollowUpAnswerChange = (index: number, value: string) => {
    setAdditionalAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[index] = value;
      return newAnswers;
    });
  };

  const handleStartTherapy = () => {
    router.push(`/therapy/${mapID}`);
  };

  const renderChat = () => {
    return messages.map((message, index) => {
      if (message.type === 'bot') {
        return <div key={index} className="border-2 border-[#FE9900] bg-white text-black font-light p-4 rounded-xl mb-2 self-start max-w-md shadow-md whitespace-pre-wrap">{message.text}</div>;
      } else if (message.type === 'user') {
        return <div key={index} className="bg-gradient-to-r from-[#FF7A01] to-[#FE9900] text-white font-light p-4 rounded-xl mb-2 self-end max-w-md shadow-md">{message.text}</div>;
      } else if (message.type === 'options') {
        return (
          <div key={index} className="flex flex-col justify-center space-x-2 items-center mb-4">
            <div className='flex justify-center items-center mb-4 space-x-2 '>
              <Card onClick={() => handleOptionSelect('describe')} className={`cursor-pointer transition-shadow pt-4 font-light ${option === null ? 'bg-white text-black border-2 border-[#FE9900] hover:shadow-lg hover:bg-gradient-to-r hover:from-[#FF7A01] hover:to-[#FE9900] hover:text-white' : 'bg-[#FE9900] text-orange-200'}`}>
                <CardContent className="text-center">
                  Describe Your Symptoms
                </CardContent>
              </Card>
              <Card onClick={() => handleOptionSelect('questionnaire')} className={`cursor-pointer transition-shadow pt-4 font-light ${option === null ? 'bg-white text-black border-2 border-[#FE9900] hover:shadow-lg hover:bg-gradient-to-r hover:from-[#FF7A01] hover:to-[#FE9900] hover:text-white' : 'bg-[#FE9900] text-orange-200'}`}>
                <CardContent className="text-center">
                  Choose a Questionnaire
                </CardContent>
              </Card>
            </div>
            {option && (
              <Button onClick={handleChooseAgain} className="bg-gradient-to-r from-[#FF7A01] to-[#FE9900] hover:from-black hover:to-black hover:text-[#FE9900]">Choose Again</Button>
            )}
          </div>
        );
      } else if (message.type === 'input') {
        return showTextarea ? (
          <div key={index} className="flex items-center justify-center p-6 space-x-4 relative">
            <Textarea
              className="mb-4 w-full border-2 border-[#FE9900] bg-white text-black"
              placeholder="Describe your symptoms..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
            <Button onClick={handleSymptomSubmit} className="rounded-full h-12 bg-gradient-to-r from-[#FF7A01] to-[#FE9900] hover:from-black hover:to-black hover:text-[#FE9900]" disabled={loading}>
              <FaPaperPlane />
            </Button>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <LoadingSpinner />
              </div>
            )}
          </div>
        ) : null;
      } else if (message.type === 'questionnaire' || message.type === 'prefilledQuestionnaire') {
        return (
          <div key={index} className="flex flex-col items-center justify-center p-6 border-2 border-[#FE9900] bg-white text-black rounded-3xl shadow-md relative">
            {objectives.map((objective, i) => (
              <div key={i} className="mb-4 w-full">
                <p className="text-black font-light">{objective}</p>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Button
                      key={value}
                      className={`mx-1 text-base md:text-lg ${scores[objective] === value ? 'bg-gradient-to-r from-[#FF7A01] to-[#FE9900]' : 'border-2 border-[#FE9900] bg-white text-black'} hover:bg-black hover:text-[#FE9900] transition-colors`}
                      onClick={() => setScores({ ...scores, [objective]: value })}
                      disabled={loading}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
            <Button onClick={handleQuestionnaireSubmit} className="h-12 w-30 space-x-2 rounded-full bg-gradient-to-r from-[#FF7A01] to-[#FE9900] hover:from-black hover:to-black hover:text-[#FE9900]" disabled={loading}>
              <p> Submit </p> <FaPaperPlane />
            </Button>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center text-[#FE9900] bg-opacity-50">
                <LoadingSpinner />
              </div>
            )}
          </div>
        );
      } else if (message.type === 'additionalInput') {
        return showAdditionalTextareas ? (
          <div key={index} className="flex flex-col items-center justify-center p-6 bg-white text-black relative">
            <Textarea
              className="w-full bg-white text-black border-2 border-[#FE9900]"
              placeholder="Answer the follow-up question..."
              value={additionalAnswers[message.questionIndex!] || ''}
              onChange={(e) => handleFollowUpAnswerChange(message.questionIndex!, e.target.value)}
              disabled={loading}
            />
          </div>
        ) : null;
      }
      return null;
    });
  };

  return (
    <ScrollArea className="h-screen p-4 border-l-2 border-dashed border-[#FEAC1C]">
      <div className="flex flex-col items-center justify-center p-6 bg-white text-black min-h-screen text-sm md:text-base">
        <div className="flex flex-col space-y-4 w-full max-w-3xl">
          {renderChat()}
          {additionalQuestions.length > 0 && !finalResultsRendered && (
            <div className="flex items-center justify-center relative">
              <Button onClick={handleFollowUpSubmit} className="rounded-full h-12 w-30 space-x-2 bg-gradient-to-r from-[#FF7A01] to-[#FE9900] hover:from-black hover:to-black hover:text-[#FE9900]" disabled={loading}>
                <p> Submit </p> <FaPaperPlane />
              </Button>
            </div>
          )}
          {finalResultsRendered && (
            <div className="flex items-center justify-center p-6 relative">
              <Button onClick={handleStartTherapy} className="w-2/3 space-x-3 rounded-3xl h-30 flex bg-gradient-to-r from-[#FF7A01] to-[#FE9900] hover:from-black hover:to-black hover:text-[#FE9900]">
                <img src='/happy.png' alt='happy' className='h-24' /> <p>Start Therapy</p>
              </Button>
            </div>
          )}
          {loading && (
            <div className="flex items-center justify-center p-6">
              <LoadingSpinner />
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default QuestionnaireComponent;
