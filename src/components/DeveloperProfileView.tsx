import React from 'react';
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Code,
  Calendar,
  Link2
} from 'lucide-react';

interface Experience {
  company: string;
  designation: string;
  start_date: string;
  end_date: string | null;
  currently_working: boolean;
}

interface Education {
  college: string;
  degree: string;
  branch: string;
  start_date: string;
  end_date: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

interface ProfileData {
  linkedin: string;
  github: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  address: Address;
}

interface DeveloperProfileViewProps {
  profile: ProfileData;
  userName?: string;
  userEmail?: string;
  onBack?: () => void;
}

export const DeveloperProfileView: React.FC<DeveloperProfileViewProps> = ({
  profile,
  userName = 'Developer',
  userEmail,
  onBack
}) => {
  return (
    <div className="bg-[#020617]/60 backdrop-blur-md border border-white/10 rounded-xl shadow-sm overflow-hidden max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border-b border-white/5 p-6 md:p-8 text-white relative">
        {onBack && (
          <div className="mb-6">
            <button
              onClick={onBack}
              className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none inline-flex items-center"
            >
              ← Back
            </button>
          </div>
        )}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20 text-3xl font-bold uppercase">
            {userName.charAt(0)}
          </div>
          <div className="text-center md:text-left space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight">{userName}</h2>
            {userEmail && <p className="text-sm text-white/80">{userEmail}</p>}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 rounded-full text-xs font-semibold transition-all"
              >
                <Link2 className="w-3.5 h-3.5" />
                LinkedIn
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 rounded-full text-xs font-semibold transition-all"
              >
                <Code className="w-3.5 h-3.5" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* Skills Tag Cloud */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Code className="w-4 h-4 text-blue-400" />
            Skills & Expertise
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold rounded-lg transition-colors cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Work & Education */}
          <div className="md:col-span-2 space-y-8">
            {/* Experience Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-400" />
                Work Experience
              </h3>

              {profile.experience.length === 0 ? (
                <p className="text-xs text-gray-500 italic bg-white/5 p-4 rounded-lg">No work history provided.</p>
              ) : (
                <div className="relative pl-6 border-l-2 border-dashed border-white/10 space-y-6">
                  {profile.experience.map((exp, index) => (
                    <div key={index} className="relative">
                      {/* Timeline Node Ring */}
                      <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-blue-500 bg-[#0f172a]" />
                      
                      <div className="space-y-1">
                        <div className="flex items-center flex-wrap gap-2">
                          <h4 className="text-sm font-bold text-white">{exp.designation}</h4>
                          <span className="text-xs text-blue-400">@ {exp.company}</span>
                          {exp.currently_working && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xxs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xxs text-gray-500 font-medium flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {exp.start_date} to {exp.currently_working ? 'Present' : exp.end_date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Education Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                Education Details
              </h3>

              {profile.education.length === 0 ? (
                <p className="text-xs text-gray-500 italic bg-white/5 p-4 rounded-lg">No education details provided.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.education.map((edu, index) => (
                    <div
                      key={index}
                      className="border border-white/10 rounded-lg p-4 bg-white/5 hover:bg-white/10 transition-colors space-y-2"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{edu.college}</h4>
                        <p className="text-xxs text-blue-400/80">{edu.degree} in {edu.branch}</p>
                      </div>
                      <p className="text-xxs text-gray-500 font-mono flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {edu.start_date} to {edu.end_date}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Address */}
          <div className="md:col-span-1">
            <div className="border border-white/10 rounded-xl bg-white/5 p-5 space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                Contact Address
              </h3>
              <div className="space-y-3 text-xs text-gray-400 leading-relaxed">
                <div>
                  <span className="text-xxs font-bold text-gray-500 uppercase block mb-0.5">Street Address</span>
                  <p className="font-semibold text-white">{profile.address.street}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xxs font-bold text-gray-500 uppercase block mb-0.5">City</span>
                    <p className="font-semibold text-white">{profile.address.city}</p>
                  </div>
                  <div>
                    <span className="text-xxs font-bold text-gray-500 uppercase block mb-0.5">State</span>
                    <p className="font-semibold text-white">{profile.address.state}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xxs font-bold text-gray-500 uppercase block mb-0.5">Country</span>
                    <p className="font-semibold text-white">{profile.address.country}</p>
                  </div>
                  <div>
                    <span className="text-xxs font-bold text-gray-500 uppercase block mb-0.5">Pincode</span>
                    <p className="font-semibold text-white font-mono">{profile.address.pincode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
