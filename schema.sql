-- Schema Principal para Infinity Finance (Multi-tenant)
-- Rode este script no painel SQL Editor do Supabase.

-- Habilitar a extensão "uuid-ossp" se ainda não estiver
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Perfil de Usuários (Users Profile)
-- Conectada diretamente ao built-in auth.users do Supabase
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar Row Level Security (RLS) para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas (Policies) para profiles
-- Cada tenant/usuário só pode ver e alterar o SEU PRÓPRIO perfil.
CREATE POLICY "Usuários podem ver o próprio perfil" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Usuários podem alterar o próprio perfil" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Trigger para criar o profile automaticamente ao criar usuário no Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Associando a trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. Tabela de Contas Bancárias (Accounts)
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL, -- Ex: 'Nubank', 'Santander'
  institution TEXT, -- 'NUBANK', 'ITAU'
  type TEXT DEFAULT 'checking', -- 'checking', 'savings', 'credit'
  balance DECIMAL(15, 2) DEFAULT 0.00 NOT NULL,
  color TEXT DEFAULT '#24c45c',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

GRANT ALL ON public.accounts TO authenticated;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner apenas" on public.accounts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- 3. Tabela de Cartões (Cards)
CREATE TABLE IF NOT EXISTS public.cards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- Ex: 'Cartão Inter Preto'
  last_four_digits VARCHAR(4),
  credit_limit DECIMAL(15, 2) DEFAULT 0.00 NOT NULL,
  closing_day INTEGER,
  due_day INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

GRANT ALL ON public.cards TO authenticated;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner apenas" on public.cards FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- 4. Tabela de Categorias (Categories)
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT,
  icon TEXT,
  type TEXT NOT NULL, -- 'income' ou 'expense'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

GRANT ALL ON public.categories TO authenticated;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner apenas" on public.categories FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- 5. Tabela de Transações / Lançamentos (Transactions)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
  card_id UUID REFERENCES public.cards(id) ON DELETE CASCADE, -- opcional
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  amount DECIMAL(15, 2) NOT NULL, -- Negativo para despesas, positivo para receitas
  description TEXT NOT NULL,
  date DATE NOT NULL,
  is_paid BOOLEAN DEFAULT false,
  type TEXT NOT NULL, -- 'income', 'expense' ou 'transfer'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

GRANT ALL ON public.transactions TO authenticated;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner apenas" on public.transactions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Configuração inicial completa para Infinity Finance.
