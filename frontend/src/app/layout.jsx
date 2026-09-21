import './globals.css';

export const metadata = {
  title: 'Darukaa.Earth | AI Biodiversity Intelligence System',
  description: 'AI-powered Environmental Scientist for multi-variable ecological reasoning and evidence-backed land restoration.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen font-sans flex flex-col">
        {children}
      </body>
    </html>
  );
}
