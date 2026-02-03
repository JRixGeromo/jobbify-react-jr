import { gql } from '@apollo/client';

// Fetch user subscription details
export const GET_USER_SUBSCRIPTION = gql`
  query GetUserSubscription($userId: UUID!) {
    subscriptions(where: { user_id: { _eq: $userId } }) {
      id
      stripe_customer_id
      stripe_subscription_id
      status
      current_period_start
      current_period_end
      cancel_at_period_end
      canceled_at
      trial_end
      price_id
      amount
      currency
      plan
    }
  }
`;

// Fetch available subscription prices
export const GET_SUBSCRIPTION_PRICES = gql`
  query GetSubscriptionPrices {
    subscription_prices(where: { active: { _eq: true } }) {
      price_id
      name
      unit_amount
      currency
      interval
      interval_count
      metadata
    }
  }
`;

// Mutation to create a checkout session
export const CREATE_CHECKOUT_SESSION = gql`
  mutation CreateCheckoutSession(
    $priceId: String!,
    $customerId: UUID!,
    $successUrl: String!,
    $cancelUrl: String!
  ) {
    createCheckoutSession(
      price_id: $priceId,
      customer_id: $customerId,
      success_url: $successUrl,
      cancel_url: $cancelUrl
    ) {
      session_id
      url
    }
  }
`;

// Fetch the latest subscription status
export const GET_SUBSCRIPTION_STATUS = gql`
  query GetSubscriptionStatus($userId: UUID!) {
    subscriptions(
      where: { user_id: { _eq: $userId } }
      order_by: { current_period_end: desc }
      limit: 1
    ) {
      status
      trial_end
      current_period_end
      plan
    }
  }
`;
