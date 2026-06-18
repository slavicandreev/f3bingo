-- F3 Legacy Summer Bingo - Schema Migration

-- 1. Profiles table
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

-- 2. Bingo items table
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

-- 3. Card squares table
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

-- 4. Leaderboard view
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

-- 5. Trigger: auto-create profile on signup
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

-- 6. Trigger: auto-initialize card squares on profile creation
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
