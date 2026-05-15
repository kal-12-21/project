import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class StorageService {
  static late SharedPreferences _prefs;

  // Initialize (call in main())
  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
    print('✅ StorageService initialized');
  }

  // Save authentication token
  static Future<void> saveToken(String token) async {
    await _prefs.setString('auth_token', token);
    print('💾 Token saved');
  }

  // Get authentication token
  static String? getToken() {
    return _prefs.getString('auth_token');
  }

  // Save user data
  static Future<void> saveUser(Map<String, dynamic> userData) async {
    await _prefs.setString('user', jsonEncode(userData));
    print('💾 User data saved');
  }

  // Get user data
  static Map<String, dynamic>? getUser() {
    final userJson = _prefs.getString('user');
    if (userJson != null) {
      return jsonDecode(userJson);
    }
    return null;
  }

  // Check if user is logged in
  static bool isLoggedIn() {
    return _prefs.getString('auth_token') != null;
  }

  // Clear all data (logout)
  static Future<void> clear() async {
    await _prefs.clear();
    print('🗑️ All data cleared');
  }
}