import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ProxyGrid | On-Demand City Errand & Proxy Network (Team VQ)',
  description: 'Swiggy / Rapido style on-demand trusted human errand network in Warangal & Hanamkonda. TriCity AI Hackathon (Room B-4-216, Team TRI26420).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
