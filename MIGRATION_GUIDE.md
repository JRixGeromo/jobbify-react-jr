# Migration Guide: Supabase → PostgreSQL

This guide will help you migrate the Labor Grid application from Supabase to a standalone PostgreSQL database with a custom Node.js backend.

## Overview of Changes

### What's Being Replaced:
- **Supabase Auth** → Custom JWT authentication
- **Supabase Client** → Axios + REST API
- **Supabase Storage** → Local/Cloud file storage
- **Supabase Real-time** → (Optional) WebSocket implementation

### What Stays the Same:
- **Database Schema** (mostly identical)
- **Frontend Components** (minimal changes)
- **Application Logic** (same functionality)

## Step-by-Step Migration

### 1. Database Setup

#### Install PostgreSQL
```bash
# On Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# On macOS
brew install postgresql

# On Windows
# Download from https://www.postgresql.org/download/windows/
```

#### Create Database
```sql
-- Connect to PostgreSQL as postgres user
psql -U postgres

-- Create database
CREATE DATABASE labor_grid;

-- Create user (optional, for security)
CREATE USER labor_grid_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE labor_grid TO labor_grid_user;
```

#### Run Setup Scripts
```bash
# Run database setup
psql -U postgres -d labor_grid -f database/setup.sql

# Run schema creation
psql -U postgres -d labor_grid -f database/schema.sql

# Run sample data (optional)
psql -U postgres -d labor_grid -f supabase/sample_data.sql
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/labor_grid
JWT_SECRET=your-super-secret-jwt-key
PORT=3001
```

#### Start Backend Server
```bash
npm run dev
```

### 3. Frontend Updates

#### Update Dependencies
```bash
# Remove Supabase dependencies
npm uninstall @supabase/supabase-js @supabase/auth-ui-react @supabase/auth-ui-shared

# Install axios (if not already installed)
npm install axios
```

#### Update Environment Variables
Create `.env.local` in the frontend:
```env
VITE_API_URL=http://localhost:3001
```

#### Update Import Statements
Replace Supabase imports with PostgreSQL client:

```typescript
// Before
import { supabase } from '@/lib/supabase';

// After
import { auth, db } from '@/lib/postgres';
```

#### Update Auth Context
Update `src/contexts/AuthContext.tsx` to use the new auth functions.

### 4. API Routes Implementation

Complete the backend API routes:

#### Companies API (`backend/routes/companies.js`)
#### Clients API (`backend/routes/clients.js`)
#### Services API (`backend/routes/services.js`)
#### Quotes API (`backend/routes/quotes.js`)
#### Invoices API (`backend/routes/invoices.js`)
#### Subscriptions API (`backend/routes/subscriptions.js`)

### 5. File Storage Setup

#### Option 1: Local Storage
Create `uploads` directory and configure multer.

#### Option 2: Cloud Storage
Integrate with AWS S3, Google Cloud Storage, or similar.

### 6. Testing

#### Test Authentication
1. Register a new user
2. Login with the user
3. Test password reset

#### Test CRUD Operations
1. Create a company
2. Add clients
3. Create quotes
4. Test file uploads

## Benefits of Migration

### ✅ Pros:
- **Full Control**: Complete control over database and backend
- **Cost Effective**: No Supabase subscription fees
- **Performance**: Potentially better performance
- **Customization**: Can add custom features easily
- **Security**: Full control over security implementation

### ⚠️ Cons:
- **More Work**: Requires backend development
- **Maintenance**: You're responsible for updates and security
- **Features**: Lose some Supabase-specific features (real-time, etc.)
- **Scaling**: Need to handle scaling yourself

## Migration Checklist

- [ ] Set up PostgreSQL database
- [ ] Run database migration scripts
- [ ] Set up Node.js backend
- [ ] Implement authentication routes
- [ ] Implement CRUD API routes
- [ ] Set up file storage
- [ ] Update frontend imports
- [ ] Update environment variables
- [ ] Test all functionality
- [ ] Deploy to production

## Rollback Plan

If you need to rollback to Supabase:

1. Keep the Supabase project active during migration
2. Maintain a branch with Supabase code
3. Update environment variables to point back to Supabase
4. Revert frontend imports
5. Deploy Supabase version

## Next Steps

After migration:

1. **Monitor Performance**: Check database and API performance
2. **Security Audit**: Review security implementations
3. **Backup Strategy**: Implement regular database backups
4. **Monitoring**: Add logging and monitoring
5. **Scaling**: Plan for horizontal scaling if needed

## Support

For issues during migration:
1. Check PostgreSQL logs
2. Review backend server logs
3. Test API endpoints with Postman/Insomnia
4. Verify database connections
5. Check CORS configuration
