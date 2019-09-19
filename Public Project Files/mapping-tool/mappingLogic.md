# Business Logic
# Input
    # Select Customer Region
    # Import .csv with Customer Inventory

# Logic
    # FOR EACH
        # Customer VM in Customer Inventory
            # IF
                # Customer VM Cores match Azure VM Cores
                # Customer VM RAM matches Azure VM RAM
                # Azure VM Disk Size is greater than or equal to Customer VM Min Disk Size
                # Azure VM Name contains "windows"
            # THEN
                # Select the Azure VM(s) with the lowest Disk Size value(s)
                # Select the Azure VM(s) with the lowest pricing in the Customer Region.
            # VALIDATE
                # Is there only one Azure VM remaining?
                    # NO
                        # ???
                    # YES
                        # PREPARE FOR OUTPUT
                            # Get Customer VM Name
                            # Get Azure VM
                            # Get Azure VM Price per Month
                                # Get Azure VM Price per Hour
                                    # Get Customer Region from Input
                                    # Customer Region matches appropriate column for Region Price per Hour
                                        # Get Region Price per Hour value for Azure VM Name
                                # Multiply Azure VM Price per Hour by Hours per Month
                                # Define as Azure VM Price per Month
                        

# Output
    # Export .csv with customer VMs mapped to Azure VMs
        # Output CSV
            # Customer VM Name
            # Azure VM Name
            # Azure Price per Month