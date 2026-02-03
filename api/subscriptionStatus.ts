import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Assuming you have access to the subscription data from AuthContext
  const isSubscribed = req.body.subscriptionsCollection.edges.some((edge: { node: { status: string } }) => edge.node.status === 'active');

  const subscriptionStatus = {
    active: isSubscribed,
  };

  return res.status(200).json(subscriptionStatus);
}
