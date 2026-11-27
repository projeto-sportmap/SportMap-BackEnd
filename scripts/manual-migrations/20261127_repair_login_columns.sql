-- Restore the columns required by the published Usuarios contract.
-- Run inside one transaction with lock_timeout and statement_timeout set.
-- Existing users, passwords, user types, and existing role values are preserved.
ALTER TABLE public.usuarios
  ADD COLUMN IF NOT EXISTS foto_perfil_data text,
  ADD COLUMN IF NOT EXISTS foto_capa_data text;

DO $repair$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'usuarios' AND column_name = 'role'
  ) THEN
    ALTER TABLE public.usuarios ADD COLUMN role text NOT NULL DEFAULT 'USER';
    -- Mirror the current administrator assignment into the restored legacy field.
    UPDATE public.usuarios AS usuario
    SET role = 'ADMIN'
    FROM public.tipo_usuario AS tipo
    WHERE tipo.id = usuario.tipo_usuario_id AND tipo.code = 'ADMIN';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.usuarios'::regclass AND conname = 'ck_usuarios_role'
  ) THEN
    ALTER TABLE public.usuarios ADD CONSTRAINT ck_usuarios_role
      CHECK (role IN ('USER', 'MODERATOR', 'ADMIN'));
  END IF;
END;
$repair$;

CREATE INDEX IF NOT EXISTS idx_usuarios_role ON public.usuarios (role);
