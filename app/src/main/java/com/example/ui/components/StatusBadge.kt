package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.MatchStatus
import com.example.data.model.PriorityLevel
import com.example.ui.theme.ErrorRose
import com.example.ui.theme.ErrorRoseLight
import com.example.ui.theme.SkyAccent
import com.example.ui.theme.Slate100
import com.example.ui.theme.Slate700
import com.example.ui.theme.SuccessEmerald
import com.example.ui.theme.SuccessEmeraldLight
import com.example.ui.theme.WarningAmber
import com.example.ui.theme.WarningAmberLight

@Composable
fun MatchStatusBadge(
    status: MatchStatus,
    modifier: Modifier = Modifier
) {
    val (bgColor, textColor) = when (status) {
        MatchStatus.FULLY_MATCHED -> Pair(SuccessEmeraldLight, SuccessEmerald)
        MatchStatus.PARTIALLY_MATCHED -> Pair(WarningAmberLight, WarningAmber)
        MatchStatus.MISSING -> Pair(ErrorRoseLight, ErrorRose)
        MatchStatus.ADDITIONAL -> Pair(Slate100, Slate700)
    }

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(6.dp))
            .background(bgColor)
            .padding(horizontal = 8.dp, vertical = 3.dp)
    ) {
        Text(
            text = status.label,
            color = textColor,
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold
        )
    }
}

@Composable
fun PriorityBadge(
    priority: PriorityLevel,
    modifier: Modifier = Modifier
) {
    val (bgColor, textColor) = when (priority) {
        PriorityLevel.HIGH -> Pair(ErrorRoseLight, ErrorRose)
        PriorityLevel.MEDIUM -> Pair(WarningAmberLight, WarningAmber)
        PriorityLevel.LOW -> Pair(SuccessEmeraldLight, SuccessEmerald)
    }

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(6.dp))
            .background(bgColor)
            .padding(horizontal = 8.dp, vertical = 3.dp)
    ) {
        Text(
            text = priority.label,
            color = textColor,
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold
        )
    }
}

@Composable
fun ProficiencyChip(
    level: String,
    modifier: Modifier = Modifier
) {
    val color = when (level.lowercase()) {
        "expert" -> Color(0xFF7C3AED)
        "advanced" -> SkyAccent
        "intermediate" -> WarningAmber
        else -> SuccessEmerald
    }

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .background(color.copy(alpha = 0.12f))
            .padding(horizontal = 10.dp, vertical = 4.dp)
    ) {
        Text(
            text = level,
            color = color,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium
        )
    }
}
