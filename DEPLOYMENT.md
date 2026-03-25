# AKAAR Deployment Guide

This guide covers deploying the AKAAR e-commerce platform to production using:
- **Frontend (Next.js)**: Vercel
- **Backend (FastAPI)**: Railway
- **Database**: Railway PostgreSQL
- **Cache**: Railway Redis

## Prerequisites

Before deploying, ensure you have:
- [ ] Vercel account (https://vercel.com)
- [ ] Railway account (https://railway.app)
- [ ] Razorpay account with API keys
- [ ] AWS account with S3 bucket configured
- [ ] SMTP credentials (Gmail, SendGrid, etc.)

## Step 1: Deploy Backend to Railway

### 1.1 Create Railway Project

1. Go to [Railway](https://railway.app) and create a new project
2. Add PostgreSQL service:
   - Click "New" → "Database" → "Add PostgreSQL"
   - Copy the `DATABASE_URL` from the Variables tab

3. Add Redis service (optional):
   - Click "New" → "Database" → "Add Redis"
   - Copy the `REDIS_URL` from the Variables tab

### 1.2 Deploy API Service

1. Click "New" → "GitHub Repo"
2. Select your AKAAR repository
3. Configure the service:
   - **Root Directory**: `apps/api`
   - **Build Command**: (leave empty, uses Dockerfile)
   - **Start Command**: (leave empty, uses railway.toml)

4. Add Environment Variables:
   ```
   DATABASE_URL=<from PostgreSQL service>
   REDIS_URL=<from Redis service>
   SECRET_KEY=<generate: openssl rand -base64 32>
   AWS_ACCESS_KEY_ID=<your-aws-key>
   AWS_SECRET_ACCESS_KEY=<your-aws-secret>
   AWS_REGION=ap-south-1
   AWS_S3_BUCKET=<your-bucket-name>
   CORS_ORIGINS=https://your-vercel-domain.vercel.app
   ```

5. Deploy and note the generated domain (e.g., `akaar-api-production.up.railway.app`)

### 1.3 Run Database Migrations

After deployment, run migrations:
```bash
# Connect to Railway CLI
railway link
railway run npx prisma migrate deploy
railway run npx prisma db seed
```

## Step 2: Deploy Frontend to Vercel

### 2.1 Import Project

1. Go to [Vercel](https://vercel.com) and click "Add New Project"
2. Import your AKAAR repository
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/storefront`
   - **Build Command**: `cd ../.. && pnpm install && pnpm db:generate && pnpm --filter storefront build`
   - **Output Directory**: `.next`
   - **Install Command**: `cd ../.. && pnpm install`

### 2.2 Add Environment Variables

Add these environment variables in Vercel dashboard:

```
# Database
DATABASE_URL=<Railway PostgreSQL URL>

# Auth
AUTH_SECRET=<same as backend SECRET_KEY>
NEXTAUTH_SECRET=<same as AUTH_SECRET>
NEXTAUTH_URL=https://your-vercel-domain.vercel.app

# API URL
NEXT_PUBLIC_API_URL=https://your-railway-api.up.railway.app

# Razorpay
RAZORPAY_KEY_ID=<your-razorpay-key>
RAZORPAY_KEY_SECRET=<your-razorpay-secret>
NEXT_PUBLIC_RAZORPAY_KEY_ID=<your-razorpay-key>

# AWS S3
AWS_ACCESS_KEY_ID=<your-aws-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret>
AWS_REGION=ap-south-1
AWS_S3_BUCKET=<your-bucket-name>

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-email>
SMTP_PASS=<your-app-password>
EMAIL_FROM=noreply@yourdomain.com

# Optional: OAuth
GOOGLE_CLIENT_ID=<optional>
GOOGLE_CLIENT_SECRET=<optional>
GITHUB_CLIENT_ID=<optional>
GITHUB_CLIENT_SECRET=<optional>
```

### 2.3 Deploy

Click "Deploy" and wait for the build to complete.

## Step 3: Configure Custom Domain (Optional)

### Vercel (Frontend)
1. Go to Project Settings → Domains
2. Add your domain (e.g., `akaar.com`)
3. Configure DNS records as instructed

### Railway (Backend)
1. Go to Service Settings → Networking
2. Add custom domain (e.g., `api.akaar.com`)
3. Configure DNS CNAME record

## Step 4: Post-Deployment Checklist

- [ ] Test user registration and login
- [ ] Test product listing and search
- [ ] Test add to cart functionality
- [ ] Test checkout flow (with test Razorpay credentials first)
- [ ] Test email sending (password reset, order confirmation)
- [ ] Test file upload (3D models, images)
- [ ] Verify SSL certificates
- [ ] Set up monitoring (Vercel Analytics, Railway metrics)

## Environment Variables Summary

### Frontend (Vercel)
| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection string |
| AUTH_SECRET | Yes | NextAuth secret key |
| NEXTAUTH_URL | Yes | Frontend URL |
| RAZORPAY_KEY_ID | Yes | Razorpay API key |
| RAZORPAY_KEY_SECRET | Yes | Razorpay secret |
| AWS_ACCESS_KEY_ID | Yes | AWS access key |
| AWS_SECRET_ACCESS_KEY | Yes | AWS secret |
| AWS_S3_BUCKET | Yes | S3 bucket name |
| SMTP_HOST | Yes | SMTP server |
| SMTP_USER | Yes | SMTP username |
| SMTP_PASS | Yes | SMTP password |

### Backend (Railway)
| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection string |
| SECRET_KEY | Yes | JWT secret key |
| CORS_ORIGINS | Yes | Allowed frontend URLs |
| AWS_ACCESS_KEY_ID | Yes | AWS access key |
| AWS_SECRET_ACCESS_KEY | Yes | AWS secret |
| AWS_S3_BUCKET | Yes | S3 bucket name |
| REDIS_URL | No | Redis connection string |

## Troubleshooting

### Build Fails on Vercel
- Check that `pnpm-lock.yaml` is committed
- Verify root directory is set to `apps/storefront`
- Check build logs for missing environment variables

### API Connection Errors
- Verify CORS_ORIGINS includes the frontend URL
- Check Railway logs for startup errors
- Ensure DATABASE_URL is correctly formatted

### Database Connection Issues
- Verify `?sslmode=require` is in DATABASE_URL
- Check Railway PostgreSQL service is running
- Run `railway logs` to check for errors

## Support

For issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
