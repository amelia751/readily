import Head from 'next/head';
import Calendar from '@/components/Calendar';

function Home() {
  return (
    <div>
      <Head>
        <title>Calendar</title>
        <meta name="description" content="Calendar component using Next.js, TypeScript, and Tailwind CSS" />
      </Head>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold mb-8">My Calendar</h1>
        <Calendar />
      </main>
    </div>
  );
}

export default Home;
