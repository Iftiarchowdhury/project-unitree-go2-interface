import { useState } from 'react';
import type { User } from '../../types';
import { Edit2, Trash2, MoreVertical } from 'lucide-react';

interface UserItemProps {
  user: User;
  onRoleChange: (userId: string, newRole: 'admin' | 'user') => Promise<void>;
}

export const UserItem = ({ user, onRoleChange }: UserItemProps) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="grid grid-cols-4 gap-4 p-4 items-center hover:bg-gray-700">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
          {user.displayName[0].toUpperCase()}
        </div>
        <span>{user.displayName}</span>
      </div>
      <div>{user.email}</div>
      <div>
        <select
          value={user.role}
          onChange={(e) => onRoleChange(user.id, e.target.value as 'admin' | 'user')}
          className="bg-gray-700 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="relative">
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-2 hover:bg-gray-600 rounded-lg transition"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
        
        {showActions && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg py-1 z-10">
            <button
              className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-600 transition"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit User</span>
            </button>
            <button
              className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-600 text-red-400 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete User</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 