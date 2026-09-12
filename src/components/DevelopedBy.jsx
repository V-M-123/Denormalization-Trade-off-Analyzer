import React, { useState } from 'react';
import { UserCheck, Award, GraduationCap, Mail, Edit3, Check } from 'lucide-react';

export default function DevelopedBy() {
  const [isEditing, setIsEditing] = useState(false);
  const [teamMembers, setTeamMembers] = useState([
    {
      name: 'Student Lead',
      regNo: '21BCE1001',
      role: 'Database Modeling & Core Cost Engine',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Team Member 2',
      regNo: '21BCE1042',
      role: 'UI/UX Design & Anomaly Simulator',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Team Member 3',
      regNo: '21BCE1095',
      role: 'Automated Testing & Report Exporter',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    },
  ]);

  const handleMemberChange = (index, field, value) => {
    setTeamMembers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-semibold">
          <UserCheck className="w-3.5 h-3.5" />
          <span>Project Team & Guidance</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Developed By
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Academic Project Development for Database Management Systems — Digital Assignment 1 (DA1)
        </p>
      </div>

      {/* SUPERVISOR GUIDANCE CARD (MANDATORY REQUIREMENT) */}
      <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
          
          <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur border-2 border-white/40 flex items-center justify-center text-white shrink-0 shadow-inner">
            <GraduationCap className="w-12 h-12 text-white" />
          </div>

          <div className="space-y-1">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-white/20 text-white uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 mr-1" />
              Faculty Supervisor
            </span>
            <div className="text-xs uppercase tracking-widest text-sky-200 font-semibold pt-1">
              Guided By
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Dr. Swaminathan A
            </h2>
            <p className="text-sm font-medium text-sky-100">
              Assistant Professor
            </p>
            <p className="text-xs text-sky-200/90 pt-1">
              School of Computer Science and Engineering (SCOPE)
            </p>
          </div>
        </div>
      </div>

      {/* TEAM MEMBERS SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Student Project Contributors
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click "Edit Details" if you want to update student names or registration numbers
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {isEditing ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? 'Done Editing' : 'Edit Details'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-5 border border-slate-200 dark:border-slate-700 text-center space-y-3 transition-all hover:shadow-md"
            >
              {/* Photo */}
              <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-3 border-sky-500/30 shadow-sm">
                <img 
                  src={member.photo} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Editable Name & Reg No */}
              {isEditing ? (
                <div className="space-y-2 text-left text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold">Student Name</label>
                    <input 
                      type="text" 
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                      className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold">Register Number</label>
                    <input 
                      type="text" 
                      value={member.regNo}
                      onChange={(e) => handleMemberChange(index, 'regNo', e.target.value)}
                      className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-mono text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold">Role</label>
                    <input 
                      type="text" 
                      value={member.role}
                      onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                      className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {member.name}
                  </h4>
                  <div className="inline-block px-2.5 py-0.5 mt-1 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-mono font-semibold">
                    Reg No: {member.regNo}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                    {member.role}
                  </p>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
