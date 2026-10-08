import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { db } from '../prisma/db.js';
import { env } from '../config/env.js';
import { HttpError } from '../lib/http-error.js';
import { toPublicUsuario } from './usuarios.service.js';

type UsuarioRow =
  Awaited<
    ReturnType<
      typeof db.orm.public.Usuarios.create
    >
  >;

export class AuthService {
  static async login(data: {
    email: string;
    password: string;
  }) {
    const email = data.email
      .trim()
      .toLowerCase();

    const usuario =
      await db.orm.public.Usuarios.first({
        email: email as UsuarioRow['email'],
      });

    if (
      !usuario ||
      !(await bcrypt.compare(
        data.password,
        usuario.senhaHash,
      ))
    ) {
      throw new HttpError(
        401,
        'Credenciais inválidas.',
      );
    }

    const token = jwt.sign(
      {
        id: String(usuario.id),
      },
      env.JWT_SECRET,
      {
        algorithm: 'HS256',
        expiresIn: '15m',
        issuer: 'sportmap-api',
        audience: 'sportmap',
      },
    );

    return {
      token,
      usuario: toPublicUsuario(usuario),
    };
  }
}