#This class is to help pull specific info regarding the VM with methods
class VmInfo:
    def __init__(self, VM):
        self.vm = VM
    
    def getName(self):
        print ('VM name')

    def getTier(self):
        print ('Tier')
    
    def getSize(self):
        print ('Size')

    def getOS(self):
        print ('OS name')
    
    def getVmSize(self):
        print ('VM Size')