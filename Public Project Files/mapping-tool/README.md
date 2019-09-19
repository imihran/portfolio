# Introduction 
This tool is designed to take server inventory as an input CSV or excel file type and use the azure resource API to find the right virtual machine in order to find the respective pricing.

# Relevant Links

**[Azure documentation](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes)**

**[Resource API](https://docs.microsoft.com/en-us/rest/api/compute/resourceskus/list#code-try-0)**

**Swagger API for different pricing options**
* [PAYGO](https://azure.microsoft.com/api/v2/pricing/virtual-machines-base/calculator)
* [RI1Y](https://azure.microsoft.com/api/v2/pricing/virtual-machines-base-one-year/calculator)
* [RI3Y](https://azure.microsoft.com/api/v2/pricing/virtual-machines-base-three-year/calculator)

* [PAYGO_AHUB](https://azure.microsoft.com/api/v2/pricing/virtual-machines-ahb/calculator)
* [RI1Y_AHUB](https://azure.microsoft.com/api/v2/pricing/virtual-machines-ahb-one-year/calculator)
* [RI3Y_AHUB](https://azure.microsoft.com/api/v2/pricing/virtual-machines-ahb-three-year/calculator)


# Getting Started
TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:
1.	Installation process
    * Currently the tool does not need installation. All the files that are in the repo have to be in the same folder when tool is run.
    * The inventory input should also be in the same folder. 
    * The output pricing will be exported into an excel file in the same folder.
2.	Software dependencies
    * This hap has several module dependencies all of those modules are imported at the beginning  of each file.
3.	Latest releases
    * currently the app is in development and there are no releases
4.	API references
    * Tool is connecting to 2 APIs
        * Azure Resource API - for VM names and configurations
        * Swagger API - for VM pricing

# Build and Test
This section is pending until the app is ready...

TODO: Describe and show how to build your code and run the tests. 
NEW LINE!!!

# Contribute
To improve the tool:
* Mapping business logic need to be refined
* Support for VM sizing is needed. How do you determine how to right size the VMs ? 

If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:
- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)