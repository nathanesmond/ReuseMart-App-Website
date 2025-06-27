import 'dart:io';

import 'dart:convert';
import 'package:http/http.dart';
import 'package:http_parser/http_parser.dart';
import 'package:reusemart_mobile/entity/JadwalPengiriman.dart';
import 'package:reusemart_mobile/entity/Pegawai.dart';
import 'package:shared_preferences/shared_preferences.dart';

class KurirClient {
  static final String url = 'http://10.0.2.2:8000/api';

  static Future<Pegawai> fetchCurrentKurir() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString('token');
      if (token == null || token.isEmpty) {
        throw Exception('No authentication token found.');
      }
      final response = await get(
        Uri.parse('$url/fetchPegawaiByLogin'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      print(response.body);

      if (response.statusCode == 200) {
        var data = jsonDecode(response.body);
        await prefs.setString('current_kurir', jsonEncode(data['pegawai']));
        return Pegawai.fromJson(data['pegawai']);
      } else {
        throw Exception('Failed to fetch kurir: ${response.reasonPhrase}');
      }
    } catch (e) {
      throw Exception('Error fetching kurir: $e');
    }
  }

  static Future<List<JadwalPengiriman>> getJadwalPengirimanKurir() async {
    try{
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString('token');
      if (token == null || token.isEmpty) {
        throw Exception('No authentication token found.');
      }
      final response = await get( 
        Uri.parse('$url/jadwalPengirimanKurir'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        var data = jsonDecode(response.body);
        await prefs.setString('jadwal_pengiriman', jsonEncode(data['jadwal']));
        print(data['jadwal']);
        final List<dynamic> jsonList = json.decode(response.body)['jadwal'];
        return jsonList.map((json) => JadwalPengiriman.fromJson(json)).toList();
      } else {
        throw Exception('Failed to fetch jadwal pengiriman: ${response.reasonPhrase}');
      }
      
    }catch (e) {
      throw Exception('Error fetching jadwal pengiriman: $e');
    }
  }

  static Future<List<JadwalPengiriman>> getHistoryPengirimanKurir() async {
    try{
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString('token');
      if (token == null || token.isEmpty) {
        throw Exception('No authentication token found.');
      }
      final response = await get(
        Uri.parse('$url/historyPengirimanKurir'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

        print(response.body);
        if (response.statusCode == 200) { 
          var data = jsonDecode(response.body);
          await prefs.setString('jadwal_pengiriman', jsonEncode(data['jadwal']));
          print(data['jadwal']);
          final List<dynamic> jsonList = json.decode(response.body)['jadwal'];
          return jsonList.map((json) => JadwalPengiriman.fromJson(json)).toList();
        } else {
          throw Exception('Failed to fetch jadwal pengiriman: ${response.reasonPhrase}');
        }
        
      }catch (e) {
        throw Exception('Error fetching jadwal pengiriman: $e');
      }
    }
    static Future<void> selesaikanStatusPengiriman(int idPembelian) async{
      try {
        SharedPreferences prefs = await SharedPreferences.getInstance();
        String? token = prefs.getString('token');
        if (token == null || token.isEmpty) {
          throw Exception('No authentication token found.');
        }
        final response = await post(
          Uri.parse('$url/selesaikanPengirimanKurir/$idPembelian'),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $token',
          },
        );

        if (response.statusCode == 200) {
          print('Status pengiriman berhasil diselesaikan');
        } else {
          throw Exception('Failed to update status pengiriman: ${response.reasonPhrase}');
        }
      } catch (e) {
        throw Exception('Error updating status pengiriman: $e');
      }
    }
    


  }