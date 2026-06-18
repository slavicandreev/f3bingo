-- F3 Legacy Summer Bingo - Full Reset Script
-- WARNING: This drops all existing data. Run in the Supabase SQL editor.

-- 1. Drop triggers
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Drop functions
DROP FUNCTION IF EXISTS public.initialize_card_squares();
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Drop view
DROP VIEW IF EXISTS public.leaderboard_view;

-- 4. Drop tables (order matters for foreign keys)
DROP TABLE IF EXISTS public.card_squares;
DROP TABLE IF EXISTS public.bingo_items;
DROP TABLE IF EXISTS public.profiles;

-- 5. Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 6. Create bingo items table
CREATE TABLE public.bingo_items (
  id SERIAL PRIMARY KEY,
  position INTEGER NOT NULL UNIQUE CHECK (position >= 0 AND position <= 24),
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bingo_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bingo items are viewable by everyone"
  ON public.bingo_items FOR SELECT USING (true);

-- 7. Create card squares table
CREATE TABLE public.card_squares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_position INTEGER NOT NULL REFERENCES public.bingo_items(position),
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_position)
);

ALTER TABLE public.card_squares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Card squares are viewable by everyone"
  ON public.card_squares FOR SELECT USING (true);

CREATE POLICY "Users can insert own squares"
  ON public.card_squares FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own squares"
  ON public.card_squares FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own squares"
  ON public.card_squares FOR DELETE USING (auth.uid() = user_id);

-- 8. Create leaderboard view
CREATE OR REPLACE VIEW public.leaderboard_view AS
SELECT
  p.id AS user_id,
  p.display_name,
  p.avatar_url,
  COALESCE(COUNT(*) FILTER (WHERE cs.completed = true AND cs.item_position != 12), 0) AS completed_count,
  MAX(cs.completed_at) FILTER (WHERE cs.item_position != 12) AS last_completion_at,
  p.created_at AS account_created_at
FROM public.profiles p
LEFT JOIN public.card_squares cs ON cs.user_id = p.id
GROUP BY p.id, p.display_name, p.avatar_url, p.created_at
ORDER BY
  completed_count DESC,
  last_completion_at ASC NULLS LAST,
  account_created_at ASC;

-- 9. Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. Trigger: auto-initialize card squares on profile creation
CREATE OR REPLACE FUNCTION public.initialize_card_squares()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.card_squares (user_id, item_position, completed, completed_at)
  SELECT
    NEW.id,
    bi.position,
    CASE WHEN bi.position = 12 THEN true ELSE false END,
    CASE WHEN bi.position = 12 THEN now() ELSE NULL END
  FROM public.bingo_items bi;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.initialize_card_squares();

-- 11. Seed bingo items
INSERT INTO public.bingo_items (position, title) VALUES
(0,  'Q''d a beatdown'),
(1,  'Q''d 5 beatdowns'),
(2,  'Brought an FNG'),
(3,  'Brought 3 FNGs'),
(4,  'Completed a pre-run/pre-murph'),
(5,  'Stayed for Coffeteria'),
(6,  'Attended a 2nd F event'),
(7,  'Attended a 3rd F event'),
(8,  'Organized a 2nd F event'),
(9,  'Organized a 3rd F event'),
(10, 'Attended 10 beatdowns'),
(11, 'Attended 20 beatdowns'),
(12, 'FREE SPACE'),
(13, 'Posted at 3 different AOs'),
(14, 'Posted at 5 different AOs'),
(15, 'Posted in all 3 Legacy Regions'),
(16, 'Posted Downrange'),
(17, 'Picked up a leadership role'),
(18, 'EH''d a kotter'),
(19, 'Attended a Convergence'),
(20, 'Led 30 for 30 or attended'),
(21, 'Attended a Q Source'),
(22, 'Posted in Pax Essay'),
(23, 'Shared a Social Media Post'),
(24, 'Completed a Ruck');
