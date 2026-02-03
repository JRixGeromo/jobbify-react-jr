import { format } from 'date-fns';
import { gql, useMutation } from '@apollo/client';
import { CREATE_LOG } from '../graphql/mutations';
import { validate as isUUID } from 'uuid';

// Define log levels
const levels = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

// Define types for log function parameters
interface LogMeta {
  userId?: string;
  [key: string]: any;
}

// Log function
const log = (level: string, message: string, meta: LogMeta) => {
  const timestamp = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
  const logEntry = {
    timestamp,
    level,
    message,
    ...meta,
  };
  console.log(JSON.stringify(logEntry));
};

// Export log functions
export const logInfo = (message: string, meta: LogMeta = {}) => log(levels.INFO, message, meta);
export const logWarn = (message: string, meta: LogMeta = {}) => log(levels.WARN, message, meta);
export const logError = (message: string, meta: LogMeta = {}) => log(levels.ERROR, message, meta);

export const useLogActivity = () => {
  const [createLog] = useMutation(CREATE_LOG);

  const logActivity = async ({
    level,
    message,
    userId,
    entity,
    entityId,
    source,
    meta,
  }: {
    level: string;
    message: string;
    userId?: string;
    entity: string;
    entityId?: string;
    source: string;
    meta: object;
  }) => {
    try {
      // Validate UUIDs
      // if (userId && !isUUID(userId)) {
      //   console.warn(`Invalid userId: ${userId}. Skipping userId.`);
      //   userId = undefined; // Clear invalid userId
      // }
      // if (entityId && !isUUID(entityId)) {
      //   console.warn(`Invalid entityId: ${entityId}. Skipping entityId.`);
      //   entityId = undefined; // Clear invalid entityId
      // }

      console.log('Logging activity:', {
        level,
        message,
        userId,
        entity,
        entityId,
        source,
        meta,
      });

      const response = await createLog({
        variables: {
          input: {
            level,
            message,
            user_id: userId,
            entity,
            entity_id: entityId,
            source,
            meta: JSON.stringify(meta),
          },
        },
      });

      console.log('Log entry created:', response.data);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  return logActivity;
}; 