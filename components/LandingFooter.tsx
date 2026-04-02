import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sbGetCmsPages } from '../services/supabaseService';
import { CmsPage } from '../types';
import { useApp } from '../AppContext';
import { Facebook, Mail, MapPin, Phone } from 'lucide-react';

export default function LandingFooter() {
  const navigate = useNavigate();
  const { adminSettings } = useApp();
  const [pages, setPages] = useState<CmsPage[]>([]);

  useEffect(() => {
    const fetchPages = async () => {
      const data = await sbGetCmsPages();
      setPages(data.filter(p => p.isPublished));
    };
    fetchPages();
  }, []);

  const legalPages = pages.filter(p => p.category === 'legal');
  const supportPages = pages.filter(p => p.category === 'support');
  const companyPages = pages.filter(p => p.category === 'company');

  const ci = adminSettings?.companyInfo;
  const brandName = ci?.name || 'Smart Rental';
  const description = ci?.description || 'Nền tảng quản lý nhà trọ, căn hộ dịch vụ thông minh số 1 Việt Nam. Tự động hóa quy trình, tiết kiệm thời gian, tối ưu chi phí.';
  const address = ci?.address || 'Số 1, Đường công nghệ, Quận Nam Từ Liêm, Hà Nội';
  const phone = ci?.phone || '1800 000 000';
  const email = ci?.email || 'support@smartrental.ai';
  const fbUrl = ci?.facebookUrl || '#';
  const logoUrl = adminSettings?.logoUrl;

  return (
    <footer className="relative border-t border-white/10 bg-slate-950 px-5 pt-16 pb-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand Info */}
          <div className="space-y-6">
            {logoUrl ? (
              <img src={logoUrl} alt={brandName} className="h-10 max-w-[180px] object-contain" />
            ) : (
              <div className="text-2xl font-black tracking-tight text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text">
                {brandName}
              </div>
            )}
            <p className="text-sm leading-6 text-slate-400">
              {description}
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin size={18} className="text-blue-400 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Phone size={18} className="text-blue-400" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Mail size={18} className="text-blue-400" />
                <span>{email}</span>
              </div>
            </div>
          </div>

          {/* Về chúng tôi (Company) */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Về chúng tôi</h3>
            <ul className="space-y-3">
              {companyPages.map(page => (
                <li key={page.id}>
                  <button 
                    onClick={() => navigate(`/p/${page.slug}`)}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {page.title}
                  </button>
                </li>
              ))}
              <li>
                <button 
                  onClick={() => navigate('/pricing')}
                  className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                >
                  Bảng giá dịch vụ
                </button>
              </li>
            </ul>
          </div>

          {/* Hỗ trợ khách hàng (Support) */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Hỗ trợ khách hàng</h3>
            <ul className="space-y-3">
              {supportPages.map(page => (
                <li key={page.id}>
                  <button 
                    onClick={() => navigate(`/p/${page.slug}`)}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {page.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Pháp lý (Legal) */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Quy định & Chính sách</h3>
            <ul className="space-y-3">
              {legalPages.map(page => (
                <li key={page.id}>
                  <button 
                    onClick={() => navigate(`/p/${page.slug}`)}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {page.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href={fbUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-400 transition-colors">
              <Facebook size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
