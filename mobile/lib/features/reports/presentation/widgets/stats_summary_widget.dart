import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../domain/entities/report_stats_entity.dart';

class StatsSummaryWidget extends StatelessWidget {
  final ReportStatsEntity stats;

  const StatsSummaryWidget({super.key, required this.stats});

  Widget _buildStatCard({
    required String title,
    required int count,
    required IconData icon,
    required Color color,
  }) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(
          color: AppColors.cardBackground,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border, width: 1),
        ),
        child: Column(
          children: [
            Icon(icon, size: 20, color: color),
            const SizedBox(height: 6),
            Text(
              count.toString(),
              style: TextStyle(
                color: color,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              title,
              style: const TextStyle(
                color: AppColors.textSecondary,
                fontSize: 10,
                fontWeight: FontWeight.w500,
              ),
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        _buildStatCard(
          title: 'Total',
          count: stats.total,
          icon: Icons.analytics_outlined,
          color: AppColors.textPrimary,
        ),
        const SizedBox(width: 8),
        _buildStatCard(
          title: 'Pendientes',
          count: stats.pending,
          icon: Icons.hourglass_empty_rounded,
          color: AppColors.statusPending,
        ),
        const SizedBox(width: 8),
        _buildStatCard(
          title: 'En Proceso',
          count: stats.progress,
          icon: Icons.sync_rounded,
          color: AppColors.statusProgress,
        ),
        const SizedBox(width: 8),
        _buildStatCard(
          title: 'Resueltos',
          count: stats.resolved,
          icon: Icons.check_circle_outline_rounded,
          color: AppColors.statusResolved,
        ),
      ],
    );
  }
}
