# CLIQ SMS Parsing Test Guide

This document provides guidance on testing the CLIQ SMS parsing functionality using the Postman collection.

## Getting Started

1. **Import the Collection**
   - Import `CLIQ_Expense_Tracker_Enhanced.postman_collection.json`
   - Import one of the environment files:
     - `CLIQ_Expense_Tracker_Local.postman_environment.json` for local testing
     - `CLIQ_Expense_Tracker_Production.postman_environment.json` for production testing

2. **Set Up Authentication**
   - First, run the "Register User" request to create a test account
   - Then run the "Login User" request - this will automatically save the auth token
   - All subsequent requests will use this token automatically

## Test Categories

### 1. CLIQ SMS Parsing
Tests various CLIQ transfer message formats:
- **CLIQ Send - Standard Format**: Tests outgoing CLIQ payments
- **CLIQ Receive - Standard Format**: Tests incoming CLIQ payments  
- **CLIQ Send - Large Amount**: Tests high-value transactions
- **CLIQ Receive - Small Amount**: Tests micro-transactions
- **CLIQ Alternative Formats**: Tests different SMS message structures

### 2. Bank Transaction Parsing  
Tests other bank transaction types:
- **Card Purchases**: Mall, online, gas station, restaurant purchases
- **ATM Withdrawals**: Cash withdrawals from ATMs
- **Salary Deposits**: Income from employers
- **Various Merchants**: Different merchant name formats

### 3. Edge Cases & Error Handling
Tests error conditions and edge cases:
- **Invalid Messages**: Non-financial SMS messages
- **Missing Data**: Messages with missing content or timestamps
- **Empty Messages**: Completely empty message content
- **Malformed Requests**: Invalid JSON structure

### 4. Messages Management
Tests CRUD operations:
- **Get All Messages**: Retrieve all parsed messages
- **Pagination**: Test message listing with pagination
- **Get by ID**: Retrieve specific messages

## Expected Behaviors

### Successful CLIQ Parsing
For valid CLIQ messages, expect:
```json
{
  "id": 123,
  "content": "Original SMS content",
  "amount": 25.00,
  "type": "EXPENSE" | "INCOME",
  "description": "Parsed description",
  "date": "2024-06-15T14:30:00Z",
  "isFinancial": true,
  "parsedData": {
    "merchant": "John Doe",
    "reference": "CLQ123456789",
    "balance": "975.00"
  }
}
```

### Non-Financial Messages
For non-financial SMS messages, expect:
```json
{
  "id": 124,
  "content": "Original SMS content",
  "isFinancial": false,
  "message": "Message saved but not parsed as financial transaction"
}
```

### Error Cases
For invalid requests, expect appropriate HTTP status codes:
- `400 Bad Request`: Missing required fields
- `401 Unauthorized`: Invalid or missing auth token
- `422 Unprocessable Entity`: Invalid data format

## Testing Workflow

1. **Authentication Setup**
   ```
   1. Register User
   2. Login User (saves token automatically)
   3. Get User Profile (verify token works)
   ```

2. **Basic CLIQ Testing**
   ```
   1. Parse CLIQ Send - Standard Format
   2. Parse CLIQ Receive - Standard Format
   3. Verify responses contain expected fields
   ```

3. **Comprehensive Parsing Tests**
   ```
   1. Run all CLIQ SMS Parsing requests
   2. Run all Bank Transaction Parsing requests
   3. Verify different message formats are handled
   ```

4. **Edge Case Testing**
   ```
   1. Test invalid/non-financial messages
   2. Test missing content scenarios
   3. Test empty messages
   4. Verify appropriate error handling
   ```

5. **Data Verification**
   ```
   1. Get All Messages to verify parsed data was saved
   2. Check transaction creation via Transaction endpoints
   3. Verify category assignment and summaries
   ```

## Test Data Variations

The collection includes diverse test scenarios:

### CLIQ Message Variations
- Different amount formats (25.00, 500.00, 5.50)
- Various recipient/sender names (Arabic and English)
- Different date/time formats
- Multiple reference number patterns
- Various balance reporting formats

### Bank Transaction Types
- Retail purchases (Carrefour, Amazon)
- Service purchases (Gas stations, restaurants)
- ATM withdrawals
- Salary/income deposits
- Online vs. physical transactions

### Merchant Name Patterns
- ALL CAPS (CARREFOUR AMMAN)
- Mixed case (McDonalds Amman)
- Domain names (AMAZON.COM)
- Service names (TOTAL STATION)

## Automation Tips

1. **Collection Runner**: Use Postman's Collection Runner to execute all tests
2. **Environment Switching**: Switch between Local and Production environments
3. **Continuous Testing**: Set up monitors for regular API health checks
4. **Data Cleanup**: Include requests to clean up test data if needed

## Common Issues & Solutions

1. **Authentication Errors**
   - Ensure Login request ran successfully
   - Check that authToken is set in environment
   - Verify baseUrl is correct for your environment

2. **Parsing Failures**
   - Check message format matches expected patterns
   - Verify amount extraction regex patterns
   - Ensure date parsing handles your locale

3. **Missing Categories**
   - Run category creation requests first
   - Verify default categories exist
   - Check category assignment logic

## Performance Testing

For load testing:
1. Use Collection Runner with multiple iterations
2. Test concurrent SMS parsing requests
3. Monitor response times and error rates
4. Verify database performance with high message volumes

This comprehensive test suite ensures the CLIQ SMS parsing functionality works reliably across various message formats and edge cases.
