-- Add the activities table required by POST /atividades.
-- Keep the legacy public.eventos table and all existing user columns intact.
BEGIN;

CREATE TABLE IF NOT EXISTS public.atividades (
  created_at timestamptz NOT NULL DEFAULT now(),
  descricao text,
  esporte_id integer NOT NULL,
  expira_em timestamptz NOT NULL,
  id bigserial PRIMARY KEY,
  latitude numeric(9, 6) NOT NULL,
  longitude numeric(9, 6) NOT NULL,
  status text NOT NULL DEFAULT 'aberta',
  usuario_id bigint NOT NULL,
  CONSTRAINT ck_eventos_status CHECK (
    status IN ('aberta', 'em_andamento', 'concluida', 'cancelada', 'expirada')
  )
);

CREATE INDEX IF NOT EXISTS atividades_esporte_id_idx_7759dc20
  ON public.atividades (esporte_id);
CREATE INDEX IF NOT EXISTS atividades_usuario_id_idx_65b6616a
  ON public.atividades (usuario_id);

DO $migration$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'fk_eventos_esporte'
      AND conrelid = 'public.atividades'::regclass
  ) THEN
    ALTER TABLE public.atividades
      ADD CONSTRAINT fk_eventos_esporte
      FOREIGN KEY (esporte_id) REFERENCES public.esportes (id)
      ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'fk_eventos_usuario'
      AND conrelid = 'public.atividades'::regclass
  ) THEN
    ALTER TABLE public.atividades
      ADD CONSTRAINT fk_eventos_usuario
      FOREIGN KEY (usuario_id) REFERENCES public.usuarios (id)
      ON DELETE CASCADE;
  END IF;
END
$migration$;

COMMIT;
