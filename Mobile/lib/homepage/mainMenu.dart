import 'package:flutter/material.dart';
import 'package:reusemart_mobile/History/Pembelian.dart';
import 'package:reusemart_mobile/History/Penitipan.dart';
import 'package:reusemart_mobile/KurirPage/HistoryKurir.dart';
import 'package:reusemart_mobile/KurirPage/ProfileKurir.dart';
import 'package:reusemart_mobile/auth/login.dart';
import 'package:reusemart_mobile/homepage/Merchandise.dart';
import 'package:reusemart_mobile/homepage/home.dart';
import 'package:reusemart_mobile/homepage/profilePembeli.dart';
import 'package:reusemart_mobile/homepage/profilePenitip.dart';
import 'package:reusemart_mobile/homepage/historyPPH.dart';
import 'package:reusemart_mobile/HunterPage/ProfileHunter.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Mainmenu extends StatefulWidget {
  final int? id;
  final int selectedIndex;
  const Mainmenu({super.key, this.id, this.selectedIndex = 0});

  @override
  State<Mainmenu> createState() => _MainmenuState();
}

class _MainmenuState extends State<Mainmenu> {
  int _selectedIndex = 0;
  String? _role;
  int? _id;
  String? _token;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _selectedIndex = widget.selectedIndex;
    _loadRole();
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  Future<void> _loadRole() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    setState(() {
      _role = prefs.getString('role');
      _id = prefs.getInt('id');
      _token = prefs.getString('token');
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    final List<Widget> _widgetOptions = <Widget>[
      HomePage(),
      _token != null
          ? (_role == 'Pembeli'
              ? HistoryPembelian()
              : _role == 'Penitip'
                  ? HistoryPenitipan(id: _id!)
                  : _role == 'Kurir'
                      ? Historykurir()
                      : _role == 'Hunter'
                          ? HistoryPPH()
                          : Login())
          : Login(),

      _token != null
          ? (_role == 'Pembeli'
              ? ProfilePembeli()
              : _role == 'Penitip'
                  ? ProfilePenitip()
                  : _role == 'Kurir'
                      ? ProfileKurir()
                      : _role == 'Hunter'
                          ? ProfilePenitip()
                          : Login())
          : Login(),
    ];

    return Scaffold(
      bottomNavigationBar: Container(
        height: MediaQuery.of(context).size.height > 600
            ? MediaQuery.of(context).size.height * 0.1
            : MediaQuery.of(context).size.height * 0.207,
        decoration: BoxDecoration(
          border: Border.all(color: Color(0xFFD9D9D9)),
        ),
        child: BottomNavigationBar(
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.history),
              label: 'History',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person),
              label: 'Profile',
            ),
          ],
          currentIndex: _selectedIndex,
          onTap: _onItemTapped,
          backgroundColor: Colors.transparent,
          elevation: 0,
          type: BottomNavigationBarType.fixed,
          selectedItemColor: Color(0xFF1F510F),
          unselectedItemColor: Color(0xFF8D92A3),
        ),
      ),
      body: widgetOptions.elementAt(_selectedIndex),
    );
  }
}
