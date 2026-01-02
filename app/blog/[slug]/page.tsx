import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ALL_ARTICLES } from '../data';
import SignalBackground from '@/components/SignalBackground';

export async function generateStaticParams() {
    return ALL_ARTICLES.map((article) => ({
        slug: article.slug,
    }));
}

// NextJS 16 Params type structure handling
type Props = {
    params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: Props) {
    // Await params in Next.js 15/16+
    const { slug } = await params;

    const article = ALL_ARTICLES.find((a) => a.slug === slug);

    if (!article) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#0c0c0c] text-[#e0e0e0] font-mono selection:bg-violet-500/30 selection:text-white relative overflow-x-hidden">
            {/* Very low intensity background for reading */}
            <SignalBackground intensity={0.2} />

            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] z-0"></div>

            <div className="relative z-10 flex flex-col min-h-screen">

                <div className="flex-grow w-full max-w-3xl mx-auto px-6 md:px-12 pt-40 pb-20">

                    {/* BACK LINK */}
                    <div className="mb-12">
                        <Link href="/blog" className="text-xs font-bold tracking-[0.2em] uppercase text-white/30 hover:text-violet-400 transition-colors duration-300 flex items-center gap-2">
                            <span>&larr;</span> Return to Intelligence
                        </Link>
                    </div>

                    {/* ARTICLE HEADER */}
                    <header className="mb-16 border-b border-white/10 pb-16">
                        <div className="flex items-center gap-4 mb-8 opacity-70">
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold tracking-[0.1em] text-violet-300 uppercase">
                                {article.category}
                            </span>
                            <span className="text-[10px] tracking-widest text-white/40 uppercase font-mono">
                                {article.date} &middot; {article.readTime}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-8 leading-tight">
                            {article.title}
                        </h1>

                        <p className="text-xl text-white/60 font-light leading-relaxed">
                            {article.summary}
                        </p>
                    </header>

                    {/* ARTICLE CONTENT */}
                    {/* Using a calm, readable typography class set */}
                    <article className="prose prose-invert prose-lg max-w-none 
                        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white 
                        prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6 prose-h3:text-indigo-200
                        prose-p:text-white/70 prose-p:font-light prose-p:leading-loose prose-p:tracking-wide
                        prose-strong:text-white prose-strong:font-medium
                        prose-blockquote:border-l-violet-500 prose-blockquote:bg-white/[0.02] prose-blockquote:py-2 prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:italic
                    ">
                        {/* 
                            In a real app, we'd use a Markdown renderer. 
                            For this data structure, we are injecting the HTML string directly.
                        */}
                        <div dangerouslySetInnerHTML={{ __html: article.content as string }} />
                    </article>

                    {/* FOOTER / SIGNATURE */}
                    <div className="mt-24 pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40 hover:opacity-100 transition-opacity duration-500">
                        <div className="text-xs font-bold tracking-[0.2em] uppercase text-white/50">
                            AdGrid Intelligence
                        </div>
                        <div className="flex gap-4">
                            <button className="text-xs font-bold tracking-[0.2em] uppercase text-white hover:text-violet-400 transition-colors">Share</button>
                            <button className="text-xs font-bold tracking-[0.2em] uppercase text-white hover:text-violet-400 transition-colors">Cite</button>
                        </div>
                    </div>

                </div>

                <footer className="w-full py-8 text-center text-white/10 text-[10px] uppercase tracking-widest">
                    &copy; 2025 AdGrid Intelligence.
                </footer>
            </div>
        </main>
    );
}
