#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/04e69f3baf0b04be06340a1d7c8c1e6e6e31ee3e85eec8305ed08d71f368f2f0/contract';
import endContract from '../../snapshots/04e69f3baf0b04be06340a1d7c8c1e6e6e31ee3e85eec8305ed08d71f368f2f0/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/d4f501c84c7d22c82aa53763701a498d3574eb2faecc574f0e0da80adf7bdc76/contract';
import startContract from '../../snapshots/d4f501c84c7d22c82aa53763701a498d3574eb2faecc574f0e0da80adf7bdc76/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'usuarios',
        column: col('foto_perfil_data', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'usuarios',
        column: col('foto_capa_data', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
