import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiService {
  // ⚠️ CHANGE THIS TO YOUR BACKEND URL!
static const String baseUrl = 'https://trms-api-production.up.railway.app';
  // Get your URL from Railway dashboard

  static String? authToken;

  /// Login API call
  static Future<Map<String, dynamic>> login(
    String email,
    String password,
  ) async {
    try {
      print('🔗 Connecting to: $baseUrl/auth/login');

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
        authToken = data['access_token'] ?? data['token'];
        print('✅ Login successful!');
        print('🔐 Token saved');
        return data;
      } else {
        throw Exception('Login failed: ${response.statusCode}');
      }
    } catch (e) {
      print('❌ Error: $e');
      throw Exception('Connection error: $e');
    }
  }

  /// Get all patients
  static Future<List<dynamic>> getPatients() async {
    try {
      print('🔗 GET: /api/patients');

      final response = await http.get(
        Uri.parse('$baseUrl/api/patients'),
        headers: {
          'Authorization': 'Bearer $authToken',
          'Content-Type': 'application/json',
        },
      ).timeout(Duration(seconds: 15));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        print('✅ Loaded patients');
        return data;
      } else {
        throw Exception('Failed to load patients');
      }
    } catch (e) {
      print('❌ Error: $e');
      throw Exception('Error: $e');
    }
  }

  /// Get my referrals
  static Future<List<dynamic>> getMyReferrals() async {
    try {
      print('🔗 GET: /api/referrals/my');

      final response = await http.get(
        Uri.parse('$baseUrl/api/referrals/my'),
        headers: {
          'Authorization': 'Bearer $authToken',
          'Content-Type': 'application/json',
        },
      ).timeout(Duration(seconds: 15));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        print('✅ Loaded referrals');
        return data;
      } else {
        throw Exception('Failed to load referrals');
      }
    } catch (e) {
      print('❌ Error: $e');
      throw Exception('Error: $e');
    }
  }
}