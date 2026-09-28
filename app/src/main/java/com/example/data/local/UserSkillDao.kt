package com.example.data.local

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.data.model.UserSkill
import kotlinx.coroutines.flow.Flow

@Dao
interface UserSkillDao {
    @Query("SELECT * FROM user_skills ORDER BY name ASC")
    fun getAllSkills(): Flow<List<UserSkill>>

    @Query("SELECT * FROM user_skills WHERE id = :id")
    suspend fun getSkillById(id: Long): UserSkill?

    @Query("SELECT * FROM user_skills WHERE LOWER(name) = LOWER(:name) LIMIT 1")
    suspend fun getSkillByName(name: String): UserSkill?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSkill(skill: UserSkill): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSkills(skills: List<UserSkill>)

    @Update
    suspend fun updateSkill(skill: UserSkill)

    @Delete
    suspend fun deleteSkill(skill: UserSkill)

    @Query("DELETE FROM user_skills WHERE id = :id")
    suspend fun deleteSkillById(id: Long)

    @Query("DELETE FROM user_skills")
    suspend fun deleteAllSkills()
}
