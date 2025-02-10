'use client';
import React from 'react';
import { Film, Mail, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Footer = () => {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push('/');
  };

  return (
    <div className="w-full flex flex-col items-start self-stretch bg-indigo-700">
      <div className="w-full max-w-[1280px] mx-auto pt-10 pb-10 pr-5 pl-5 md:flex md:gap-32 md:justify-between">
        <div>
          <button
            className="font-inter text-xl italic font-bold leading-5 tracking-[0.32px] flex gap-2 items-center text-white"
            onClick={handleHomeClick}
          >
            <Film />
            MovieZ
          </button>

          <p className="pb-7 pt-3 text-white">
            © 2024 Movie Z. All Rights Reserved.
          </p>
        </div>

        <div className="flex gap-12 md:flex">
          <div className="text-white flex flex-col gap-3">
            <p>Contact information</p>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <Mail />
                <div>
                  <p>Email</p>
                  <p>support@movieZ.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone />
                <div>
                  <p>Phone</p>
                  <p>+976 (11) 123-4567</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 text-white">
            <p>Follow us</p>
            <div className="flex flex-col gap-3 md:flex md:flex-row">
              <p>Facebook</p>
              <p>Instagram</p>
              <p>Twitter</p>
              <p>Youtube</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
