import requests

class GetData:

    '''Connects to the swagger API and pulls the data'''
    def __init__(self):
        
        print ("Requesting APIs from swagger") 
        r_all = requests.get('https://azure.microsoft.com/api/v3/pricing/virtual-machines/calculator')

        print ('Checking call status from APIs')
        if (str(r_all) == "<Response [200]>"):
            print ('Successful API call') 
        else:
            print ('Unsuccessful API call') 
       
        
        print('Converting requests to JSON')
        
        self.d_all = r_all.json()['offers']
        
        print('Successful conversion to JSON')

    
    def filterVmSize(self, size):
        '''Pass in the VM name in string to return the VM Size name'''
        vm_name = size.split('-')
        vm_length = len(vm_name)

        if (vm_length == 3):
            return (''.join(vm_name[1]))
        if (vm_length == 5):
            return (''.join(vm_name[1:4]))
        if (vm_length == 4):
            return (''.join(vm_name[1:3])) 

    def filterVmOs(slef, size):
        '''Pass in the VM name in string to return the VM OS. Windows means regular price Linux means Ahub'''
        return size.split('-')[0]
    
    def filterVmTier(self, size):
        '''Pass in the VM name in string to return the VM Tier'''
        return size.split('-')[-1]

    def mapDevVM(self, core, ram, price_region):
        core_ram_vms = []
        core_list = []
        min_core_list = []
        ram_list =[]
        min_ram_list = []
        disk_list = []
        
        final_vm_list =[]
        lowest_price =[]
        
        for d in self.d_all:   
            if (('linux' in d) and 'standard' in d and 'server' not in d and 'sap' not in d):
                if ('perhour' in self.d_all[d]['prices'].keys()):
                    if (price_region in self.d_all[d]['prices']['perhour'].keys()):
                        if (self.d_all[d]['cores']>= (core*0.85) and self.d_all[d]['ram']>=(ram*0.65)):
                            core_ram_vms.append(d)
                            core_list.append(self.d_all[d]['cores'])
        for vm in core_ram_vms:
            if (self.d_all[vm]['cores'] == min (core_list)):
                min_core_list.append(vm)
                ram_list.append(self.d_all[vm]['ram'])
         
        for vm in min_core_list:
            if (self.d_all[vm]['ram'] == min (ram_list)):
                min_ram_list.append(vm)
                disk_list.append(self.d_all[vm]['diskSize'])
        
        for vm in min_ram_list:
            if (self.d_all[vm]['diskSize'] == min (disk_list)):
                final_vm_list.append (vm)
                lowest_price.append(self.d_all[vm]['prices']['perhour'][price_region]['value'])
                
        for vm in final_vm_list:
            if (self.d_all[vm]['prices']['perhour'][price_region]['value'] == min (lowest_price)):
                return self.filterVmSize(vm), self.d_all[vm]['prices']['perhour'][price_region]['value']
            

    def mapProdVM(self, core, ram, price_region):
        core_ram_vms = []
        core_list = []
        min_core_list = []
        ram_list =[]
        min_ram_list = []
        disk_list = []
        
        final_vm_list =[]
        lowest_price =[]
        
        for d in self.d_all:   
            if (('linux' in d) and 'standard' in d and 'server' not in d and 'sap' not in d):
                if ('perhouroneyearreserved' in self.d_all[d]['prices'].keys()):
                    if (price_region in self.d_all[d]['prices']['perhouroneyearreserved'].keys()):
                        if (self.d_all[d]['cores']>= (core*0.85) and self.d_all[d]['ram']>=(ram*0.65)):
                            core_ram_vms.append(d)
                            core_list.append(self.d_all[d]['cores'])
        for vm in core_ram_vms:
            if (self.d_all[vm]['cores'] == min (core_list)):
                min_core_list.append(vm)
                ram_list.append(self.d_all[vm]['ram'])
         
        for vm in min_core_list:
            if (self.d_all[vm]['ram'] == min (ram_list)):
                min_ram_list.append(vm)
                disk_list.append(self.d_all[vm]['diskSize'])
        
        for vm in min_ram_list:
            if (self.d_all[vm]['diskSize'] == min (disk_list)):
                final_vm_list.append (vm)
                lowest_price.append(self.d_all[vm]['prices']['perhouroneyearreserved'][price_region]['value'])
                
        for vm in final_vm_list:
            if (self.d_all[vm]['prices']['perhouroneyearreserved'][price_region]['value'] == min (lowest_price)):
                return self.filterVmSize(vm), self.d_all[vm]['prices']['perhouroneyearreserved'][price_region]['value']*730

