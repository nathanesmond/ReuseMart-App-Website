import 'package:flutter/material.dart';

class HunterHome extends StatelessWidget {
  const HunterHome({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      child: const Center(
        
        child: Text(
          'Hello Hunter',
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}