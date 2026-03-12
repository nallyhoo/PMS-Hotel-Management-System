import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Trash2,
  RefreshCw,
  Key,
  User,
  DoorOpen,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import keyCardService from '../../api/keycards';
import roomService from '../../api/rooms';
import { format, parseISO } from 'date-fns';
import { toastSuccess, toastError } from '../../lib/toast';

type KeyCardStatus = 'Active' | 'Inactive' | 'Lost' | 'Returned' | 'All';

export default function KeyCardManagementPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<KeyCardStatus>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);

  const { data: keyCards, isLoading } = useQuery({
    queryKey: ['keycards', statusFilter],
    queryFn: () => keyCardService.getKeyCards(
      statusFilter === 'All' ? undefined : { status: statusFilter }
    ),
  });

  const { data: rooms } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomService.getRooms(),
  });

  const filteredCards = keyCards?.filter((card: any) => 
    card.cardNumber?.includes(searchTerm) ||
    card.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.roomNumber?.includes(searchTerm)
  ) || [];

  const activeCards = keyCards?.filter((c: any) => c.status === 'Active').length || 0;
  const returnedCards = keyCards?.filter((c: any) => c.status === 'Returned').length || 0;
  const lostCards = keyCards?.filter((c: any) => c.status === 'Lost').length || 0;

  const deleteMutation = useMutation({
    mutationFn: (id: number) => keyCardService.deleteKeyCard(id),
    onSuccess: () => {
      toastSuccess('Key card deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['keycards'] });
      setSelectedCard(null);
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to delete key card');
    },
  });

  const returnMutation = useMutation({
    mutationFn: (id: number) => keyCardService.returnKeyCard(id),
    onSuccess: () => {
      toastSuccess('Key card returned successfully');
      queryClient.invalidateQueries({ queryKey: ['keycards'] });
      setSelectedCard(null);
    },
  });

  const lostMutation = useMutation({
    mutationFn: (id: number) => keyCardService.markAsLost(id),
    onSuccess: () => {
      toastSuccess('Key card marked as lost');
      queryClient.invalidateQueries({ queryKey: ['keycards'] });
      setSelectedCard(null);
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: number) => keyCardService.deactivateKeyCard(id),
    onSuccess: () => {
      toastSuccess('Key card deactivated');
      queryClient.invalidateQueries({ queryKey: ['keycards'] });
      setSelectedCard(null);
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle2 size={16} className="text-emerald-600" />;
      case 'Returned': return <RefreshCw size={16} className="text-blue-600" />;
      case 'Lost': return <AlertTriangle size={16} className="text-red-600" />;
      default: return <XCircle size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-700';
      case 'Returned': return 'bg-blue-50 text-blue-700';
      case 'Lost': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/checkin')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-light">Key Card Management</h1>
            <p className="text-sm text-[#1a1a1a]/60 font-light">
              Manage room key cards and access control
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#333] transition-colors"
        >
          <Plus size={18} />
          Issue New Card
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#1a1a1a]/5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl">
            <CreditCard size={20} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold">Active Cards</p>
            <p className="text-xl font-serif">{activeCards}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#1a1a1a]/5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            <RefreshCw size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold">Returned</p>
            <p className="text-xl font-serif">{returnedCards}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#1a1a1a]/5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-xl">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold">Lost</p>
            <p className="text-xl font-serif">{lostCards}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#1a1a1a]/5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-xl">
            <Key size={20} className="text-purple-600" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold">Total</p>
            <p className="text-xl font-serif">{keyCards?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
          <input 
            type="text" 
            placeholder="Search by card number, guest name, or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm focus:outline-none focus:border-[#1a1a1a]/30"
          />
        </div>
        <div className="flex gap-2">
          {(['All', 'Active', 'Returned', 'Lost', 'Inactive'] as KeyCardStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                statusFilter === status 
                  ? 'bg-[#1a1a1a] text-white' 
                  : 'bg-white border border-[#1a1a1a]/10 text-[#1a1a1a]/60 hover:bg-[#f8f9fa]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Key Cards List */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a1a1a]"></div>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard size={48} className="text-[#1a1a1a]/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Key Cards Found</h3>
            <p className="text-sm text-[#1a1a1a]/60">
              {statusFilter === 'All' ? 'No key cards have been issued yet.' : `No ${statusFilter.toLowerCase()} key cards.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f8f9fa] text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">
                  <th className="px-6 py-4">Card Number</th>
                  <th className="px-6 py-4">Room</th>
                  <th className="px-6 py-4">Guest</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Issue Date</th>
                  <th className="px-6 py-4">Expiry</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]/5">
                {filteredCards.map((card: any) => (
                  <tr key={card.keyCardId} className="hover:bg-[#f8f9fa] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <CreditCard size={18} className="text-[#1a1a1a]/40" />
                        <span className="font-mono font-medium">{card.cardNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <DoorOpen size={16} className="text-[#1a1a1a]/40" />
                        <span className="font-medium">{card.roomNumber || 'N/A'}</span>
                        {card.roomTypeName && (
                          <span className="text-xs text-[#1a1a1a]/40">({card.roomTypeName})</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-[#1a1a1a]/40" />
                        <span>{card.guestName || '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${getStatusColor(card.status)}`}>
                        {getStatusIcon(card.status)}
                        {card.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1a1a1a]/60">
                      {card.issueDate ? format(parseISO(card.issueDate), 'MMM d, yyyy HH:mm') : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1a1a1a]/60">
                      {card.expiryDate ? format(parseISO(card.expiryDate), 'MMM d, yyyy') : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {card.status === 'Active' && (
                          <>
                            <button
                              onClick={() => returnMutation.mutate(card.keyCardId)}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                              title="Return Card"
                            >
                              <RefreshCw size={16} />
                            </button>
                            <button
                              onClick={() => lostMutation.mutate(card.keyCardId)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                              title="Mark as Lost"
                            >
                              <AlertTriangle size={16} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setSelectedCard(card)}
                          className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Key size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateKeyCardModal 
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            queryClient.invalidateQueries({ queryKey: ['keycards'] });
          }}
        />
      )}
    </div>
  );
}

function CreateKeyCardModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    cardNumber: keyCardService.generateCardNumber(),
    roomId: 0,
    guestName: '',
    expiryDate: '',
    notes: '',
  });

  const { data: rooms } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomService.getRooms(),
  });

  const createMutation = useMutation({
    mutationFn: () => keyCardService.createKeyCard(formData),
    onSuccess: () => {
      toastSuccess('Key card created successfully');
      onSuccess();
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to create key card');
    },
  });

  const generateNewCardNumber = () => {
    setFormData(prev => ({ ...prev, cardNumber: keyCardService.generateCardNumber() }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roomId) {
      toastError('Please select a room');
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-serif">Issue New Key Card</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#f8f9fa] rounded-lg">
            <XCircle size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Card Number</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                className="flex-1 px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl font-mono text-sm"
              />
              <button
                type="button"
                onClick={generateNewCardNumber}
                className="px-4 py-2 border border-[#1a1a1a]/10 rounded-xl text-sm hover:bg-[#f8f9fa]"
              >
                Generate
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Room *</label>
            <select
              value={formData.roomId}
              onChange={(e) => setFormData(prev => ({ ...prev, roomId: Number(e.target.value) }))}
              className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm"
            >
              <option value={0}>Select a room</option>
              {rooms?.map((room: any) => (
                <option key={room.roomId} value={room.roomId}>
                  Room {room.roomNumber} - {room.roomTypeName || 'Standard'}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Guest Name</label>
            <input
              type="text"
              value={formData.guestName}
              onChange={(e) => setFormData(prev => ({ ...prev, guestName: e.target.value }))}
              placeholder="Optional"
              className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Expiry Date</label>
            <input
              type="datetime-local"
              value={formData.expiryDate}
              onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
              className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
              placeholder="Optional notes..."
              className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 px-4 py-3 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#333] disabled:opacity-50"
            >
              {createMutation.isPending ? 'Creating...' : 'Issue Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
