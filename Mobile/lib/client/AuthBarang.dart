import 'dart:convert';
import 'package:http/http.dart';
import 'package:reusemart_mobile/entity/Barang.dart';
import 'package:reusemart_mobile/homepage/detailBarang.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:reusemart_mobile/entity/DetailBarang.dart';

class Authbarang {
  static final String url = 'http://10.0.2.2:8000/api';
  static final String endpoint = '';

  static Future<List<Barang>> getBarang() async {
    try {
      String token = await SharedPreferences.getInstance()
          .then((prefs) => prefs.getString('token') ?? '');
      final response = await get(
        Uri.parse('$url/fetchBarang'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        final List<dynamic> data = body['data'];
        return data.map((json) => Barang.fromJson(json)).toList();
      } else {
        throw Exception('Failed to fetch user: ${response.reasonPhrase}');
      }
    } catch (e) {
      print('Error fetching user: $e');
      throw Exception('Error fetching user: $e');
    }
  }

  static Future<DetailBarang> fetchDetailBarang(int id) async {
    try {
      String token = await SharedPreferences.getInstance()
          .then((prefs) => prefs.getString('token') ?? '');
      final response = await get(
        Uri.parse('$url/fetchBarangById/$id'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body)['data'];
        if (data != null && data is Map<String, dynamic>) {
          return DetailBarang.fromJson(data);
        } else {
          throw Exception('Data kosong');
        }
      } else {
        throw Exception('Failed to fetch user: ${response.reasonPhrase}');
      }
    } catch (e) {
      print('Error fetching user: $e');
      throw Exception('Error fetching user: $e');
    }
  }
}
