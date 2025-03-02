import { useState, useEffect } from 'react';
import { getAllUsers, updateUserProfile } from '../../services/firebase';
import { UserItem } from './UserItem';
import type { User } from '../../types';
import { toast } from 'react-hot-toast';
import { Users as UsersIcon, Search, Plus } from 'lucide-react';

export const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      await updateUserProfile(userId, { role: newRole });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      toast.success('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const filteredUsers = users.filter(user =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <UsersIcon className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold">Users Management</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
          <Plus className="w-5 h-5" />
          <span>Add User</span>
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-700 font-semibold">
          <div>Name</div>
          <div>Email</div>
          <div>Role</div>
          <div>Actions</div>
        </div>
        <div className="divide-y divide-gray-700">
          {filteredUsers.map(user => (
            <UserItem 
              key={user.id} 
              user={user} 
              onRoleChange={handleRoleChange} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 