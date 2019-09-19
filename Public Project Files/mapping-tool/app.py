from GetData import GetData #another tool that will import and clean API data to do the mapping
import pandas as pd

map_tool = GetData()

df_dev = pd.read_excel("inv_dev.xlsx")
df_prod = pd.read_excel("inv_prod.xlsx")

#Inventory should contain the following columns ['Device Name', 'Core Count','Total RAM (GB)']

region_price = 'Pricing-region-slug' #only change this line in order to get the correct price for region
customer_name = 'Customer Name' #add the tool for the current customer
dev_vm_size = []
prod_vm_size = []
paygo_ahub_ph = []
ri1y_ahub_pm = []


for index , row in df_dev.iterrows():
    dev_size , paygo_ahub = map_tool.mapDevVM(row['Core Count'], row['Total RAM (GB)'], region_price)
    dev_vm_size.append(dev_size)
    paygo_ahub_ph.append(paygo_ahub)
  
for index , row in df_prod.iterrows():

    prod_size , ri1y_ahub = map_tool.mapProdVM(row['Core Count'], row['Total RAM (GB)'], region_price)
    prod_vm_size.append(prod_size)
    ri1y_ahub_pm.append(ri1y_ahub)

print ('Mapping SUCCESSFULL !!!!!')

df_dev['Azure VM Size'] = dev_vm_size
df_dev['PAYGO+AHUB per hr'] = paygo_ahub_ph

df_prod['Azure VM Size'] = prod_vm_size
df_prod['R1Y+AHUB per Month'] = ri1y_ahub_pm

# Print the region price name and customer name to the output
df_dev.to_excel(f'Dev_Pricing_Output_{customer_name}_{region_price}.xlsx')
df_prod.to_excel(f'Prod_Pricing_Output_{customer_name}_{region_price}.xlsx')