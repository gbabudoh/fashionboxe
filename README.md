# Fashionboxe

A modern live-streaming fashion commerce platform that connects brands with customers through real-time virtual showrooms and personal shopping experiences.

## Features

- **Live Streaming Showrooms**: Real-time fashion shows with direct-from-stage ordering
- **Virtual Personal Shoppers**: One-on-one video consultations via Jitsi
- **Product Management**: Brands can manage inventory and showcase products
- **Secure Payments**: Stripe integration for seamless transactions
- **Image Management**: MinIO-based image storage and optimization
- **Real-time Chat**: Live chat during streaming events
- **Multi-brand Support**: Support for multiple fashion brands and concessions

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Storage**: MinIO (S3-compatible)
- **Video**: Jitsi Meet for video conferencing, Owncast for streaming
- **Payments**: Stripe
- **Communication**: Mattermost integration

## Prerequisites

- Node.js 18+
- PostgreSQL database
- MinIO instance
- Stripe account
- Jitsi server (optional, can use demo)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/gbabudoh/fashionboxe.git
cd fashionboxe
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Update `.env` with your configuration:
```
DATABASE_URL="postgresql://user:password@host:5432/fashionboxe"
MINIO_ENDPOINT="your-minio-endpoint"
MINIO_PORT=9000
MINIO_ACCESS_KEY="your-access-key"
MINIO_SECRET_KEY="your-secret-key"
STRIPE_SECRET_KEY="your-stripe-key"
JITSI_DOMAIN="your-jitsi-domain"
```

4. Set up the database:
```bash
npx prisma migrate deploy
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
fashionboxe/
├── app/
│   ├── api/              # API routes
│   ├── brand/            # Brand storefront pages
│   ├── dashboard/        # Brand dashboard
│   ├── showrooms/        # Showroom directory
│   └── page.tsx          # Home page
├── components/           # Reusable React components
├── lib/                  # Utilities and services
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## Key Pages

- `/` - Home page with featured brands
- `/showrooms` - Browse all active showrooms
- `/brand/[slug]` - Individual brand storefront with live stream
- `/dashboard/brand` - Brand management dashboard
- `/live` - Live streaming interface

## API Endpoints

- `GET /api/brands` - List all brands
- `POST /api/stripe/connect` - Stripe account setup
- `POST /api/products/[productId]/images` - Upload product images
- `POST /api/interactions/shopper` - Request personal shopper
- `POST /api/checkout` - Create checkout session

## Development

### Database Migrations

Create a new migration:
```bash
npx prisma migrate dev --name migration_name
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Build for Production

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `MINIO_ENDPOINT` | MinIO server endpoint |
| `MINIO_PORT` | MinIO server port |
| `MINIO_ACCESS_KEY` | MinIO access key |
| `MINIO_SECRET_KEY` | MinIO secret key |
| `STRIPE_SECRET_KEY` | Stripe API secret key |
| `JITSI_DOMAIN` | Jitsi server domain |
| `OWNCAST_ACCESS_TOKEN` | Owncast streaming token |

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is proprietary and confidential.

## Support

For support, email support@fashionboxe.com or open an issue on GitHub.

---

**Fashionboxe** - Disrupting the Runway. 2026
