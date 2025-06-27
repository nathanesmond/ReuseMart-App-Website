import 'package:flutter/material.dart';
import 'package:reusemart_mobile/auth/login.dart';
import 'package:reusemart_mobile/client/AuthClient.dart';
import 'package:reusemart_mobile/client/AuthHunter.dart';
import 'package:reusemart_mobile/entity/Komisi.dart';
import 'package:reusemart_mobile/entity/Pegawai.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Profilehunter extends StatefulWidget {
  final int id;

  const Profilehunter({super.key, required this.id});

  @override
  _ProfilehunterState createState() => _ProfilehunterState();
}

class _ProfilehunterState extends State<Profilehunter> {
  Future<void> _logout() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString('token');

      await AuthClient.logout(token!);

      await prefs.remove('token');

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const Login()),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Terjadi kesalahan saat logout: $e")));
    }
  }

  late Future<Pegawai> _currentUser;
  late Future<List<Komisi>> _komisi;
  List<Komisi> komisiList = [];

  @override
  void initState() {
    super.initState();
    _currentUser = AuthHunter.fetchHunter();
    _komisi = AuthHunter.getKomisi(widget.id);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Profile',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              _logout();
            },
          ),
        ],
      ),
      body: FutureBuilder<Pegawai>(
        future: _currentUser,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Terjadi kesalahan: ${snapshot.error}'));
          } else if (!snapshot.hasData) {
            return const Center(child: Text('Data pengguna tidak ditemukan.'));
          }
          final user = snapshot.data!;

          return SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.only(left: 20, right: 20, top: 20),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 50,
                        backgroundImage: AssetImage('assets/images/kurir.png'),
                      ),
                      SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              user.nama,
                              style: const TextStyle(
                                  fontSize: 20, fontWeight: FontWeight.bold),
                            ),
                            Text(
                              user.email,
                              style: const TextStyle(fontSize: 16),
                            ),
                            Row(
                              children: [
                                Icon(Icons.account_balance_wallet_rounded,
                                    color: Colors.orange[400], size: 20),
                                SizedBox(width: 8),
                                Text(
                                  'Wallet: Rp ${user.wallet}',
                                  style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                            FutureBuilder<List<Komisi>>(
                              future: _komisi,
                              builder: (context, snapshot) {
                                if (!snapshot.hasData ||
                                    snapshot.data!.isEmpty) {
                                  return Text(
                                    'Total Komisi Selesai: 0',
                                    style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold),
                                  );
                                } else {
                                  final totalKomisi = snapshot.data!.length;
                                  return Text(
                                    'Total Komisi: $totalKomisi',
                                    style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold),
                                  );
                                }
                              },
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(height: 20),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Text(
                    'Riwayat Komisi',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ),
                Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                  child: FutureBuilder<List<Komisi>>(
                    future: _komisi,
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return Center(child: CircularProgressIndicator());
                      } else if (snapshot.hasError) {
                        return Center(
                            child:
                                Text("Gagal memuat komisi: ${snapshot.error}"));
                      } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                        return Text("Belum ada komisi.");
                      }

                      final komisiList = snapshot.data!;
                      return ListView.builder(
                        physics: NeverScrollableScrollPhysics(),
                        shrinkWrap: true,
                        itemCount: komisiList.length,
                        itemBuilder: (context, index) {
                          final komisi = komisiList[index];
                          return Card(
                            margin: EdgeInsets.symmetric(vertical: 6),
                            color: const Color.fromARGB(255, 244, 244, 244),
                            child: ListTile(
                              leading: Icon(Icons.monetization_on,
                                  color: Colors.green),
                              title: Text(komisi.namaBarang),
                              subtitle: Column(
                                mainAxisAlignment: MainAxisAlignment.start,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                      "Harga Barang: Rp ${komisi.harga.toStringAsFixed(0)}"),
                                  Text("Penitip: ${komisi.namaPenitip}"),
                                ],
                              ),
                              trailing: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text("Komisi:"),
                                  Text(
                                      "Rp ${komisi.komisiHunter.toStringAsFixed(0)}"),
                                ],
                              ),
                            ),
                          );
                        },
                      );
                    },
                  ),
                ),
                SizedBox(height: 20),
              ],
            ),
          );
        },
      ),
    );
  }
}
