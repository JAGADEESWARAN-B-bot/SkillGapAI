package com.example.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.ElectricBlue
import com.example.ui.theme.ErrorRose
import com.example.ui.theme.SkyAccent
import com.example.ui.theme.Slate200
import com.example.ui.theme.Slate700
import com.example.ui.theme.SuccessEmerald
import com.example.ui.theme.WarningAmber

@Composable
fun CoverageDonutChart(
    coveragePercentage: Double,
    gapPercentage: Double,
    modifier: Modifier = Modifier,
    sizeDp: Int = 160
) {
    val animatedCoverage = remember { Animatable(0f) }

    LaunchedEffect(coveragePercentage) {
        animatedCoverage.animateTo(
            targetValue = coveragePercentage.toFloat(),
            animationSpec = tween(durationMillis = 900)
        )
    }

    Box(
        modifier = modifier.size(sizeDp.dp),
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.size(sizeDp.dp)) {
            val strokeWidth = 18.dp.toPx()
            val diameter = size.minDimension - strokeWidth
            val topLeft = Offset(strokeWidth / 2, strokeWidth / 2)
            val arcSize = Size(diameter, diameter)

            // Background circle (Gap track)
            drawArc(
                color = Slate200,
                startAngle = -90f,
                sweepAngle = 360f,
                useCenter = false,
                topLeft = topLeft,
                size = arcSize,
                style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
            )

            // Coverage Arc
            val sweep = (animatedCoverage.value / 100f) * 360f
            if (sweep > 0f) {
                drawArc(
                    color = ElectricBlue,
                    startAngle = -90f,
                    sweepAngle = sweep,
                    useCenter = false,
                    topLeft = topLeft,
                    size = arcSize,
                    style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
                )
            }
        }

        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "${animatedCoverage.value.toInt()}%",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = ElectricBlue
            )
            Text(
                text = "Coverage",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Text(
                text = "Gap: ${gapPercentage.toInt()}%",
                fontSize = 11.sp,
                fontWeight = FontWeight.Medium,
                color = ErrorRose
            )
        }
    }
}

@Composable
fun ComparisonBarChart(
    matchedCount: Int,
    partialCount: Int,
    missingCount: Int,
    modifier: Modifier = Modifier
) {
    val total = (matchedCount + partialCount + missingCount).coerceAtLeast(1)
    val matchedPct = (matchedCount.toFloat() / total)
    val partialPct = (partialCount.toFloat() / total)
    val missingPct = (missingCount.toFloat() / total)

    Column(modifier = modifier.fillMaxWidth()) {
        // Multi-segment horizontal progress bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(14.dp)
                .clip(RoundedCornerShape(7.dp))
                .background(Slate200)
        ) {
            if (matchedPct > 0) {
                Box(
                    modifier = Modifier
                        .weight(matchedPct)
                        .height(14.dp)
                        .background(SuccessEmerald)
                )
            }
            if (partialPct > 0) {
                Box(
                    modifier = Modifier
                        .weight(partialPct)
                        .height(14.dp)
                        .background(WarningAmber)
                )
            }
            if (missingPct > 0) {
                Box(
                    modifier = Modifier
                        .weight(missingPct)
                        .height(14.dp)
                        .background(ErrorRose)
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Legend with counts
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            LegendItem(color = SuccessEmerald, label = "Matched", count = matchedCount)
            LegendItem(color = WarningAmber, label = "Partial", count = partialCount)
            LegendItem(color = ErrorRose, label = "Missing", count = missingCount)
        }
    }
}

@Composable
private fun LegendItem(
    color: Color,
    label: String,
    count: Int
) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Box(
            modifier = Modifier
                .size(10.dp)
                .clip(CircleShape)
                .background(color)
        )
        Spacer(modifier = Modifier.width(6.dp))
        Text(
            text = "$label ($count)",
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium,
            color = MaterialTheme.colorScheme.onSurface
        )
    }
}

@Composable
fun HistoryTrendChart(
    percentages: List<Double>,
    modifier: Modifier = Modifier
) {
    if (percentages.isEmpty()) return

    val cleanValues = if (percentages.size == 1) listOf(percentages[0], percentages[0]) else percentages

    Canvas(
        modifier = modifier
            .fillMaxWidth()
            .height(100.dp)
            .padding(horizontal = 8.dp, vertical = 12.dp)
    ) {
        val maxVal = 100f
        val stepX = size.width / (cleanValues.size - 1).coerceAtLeast(1)

        // Draw guideline at 50% and 80%
        val y50 = size.height - (50f / maxVal) * size.height
        val y80 = size.height - (80f / maxVal) * size.height
        drawLine(
            color = Slate200,
            start = Offset(0f, y50),
            end = Offset(size.width, y50),
            strokeWidth = 1.dp.toPx()
        )
        drawLine(
            color = Slate200,
            start = Offset(0f, y80),
            end = Offset(size.width, y80),
            strokeWidth = 1.dp.toPx()
        )

        // Plot points and line
        val points = cleanValues.mapIndexed { index, value ->
            val x = index * stepX
            val y = size.height - (value.toFloat().coerceIn(0f, 100f) / maxVal) * size.height
            Offset(x, y)
        }

        for (i in 0 until points.size - 1) {
            drawLine(
                color = ElectricBlue,
                start = points[i],
                end = points[i + 1],
                strokeWidth = 3.dp.toPx(),
                cap = StrokeCap.Round
            )
        }

        // Draw dots
        points.forEach { point ->
            drawCircle(
                color = ElectricBlue,
                radius = 5.dp.toPx(),
                center = point
            )
            drawCircle(
                color = Color.White,
                radius = 2.5.dp.toPx(),
                center = point
            )
        }
    }
}
