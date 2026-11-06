-- RBAC schema repair for databases that still use usuarios.role.
-- This is additive: preserve the legacy role column and events table.
BEGIN;

CREATE TABLE IF NOT EXISTS public.tipo_usuario (
  id integer PRIMARY KEY,
  code text NOT NULL UNIQUE,
  name text NOT NULL
);

INSERT INTO public.tipo_usuario (id, code, name)
VALUES
  (1, 'USUARIO', 'Usuario Comum'),
  (2, 'ADMIN', 'Administração')
ON CONFLICT DO NOTHING;

ALTER TABLE public.usuarios
  ADD COLUMN IF NOT EXISTS tipo_usuario_id integer;

-- Preserve existing administrator assignments from the legacy role column.
UPDATE public.usuarios
SET tipo_usuario_id = CASE WHEN role = 'ADMIN' THEN 2 ELSE 1 END
WHERE tipo_usuario_id IS NULL;

ALTER TABLE public.usuarios
  ALTER COLUMN tipo_usuario_id SET DEFAULT 1;

DO $migration$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'usuarios_tipo_usuario_id_fkey'
      AND conrelid = 'public.usuarios'::regclass
  ) THEN
    ALTER TABLE public.usuarios
      ADD CONSTRAINT usuarios_tipo_usuario_id_fkey
      FOREIGN KEY (tipo_usuario_id)
      REFERENCES public.tipo_usuario (id)
      ON DELETE RESTRICT;
  END IF;
END
$migration$;

CREATE INDEX IF NOT EXISTS usuarios_tipo_usuario_id_idx_c55ae311
  ON public.usuarios (tipo_usuario_id);

COMMIT;
