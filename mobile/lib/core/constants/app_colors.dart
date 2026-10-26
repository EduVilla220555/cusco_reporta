import 'package:flutter/material.dart';

/// Paleta cromática oficial de Cusco Reporta (Santiago Reporta)
/// Basada en el sistema de diseño institucional definido en PROTOTIPO.html
class AppColors {
  AppColors._();

  // Colores primarios y acentos
  static const Color primary = Color(0xFF7CC551);
  static const Color primaryLight = Color(0xFFE2FF67);
  static const Color secondary = Color(0xFFA0AEC0);

  // Fondos y superficies
  static const Color background = Color(0xFF113F2B);
  static const Color cardBackground = Color(0xFF0E6037);
  static const Color cardSurfaceLight = Color(0xFF165434);
  static const Color border = Color(0xFF348B44);

  // Tipografía
  static const Color textPrimary = Color(0xFFE2E8F0);
  static const Color textSecondary = Color(0xFFA0AEC0);
  static const Color textDark = Color(0xFF113F2B);

  // Estados semánticos
  static const Color statusPending = Color(0xFFED8936);
  static const Color statusProgress = Color(0xFF4299E1);
  static const Color statusResolved = Color(0xFF7CC551);
  static const Color statusRejected = Color(0xFFF56565);

  // Prioridades
  static const Color priorityLow = Color(0xFF48BB78);
  static const Color priorityMedium = Color(0xFFECC94B);
  static const Color priorityHigh = Color(0xFFE53E3E);
}
