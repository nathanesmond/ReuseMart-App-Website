import 'dart:convert';
import 'package:http/http.dart';
import 'package:reusemart_mobile/entity/Pembeli.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthPembeli {
  static final String url = 'http://10.0.2.2:8000/api';
  static final String endpoint = '';

  static Future<Pembeli> fetchCurrentUser() async {
    try {
      String token = await SharedPreferences.getInstance()
          .then((prefs) => prefs.getString('token') ?? '');
      final response = await get(
        Uri.parse('$url/fetchPembeli'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        var data = jsonDecode(response.body);
        SharedPreferences prefs = await SharedPreferences.getInstance();
        await prefs.setString('current_user', jsonEncode(data));
        return Pembeli.fromJson(data);
      } else {
        throw Exception('Failed to fetch user: ${response.reasonPhrase}');
      }
    } catch (e) {
      print('Error fetching user: $e');
      throw Exception('Error fetching user: $e');
    }
  }

  static Future<void> logout(String token) async {
    try {
      var response = await post(
        Uri.https(url, '/api/logout'),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
      );

      if (response.statusCode != 200) {
        throw Exception('Logout failed: ${response.reasonPhrase}');
      }

      SharedPreferences prefs = await SharedPreferences.getInstance();
      await prefs.remove('auth_token');

      print('Logout successful');
    } catch (e) {
      return Future.error('Logout error: $e');
    }
  }
}
