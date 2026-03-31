import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, MessageCircle, Sparkles, X } from 'lucide-react';
import { formatCurrency, useApp } from '../AppContext';
import { ALL_FEATURE_KEYS } from '../types';

const COPY = {
    tryNow: 'D\u00f9ng th\u1eed ngay',
    priceBadge: 'B\u1ea3ng gi\u00e1 d\u1ecbch v\u1ee5',
    title: 'Ch\u1ecdn g\u00f3i ph\u00f9 h\u1ee3p v\u1edbi quy m\u00f4 v\u1eadn h\u00e0nh c\u1ee7a b\u1ea1n',
    description: 'M\u1ecdi g\u00f3i \u0111\u1ec1u l\u1ea5y tr\u1ef1c ti\u1ebfp t\u1eeb c\u1ea5u h\u00ecnh h\u1ec7 th\u1ed1ng. B\u1ea1n c\u00f3 th\u1ec3 n\u00e2ng c\u1ea5p ho\u1eb7c thay \u0111\u1ed5i g\u00f3i khi nhu c\u1ea7u qu\u1ea3n l\u00fd t\u0103ng l\u00ean.',
    featured: 'Ph\u1ed5 bi\u1ebfn',
    free: 'Mi\u1ec5n ph\u00ed',
    perMonth: '/ th\u00e1ng',
    buildings: 'T\u00f2a nh\u00e0',
    rooms: 'Ph\u00f2ng',
    featureDetails: 'T\u00ednh n\u0103ng chi ti\u1ebft',
    choosePlan: 'Ch\u1ecdn g\u00f3i n\u00e0y',
    customTitle: 'B\u1ea1n c\u1ea7n c\u1ea5u h\u00ecnh ri\u00eang cho m\u00f4 h\u00ecnh l\u1edbn h\u01a1n?',
    customDescription: 'H\u1ec7 th\u1ed1ng v\u1eabn h\u1ed7 tr\u1ee3 ph\u01b0\u01a1ng \u00e1n t\u00f9y ch\u1ec9nh khi c\u1ea7n m\u1edf r\u1ed9ng theo chu\u1ed7i nh\u00e0 tr\u1ecd, k\u00fd t\u00fac x\u00e1 ho\u1eb7c m\u00f4 h\u00ecnh v\u1eadn h\u00e0nh nhi\u1ec1u ph\u00e2n quy\u1ec1n h\u01a1n.',
    contactAdmin: 'Li\u00ean h\u1ec7 Admin',
    copyright: '\u00a9 2024 Smart Rental Manager. All rights reserved.',
} as const;

export default function Pricing() {
    const navigate = useNavigate();
    const { pricingTiers } = useApp();
    const featuredTierId = pricingTiers[1]?.id || pricingTiers[0]?.id || '';

    return (
        <div className="min-h-screen bg-[#07111f] text-slate-100">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute left-[-8%] top-[-10%] h-[28rem] w-[28rem] rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="absolute right-[-10%] top-[8%] h-[26rem] w-[26rem] rounded-full bg-blue-500/12 blur-3xl" />
                <div className="absolute bottom-[-16%] left-[18%] h-[24rem] w-[24rem] rounded-full bg-indigo-500/12 blur-3xl" />
            </div>

            <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-200 transition hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Smart Rental
                    </Link>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/login?role=HOST')}
                            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            {COPY.tryNow}
                        </button>
                    </div>
                </div>
            </header>

            <main className="relative mx-auto max-w-7xl px-5 pb-20 pt-14 lg:px-8 lg:pb-24 lg:pt-20">
                <section className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-10 shadow-[0_30px_120px_rgba(2,6,23,0.45)] backdrop-blur-sm lg:px-10 lg:py-12">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200">
                            <Sparkles className="h-4 w-4" />
                            {COPY.priceBadge}
                        </div>
                        <h1 className="mt-6 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                            {COPY.title}
                        </h1>
                        <p className="mt-5 text-base leading-7 text-slate-300 sm:text-lg">
                            {COPY.description}
                        </p>
                    </div>
                </section>

                <section className="mt-10 grid gap-6 xl:grid-cols-3">
                    {pricingTiers.map((tier) => {
                        const isFeatured = tier.id === featuredTierId;

                        return (
                            <article
                                key={tier.id}
                                className={`relative flex h-full flex-col overflow-hidden rounded-[2rem] border p-6 shadow-[0_24px_80px_rgba(2,6,23,0.28)] transition duration-300 ${isFeatured
                                    ? 'border-blue-400/40 bg-gradient-to-br from-blue-600 to-indigo-700 text-white'
                                    : 'border-white/10 bg-slate-950/70 text-slate-100'
                                    }`}
                            >
                                {isFeatured && (
                                    <div className="absolute right-5 top-5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                                        {COPY.featured}
                                    </div>
                                )}

                                <div className="border-b border-white/10 pb-6">
                                    <div className={`text-sm font-semibold ${isFeatured ? 'text-blue-100' : 'text-slate-400'}`}>
                                        {tier.name}
                                    </div>
                                    <div className="mt-4 flex items-end gap-2">
                                        {tier.price === 0 ? (
                                            <span className="text-4xl font-black tracking-tight">{COPY.free}</span>
                                        ) : (
                                            <>
                                                <span className="text-4xl font-black tracking-tight">{formatCurrency(tier.price)}</span>
                                                <span className={`pb-1 text-sm ${isFeatured ? 'text-blue-100' : 'text-slate-400'}`}>{COPY.perMonth}</span>
                                            </>
                                        )}
                                    </div>
                                    <div className={`mt-4 grid grid-cols-2 gap-3 text-sm ${isFeatured ? 'text-blue-50' : 'text-slate-300'}`}>
                                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                            <div className="text-xs uppercase tracking-[0.18em] text-slate-300/80">{COPY.buildings}</div>
                                            <div className="mt-2 text-xl font-bold">{tier.maxBuildings}</div>
                                        </div>
                                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                            <div className="text-xs uppercase tracking-[0.18em] text-slate-300/80">{COPY.rooms}</div>
                                            <div className="mt-2 text-xl font-bold">{tier.maxRooms}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex-1 space-y-3">
                                    <div className={`text-xs font-bold uppercase tracking-[0.2em] ${isFeatured ? 'text-blue-100' : 'text-slate-400'}`}>
                                        {COPY.featureDetails}
                                    </div>
                                    {ALL_FEATURE_KEYS.map(({ key, label }) => {
                                        const hasFeature = tier.featureFlags?.[key] ?? false;
                                        return (
                                            <div
                                                key={key}
                                                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${hasFeature
                                                    ? isFeatured
                                                        ? 'border-white/10 bg-white/10 text-white'
                                                        : 'border-white/10 bg-white/5 text-slate-100'
                                                    : 'border-white/10 bg-transparent text-slate-500'
                                                    }`}
                                            >
                                                <div className={`flex h-7 w-7 items-center justify-center rounded-full ${hasFeature
                                                    ? isFeatured ? 'bg-white/15' : 'bg-blue-500/15 text-blue-300'
                                                    : 'bg-slate-800 text-slate-500'
                                                    }`}>
                                                    {hasFeature ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                                </div>
                                                <span className={hasFeature ? '' : 'line-through decoration-slate-700'}>{label}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => navigate('/login?role=HOST')}
                                    className={`mt-6 inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-bold transition ${isFeatured
                                        ? 'bg-white text-blue-700 hover:bg-blue-50'
                                        : 'bg-blue-600 text-white hover:bg-blue-500'
                                        }`}
                                >
                                    {COPY.choosePlan}
                                </button>
                            </article>
                        );
                    })}
                </section>

                <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.28)] backdrop-blur-sm lg:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-2xl">
                            <h2 className="text-2xl font-bold text-white">{COPY.customTitle}</h2>
                            <p className="mt-3 text-base leading-7 text-slate-300">
                                {COPY.customDescription}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                        >
                            <MessageCircle className="h-4 w-4" />
                            {COPY.contactAdmin}
                        </button>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 py-10 text-center text-sm text-slate-400">
                {COPY.copyright}
            </footer>
        </div>
    );
}
