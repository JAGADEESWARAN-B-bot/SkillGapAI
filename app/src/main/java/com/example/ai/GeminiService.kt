package com.example.ai

import android.util.Log
import com.example.BuildConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit

object GeminiService {
    private const val TAG = "GeminiService"
    private const val BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent"

    private val okHttpClient = OkHttpClient.Builder()
        .connectTimeout(60, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(60, TimeUnit.SECONDS)
        .build()

    fun isApiKeyConfigured(): Boolean {
        return try {
            val key = BuildConfig.GEMINI_API_KEY
            key.isNotEmpty() && !key.equals("MY_GEMINI_API_KEY", ignoreCase = true)
        } catch (e: Exception) {
            false
        }
    }

    suspend fun generateCareerAdvice(
        targetRole: String,
        missingSkills: List<String>,
        currentSkills: List<String>
    ): String? = withContext(Dispatchers.IO) {
        if (!isApiKeyConfigured()) {
            return@withContext null
        }

        val prompt = """
            You are an expert Career Development Mentor.
            Target Role: $targetRole
            Current Skills: ${currentSkills.joinToString(", ")}
            Missing Required Skills: ${missingSkills.joinToString(", ")}

            Provide a concise, encouraging 3-bullet action plan for a fresh student to bridge these specific skill gaps and become job-ready within 90 days. Keep response under 150 words.
        """.trimIndent()

        callGemini(prompt)
    }

    suspend fun generateInterviewTips(
        roleTitle: String,
        topic: String
    ): String? = withContext(Dispatchers.IO) {
        if (!isApiKeyConfigured()) {
            return@withContext null
        }

        val prompt = """
            As a hiring manager for $roleTitle, give 2 insider interview tips and 1 common pitfall to avoid when answering questions about $topic. Keep response concise and actionable.
        """.trimIndent()

        callGemini(prompt)
    }

    private suspend fun callGemini(promptText: String): String? = withContext(Dispatchers.IO) {
        try {
            val apiKey = BuildConfig.GEMINI_API_KEY
            val url = "$BASE_URL?key=$apiKey"

            val jsonBody = JSONObject().apply {
                val contents = JSONArray().apply {
                    val contentObj = JSONObject().apply {
                        val parts = JSONArray().apply {
                            put(JSONObject().apply { put("text", promptText) })
                        }
                        put("parts", parts)
                    }
                    put(contentObj)
                }
                put("contents", contents)
            }

            val mediaType = "application/json; charset=utf-8".toMediaType()
            val requestBody = jsonBody.toString().toRequestBody(mediaType)

            val request = Request.Builder()
                .url(url)
                .post(requestBody)
                .build()

            val response = okHttpClient.newCall(request).execute()
            if (!response.isSuccessful) {
                Log.w(TAG, "Gemini API call returned HTTP ${response.code}")
                return@withContext null
            }

            val responseString = response.body?.string() ?: return@withContext null
            val root = JSONObject(responseString)
            val candidates = root.optJSONArray("candidates") ?: return@withContext null
            val firstCandidate = candidates.optJSONObject(0) ?: return@withContext null
            val content = firstCandidate.optJSONObject("content") ?: return@withContext null
            val parts = content.optJSONArray("parts") ?: return@withContext null
            val firstPart = parts.optJSONObject(0) ?: return@withContext null
            return@withContext firstPart.optString("text")
        } catch (e: Exception) {
            Log.e(TAG, "Gemini error: ${e.message}")
            return@withContext null
        }
    }
}
