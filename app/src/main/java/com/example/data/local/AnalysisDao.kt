package com.example.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.example.data.model.AnalysisRecordEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface AnalysisDao {
    @Query("SELECT * FROM analysis_history ORDER BY timestamp DESC")
    fun getAllRecords(): Flow<List<AnalysisRecordEntity>>

    @Query("SELECT * FROM analysis_history ORDER BY timestamp DESC LIMIT 1")
    fun getLatestRecord(): Flow<AnalysisRecordEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRecord(record: AnalysisRecordEntity): Long

    @Query("DELETE FROM analysis_history WHERE id = :id")
    suspend fun deleteRecord(id: Long)

    @Query("DELETE FROM analysis_history")
    suspend fun clearHistory()
}
