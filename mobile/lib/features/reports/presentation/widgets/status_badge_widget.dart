import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

class StatusBadgeWidget extends StatelessWidget {
  final String status;
  final bool isSmall;

  const StatusBadgeWidget({
    super.key,
    required this.status,
    this.isSmall = false,
  });

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color fg;
    String label;

    switch (status.toLowerCase()) {
      case 'pending':
        bg = AppColors.statusPending.withValues(alpha: 0.2);
        fg = AppColors.statusPending;
        label = 'Pendiente';
        break;
      case 'progress':
        bg = AppColors.statusProgress.withValues(alpha: 0.2);
        fg = AppColors.statusProgress;
        label = 'En Proceso';
        break;
      case 'resolved':
        bg = AppColors.statusResolved.withValues(alpha: 0.2);
        fg = AppColors.statusResolved;
        label = 'Resuelto';
        break;
      default:
        bg = AppColors.secondary.withValues(alpha: 0.2);
        fg = AppColors.secondary;
        label = status;
    }

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: isSmall ? 8 : 12,
        vertical: isSmall ? 3 : 6,
      ),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: fg.withValues(alpha: 0.6), width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: isSmall ? 6 : 8,
            height: isSmall ? 6 : 8,
            decoration: BoxDecoration(
              color: fg,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 6),
          Text(
            label,
            style: TextStyle(
              color: fg,
              fontSize: isSmall ? 11 : 13,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}
