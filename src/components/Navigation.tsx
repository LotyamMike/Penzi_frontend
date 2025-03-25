'use client';

export default function Navigation() {
  return (
    <nav className="bg-gradient-to-r from-purple-800 via-pink-700 to-red-600 shadow-lg">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <HeartIcon className="h-8 w-8 text-pink-100" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-100 to-purple-200">
                Penzi
              </h1>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <NavLink href="/dashboard" active={true}>
              <HomeIcon />
              Dashboard
            </NavLink>
            <NavLink href="/users">
              <UsersIcon />
              Users
            </NavLink>
            <NavLink href="/messages">
              <ChatIcon />
              Messages
            </NavLink>
          </div>
        </div>
      </div>

      {/* Sub Navigation / Stats Bar */}
      <div className="bg-white/5 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-pink-100 text-sm">
                <ClockIcon className="h-4 w-4" />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center space-x-4">
                <StatBadge icon={<UsersIcon />} label="Active Users" value="2.4k" />
                <StatBadge icon={<HeartIcon />} label="Matches" value="856" />
                <StatBadge icon={<ChatIcon />} label="Messages" value="12.5k" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

const NavLink = ({ href, children, active }: NavLinkProps) => (
  <a
    href={href}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
      ${active 
        ? 'bg-white/10 text-white' 
        : 'text-pink-100 hover:bg-white/10 hover:text-white'
      }`}
  >
    {children}
  </a>
);

interface StatBadgeProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatBadge = ({ icon, label, value }: StatBadgeProps) => (
  <div className="flex items-center space-x-2 text-pink-100">
    <div className="h-4 w-4">
      {icon}
    </div>
    <span className="text-xs text-pink-200">{label}:</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

// Icons
const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ChatIcon = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
); 