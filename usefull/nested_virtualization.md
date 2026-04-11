# Enable Nested Virtualization on Hyper-V

## Overview

When running a development VM on Hyper-V, features like **Virtual Machine Platform**, **WSL2**, **Docker**, or **Android emulators** inside the guest require **nested virtualization** — the ability to run a hypervisor inside a VM. This must be enabled on the **host machine**.

---

## Prerequisites

- **Host OS:** Windows 10 Pro or later with Hyper-V enabled
- **VM must be powered off** before enabling this setting
- You need **Administrator access** on the host

---

## Steps (Run on the Host Machine)

All commands below are run in **PowerShell as Administrator** on the **host** (physical machine), not inside the VM.

### Step 1 — List your VMs

```powershell
Get-VM
```

Note the exact **Name** of the VM you want to enable nested virtualization for.

### Step 2 — Shut down the VM

```powershell
Stop-VM -Name "WIN10Pro"
```

Or shut down gracefully from inside the guest OS. The VM must be fully **Off** (not saved or paused).

### Step 3 — Enable nested virtualization

```powershell
Set-VMProcessor -VMName "WIN10Pro" -ExposeVirtualizationExtensions $true
```

### Step 4 — Verify the setting

```powershell
Get-VMProcessor -VMName "WIN10Pro" | Select-Object ExposeVirtualizationExtensions
```

Expected output:

```
ExposeVirtualizationExtensions
------------------------------
                          True
```

### Step 5 — Start the VM

```powershell
Start-VM -Name "WIN10Pro"
```

### Step 6 — Verify inside the guest VM

Once logged into the VM, open PowerShell and run:

```powershell
systeminfo
```

The **Hyper-V Requirements** section should now indicate virtualization is available. You can then enable Windows features like "Virtual Machine Platform" or "Windows Subsystem for Linux" from **Turn Windows features on or off**.

---

## To Disable (If Needed)

```powershell
Stop-VM -Name "WIN10Pro"
Set-VMProcessor -VMName "WIN10Pro" -ExposeVirtualizationExtensions $false
Start-VM -Name "WIN10Pro"
```

---

## Risks & Considerations

### Performance Impact
- **CPU overhead:** Nested virtualization adds an extra layer of hypervisor translation. CPU-intensive workloads inside the nested VM can run noticeably slower (10–30% depending on the workload).
- **Memory pressure:** Each nested VM reserves memory from the guest, which already has a fixed allocation from the host. Overcommitting memory can cause paging and severe slowdowns.
- **Disk I/O:** Storage operations go through multiple virtualization layers, increasing latency. Avoid running database-heavy workloads in a nested setup.

### Stability Risks
- **Increased crash surface:** Running a hypervisor inside a hypervisor adds complexity. Blue screens (BSODs) or VM freezes are more likely under heavy load than in a single-layer setup.
- **Checkpoint/snapshot limitations:** Checkpoints may behave unpredictably when nested VMs are running inside the guest. Always shut down nested VMs before taking a checkpoint of the parent VM.
- **Live migration not supported:** VMs with nested virtualization enabled cannot be live-migrated between Hyper-V hosts.

### Security Considerations
- **Expanded attack surface:** Exposing virtualization extensions to the guest gives code inside the VM access to hardware-level virtualization instructions. A compromised guest could theoretically attempt hypervisor-level exploits.
- **VM escape risk (low but present):** While rare, nested virtualization adds another boundary that could be targeted. Keep both the host and guest OS fully patched.
- **Isolation is only as strong as the outer hypervisor:** If the host Hyper-V layer is compromised, all nested VMs are exposed.

### Compatibility
- **Not all processors support it well:** Older CPUs may lack required features or have poor nested performance. Intel Haswell (4th gen) and later, or AMD Ryzen, are recommended.
- **Dynamic Memory conflicts:** Hyper-V Dynamic Memory may not work reliably with nested virtualization. Consider using static memory allocation for the guest VM.
- **MAC address spoofing:** If your nested VMs need network access, you may need to enable MAC address spoofing on the guest's virtual network adapter:
  ```powershell
  Set-VMNetworkAdapter -VMName "WIN10Pro" -MacAddressSpoofing On
  ```

### When to Avoid Nested Virtualization
- Production workloads with strict performance or uptime SLAs
- Scenarios requiring live migration or high availability
- Systems with limited RAM (< 16 GB on the host)
- When a single-layer VM or container (e.g., Docker without Hyper-V backend) can accomplish the same goal

---

## Notes

- Replace `"WIN10Pro"` with your actual VM name if different.
- Nested virtualization can have a slight performance overhead — this is normal.
- The VM **must be off** (not saved/paused) to change this setting.
- If `systeminfo` inside the guest still shows "A hypervisor has been detected...", the feature is working — that message is expected when Hyper-V components are active in the guest.