import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

class CategoryFiltersWidget extends StatelessWidget {
  final String selectedCategory;
  final ValueChanged<String> onCategorySelected;

  const CategoryFiltersWidget({
    super.key,
    required this.selectedCategory,
    required this.onCategorySelected,
  });

  static const List<Map<String, dynamic>> categories = [
    {'id': 'todos', 'label': 'Todos', 'icon': Icons.grid_view_rounded},
    {'id': 'vias', 'label': 'Vías', 'icon': Icons.add_road_rounded},
    {'id': 'alumbrado', 'label': 'Alumbrado', 'icon': Icons.lightbulb_rounded},
    {'id': 'basura', 'label': 'Residuos', 'icon': Icons.delete_outline_rounded},
    {'id': 'otros', 'label': 'Otros', 'icon': Icons.report_problem_rounded},
  ];

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 42,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: categories.length,
        separatorBuilder: (context, index) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final cat = categories[index];
          final isSelected = selectedCategory == cat['id'];

          return InkWell(
            onTap: () => onCategorySelected(cat['id'] as String),
            borderRadius: BorderRadius.circular(20),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: isSelected ? AppColors.primary : AppColors.cardBackground,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: isSelected ? AppColors.primaryLight : AppColors.border,
                  width: 1,
                ),
              ),
              child: Row(
                children: [
                  Icon(
                    cat['icon'] as IconData,
                    size: 16,
                    color: isSelected ? AppColors.textDark : AppColors.primaryLight,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    cat['label'] as String,
                    style: TextStyle(
                      color: isSelected ? AppColors.textDark : AppColors.textPrimary,
                      fontSize: 13,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
