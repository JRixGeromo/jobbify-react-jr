// queries.ts
import { gql } from '@apollo/client';
import { apolloClient } from '@/lib/apollo';
import { supabase } from '@/lib/supabase';

export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: UUID!) {
    profilesCollection(filter: { id: { eq: $userId } }) {
      edges {
        node {
          id
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const GET_USER_SUBSCRIPTION = gql`
  query GetUserSubscription($userId: uuid!) {
    subscriptionsCollection(filter: { user_id: { eq: $userId } }) {
      edges {
        node {
          id
          status
          trial_end
          created_at
          updated_at
        }
      }
    }
  }
`;

export const GET_USER_SUBSCRIPTION_DETAILS = gql`
  query GetUserSubscriptionDetails($userId: uuid!) {
    subscriptionsCollection(filter: { user_id: { eq: $userId } }) {
      edges {
        node {
          id
          stripe_customer_id
          status
          current_period_end
          subscription_plans {
            name
          }
        }
      }
    }
  }
`;

export const GET_CLIENTS_QUERY = gql`
  query GetClients($companyId: ID!) {
    clientsCollection(filter: { company_id: { eq: $companyId } }) {
      edges {
        node {
          id
          first_name
          last_name
          email_address
          phone_number
          address
          image_path
          company
        }
      }
    }
  }
`;

export const GET_CLIENT_BY_ID_QUERY = gql`
  query GetClients($id: ID!) {
    clientsCollection(filter: { id: { eq: $id } }) {
      edges {
        node {
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
  }
`;

export const createCompanyIfNotExists = async (userId: any, fullName: any) => {
  try {
    const response = await apolloClient.query({
      query: gql`
        query CHECK_COMPANY_QUERY($ownerId: ID!) {
          companiesCollection(filter: { owner_id: { eq: $ownerId } }) {
            edges {
              node {
                id
              }
            }
          }
        }
      `,
      variables: { ownerId: userId },
    });

    if (response.data.companiesCollection.edges.length === 0) {
      console.log('No companies found. Creating a new company...');

      // Create a new company (you would need to define the mutation for this)
      const createResponse = await apolloClient.mutate({
        mutation: gql`
          mutation CreateClient($input: CreateClientInput!) {
            insertIntocompaniesCollection(objects: $input) {
              records {
                id
              }
            }
          }
        `,
        variables: {
          input: {
            name: `${fullName}'s company`,
            owner_id: userId,
          },
        },
      });

      const companyId =
        createResponse.data.insertIntocompaniesCollection.records[0].id;

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          company_id: companyId,
        },
      });

      if (updateError) {
        throw new Error(
          `Failed to update user metadata: ${updateError.message}`
        );
      }

      console.log('User metadata updated with company_id:', companyId);

      console.log('Company created:', createResponse);
    } else {
      console.log(
        'Company already exists:',
        response.data.companiesCollection.edges
      );
    }
  } catch (error: any) {
    console.error('Error checking or creating company:', error.message);
  }
};

export const GET_SERVICES_QUERY = gql`
  query GetServices($companyId: ID!) {
    servicesCollection(filter: { company_id: { eq: $companyId } }) {
      edges {
        node {
          id
          type
          category
          name
          sku
          price
          unit
          short_desc
          detailed_desc
          image_path
          tags
        }
      }
    }
  }
`;

export const GET_SERVICE_BY_ID = gql`
  query GetServiceById($id: ID!) {
    servicesCollection(filter: { id: { eq: $id } }) {
      edges {
        node {
          id
          type
          name
          short_desc
          detailed_desc
          sku
          category
          price
          unit
          image_path
          tags
          sub_frequency
          sub_details
        }
      }
    }
  }
`;

export const GET_STATUSES_BY_MODULE_QUERY = gql`
  query GetStatuses($module: Module!) {
    statusesCollection(filter: { module: { eq: $module } }) {
      edges {
        node {
          id
          module
          title
        }
      }
    }
  }
`;

export const GET_JOBS_QUERY = gql`
  query GetJobs($companyId: ID!) {
    jobsCollection(filter: { company_id: { eq: $companyId } }) {
      edges {
        node {
          id
          location
          notes
          start_date
          end_date
          start_time
          end_time
          recurring_schedule
          is_recurring
          image_path
          price
          tasks
          clients {
            id
            first_name
            last_name
          }
          services
          statuses {
            id
            title
          }
        }
      }
    }
  }
`;

export const GET_JOB_BY_ID = gql`
  query GetJobById($id: ID!) {
    jobsCollection(filter: { id: { eq: $id } }) {
      edges {
        node {
          id
          location
          notes
          start_date
          end_date
          start_time
          end_time
          recurring_schedule
          is_recurring
          image_path
          price
          tasks
          clients {
            id
            first_name
            last_name
          }
          services {
            id
            name
          }
          statuses {
            id
            title
          }
        }
      }
    }
  }
`;

export const GET_JOBS_BY_CLIENT_ID_QUERY = gql`
  query GetJobsByClientId($clientId: ID!) {
    jobsCollection(filter: { client_id: { eq: $clientId } }) {
      edges {
        node {
          id
          location
          notes
          start_date
          end_date
          start_time
          end_time
          recurring_schedule
          is_recurring
          image_path
          price
          tasks
          clients {
            id
            first_name
            last_name
          }
          services
          statuses {
            id
            title
          }
        }
      }
    }
  }
`;

export const GET_QUOTES_BY_CLIENT_ID_QUERY = gql`
  query GetQuotesByClientId($clientId: ID!) {
    quotesCollection(filter: { client_id: { eq: $clientId } }) {
      edges {
        node {
          id
          date
          service_id
          total
          status
        }
      }
    }
  }
`;

// Query to fetch quotes from the backend
// export const GET_QUOTES = gql`
//   query GetQuotes($companyId: String!) {
//     quotesCollection(filter: { company_id: { eq: $companyId } }) {
//       edges {
//         node {
//           id
//           client_id
//           service_id
//           date
//           subtotal
//           items
//           total
//           notes
//           terms
//           status
//         }
//       }
//     }
//   }
// `;
export const GET_QUOTES = gql`
  query GetQuotes(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $companyId: Int!
  ) {
    quotesCollection(
      filter: { company_id: { eq: $companyId } }
      first: $first
      after: $after
      last: $last
      before: $before
    ) {
      edges {
        node {
          id
          client_id
          service_id
          date
          subtotal
          items
          total
          notes
          terms
          status
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const GET_QUOTE_BY_ID = gql`
  query GetQuoteById($id: ID!) {
    quotesCollection(filter: { id: { eq: $id } }) {
      edges {
        node {
          id
          client_id
          service_id
          date
          due_date
          items
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
  }
`;

export const GET_INVOICES = gql`
  query GetInvoices(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $companyId: Int!
  ) {
    invoicesCollection(
      filter: { company_id: { eq: $companyId } }
      first: $first
      after: $after
      last: $last
      before: $before
    ) {
      edges {
        node {
          id
          quote_id
          company_id
          invoice_number
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
          created_by
          client_id
          service_id
          items
          subtotal
          tax_rate
          tax_amount
          discount_type
          discount_value
          discount_amount
          payment_term
          due_date
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const GET_INVOICE_BY_ID = gql`
  query GetInvoiceById($id: ID!) {
    invoicesCollection(filter: { id: { eq: $id } }) {
      edges {
        node {
          id
          quote_id
          company_id
          client_id
          service_id
          created_by
          invoice_number
          issued_date
          payment_due_date
          status
          payment_method
          amount_paid
          balance_due
          total
          notes
          terms
          items
          subtotal
          tax_rate
          tax_amount
          discount_type
          discount_value
          discount_amount
          created_at
          updated_at
        }
      }
    }
  }
`;

export const GET_USER_CREATION_DATE = gql`
  query GetUserCreationDate($userId: uuid!) {
    usersCollection(filter: { id: { eq: $userId } }) {
      edges {
        node {
          created_at
        }
      }
    }
  }
`;

export const GET_INVOICES_BY_CLIENT_ID_QUERY = gql`
  query GetInvoicesByClientId($clientId: ID!) {
    invoicesCollection(filter: { client_id: { eq: $clientId } }) {
      edges {
        node {
          id
          issued_date
          service_id
          total
          status
        }
      }
    }
  }
`;

export const GET_SERVICES_BY_COMPANY_ID_QUERY = gql`
  query GetServicesByCompanyId($companyId: ID!) {
    servicesCollection(filter: { company_id: { eq: $companyId } }) {
      edges {
        node {
          id
          name
          price
          category
        }
      }
    }
  }
`;

export const GET_COMPANY_PROFILE = gql`
  query GetCompanyProfile($companyId: ID!) {
    companiesCollection(filter: { id: { eq: $companyId } }) {
      edges {
        node {
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
  }
`;

export const GET_LOGS_BY_ENTITY_ID_QUERY = gql`
  query GetLogsByEntityId($entityId: uuid!) {
    logsCollection(filter: { entity_id: { eq: $entityId } }) {
      edges {
        node {
          id
          timestamp
          level
          message
          entity
          entity_id
          source
          meta
        }
      }
    }
  }
`;
