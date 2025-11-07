# List of purchase records, each as a dictionary
purchases = [
    {"user_id": 101, "amount": 20.5, "category": "Books"},
    {"user_id": 101, "amount": 35.0, "category": "Books"},
    {"user_id": 202, "amount": 100.0, "category": "Electronics"},
    {"user_id": 101, "amount": 12.0, "category": "Toys"},
    {"user_id": 202, "amount": 20.0, "category": "Electronics"},
]

# Dictionary to store aggregated amounts by user and category
dic = {}

# Loop through each purchase record
for i in range(len(purchases)):
    usr = purchases[i]['user_id']      # Extract user ID
    cat = purchases[i]['category']     # Extract category
    amt = purchases[i]['amount']       # Extract amount

    # If user not in dictionary, add user with empty category dictionary
    if usr not in dic: 
        dic[usr] = {}
    # If category not in user's dictionary, initialize amount to 0
    if cat not in dic[usr]:
        dic[usr][cat] = 0
    
    # Add amount to the user's category total
    dic[usr][cat] += amt

# Print the aggregated dictionary
print(dic)
