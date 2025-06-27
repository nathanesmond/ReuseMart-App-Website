import 'dart:convert';
import 'package:http/http.dart';
import 'package:reusemart_mobile/entity/Penitipan.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthPenitipan {
  static final String url = 'http://10.0.2.2:8000/api';
  static final String endpoint = '';

  static Future<List<Penitipan>> getPenitipan(int id) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');

    final response = await get(
      Uri.parse('$url/getHistoryPenitipan/$id'),
      headers: {
        'Authorization': 'Bearer $token',
        'Accept': 'application/json',
      },
    );

    if (response.statusCode != 200) {
      throw Exception('Gagal memuat data penitipan');
    }

    var data = jsonDecode(response.body);

    await prefs.setString('pembelian_data', jsonEncode(data['data']));
    final List<dynamic> jsonList = json.decode(response.body)['data'];
    return jsonList.map((json) => Penitipan.fromJson(json)).toList();
  }

  static Future<void> updateBarangLebihTujuhHari() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');

    final response = await get(
      Uri.parse('$url/updateStatusBarangDonasi'),
      headers: {
        'Authorization': 'Bearer $token',
        'Accept': 'application/json',
      },
    );

    print(response.body);
    if (response.statusCode != 200) {
      throw Exception('Gagal memperbarui barang lebih dari tujuh hari');
    }
  }
}
