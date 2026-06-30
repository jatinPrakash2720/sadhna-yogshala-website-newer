"use client";

import { useState } from "react";
import { Search, Filter, MoreVertical, Shield, ShieldOff, Ban, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";

// Mock Data
const MOCK_USERS = [
  { id: "1", name: "Sarah Jenkins", email: "sarah@example.com", role: "student", status: "active", joinedAt: "2023-10-15", enrollments: 3 },
  { id: "2", name: "Michael Chen", email: "michael@example.com", role: "student", status: "active", joinedAt: "2023-11-02", enrollments: 1 },
  { id: "3", name: "Priya Sharma", email: "priya@example.com", role: "admin", status: "active", joinedAt: "2023-08-20", enrollments: 0 },
  { id: "4", name: "David Wilson", email: "david@example.com", role: "student", status: "blocked", joinedAt: "2024-01-10", enrollments: 2 },
  { id: "5", name: "Emma Watson", email: "emma@example.com", role: "student", status: "active", joinedAt: "2024-02-05", enrollments: 4 },
];

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = MOCK_USERS.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">User Management</h1>
          <p className="text-sage-500 text-sm">Manage student and admin accounts</p>
        </div>
        <button className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors shadow-sm">
          Invite User
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-cream-200 shadow-sm overflow-hidden"
      >
        {/* Table Toolbar */}
        <div className="p-4 border-b border-cream-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-cream-50/50">
          <div className="relative w-full sm:max-w-xs">
            <Search className="h-4 w-4 text-sage-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-cream-200 rounded-lg hover:bg-cream-50 w-full sm:w-auto justify-center">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-cream-50/80 text-sage-600 font-semibold border-b border-cream-200">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-center">Enrollments</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-sage-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}>
                      {user.role === 'admin' ? <Shield className="h-3 w-3" /> : null}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'active' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                      {user.status === 'active' ? <CheckCircle className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-medium text-gray-900">{user.enrollments}</span>
                  </td>
                  <td className="px-6 py-4 text-sage-500">
                    {formatDate(user.joinedAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sage-400 hover:text-brand-600 transition-colors p-1 rounded-md hover:bg-brand-50">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sage-500">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-cream-200 flex items-center justify-between text-sm text-sage-500 bg-cream-50/30">
          <p>Showing <span className="font-medium text-gray-900">1</span> to <span className="font-medium text-gray-900">{filteredUsers.length}</span> of <span className="font-medium text-gray-900">{filteredUsers.length}</span> results</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-cream-200 rounded disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 border border-cream-200 rounded disabled:opacity-50">Next</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
