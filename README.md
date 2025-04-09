# Anthive

## Features

- User Authentication
  - Sign in with email/password
  - Profile setup with username, first name, and last name
  - Secure session management

- Folder Management
  - Create new folders with names and descriptions
  - View list of created folders
  - Delete folders with confirmation
  - Real-time folder name availability check

- User Interface
  - Modern, clean design
  - Responsive layout for mobile devices
  - Intuitive navigation
  - Loading states and error handling

## Tech Stack

- React Native
- Expo Router for navigation
- Supabase for backend services
  - Authentication
  - Database
  - Row Level Security (RLS)
- Tailwind CSS for styling
- TypeScript for type safety

## Project Structure

```
src/
├── components/
│   ├── Account.tsx
|   ├── Auth.tsx
│   ├── Button.tsx
│   ├── CreateFolderModal.tsx
│   ├── DeleteFolderModal.tsx
│   ├── ProfileSetupModal.tsx
|   ├── SignUp.tsx
│   └── SignIn.tsx
|   
├── lib/
│   └── supabase.ts
├── screens/
│   └── HomeScreen.tsx

```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file with your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```bash
   npx expo start
   ```
5. Run on your preferred platform:
   ```bash
   # Press 'i' for iOS simulator
   # Press 'a' for Android emulator
   # Or scan QR code with Expo Go app
   ```

## Database Schema

### Folders Table
```sql
create table folders (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  user_id uuid references auth.users not null
);

-- Enable Row Level Security
alter table folders enable row level security;

-- Create policies
create policy "Users can insert their own folders"
  on folders for insert
  with check (auth.uid() = user_id);

create policy "Users can select their own folders"
  on folders for select
  using (auth.uid() = user_id);

create policy "Users can delete their own folders"
  on folders for delete
  using (auth.uid() = user_id);
```

## Components

### Button
A reusable button component with multiple variants:
- Primary (default)
- Secondary
- Outline
- Danger (for delete actions)

### Modals
- ProfileSetupModal: For setting up user profile after sign-in
- CreateFolderModal: For creating new folders
- DeleteFolderModal: For confirming folder deletion

### Screens
- HomeScreen: Main screen displaying user's folders
- SignIn: Authentication screen


## License

This project is licensed under the MIT License - see the LICENSE file for details.
