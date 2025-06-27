import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:reusemart_mobile/entity/Merchandise.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:awesome_snackbar_content/awesome_snackbar_content.dart';

class Authmerchandise {
  static final String url = 'http://10.0.2.2:8000/api';
  static final String endpoint = '';

  static Future<List<Merchandise>> getMerchandise() async {
    try {
      String token = await SharedPreferences.getInstance()
          .then((prefs) => prefs.getString('token') ?? '');
      final response = await get(
        Uri.parse('$url/fetchMerchandise'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        final List<dynamic> data = body['data'];
        return data.map((json) => Merchandise.fromJson(json)).toList();
      } else {
        throw Exception('Failed to fetch user: ${response.reasonPhrase}');
      }
    } catch (e) {
      print('Error fetching user: $e');
      throw Exception('Error fetching user: $e');
    }
  }

  static Future<Merchandise> fetchDetailMerch(int id) async {
    try {
      String token = await SharedPreferences.getInstance()
          .then((prefs) => prefs.getString('token') ?? '');

      final response = await get(
        Uri.parse('$url/fetchMerchandiseById/$id'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body)['data'];
        if (data != null) {
          return Merchandise.fromJson(data);
        } else {
          throw Exception('Data kosong');
        }
      } else {
        throw Exception('Failed to fetch merch: ${response.reasonPhrase}');
      }
    } catch (e) {
      print('Error fetching merch: $e');
      throw Exception('Error fetching merch: $e');
    }
  }

  static Future<void> claimMerchandise(
      BuildContext context, int idPenukaran) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token') ?? '';

      final response = await post(
        Uri.parse('$url/claimMerchandise/$idPenukaran'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      );

      final result = jsonDecode(response.body);

      if (response.statusCode == 200 && result['status'] == 'success') {
        final snackBar = SnackBar(
          elevation: 0,
          behavior: SnackBarBehavior.floating,
          backgroundColor: Colors.transparent,
          content: AwesomeSnackbarContent(
            title: 'Berhasil!',
            message: result['message'],
            contentType: ContentType.success,
          ),
        );
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
      } else {
        final snackBar = SnackBar(
          elevation: 0,
          behavior: SnackBarBehavior.floating,
          backgroundColor: Colors.transparent,
          content: AwesomeSnackbarContent(
            title: 'Gagal!',
            message: result['message'] ?? 'Terjadi kesalahan saat penukaran.',
            contentType: ContentType.failure,
          ),
        );
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
      }
    } catch (e) {
      final snackBar = SnackBar(
        elevation: 0,
        behavior: SnackBarBehavior.floating,
        backgroundColor: Colors.transparent,
        content: AwesomeSnackbarContent(
          title: 'Error!',
          message: 'Gagal menukarkan merchandise: $e',
          contentType: ContentType.failure,
        ),
      );
      ScaffoldMessenger.of(context).showSnackBar(snackBar);
    }
  }
}
