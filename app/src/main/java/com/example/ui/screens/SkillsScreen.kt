package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
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
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.ProficiencyLevel
import com.example.data.model.SkillCategory
import com.example.data.model.UserSkill
import com.example.ui.components.ProficiencyChip
import com.example.ui.theme.ElectricBlue
import com.example.ui.theme.ErrorRose
import com.example.ui.viewmodel.MainViewModel

@Composable
fun SkillsScreen(
    viewModel: MainViewModel,
    modifier: Modifier = Modifier
) {
    val skills by viewModel.userSkills.collectAsState()

    var searchQuery by remember { mutableStateOf("") }
    var selectedCategoryFilter by remember { mutableStateOf("All") }
    var sortBy by remember { mutableStateOf("Name") } // Name, Proficiency, Category

    var showAddDialog by remember { mutableStateOf(false) }
    var editingSkill by remember { mutableStateOf<UserSkill?>(null) }
    var skillToDelete by remember { mutableStateOf<UserSkill?>(null) }

    val categories = listOf("All") + SkillCategory.entries.map { it.displayName }

    // Filter and Sort Logic
    val filteredSkills = skills
        .filter { skill ->
            val matchesQuery = skill.name.contains(searchQuery, ignoreCase = true) ||
                    skill.category.contains(searchQuery, ignoreCase = true)
            val matchesCat = selectedCategoryFilter == "All" || skill.category.equals(selectedCategoryFilter, ignoreCase = true)
            matchesQuery && matchesCat
        }
        .sortedWith { a, b ->
            when (sortBy) {
                "Proficiency" -> {
                    val pA = ProficiencyLevel.fromString(a.proficiency).score
                    val pB = ProficiencyLevel.fromString(b.proficiency).score
                    pB.compareTo(pA) // High to Low
                }
                "Category" -> a.category.compareTo(b.category)
                else -> a.name.compareTo(b.name, ignoreCase = true)
            }
        }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddDialog = true },
                containerColor = ElectricBlue,
                contentColor = androidx.compose.ui.graphics.Color.White,
                modifier = Modifier.testTag("fab_add_skill")
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Skill")
            }
        }
    ) { paddingValues ->
        Column(
            modifier = modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Current Skills (${skills.size})",
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Text(
                        text = "Track your technical and soft competencies",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                if (skills.isEmpty()) {
                    OutlinedButton(
                        onClick = { viewModel.loadDemoData() },
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text("Demo Skills", fontSize = 11.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Search Bar
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("search_skills_input"),
                placeholder = { Text("Search skill name or category...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                trailingIcon = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(onClick = { searchQuery = "" }) {
                            Icon(Icons.Default.Clear, contentDescription = "Clear search")
                        }
                    }
                },
                singleLine = true,
                shape = RoundedCornerShape(14.dp)
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Category Filter Chips
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                categories.forEach { cat ->
                    FilterChip(
                        selected = selectedCategoryFilter == cat,
                        onClick = { selectedCategoryFilter = cat },
                        label = { Text(cat, fontSize = 12.sp) },
                        shape = RoundedCornerShape(16.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Sort Selector Bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Showing ${filteredSkills.size} of ${skills.size}",
                    fontSize = 12.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("Sort: ", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    listOf("Name", "Proficiency", "Category").forEach { sortOption ->
                        TextButton(
                            onClick = { sortBy = sortOption },
                            modifier = Modifier.padding(horizontal = 2.dp)
                        ) {
                            Text(
                                text = sortOption,
                                fontSize = 11.sp,
                                fontWeight = if (sortBy == sortOption) FontWeight.Bold else FontWeight.Normal,
                                color = if (sortBy == sortOption) ElectricBlue else MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            if (filteredSkills.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = if (skills.isEmpty()) "No skills added yet." else "No matching skills found.",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Medium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Button(
                            onClick = { showAddDialog = true },
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Icon(Icons.Default.Add, contentDescription = null)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Add Your First Skill")
                        }
                    }
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(filteredSkills, key = { it.id }) { skill ->
                        SkillItemCard(
                            skill = skill,
                            onEdit = { editingSkill = skill },
                            onDelete = { skillToDelete = skill }
                        )
                    }
                    item {
                        Spacer(modifier = Modifier.height(60.dp))
                    }
                }
            }
        }
    }

    // Add Skill Dialog
    if (showAddDialog) {
        SkillEditDialog(
            title = "Add New Skill",
            initialSkill = null,
            onDismiss = { showAddDialog = false },
            onConfirm = { name, cat, prof, months ->
                viewModel.addSkill(name, cat, prof, months)
                showAddDialog = false
            }
        )
    }

    // Edit Skill Dialog
    if (editingSkill != null) {
        SkillEditDialog(
            title = "Edit Skill",
            initialSkill = editingSkill,
            onDismiss = { editingSkill = null },
            onConfirm = { name, cat, prof, months ->
                viewModel.updateSkill(
                    editingSkill!!.copy(
                        name = name,
                        category = cat,
                        proficiency = prof,
                        experienceMonths = months
                    )
                )
                editingSkill = null
            }
        )
    }

    // Confirm Delete Dialog
    if (skillToDelete != null) {
        AlertDialog(
            onDismissRequest = { skillToDelete = null },
            title = { Text("Delete Skill?") },
            text = { Text("Are you sure you want to remove ${skillToDelete!!.name} from your profile?") },
            confirmButton = {
                TextButton(
                    onClick = {
                        viewModel.deleteSkill(skillToDelete!!.id)
                        skillToDelete = null
                    }
                ) {
                    Text("Delete", color = ErrorRose)
                }
            },
            dismissButton = {
                TextButton(onClick = { skillToDelete = null }) {
                    Text("Cancel")
                }
            }
        )
    }
}

@Composable
private fun SkillItemCard(
    skill: UserSkill,
    onEdit: () -> Unit,
    onDelete: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("skill_item_${skill.id}"),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = skill.name,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Spacer(modifier = Modifier.height(4.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = skill.category,
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "• ${skill.experienceMonths} mos exp",
                        fontSize = 11.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Row(verticalAlignment = Alignment.CenterVertically) {
                ProficiencyChip(level = skill.proficiency)

                Spacer(modifier = Modifier.width(6.dp))

                IconButton(
                    onClick = onEdit,
                    modifier = Modifier.size(36.dp)
                ) {
                    Icon(Icons.Default.Edit, contentDescription = "Edit skill", modifier = Modifier.size(18.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
                }

                IconButton(
                    onClick = onDelete,
                    modifier = Modifier.size(36.dp)
                ) {
                    Icon(Icons.Default.Delete, contentDescription = "Delete skill", modifier = Modifier.size(18.dp), tint = ErrorRose)
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun SkillEditDialog(
    title: String,
    initialSkill: UserSkill?,
    onDismiss: () -> Unit,
    onConfirm: (name: String, category: String, proficiency: String, months: Int) -> Unit
) {
    var name by remember { mutableStateOf(initialSkill?.name ?: "") }
    var selectedCategory by remember { mutableStateOf(initialSkill?.category ?: SkillCategory.PROGRAMMING.displayName) }
    var selectedProficiency by remember { mutableStateOf(initialSkill?.proficiency ?: ProficiencyLevel.INTERMEDIATE.displayName) }
    var experienceMonths by remember { mutableIntStateOf(initialSkill?.experienceMonths ?: 12) }

    var categoryExpanded by remember { mutableStateOf(false) }
    var proficiencyExpanded by remember { mutableStateOf(false) }

    var nameError by remember { mutableStateOf(false) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(title, fontWeight = FontWeight.Bold) },
        text = {
            Column(modifier = Modifier.fillMaxWidth()) {
                OutlinedTextField(
                    value = name,
                    onValueChange = {
                        name = it
                        if (nameError) nameError = false
                    },
                    label = { Text("Skill Name *") },
                    placeholder = { Text("e.g. Python, React, SQL") },
                    isError = nameError,
                    supportingText = if (nameError) { { Text("Skill name is required") } } else null,
                    singleLine = true,
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("dialog_skill_name_input")
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Category Dropdown
                ExposedDropdownMenuBox(
                    expanded = categoryExpanded,
                    onExpandedChange = { categoryExpanded = !categoryExpanded }
                ) {
                    OutlinedTextField(
                        value = selectedCategory,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Category") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = categoryExpanded) },
                        modifier = Modifier
                            .menuAnchor()
                            .fillMaxWidth()
                    )
                    ExposedDropdownMenu(
                        expanded = categoryExpanded,
                        onDismissRequest = { categoryExpanded = false }
                    ) {
                        SkillCategory.entries.forEach { cat ->
                            DropdownMenuItem(
                                text = { Text(cat.displayName) },
                                onClick = {
                                    selectedCategory = cat.displayName
                                    categoryExpanded = false
                                }
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Proficiency Dropdown
                ExposedDropdownMenuBox(
                    expanded = proficiencyExpanded,
                    onExpandedChange = { proficiencyExpanded = !proficiencyExpanded }
                ) {
                    OutlinedTextField(
                        value = selectedProficiency,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Proficiency Level") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = proficiencyExpanded) },
                        modifier = Modifier
                            .menuAnchor()
                            .fillMaxWidth()
                    )
                    ExposedDropdownMenu(
                        expanded = proficiencyExpanded,
                        onDismissRequest = { proficiencyExpanded = false }
                    ) {
                        ProficiencyLevel.entries.forEach { prof ->
                            DropdownMenuItem(
                                text = { Text(prof.displayName) },
                                onClick = {
                                    selectedProficiency = prof.displayName
                                    proficiencyExpanded = false
                                }
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Experience Months
                OutlinedTextField(
                    value = experienceMonths.toString(),
                    onValueChange = {
                        val num = it.filter { char -> char.isDigit() }.toIntOrNull()
                        if (num != null) experienceMonths = num
                    },
                    label = { Text("Experience (Months)") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (name.isBlank()) {
                        nameError = true
                    } else {
                        onConfirm(name.trim(), selectedCategory, selectedProficiency, experienceMonths)
                    }
                },
                modifier = Modifier.testTag("dialog_skill_confirm_btn")
            ) {
                Text("Save Skill")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}
