'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import UserProfileSkeleton from './UserProfileSkeleton';
import UserProfileError from './UserProfileError';

export default function Sidebar() {
  const { user, isLoading, error } = useUser();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  return (
    <>
      {/* Fixed sidebar */}
      <div 
        className={`
          ${isCollapsed ? 'w-20' : 'w-64'} 
          fixed top-0 left-0 h-screen 
          bg-white dark:bg-gray-900 
          border-r border-gray-200 dark:border-gray-800 
          flex flex-col 
          transition-all duration-300 ease-in-out
          z-50
        `}
      >
        {/* Logo and Toggle */}
        <div className={`h-[72px] flex items-center ${isCollapsed ? 'justify-center px-5' : 'justify-between px-4'}`}>
          <div className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}
          `}>
            <Image src="/tavily-logo.png" alt="Tavily" width={120} height={40} />
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <Image 
              src={isCollapsed ? "/menu.svg" : "/collapse.svg"}
              alt="Toggle" 
              width={20} 
              height={20} 
              className={`dark:invert transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`}
            />
          </button>
        </div>

        {/* Personal Dropdown */}
        <button className={`mx-4 my-2 p-2 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800`}>
          <span className={isCollapsed ? 'hidden' : ''}>Personal</span>
          {!isCollapsed && (
            <Image src="/chevron-down.svg" alt="Expand" width={16} height={16} className="dark:invert" />
          )}
        </button>

        {/* Navigation Links */}
        <nav className="flex-1 px-5 py-4 space-y-2 overflow-y-auto">
          {[
            { href: '/overview', icon: '/home.svg', label: 'Overview' },
            { href: '/account', icon: '/user.svg', label: 'My Account' },
            { href: '/assistant', icon: '/sparkles.svg', label: 'Research Assistant' },
            { href: '/reports', icon: '/document.svg', label: 'Research Reports' },
            { href: '/dashboards', icon: '/dashboard.svg', label: 'API Dashboard' },
            { href: '/playground', icon: '/code.svg', label: 'API Playground' },
            { href: '/docs', icon: '/docs.svg', label: 'Documentation' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <Image src={item.icon} alt={item.label} width={20} height={20} className="dark:invert" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        {isLoading ? (
          <UserProfileSkeleton />
        ) : error ? (
          <UserProfileError 
            error={error} 
            onRetry={() => {
              // Add your retry logic here
              window.location.reload();
            }} 
          />
        ) : user ? (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <Image 
                src={user.profileImage} 
                alt={user.name} 
                width={40} 
                height={40} 
                className="rounded-full" 
              />
              {!isCollapsed && (
                <>
                  <div className="flex-1">
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <Image 
                    src="/logout.svg" 
                    alt="Logout" 
                    width={20} 
                    height={20} 
                    className="dark:invert" 
                  />
                </>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Spacer div to push content to the right */}
      <div className={`${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out flex-shrink-0`} />
    </>
  );
}