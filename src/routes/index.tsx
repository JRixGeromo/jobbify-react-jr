import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { DevOnly } from '@/components/auth/DevOnly';
import { DashboardLayout } from '@/layouts/DashboardLayout';

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { CallbackPage } from '@/pages/auth/CallbackPage';
import PricingPage from '@/pages/PricingPage';

import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';
import MigrationTest from '@/pages/MigrationTest';


// Dashboard Pages
import Dashboard from '@/pages/Dashboard';
import JobsPage from '@/pages/JobsPage';
import CreateJobPage from '@/pages/CreateJobPage';
import JobDetails from '@/pages/JobDetails';
import ClientsPage from '@/pages/ClientsPage';
import CreateClientPage from '@/pages/CreateClientPage';
import ClientDetails from '@/pages/ClientDetails';
import ServicesPage from '@/pages/ServicesPage';
import ServiceDetailsPage from '@/pages/services/ServiceDetailsPage';
import AddServicePage from '@/pages/services/AddServicePage';
import EditServicePage from '@/pages/services/EditServicePage';
import QuotesPage from '@/pages/QuotesPage';
import QuoteDetails from '@/pages/QuoteDetails';
import QuotePreviewPage from '@/components/quotes/QuotePreviewPage';
import CreateQuotePage from '@/pages/CreateQuotePage';
import InvoicesPage from '@/pages/InvoicesPage';
import InvoiceDetails from '@/pages/InvoiceDetails';
import InvoicePreviewPage from '@/components/invoices/InvoicePreviewPage';
import CreateInvoicePage from '@/pages/CreateInvoicePage';
import ExpensesPage from '@/pages/ExpensesPage';
import TimesheetPage from '@/pages/TimesheetPage';
import StaffPage from '@/pages/StaffPage';
import CreateStaffPage from '@/pages/CreateStaffPage';
import SettingsPage from '@/pages/SettingsPage';
import CompanySettingsPage from '@/pages/settings/CompanySettingsPage';
import SecuritySettingsPage from '@/pages/settings/SecuritySettingsPage';
import AppearanceSettingsPage from '@/pages/settings/AppearanceSettingsPage';
import CompanyProfilePage from '@/pages/settings/CompanyProfilePage';
import BusinessHoursPage from '@/pages/settings/company/BusinessHoursPage';
import LocationsPage from '@/pages/settings/LocationsPage';
import OnlineBookingPage from '@/pages/settings/OnlineBookingPage';
import OnlineFormsPage from '@/pages/settings/OnlineFormsPage';
import EmailNotificationsPage from '@/pages/settings/notifications/EmailNotificationsPage';
import SMSNotificationsPage from '@/pages/settings/notifications/SMSNotificationsPage';
import AppNotificationsPage from '@/pages/settings/notifications/AppNotificationsPage';
import SchedulePage from '@/pages/SchedulePage';
import ReportsPage from '@/pages/ReportsPage';
import ReportDetails from '@/pages/ReportDetails';
import AppDetailsPage from '@/pages/settings/integrations/AppDetailsPage';
import SuccessPage from '@/pages/SuccessPage'; // Import the SuccessPage component
import { SubscriptionTest } from '@/components/SubscriptionTest';
import SubscriptionDashboardPage from '@/pages/SubscriptionDashboardPage';

export function Routes() {
  return (
    <RouterRoutes>


      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      {/* <Route path="/reset-password" element={<ResetPasswordPage />} /> */}
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/auth/callback" element={<CallbackPage />} />
      <Route path="/success" element={<SuccessPage />} /> {/* Add SuccessPage route */}
      <Route path="/migration-test" element={<MigrationTest />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="jobs/new" element={<CreateJobPage />} />
        <Route path="jobs/:id" element={<JobDetails />} />
        <Route path="jobs/edit/:id" element={<CreateJobPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="clients/new" element={<CreateClientPage />} />
        <Route path="clients/:id" element={<ClientDetails />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="services/:id" element={<ServiceDetailsPage />} />
        <Route path="services/add" element={<AddServicePage />} />
        <Route path="services/edit/:id" element={<EditServicePage />} />
        <Route path="quotes" element={<QuotesPage />} />
        <Route path="quotes/:id" element={<QuoteDetails />} />
        <Route path="quotes/new" element={<CreateQuotePage />} />
        <Route path="quotes/preview/:id" element={<QuotePreviewPage />} />
        <Route path="quotes/edit/:id" element={<CreateQuotePage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="invoices/:id" element={<InvoiceDetails />} />
        <Route path="invoices/new" element={<CreateInvoicePage />} />
        <Route path="invoices/edit/:id" element={<CreateInvoicePage />} />
        <Route path="invoices/preview/:id" element={<InvoicePreviewPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="timesheet" element={<TimesheetPage />} />
        <Route path="staff" element={<StaffPage />} />
        <Route path="staff/new" element={<CreateStaffPage />} />
        <Route path="staff/:id/edit" element={<CreateStaffPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="settings/company" element={<CompanySettingsPage />} />
        <Route
          path="settings/company/profile"
          element={<CompanyProfilePage />}
        />
        <Route path="settings/company/hours" element={<BusinessHoursPage />} />
        <Route path="settings/company/locations" element={<LocationsPage />} />
        <Route path="settings/online-booking" element={<OnlineBookingPage />} />
        <Route path="settings/online-forms" element={<OnlineFormsPage />} />
        <Route
          path="settings/notifications/email"
          element={<EmailNotificationsPage />}
        />
        <Route
          path="settings/notifications/sms"
          element={<SMSNotificationsPage />}
        />
        <Route
          path="settings/notifications/app"
          element={<AppNotificationsPage />}
        />
        <Route path="settings/security" element={<SecuritySettingsPage />} />
        <Route
          path="settings/appearance"
          element={<AppearanceSettingsPage />}
        />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="reports/:type" element={<ReportDetails />} />
        <Route
          path="settings/integrations/apps/:id"
          element={<AppDetailsPage />}
        />
        <Route
          path="settings/subscription/test"
          element={
            <DevOnly>
              <SubscriptionTest />
            </DevOnly>
          }
        />
        <Route path="settings/billing/subscription" element={<SubscriptionDashboardPage />} />
      </Route>

      {/* Catch all route - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </RouterRoutes>
  );
}
