import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';
import 'login_screen.dart';

class DashboardScreen extends StatefulWidget {
  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  List<dynamic> myReferrals = [];
  List<dynamic> incomingReferrals = [];
  bool isLoading = true;
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  /// Load all dashboard data
  void _loadData() async {
    try {
      final my = await ApiService.getMyReferrals();
      final incoming = await ApiService.getIncomingReferrals();

      if (mounted) {
        setState(() {
          myReferrals = my;
          incomingReferrals = incoming;
          isLoading = false;
        });
      }

      print('✅ Dashboard data loaded!');
    } catch (e) {
      print('❌ Error loading data: $e');
      if (mounted) {
        setState(() {
          isLoading = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error loading data'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  /// Logout user
  void _logout() async {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Logout'),
        content: Text('Are you sure you want to logout?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              ApiService.logout();
              Navigator.pop(context);
              Navigator.pushReplacementNamed(context, '/login');
            },
            child: Text('Logout', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('TRMS Dashboard'),
        backgroundColor: Colors.blue,
        elevation: 0,
        actions: [
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: _logout,
          ),
        ],
      ),
      body: isLoading
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(),
                  SizedBox(height: 16),
                  Text('Loading dashboard...'),
                ],
              ),
            )
          : _selectedIndex == 0
              ? _buildHomeTab()
              : _selectedIndex == 1
                  ? _buildMyReferralsTab()
                  : _buildIncomingTab(),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.send),
            label: 'My Referrals',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.inbox),
            label: 'Incoming',
          ),
        ],
        onTap: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
      ),
      floatingActionButton: _selectedIndex == 0
          ? FloatingActionButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Create referral feature coming soon!')),
                );
              },
              child: Icon(Icons.add),
              backgroundColor: Colors.blue,
            )
          : null,
    );
  }

  /// Home Tab
  Widget _buildHomeTab() {
    return RefreshIndicator(
      onRefresh: () async {
        _loadData();
      },
      child: SingleChildScrollView(
        physics: AlwaysScrollableScrollPhysics(),
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome message
              Text(
                'Welcome, ${ApiService.currentUser?['firstName'] ?? 'User'}!',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                'Role: ${ApiService.currentUser?['role'] ?? 'N/A'}',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey,
                ),
              ),
              SizedBox(height: 24),

              // Summary Cards
              Text(
                'Overview',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),

              Row(
                children: [
                  Expanded(
                    child: _buildSummaryCard(
                      title: 'My Referrals',
                      value: '${myReferrals.length}',
                      icon: Icons.send,
                      color: Colors.blue,
                    ),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: _buildSummaryCard(
                      title: 'Incoming',
                      value: '${incomingReferrals.length}',
                      icon: Icons.inbox,
                      color: Colors.green,
                    ),
                  ),
                ],
              ),
              SizedBox(height: 24),

              // Recent Referrals
              Text(
                'Recent Referrals',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),

              if (myReferrals.isEmpty)
                Center(
                  child: Padding(
                    padding: EdgeInsets.all(32),
                    child: Text('No referrals yet'),
                  ),
                )
              else
                ...myReferrals.take(3).map((ref) {
                  return _buildReferralCard(ref);
                }).toList(),
            ],
          ),
        ),
      ),
    );
  }

  /// My Referrals Tab
  Widget _buildMyReferralsTab() {
    return myReferrals.isEmpty
        ? Center(child: Text('No referrals sent'))
        : RefreshIndicator(
            onRefresh: () async {
              _loadData();
            },
            child: ListView.builder(
              itemCount: myReferrals.length,
              itemBuilder: (context, index) {
                return _buildReferralCard(myReferrals[index]);
              },
            ),
          );
  }

  /// Incoming Referrals Tab
  Widget _buildIncomingTab() {
    return incomingReferrals.isEmpty
        ? Center(child: Text('No incoming referrals'))
        : RefreshIndicator(
            onRefresh: () async {
              _loadData();
            },
            child: ListView.builder(
              itemCount: incomingReferrals.length,
              itemBuilder: (context, index) {
                return _buildReferralCard(incomingReferrals[index]);
              },
            ),
          );
  }

  /// Summary Card Widget
  Widget _buildSummaryCard({
    required String title,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 32),
            SizedBox(height: 12),
            Text(
              title,
              style: TextStyle(
                color: Colors.grey,
                fontSize: 12,
              ),
            ),
            SizedBox(height: 4),
            Text(
              value,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Referral Card Widget
  Widget _buildReferralCard(dynamic referral) {
    final status = referral['status'] ?? 'UNKNOWN';
    final priority = referral['priority'] ?? 'MEDIUM';
    final id = referral['id'] ?? '';
    final createdAt = referral['createdAt'] != null
        ? DateTime.parse(referral['createdAt'])
        : DateTime.now();

    Color statusColor;
    switch (status) {
      case 'PENDING':
        statusColor = Colors.orange;
        break;
      case 'ACCEPTED':
        statusColor = Colors.green;
        break;
      case 'REJECTED':
        statusColor = Colors.red;
        break;
      default:
        statusColor = Colors.grey;
    }

    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Ref #${id.substring(0, (id.length < 8 ? id.length : 8))}',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                Chip(
                  label: Text(priority),
                  backgroundColor: Colors.blue[100],
                ),
              ],
            ),
            SizedBox(height: 8),
            Text(
              'Patient: ${referral['patientName'] ?? 'N/A'}',
              style: TextStyle(fontSize: 14),
            ),
            SizedBox(height: 4),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Status: $status',
                  style: TextStyle(
                    color: statusColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  '${createdAt.day}/${createdAt.month}/${createdAt.year}',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}