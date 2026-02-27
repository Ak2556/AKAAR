# AKAAR

**3D Printing & Rapid Manufacturing Platform**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Enterprise-grade dual-pipeline platform for B2C retail and B2B manufacturing services. Built with Next.js 16, React 19, Three.js for 3D visualization, and a robust backend with PostgreSQL and Prisma.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Docker Deployment](#docker-deployment)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Deployment](#deployment)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Storefront
- **3D Product Viewer** - Interactive WebGL visualization with React Three Fiber
- **Product Catalog** - Dynamic filtering, search, and category navigation
- **Shopping Cart** - Persistent cart with real-time updates
- **Wishlist** - Save products for later
- **User Authentication** - Secure email/password auth with NextAuth.js
- **Checkout Flow** - Integrated Razorpay payment gateway
- **Quote System** - Request custom quotes for bulk/enterprise orders
- **Responsive Design** - Mobile-first UI with Tailwind CSS

### User Account
- Order history and tracking
- Address management
- Quote requests and status
- Profile settings

### Technical Highlights
- **React 19** with React Compiler for optimized performance
- **Server Components** for reduced client-side JavaScript
- **Turbopack** for fast development builds
- **Type-safe** end-to-end with TypeScript and Prisma

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **3D Graphics** | Three.js, React Three Fiber, Drei |
| **Animation** | Framer Motion |
| **Database** | PostgreSQL 16 |
| **ORM** | Prisma |
| **Authentication** | NextAuth.js v5 |
| **Payments** | Razorpay |
| **File Storage** | AWS S3 |
| **Email** | Nodemailer |
| **Monorepo** | Turborepo + pnpm |
| **Containerization** | Docker |

---

## Quick Start

### Prerequisites

- **Node.js** >= 20.x
- **pnpm** >= 8.15.0
- **Docker** & Docker Compose (for database)
- **PostgreSQL** 16 (or use Docker)

### One-Command Setup

```bash
# Clone and install
git clone https://github.com/Ak2556/AKAAR.git
cd AKAAR
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your values

# Start everything
pnpm start
```

This runs database setup, migrations, and starts the dev server.

---

## Installation

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ak2556/AKAAR.git
   cd AKAAR
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration (see [Environment Variables](#environment-variables))

4. **Start PostgreSQL**
   ```bash
   pnpm db:start
   ```

5. **Generate Prisma client**
   ```bash
   pnpm db:generate
   ```

6. **Run database migrations**
   ```bash
   pnpm db:migrate
   ```

7. **Seed the database** (optional)
   ```bash
   pnpm db:seed
   ```

8. **Start development server**
   ```bash
   pnpm dev
   ```

9. **Open the app**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## Docker Deployment

### Development with Docker

```bash
# Start all services (app + database)
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Production Build

```bash
# Build production image
docker build -t akaar:latest .

# Run production container
docker run -p 3000:3000 --env-file .env akaar:latest
```

### Docker Services

| Service | Port | Description |
|---------|------|-------------|
| `app` | 3000 | Next.js application |
| `postgres` | 5433 | PostgreSQL database |

---

## Project Structure

```
AKAAR/
├── apps/
│   └── storefront/              # Next.js 16 application
│       ├── src/
│       │   ├── app/             # App Router pages & API routes
│       │   │   ├── api/         # REST API endpoints
│       │   │   ├── auth/        # Authentication pages
│       │   │   ├── products/    # Product pages
│       │   │   ├── account/     # User account pages
│       │   │   └── ...
│       │   ├── components/      # React components
│       │   │   ├── three/       # 3D/WebGL components
│       │   │   ├── ui/          # Base UI components
│       │   │   ├── layout/      # Layout components
│       │   │   └── ...
│       │   ├── context/         # React contexts
│       │   ├── hooks/           # Custom hooks
│       │   ├── lib/             # Utility functions
│       │   └── config/          # Configuration
│       └── public/              # Static assets
├── packages/
│   └── db/                      # Database package
│       ├── prisma/
│       │   ├── schema.prisma    # Database schema
│       │   ├── migrations/      # Migration files
│       │   └── seed.ts          # Seed script
│       └── src/                 # Prisma client exports
├── docker-compose.yml           # Docker services
├── Dockerfile                   # Production Docker image
├── turbo.json                   # Turborepo config
├── pnpm-workspace.yaml          # Workspace config
└── package.json                 # Root package
```

---

## API Reference

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/[...nextauth]` | * | NextAuth.js handlers |
| `/api/auth/forgot-password` | POST | Request password reset |
| `/api/auth/reset-password` | POST | Reset password with token |
| `/api/auth/verify-reset-token` | POST | Verify reset token |

### Products

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | List all products |
| `/api/products/[slug]` | GET | Get product by slug |

### Orders

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/orders` | GET | List user orders |
| `/api/orders` | POST | Create new order |
| `/api/orders/[id]` | GET | Get order details |

### Quotes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/quotes` | GET | List user quotes |
| `/api/quotes` | POST | Create quote request |
| `/api/quotes/[id]` | GET | Get quote details |

### User

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/user/profile` | GET/PUT | Get/update profile |
| `/api/user/addresses` | GET/POST | Manage addresses |
| `/api/user/addresses/[id]` | PUT/DELETE | Update/delete address |
| `/api/user/orders` | GET | Get user orders |
| `/api/user/quotes` | GET | Get user quotes |

### Payments

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/payment/create-order` | POST | Create Razorpay order |
| `/api/payment/verify` | POST | Verify payment |

---

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<secure-password>
POSTGRES_DB=akaar
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5433/${POSTGRES_DB}

# Authentication
AUTH_SECRET=<generate-with-openssl-rand-base64-32>
AUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=${AUTH_SECRET}
NEXTAUTH_URL=${AUTH_URL}

# Razorpay
RAZORPAY_KEY_ID=<your-razorpay-key>
RAZORPAY_KEY_SECRET=<your-razorpay-secret>

# AWS S3
AWS_ACCESS_KEY_ID=<your-aws-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret>
AWS_REGION=ap-south-1
AWS_S3_BUCKET=<your-bucket-name>

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-email>
SMTP_PASS=<your-app-password>
EMAIL_FROM=noreply@yourdomain.com
```

### Generate Secrets

```bash
# Generate AUTH_SECRET
openssl rand -base64 32
```

---

## Database

### Schema Overview

The database includes the following models:

- **User** - User accounts and authentication
- **Account** - OAuth provider accounts
- **Session** - User sessions
- **Product** - Product catalog
- **Category** - Product categories
- **Order** - Customer orders
- **OrderItem** - Order line items
- **Quote** - Quote requests
- **QuoteItem** - Quote line items
- **Address** - User addresses
- **PasswordResetToken** - Password reset tokens

### Commands

```bash
# Start database container
pnpm db:start

# Stop database container
pnpm db:stop

# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Open Prisma Studio
pnpm db:studio

# Seed database
pnpm db:seed
```

---

## Deployment

### Vercel (Recommended)

1. **Connect repository** to Vercel
2. **Set environment variables** in project settings
3. **Deploy**

```bash
# Or deploy via CLI
npx vercel
```

### Docker (Self-hosted)

```bash
# Production deployment
docker-compose -f docker-compose.yml up -d

# With custom env file
docker-compose --env-file .env.production up -d
```

### Manual VPS

```bash
# Build
pnpm build

# Start production server
pnpm start
```

---

## Security

### Best Practices Implemented

- **Password Hashing** - bcrypt with salt rounds
- **CSRF Protection** - Built-in NextAuth.js protection
- **SQL Injection Prevention** - Prisma parameterized queries
- **XSS Protection** - React's automatic escaping
- **Secure Headers** - Next.js security headers
- **Environment Variables** - Secrets never in code
- **HTTPS** - Enforced in production

### Security Checklist

- [ ] Use strong, unique `AUTH_SECRET`
- [ ] Enable HTTPS in production
- [ ] Set secure cookie options
- [ ] Configure CORS properly
- [ ] Keep dependencies updated
- [ ] Use environment-specific configs

---

## Troubleshooting

### Common Issues

**Database connection failed**
```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart database
docker-compose restart postgres
```

**Prisma client not generated**
```bash
pnpm db:generate
```

**Port already in use**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

**Docker build fails**
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

---

## Commands Reference

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm db:start` | Start PostgreSQL container |
| `pnpm db:stop` | Stop PostgreSQL container |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm db:seed` | Seed database |
| `pnpm setup` | Full setup (db + generate + migrate) |

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with Next.js, React, and Three.js
</p>
