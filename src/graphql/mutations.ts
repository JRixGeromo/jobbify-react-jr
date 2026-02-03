import { gql } from '@apollo/client';

export const CREATE_TRIAL_SUBSCRIPTION = gql`
  mutation CreateTrialSubscription($userId: UUID!, $trialEnd: Datetime!) {
    insertIntosubscriptionsCollection(
      objects: [{ userId: $userId, status: "trialing", trialEnd: $trialEnd }]
    ) {
      records {
        id
        status
        trialEnd
      }
    }
  }
`;

export const UPDATE_SUBSCRIPTION = gql`
  mutation UpdateSubscription($id: UUID!, $status: String!, $plan: String) {
    updatesubscriptionsCollection(
      set: { status: $status, plan: $plan }
      filter: { id: { eq: $id } }
    ) {
      records {
        id
        status
        plan
      }
    }
  }
`;

export const CREATE_CLIENT = gql`
  mutation CreateClient($input: CreateClientInput!) {
    insertIntoclientsCollection(objects: $input) {
      records {
        id
        first_name
        last_name
        email_address
        phone_number
        address
        image_path
        company_id
        company
      }
    }
  }
`;

export const UPDATE_CLIENT = gql`
  mutation UpdateClient($id: ID!, $set: clientsSetInput!) {
    updateclientsCollection(filter: { id: { eq: $id } }, set: $set) {
      records {
        id
        first_name
        last_name
        email_address
        phone_number
        address
        image_path
        company_id
        company
      }
    }
  }
`;

export const DELETE_CLIENT_MUTATION = gql`
  mutation DeleteClient($id: ID!) {
    deleteFromclientsCollection(filter: { id: { eq: $id } }, atMost: 1) {
      affectedCount
      records {
        id
        full_name
        email_address
      }
    }
  }
`;

export const CREATE_CLIENT_COMPANY = gql`
  mutation CreateClientCompany($input: CreateClientInput!) {
    insertIntocompaniesCollection(objects: $input) {
      records {
        id
      }
    }
  }
`;

export const CREATE_ACCOUNT_COMPANY = gql`
  mutation CreateAccountCompany($input: CreateCompanyInput!) {
    insertIntocompaniesCollection(objects: $input) {
      records {
        id
        name
        logo_url
        legal_name
        tax_id
        email
        phone
        website
        street_address
        city
        state
        zip_code
        country
        primary_color
        accent_color
        invoice_prefix
        invoice_footer
        payment_terms
        account_name
        bank_name
        account_number
        routing_number
        swift_code
      }
    }
  }
`;

export const CREATE_QUOTE = gql`
  mutation CreateQuote($input: CreateQuoteInput!) {
    insertIntoquotesCollection(objects: [$input]) {
      records {
        id
        client_id # Updated to use client_id
        service_id # Updated to use service_id
        date
        due_date # Corrected field name
        subtotal
        tax_rate # Corrected field name
        tax_amount # Corrected field name
        discount_type # Corrected field name
        discount_value # Corrected field name
        discount_amount # Corrected field name
        total
        notes
        terms
        status
      }
    }
  }
`;

// Update quote
export const UPDATE_QUOTE = gql`
  mutation UpdateQuote($id: ID!, $input: UpdateQuoteInput!) {
    updatequotesCollection(
      set: $input
      filter: { id: { eq: $id } }
      atMost: 1
    ) {
      affectedCount
      records {
        id
        client_id # Updated to use client_id
        service_id # Updated to use service_id
        date
        due_date # Corrected field name
        subtotal
        tax_rate # Corrected field name
        tax_amount # Corrected field name
        discount_type # Corrected field name
        discount_value # Corrected field name
        discount_amount # Corrected field name
        total
        notes
        terms
        status
      }
    }
  }
`;

export const UPDATE_QUOTE_STATUS = gql`
  mutation UpdateQuoteStatus($id: ID!, $status: String!) {
    updatequotesCollection(
      set: { status: $status }
      filter: { id: { eq: $id } }
      atMost: 1
    ) {
      affectedCount
      records {
        id
        status
      }
    }
  }
`;

export const DELETE_QUOTE = gql`
  mutation DeleteQuote($id: ID!) {
    deleteFromquotesCollection(filter: { id: { eq: $id } }, atMost: 1) {
      affectedCount
      records {
        id
      }
    }
  }
`;

export const CREATE_JOB = gql`
  mutation CreateJobs($input: CreateJobInput!) {
    insertIntojobsCollection(objects: [$input]) {
      records {
        id
      }
    }
  }
`;

export const CREATE_JOB_TASKS = gql`
  mutation CreateJobTasks($input: CreateJobTasksInput!) {
    insertIntojob_tasksCollection(objects: $input) {
      records {
        id
      }
    }
  }
`;

export const UPDATE_JOB = gql`
  mutation UpdateJob($set: UpdateJobInput!, $id: ID!) {
    updatejobsCollection(set: $set, filter: { id: { eq: $id } }, atMost: 1) {
      affectedCount
      records {
        id
      }
    }
  }
`;

export const DELETE_JOB_MUTATION = gql`
  mutation DeleteClient($id: ID!) {
    deleteFromjobsCollection(filter: { id: { eq: $id } }, atMost: 1) {
      affectedCount
      records {
        id
      }
    }
  }
`;

export const CREATE_SERVICE = gql`
  mutation CreateService($input: CreateServiceInput!) {
    insertIntoservicesCollection(objects: [$input]) {
      records {
        id
      }
    }
  }
`;

export const DELETE_SERVICE = gql`
  mutation DeleteService($id: ID!) {
    deleteFromservicesCollection(filter: { id: { eq: $id } }, atMost: 1) {
      affectedCount
      records {
        id
      }
    }
  }
`;

export const UPDATE_SERVICE = gql`
  mutation UpdateService($id: ID!, $input: UpdateServiceInput!) {
    updateservicesCollection(
      set: $input
      filter: { id: { eq: $id } }
      atMost: 1
    ) {
      affectedCount
      records {
        id
      }
    }
  }
`;

export const CREATE_INVOICE = gql`
  mutation CreateInvoice($input: CreateInvoiceInput!) {
    insertIntoinvoicesCollection(objects: [$input]) {
      records {
        id
        invoice_number
        quote_id
        company_id
        created_by
        issued_date
        payment_due_date
        status
        payment_method
        amount_paid
        balance_due
        payment_reference
        is_finalized
        currency
        total
        notes
        terms
        created_at
        updated_at
      }
    }
  }
`;

export const DELETE_INVOICE = gql`
  mutation DeleteInvoice($id: ID!) {
    deleteFrominvoicesCollection(filter: { id: { eq: $id } }, atMost: 1) {
      affectedCount
      records {
        id
      }
    }
  }
`;

export const UPDATE_INVOICE_STATUS = gql`
  mutation UpdateInvoiceStatus($id: ID!, $status: String!) {
    updateinvoicesCollection(
      filter: { id: { eq: $id } }
      set: { status: $status }
    ) {
      records {
        id
        status
      }
    }
  }
`;

export const SEND_INVOICE_EMAIL = gql`
  mutation SendInvoiceEmail($id: ID!, $recipient: String!) {
    sendInvoiceEmail(input: { invoiceId: $id, recipient: $recipient }) {
      success
      message
    }
  }
`;

// Update Invoice
export const UPDATE_INVOICE = gql`
  mutation UpdateInvoice($id: ID!, $input: UpdateInvoiceInput!) {
    updateinvoicesCollection(
      set: $input
      filter: { id: { eq: $id } }
      atMost: 1
    ) {
      affectedCount
      records {
        id
        client_id
        service_id
        issued_date
        payment_due_date
        subtotal
        tax_rate
        tax_amount
        discount_type
        discount_value
        discount_amount
        total
        notes
        terms
        status
      }
    }
  }
`;

export const DELETE_JOBS_BY_CLIENT_MUTATION = gql`
  mutation DeleteJobsByClient($clientId: ID!) {
    deleteFromjobsCollection(filter: { client_id: { eq: $clientId } }) {
      affectedCount
    }
  }
`;

export const UPDATE_COMPANY = gql`
  mutation UpdateCompany($id: ID!, $input: UpdateCompanyInput!) {
    updatecompaniesCollection(
      set: $input
      filter: { id: { eq: $id } }
      atMost: 1
    ) {
      records {
        id
        name
        logo_url
        legal_name
        tax_id
        email
        phone
        website
        street_address
        city
        state
        zip_code
        country
        primary_color
        accent_color
        invoice_prefix
        invoice_footer
        payment_terms
        account_name
        bank_name
        account_number
        routing_number
        swift_code
      }
    }
  }
`;

export const UPDATE_COMPANY_PROFILE = gql`
  mutation UpdateCompanyProfile(
    $id: ID!,
    $name: String!,
    $legal_name: String!,
    $tax_id: String!,
    $email: String!,
    $phone: String!,
    $website: String!,
    $street_address: String!,
    $city: String!,
    $state: String!,
    $zip_code: String!,
    $country: String!,
    $primary_color: String!,
    $accent_color: String!,
    $invoice_prefix: String!,
    $invoice_footer: String!,
    $payment_terms: String!,
    $account_name: String!,
    $bank_name: String!,
    $account_number: String!,
    $routing_number: String!,
    $swift_code: String!,
    $logo_url: String!
  ) {
    updatecompaniesCollection(
      set: {
        name: $name,
        legal_name: $legal_name,
        tax_id: $tax_id,
        email: $email,
        phone: $phone,
        website: $website,
        street_address: $street_address,
        city: $city,
        state: $state,
        zip_code: $zip_code,
        country: $country,
        primary_color: $primary_color,
        accent_color: $accent_color,
        invoice_prefix: $invoice_prefix,
        invoice_footer: $invoice_footer,
        payment_terms: $payment_terms,
        account_name: $account_name,
        bank_name: $bank_name,
        account_number: $account_number,
        routing_number: $routing_number,
        swift_code: $swift_code,
        logo_url: $logo_url
      }
      filter: { id: { eq: $id } }
      atMost: 1
    ) {
      records {
        id
        name
        legal_name
        tax_id
        email
        phone
        website
        street_address
        city
        state
        zip_code
        country
        primary_color
        accent_color
        invoice_prefix
        invoice_footer
        payment_terms
        account_name
        bank_name
        account_number
        routing_number
        swift_code
        logo_url
      }
    }
  }
`;

export const CREATE_LOG = gql`
  mutation CreateLog($input: CreateLogInput!) {
    insertIntologsCollection(objects: [$input]) {
      records {
        id
      }
    }
  }
`;
