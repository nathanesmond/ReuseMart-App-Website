import 'dart:convert';
import 'package:http/http.dart';
import 'package:reusemart_mobile/entity/DetailPembelian.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthPembelian {
  static final String url = 'http://10.0.2.2:8000/api';
  static final String endpoint = '';

  static Future<List<DetailPembelian>> getPembelian() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');

    final response = await get(
      Uri.parse('$url/order-history'),
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
    return jsonList.map((json) => DetailPembelian.fromJson(json)).toList();
  }

  static Future<DetailPembelian> getPembelianById(int id) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');

    final response = await get(
      Uri.parse('$url/order-history/$id'),
      headers: {
        'Authorization': 'Bearer $token',
        'Accept': 'application/json',
      },
    );

    if (response.statusCode != 200) {
      throw Exception('Gagal memuat data pembelian');
    }
    var data = jsonDecode(response.body);
    await prefs.setString('items', jsonEncode(data['items']));
    await prefs.setString('pembelian', jsonEncode(data['pembelian']));
    return DetailPembelian.fromJson(data);
  }

  static Future<void> getAlamatUtama() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');

    final response = await get(
      Uri.parse('$url/alamatUtama'),
      headers: {
        'Authorization': 'Bearer $token',
        'Accept': 'application/json',
      },
    );

    if (response.statusCode != 200) {
      throw Exception('Gagal memuat alamat utama');
    }

    var data = jsonDecode(response.body);
    await prefs.setString('alamat_utama', jsonEncode(data));
  }

  static Future<String> loadAlamatUtama() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? alamatData = prefs.getString('alamat_utama');

    var decoded = jsonDecode(alamatData!);
    var alamatUtama = decoded['alamatUtama'];
    return '${alamatUtama['nama_jalan']}, ${alamatUtama['nama_kota']} (${alamatUtama['kode_pos']})';
  }
}
