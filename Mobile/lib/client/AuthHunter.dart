import 'dart:convert';
import 'package:http/http.dart';
import 'package:reusemart_mobile/entity/Pegawai.dart';
import 'package:reusemart_mobile/entity/Komisi.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthHunter {
  static final String url = 'http://10.0.2.2:8000/api';
  static final String endpoint = '';

  static Future<Pegawai> fetchHunter() async {
    try {
      String token = await SharedPreferences.getInstance()
          .then((prefs) => prefs.getString('token') ?? '');
      final response = await get(
        Uri.parse('$url/fetchHunter'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        var data = jsonDecode(response.body);
        var pegawaiJson = data['pegawai'];
        SharedPreferences prefs = await SharedPreferences.getInstance();
        await prefs.setString('current_user', jsonEncode(data));
        return Pegawai.fromJson(pegawaiJson);
      } else {
        throw Exception('Failed to fetch user: ${response.reasonPhrase}');
      }
    } catch (e) {
      print('Error fetching user: $e');
      throw Exception('Error fetching user: $e');
    }
  }

  static Future<List<Komisi>> getKomisi(int id) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');

    final response = await get(
      Uri.parse('$url/fetchKomisiById/$id'),
      headers: {
        'Authorization': 'Bearer $token',
        'Accept': 'application/json',
      },
    );

    if (response.statusCode != 200) {
      throw Exception('Gagal memuat data pembelian');
    }

    var data = jsonDecode(response.body);
    await prefs.setString('pembelian_data', jsonEncode(data['data']));
    final List<dynamic> jsonList = json.decode(response.body)['data'];
    return jsonList.map((json) => Komisi.fromJson(json)).toList();
  }
}
