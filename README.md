# AKAAR - 3D Printing & Rapid Manufacturing Platform

Elite dual-pipeline platform for B2C retail and B2B enterprise manufacturing.

## One-Click Deploy

### Windows
```powershell
.\scripts\deploy.ps1
```

### Linux/Mac
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### What Gets Deployed
- **Storefront** → http://localhost:3000
- **Geometry Service** → http://localhost:8000
- **MinIO Console** → http://localhost:9001
- **PostgreSQL** → localhost:5432
- **Redis** → localhost:6379

---

## Manual Setup

### Prerequisites
- Node.js 20+
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/akaar.git
cd akaar

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your values

# Generate Prisma client
cd packages/db && pnpm prisma generate

# Start database (if using Docker)
docker-compose up -d postgres redis minio

# Run migrations
pnpm db:push

# Seed database
pnpm db:seed

# Start development
pnpm dev
```

---

## Architecture

```
akaar/
├── apps/
│   ├── storefront/          # Next.js 14 (App Router)
│   └── geometry-service/    # FastAPI (Python)
├── packages/
│   ├── db/                  # Prisma ORM
│   └── types/               # Shared TypeScript types
└── docker-compose.yml
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React, Tailwind CSS, Shadcn UI |
| 3D Viewer | React Three Fiber, Three.js |
| State | Zustand |
| Auth | NextAuth.js (JWT) |
| Database | PostgreSQL + Prisma |
| File Storage | AWS S3 / MinIO |
| Payments | Razorpay |
| CAD Processing | FastAPI + CadQuery |
| Cache | Redis |

---

## Features

### B2C Pipeline
- Drag-and-drop STL/OBJ upload
- WebGL 3D model viewer
- Real-time pricing engine
- Guest checkout with Razorpay

### B2B Enterprise Portal
- NDA signing workflow
- Bulk STEP/IGES upload
- Quote management
- NET30 payment terms
- Material certifications

### Admin Control Plane
- Order Kanban board
- Quote review & pricing
- User management

---

## Deployment

### Vercel (Storefront)

```bash
cd apps/storefront
vercel
```

Required environment variables:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

### Railway (Geometry Service)

```bash
cd apps/geometry-service
railway up
```

### Docker (Self-hosted)

```bash
docker-compose up -d
```

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | JWT secret (generate with `openssl rand -base64 32`) | Yes |
| `NEXTAUTH_URL` | App URL (e.g., `https://akaar.com`) | Yes |
| `RAZORPAY_KEY_ID` | Razorpay API key | Yes |
| `RAZORPAY_KEY_SECRET` | Razorpay secret | Yes |
| `AWS_ACCESS_KEY_ID` | S3/MinIO access key | Yes |
| `AWS_SECRET_ACCESS_KEY` | S3/MinIO secret | Yes |
| `AWS_S3_BUCKET` | S3 bucket name | Yes |
| `REDIS_URL` | Redis connection string | Optional |

---

## Commands

```bash
# Development
pnpm dev              # Start all services
pnpm build            # Build all packages
pnpm lint             # Lint code
pnpm type-check       # Type check

# Database
pnpm db:push          # Push schema
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed data
pnpm db:studio        # Open Prisma Studio

# Docker
make up               # Start containers
make down             # Stop containers
make logs             # View logs
make rebuild          # Rebuild & restart
```

---

## License

MIT
