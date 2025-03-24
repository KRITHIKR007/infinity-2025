# INFINITY-2K25 - Annual Technical and Cultural Fest

The official website for INFINITY-2K25, the annual technical and cultural fest of Faculty of Engineering and Technology, Jain (Deemed-to-be University).

## Features

- Event showcase and registration
- Seamless payment integration with QR code
- Admin dashboard for registration management
- Responsive design for all devices

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Database: Supabase
- Authentication: Supabase Auth
- Storage: Supabase Storage
- Hosting: Vercel

## Setup Instructions

### Prerequisites
- Node.js v14 or higher
- Supabase account with project set up

### Environment Setup

1. Clone the repository
   ```
   git clone <repo-url>
   cd infinity-2k25
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Configure Supabase
   
   Create a `.env` file in the root directory with the following:
   ```
   SUPABASE_URL=https://ceickbodqhwfhcpabfdq.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlaWNrYm9kcWh3ZmhjcGFiZmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMzU2MTgsImV4cCI6MjA1NzkxMTYxOH0.ZyTG1FkQzjQ0CySlyvkQEYPHWBbZJd--vsB_IqILuo8
   SUPABASE_SERVICE_KEY=<your-service-key>  # Only needed for admin operations
   ```

4. Set up the database
   
   You need the Supabase service key to run this command:
   ```
   npm run setup-db
   ```

   This will create all necessary tables and policies in your Supabase project.

### Running the Website

Since this is a static website, you can serve it using any web server.

For development, you can use:
```
npx serve
```

## Database Setup

The website uses Supabase as its backend. The database consists of the following tables:

1. **events** - Stores event details
2. **registrations** - Stores participant registrations
3. **payments** - Stores payment information
4. **participants** - Stores participant information for each event

The database setup script in `supabase-setup.js` creates these tables and sets up the necessary permissions.

## Deployment

This project is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set the required environment variables in Vercel's project settings:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY` (for database setup during deployment)

See `DEPLOYMENT.md` for more detailed deployment instructions.

## Development

### Project Structure

- `/public` - Static assets (CSS, JS, images)
- `/pages` - HTML pages
- `/admin` - Admin panel pages
- `create-tables.sql` - SQL script for creating database tables
- `setup-policies.sql` - SQL script for setting up database policies
- `supabase-setup.js` - Script to initialize the database
- `supabase.js` - Supabase client initialization

### Registration System

The registration system allows participants to register for various events. It:

1. Collects participant information
2. Allows selection of events
3. Calculates the total fee
4. Processes payment information
5. Stores all data in the Supabase database

## Credits

Designed and developed by Krithik R. For the annual technical and cultural fest of Faculty of Engineering and Technology, Jain (Deemed-to-be University).

## Contributors

- Krithik R (Lead Developer)
- Dhrub Kumar Jha (Technical Events Coordinator)
- Rohan (Cultural Events Coordinator)

## License

MIT License