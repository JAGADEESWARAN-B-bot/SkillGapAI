package com.example.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.data.model.RoadmapItemEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface RoadmapDao {
    @Query("SELECT * FROM roadmap_items WHERE roleId = :roleId ORDER BY phaseNumber ASC, orderIndex ASC")
    fun getRoadmapForRole(roleId: String): Flow<List<RoadmapItemEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRoadmapItems(items: List<RoadmapItemEntity>)

    @Update
    suspend fun updateRoadmapItem(item: RoadmapItemEntity)

    @Query("UPDATE roadmap_items SET status = :status WHERE id = :id")
    suspend fun updateItemStatus(id: Long, status: String)

    @Query("DELETE FROM roadmap_items WHERE roleId = :roleId")
    suspend fun deleteRoadmapForRole(roleId: String)

    @Query("DELETE FROM roadmap_items")
    suspend fun clearAllRoadmapItems()
}
