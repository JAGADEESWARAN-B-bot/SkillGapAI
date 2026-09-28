package com.example.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.example.data.model.AnalysisRecordEntity
import com.example.data.model.RoadmapItemEntity
import com.example.data.model.UserProfile
import com.example.data.model.UserSkill

@Database(
    entities = [
        UserSkill::class,
        UserProfile::class,
        AnalysisRecordEntity::class,
        RoadmapItemEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class SkillGapDatabase : RoomDatabase() {
    abstract fun userSkillDao(): UserSkillDao
    abstract fun userProfileDao(): UserProfileDao
    abstract fun analysisDao(): AnalysisDao
    abstract fun roadmapDao(): RoadmapDao

    companion object {
        @Volatile
        private var INSTANCE: SkillGapDatabase? = null

        fun getInstance(context: Context): SkillGapDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    SkillGapDatabase::class.java,
                    "skillgap_ai.db"
                ).fallbackToDestructiveMigration().build()
                INSTANCE = instance
                instance
            }
        }
    }
}
