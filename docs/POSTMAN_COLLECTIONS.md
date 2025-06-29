# Postman Collections for CLIQ Expense Tracker API

This directory contains comprehensive Postman collections and environments for testing the CLIQ SMS parsing expense tracker API.

## Collections

### 1. CLIQ_Expense_Tracker_Enhanced.postman_collection.json
**Purpose**: Comprehensive manual testing collection
**Contents**:
- Authentication endpoints (register, login, user profile)
- CLIQ SMS Parsing with multiple test scenarios
- Bank Transaction Parsing (purchases, withdrawals, deposits)
- Edge Cases & Error Handling
- Messages Management (CRUD operations)
- Categories and Transactions endpoints
- Summary & Statistics endpoints

**Features**:
- Organized into logical folders
- Includes test assertions for validation
- Supports multiple CLIQ message formats
- Covers error scenarios and edge cases

### 2. CLIQ_Complete_Test_Suite.postman_collection.json
**Purpose**: Automated test suite for CI/CD integration
**Contents**:
- Setup & Authentication with health checks
- Automated CLIQ SMS parsing tests with assertions
- Bank transaction parsing validation
- Error handling verification
- Data verification to ensure persistence

**Features**:
- Pre-request scripts for dynamic data
- Comprehensive test assertions
- Global error handling
- Environment variable management
- Suitable for Collection Runner

### 3. CLIQ_Expense_Tracker_API.postman_collection.json
**Purpose**: Original comprehensive API collection (maintained for compatibility)
**Status**: Legacy - use Enhanced version for new testing

## Environments

### 1. CLIQ_Expense_Tracker_Local.postman_environment.json
**Purpose**: Local development environment
**Configuration**:
- baseUrl: `http://192.168.15.249:3000`
- Test credentials for local testing
- Environment-specific variables

### 2. CLIQ_Expense_Tracker_Production.postman_environment.json
**Purpose**: Production environment testing
**Configuration**:
- baseUrl: `https://expense-tracker-q432.onrender.com`
- Production-safe test credentials
- Production-specific variables

### 3. CLIQ_Testing.postman_environment.json
**Purpose**: Specialized testing environment with sample data
**Configuration**:
- Extended test data variables
- Sample CLIQ message templates
- Dynamic timestamp generation
- Test-specific configurations

## Quick Start Guide

### For Manual Testing:
1. Import `CLIQ_Expense_Tracker_Enhanced.postman_collection.json`
2. Import `CLIQ_Testing.postman_environment.json`
3. Set the environment to CLIQ Testing
4. Run authentication requests first
5. Test various SMS parsing scenarios

### For Automated Testing:
1. Import `CLIQ_Complete_Test_Suite.postman_collection.json`
2. Import appropriate environment file
3. Use Collection Runner to execute full suite
4. Review test results and assertions

### Environment Setup:
1. Choose appropriate environment:
   - Local: For development testing
   - Production: For production validation
   - CLIQ Testing: For comprehensive testing with sample data
2. Update baseUrl if your server runs on different host/port
3. Run authentication to populate authToken

## Test Scenarios Covered

### CLIQ SMS Parsing:
- ✅ Standard CLIQ send transactions
- ✅ Standard CLIQ receive transactions
- ✅ Large amount transfers
- ✅ Small amount/micro-transactions
- ✅ Alternative message formats
- ✅ Different date/time formats
- ✅ Various recipient/sender name patterns

### Bank Transactions:
- ✅ Card purchases (retail, online, gas, restaurants)
- ✅ ATM withdrawals
- ✅ Salary deposits
- ✅ Various merchant name formats
- ✅ Different transaction descriptions

### Error Handling:
- ✅ Non-financial SMS messages
- ✅ Missing required fields
- ✅ Empty message content
- ✅ Invalid JSON format
- ✅ Authentication errors

### Data Verification:
- ✅ Message persistence
- ✅ Transaction creation
- ✅ Category assignment
- ✅ Amount extraction accuracy
- ✅ Date parsing correctness

## Test Data Examples

### CLIQ Send Message:
```
Dear Customer, Your CLIQ transaction: JOD 25.00 has been sent to John Doe on 15/06/2024 at 14:30. Reference: CLQ123456789. Available balance: JOD 975.00
```

### CLIQ Receive Message:
```
Dear Customer, You have received JOD 100.00 via CLIQ from Ahmad Ali on 15/06/2024 at 16:45. Reference: CLQ987654321. Available balance: JOD 1075.00
```

### Bank Purchase:
```
Purchase at CARREFOUR AMMAN for JOD 45.50 on 15/06/2024 at 18:20. Card ending 1234. Available balance: JOD 1029.50
```

### ATM Withdrawal:
```
ATM Withdrawal: JOD 200.00 at ABC Bank ATM, City Mall on 16/06/2024 at 12:45. Card ending 5678. Available balance: JOD 2305.50
```

## Best Practices

### Before Testing:
1. Ensure backend server is running
2. Verify database connectivity
3. Check environment variables are correct
4. Run health check endpoint

### During Testing:
1. Always authenticate first
2. Use Collection Runner for batch testing
3. Monitor response times
4. Check test assertions
5. Verify data persistence

### After Testing:
1. Clean up test data if needed
2. Document any failures
3. Update test cases for new scenarios
4. Export results for reporting

## CI/CD Integration

The `CLIQ_Complete_Test_Suite.postman_collection.json` is designed for automated testing:

```bash
# Using Newman CLI
newman run CLIQ_Complete_Test_Suite.postman_collection.json \
  -e CLIQ_Testing.postman_environment.json \
  --reporters cli,json \
  --reporter-json-export results.json
```

## Troubleshooting

### Common Issues:
1. **Authentication Failures**: Ensure login request completes successfully
2. **Connection Errors**: Verify baseUrl and server status
3. **Parsing Failures**: Check message format against expected patterns
4. **Test Failures**: Review assertion logic and expected responses

### Debug Steps:
1. Check Postman Console for detailed logs
2. Verify environment variables are set
3. Test individual requests before running suite
4. Check server logs for parsing errors

## Contributing

When adding new test scenarios:
1. Add to appropriate folder in Enhanced collection
2. Include proper test assertions
3. Add sample data to Testing environment
4. Update this documentation
5. Test with Collection Runner

## Related Documentation

- `docs/CLIQ_TESTING_GUIDE.md` - Detailed testing instructions
- `docs/API_CONFIG.md` - API configuration guide
- Backend API documentation
- SMS parsing pattern documentation
