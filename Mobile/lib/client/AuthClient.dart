import 'dart:convert';
import 'package:http/http.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthClient {
  static final String url = 'http://10.0.2.2:8000/api';
  static final String endpoint = '';

  static Future<Response> login(String email, String password) async {
    try {
      final response = await post(
        Uri.parse('$url/loginMobile'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );
      print(response.body);
      if (response.statusCode == 200) {
        var data = jsonDecode(response.body);
        SharedPreferences prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', data['token']);
      }

      return response;
    } catch (e) {
      print('Error: $e');
      return Response('Error: $e', 500);
    }
  }

  static Future<void> logout(String token) async {
    try {
      var response = await post(
        Uri.parse('$url/logout'),
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
