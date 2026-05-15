import 'package:http/http.dart' as http;
import 'dart:convert';
import 'storage_service.dart';

class ApiService {
  // ⚠️ UPDATE THIS WITH YOUR BACKEND URL!
  static const String baseUrl = 'https://trms-backend-production.up.railway.app';
  // Example: https://your-deployed-url.railway.app

  static String? authToken;
  static Map<String, dynamic>? currentUser;

  // ═══════════════════════════════════════════════════════
  // AUTHENTICATION
  // ═══════════════════════════════════════════════════════

  /// Login with email and password
  static Future<Map<String, dynamic>> login(
    String email,
    String password,
  ) async {
    try {
      print('🔗 LOGIN: Connecting to $baseUrl/auth/login');
      print('📧 Email: $email');

      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      ).timeout(Duration(seconds: 15));

      print('📡 Response Status: ${response.statusCode}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);

        // Save token
        authToken = data['access_token'] ?? data['token'];
        await StorageService.saveToken(authToken ?? '');

        // Save user data
        if (data['user'] != null) {
          currentUser = data['user'];
          await StorageService.saveUser(data['user']);
        }

        print('✅ Login successful!');
        print('👤 User: ${currentUser?['firstName']} ${currentUser?['lastName']}');
        print('👮 Role: ${currentUser?['role']}');

        return data;
      } else {
        final error = jsonDecode(response.body);
        throw Exception(
          error['message'] ?? 'Login failed: ${response.statusCode}',
        );
      }
    } catch (e) {
      print('❌ Login error: $e');
      throw Exception('Connection error: $e');
    }
  }

  /// Logout
  static Future<void> logout() async {
    authToken = null;
    currentUser = null;
    await StorageService.clear();
    print('🚪 Logged out');
  }

  /// Check if logged in
  static bool isLoggedIn() => authToken != null;

  /// Load user from storage
  static Future<void> loadUserFromStorage() async {
    authToken = StorageService.getToken();
    currentUser = StorageService.getUser();
    if (authToken != null) {
      print('✅ User loaded from storage');
    }
  }

  // ═══════════════════════════════════════════════════════
  // PATIENTS
  // ═══════════════════════════════════════════════════════

  /// Get all patients
  static Future<List<dynamic>> getPatients() async {
    try {
      print('🔗 GET: /api/patients');

      final response = await http.get(
        Uri.parse('$baseUrl/api/patients'),
        headers: _getHeaders(),
      ).timeout(Duration(seconds: 15));

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        print('✅ Loaded ${data.length} patients');
        return data;
      } else {
        throw Exception('Failed to load patients');
      }
    } catch (e) {
      print('❌ Error: $e');
      throw Exception('Error: $e');
    }
  }

  // ═══════════════════════════════════════════════════════
  // REFERRALS
  // ═══════════════════════════════════════════════════════

  /// Get my referrals (sent by me)
  static Future<List<dynamic>> getMyReferrals() async {
    try {
      print('🔗 GET: /api/referrals/my');

      final response = await http.get(
        Uri.parse('$baseUrl/api/referrals/my'),
        headers: _getHeaders(),
      ).timeout(Duration(seconds: 15));

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        print('✅ Loaded ${data.length} my referrals');
        return data;
      } else {
        throw Exception('Failed to load referrals');
      }
    } catch (e) {
      print('❌ Error: $e');
      throw Exception('Error: $e');
    }
  }

  /// Get incoming referrals (sent to me)
  static Future<List<dynamic>> getIncomingReferrals() async {
    try {
      print('🔗 GET: /api/referrals/incoming');

      final response = await http.get(
        Uri.parse('$baseUrl/api/referrals/incoming'),
        headers: _getHeaders(),
      ).timeout(Duration(seconds: 15));

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        print('✅ Loaded ${data.length} incoming referrals');
        return data;
      } else {
        throw Exception('Failed to load referrals');
      }
    } catch (e) {
      print('❌ Error: $e');
      throw Exception('Error: $e');
    }
  }

  /// Create referral
  static Future<Map<String, dynamic>> createReferral({
    required String patientId,
    required String toFacilityId,
    required String reason,
    required String priority,
  }) async {
    try {
      print('🔗 POST: /api/referrals');

      final response = await http.post(
        Uri.parse('$baseUrl/api/referrals'),
        headers: _getHeaders(),
        body: jsonEncode({
          'patientId': patientId,
          'toFacilityId': toFacilityId,
          'reason': reason,
          'priority': priority,
        }),
      ).timeout(Duration(seconds: 15));

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        print('✅ Referral created');
        return data;
      } else {
        throw Exception('Failed to create referral');
      }
    } catch (e) {
      print('❌ Error: $e');
      throw Exception('Error: $e');
    }
  }

  /// Update referral status
  static Future<Map<String, dynamic>> updateReferralStatus(
    String referralId,
    String newStatus,
  ) async {
    try {
      print('🔗 PATCH: /api/referrals/$referralId/status');

      final response = await http.patch(
        Uri.parse('$baseUrl/api/referrals/$referralId/status'),
        headers: _getHeaders(),
        body: jsonEncode({'status': newStatus}),
      ).timeout(Duration(seconds: 15));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        print('✅ Status updated to $newStatus');
        return data;
      } else {
        throw Exception('Failed to update status');
      }
    } catch (e) {
      print('❌ Error: $e');
      throw Exception('Error: $e');
    }
  }

  // ═══════════════════════════════════════════════════════
  // FACILITIES
  // ═══════════════════════════════════════════════════════

  /// Get all facilities
  static Future<List<dynamic>> getFacilities() async {
    try {
      print('🔗 GET: /api/directory/facilities');

      final response = await http.get(
        Uri.parse('$baseUrl/api/directory/facilities'),
        headers: _getHeaders(),
      ).timeout(Duration(seconds: 15));

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        print('✅ Loaded ${data.length} facilities');
        return data;
      } else {
        throw Exception('Failed to load facilities');
      }
    } catch (e) {
      print('❌ Error: $e');
      throw Exception('Error: $e');
    }
  }

  // ═══════════════════════════════════════════════════════
  // HELPER METHODS
  // ═══════════════════════════════════════════════════════

  /// Build headers with auth token
  static Map<String, String> _getHeaders() {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (authToken != null) {
      headers['Authorization'] = 'Bearer $authToken';
    }

    return headers;
  }

  /// Test connection to backend
  static Future<bool> testConnection() async {
    try {
      print('🔗 Testing connection to: $baseUrl');

      final response = await http
          .get(Uri.parse('$baseUrl/health'))
          .timeout(Duration(seconds: 5));

      if (response.statusCode == 200) {
        print('✅ Backend is online!');
        return true;
      } else {
        print('⚠️ Backend status: ${response.statusCode}');
        return false;
      }
    } catch (e) {
      print('❌ Cannot connect: $e');
      return false;
    }
  }
}