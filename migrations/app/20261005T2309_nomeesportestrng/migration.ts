#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/0c0734babd6eeb868fee1f281ca96963022475611560e9f170f465daa35f8599/contract';
import startContract from '../../snapshots/0c0734babd6eeb868fee1f281ca96963022475611560e9f170f465daa35f8599/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/ed0637bfbe013c2a96d716a499b52f870e763d8e97a7cb39959e0fb1eff56ffc/contract';
import endContract from '../../snapshots/ed0637bfbe013c2a96d716a499b52f870e763d8e97a7cb39959e0fb1eff56ffc/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'anuncio_favoritos',
        columns: [
          col('anuncio_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'BIGSERIAL', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('usuario_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
        ],
        constraints: [primaryKey(['id'], { name: 'anuncio_favoritos_pkey' })],
      }),
      this.createTable({
        schema: 'public',
        table: 'anuncio_midias',
        columns: [
          col('anuncio_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('id', 'BIGSERIAL', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('ordem', 'int2', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int2@1' },
          }),
          col('url', 'character varying(500)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 500 } },
          }),
        ],
        constraints: [
          primaryKey(['id'], { name: 'anuncio_midias_pkey' }),
          checkExpression('ck_anuncio_midias_ordem', '(ordem >= 0)'),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'anuncios',
        columns: [
          col('cidade', 'character varying(100)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('condicao', 'character varying(15)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 15 } },
          }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('descricao', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('esporte_id', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'BIGSERIAL', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('latitude', 'numeric(9,6)', {
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 9, scale: 6 } },
          }),
          col('longitude', 'numeric(9,6)', {
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 9, scale: 6 } },
          }),
          col('preco', 'numeric(10,2)', {
            notNull: true,
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 10, scale: 2 } },
          }),
          col('status', 'character varying(15)', {
            notNull: true,
            default: lit('ativo'),
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 15 } },
          }),
          col('titulo', 'character varying(150)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('usuario_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
        ],
        constraints: [
          primaryKey(['id'], { name: 'anuncios_pkey' }),
          checkExpression(
            'ck_anuncios_condicao',
            "((condicao)::text = ANY ((ARRAY['novo'::character varying, 'seminovo'::character varying, 'usado'::character varying])::text[]))",
          ),
          checkExpression('ck_anuncios_coord', '((latitude IS NULL) = (longitude IS NULL))'),
          checkExpression(
            'ck_anuncios_lat',
            "((latitude >= ('-90'::integer)::numeric) AND (latitude <= (90)::numeric))",
          ),
          checkExpression(
            'ck_anuncios_lng',
            "((longitude >= ('-180'::integer)::numeric) AND (longitude <= (180)::numeric))",
          ),
          checkExpression('ck_anuncios_preco', '(preco >= (0)::numeric)'),
          checkExpression(
            'ck_anuncios_status',
            "((status)::text = ANY ((ARRAY['ativo'::character varying, 'pausado'::character varying, 'vendido'::character varying, 'removido'::character varying])::text[]))",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'atividades',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('descricao', 'character varying(500)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 500 } },
          }),
          col('esporte_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('expira_em', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'BIGSERIAL', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('latitude', 'numeric(9,6)', {
            notNull: true,
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 9, scale: 6 } },
          }),
          col('longitude', 'numeric(9,6)', {
            notNull: true,
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 9, scale: 6 } },
          }),
          col('status', 'character varying(20)', {
            notNull: true,
            default: lit('aberta'),
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 20 } },
          }),
          col('usuario_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
        ],
        constraints: [
          primaryKey(['id'], { name: 'atividades_pkey' }),
          checkExpression('ck_atividades_expira', '(expira_em > created_at)'),
          checkExpression(
            'ck_atividades_lat',
            "((latitude >= ('-90'::integer)::numeric) AND (latitude <= (90)::numeric))",
          ),
          checkExpression(
            'ck_atividades_lng',
            "((longitude >= ('-180'::integer)::numeric) AND (longitude <= (180)::numeric))",
          ),
          checkExpression(
            'ck_atividades_status',
            "((status)::text = ANY ((ARRAY['aberta'::character varying, 'em_andamento'::character varying, 'concluida'::character varying, 'cancelada'::character varying, 'expirada'::character varying])::text[]))",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'avaliacoes',
        columns: [
          col('anuncio_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('avaliado_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('avaliador_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('comentario', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'BIGSERIAL', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('nota', 'int2', { notNull: true, codecRef: { codecId: 'pg/int2@1' } }),
        ],
        constraints: [
          primaryKey(['id'], { name: 'avaliacoes_pkey' }),
          checkExpression('ck_avaliacoes_diferentes', '(avaliado_id <> avaliador_id)'),
          checkExpression('ck_avaliacoes_nota', '((nota >= 1) AND (nota <= 5))'),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'comentarios',
        columns: [
          col('conteudo', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'BIGSERIAL', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('publicacao_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('usuario_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
        ],
        constraints: [
          primaryKey(['id'], { name: 'comentarios_pkey' }),
          checkExpression('ck_comentarios_conteudo', '(length(btrim(conteudo)) > 0)'),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'compartilhamentos',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'BIGSERIAL', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('publicacao_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('usuario_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
        ],
        constraints: [primaryKey(['id'], { name: 'compartilhamentos_pkey' })],
      }),
      this.createTable({
        schema: 'public',
        table: 'conversa_participantes',
        columns: [
          col('conversa_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('usuario_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
        ],
        constraints: [primaryKey(['id'], { name: 'conversa_participantes_pkey' })],
      }),
      this.createTable({
        schema: 'public',
        table: 'conversas',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'BIGSERIAL', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('tipo', 'character varying(10)', {
            notNull: true,
            default: lit('direta'),
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 10 } },
          }),
        ],
        constraints: [
          primaryKey(['id'], { name: 'conversas_pkey' }),
          checkExpression(
            'ck_conversas_tipo',
            "((tipo)::text = ANY ((ARRAY['direta'::character varying, 'grupo'::character varying])::text[]))",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'curtidas',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'BIGSERIAL', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('publicacao_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('usuario_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
        ],
        constraints: [primaryKey(['id'], { name: 'curtidas_pkey' })],
      }),
      this.createTable({
        schema: 'public',
        table: 'esportes',
        columns: [
          col('cor', 'character varying(7)', {
            notNull: true,
            default: lit('#000000'),
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 7 } },
          }),
          col('icone', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('nome', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id'], { name: 'esportes_pkey' }),
          checkExpression('ck_esportes_cor', "((cor)::text ~ '^#[0-9A-Fa-f]{6}$'::text)"),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'mensagens',
        columns: [
          col('conteudo', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('conversa_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'BIGSERIAL', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('lida', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('remetente_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
        ],
        constraints: [
          primaryKey(['id'], { name: 'mensagens_pkey' }),
          checkExpression('ck_mensagens_conteudo', '(length(btrim(conteudo)) > 0)'),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'publicacao_midias',
        columns: [
          col('id', 'BIGSERIAL', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('ordem', 'int2', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int2@1' },
          }),
          col('publicacao_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('tipo', 'character varying(10)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 10 } },
          }),
          col('url', 'character varying(500)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 500 } },
          }),
        ],
        constraints: [
          primaryKey(['id'], { name: 'publicacao_midias_pkey' }),
          checkExpression('ck_publicacao_midias_ordem', '(ordem >= 0)'),
          checkExpression(
            'ck_publicacao_midias_tipo',
            "((tipo)::text = ANY ((ARRAY['imagem'::character varying, 'video'::character varying])::text[]))",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'publicacoes',
        columns: [
          col('conteudo', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('esporte_id', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'BIGSERIAL', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('latitude', 'numeric(9,6)', {
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 9, scale: 6 } },
          }),
          col('longitude', 'numeric(9,6)', {
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 9, scale: 6 } },
          }),
          col('usuario_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
        ],
        constraints: [
          primaryKey(['id'], { name: 'publicacoes_pkey' }),
          checkExpression('ck_publicacoes_coord', '((latitude IS NULL) = (longitude IS NULL))'),
          checkExpression(
            'ck_publicacoes_lat',
            "((latitude >= ('-90'::integer)::numeric) AND (latitude <= (90)::numeric))",
          ),
          checkExpression(
            'ck_publicacoes_lng',
            "((longitude >= ('-180'::integer)::numeric) AND (longitude <= (180)::numeric))",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'seguidores',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'BIGSERIAL', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('seguido_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('seguidor_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
        ],
        constraints: [
          primaryKey(['id'], { name: 'seguidores_pkey' }),
          checkExpression('ck_seguidores_diferentes', '(seguidor_id <> seguido_id)'),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'usuario_esportes',
        columns: [
          col('esporte_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'BIGSERIAL', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('nivel', 'character varying(20)', {
            notNull: true,
            default: lit('iniciante'),
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 20 } },
          }),
          col('usuario_id', 'int8', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
        ],
        constraints: [
          primaryKey(['id'], { name: 'usuario_esportes_pkey' }),
          checkExpression(
            'ck_usuario_esportes_nivel',
            "((nivel)::text = ANY ((ARRAY['iniciante'::character varying, 'intermediario'::character varying, 'avancado'::character varying, 'profissional'::character varying])::text[]))",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'usuarios',
        columns: [
          col('bio', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('cidade', 'character varying(100)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('email', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('foto_perfil_url', 'character varying(500)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 500 } },
          }),
          col('id', 'BIGSERIAL', { notNull: true, codecRef: { codecId: 'pg/int8@1' } }),
          col('latitude', 'numeric(9,6)', {
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 9, scale: 6 } },
          }),
          col('longitude', 'numeric(9,6)', {
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 9, scale: 6 } },
          }),
          col('nome', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('senha_hash', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('sobrenome', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('username', 'character varying(30)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 30 } },
          }),
        ],
        constraints: [
          primaryKey(['id'], { name: 'usuarios_pkey' }),
          checkExpression('ck_usuarios_coord', '((latitude IS NULL) = (longitude IS NULL))'),
          checkExpression(
            'ck_usuarios_lat',
            "((latitude >= ('-90'::integer)::numeric) AND (latitude <= (90)::numeric))",
          ),
          checkExpression(
            'ck_usuarios_lng',
            "((longitude >= ('-180'::integer)::numeric) AND (longitude <= (180)::numeric))",
          ),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'anuncio_favoritos',
        constraint: 'uq_anuncio_favoritos',
        columns: ['usuario_id', 'anuncio_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'anuncio_midias',
        constraint: 'uq_anuncio_midias_ord',
        columns: ['anuncio_id', 'ordem'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'avaliacoes',
        constraint: 'uq_avaliacoes',
        columns: ['avaliador_id', 'anuncio_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'conversa_participantes',
        constraint: 'uq_conversa_participantes',
        columns: ['conversa_id', 'usuario_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'curtidas',
        constraint: 'uq_curtidas',
        columns: ['publicacao_id', 'usuario_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'esportes',
        constraint: 'esportes_nome_key',
        columns: ['nome'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'publicacao_midias',
        constraint: 'uq_publicacao_midias_ord',
        columns: ['publicacao_id', 'ordem'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'seguidores',
        constraint: 'uq_seguidores',
        columns: ['seguidor_id', 'seguido_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'usuario_esportes',
        constraint: 'uq_usuario_esportes',
        columns: ['usuario_id', 'esporte_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'usuarios',
        constraint: 'usuarios_email_key',
        columns: ['email'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'usuarios',
        constraint: 'usuarios_username_key',
        columns: ['username'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'anuncio_favoritos',
        index: 'ix_anuncio_favoritos_anuncio',
        columns: ['anuncio_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'anuncios',
        index: 'ix_anuncios_busca',
        columns: ['status', 'esporte_id', 'cidade'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'anuncios',
        index: 'ix_anuncios_coord',
        columns: ['latitude', 'longitude'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'anuncios',
        index: 'ix_anuncios_usuario',
        columns: ['usuario_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'atividades',
        index: 'ix_atividades_esporte',
        columns: ['esporte_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'atividades',
        index: 'ix_atividades_mapa',
        columns: ['status', 'expira_em', 'latitude', 'longitude'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'atividades',
        index: 'ix_atividades_usuario',
        columns: ['usuario_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'avaliacoes',
        index: 'ix_avaliacoes_anuncio',
        columns: ['anuncio_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'avaliacoes',
        index: 'ix_avaliacoes_avaliado',
        columns: ['avaliado_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'comentarios',
        index: 'ix_comentarios_publicacao',
        columns: ['publicacao_id', 'created_at'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'comentarios',
        index: 'ix_comentarios_usuario',
        columns: ['usuario_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'compartilhamentos',
        index: 'ix_compartilhamentos_publicacao',
        columns: ['publicacao_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'compartilhamentos',
        index: 'ix_compartilhamentos_usuario',
        columns: ['usuario_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'conversa_participantes',
        index: 'ix_conversa_part_usuario',
        columns: ['usuario_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'curtidas',
        index: 'ix_curtidas_usuario',
        columns: ['usuario_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'mensagens',
        index: 'ix_mensagens_conversa',
        columns: ['conversa_id', 'created_at'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'mensagens',
        index: 'ix_mensagens_remetente',
        columns: ['remetente_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'publicacoes',
        index: 'ix_publicacoes_esporte',
        columns: ['esporte_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'publicacoes',
        index: 'ix_publicacoes_feed',
        columns: ['usuario_id', 'created_at'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'seguidores',
        index: 'ix_seguidores_seguido',
        columns: ['seguido_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'usuario_esportes',
        index: 'ix_usuario_esportes_esporte',
        columns: ['esporte_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'usuarios',
        index: 'ix_usuarios_coord',
        columns: ['latitude', 'longitude'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'anuncio_favoritos',
        foreignKey: {
          name: 'fk_anuncio_favoritos_anuncio',
          columns: ['anuncio_id'],
          references: { schema: 'public', table: 'anuncios', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'anuncio_favoritos',
        foreignKey: {
          name: 'fk_anuncio_favoritos_usuario',
          columns: ['usuario_id'],
          references: { schema: 'public', table: 'usuarios', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'anuncio_midias',
        foreignKey: {
          name: 'fk_anuncio_midias_anuncio',
          columns: ['anuncio_id'],
          references: { schema: 'public', table: 'anuncios', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'anuncios',
        foreignKey: {
          name: 'fk_anuncios_esporte',
          columns: ['esporte_id'],
          references: { schema: 'public', table: 'esportes', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'anuncios',
        foreignKey: {
          name: 'fk_anuncios_usuario',
          columns: ['usuario_id'],
          references: { schema: 'public', table: 'usuarios', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'atividades',
        foreignKey: {
          name: 'fk_atividades_esporte',
          columns: ['esporte_id'],
          references: { schema: 'public', table: 'esportes', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'atividades',
        foreignKey: {
          name: 'fk_atividades_usuario',
          columns: ['usuario_id'],
          references: { schema: 'public', table: 'usuarios', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'avaliacoes',
        foreignKey: {
          name: 'fk_avaliacoes_anuncio',
          columns: ['anuncio_id'],
          references: { schema: 'public', table: 'anuncios', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'avaliacoes',
        foreignKey: {
          name: 'fk_avaliacoes_avaliado',
          columns: ['avaliado_id'],
          references: { schema: 'public', table: 'usuarios', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'avaliacoes',
        foreignKey: {
          name: 'fk_avaliacoes_avaliador',
          columns: ['avaliador_id'],
          references: { schema: 'public', table: 'usuarios', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'comentarios',
        foreignKey: {
          name: 'fk_comentarios_publicacao',
          columns: ['publicacao_id'],
          references: { schema: 'public', table: 'publicacoes', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'comentarios',
        foreignKey: {
          name: 'fk_comentarios_usuario',
          columns: ['usuario_id'],
          references: { schema: 'public', table: 'usuarios', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'compartilhamentos',
        foreignKey: {
          name: 'fk_compartilhamentos_publicacao',
          columns: ['publicacao_id'],
          references: { schema: 'public', table: 'publicacoes', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'compartilhamentos',
        foreignKey: {
          name: 'fk_compartilhamentos_usuario',
          columns: ['usuario_id'],
          references: { schema: 'public', table: 'usuarios', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'conversa_participantes',
        foreignKey: {
          name: 'fk_conversa_participantes_conversa',
          columns: ['conversa_id'],
          references: { schema: 'public', table: 'conversas', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'conversa_participantes',
        foreignKey: {
          name: 'fk_conversa_participantes_usuario',
          columns: ['usuario_id'],
          references: { schema: 'public', table: 'usuarios', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'curtidas',
        foreignKey: {
          name: 'fk_curtidas_publicacao',
          columns: ['publicacao_id'],
          references: { schema: 'public', table: 'publicacoes', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'curtidas',
        foreignKey: {
          name: 'fk_curtidas_usuario',
          columns: ['usuario_id'],
          references: { schema: 'public', table: 'usuarios', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'mensagens',
        foreignKey: {
          name: 'fk_mensagens_conversa',
          columns: ['conversa_id'],
          references: { schema: 'public', table: 'conversas', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'mensagens',
        foreignKey: {
          name: 'fk_mensagens_remetente',
          columns: ['remetente_id'],
          references: { schema: 'public', table: 'usuarios', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'publicacao_midias',
        foreignKey: {
          name: 'fk_publicacao_midias_publicacao',
          columns: ['publicacao_id'],
          references: { schema: 'public', table: 'publicacoes', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'publicacoes',
        foreignKey: {
          name: 'fk_publicacoes_esporte',
          columns: ['esporte_id'],
          references: { schema: 'public', table: 'esportes', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'publicacoes',
        foreignKey: {
          name: 'fk_publicacoes_usuario',
          columns: ['usuario_id'],
          references: { schema: 'public', table: 'usuarios', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'seguidores',
        foreignKey: {
          name: 'fk_seguidores_seguido',
          columns: ['seguido_id'],
          references: { schema: 'public', table: 'usuarios', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'seguidores',
        foreignKey: {
          name: 'fk_seguidores_seguidor',
          columns: ['seguidor_id'],
          references: { schema: 'public', table: 'usuarios', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'usuario_esportes',
        foreignKey: {
          name: 'fk_usuario_esportes_esporte',
          columns: ['esporte_id'],
          references: { schema: 'public', table: 'esportes', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'usuario_esportes',
        foreignKey: {
          name: 'fk_usuario_esportes_usuario',
          columns: ['usuario_id'],
          references: { schema: 'public', table: 'usuarios', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
