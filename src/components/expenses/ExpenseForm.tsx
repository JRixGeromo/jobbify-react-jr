import React, { useState } from 'react';
import { Expense, ExpenseCategory, PaymentMethod } from '../../data/expenses';
import { jobs } from '../../data/jobs';
import { FileUpload } from '../ui/file-upload';

interface ExpenseFormProps {
  expense?: Expense | null;
  onSubmit: (data: Partial<Expense>) => void;
  onCancel: () => void;
}

export function ExpenseForm({ expense, onSubmit, onCancel }: ExpenseFormProps) {
  const [formData, setFormData] = useState<Partial<Expense>>(
    expense || {
      date: new Date().toISOString().split('T')[0],
      category: 'Materials',
      description: '',
      amount: 0,
      paymentMethod: 'Credit Card',
      taxDeductible: true,
      status: 'Pending',
    }
  );
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real application, you would upload the file to your server/storage
    // and get back a URL to store with the expense
    if (mediaFile) {
      // Simulating file upload by creating an object URL
      // In production, you would upload to your server/cloud storage
      const mediaUrl = URL.createObjectURL(mediaFile);
      onSubmit({ ...formData, receipt: mediaUrl });
    } else {
      onSubmit(formData);
    }
  };

  const handleFileSelect = (url: string) => {
    console.log(url);
    // Update state or perform other actions with the URL
  };

  const handleFileRemove = () => {
    setMediaFile(null);
    setFormData({ ...formData, receipt: undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value as ExpenseCategory,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            required
          >
            <option value="Materials">Materials</option>
            <option value="Equipment">Equipment</option>
            <option value="Vehicle">Vehicle</option>
            <option value="Office">Office</option>
            <option value="Marketing">Marketing</option>
            <option value="Insurance">Insurance</option>
            <option value="Utilities">Utilities</option>
            <option value="Payroll">Payroll</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Description
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: parseFloat(e.target.value) })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Payment Method
          </label>
          <select
            value={formData.paymentMethod}
            onChange={(e) =>
              setFormData({
                ...formData,
                paymentMethod: e.target.value as PaymentMethod,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            required
          >
            <option value="Credit Card">Credit Card</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Check">Check</option>
            <option value="Digital Wallet">Digital Wallet</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Vendor
        </label>
        <input
          type="text"
          value={formData.vendor || ''}
          onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Receipt or Documentation
        </label>
        <FileUpload
          onFileSelect={handleFileSelect}
          onRemove={handleFileRemove}
          setUploading={setIsUploading}
          accept="image/jpeg,image/png"
          folder="uploads"
          maxSize={5}
          multiple={false}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Related Job
        </label>
        <select
          value={formData.jobId || ''}
          onChange={(e) =>
            setFormData({ ...formData, jobId: e.target.value || undefined })
          }
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="">No Related Job</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.service} - {job.address}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Notes
        </label>
        <textarea
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          rows={3}
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="taxDeductible"
          checked={formData.taxDeductible}
          onChange={(e) =>
            setFormData({ ...formData, taxDeductible: e.target.checked })
          }
          className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
        />
        <label htmlFor="taxDeductible" className="text-sm text-slate-700">
          Tax Deductible
        </label>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-slate-600 hover:text-slate-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          {expense ? 'Update' : 'Add'} Expense
        </button>
      </div>
    </form>
  );
}
