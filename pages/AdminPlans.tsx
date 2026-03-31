import React, { useState } from 'react';
import { useApp, formatCurrency } from '../AppContext';
import { Building, Check, CreditCard, Edit, Plus, Puzzle, Save, Shield, Trash2, Users, X } from 'lucide-react';
import { AddOnFeature, ALL_FEATURE_KEYS, DEFAULT_FEATURE_FLAGS, FeatureFlags, PricingTier } from '../types';

const COPY = {
    pageTitle: 'C\u00e0i \u0111\u1eb7t b\u1ea3ng gi\u00e1',
    createPlan: 'T\u1ea1o g\u00f3i d\u1ecbch v\u1ee5',
    featured: 'PH\u1ed4 BI\u1ebeN',
    free: 'Mi\u1ec5n ph\u00ed',
    perMonth: '/th\u00e1ng',
    buildings: 'T\u00f2a nh\u00e0',
    rooms: 'Ph\u00f2ng',
    featureAccess: 'Ph\u00e2n quy\u1ec1n t\u00ednh n\u0103ng',
    activeHosts: 'Hosts \u0111ang d\u00f9ng',
    noHosts: 'Ch\u01b0a c\u00f3 host n\u00e0o',
    addons: 'Ti\u1ec7n \u00edch b\u1ed5 sung',
    addAddon: 'Th\u00eam ti\u1ec7n \u00edch',
    deleteAddonConfirm: 'X\u00f3a ti\u1ec7n \u00edch n\u00e0y?',
    noAddons: 'Ch\u01b0a c\u00f3 ti\u1ec7n \u00edch b\u1ed5 sung n\u00e0o.',
    editAddon: 'S\u1eeda ti\u1ec7n \u00edch',
    createAddon: 'Th\u00eam ti\u1ec7n \u00edch m\u1edbi',
    addonName: 'T\u00ean ti\u1ec7n \u00edch',
    addonDescription: 'M\u00f4 t\u1ea3',
    addonPrice: 'Gi\u00e1',
    noFeatureLinked: 'Kh\u00f4ng g\u1eafn t\u00ednh n\u0103ng',
    oneFeaturePerLine: 'M\u1ed7i d\u00f2ng l\u00e0 m\u1ed9t t\u00ednh n\u0103ng ph\u1ee5',
    cancel: 'H\u1ee7y',
    save: 'L\u01b0u',
    editPlan: 'S\u1eeda g\u00f3i',
    createPlanModal: 'T\u1ea1o g\u00f3i d\u1ecbch v\u1ee5 m\u1edbi',
    planName: 'T\u00ean g\u00f3i',
    monthlyPrice: 'Gi\u00e1 / th\u00e1ng',
    buildingCount: 'S\u1ed1 t\u00f2a nh\u00e0',
    roomCount: 'S\u1ed1 ph\u00f2ng',
    featureDescription: 'M\u00f4 t\u1ea3 t\u00ednh n\u0103ng',
    add: 'Th\u00eam',
    featureLabel: 'T\u00ednh n\u0103ng',
    saveChanges: 'L\u01b0u thay \u0111\u1ed5i',
    deletePlanConfirmPrefix: 'X\u00f3a g\u00f3i',
    enableLabel: 'K\u00edch ho\u1ea1t:',
} as const;

export default function AdminPlans() {
    const { pricingTiers, allUsers, addPricingTier, updatePricingTier, deletePricingTier, adminSettings, updateAdminSettings } = useApp();
    const hosts = allUsers.filter(user => user.role === 'HOST');
    const addons = adminSettings?.addons || [];
    const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
    const [editingTier, setEditingTier] = useState<Partial<PricingTier> | null>(null);
    const [addonForm, setAddonForm] = useState<Partial<AddOnFeature> | null>(null);

    const openCreate = () => {
        setEditingTier({ name: '', price: 0, maxBuildings: 1, maxRooms: 10, features: [''], featureFlags: { ...DEFAULT_FEATURE_FLAGS } });
        setModalMode('create');
    };

    const openEdit = (tier: PricingTier) => {
        setEditingTier({ ...tier, featureFlags: tier.featureFlags || { ...DEFAULT_FEATURE_FLAGS } });
        setModalMode('edit');
    };

    const updateFeature = (index: number, value: string) => {
        if (!editingTier) return;
        const features = [...(editingTier.features || [])];
        features[index] = value;
        setEditingTier({ ...editingTier, features });
    };

    const toggleFlag = (key: keyof FeatureFlags) => {
        if (!editingTier) return;
        const flags = editingTier.featureFlags || { ...DEFAULT_FEATURE_FLAGS };
        setEditingTier({ ...editingTier, featureFlags: { ...flags, [key]: !flags[key] } });
    };

    const saveTier = (event: React.FormEvent) => {
        event.preventDefault();
        if (!editingTier || !editingTier.name) return;
        const payload = { ...editingTier, features: (editingTier.features || []).map(item => item.trim()).filter(Boolean) };
        if (modalMode === 'edit' && editingTier.id) updatePricingTier(payload as PricingTier);
        if (modalMode === 'create') addPricingTier(payload as Omit<PricingTier, 'id'>);
        setModalMode(null);
    };

    const saveAddon = () => {
        if (!addonForm?.name) return;
        const next: AddOnFeature = {
            ...(addonForm as AddOnFeature),
            id: addonForm.id || `addon_${Date.now()}`,
            features: (addonForm.features || []).map(item => item.trim()).filter(Boolean),
        };
        const items = addonForm.id ? addons.map(item => item.id === addonForm.id ? next : item) : [...addons, next];
        updateAdminSettings({ ...adminSettings!, addons: items });
        setAddonForm(null);
    };

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <div className="flex items-center justify-between gap-4">
                <h1 className="flex items-center gap-2 text-2xl font-bold">
                    <CreditCard size={24} className="text-purple-500" />
                    {COPY.pageTitle}
                </h1>
                <button onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
                    <Plus size={16} />
                    {COPY.createPlan}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {pricingTiers.map((tier, index) => {
                    const subscribedHosts = hosts.filter(host => host.subscriptionPlanId === tier.id);
                    const flags = tier.featureFlags || DEFAULT_FEATURE_FLAGS;
                    return (
                        <div
                            key={tier.id}
                            className={`relative overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-slate-900 ${index === 1 ? 'border-blue-400 ring-2 ring-blue-400/20 dark:border-blue-600' : 'border-slate-200 dark:border-slate-800'}`}
                        >
                            {index === 1 && <div className="absolute right-0 top-0 rounded-bl-xl bg-blue-600 px-3 py-1 text-[10px] font-bold text-white">{COPY.featured}</div>}
                            <div className="absolute right-2 top-2 flex gap-1">
                                <button onClick={() => openEdit(tier)} className="rounded-lg bg-white/70 p-1.5 text-slate-500 hover:text-blue-500 dark:bg-slate-800/70"><Edit size={14} /></button>
                                <button
                                    onClick={() => window.confirm(`${COPY.deletePlanConfirmPrefix} "${tier.name}"?`) && deletePricingTier(tier.id)}
                                    className="rounded-lg bg-white/70 p-1.5 text-slate-500 hover:text-red-500 dark:bg-slate-800/70"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <div className={`p-6 ${index === 1 ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20' : ''}`}>
                                <h3 className="text-xl font-bold">{tier.name}</h3>
                                <div className="mt-2 flex items-baseline gap-1">
                                    <span className="text-3xl font-extrabold">{tier.price > 0 ? formatCurrency(tier.price) : COPY.free}</span>
                                    {tier.price > 0 && <span className="text-sm text-slate-500">{COPY.perMonth}</span>}
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-white/60 p-3 text-center dark:border-slate-700 dark:bg-slate-800/50">
                                    <div>
                                        <Building size={16} className="mx-auto mb-1 text-blue-500" />
                                        <div className="text-lg font-bold">{tier.maxBuildings}</div>
                                        <div className="text-[10px] uppercase text-slate-500">{COPY.buildings}</div>
                                    </div>
                                    <div>
                                        <Users size={16} className="mx-auto mb-1 text-green-500" />
                                        <div className="text-lg font-bold">{tier.maxRooms}</div>
                                        <div className="text-[10px] uppercase text-slate-500">{COPY.rooms}</div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        <Shield size={10} />
                                        {COPY.featureAccess}
                                    </div>
                                    <div className="grid grid-cols-2 gap-1">
                                        {ALL_FEATURE_KEYS.map(({ key, label }) => (
                                            <div key={key} className={`flex items-center gap-1 rounded px-2 py-1 text-[11px] ${flags[key] ? 'bg-green-50 text-green-600 dark:bg-green-900/10 dark:text-green-400' : 'bg-slate-50 text-slate-400 line-through dark:bg-slate-800/30 dark:text-slate-600'}`}>
                                                {flags[key] ? <Check size={10} className="shrink-0" /> : <X size={10} className="shrink-0" />}
                                                <span className="truncate">{label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <ul className="mt-4 space-y-2 text-sm">
                                    {tier.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <Check size={16} className="mt-0.5 shrink-0 text-green-500" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
                                <div className="mb-1 text-xs font-medium uppercase text-slate-500">{COPY.activeHosts} ({subscribedHosts.length})</div>
                                {subscribedHosts.length > 0 ? subscribedHosts.map(host => (
                                    <div key={host.id} className="mb-1 flex items-center gap-2 rounded-lg border border-slate-100 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-800">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-[9px] font-bold text-white">{host.avatar}</div>
                                        <span className="truncate">{host.name}</span>
                                    </div>
                                )) : <p className="text-sm italic text-slate-400">{COPY.noHosts}</p>}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
                    <h2 className="flex items-center gap-2 text-lg font-bold"><Puzzle size={20} className="text-amber-500" />{COPY.addons}</h2>
                    <button onClick={() => setAddonForm({ name: '', description: '', price: 0, features: [] })} className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700"><Plus size={14} />{COPY.addAddon}</button>
                </div>
                <div className="p-6">
                    {addons.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {addons.map(addon => (
                                <div key={addon.id} className="relative rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                                    <div className="absolute right-2 top-2 flex gap-1">
                                        <button onClick={() => setAddonForm({ ...addon })} className="p-1 text-slate-400 hover:text-blue-500"><Edit size={14} /></button>
                                        <button onClick={() => window.confirm(COPY.deleteAddonConfirm) && updateAdminSettings({ ...adminSettings!, addons: addons.filter(item => item.id !== addon.id) })} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                                    </div>
                                    <h4 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white"><Puzzle size={16} className="text-amber-500" />{addon.name}</h4>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{addon.description}</p>
                                    <p className="mt-2 text-lg font-bold text-amber-600 dark:text-amber-400">{formatCurrency(addon.price)}<span className="text-xs font-normal text-slate-400">{COPY.perMonth}</span></p>
                                    {addon.featureFlag && <p className="mt-1 text-[10px] text-blue-500">{COPY.enableLabel} {ALL_FEATURE_KEYS.find(item => item.key === addon.featureFlag)?.label || addon.featureFlag}</p>}
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-sm italic text-slate-400">{COPY.noAddons}</p>}
                </div>
            </div>

            {addonForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
                            <h3 className="text-lg font-bold">{addonForm.id ? COPY.editAddon : COPY.createAddon}</h3>
                            <button onClick={() => setAddonForm(null)} className="p-1 text-slate-400 hover:text-slate-600"><X size={20} /></button>
                        </div>
                        <div className="space-y-4 p-6">
                            <input className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-800" value={addonForm.name || ''} onChange={e => setAddonForm({ ...addonForm, name: e.target.value })} placeholder={COPY.addonName} />
                            <textarea rows={2} className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-800" value={addonForm.description || ''} onChange={e => setAddonForm({ ...addonForm, description: e.target.value })} placeholder={COPY.addonDescription} />
                            <input type="number" className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-800" value={addonForm.price || 0} onChange={e => setAddonForm({ ...addonForm, price: +e.target.value })} placeholder={COPY.addonPrice} />
                            <select className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-800" value={addonForm.featureFlag || ''} onChange={e => setAddonForm({ ...addonForm, featureFlag: (e.target.value || undefined) as any })}>
                                <option value="">{COPY.noFeatureLinked}</option>
                                {ALL_FEATURE_KEYS.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
                            </select>
                            <textarea rows={4} className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-800" value={(addonForm.features || []).join('\n')} onChange={e => setAddonForm({ ...addonForm, features: e.target.value.split('\n') })} placeholder={COPY.oneFeaturePerLine} />
                            <div className="flex gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                                <button type="button" onClick={() => setAddonForm(null)} className="flex-1 rounded-xl bg-slate-100 py-2.5 font-medium hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700">{COPY.cancel}</button>
                                <button type="button" onClick={saveAddon} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-600 py-2.5 font-medium text-white hover:bg-amber-700"><Save size={16} />{COPY.save}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {modalMode && editingTier && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/90 p-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
                            <h3 className="text-lg font-bold">{modalMode === 'edit' ? `${COPY.editPlan}: ${editingTier.name}` : COPY.createPlanModal}</h3>
                            <button onClick={() => setModalMode(null)} className="p-1 text-slate-400 hover:text-slate-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={saveTier} className="space-y-4 p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <input required className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800" value={editingTier.name || ''} onChange={e => setEditingTier({ ...editingTier, name: e.target.value })} placeholder={COPY.planName} />
                                <input type="number" required className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800" value={editingTier.price || 0} onChange={e => setEditingTier({ ...editingTier, price: +e.target.value })} placeholder={COPY.monthlyPrice} />
                                <input type="number" min={1} required className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800" value={editingTier.maxBuildings || 1} onChange={e => setEditingTier({ ...editingTier, maxBuildings: +e.target.value })} placeholder={COPY.buildingCount} />
                                <input type="number" min={1} required className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800" value={editingTier.maxRooms || 10} onChange={e => setEditingTier({ ...editingTier, maxRooms: +e.target.value })} placeholder={COPY.roomCount} />
                            </div>
                            <div>
                                <label className="mb-2 flex items-center gap-2 text-sm font-medium"><Shield size={16} className="text-purple-500" />{COPY.featureAccess}</label>
                                <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                                    {ALL_FEATURE_KEYS.map(({ key, label }) => (
                                        <label key={key} className="flex items-center gap-2 text-sm">
                                            <input type="checkbox" checked={editingTier.featureFlags?.[key] ?? false} onChange={() => toggleFlag(key)} className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500" />
                                            <span>{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="mb-2 flex items-center justify-between text-sm font-medium">
                                    {COPY.featureDescription}
                                    <button type="button" onClick={() => setEditingTier({ ...editingTier, features: [...(editingTier.features || []), ''] })} className="flex items-center gap-1 text-xs text-purple-600 hover:underline"><Plus size={12} />{COPY.add}</button>
                                </div>
                                <div className="space-y-2">
                                    {(editingTier.features || []).map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input className="flex-1 rounded-xl border border-slate-300 bg-slate-50 p-2 text-sm outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800" value={feature} onChange={e => updateFeature(index, e.target.value)} placeholder={`${COPY.featureLabel} ${index + 1}`} />
                                            <button type="button" onClick={() => setEditingTier({ ...editingTier, features: (editingTier.features || []).filter((_, i) => i !== index) })} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                                <button type="button" onClick={() => setModalMode(null)} className="flex-1 rounded-xl bg-slate-100 py-2.5 font-medium hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700">{COPY.cancel}</button>
                                <button type="submit" className="flex-1 rounded-xl bg-purple-600 py-2.5 font-medium text-white hover:bg-purple-700">{modalMode === 'edit' ? COPY.saveChanges : COPY.createPlan}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
