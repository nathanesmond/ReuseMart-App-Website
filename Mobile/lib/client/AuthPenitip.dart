import 'dart:convert';
import 'package:http/http.dart';
import 'package:reusemart_mobile/entity/Penitip.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthPenitip {
  static final String url = 'http://10.0.2.2:8000/api';
  static final String endpoint = '';

  static Future<Penitip> fetchCurrentUser() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString('token');
      if (token!.isEmpty) {
        throw Exception('No authentication token found.');
      }
      final response = await get(
        Uri.parse('$url/fetchPenitipByLogin'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        var data = jsonDecode(response.body);
        await prefs.setString('current_user', jsonEncode(data['penitip']));
        return Penitip.fromJson(data['penitip']);
      } else {
        throw Exception('Failed to fetch user: ${response.reasonPhrase}');
      }
    } catch (e) {
      throw Exception('Error fetching user: $e');
    }
  }

  static Future<List<Map<String, dynamic>>> getTopSeller() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      final response = await get(
        Uri.parse('$url/getTopSeller'),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        var data = jsonDecode(response.body);
        List<dynamic> penitipList = data['penitip'];
        await prefs.setString('top_seller', jsonEncode(penitipList));
        return List<Map<String, dynamic>>.from(penitipList);
      } else {
        throw Exception('Failed to fetch penitip: ${response.reasonPhrase}');
      }
    } catch (e) {
      throw Exception('Error fetching penitip: $e');
    }
  }

  static Future<Map<String, dynamic>> bonusTopSeller() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString('token');
      if (token!.isEmpty) {
        throw Exception('No authentication token found.');
      }
      final response = await get(
        Uri.parse('$url/benefitTopSeller'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        var data = jsonDecode(response.body);
        await prefs.setString('top_seller_bonus', jsonEncode(data));
        return Map<String, dynamic>.from(data);
      } else {
        throw Exception('Failed to fetch penitip: ${response.reasonPhrase}');
      }
    } catch (e) {
      throw Exception('Error fetching penitip: $e');
    }
  }
}
