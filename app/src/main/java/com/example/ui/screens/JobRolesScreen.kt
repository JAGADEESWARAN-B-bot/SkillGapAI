package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.JobRole
import com.example.data.model.RequiredSkill
import com.example.ui.theme.ElectricBlue
import com.example.ui.theme.SuccessEmerald
import com.example.ui.viewmodel.MainViewModel

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun JobRolesScreen(
    viewModel: MainViewModel,
    onNavigateToAnalyze: () -> Unit,
    modifier: Modifier = Modifier
) {
    val roles by viewModel.availableRoles.collectAsState()
    val selectedRole by viewModel.selectedRole.collectAsState()

    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("All") }
    var showCustomRoleDialog by remember { mutableStateOf(false) }

    val categories = listOf("All", "Data & AI", "Frontend", "Backend", "Cloud & DevOps", "Security", "Mobile", "Design & UX")

    val filteredRoles = roles.filter { role ->
        val matchesQuery = role.title.contains(searchQuery, ignoreCase = true) ||
                role.description.contains(searchQuery, ignoreCase = true)
        val matchesCategory = selectedCategory == "All" || role.category.equals(selectedCategory, ignoreCase = true)
        matchesQuery && matchesCategory
    }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showCustomRoleDialog = true },
                containerColor = ElectricBlue,
                contentColor = Color.White,
                modifier = Modifier.testTag("fab_add_custom_role")
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add custom role")
            }
        }
    ) { paddingValues ->
        Column(
            modifier = modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp)
        ) {
            Text(
                text = "Target Career Roles",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )
            Text(
                text = "Select an industry role to benchmark your skills and build a roadmap",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(modifier = Modifier.height(14.dp))

            // Search
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("search_job_roles_input"),
                placeholder = { Text("Search roles (e.g. Data Analyst, Cloud)...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                trailingIcon = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(onClick = { searchQuery = "" }) {
                            Icon(Icons.Default.Clear, contentDescription = null)
                        }
                    }
                },
                singleLine = true,
                shape = RoundedCornerShape(14.dp)
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Categories horizontal scroll
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                categories.forEach { cat ->
                    FilterChip(
                        selected = selectedCategory == cat,
                        onClick = { selectedCategory = cat },
                        label = { Text(cat, fontSize = 12.sp) },
                        shape = RoundedCornerShape(16.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(filteredRoles, key = { it.id }) { role ->
                    val isSelected = role.id == selectedRole.id

                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("role_card_${role.id}"),
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = MaterialTheme.colorScheme.surface
                        ),
                        border = if (isSelected) BorderStroke(2.dp, ElectricBlue) else null,
                        elevation = CardDefaults.cardElevation(defaultElevation = if (isSelected) 4.dp else 1.dp)
                    ) {
                        Column(modifier = Modifier.padding(18.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = role.title,
                                        fontSize = 18.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.onSurface
                                    )
                                    Text(
                                        text = "${role.category} • ${role.averageSalaryRange}",
                                        fontSize = 12.sp,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }

                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = ElectricBlue.copy(alpha = 0.12f)
                                ) {
                                    Text(
                                        text = "${role.demandLevel} Demand",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = ElectricBlue,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            Text(
                                text = role.description,
                                fontSize = 13.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                lineHeight = 18.sp
                            )

                            Spacer(modifier = Modifier.height(12.dp))

                            Text(
                                text = "Required Skills (${role.requiredSkills.size}):",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = MaterialTheme.colorScheme.onSurface
                            )

                            Spacer(modifier = Modifier.height(6.dp))

                            FlowRow(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(6.dp),
                                verticalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                role.requiredSkills.forEach { req ->
                                    Surface(
                                        shape = RoundedCornerShape(8.dp),
                                        color = MaterialTheme.colorScheme.surfaceVariant
                                    ) {
                                        Text(
                                            text = "${req.name} (${req.requiredLevel.take(3)})",
                                            fontSize = 11.sp,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                                        )
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(14.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.End
                            ) {
                                if (isSelected) {
                                    Button(
                                        onClick = onNavigateToAnalyze,
                                        colors = ButtonDefaults.buttonColors(containerColor = SuccessEmerald),
                                        shape = RoundedCornerShape(10.dp)
                                    ) {
                                        Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text("Selected (Run Gap Analysis)")
                                    }
                                } else {
                                    Button(
                                        onClick = { viewModel.selectTargetRole(role) },
                                        shape = RoundedCornerShape(10.dp),
                                        modifier = Modifier.testTag("btn_select_role_${role.id}")
                                    ) {
                                        Text("Select as Target Role")
                                    }
                                }
                            }
                        }
                    }
                }

                item {
                    Spacer(modifier = Modifier.height(60.dp))
                }
            }
        }
    }

    if (showCustomRoleDialog) {
        CustomRoleDialog(
            onDismiss = { showCustomRoleDialog = false },
            onConfirm = { customRole ->
                viewModel.addCustomTargetRole(customRole)
                showCustomRoleDialog = false
            }
        )
    }
}

@Composable
private fun CustomRoleDialog(
    onDismiss: () -> Unit,
    onConfirm: (JobRole) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var category by remember { mutableStateOf("Backend") }
    var description by remember { mutableStateOf("") }
    var skillsInput by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Create Custom Target Role", fontWeight = FontWeight.Bold) },
        text = {
            Column(modifier = Modifier.fillMaxWidth()) {
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("Role Title *") },
                    placeholder = { Text("e.g. Golang Microservices Specialist") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(10.dp))

                OutlinedTextField(
                    value = description,
                    onValueChange = { description = it },
                    label = { Text("Description") },
                    placeholder = { Text("Brief description of role responsibilities") },
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(10.dp))

                OutlinedTextField(
                    value = skillsInput,
                    onValueChange = { skillsInput = it },
                    label = { Text("Required Skills (Comma separated) *") },
                    placeholder = { Text("e.g. Go, Docker, Kubernetes, PostgreSQL, gRPC") },
                    modifier = Modifier.fillMaxWidth(),
                    supportingText = { Text("Enter skill names separated by commas") }
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (title.isNotBlank() && skillsInput.isNotBlank()) {
                        val reqSkills = skillsInput.split(",")
                            .map { it.trim() }
                            .filter { it.isNotEmpty() }
                            .map { skillName ->
                                RequiredSkill(
                                    name = skillName,
                                    category = "Tools",
                                    requiredLevel = "Intermediate",
                                    isCore = true
                                )
                            }

                        val id = "custom_" + title.lowercase().replace(" ", "_").filter { it.isLetterOrDigit() || it == '_' }
                        val customRole = JobRole(
                            id = id,
                            title = title.trim(),
                            category = category,
                            description = if (description.isNotBlank()) description.trim() else "Custom user-defined career role target.",
                            averageSalaryRange = "$70,000 - $120,000",
                            demandLevel = "High",
                            requiredSkills = reqSkills,
                            isCustom = true
                        )
                        onConfirm(customRole)
                    }
                }
            ) {
                Text("Create Role")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}
