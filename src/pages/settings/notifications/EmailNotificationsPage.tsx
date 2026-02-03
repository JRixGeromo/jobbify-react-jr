import React, { useState } from 'react';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { ArrowLeft, Mail, Plus, Trash2, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TipTapEditor } from '../../../components/editor/TipTapEditor';
import { DemoModeNotice } from '../../../components/DemoModeNotice';

// ... rest of the imports and interfaces remain the same ...

export default function EmailNotificationsPage() {
  // ... existing state and handlers remain the same ...

  return (
    <div className="p-6">
      {/* ... existing header JSX ... */}

      <DemoModeNotice feature="Email notification" />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ... rest of the component JSX remains the same ... */}
      </div>
    </div>
  );
}
