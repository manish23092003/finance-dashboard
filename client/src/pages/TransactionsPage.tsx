import { useState, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Search, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/axios';
import { useAuthStore } from '../context/authStore';
import {
  useTransactions,
  useCategories,
  useCreateRecord,
  useUpdateRecord,
  useDeleteRecord,
  type TransactionFilters,
} from '../hooks/useTransactions';
import { recordSchema } from '../validators/forms';
import { formatCurrency, formatDate } from '../lib/utils';
import type { FinancialRecord, RecordType } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';

export default function TransactionsPage() {
  const user = useAuthStore((s) => s.user);
  const canCreate = user?.role === 'ADMIN' || user?.role === 'ANALYST';
  const isAdmin = user?.role === 'ADMIN';

  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    limit: 10,
    dateFrom: '',
    dateTo: '',
    category: '',
    type: '',
  });

  const { data, isLoading } = useTransactions(filters);
  const { data: categories } = useCategories();
  const createMutation = useCreateRecord();
  const updateMutation = useUpdateRecord();
  const deleteMutation = useDeleteRecord();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<FinancialRecord | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    amount: '',
    type: 'EXPENSE' as RecordType,
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const openAdd = () => {
    setEditing(null);
    setFormData({ amount: '', type: 'EXPENSE', category: '', date: new Date().toISOString().split('T')[0], notes: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEdit = (record: FinancialRecord) => {
    setEditing(record);
    setFormData({
      amount: record.amount.toString(),
      type: record.type,
      category: record.category,
      date: new Date(record.date).toISOString().split('T')[0],
      notes: record.notes,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const parsed = recordSchema.safeParse({
      ...formData,
      amount: parseFloat(formData.amount) || 0,
    });

    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string;
        if (!errs[key]) errs[key] = issue.message;
      }
      setFormErrors(errs);
      return;
    }

    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, ...parsed.data });
        toast.success('Record updated');
      } else {
        await createMutation.mutateAsync(parsed.data);
        toast.success('Record created');
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Record deleted');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Delete failed');
    }
  };

  const canEditRecord = (record: FinancialRecord) => {
    if (isAdmin) return true;
    if (user?.role === 'ANALYST' && record.userId === user.id) return true;
    return false;
  };

  /**
   * Blob-based CSV Export Strategy:
   * We intercept the raw binary stream (blob) directly from the Axios response to explicitly bypass browser 
   * text encoding issues or interceptors trying to parse JSON. 
   * We generate an ephemeral ObjectURL pointer, dynamically append a hidden <a> tag to the DOM, trigger it,
   * and clean it up immediately to prevent memory leaks from the blob references.
   */
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    toast('Download starting...', { icon: '📥' });
    try {
      const params: Record<string, string> = {};
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;
      if (filters.category) params.category = filters.category;
      if (filters.type) params.type = filters.type;

      const response = await api.get('/records/export', {
        params,
        responseType: 'blob',
      });

      const disposition = response.headers['content-disposition'];
      let filename = 'transactions.csv';
      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('CSV exported successfully');
    } catch {
      toast.error('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  const pagination = data?.pagination;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transactions</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {pagination ? `${pagination.total} records found` : 'Loading...'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleExport}
            isLoading={isExporting}
            icon={<Download className="w-4 h-4" />}
            id="export-csv-btn"
          >
            Export CSV
          </Button>
          {canCreate && (
            <Button onClick={openAdd} icon={<Plus className="w-4 h-4" />} id="add-transaction-btn">
              Add Transaction
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            type="date"
            label="From Date"
            value={filters.dateFrom || ''}
            onChange={(e) => setFilters((f) => ({ ...f, page: 1, dateFrom: e.target.value }))}
            id="filter-date-from"
          />
          <Input
            type="date"
            label="To Date"
            value={filters.dateTo || ''}
            onChange={(e) => setFilters((f) => ({ ...f, page: 1, dateTo: e.target.value }))}
            id="filter-date-to"
          />
          <Select
            label="Category"
            options={(categories || []).map((c) => ({ value: c, label: c }))}
            placeholder="All Categories"
            value={filters.category || ''}
            onChange={(e) => setFilters((f) => ({ ...f, page: 1, category: e.target.value }))}
            id="filter-category"
          />
          <Select
            label="Type"
            options={[
              { value: 'INCOME', label: 'Income' },
              { value: 'EXPENSE', label: 'Expense' },
            ]}
            placeholder="All Types"
            value={filters.type || ''}
            onChange={(e) => setFilters((f) => ({ ...f, page: 1, type: e.target.value as RecordType | '' }))}
            id="filter-type"
          />
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-3">Date</th>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-3">Category</th>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-3">Type</th>
                  <th className="text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-3">Amount</th>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-3">Notes</th>
                  {(canCreate || isAdmin) && (
                    <th className="text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-3">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {data?.records.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-400 whitespace-nowrap">{formatDate(record.date)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-200">{record.category}</td>
                    <td className="px-6 py-4">
                      <Badge variant={record.type === 'INCOME' ? 'income' : 'expense'}>
                        {record.type}
                      </Badge>
                    </td>
                    <td className={`px-6 py-4 text-sm font-semibold text-right whitespace-nowrap ${
                      record.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {record.type === 'INCOME' ? '+' : '-'}{formatCurrency(record.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 max-w-[200px] truncate">{record.notes}</td>
                    {(canCreate || isAdmin) && (
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {canEditRecord(record) && (
                            <button
                              onClick={() => openEdit(record)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-400/10 transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          )}
                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(record.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {data?.records.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                      <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
                      <p className="font-medium">No transactions found</p>
                      <p className="text-sm mt-1">Try adjusting your filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing {(pagination.page - 1) * pagination.limit + 1}–
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                  icon={<ChevronLeft className="w-4 h-4" />}
                >
                  Prev
                </Button>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 px-2">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? 'Edit Transaction' : 'Add Transaction'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Amount (₹)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData((f) => ({ ...f, amount: e.target.value }))}
            error={formErrors.amount}
            id="record-amount"
          />
          <Select
            label="Type"
            options={[
              { value: 'INCOME', label: 'Income' },
              { value: 'EXPENSE', label: 'Expense' },
            ]}
            value={formData.type}
            onChange={(e) => setFormData((f) => ({ ...f, type: e.target.value as RecordType }))}
            error={formErrors.type}
            id="record-type"
          />
          <Input
            label="Category"
            placeholder="e.g., Salary, Rent, Groceries"
            value={formData.category}
            onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}
            error={formErrors.category}
            id="record-category"
          />
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData((f) => ({ ...f, date: e.target.value }))}
            error={formErrors.date}
            id="record-date"
          />
          <Input
            label="Notes (optional)"
            placeholder="Additional details..."
            value={formData.notes}
            onChange={(e) => setFormData((f) => ({ ...f, notes: e.target.value }))}
            id="record-notes"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={createMutation.isPending || updateMutation.isPending}
              id="record-submit"
            >
              {editing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
